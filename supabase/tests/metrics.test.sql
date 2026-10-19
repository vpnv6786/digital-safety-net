begin;

insert into auth.users (id, phone) values
  ('00000000-0000-0000-0000-0000000000c1', '+84900000301'),
  ('00000000-0000-0000-0000-0000000000cd', '+84900000399');
insert into public.user_roles (user_id, role) values ('00000000-0000-0000-0000-0000000000cd', 'moderator');

insert into private.usage_counters (day, kind, count) values
  (current_date - 5, 'caller:abc', 3),
  (current_date - 5, 'verdict:danger', 7),
  (current_date - 500, 'verdict:unknown', 1);

set local role service_role;
do $$
begin
  perform public.consume_quota('verdict:warning', 1000000000);
  perform public.consume_quota('feedback:danger:stopped', 1000000000);
end $$;
reset role;

do $$
begin
  assert not exists (select 1 from private.usage_counters where kind = 'caller:abc'), 'old caller hashes deleted';
  assert exists (select 1 from private.usage_counters where kind = 'verdict:danger'), 'recent metrics kept';
  assert not exists (select 1 from private.usage_counters where day < current_date - 400), 'metrics older than 400 days deleted';
end $$;

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000c1';
do $$
begin
  perform public.metrics_summary(14);
  raise exception 'user read metrics';
exception when insufficient_privilege then null;
end $$;

set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000cd';
do $$
begin
  assert (select count(*) from public.metrics_summary(14)) = 3, 'moderator reads metric counters';
  assert not exists (select 1 from public.metrics_summary(14) where kind like 'caller:%'), 'never caller hashes';
end $$;
reset role;

rollback;
