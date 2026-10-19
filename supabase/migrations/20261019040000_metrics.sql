-- Privacy-preserving metrics: daily counters only, never the checked content.
--   verdict:<level>             one per server check
--   feedback:<level>:<choice>   what people said they would do after the answer
-- Caller counters (hashed IPs) are still deleted after two days; metric
-- counters are kept for 400 days.

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

  delete from private.usage_counters
  where (kind like 'caller:%' and day < current_date - 1)
     or day < current_date - 400;

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

-- Moderators read the metric counters (never the hashed callers).
create or replace function public.metrics_summary(p_days int default 14)
returns table (day date, kind text, count int)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.has_role(auth.uid(), 'moderator') then
    raise exception 'not_moderator' using errcode = '42501';
  end if;
  return query
    select u.day, u.kind, u.count
    from private.usage_counters u
    where (u.kind like 'verdict:%' or u.kind like 'feedback:%' or u.kind in ('llm', 'vision'))
      and u.day > current_date - least(greatest(p_days, 1), 90)
    order by u.day, u.kind;
end;
$$;
revoke execute on function public.metrics_summary(int) from public, anon;
grant execute on function public.metrics_summary(int) to authenticated;
