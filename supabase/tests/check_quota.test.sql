begin;

set local role service_role;
do $$
begin
  assert public.consume_quota('llm', 2), 'first use allowed';
  assert public.consume_quota('llm', 2), 'second use allowed';
  assert not public.consume_quota('llm', 2), 'third use refused';
  assert not public.consume_quota('llm', 2), 'still refused';
  assert public.consume_quota('vision', 1), 'kinds are counted separately';
end $$;
reset role;

do $$
begin
  assert (select count from private.usage_counters where kind = 'llm') = 2, 'refusals are not counted';
end $$;

set local role anon;
do $$
begin
  perform public.consume_quota('llm', 1000);
  raise exception 'anon consumed quota';
exception when insufficient_privilege then null;
end $$;
reset role;

set local role authenticated;
do $$
begin
  perform public.consume_quota('llm', 1000);
  raise exception 'user consumed quota';
exception when insufficient_privilege then null;
end $$;
reset role;

rollback;
