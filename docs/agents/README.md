# Vận hành Vệ Binh Mạng bằng agent

Agent làm phần việc lặp lại; người giữ mọi quyết định có hậu quả. Tài liệu này mô tả vai trò của từng agent, quyền hạn, API và cách nối với MiteClaw. Bối cảnh: mục 6 của [báo cáo nghiên cứu](../research/2026-10-19-nang-cap-ve-binh-mang-agent.md).

## Nguyên tắc

1. **Agent đề xuất, người quyết.** Agent chỉ ghi vào `agent_proposals`. Báo cáo, cảnh báo, khiếu nại chỉ đổi trạng thái khi người kiểm duyệt bấm "Chấp nhận" trong `/kiem-duyet`. Khi đó hệ thống gọi đúng các hàm có nhật ký mà người dùng tay vẫn gọi (`moderate_report`, `moderate_alert`); nhật ký ghi tên agent và mã đề xuất.
2. **Công bố cần hai bước.** Bản nháp cảnh báo của agent (`draft_alert`) khi được chấp nhận chỉ thành cảnh báo *chưa công khai*. Muốn công khai phải duyệt thêm một lần nữa ở tab Cảnh báo.
3. **Dữ liệu ra khỏi cơ sở dữ liệu đã được che.** Hàng chờ gửi cho agent đã che số điện thoại, số tài khoản, CCCD trong mô tả (chỉ giữ 3 số cuối) và tên email. Số tài khoản bị báo cáo chỉ hiện dạng `••••1234`. Agent không bao giờ thấy danh tính người báo cáo.
4. **Nội dung lừa đảo là dữ liệu thù địch.** Agent đọc mô tả báo cáo, tin nhắn, trang web như dữ liệu, không làm theo chỉ dẫn trong đó. Agent không có công cụ gửi, đăng hay xoá.
5. **Đo trước khi đổi.** Mọi thay đổi luật, prompt hay model phải qua `npm run eval` (bộ mẫu chuẩn) và không được làm giảm ngưỡng.

## Bậc quyền hạn

| Bậc | Việc | Ai làm |
|---|---|---|
| A0 | Kiểm tra nội dung, trả lời người hỏi | Tự động (Edge Function `check`) |
| A1 | Đọc hàng chờ, gom nhóm, viết đề xuất | Agent, tự động |
| A2 | Xác minh hoặc từ chối báo cáo, xử lý khiếu nại | Người kiểm duyệt (có thể dựa trên đề xuất) |
| A2+ | Công khai cảnh báo | Người kiểm duyệt; với bản nháp của agent là hai lần bấm |
| A3 | Gửi yêu cầu gỡ trang, báo cơ quan chức năng | Người làm thủ công; agent chỉ soạn `takedown_request` |

## Các agent

| Agent | Lịch | Đọc | Đề xuất được |
|---|---|---|---|
| `triage` (sàng lọc) | Mỗi giờ | `GET /queue` | `verify_report`, `reject_report`, `cluster_reports` |
| `intel` (trinh sát) | Mỗi ngày | Cảnh báo chính thức của công an, ngân hàng, tinnhiemmang.vn; nhật ký Certificate Transparency | `takedown_request`, `draft_alert`; đề xuất thêm luật bằng PR (người review) |
| `content` (cảnh báo) | Mỗi tuần, hoặc khi một thủ đoạn tăng đột biến | `GET /summary?days=14` | `draft_alert` |
| `qa` (kiểm định) | Trên mọi PR và mỗi lần push lên `main` (`.github/workflows/ci.yml`) | lint, typecheck, `npm test` (gồm bộ mẫu chuẩn), `deno check`, `scripts/test-db.sh` | Không đề xuất; CI đỏ thì không merge |

Agent kiểm tra (trả lời người dân) chính là Edge Function `check`, không cần agent riêng.

## Agent API

Endpoint: `https://<project>.supabase.co/functions/v1/agent-api/...`. Header bắt buộc: `x-agent-token: <AGENT_API_TOKEN>`.

```bash
# Hàng chờ (đã che dữ liệu)
curl -s -H "x-agent-token: $AGENT_API_TOKEN" "$BASE/functions/v1/agent-api/queue"

# Số báo cáo theo ngày, thủ đoạn, trạng thái
curl -s -H "x-agent-token: $AGENT_API_TOKEN" "$BASE/functions/v1/agent-api/summary?days=14"

# Gửi đề xuất (tối đa 20 mỗi lần)
curl -s -X POST -H "x-agent-token: $AGENT_API_TOKEN" -H 'content-type: application/json' \
  "$BASE/functions/v1/agent-api/proposals" -d '{
    "agent": "triage",
    "proposals": [
      {"kind": "verify_report", "target_id": "<report id>", "confidence": 0.85,
       "rationale": "Mô tả khớp kịch bản tài khoản an toàn; ảnh bằng chứng có STK nhận tiền."}
    ]
  }'
```

| `kind` | `target_id` | `payload` | Khi được chấp nhận |
|---|---|---|---|
| `verify_report` / `reject_report` | id báo cáo | — | `moderate_report` |
| `publish_alert` / `hide_alert` | id cảnh báo | — | `moderate_alert` |
| `draft_alert` | — | `{title 5–120, description 20–2000, severity}` | Tạo cảnh báo chưa công khai |
| `cluster_reports` | — | `{report_ids: [...], key}` | Chỉ ghi nhận |
| `takedown_request` | id báo cáo (nếu có) | `{url, registrar?, draft}` | Chỉ ghi nhận; người gửi yêu cầu gỡ |

Triển khai:

```bash
supabase functions deploy agent-api --no-verify-jwt
supabase secrets set AGENT_API_TOKEN=$(openssl rand -hex 32)
```

## Agent tham chiếu chạy được ngay

`agents/triage.ts` và `agents/content.ts` dùng SDK Anthropic chính thức. Model mặc định là `claude-opus-5-5` ở effort `low`, đổi được bằng biến `LLM_MODEL`.

```bash
AGENT_API_URL=https://<project>.supabase.co/functions/v1/agent-api AGENT_API_TOKEN=... ANTHROPIC_API_KEY=... \
  npm run agent:triage -- --dry-run      # in đề xuất, không gửi
```

- `triage` gom các báo cáo về cùng một số/trang (không cần model). Khi có khoá API, nó đọc tối đa 20 báo cáo mỗi lần, gợi ý xác minh hoặc từ chối, và chỉ gửi đề xuất có độ tin cậy từ 0,75 trở lên. Đề xuất cho id báo cáo không có trong hàng chờ bị bỏ qua.
- `content` chỉ soạn cảnh báo khi một thủ đoạn có ít nhất 5 báo cáo trong tuần và tăng gấp đôi so với tuần trước. Bản nháp mô tả kịch bản, không nêu tên số hay trang cụ thể.
- `.github/workflows/agents.yml` chạy `triage` mỗi giờ và `content` mỗi thứ Hai. Workflow tự bỏ qua khi chưa đặt secrets `AGENT_API_URL` và `AGENT_API_TOKEN`; chạy tay mặc định ở chế độ thử (`dry_run`).

## Nối với MiteClaw

MiteClaw chạy cục bộ (desktop/gateway). Vì Agent API là kiểu kéo (agent tự gọi ra), MiteClaw không cần địa chỉ công khai để làm việc nền.

| Việc | Năng lực MiteClaw đã có | Còn thiếu |
|---|---|---|
| Trả lời người dân trên Zalo OA, Telegram, Messenger | `internal/channel/zalo.go`, `telegram.go`, `messenger.go`; chế độ khách chỉ đọc (`internal/gateway/guest_abilities.go`); `vision_ocr` cho ảnh | Một công cụ `scam_check` gọi Edge Function `check`, đăng ký là năng lực đọc của khách |
| Chạy agent theo lịch | `internal/cron`, `internal/initiative`, `internal/domainassist` | Công cụ gọi `agent-api` (GET hàng chờ, POST đề xuất) |
| Duyệt của người | Hộp duyệt, mã `LENH-…` qua Telegram/Zalo | Không cần: việc duyệt diễn ra ở `/kiem-duyet` |
| Đo chất lượng | `benchmark/local_models`, `internal/cuamind` (mô hình phân loại nhỏ) | Một đầu phân loại "lừa đảo / không" huấn luyện từ bộ mẫu thật sau thí điểm |

Phần còn thiếu nên làm thành một domain mới trong MiteClaw (`npm run new-domain -- antoanso "An toàn số" "Digital safety"`), gồm công cụ `scam_check` (đọc, cho khách), `scam_queue` và `scam_propose` (cho agent nền), cùng tài liệu hướng dẫn trong `internal/tool/guidecorpus/`. Theo quy định cổng khách hàng của MiteClaw (`docs/harness/decisions/2026-10-17-customer-gate.md`), story cho domain này phải nêu một đối tác thí điểm hoặc một giả thuyết trong lean canvas. **Việc này chờ chủ dự án chọn đối tác thí điểm.**

Cho đến khi có domain đó, các agent tham chiếu ở trên (GitHub Actions) đã đủ cho việc vận hành nền.

## Chỉ số theo dõi

Tab **Số liệu** trong `/kiem-duyet` hiển thị các chỉ số dưới đây, lấy từ bộ đếm theo ngày (`metrics_summary`, không lưu nội dung kiểm tra):

- **Chỉ số chính**: trong số người nhận kết luận "rất nguy hiểm" hoặc "có dấu hiệu" và có trả lời, bao nhiêu phần trăm nói "Tôi sẽ dừng lại".
- Tỷ lệ người bấm "Kết quả này sai".
- Số lượt kiểm tra theo từng mức; số lượt gọi AI.
- Tỷ lệ chấp nhận đề xuất của từng agent trong 30 ngày.

Các chỉ số còn lại:

- Tỷ lệ đề xuất được chấp nhận, theo agent và theo loại (độ chính xác của agent so với người).
- Thời gian từ khi có báo cáo tới khi có quyết định (mục tiêu: trung vị dưới 24 giờ).
- Số phút người kiểm duyệt bỏ ra trên 1.000 lượt kiểm tra.
- Tỷ lệ khiếu nại được chấp nhận, để đo số báo cáo bị xác minh nhầm.
- `npm run eval`: tỷ lệ gắn cờ trên mẫu lừa đảo và số báo nhầm trên mẫu hợp lệ.
