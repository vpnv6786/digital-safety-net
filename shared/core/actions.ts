import type { ActionCode } from './types.ts';

// One thing to do now. Short, imperative, readable by someone in a hurry.
export const ACTIONS: Record<ActionCode, { vi: string; en: string }> = {
  do_not_transfer: {
    vi: 'Không chuyển tiền. Không cơ quan hay ngân hàng nào bắt bạn chuyển tiền để "xác minh".',
    en: 'Do not transfer money. No agency or bank asks you to transfer money to "verify" anything.',
  },
  do_not_install: {
    vi: 'Không cài ứng dụng theo link hay hướng dẫn qua điện thoại. Chỉ cài từ App Store hoặc Google Play.',
    en: 'Do not install apps from a link or phone instructions. Install only from App Store or Google Play.',
  },
  never_share_otp: {
    vi: 'Không đọc, chụp hay gửi mã OTP, mật khẩu cho bất kỳ ai, kể cả người xưng là ngân hàng.',
    en: 'Never read out, screenshot or send an OTP or password to anyone, even someone claiming to be the bank.',
  },
  hang_up_call_official: {
    vi: 'Cúp máy. Tự gọi lại số chính thức (in trên thẻ hoặc website chính thức), không gọi số họ đưa.',
    en: 'Hang up. Call the official number yourself (on your card or the official website), not the one they gave.',
  },
  do_not_click: {
    vi: 'Không bấm link. Tự gõ địa chỉ chính thức hoặc mở ứng dụng chính thức.',
    en: 'Do not tap the link. Type the official address yourself or open the official app.',
  },
  verify_in_person: {
    vi: 'Gọi lại cho người thân bằng số bạn đã lưu từ trước, hoặc gặp trực tiếp, trước khi làm gì.',
    en: 'Call your relative back on the number you already saved, or meet them, before doing anything.',
  },
  verify_official: {
    vi: 'Chưa đủ dữ liệu để kết luận. Hãy xác minh qua kênh chính thức trước khi chuyển tiền, cài app hay bấm link.',
    en: 'Not enough data to conclude. Verify through an official channel before sending money, installing apps or tapping links.',
  },
  stop_recovery_offer: {
    vi: 'Không trả phí cho ai hứa lấy lại tiền đã bị lừa. Hãy trình báo công an.',
    en: 'Do not pay anyone who promises to recover scammed money. Report to the police.',
  },
};
