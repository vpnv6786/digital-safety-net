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
src/services/checkService.ts       Gọi bộ lõi + RPC lookup_entity
src/services/reportService.ts      Gửi báo cáo qua RPC submit_report
tests/core/                        Test bộ lõi (Vitest)
```

## Dữ liệu và quyền riêng tư

- Trình duyệt không đọc, ghi trực tiếp bảng `entities`, `reports`. Tra cứu đi qua `lookup_entity()` (chỉ trả số lượng, không trả danh tính hay nội dung báo cáo); báo cáo đi qua `submit_report()` (bắt đăng nhập, kiểm tra định dạng, mỗi người một lần mỗi mục, tối đa 10 báo cáo/24 giờ).
- Số tài khoản ngân hàng (dữ liệu nhạy cảm theo NĐ 356/2025) chỉ lưu HMAC và 4 số cuối. Khoá HMAC nằm trong schema `private`, không lộ qua API.
- Báo cáo chỉ là "đã xác minh" khi người có vai trò `moderator` duyệt. Cảnh báo cộng đồng chưa duyệt chỉ người gửi và người kiểm duyệt thấy.

## Chạy

```bash
npm ci
npm run dev          # http://localhost:8080
npm test             # test bộ lõi
npm run typecheck
./scripts/test-db.sh # chạy mọi migration và test phân quyền trên PostgreSQL cục bộ (cần PostgreSQL 15+)
```

Biến môi trường tuỳ chọn: `VITE_CONTACT_EMAIL` là email liên hệ hiển thị trên trang. Chưa đặt thì trang ẩn email.

## Triển khai

1. Áp dụng migration lên Supabase (`supabase db push` hoặc trình SQL của dự án).
2. Gán người kiểm duyệt: `insert into public.user_roles (user_id, role) values ('<uuid>', 'moderator');`
3. Build và đăng web (`npm run build`).

## Giấy phép

Chưa có tệp giấy phép trong repo. Chủ dự án cần chọn giấy phép.
