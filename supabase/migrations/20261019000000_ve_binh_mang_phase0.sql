-- Vệ Binh Mạng, phase 0: close the data-integrity holes and stop presenting
-- invented data as fact. See docs/research/2026-10-19-nang-cap-ve-binh-mang-agent.md §1.
--
-- Summary
--  * Roles: user_roles + has_role(); moderators verify reports and alerts.
--  * entities/reports: no direct client access. Lookups go through lookup_entity()
--    (aggregates only), reports through submit_report() (validated, rate-limited).
--  * Bank account numbers (sensitive personal data under Decree 356/2025) are
--    stored only as an HMAC; plaintext legacy values are replaced.
--  * Risk score counts only verified reports and distinct reporters.
--  * Community alerts: users cannot self-verify or claim "authority"; unverified
--    alerts are visible only to their author and moderators; votes are one per user.
--  * Danger zones: user creation removed, all seeded zones deactivated.
--  * scam_statistics: invented counts zeroed; typology list refreshed with sources.

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Roles
-- ---------------------------------------------------------------------------
create table if not exists public.user_roles (
  user_id uuid not null references auth.users on delete cascade,
  role text not null check (role in ('moderator', 'admin')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and (role = _role or role = 'admin')
  );
$$;
revoke execute on function public.has_role(uuid, text) from public;
grant execute on function public.has_role(uuid, text) to anon, authenticated, service_role;

drop policy if exists "Users can view their own roles" on public.user_roles;
create policy "Users can view their own roles"
  on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------------
-- Secret for hashing bank account numbers. The private schema is not exposed
-- through the API.
-- ---------------------------------------------------------------------------
create schema if not exists private;
revoke all on schema private from public;
create table if not exists private.app_secrets (
  name text primary key,
  value bytea not null
);
revoke all on private.app_secrets from public;
insert into private.app_secrets (name, value)
values ('bank_account_hmac_key', extensions.gen_random_bytes(32))
on conflict (name) do nothing;

create or replace function private.hash_bank_account(digits text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select 'h:' || encode(
    extensions.hmac(convert_to(digits, 'UTF8'), (select value from private.app_secrets where name = 'bank_account_hmac_key'), 'sha256'),
    'hex'
  );
$$;
revoke execute on function private.hash_bank_account(text) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Entities: normalised keys
-- ---------------------------------------------------------------------------
alter table public.entities drop constraint if exists entities_entity_type_check;
alter table public.entities
  add constraint entities_entity_type_check
  check (entity_type in ('phone', 'url', 'bank_account', 'email', 'other'));

alter table public.entities add column if not exists normalized_value text;
alter table public.entities add column if not exists display_value text;
alter table public.entities add column if not exists bank_code text;
alter table public.entities add column if not exists legacy boolean not null default false;

create index if not exists idx_entities_type_normalized on public.entities (entity_type, normalized_value);

-- Same rules as normalizePhone() in supabase/functions/_shared/core/normalize.ts.
create or replace function public.normalize_phone_vn(raw text)
returns text
language plpgsql
immutable
set search_path = ''
as $$
declare
  s text := regexp_replace(coalesce(raw, ''), '[\s.()-]', '', 'g');
  national text;
  legacy_prefix text;
begin
  if s !~ '^\+?[0-9]+$' then
    return null;
  end if;
  if s like '+%' then
    if s not like '+84%' then
      return case when length(s) between 8 and 16 then s else null end;
    end if;
    national := '0' || substr(s, 4);
  elsif s like '0084%' then
    national := '0' || substr(s, 5);
  elsif s like '84%' and length(s) in (11, 12) then
    national := '0' || substr(s, 3);
  else
    national := s;
  end if;

  if national ~ '^1[0-9]{2}$' or national ~ '^(1800|1900)[0-9]{4,6}$' then
    return national;
  end if;
  if length(national) = 11 then
    legacy_prefix := case substr(national, 1, 4)
      when '0120' then '070' when '0121' then '079' when '0122' then '077' when '0126' then '076' when '0128' then '078'
      when '0123' then '083' when '0124' then '084' when '0125' then '085' when '0127' then '081' when '0129' then '082'
      when '0162' then '032' when '0163' then '033' when '0164' then '034' when '0165' then '035' when '0166' then '036'
      when '0167' then '037' when '0168' then '038' when '0169' then '039'
      when '0186' then '056' when '0188' then '058' when '0199' then '059'
    end;
    if legacy_prefix is not null then
      national := legacy_prefix || substr(national, 5);
    end if;
  end if;
  if national ~ '^0[35789][0-9]{8}$' or national ~ '^02[0-9]{9}$' then
    return '+84' || substr(national, 2);
  end if;
  return null;
end;
$$;

-- Every row that existed before this migration came from the unvalidated demo flow.
update public.entities set legacy = true where normalized_value is null;

update public.entities
set normalized_value = public.normalize_phone_vn(entity_value)
where entity_type = 'phone' and normalized_value is null;

-- The old report form saved websites and bank accounts as 'other'.
update public.entities
set entity_type = 'url',
    normalized_value = regexp_replace(
      regexp_replace(lower(split_part(regexp_replace(entity_value, '^[a-zA-Z]+://', ''), '/', 1)), ':[0-9]+$', ''),
      '^(www[0-9]?|m)\.', ''
    )
where entity_type in ('other', 'url')
  and normalized_value is null
  and entity_value ~ '^(https?://)?[A-Za-z0-9.-]+\.[A-Za-z]{2,}(:[0-9]+)?(/.*)?$'
  and not exists (
    select 1 from public.entities e2
    where e2.entity_type = 'url' and e2.entity_value = public.entities.entity_value and e2.id <> public.entities.id
  );

-- Replace plaintext legacy bank account numbers with their hash.
update public.entities
set entity_type = 'bank_account',
    normalized_value = private.hash_bank_account(regexp_replace(entity_value, '[\s.-]', '', 'g')),
    display_value = '••••' || right(regexp_replace(entity_value, '[\s.-]', '', 'g'), 4),
    entity_value = 'legacy:' || id::text
where entity_type in ('other', 'bank_account')
  and regexp_replace(entity_value, '[\s.-]', '', 'g') ~ '^[0-9]{6,19}$';

-- Clients no longer read or write entities directly.
drop policy if exists "Anyone can view entities" on public.entities;
drop policy if exists "Authenticated users can create entities" on public.entities;
drop policy if exists "Authenticated users can update entities" on public.entities;
drop policy if exists "Moderators can view entities" on public.entities;
create policy "Moderators can view entities"
  on public.entities for select to authenticated
  using (public.has_role(auth.uid(), 'moderator'));

-- ---------------------------------------------------------------------------
-- Reports
-- ---------------------------------------------------------------------------
drop policy if exists "Users can view reports" on public.reports;
drop policy if exists "Users can create reports" on public.reports;
drop policy if exists "Users can update their own reports" on public.reports;
drop policy if exists "Users can view their own reports" on public.reports;
drop policy if exists "Moderators can view reports" on public.reports;
drop policy if exists "Moderators can update reports" on public.reports;

create policy "Users can view their own reports"
  on public.reports for select to authenticated
  using (reporter_user_id = auth.uid());
create policy "Moderators can view reports"
  on public.reports for select to authenticated
  using (public.has_role(auth.uid(), 'moderator'));
create policy "Moderators can update reports"
  on public.reports for update to authenticated
  using (public.has_role(auth.uid(), 'moderator'))
  with check (public.has_role(auth.uid(), 'moderator'));

-- Risk score: verified reports weigh most; unverified ones count once per reporter.
create or replace function public.update_entity_risk_score()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target uuid := coalesce(new.entity_id, old.entity_id);
  verified int;
  reporters int;
begin
  select
    count(*) filter (where status = 'verified'),
    count(distinct reporter_user_id) filter (where status = 'pending')
  into verified, reporters
  from public.reports
  where entity_id = target;

  update public.entities
  set report_count = verified + reporters,
      risk_score = least(100, verified * 40 + reporters * 10),
      last_reported_at = now()
  where id = target;

  if tg_op = 'INSERT' then
    update public.profiles set report_count = coalesce(report_count, 0) + 1 where id = new.reporter_user_id;
  end if;
  return new;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.update_entity_risk_score() from public, anon, authenticated;

drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at
  before update on public.reports
  for each row execute procedure public.set_updated_at();

drop trigger if exists on_report_status_changed on public.reports;
create trigger on_report_status_changed
  after update of status on public.reports
  for each row execute procedure public.update_entity_risk_score();

-- Recompute every score with the new formula.
update public.entities e
set report_count = s.verified + s.reporters,
    risk_score = least(100, s.verified * 40 + s.reporters * 10)
from (
  select entity_id,
         count(*) filter (where status = 'verified') as verified,
         count(distinct reporter_user_id) filter (where status = 'pending') as reporters
  from public.reports group by entity_id
) s
where s.entity_id = e.id;

-- ---------------------------------------------------------------------------
-- lookup_entity: what the public may know about a phone, site, account or email.
-- Aggregates only: no reporter identity, no report text.
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
    )
  )
  into result
  from public.entities e
  join public.reports r on r.entity_id = e.id and r.status in ('pending', 'verified')
  where e.entity_type = p_kind and e.normalized_value = key;

  return result;
end;
$$;
revoke execute on function public.lookup_entity(text, text) from public;
grant execute on function public.lookup_entity(text, text) to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- submit_report: the only way to file a report.
-- ---------------------------------------------------------------------------
create or replace function public.submit_report(
  p_kind text,
  p_value text,
  p_category text,
  p_description text,
  p_bank_code text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  key text;
  shown text;
  digits text;
  target uuid;
  report_id uuid;
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
  if (select count(*) from public.reports where reporter_user_id = uid and created_at > now() - interval '1 day') >= 10 then
    raise exception 'rate_limited' using errcode = '54000';
  end if;

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

  select id into target
  from public.entities
  where entity_type = p_kind and normalized_value = key
  order by legacy, created_at
  limit 1;

  if target is null then
    insert into public.entities (entity_value, entity_type, normalized_value, display_value, bank_code)
    values (key, p_kind, key, shown, case when p_kind = 'bank_account' then upper(left(p_bank_code, 10)) end)
    on conflict (entity_value, entity_type) do update set normalized_value = excluded.normalized_value
    returning id into target;
  end if;

  if exists (select 1 from public.reports where reporter_user_id = uid and entity_id = target) then
    raise exception 'already_reported' using errcode = '23505';
  end if;

  insert into public.reports (reporter_user_id, entity_id, scam_category, description, status)
  values (uid, target, p_category, trim(p_description), 'pending')
  returning id into report_id;
  return report_id;
end;
$$;
revoke execute on function public.submit_report(text, text, text, text, text) from public, anon;
grant execute on function public.submit_report(text, text, text, text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Community alerts
-- ---------------------------------------------------------------------------
drop policy if exists "Anyone can view community alerts" on public.community_alerts;
drop policy if exists "Authenticated users can create alerts" on public.community_alerts;
drop policy if exists "Anyone can view verified alerts" on public.community_alerts;
drop policy if exists "Users can create unverified alerts" on public.community_alerts;
drop policy if exists "Moderators can update alerts" on public.community_alerts;

create policy "Anyone can view verified alerts"
  on public.community_alerts for select
  using (
    is_verified = true
    or reporter_user_id = auth.uid()
    or public.has_role(auth.uid(), 'moderator')
  );

create policy "Users can create unverified alerts"
  on public.community_alerts for insert to authenticated
  with check (
    reporter_user_id = auth.uid()
    and coalesce(is_verified, false) = false
    and verified_by is null
    and coalesce(source_type, 'user_report') = 'user_report'
    and coalesce(upvotes, 0) = 0
    and coalesce(downvotes, 0) = 0
    and coalesce(view_count, 0) = 0
  );

create policy "Moderators can update alerts"
  on public.community_alerts for update to authenticated
  using (public.has_role(auth.uid(), 'moderator'))
  with check (public.has_role(auth.uid(), 'moderator'));

-- Seeded alerts: keep the two generic safety tips, withdraw the ones that named a
-- specific domain or place as fact and claimed to come from an authority.
update public.community_alerts
set source_type = 'community', alert_type = 'safety_tip'
where title in (
  'Cảnh báo: Gia tăng lừa đảo việc làm casino tại biên giới',
  'Mạo danh Shopee lừa đảo qua tin nhắn SMS'
);
update public.community_alerts
set is_verified = false, source_type = 'community'
where title in (
  'Phát hiện website ngân hàng giả mạo Vietcombank',
  'Cảnh báo: Điểm nóng tội phạm tại khu vực ga Sài Gòn'
);

create table if not exists public.alert_votes (
  alert_id uuid not null references public.community_alerts on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  vote smallint not null check (vote in (-1, 1)),
  created_at timestamptz not null default now(),
  primary key (alert_id, user_id)
);
alter table public.alert_votes enable row level security;

drop policy if exists "Users manage their own votes" on public.alert_votes;
create policy "Users manage their own votes"
  on public.alert_votes for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create or replace function public.refresh_alert_votes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target uuid := coalesce(new.alert_id, old.alert_id);
begin
  update public.community_alerts
  set upvotes = (select count(*) from public.alert_votes where alert_id = target and vote = 1),
      downvotes = (select count(*) from public.alert_votes where alert_id = target and vote = -1)
  where id = target;
  return null;
end;
$$;

revoke execute on function public.refresh_alert_votes() from public, anon, authenticated;

drop trigger if exists on_alert_vote_changed on public.alert_votes;
create trigger on_alert_vote_changed
  after insert or update or delete on public.alert_votes
  for each row execute procedure public.refresh_alert_votes();

-- ---------------------------------------------------------------------------
-- Danger zones: the feature is removed from the app. Seeded zones named places
-- as crime or scam hubs without a source.
-- ---------------------------------------------------------------------------
drop policy if exists "Users can create danger zones" on public.danger_zones;
update public.danger_zones set is_active = false, updated_at = now() where is_active;

-- ---------------------------------------------------------------------------
-- Scam typologies: keep descriptions and advice, drop invented numbers.
-- ---------------------------------------------------------------------------
alter table public.scam_statistics add column if not exists sort_order int;
alter table public.scam_statistics add column if not exists source_note text;
alter table public.scam_statistics add column if not exists is_active boolean not null default true;

update public.scam_statistics set total_reports = 0, frequency_score = 0, damage_score = 0;
update public.scam_statistics set is_active = false where scam_type in ('fake_charity', 'fake_job_casino');
update public.scam_statistics set sort_order = 10, source_note = 'NCA, tổng kết 2025 (SGGP, 07/01/2026): hạng 1'
  where scam_type = 'fake_authority';
update public.scam_statistics set sort_order = 30, source_note = 'NCA, tổng kết 2025: hạng 3'
  where scam_type = 'fake_investment';
update public.scam_statistics set sort_order = 40, source_note = 'NCA, tổng kết 2025: hạng 4 (shipper giả)'
  where scam_type = 'fake_delivery';
update public.scam_statistics set sort_order = 60, source_note = 'VNPT: 11.800 tên miền giả năm 2025 (Đại biểu Nhân dân, 09/02/2026)'
  where scam_type = 'fake_bank_website';
update public.scam_statistics set sort_order = 70 where scam_type = 'fake_online_job';

insert into public.scam_statistics (scam_type, title, description, danger_level, recent_trend, prevention_tips, warning_signs, sort_order, source_note)
select * from (values
  ('fake_prize', 'Trúng thưởng, tri ân khách hàng', 'Báo bạn trúng thưởng hoặc được quà, rồi đòi phí, thuế hay "phí nhận thưởng" trước.', 'high', 'stable',
    array['Giải thưởng thật không bắt bạn trả tiền để nhận', 'Tự liên hệ hãng qua website hoặc tổng đài chính thức', 'Không cung cấp số thẻ, OTP'],
    array['Trúng thưởng dù không tham gia', 'Đòi phí trước khi nhận', 'Hạn nhận gấp'], 20, 'NCA, tổng kết 2025: hạng 2'),
  ('fake_app_apk', 'Dụ cài ứng dụng giả (VNeID, thuế, điện lực)', 'Mạo danh công an, thuế, điện lực báo "lỗi định danh", gửi link cài ứng dụng giả để chiếm quyền điện thoại và rút tiền.', 'critical', 'increasing',
    array['Chỉ cài ứng dụng từ App Store, Google Play', 'Không bật Trợ năng cho ứng dụng lạ', 'Cơ quan nhà nước không gửi link cài app qua tin nhắn'],
    array['Link tải file .apk', 'Yêu cầu bật Trợ năng, chia sẻ màn hình', 'Gọi điện hướng dẫn cài đặt từng bước'], 15, 'NCA 2025: 62.952 biến thể mã độc di động mới'),
  ('romance', 'Lừa tình, làm quen qua mạng', 'Làm quen, hứa hẹn tình cảm rồi dụ đầu tư, gửi quà, nhờ chuyển tiền.', 'high', 'stable',
    array['Không chuyển tiền cho người chưa gặp', 'Gọi video và kiểm tra kỹ danh tính', 'Hỏi ý kiến người thân'],
    array['Chưa gặp đã tỏ tình', 'Rủ đầu tư, nhận quà phải đóng phí', 'Luôn có lý do không gặp được'], 50, 'NCA, tổng kết 2025: hạng 5'),
  ('recovery_scam', 'Lừa đảo lần hai: hứa lấy lại tiền', 'Giả luật sư, hacker, cán bộ Viện Kiểm sát hứa lấy lại tiền đã bị lừa, đòi phí trước.', 'high', 'increasing',
    array['Chỉ trình báo công an nơi cư trú hoặc qua VNeID', 'Không trả phí cho dịch vụ "thu hồi tiền"', 'Cảnh giác với tài khoản mạng xã hội tự nhận hỗ trợ'],
    array['Hứa lấy lại 100% tiền', 'Đòi phí hồ sơ, phí mở khoá', 'Liên hệ qua mạng xã hội'], 25, 'Công an Đà Nẵng, Hà Nội cảnh báo 8–9/2026')
) as v(scam_type, title, description, danger_level, recent_trend, prevention_tips, warning_signs, sort_order, source_note)
where not exists (select 1 from public.scam_statistics s where s.scam_type = v.scam_type);

drop policy if exists "Anyone can view scam statistics" on public.scam_statistics;
create policy "Anyone can view scam statistics"
  on public.scam_statistics for select
  using (is_active);
