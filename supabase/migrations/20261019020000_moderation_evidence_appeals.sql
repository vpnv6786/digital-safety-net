-- Moderation with an audit trail, screenshot evidence for reports, and appeals
-- for owners of wrongly reported numbers or sites.
--
--  * Moderators act only through moderate_report / moderate_alert / resolve_appeal,
--    which write an append-only moderation_log. Direct UPDATE policies are removed.
--  * A moderator cannot rule on their own report or appeal.
--  * Evidence images live in the private "evidence" bucket under <user id>/.
--  * Accepting an appeal rejects every open report about that entity.

-- ---------------------------------------------------------------------------
-- Shared normalisation for the write paths (same rules as the web core).
-- ---------------------------------------------------------------------------
create or replace function private.normalize_entity(p_kind text, p_value text, out key text, out shown text)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  digits text;
begin
  case p_kind
    when 'phone' then
      key := public.normalize_phone_vn(p_value);
      shown := key;
    when 'url' then
      key := lower(trim(p_value));
      if (key !~ '^[a-z0-9.-]+\.[a-z0-9-]{2,63}(/[^\s]*)?$' and key !~ '^[0-9]{1,3}(\.[0-9]{1,3}){3}$')
         or length(key) > 255 then
        key := null;
      end if;
      shown := key;
    when 'email' then
      key := lower(trim(p_value));
      if key !~ '^[^\s@]+@([a-z0-9-]+\.)+[a-z]{2,}$' then
        key := null;
      end if;
      shown := key;
    when 'bank_account' then
      digits := regexp_replace(coalesce(p_value, ''), '[\s.-]', '', 'g');
      if digits ~ '^[0-9]{6,19}$' then
        key := private.hash_bank_account(digits);
        shown := '••••' || right(digits, 4);
      end if;
    else
      raise exception 'invalid_kind' using errcode = '22023';
  end case;
  if key is null then
    raise exception 'invalid_value' using errcode = '22023';
  end if;
end;
$$;
revoke execute on function private.normalize_entity(text, text) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Audit log
-- ---------------------------------------------------------------------------
create table if not exists public.moderation_log (
  id bigint generated always as identity primary key,
  actor uuid not null references auth.users,
  action text not null check (action in (
    'verify_report', 'reject_report', 'verify_alert', 'hide_alert', 'accept_appeal', 'reject_appeal'
  )),
  target_id uuid not null,
  note text,
  created_at timestamptz not null default now()
);
alter table public.moderation_log enable row level security;
drop policy if exists "Moderators can read the log" on public.moderation_log;
create policy "Moderators can read the log"
  on public.moderation_log for select to authenticated
  using (public.has_role(auth.uid(), 'moderator'));

-- ---------------------------------------------------------------------------
-- Evidence bucket
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('evidence', 'evidence', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "Users upload evidence to their own folder" on storage.objects;
drop policy if exists "Owners and moderators read evidence" on storage.objects;
drop policy if exists "Users delete their own evidence" on storage.objects;
create policy "Users upload evidence to their own folder"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'evidence' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Owners and moderators read evidence"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'evidence'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.has_role(auth.uid(), 'moderator'))
  );
create policy "Users delete their own evidence"
  on storage.objects for delete to authenticated
  using (bucket_id = 'evidence' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------------------------------------------------------------------------
-- submit_report: now with up to three evidence images.
-- ---------------------------------------------------------------------------
drop function if exists public.submit_report(text, text, text, text, text);
create or replace function public.submit_report(
  p_kind text,
  p_value text,
  p_category text,
  p_description text,
  p_bank_code text default null,
  p_evidence text[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  norm record;
  target uuid;
  report_id uuid;
  path text;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_category not in (
    'impersonate_authority', 'fake_app_apk', 'remote_control', 'bank_phishing', 'job_task', 'investment',
    'prize', 'delivery', 'loan_fee', 'recovery_scam', 'brand_impersonation', 'other'
  ) then
    raise exception 'invalid_category' using errcode = '22023';
  end if;
  if p_description is null or length(trim(p_description)) < 10 or length(p_description) > 2000 then
    raise exception 'invalid_description' using errcode = '22023';
  end if;
  if coalesce(array_length(p_evidence, 1), 0) > 3 then
    raise exception 'invalid_evidence' using errcode = '22023';
  end if;
  foreach path in array coalesce(p_evidence, '{}') loop
    if path !~ ('^' || uid::text || '/[A-Za-z0-9._-]{1,80}$') then
      raise exception 'invalid_evidence' using errcode = '22023';
    end if;
  end loop;
  if (select count(*) from public.reports where reporter_user_id = uid and created_at > now() - interval '1 day') >= 10 then
    raise exception 'rate_limited' using errcode = '54000';
  end if;

  select * into norm from private.normalize_entity(p_kind, p_value);

  select id into target
  from public.entities
  where entity_type = p_kind and normalized_value = norm.key
  order by legacy, created_at
  limit 1;

  if target is null then
    insert into public.entities (entity_value, entity_type, normalized_value, display_value, bank_code)
    values (norm.key, p_kind, norm.key, norm.shown, case when p_kind = 'bank_account' then upper(left(p_bank_code, 10)) end)
    on conflict (entity_value, entity_type) do update set normalized_value = excluded.normalized_value
    returning id into target;
  end if;

  if exists (select 1 from public.reports where reporter_user_id = uid and entity_id = target) then
    raise exception 'already_reported' using errcode = '23505';
  end if;

  insert into public.reports (reporter_user_id, entity_id, scam_category, description, status, evidence_urls)
  values (uid, target, p_category, trim(p_description), 'pending', coalesce(p_evidence, '{}'))
  returning id into report_id;
  return report_id;
end;
$$;
revoke execute on function public.submit_report(text, text, text, text, text, text[]) from public, anon;
grant execute on function public.submit_report(text, text, text, text, text, text[]) to authenticated;

-- ---------------------------------------------------------------------------
-- Moderating reports and alerts
-- ---------------------------------------------------------------------------
drop policy if exists "Moderators can update reports" on public.reports;
drop policy if exists "Moderators can update alerts" on public.community_alerts;

create or replace function public.moderate_report(p_report_id uuid, p_decision text, p_note text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  reporter uuid;
begin
  if not public.has_role(uid, 'moderator') then
    raise exception 'not_moderator' using errcode = '42501';
  end if;
  if p_decision not in ('verified', 'rejected') then
    raise exception 'invalid_decision' using errcode = '22023';
  end if;
  select reporter_user_id into reporter from public.reports where id = p_report_id for update;
  if not found then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  if reporter = uid then
    raise exception 'own_report' using errcode = '42501';
  end if;

  update public.reports
  set status = p_decision,
      verified_by_moderator_id = case when p_decision = 'verified' then uid end
  where id = p_report_id;

  insert into public.moderation_log (actor, action, target_id, note)
  values (uid, case when p_decision = 'verified' then 'verify_report' else 'reject_report' end, p_report_id, left(p_note, 1000));
end;
$$;
revoke execute on function public.moderate_report(uuid, text, text) from public, anon;
grant execute on function public.moderate_report(uuid, text, text) to authenticated;

create or replace function public.moderate_alert(p_alert_id uuid, p_decision text, p_note text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  author uuid;
begin
  if not public.has_role(uid, 'moderator') then
    raise exception 'not_moderator' using errcode = '42501';
  end if;
  if p_decision not in ('verify', 'hide') then
    raise exception 'invalid_decision' using errcode = '22023';
  end if;
  select reporter_user_id into author from public.community_alerts where id = p_alert_id for update;
  if not found then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  if author = uid then
    raise exception 'own_alert' using errcode = '42501';
  end if;

  update public.community_alerts
  set is_verified = (p_decision = 'verify'),
      verified_by = case when p_decision = 'verify' then uid end,
      expires_at = case when p_decision = 'hide' then now() else expires_at end,
      updated_at = now()
  where id = p_alert_id;

  insert into public.moderation_log (actor, action, target_id, note)
  values (uid, case when p_decision = 'verify' then 'verify_alert' else 'hide_alert' end, p_alert_id, left(p_note, 1000));
end;
$$;
revoke execute on function public.moderate_alert(uuid, text, text) from public, anon;
grant execute on function public.moderate_alert(uuid, text, text) to authenticated;

-- Hidden alerts stay hidden from the public.
drop policy if exists "Anyone can view verified alerts" on public.community_alerts;
create policy "Anyone can view verified alerts"
  on public.community_alerts for select
  using (
    (is_verified = true and (expires_at is null or expires_at > now()))
    or reporter_user_id = auth.uid()
    or public.has_role(auth.uid(), 'moderator')
  );

-- ---------------------------------------------------------------------------
-- Appeals
-- ---------------------------------------------------------------------------
create table if not exists public.appeals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  entity_type text not null check (entity_type in ('phone', 'url', 'bank_account', 'email')),
  normalized_value text not null,
  display_value text,
  reason text not null,
  contact text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  resolved_by uuid references auth.users,
  resolved_at timestamptz,
  resolution_note text,
  created_at timestamptz not null default now()
);
create index if not exists idx_appeals_entity on public.appeals (entity_type, normalized_value);
alter table public.appeals enable row level security;

drop policy if exists "Users see their own appeals" on public.appeals;
drop policy if exists "Moderators see appeals" on public.appeals;
create policy "Users see their own appeals"
  on public.appeals for select to authenticated
  using (user_id = auth.uid());
create policy "Moderators see appeals"
  on public.appeals for select to authenticated
  using (public.has_role(auth.uid(), 'moderator'));

create or replace function public.submit_appeal(p_kind text, p_value text, p_reason text, p_contact text default null)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  norm record;
  appeal_id uuid;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_reason is null or length(trim(p_reason)) < 20 or length(p_reason) > 2000 then
    raise exception 'invalid_reason' using errcode = '22023';
  end if;
  if (select count(*) from public.appeals where user_id = uid and created_at > now() - interval '1 day') >= 5 then
    raise exception 'rate_limited' using errcode = '54000';
  end if;

  select * into norm from private.normalize_entity(p_kind, p_value);
  if exists (
    select 1 from public.appeals
    where user_id = uid and entity_type = p_kind and normalized_value = norm.key and status = 'pending'
  ) then
    raise exception 'already_pending' using errcode = '23505';
  end if;

  insert into public.appeals (user_id, entity_type, normalized_value, display_value, reason, contact)
  values (uid, p_kind, norm.key, norm.shown, trim(p_reason), left(trim(p_contact), 200))
  returning id into appeal_id;
  return appeal_id;
end;
$$;
revoke execute on function public.submit_appeal(text, text, text, text) from public, anon;
grant execute on function public.submit_appeal(text, text, text, text) to authenticated;

create or replace function public.resolve_appeal(p_appeal_id uuid, p_decision text, p_note text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  a public.appeals%rowtype;
begin
  if not public.has_role(uid, 'moderator') then
    raise exception 'not_moderator' using errcode = '42501';
  end if;
  if p_decision not in ('accepted', 'rejected') then
    raise exception 'invalid_decision' using errcode = '22023';
  end if;
  select * into a from public.appeals where id = p_appeal_id for update;
  if not found then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  if a.user_id = uid then
    raise exception 'own_appeal' using errcode = '42501';
  end if;
  if a.status <> 'pending' then
    raise exception 'already_resolved' using errcode = '22023';
  end if;

  update public.appeals
  set status = p_decision, resolved_by = uid, resolved_at = now(), resolution_note = left(p_note, 1000)
  where id = p_appeal_id;

  if p_decision = 'accepted' then
    update public.reports r
    set status = 'rejected', verified_by_moderator_id = null
    from public.entities e
    where r.entity_id = e.id
      and e.entity_type = a.entity_type
      and e.normalized_value = a.normalized_value
      and r.status in ('pending', 'verified');
  end if;

  insert into public.moderation_log (actor, action, target_id, note)
  values (uid, case when p_decision = 'accepted' then 'accept_appeal' else 'reject_appeal' end, p_appeal_id, left(p_note, 1000));
end;
$$;
revoke execute on function public.resolve_appeal(uuid, text, text) from public, anon;
grant execute on function public.resolve_appeal(uuid, text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- lookup_entity also says whether the owner has an appeal open.
-- ---------------------------------------------------------------------------
create or replace function public.lookup_entity(p_kind text, p_value text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  key text;
  result jsonb;
begin
  if p_kind not in ('phone', 'url', 'bank_account', 'email') or p_value is null or length(p_value) > 300 then
    raise exception 'invalid_input' using errcode = '22023';
  end if;

  key := case p_kind
    when 'phone' then coalesce(public.normalize_phone_vn(p_value), p_value)
    when 'bank_account' then private.hash_bank_account(regexp_replace(p_value, '[\s.-]', '', 'g'))
    else lower(p_value)
  end;

  select jsonb_build_object(
    'found', count(r.id) > 0,
    'verified_reports', count(r.id) filter (where r.status = 'verified'),
    'unverified_reporters', count(distinct r.reporter_user_id) filter (where r.status = 'pending'),
    'last_verified_at', max(r.updated_at) filter (where r.status = 'verified'),
    'last_report_at', max(r.created_at),
    'categories', coalesce(
      (array_agg(distinct r.scam_category) filter (where r.status = 'verified' and r.scam_category is not null)),
      '{}'::text[]
    ),
    'appeal_pending', exists (
      select 1 from public.appeals ap
      where ap.entity_type = p_kind and ap.normalized_value = key and ap.status = 'pending'
    )
  )
  into result
  from public.entities e
  join public.reports r on r.entity_id = e.id and r.status in ('pending', 'verified')
  where e.entity_type = p_kind and e.normalized_value = key;

  return result;
end;
$$;
