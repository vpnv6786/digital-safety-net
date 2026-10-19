-- Moderation, evidence and appeals. Runs in one rolled-back transaction.
begin;

insert into auth.users (id, phone) values
  ('00000000-0000-0000-0000-0000000000a1', '+84900000101'),
  ('00000000-0000-0000-0000-0000000000a2', '+84900000102'),
  ('00000000-0000-0000-0000-0000000000a3', '+84900000103'),
  ('00000000-0000-0000-0000-0000000000a4', '+84900000104');
insert into public.user_roles (user_id, role) values ('00000000-0000-0000-0000-0000000000a4', 'moderator');

-- Evidence ----------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000a1';
insert into storage.objects (bucket_id, name, owner)
values ('evidence', '00000000-0000-0000-0000-0000000000a1/shot1.jpg', '00000000-0000-0000-0000-0000000000a1');
do $$
begin
  insert into storage.objects (bucket_id, name) values ('evidence', '00000000-0000-0000-0000-0000000000a2/x.jpg');
  raise exception 'uploaded into someone else''s folder';
exception when insufficient_privilege then null;
end $$;
do $$
begin
  assert public.submit_report('phone', '0977 111 222', 'impersonate_authority', 'Goi xung cong an, doi chuyen tien',
    null, array['00000000-0000-0000-0000-0000000000a1/shot1.jpg']) is not null, 'report with evidence';
end $$;
do $$
begin
  perform public.submit_report('phone', '0977 111 333', 'other', 'Evidence path of another user',
    null, array['00000000-0000-0000-0000-0000000000a2/x.jpg']);
  raise exception 'foreign evidence path accepted';
exception when invalid_parameter_value then null;
end $$;

set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000a2';
do $$
begin
  assert (select count(*) from storage.objects where bucket_id = 'evidence') = 0, 'others cannot read evidence';
end $$;

-- Moderation ----------------------------------------------------------------------
do $$
begin
  perform public.moderate_report((select id from public.reports limit 1), 'verified', null);
  raise exception 'non-moderator moderated';
exception when insufficient_privilege then null;
end $$;

set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000a4';
do $$
declare n int;
begin
  assert (select count(*) from storage.objects where bucket_id = 'evidence') = 1, 'moderator reads evidence';
  update public.reports set status = 'verified';
  get diagnostics n = row_count;
  assert n = 0, 'moderators cannot bypass the logged path';
  perform public.moderate_report(
    (select r.id from public.reports r join public.entities e on e.id = r.entity_id where e.normalized_value = '+84977111222'),
    'verified', 'evidence matches the script');
  assert (public.lookup_entity('phone', '0977111222') ->> 'verified_reports')::int = 1, 'verified';
  assert (select count(*) from public.moderation_log where action = 'verify_report') = 1, 'logged';
end $$;
do $$
begin
  perform public.submit_report('phone', '0977 444 555', 'other', 'Moderator files a report too');
  perform public.moderate_report(
    (select r.id from public.reports r join public.entities e on e.id = r.entity_id where e.normalized_value = '+84977444555'),
    'verified', null);
  raise exception 'moderator verified own report';
exception when insufficient_privilege then null;
end $$;
reset role;

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000a4';
do $$
declare n int;
begin
  update public.moderation_log set note = 'tampered';
  get diagnostics n = row_count;
  assert n = 0, 'log is not editable through the API';
  delete from public.moderation_log;
  get diagnostics n = row_count;
  assert n = 0, 'log is not deletable through the API';
end $$;

-- Alerts
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000a1';
insert into public.community_alerts (title, description, alert_type, severity, reporter_user_id)
values ('Pending alert', 'needs review before anyone sees it', 'scam_warning', 'medium', '00000000-0000-0000-0000-0000000000a1');
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000a4';
do $$
begin
  perform public.moderate_alert((select id from public.community_alerts where title = 'Pending alert'), 'verify', 'checked');
end $$;
set local request.jwt.claim.sub = '';
set local role anon;
do $$
begin
  assert exists (select 1 from public.community_alerts where title = 'Pending alert'), 'verified alert is public';
end $$;
reset role;
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000a4';
do $$
begin
  perform public.moderate_alert((select id from public.community_alerts where title = 'Pending alert'), 'hide', 'outdated');
end $$;
set local request.jwt.claim.sub = '';
set local role anon;
do $$
begin
  assert not exists (select 1 from public.community_alerts where title = 'Pending alert'), 'hidden alert is not public';
end $$;
reset role;

-- Appeals ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000a3';
do $$
begin
  perform public.submit_appeal('phone', '0977111222', 'too short');
  raise exception 'short reason accepted';
exception when invalid_parameter_value then null;
end $$;
do $$
declare r jsonb;
begin
  perform public.submit_appeal('phone', '+84 977 111 222', 'Đây là số cửa hàng của tôi, tôi không gọi cho ai xưng công an.', 'zalo 0977111222');
  r := public.lookup_entity('phone', '0977111222');
  assert (r ->> 'appeal_pending')::boolean, 'pending appeal shown in lookup';
  assert (select count(*) from public.appeals) = 1, 'appellant sees own appeal';
end $$;
do $$
begin
  perform public.submit_appeal('phone', '0977111222', 'Gửi lại lần nữa cho chắc chắn được xem xét nhanh.');
  raise exception 'duplicate pending appeal accepted';
exception when unique_violation then null;
end $$;

set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000a4';
do $$
declare r jsonb;
begin
  perform public.resolve_appeal((select id from public.appeals limit 1), 'accepted', 'business licence checked');
  r := public.lookup_entity('phone', '0977111222');
  assert not (r ->> 'found')::boolean, 'accepted appeal clears the reports';
  assert not (r ->> 'appeal_pending')::boolean, 'appeal no longer pending';
  assert (select count(*) from public.moderation_log where action = 'accept_appeal') = 1, 'appeal logged';
end $$;
reset role;

rollback;
