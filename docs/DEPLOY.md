# Triển khai Vệ Binh Mạng

Các bước đưa mã trên `main` lên dự án Supabase (`project_id` trong `supabase/config.toml`) và lên web. Làm theo đúng thứ tự: giao diện mới cần các hàm cơ sở dữ liệu mới.

## 1. Cơ sở dữ liệu

```bash
supabase link --project-ref <project_id>
supabase db push          # áp các migration 2026-10-19 trở đi
```

Migration `20261019000000_ve_binh_mang_phase0.sql` thay đổi dữ liệu có sẵn, **không đảo ngược được**:
- Số tài khoản ngân hàng dạng rõ được thay bằng mã băm.
- Mọi khu vực nguy hiểm bị tắt.
- Số liệu thống kê bịa bị đặt về 0.

Nên chụp bản sao lưu trước khi chạy: Dashboard → Database → Backups, hoặc `supabase db dump`.

Kiểm tra sau khi chạy (trong SQL editor):

```sql
select count(*) from public.entities where entity_type = 'bank_account' and entity_value !~ '^(h:|legacy:)';  -- phải là 0
select public.lookup_entity('phone', '0912345678');                                                          -- trả JSON, không lỗi
```

## 2. Người kiểm duyệt

Người kiểm duyệt đăng nhập web một lần (bằng OTP số điện thoại) để có tài khoản, rồi chạy:

```sql
insert into public.user_roles (user_id, role)
select id, 'moderator' from auth.users where phone = '84xxxxxxxxx';
```

Cần ít nhất hai người kiểm duyệt: không ai tự duyệt được mục do chính mình gửi.

## 3. Edge Functions

```bash
supabase functions deploy check
supabase functions deploy agent-api --no-verify-jwt
supabase functions delete send-emergency-alert        # function cũ đã gỡ khỏi mã; nút khẩn cấp chỉ giả lập

supabase secrets set AGENT_API_TOKEN=$(openssl rand -hex 32)
supabase secrets set ANTHROPIC_API_KEY=...            # tuỳ chọn: đọc ảnh, giải thích bằng AI
supabase secrets set WEB_RISK_API_KEY=...             # tuỳ chọn: Google Web Risk
supabase secrets set ALLOWED_ORIGINS=https://<tên miền web>
# tuỳ chọn: LLM_MODEL, LLM_DAILY_LIMIT, VISION_DAILY_LIMIT, CHECKS_PER_CALLER_PER_DAY
```

Kiểm tra:

```bash
curl -s -X POST "https://<project>.supabase.co/functions/v1/check" \
  -H "apikey: <anon key>" -H "authorization: Bearer <anon key>" -H 'content-type: application/json' \
  -d '{"text":"Anh đọc giúp em mã OTP vừa gửi về máy nhé"}' | jq .verdict.level        # "danger"
curl -s "https://<project>.supabase.co/functions/v1/agent-api/queue" -H "x-agent-token: $AGENT_API_TOKEN" | jq .pending_appeals
```

## 4. Web

Đặt biến `VITE_CONTACT_EMAIL` bằng một email mà dự án thật sự quản lý, rồi build (`npm run build`) và đăng (Lovable "Publish", hoặc host tĩnh bất kỳ). Nếu chưa đặt biến này, trang sẽ ẩn mục email.

## 5. Agent chạy theo lịch

Trong GitHub → Settings → Secrets and variables → Actions:
- Secrets: `AGENT_API_URL` (`https://<project>.supabase.co/functions/v1/agent-api`), `AGENT_API_TOKEN`, và `ANTHROPIC_API_KEY` nếu muốn dùng model.
- Biến tuỳ chọn: `LLM_MODEL`.

Chạy thử bằng Actions → Agents → Run workflow. Chế độ thử (`dry_run`) được bật sẵn, nên lần chạy này chỉ in đề xuất, không gửi.

## Hoàn tác

- **Web:** đăng lại bản build trước.
- **Edge Functions:** deploy lại từ commit trước, hoặc `supabase functions delete <tên>`. Khi không có `check`, web tự chuyển sang kiểm tra ngay trên trình duyệt.
- **Cơ sở dữ liệu:** các migration sau phase 0 chỉ thêm bảng, hàm và chính sách mới, nên có thể bỏ qua chúng khi khôi phục từ bản sao lưu. Riêng phase 0 không đảo ngược được; chỉ khôi phục được từ bản sao lưu.
