# Vệ Binh Mạng

**Hỏi trước khi chuyển tiền, cài app hay bấm link.** Người dân dán tin nhắn, số điện thoại, link, email hoặc số tài khoản và nhận một trong bốn kết luận, kèm lý do có nguồn và một việc cần làm ngay. Có trang "Đã lỡ bị lừa?" hướng dẫn các bước trong giờ đầu và nơi trình báo chính thức.

Nghiên cứu và lộ trình: [`docs/research/2026-10-19-nang-cap-ve-binh-mang-agent.md`](docs/research/2026-10-19-nang-cap-ve-binh-mang-agent.md).

## Bốn mức kết luận

| Mức | Khi nào |
|---|---|
| Rất nguy hiểm | Khớp kịch bản lừa đảo đã biết (đòi OTP, "tài khoản an toàn", dụ cài app, file .apk, tên miền giả cơ quan nhà nước, hứa lấy lại tiền…) hoặc có báo cáo đã được kiểm duyệt |
| Có dấu hiệu lừa đảo | Dấu hiệu trung bình (link rút gọn, tên miền nhái thương hiệu, cam kết lãi…) hoặc từ 2 người báo cáo chưa xác minh |
| Chưa đủ thông tin | **Mặc định.** Không có dữ liệu không có nghĩa là an toàn |
| Khớp kênh chính thức | Tên miền chính thức đã kiểm tra, hoặc `.gov.vn` |

Không có mức "an toàn". Khi tra cứu lỗi, câu trả lời nói rõ là chưa tra được.

## Cấu trúc

```
supabase/functions/_shared/core/   Bộ lõi kiểm tra, TypeScript thuần (chạy trong trình duyệt và Edge Function)
  normalize.ts   chuẩn hoá số điện thoại (E.164, đầu số 11 số cũ), link, email, số tài khoản; tách thực thể từ tin nhắn
  rules.ts       luật nhận diện kịch bản lừa đảo và link rủi ro
  official.ts    tên miền chính thức và danh bạ liên hệ đã kiểm tra (có ngày, nguồn)
  verdict.ts     ghép lý do thành kết luận
supabase/migrations/               Lược đồ và phân quyền (RLS)
supabase/tests/                    Test phân quyền, RPC chạy trên PostgreSQL thật
supabase/functions/_shared/server/ Phần chỉ chạy trên máy chủ: Google Web Risk, tuổi tên miền (RDAP), gọi model
supabase/functions/check/          Edge Function POST /check (Deno)
src/services/checkService.ts       Gọi Edge Function check; nếu không được thì chạy bộ lõi ngay trên trình duyệt
src/services/reportService.ts      Gửi báo cáo qua RPC submit_report
tests/core/                        Test bộ lõi (Vitest)
```

## Edge Function `check`

Chạy bộ lõi trên máy chủ và thêm các tín hiệu mà trình duyệt không lấy được. Mỗi phần tùy chọn đều có thể tắt bằng cách không đặt biến môi trường:

| Biến | Tác dụng |
|---|---|
| `ANTHROPIC_API_KEY` | Bật đọc ảnh chụp màn hình và phần giải thích bằng AI. AI chỉ có thể nâng kết luận tới "có dấu hiệu lừa đảo", không bao giờ tới "rất nguy hiểm", và không hạ được mức do luật cố định đặt ra |
| `LLM_MODEL` | Model, mặc định `claude-opus-5-5` (effort `low`). Đặt `claude-haiku-5-5` nếu cần rẻ hơn |
| `WEB_RISK_API_KEY` | Tra Google Web Risk (bản dùng cho mục đích thương mại; Safe Browsing API chỉ dành cho mục đích phi thương mại) |
| `LLM_DAILY_LIMIT`, `VISION_DAILY_LIMIT` | Trần số lần gọi AI mỗi ngày (mặc định 500 và 200); quá trần thì vẫn trả lời bằng phần không dùng AI |
| `CHECKS_PER_CALLER_PER_DAY` | Giới hạn mỗi địa chỉ IP (lưu dạng băm, xoá sau 2 ngày), mặc định 200 |
| `ALLOWED_ORIGINS` | Danh sách origin được gọi, mặc định `*` |

Deploy: `supabase functions deploy check` rồi `supabase secrets set ANTHROPIC_API_KEY=... WEB_RISK_API_KEY=...`.

## Vận hành bằng agent

Agent đọc hàng chờ (đã che dữ liệu) qua Edge Function `agent-api` và chỉ ghi đề xuất. Người kiểm duyệt chấp nhận hoặc bỏ qua ở `/kiem-duyet`. Chi tiết: [`docs/agents/README.md`](docs/agents/README.md). Bộ mẫu chuẩn: `npm run eval`.

## Dữ liệu và quyền riêng tư

- Trình duyệt không đọc, ghi trực tiếp bảng `entities`, `reports`. Tra cứu đi qua `lookup_entity()` (chỉ trả số lượng, không trả danh tính hay nội dung báo cáo); báo cáo đi qua `submit_report()` (bắt đăng nhập, kiểm tra định dạng, mỗi người một lần mỗi mục, tối đa 10 báo cáo/24 giờ).
- Số tài khoản ngân hàng (dữ liệu nhạy cảm theo NĐ 356/2025) chỉ lưu HMAC và 4 số cuối. Khoá HMAC nằm trong schema `private`, không lộ qua API.
- Báo cáo chỉ là "đã xác minh" khi người có vai trò `moderator` duyệt. Cảnh báo cộng đồng chưa duyệt chỉ người gửi và người kiểm duyệt thấy.
- Ảnh bằng chứng nằm trong bucket riêng tư `evidence/<user id>/`, được thu nhỏ và xoá metadata trước khi tải lên. Chỉ người gửi và người kiểm duyệt xem được, qua link ký có hạn 5 phút.

## Kiểm duyệt và khiếu nại

- Trang `/kiem-duyet` chỉ dành cho người có vai trò `moderator`. Người kiểm duyệt chỉ thao tác qua `moderate_report`, `moderate_alert`, `resolve_appeal`: mỗi quyết định được ghi vào `moderation_log` (API không sửa, không xoá được), và không ai tự duyệt mục do chính mình gửi.
- Trang `/khieu-nai` cho chủ số điện thoại, website, email hoặc tài khoản bị báo cáo nhầm gửi khiếu nại (cần đăng nhập). Trong lúc chờ, kết quả kiểm tra ghi rõ "chủ sở hữu đang khiếu nại". Khi khiếu nại được chấp nhận, mọi báo cáo về mục đó chuyển thành "từ chối".

## Chạy

```bash
npm ci
npm run dev          # http://localhost:8080
npm test             # test bộ lõi
npm run typecheck
./scripts/test-db.sh # chạy mọi migration và test phân quyền trên PostgreSQL cục bộ (cần PostgreSQL 15+)
deno check --no-config supabase/functions/check/index.ts   # kiểm kiểu Edge Function
```

Biến môi trường tuỳ chọn: `VITE_CONTACT_EMAIL` là email liên hệ hiển thị trên trang. Chưa đặt thì trang ẩn email.

## Triển khai

Xem [`docs/DEPLOY.md`](docs/DEPLOY.md): cơ sở dữ liệu, người kiểm duyệt, Edge Functions, web, agent theo lịch, hoàn tác.

## Giấy phép

Chưa có tệp giấy phép trong repo. Chủ dự án cần chọn giấy phép.
