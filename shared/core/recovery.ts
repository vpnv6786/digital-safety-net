// What to do after a scam, ordered by urgency and picked by what happened.
// Shared so every channel (web, chat bots) gives the same steps. No step names
// a phone number: official numbers live in VERIFIED_CONTACTS, and bank hotlines
// must come from the person's card or official app.

export type RecoverySituation = 'transferred' | 'installed_app' | 'shared_otp' | 'shared_id' | 'account_taken';

export const RECOVERY_SITUATIONS: { code: RecoverySituation; vi: string; en: string; reportVi: string }[] = [
  {
    code: 'transferred',
    vi: 'Tôi đã chuyển tiền',
    en: 'I sent money',
    reportVi: 'Tôi đã chuyển tiền cho người này.',
  },
  {
    code: 'installed_app',
    vi: 'Tôi đã cài ứng dụng hoặc cho người khác điều khiển máy',
    en: 'I installed an app or let someone control my phone',
    reportVi: 'Tôi đã cài ứng dụng theo hướng dẫn của người này.',
  },
  {
    code: 'shared_otp',
    vi: 'Tôi đã đưa mã OTP hoặc mật khẩu',
    en: 'I gave away an OTP or password',
    reportVi: 'Tôi đã cung cấp mã OTP hoặc mật khẩu cho người này.',
  },
  {
    code: 'shared_id',
    vi: 'Tôi đã gửi ảnh CCCD, khuôn mặt hoặc thông tin cá nhân',
    en: 'I sent ID photos, a face scan or personal details',
    reportVi: 'Tôi đã gửi ảnh căn cước công dân, ảnh khuôn mặt hoặc thông tin cá nhân cho người này.',
  },
  {
    code: 'account_taken',
    vi: 'Zalo, Facebook hoặc email của tôi bị chiếm',
    en: 'My Zalo, Facebook or email was taken over',
    reportVi: 'Tài khoản mạng xã hội hoặc email của tôi bị chiếm quyền.',
  },
];

export interface RecoveryStep {
  id: string;
  /** Situations that call for this step; 'always' applies to everyone. */
  when: RecoverySituation[] | 'always';
  vi: string;
  en: string;
  detailVi: string;
  detailEn: string;
}

// Order matters: cut off the attacker first, then stop the money, then secure
// accounts, then report. Someone in a hurry may only read the first two.
export const RECOVERY_STEPS: RecoveryStep[] = [
  {
    id: 'go_offline',
    when: ['installed_app'],
    vi: 'Ngắt mạng điện thoại ngay',
    en: 'Take the phone offline now',
    detailVi:
      'Bật chế độ máy bay, tắt Wi-Fi. Ứng dụng lạ có thể đang điều khiển máy và đọc tin nhắn OTP. Gọi ngân hàng bằng một máy khác.',
    detailEn:
      'Turn on airplane mode and switch off Wi-Fi. The unknown app may be controlling the phone and reading OTP messages. Call your bank from another phone.',
  },
  {
    id: 'call_bank',
    when: ['transferred', 'shared_otp', 'installed_app'],
    vi: 'Gọi ngân hàng của bạn để khoá tài khoản và tra soát',
    en: 'Call your bank to lock your account and trace the transfer',
    detailVi:
      'Dùng số tổng đài in ở mặt sau thẻ hoặc trong ứng dụng ngân hàng chính thức, không dùng số ai đó gửi cho bạn. Đề nghị khoá thẻ, khoá ngân hàng điện tử, tra soát giao dịch và phối hợp phong toả tài khoản nhận tiền. Ghi lại giờ gọi và tên nhân viên.',
    detailEn:
      'Use the hotline printed on your card or inside the official banking app, never a number someone sent you. Ask to lock the card and online banking, trace the transaction and help freeze the receiving account. Note the time of the call and the agent’s name.',
  },
  {
    id: 'remove_app',
    when: ['installed_app'],
    vi: 'Gỡ ứng dụng lạ',
    en: 'Remove the unknown app',
    detailVi:
      'Tắt quyền Trợ năng (Accessibility) của ứng dụng đó rồi gỡ cài đặt. Nếu không gỡ được, tắt nguồn và mang máy tới cửa hàng uy tín. Chưa đăng nhập lại ngân hàng trên máy này cho tới khi máy sạch.',
    detailEn:
      'Turn off the app’s Accessibility permission, then uninstall it. If you cannot remove it, power off and take the phone to a trusted shop. Do not log in to banking on this phone until it is clean.',
  },
  {
    id: 'change_passwords',
    when: ['shared_otp', 'installed_app', 'account_taken'],
    vi: 'Đổi mật khẩu từ một thiết bị an toàn',
    en: 'Change passwords from a safe device',
    detailVi:
      'Đổi mật khẩu ngân hàng, email, Zalo, Facebook. Bật xác thực hai lớp và đăng xuất khỏi các thiết bị lạ trong phần cài đặt bảo mật. Mật khẩu nào dùng chung ở nhiều nơi thì đổi hết.',
    detailEn:
      'Change banking, email, Zalo and Facebook passwords. Turn on two-step verification and sign out unknown devices in the security settings. Change every place that shared the same password.',
  },
  {
    id: 'warn_contacts',
    when: ['account_taken'],
    vi: 'Báo người quen qua kênh khác',
    en: 'Warn your contacts another way',
    detailVi:
      'Gọi điện hoặc nhắn từ tài khoản khác rằng tài khoản của bạn bị chiếm, ai nhận tin vay tiền thì đừng chuyển. Lấy lại tài khoản bằng chức năng "Quên mật khẩu" trong ứng dụng chính thức; không thuê "dịch vụ lấy lại tài khoản".',
    detailEn:
      'Call or message from another account that yours was taken over and nobody should send money it asks for. Recover the account with "Forgot password" in the official app; never pay an "account recovery service".',
  },
  {
    id: 'watch_identity',
    when: ['shared_id'],
    vi: 'Đề phòng bị mạo danh bằng giấy tờ của bạn',
    en: 'Guard against identity misuse',
    detailVi:
      'Kẻ gian có thể dùng ảnh giấy tờ, khuôn mặt để mở tài khoản, vay tiền hoặc đăng ký SIM đứng tên bạn. Ghi rõ đã gửi gì, cho ai trong đơn trình báo. Thấy tin nhắn về khoản vay, tài khoản hay SIM lạ thì báo ngay ngân hàng hoặc nhà mạng đó. Không gửi thêm giấy tờ cho ai đòi "xác minh lại".',
    detailEn:
      'Scammers can use ID and face photos to open accounts, take loans or register SIM cards in your name. Write down what you sent and to whom in your police report. If you get messages about an unknown loan, account or SIM, tell that bank or carrier at once. Send no more documents to anyone asking to "re-verify".',
  },
  {
    id: 'keep_evidence',
    when: 'always',
    vi: 'Giữ lại bằng chứng',
    en: 'Keep the evidence',
    detailVi:
      'Chụp màn hình tin nhắn, cuộc gọi, tài khoản nhận tiền, link; lưu sao kê, biên lai chuyển tiền. Đừng xoá cuộc trò chuyện và đừng chặn số trước khi chụp lại.',
    detailEn:
      'Screenshot messages, calls, the receiving account and links; keep statements and transfer receipts. Do not delete the chat or block the number before you capture it.',
  },
  {
    id: 'report_police',
    when: 'always',
    vi: 'Trình báo công an',
    en: 'Report to the police',
    detailVi:
      'Đến công an xã, phường nơi bạn ở, mang theo giấy tờ tuỳ thân, bằng chứng và đơn trình báo (soạn sẵn ở dưới), hoặc gửi tố giác trên ứng dụng VNeID. Gọi 113 nếu đang bị đe doạ.',
    detailEn:
      'Go to your commune or ward police with ID, evidence and a written report (draft one below), or file a report in the VNeID app. Call 113 if you are being threatened.',
  },
  {
    id: 'second_scam',
    when: 'always',
    vi: 'Cảnh giác với "lừa đảo lần hai"',
    en: 'Watch out for a "second scam"',
    detailVi:
      'Sau khi bị lừa, bạn dễ bị nhắm lại bởi người xưng luật sư, hacker, cán bộ hứa lấy lại tiền nếu đóng phí. Không ai lấy lại tiền giúp bạn qua mạng. Chỉ làm việc với công an.',
    detailEn:
      'After a scam, people posing as lawyers, hackers or officials often promise to recover the money for a fee. Nobody recovers money for you online. Deal only with the police.',
  },
  {
    id: 'tell_and_report',
    when: 'always',
    vi: 'Báo cho người thân và báo cáo lên Vệ Binh Mạng',
    en: 'Tell your family and report it on Vệ Binh Mạng',
    detailVi: 'Kẻ gian thường lừa tiếp người quen của bạn. Báo cáo giúp người khác được cảnh báo sớm.',
    detailEn: 'Scammers often target your contacts next. Your report helps warn others early.',
  },
];

/** Steps for what happened, most urgent first. Nothing chosen shows every step. */
export function recoverySteps(situations: RecoverySituation[]): RecoveryStep[] {
  if (situations.length === 0) return RECOVERY_STEPS;
  return RECOVERY_STEPS.filter((s) => s.when === 'always' || s.when.some((w) => situations.includes(w)));
}

export interface PoliceReportInput {
  fullName?: string;
  birthYear?: string;
  idNumber?: string;
  address?: string;
  phone?: string;
  /** "Công an phường X, TP Y". */
  policeStation?: string;
  when?: string;
  /** How they reached you: a call from a number, a Zalo account, a website. */
  channel?: string;
  /** Numbers, accounts and links the scammer used. */
  scammerDetails?: string;
  story?: string;
  amount?: string;
  /** Each transfer: time, amount, receiving account and bank. */
  transfers?: string;
  situations?: RecoverySituation[];
  /** City or province for the signature line. */
  place?: string;
}

const BLANK = '..............................';

function field(value: string | undefined, blank = BLANK): string {
  const v = value?.trim();
  return v ? v : blank;
}

/** "5000000" → "5.000.000 đồng"; anything else is kept as written. */
export function formatAmount(value: string | undefined): string | undefined {
  const v = value?.trim();
  if (!v) return undefined;
  const digits = v.replace(/[.,\s]/g, '');
  if (!/^\d+$/.test(digits)) return v;
  return `${digits.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đồng`;
}

/**
 * A police report in the usual Vietnamese letter form, filled with what the
 * person typed. Empty fields stay as dotted lines to complete by hand. Built
 * in the browser only: it holds an ID number and bank details.
 */
export function policeReportText(input: PoliceReportInput, today: Date = new Date()): string {
  const happened = RECOVERY_SITUATIONS.filter((s) => input.situations?.includes(s.code)).map((s) => `- ${s.reportVi}`);
  const money = input.situations?.includes('transferred') || input.amount?.trim() || input.transfers?.trim();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');

  const lines = [
    'CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM',
    'Độc lập - Tự do - Hạnh phúc',
    '',
    'ĐƠN TRÌNH BÁO',
    '(V/v: bị lừa đảo qua mạng)',
    '',
    `Kính gửi: ${field(input.policeStation, 'Công an xã/phường ' + BLANK)}`,
    '',
    `Tôi tên là: ${field(input.fullName)}    Năm sinh: ${field(input.birthYear, '..........')}`,
    `Số căn cước công dân: ${field(input.idNumber)}`,
    `Nơi ở hiện tại: ${field(input.address)}`,
    `Số điện thoại liên hệ: ${field(input.phone)}`,
    '',
    'Tôi xin trình báo sự việc như sau:',
    '',
    `Thời gian xảy ra: ${field(input.when)}`,
    `Người này liên lạc với tôi qua: ${field(input.channel)}`,
    `Số điện thoại, tài khoản, đường link người này đã dùng: ${field(input.scammerDetails)}`,
    '',
    'Diễn biến sự việc:',
    field(input.story, `${BLANK}${BLANK}\n${BLANK}${BLANK}`),
  ];

  if (happened.length > 0) lines.push('', 'Những việc đã xảy ra:', ...happened);

  if (money) {
    lines.push(
      '',
      `Số tiền bị chiếm đoạt: ${field(formatAmount(input.amount))}`,
      'Các lần chuyển tiền (thời gian, số tiền, số tài khoản và ngân hàng nhận):',
      field(input.transfers, `${BLANK}${BLANK}`),
    );
  }

  lines.push(
    '',
    'Tài liệu gửi kèm: ảnh chụp tin nhắn, cuộc gọi; sao kê hoặc biên lai chuyển tiền (nếu có).',
    '',
    'Tôi đề nghị cơ quan công an xác minh, xử lý người có hành vi lừa đảo và hỗ trợ tôi thu hồi tài sản bị chiếm đoạt (nếu có). Tôi cam đoan những thông tin trên là đúng sự thật và chịu trách nhiệm trước pháp luật về lời khai của mình.',
    '',
    `${field(input.place, '..........')}, ngày ${day} tháng ${month} năm ${today.getFullYear()}`,
    'Người làm đơn',
    '(Ký và ghi rõ họ tên)',
    '',
    '',
    field(input.fullName, ''),
  );

  return lines.join('\n').trimEnd() + '\n';
}
