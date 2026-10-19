-- Agents propose, people decide.
-- Operating agents (triage, intel, content) write proposals through the
-- agent-api Edge Function (service role). They never change a report, alert or
-- appeal themselves. A moderator accepts or dismisses each proposal; accepting
-- runs the same logged moderation functions a person would use.

create table if not exists public.agent_proposals (
  id uuid primary key default gen_random_uuid(),
  agent text not null check (length(agent) between 1 and 60),
  kind text not null check (kind in (
    'verify_report', 'reject_report', 'publish_alert', 'hide_alert', 'draft_alert', 'cluster_reports', 'takedown_request'
  )),
  target_id uuid,
  confidence numeric check (confidence >= 0 and confidence <= 1),
  rationale text not null check (length(rationale) between 1 and 2000),
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'dismissed')),
  decided_by uuid references auth.users,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_agent_proposals_status on public.agent_proposals (status, created_at);
create index if not exists idx_agent_proposals_target on public.agent_proposals (target_id);
alter table public.agent_proposals enable row level security;

drop policy if exists "Moderators read proposals" on public.agent_proposals;
create policy "Moderators read proposals"
  on public.agent_proposals for select to authenticated
  using (public.has_role(auth.uid(), 'moderator'));

alter table public.community_alerts drop constraint if exists community_alerts_source_type_check;
alter table public.community_alerts
  add constraint community_alerts_source_type_check
  check (source_type in ('user_report', 'authority', 'community', 'auto_detected', 'agent_draft'));

create or replace function public.decide_proposal(p_proposal_id uuid, p_decision text, p_note text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  p public.agent_proposals%rowtype;
  note text;
begin
  if not public.has_role(uid, 'moderator') then
    raise exception 'not_moderator' using errcode = '42501';
  end if;
  if p_decision not in ('accepted', 'dismissed') then
    raise exception 'invalid_decision' using errcode = '22023';
  end if;
  select * into p from public.agent_proposals where id = p_proposal_id for update;
  if not found then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  if p.status <> 'pending' then
    raise exception 'already_decided' using errcode = '22023';
  end if;

  note := left(coalesce(p_note || ' | ', '') || 'agent ' || p.agent || ' proposal ' || p.id::text, 1000);

  if p_decision = 'accepted' then
    case p.kind
      when 'verify_report' then perform public.moderate_report(p.target_id, 'verified', note);
      when 'reject_report' then perform public.moderate_report(p.target_id, 'rejected', note);
      when 'publish_alert' then perform public.moderate_alert(p.target_id, 'verify', note);
      when 'hide_alert' then perform public.moderate_alert(p.target_id, 'hide', note);
      when 'draft_alert' then
        -- A draft becomes an unpublished alert; publishing it is a second, separate decision.
        if coalesce(length(p.payload ->> 'title'), 0) not between 5 and 120
           or coalesce(length(p.payload ->> 'description'), 0) not between 20 and 2000
           or coalesce(p.payload ->> 'severity', '') not in ('low', 'medium', 'high', 'critical') then
          raise exception 'invalid_draft' using errcode = '22023';
        end if;
        insert into public.community_alerts (title, description, alert_type, severity, source_type, is_verified, tags)
        values (
          p.payload ->> 'title',
          p.payload ->> 'description',
          'scam_warning',
          p.payload ->> 'severity',
          'agent_draft',
          false,
          array['agent:' || p.agent]
        );
      else
        null; -- cluster_reports and takedown_request are advice; accepting records that a person acted on it.
    end case;
  end if;

  update public.agent_proposals
  set status = p_decision, decided_by = uid, decided_at = now()
  where id = p_proposal_id;
end;
$$;
revoke execute on function public.decide_proposal(uuid, text, text) from public, anon;
grant execute on function public.decide_proposal(uuid, text, text) to authenticated;

-- Daily counts for trend-watching agents. Aggregates only.
create or replace function public.report_summary(p_days int default 7)
returns table (day date, scam_category text, status text, reports bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select r.created_at::date, r.scam_category, r.status, count(*)
  from public.reports r
  where r.created_at > now() - make_interval(days => least(greatest(p_days, 1), 90))
  group by 1, 2, 3
  order by 1, 2, 3;
$$;
revoke execute on function public.report_summary(int) from public, anon, authenticated;
grant execute on function public.report_summary(int) to service_role;
