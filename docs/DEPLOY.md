# Đưa Vệ Binh Mạng lên mạng (Cloudflare + Supabase)

## Bức tranh chung

| Ở đâu | Làm gì |
|---|---|
| **Cloudflare** | Chạy trang web và "bộ não" kiểm tra (`/api/check`, `/api/agent`). Miễn phí ở mức sử dụng nhỏ. |
| **Supabase** | Giữ dữ liệu: tài khoản đăng nhập, báo cáo, ảnh bằng chứng, nhật ký kiểm duyệt. Dự án Supabase hiện có được giữ nguyên. |
| **GitHub** | Giữ mã nguồn. Mỗi lần merge vào `main`, GitHub tự build và đưa lên Cloudflare. |

Anh/chị chỉ cần làm **một lần**: lấy vài mã khoá, dán vào GitHub, rồi bấm chạy hai workflow. Không cần cài gì trên máy.

---

## Bước 1. Lấy 2 thông tin từ Supabase

Đăng nhập [supabase.com](https://supabase.com/dashboard) và mở dự án của Vệ Binh Mạng (mã dự án `bxwthkhtnqjvckukvwqh`).

1. **Khoá service role**: vào *Project Settings → API Keys*, mở tab *Legacy API keys*, tìm dòng `service_role`, bấm *Reveal* rồi copy.
   Khoá này có toàn quyền với dữ liệu, nên chỉ dán vào GitHub Secrets; không gửi qua chat hay email.
2. **Chuỗi kết nối database**: bấm nút *Connect* ở đầu trang, chọn *Session pooler*, rồi copy dòng `postgresql://...`.
   Thay `[YOUR-PASSWORD]` bằng mật khẩu database. Quên mật khẩu thì vào *Project Settings → Database → Reset database password* để đặt lại; việc này không ảnh hưởng tới trang web.
   Phải dùng *Session pooler*, không dùng *Direct connection*: máy chạy của GitHub không kết nối được bằng địa chỉ IPv6 của kết nối trực tiếp.

## Bước 2. Lấy 2 thông tin từ Cloudflare

Tạo tài khoản miễn phí tại [dash.cloudflare.com](https://dash.cloudflare.com) nếu chưa có.

1. **Account ID**: vào *Workers & Pages*; mã nằm ở cột bên phải, dòng *Account ID*. Copy lại.
2. **API token**: bấm ảnh đại diện → *My Profile → API Tokens → Create Token*, chọn mẫu **Edit Cloudflare Workers**, bấm *Continue to summary* rồi *Create Token*. Copy token ngay, vì Cloudflare chỉ hiện token một lần.

## Bước 3. Dán vào GitHub

Mở repo `digital-safety-net` trên GitHub, vào *Settings → Secrets and variables → Actions*.

Ở tab **Secrets**, bấm *New repository secret* cho từng dòng:

| Tên | Giá trị | Bắt buộc? |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Token ở bước 2 | Có |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID ở bước 2 | Có |
| `SUPABASE_SERVICE_ROLE_KEY` | Khoá service role ở bước 1 | Có |
| `SUPABASE_DB_URL` | Chuỗi kết nối ở bước 1 | Có (dùng để cập nhật database) |
| `AGENT_API_TOKEN` | Một chuỗi ngẫu nhiên dài, ví dụ 40 ký tự chữ và số gõ bất kỳ | Nên có (bật agent) |
| `RATE_LIMIT_SALT` | Một chuỗi ngẫu nhiên khác | Nên có |
| `ANTHROPIC_API_KEY` | Khoá API Anthropic | Tuỳ chọn: đọc ảnh chụp màn hình, AI giải thích |
| `WEB_RISK_API_KEY` | Khoá Google Web Risk | Tuỳ chọn: tra danh sách link nguy hiểm của Google |

Ở tab **Variables** (tuỳ chọn):

| Tên | Giá trị |
|---|---|
| `VITE_CONTACT_EMAIL` | Email liên hệ hiện trên trang, phải là email dự án quản lý |
| `LLM_MODEL` | Đổi model AI, ví dụ `claude-haiku-5-5` cho rẻ hơn. Mặc định là `claude-opus-5-5` |

## Bước 4. Sao lưu database

Lần cập nhật đầu tiên thay đổi một số dữ liệu cũ **không đảo ngược được**:
- Số tài khoản ngân hàng dạng rõ được thay bằng mã băm.
- Các "khu vực nguy hiểm" gán tội không nguồn bị tắt.
- Số liệu thống kê bịa bị đặt về 0.

Đây đều là dữ liệu nên bỏ, nhưng vẫn nên sao lưu trước:
- **Gói Pro:** Supabase → *Database → Backups*, chắc chắn có bản sao lưu của hôm nay.
- **Gói Free:** nhờ người kỹ thuật chạy `pg_dump "<chuỗi kết nối ở bước 1>" > backup.sql` trên một máy có PostgreSQL.
- **Nếu app chưa có người dùng thật** (chỉ có dữ liệu thử): có thể bỏ qua bước này.

## Bước 5. Cập nhật database

GitHub → tab *Actions* → workflow **Database migrations** → *Run workflow*.

1. Ô xác nhận: gõ `da-sao-luu`. Giữ ô *Chỉ liệt kê, không chạy* đang bật, rồi bấm *Run*. Log sẽ in `would apply ...` cho 5 migration ngày 2026-10-19.
2. Chạy lại một lần nữa, lần này **tắt** ô *Chỉ liệt kê*. Log kết thúc bằng `5 migration(s) applied`.

Có thể chạy lại workflow này bất cứ lúc nào: migration nào đã chạy rồi sẽ được bỏ qua.

## Bước 6. Đưa lên Cloudflare

GitHub → *Actions* → workflow **Deploy** → *Run workflow*. Từ nay, mỗi lần merge vào `main` workflow này cũng tự chạy.

Trong log bước *Deploy Worker* có một dòng dạng `https://ve-binh-mang.<tên tài khoản>.workers.dev`. **Đó là địa chỉ trang web.**

## Bước 7. Kiểm tra

1. Mở địa chỉ ở bước 6 và bấm ví dụ *Tin nhắn mạo danh công an*. Kết quả phải là **"Rất nguy hiểm. Dừng lại."**
2. Đăng nhập bằng số điện thoại, gửi thử một báo cáo.
3. Gán người kiểm duyệt: Supabase → *SQL Editor*, chạy câu lệnh dưới (thay số điện thoại, bỏ số 0 đầu, thêm 84). Cần ít nhất **hai** người kiểm duyệt, vì không ai được tự duyệt mục do chính mình gửi.

   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'moderator' from auth.users where phone = '84912345678';
   ```

4. Người kiểm duyệt đăng nhập lại; trong menu tài khoản sẽ có mục **Kiểm duyệt**.

## Bước 8. Việc thêm (tuỳ chọn)

- **Tên miền riêng:** Cloudflare → *Workers & Pages → ve-binh-mang → Settings → Domains & Routes → Add → Custom domain*.
- **Đăng nhập Google/Facebook:** thêm địa chỉ mới vào Supabase → *Authentication → URL Configuration*. Đăng nhập bằng OTP số điện thoại không cần bước này.
- **Agent chạy theo lịch:** thêm GitHub Secret `AGENT_API_URL` = `https://<địa chỉ web>/api/agent`. Workflow *Agents* sẽ tự chạy mỗi giờ.
- **Dọn đồ cũ:**
  - Supabase → *Edge Functions*: xoá `send-emergency-alert` nếu còn. Nút khẩn cấp đó chỉ giả lập, không gửi gì.
  - Nếu trước đây đã đăng web qua Lovable, hãy ngừng dùng địa chỉ cũ.

## Hoàn tác

- **Trang web hoặc API lỗi:** Cloudflare → *Workers & Pages → ve-binh-mang → Deployments*, chọn bản trước rồi bấm *Rollback*.
- **Database:** các migration sau phase 0 chỉ thêm bảng, hàm và quyền mới. Muốn quay lại hoàn toàn thì khôi phục bản sao lưu ở bước 4.

## Chạy trên máy (cho người phát triển)

```bash
npm ci && npm run build
printf 'SUPABASE_SERVICE_ROLE_KEY=...\nAGENT_API_TOKEN=local\n' > .dev.vars   # không commit file này
npx wrangler dev          # http://localhost:8787: trang web + API
```
