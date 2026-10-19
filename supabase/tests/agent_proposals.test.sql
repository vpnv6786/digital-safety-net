-- Agents propose; only moderators decide, through the logged functions.
begin;

insert into auth.users (id, phone) values
  ('00000000-0000-0000-0000-0000000000b1', '+84900000201'),
  ('00000000-0000-0000-0000-0000000000b2', '+84900000202'),
  ('00000000-0000-0000-0000-0000000000bd', '+84900000299');
insert into public.user_roles (user_id, role) values ('00000000-0000-0000-0000-0000000000bd', 'moderator');

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000b1';
select public.submit_report('url', 'vcb-hotro.top', 'bank_phishing', 'Trang gia Vietcombank doi dang nhap va OTP') is not null;
reset role;

-- The agent writes through the service role.
set local role service_role;
insert into public.agent_proposals (agent, kind, target_id, confidence, rationale)
select 'triage', 'verify_report', id, 0.9, 'Lookalike bank domain, evidence matches phishing script'
from public.reports where reporter_user_id = '00000000-0000-0000-0000-0000000000b1';
insert into public.agent_proposals (agent, kind, confidence, rationale, payload)
values ('content', 'draft_alert', 0.7, 'Rising fake VNeID app reports this week',
  '{"title": "Cảnh giác app VNeID giả", "description": "Kẻ gian gọi điện xưng công an phường, gửi link cài app VNeID giả để chiếm quyền điện thoại.", "severity": "high"}');
do $$
begin
  assert (select count(*) from public.report_summary(7)) >= 1, 'summary available to the service role';
end $$;
reset role;

-- Ordinary users cannot see or create proposals, or read summaries.
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000b2';
do $$
begin
  assert (select count(*) from public.agent_proposals) = 0, 'users cannot read proposals';
end $$;
do $$
begin
  insert into public.agent_proposals (agent, kind, rationale) values ('me', 'verify_report', 'trust me');
  raise exception 'user created a proposal';
exception when insufficient_privilege then null;
end $$;
do $$
begin
  perform public.report_summary(7);
  raise exception 'user read the summary';
exception when insufficient_privilege then null;
end $$;
do $$
begin
  perform public.decide_proposal((select id from public.agent_proposals limit 1), 'accepted');
  raise exception 'user decided a proposal';
exception when insufficient_privilege then null;
end $$;

-- The moderator accepts: the report is verified through the logged path.
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000bd';
do $$
declare r jsonb;
begin
  assert (select count(*) from public.agent_proposals where status = 'pending') = 2, 'moderator sees proposals';
  perform public.decide_proposal((select id from public.agent_proposals where kind = 'verify_report'), 'accepted', 'checked the page');
  r := public.lookup_entity('url', 'vcb-hotro.top');
  assert (r ->> 'verified_reports')::int = 1, 'accepted proposal verified the report';
  assert exists (select 1 from public.moderation_log where action = 'verify_report' and note like '%agent triage%'), 'log names the agent';

  perform public.decide_proposal((select id from public.agent_proposals where kind = 'draft_alert'), 'accepted', null);
  assert exists (select 1 from public.community_alerts where source_type = 'agent_draft' and not is_verified), 'draft became an unpublished alert';
end $$;
do $$
begin
  perform public.decide_proposal((select id from public.agent_proposals where kind = 'draft_alert'), 'dismissed');
  raise exception 'decided twice';
exception when invalid_parameter_value then null;
end $$;
reset role;

set local request.jwt.claim.sub = '';
set local role anon;
do $$
begin
  assert not exists (select 1 from public.community_alerts where source_type = 'agent_draft'), 'drafts are not public until published';
end $$;
reset role;

rollback;
