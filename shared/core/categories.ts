import type { Typology } from './types.ts';

// Report categories. The codes are stored in reports.scam_category and checked
// by the submit_report database function; keep the two lists in sync.
export const REPORT_CATEGORIES: { code: Exclude<Typology, 'unknown'> | 'other'; vi: string; en: string }[] = [
  { code: 'impersonate_authority', vi: 'Mạo danh công an, thuế, điện lực, nhà mạng', en: 'Impersonating police, tax, utility or carrier' },
  { code: 'fake_app_apk', vi: 'Dụ cài ứng dụng, file .apk', en: 'Tricking you into installing an app or .apk' },
  { code: 'remote_control', vi: 'Điều khiển điện thoại từ xa, chia sẻ màn hình', en: 'Remote control or screen sharing' },
  { code: 'bank_phishing', vi: 'Giả ngân hàng, lấy OTP, mật khẩu', en: 'Fake bank, stealing OTP or password' },
  { code: 'job_task', vi: 'Việc nhẹ lương cao, làm nhiệm vụ', en: 'Easy job, high pay / task scam' },
  { code: 'investment', vi: 'Đầu tư, tiền ảo, sàn giao dịch', en: 'Investment, crypto, trading platform' },
  { code: 'prize', vi: 'Trúng thưởng, quà tặng', en: 'Prize or gift' },
  { code: 'delivery', vi: 'Giao hàng, mua sắm online', en: 'Delivery or online shopping' },
  { code: 'loan_fee', vi: 'Cho vay, đòi phí trước', en: 'Loan with upfront fee' },
  { code: 'recovery_scam', vi: 'Hứa lấy lại tiền đã bị lừa', en: 'Promise to recover scammed money' },
  { code: 'brand_impersonation', vi: 'Website, trang giả thương hiệu', en: 'Fake website or brand page' },
  { code: 'other', vi: 'Khác', en: 'Other' },
];
