-- Daily quotas for the check Edge Function: caps AI spend per day and checks
-- per caller. Only the service role (the Edge Function) may consume quota.

create table if not exists private.usage_counters (
  day date not null default current_date,
  kind text not null,
  count int not null default 0,
  primary key (day, kind)
);
revoke all on private.usage_counters from public;

-- Returns true and counts one use when today's count for p_kind is below p_limit.
create or replace function public.consume_quota(p_kind text, p_limit int)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  used int;
begin
  if p_kind is null or length(p_kind) > 100 or p_limit is null or p_limit < 0 then
    raise exception 'invalid_input' using errcode = '22023';
  end if;

  delete from private.usage_counters where day < current_date - 1;

  insert into private.usage_counters (day, kind, count)
  values (current_date, p_kind, 1)
  on conflict (day, kind) do update set count = private.usage_counters.count + 1
  returning count into used;

  if used > p_limit then
    update private.usage_counters set count = count - 1 where day = current_date and kind = p_kind;
    return false;
  end if;
  return true;
end;
$$;
revoke execute on function public.consume_quota(text, int) from public, anon, authenticated;
grant execute on function public.consume_quota(text, int) to service_role;
