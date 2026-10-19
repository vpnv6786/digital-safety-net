-- Rows written by the old demo flow, to check that phase 0 converts them.
insert into auth.users (id, phone) values ('00000000-0000-0000-0000-0000000000aa', '+84900000000');
insert into public.profiles (id) values ('00000000-0000-0000-0000-0000000000aa') on conflict do nothing;

insert into public.entities (id, entity_value, entity_type) values
  ('10000000-0000-0000-0000-000000000001', '0912 345 678', 'phone'),
  ('10000000-0000-0000-0000-000000000002', '1903 4567 8901', 'other'),
  ('10000000-0000-0000-0000-000000000003', 'https://www.Scam-Site.com/login', 'other');

insert into public.reports (reporter_user_id, entity_id, scam_category, description) values
  ('00000000-0000-0000-0000-0000000000aa', '10000000-0000-0000-0000-000000000001', 'Giả mạo công an', 'legacy report one'),
  ('00000000-0000-0000-0000-0000000000aa', '10000000-0000-0000-0000-000000000002', 'Lừa đảo ngân hàng', 'legacy report two'),
  ('00000000-0000-0000-0000-0000000000aa', '10000000-0000-0000-0000-000000000003', 'Khác', 'legacy report three');
