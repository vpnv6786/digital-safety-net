-- Access-control and RPC tests for the phase 0 migration. Runs in one
-- transaction that is rolled back. Any failed assert aborts the run.
begin;

insert into auth.users (id, phone) values
  ('00000000-0000-0000-0000-000000000001', '+84900000001'),
  ('00000000-0000-0000-0000-000000000002', '+84900000002'),
  ('00000000-0000-0000-0000-000000000003', '+84900000003'),
  ('00000000-0000-0000-0000-0000000000dd', '+84900000099');
insert into public.user_roles (user_id, role) values ('00000000-0000-0000-0000-0000000000dd', 'moderator');

-- Legacy rows were converted ------------------------------------------------
do $$
begin
  assert (select normalized_value from public.entities where id = '10000000-0000-0000-0000-000000000001') = '+84912345678',
    'legacy phone normalised';
  assert (select entity_type from public.entities where id = '10000000-0000-0000-0000-000000000002') = 'bank_account',
    'legacy digits became a bank account';
  assert not exists (select 1 from public.entities where entity_value like '%1903%' or normalized_value like '%190345678901%'),
    'no plaintext bank account remains';
  assert (select display_value from public.entities where id = '10000000-0000-0000-0000-000000000002') = '••••8901',
    'bank account masked for display';
  assert (select entity_type || '|' || normalized_value from public.entities where id = '10000000-0000-0000-0000-000000000003') = 'url|scam-site.com',
    'legacy website normalised';
  assert not exists (select 1 from public.danger_zones where is_active), 'danger zones deactivated';
  assert (select coalesce(sum(total_reports), 0) from public.scam_statistics) = 0, 'invented counts removed';
end $$;

-- Anonymous lookups see aggregates only --------------------------------------
set local role anon;
do $$
declare r jsonb;
begin
  r := public.lookup_entity('phone', '0912.345.678');
  assert (r ->> 'found')::boolean, 'legacy phone report is found by any spelling';
  assert (r ->> 'unverified_reporters')::int = 1, 'one unverified reporter';
  assert not (r ? 'description') and not (r ? 'reporter_user_id'), 'no report text or identity';

  r := public.lookup_entity('bank_account', '1903 4567 8901');
  assert (r ->> 'found')::boolean, 'legacy bank account found through its hash';

  r := public.lookup_entity('url', 'scam-site.com');
  assert (r ->> 'found')::boolean, 'legacy website found';

  r := public.lookup_entity('phone', '0987000111');
  assert not (r ->> 'found')::boolean, 'unknown number not found';

  assert (select count(*) from public.entities) = 0, 'anon cannot read entities';
  assert (select count(*) from public.reports) = 0, 'anon cannot read reports';
  assert (select count(*) from public.danger_zones) = 0, 'no active danger zones';
end $$;
do $$
begin
  perform public.submit_report('phone', '0987000111', 'other', 'anonymous should be refused');
  raise exception 'anon was allowed to submit a report';
exception when insufficient_privilege then null;
end $$;
reset role;

-- Reporting -------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';
do $$
begin
  assert public.submit_report('phone', '0987 000 111', 'impersonate_authority', 'Goi xung cong an doi chuyen tien') is not null,
    'user 1 reports';
end $$;
do $$
begin
  perform public.submit_report('phone', '+84987000111', 'impersonate_authority', 'Same number, other spelling');
  raise exception 'duplicate report accepted';
exception when unique_violation then null;
end $$;
do $$
begin
  perform public.submit_report('phone', '0987000111', 'made_up_category', 'bad category here');
  raise exception 'invalid category accepted';
exception when invalid_parameter_value then null;
end $$;
do $$
begin
  perform public.submit_report('url', 'javascript:alert(1)', 'other', 'not a website at all');
  raise exception 'invalid url accepted';
exception when invalid_parameter_value then null;
end $$;

-- Direct writes are closed
do $$
declare n int;
begin
  update public.entities set risk_score = 0;
  get diagnostics n = row_count;
  assert n = 0, 'user cannot change risk scores';
  assert (select count(*) from public.entities) = 0, 'user cannot read entities';
  assert (select count(*) from public.reports) = 1, 'user sees only their own report';
  update public.reports set status = 'verified';
  get diagnostics n = row_count;
  assert n = 0, 'user cannot verify their own report';
end $$;
do $$
begin
  insert into public.reports (reporter_user_id, entity_id, scam_category, description)
  values ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'other', 'bypass attempt');
  raise exception 'direct report insert allowed';
exception when insufficient_privilege then null;
end $$;

set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';
do $$
begin
  perform public.submit_report('phone', '84987000111', 'impersonate_authority', 'Cung bi goi tu so nay');
  assert (public.lookup_entity('phone', '0987000111') ->> 'unverified_reporters')::int = 2, 'two distinct reporters';
end $$;

-- Bank accounts are hashed
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000003';
do $$
begin
  perform public.submit_report('bank_account', '1111 2222 3333', 'bank_phishing', 'Tai khoan nhan tien lua dao', 'TCB');
  assert (public.lookup_entity('bank_account', '111122223333') ->> 'found')::boolean, 'bank account found by digits';
end $$;
reset role;
do $$
begin
  assert not exists (select 1 from public.entities where entity_value like '%111122223333%' or normalized_value like '%111122223333%'),
    'new bank account stored only as hash';
  assert exists (select 1 from public.entities where display_value = '••••3333' and bank_code = 'TCB'), 'masked with bank code';
end $$;

-- Moderation ------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000dd';
do $$
declare n int; r jsonb;
begin
  assert (select count(*) from public.reports) >= 5, 'moderator sees all reports';
  perform public.moderate_report(
    (select id from public.reports where reporter_user_id = '00000000-0000-0000-0000-000000000001'), 'verified', 'call recording heard');
  r := public.lookup_entity('phone', '0987000111');
  assert (r ->> 'verified_reports')::int = 1 and (r ->> 'unverified_reporters')::int = 1, 'counts after verification';
  assert r ->> 'last_verified_at' is not null, 'verification time recorded';
  assert (select risk_score from public.entities where normalized_value = '+84987000111') = 50, 'risk = 40 per verified + 10 per reporter';
end $$;
reset role;

-- Community alerts --------------------------------------------------------------
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';
do $$
begin
  insert into public.community_alerts (title, description, alert_type, severity, reporter_user_id, is_verified, source_type)
  values ('fake', 'claims authority', 'urgent_alert', 'critical', '00000000-0000-0000-0000-000000000001', true, 'authority');
  raise exception 'self-verified authority alert accepted';
exception when insufficient_privilege then null;
end $$;
do $$
declare n int; alert uuid;
begin
  insert into public.community_alerts (title, description, alert_type, severity, reporter_user_id)
  values ('Tin nhan gia ngan hang', 'Nhan tin nhan bao khoa tai khoan kem link la', 'scam_warning', 'medium', '00000000-0000-0000-0000-000000000001')
  returning id into alert;
  assert exists (select 1 from public.community_alerts where id = alert), 'author sees own pending alert';

  update public.community_alerts set upvotes = 1000, is_verified = true;
  get diagnostics n = row_count;
  assert n = 0, 'users cannot edit counts or verify';

  select id into alert from public.community_alerts where is_verified order by id limit 1;
  insert into public.alert_votes (alert_id, user_id, vote) values (alert, '00000000-0000-0000-0000-000000000001', 1);
  assert (select upvotes from public.community_alerts where id = alert) = 1, 'vote counted once';
end $$;
do $$
declare alert uuid;
begin
  select id into alert from public.community_alerts where is_verified order by id limit 1;
  insert into public.alert_votes (alert_id, user_id, vote) values (alert, '00000000-0000-0000-0000-000000000001', 1);
  raise exception 'double vote accepted';
exception when unique_violation then null;
end $$;
reset role;

set local request.jwt.claim.sub = '';
set local role anon;
do $$
begin
  assert not exists (select 1 from public.community_alerts where not is_verified), 'public sees only verified alerts';
  assert (select count(*) from public.community_alerts) = 2, 'two generic tips stay public';
  assert not exists (select 1 from public.community_alerts where source_type = 'authority'), 'no seeded alert claims an authority';
end $$;
reset role;

rollback;
