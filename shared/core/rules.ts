// Fixed rules for known Vietnamese scam scripts and risky links. These are the
// deterministic floor of every verdict: a model may add to them, never remove.
// Patterns run on folded text (lowercase, no diacritics).

import type { Entity, Reason } from './types.ts';
import { foldVietnamese } from './text.ts';
import { normalizePhone, URL_SHORTENERS, isIpHost } from './normalize.ts';
import {
  GOVERNMENT_TOKENS,
  OFFICIAL_DOMAINS,
  OFFICIAL_SERVICE_NUMBERS,
  findOfficialDomain,
  isGovernmentDomain,
} from './official.ts';

const NEGATION = /\b(khong|ko|dung|chang|tuyet doi|chua bao gio|never|do not|don't)\b/;

/** True when the pattern matches somewhere that is not just after a negation ("không cung cấp OTP"). */
function matchesUnnegated(text: string, pattern: RegExp): boolean {
  const global = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
  for (const m of text.matchAll(global)) {
    const before = text.slice(Math.max(0, (m.index ?? 0) - 30), m.index);
    if (!NEGATION.test(before)) return true;
  }
  return false;
}

const AUTHORITY =
  /(cong an|vneid|dinh danh (dien tu|muc 2)|co quan thue|cuc thue|chi cuc thue|hoan thue|quyet toan thue|ma so thue|dien luc|\bevn\b|bao hiem xa hoi|\bbhxh\b|toa an|vien kiem sat|dich vu cong|bo cong an|nha mang|so tai nguyen)/;
const BANK_WORDS = /(ngan hang|tai khoan|\bthe (atm|tin dung)|vi dien tu|\bstk\b)/;
const INSTALL = /(cai dat|cai app|cai ung dung|tai (ung dung|app)|tai ve|link tai|ban cap nhat|cap nhat (ung dung|app))/;

interface TextRule {
  test: (t: string, hasUrl: boolean) => boolean;
  reason: Reason;
}

const TEXT_RULES: TextRule[] = [
  {
    test: (t) =>
      matchesUnnegated(
        t,
        /(cung cap|doc|bao lai|bao cho|chup|gui lai|gui cho|chia se|dua|nhan tin)(\s+\S+){0,3}?\s+(ma\s+)?(otp|xac thuc|xac minh|mat khau|ma pin)\b/,
      ) || /(share|send|tell|read)( me)?( the| your)? (otp|password|pin)\b/.test(t),
    reason: {
      code: 'otp_request',
      severity: 'danger',
      source: 'rule',
      typology: 'bank_phishing',
      action: 'never_share_otp',
      vi: 'Tin nhắn đòi bạn cung cấp mã OTP hoặc mật khẩu. Ngân hàng và cơ quan nhà nước không bao giờ hỏi.',
      en: 'The message asks for your OTP or password. Banks and authorities never ask for these.',
    },
  },
  {
    test: (t) =>
      matchesUnnegated(
        t,
        /tai khoan (an toan|tam giu|chuyen dung|cua co quan|cua (bo )?cong an)|(chuyen|nop|gui) (tien|toan bo tien|so tien)(\s+\S+){0,6}?\s+(de )?(xac minh|kiem tra|doi chieu|phong toa|tam giu|chung minh)|(xac minh|chung minh) (nguon goc )?dong tien/,
      ),
    reason: {
      code: 'safe_account',
      severity: 'danger',
      source: 'rule',
      typology: 'impersonate_authority',
      action: 'do_not_transfer',
      vi: 'Yêu cầu chuyển tiền vào "tài khoản an toàn" hoặc để "xác minh" là thủ đoạn mạo danh công an, ngân hàng.',
      en: 'Asking you to move money to a "safe account" or to "verify" it is a classic impersonation script.',
    },
  },
  {
    test: (t, hasUrl) => AUTHORITY.test(t) && INSTALL.test(t) && (hasUrl || /\.apk|\blink\b/.test(t)),
    reason: {
      code: 'authority_install_app',
      severity: 'danger',
      source: 'rule',
      typology: 'fake_app_apk',
      action: 'do_not_install',
      vi: 'Người xưng là cơ quan nhà nước, điện lực hay nhà mạng gửi link bắt cài ứng dụng. Cơ quan thật không làm vậy.',
      en: 'Someone claiming to be an agency, utility or carrier sends a link to install an app. Real agencies do not.',
    },
  },
  {
    test: (t) => /\.apk\b|file apk|tep apk/.test(t),
    reason: {
      code: 'apk_file',
      severity: 'danger',
      source: 'rule',
      typology: 'fake_app_apk',
      action: 'do_not_install',
      vi: 'Có file cài đặt .apk ngoài kho ứng dụng. Loại file này thường là mã độc chiếm quyền điện thoại.',
      en: 'There is an .apk installer outside the app store. These are often malware that takes over the phone.',
    },
  },
  {
    test: (t) =>
      /(tro nang|accessibility|chia se man hinh|share man hinh|teamviewer|anydesk|ultraviewer)/.test(t) &&
      (AUTHORITY.test(t) || BANK_WORDS.test(t)),
    reason: {
      code: 'remote_control',
      severity: 'danger',
      source: 'rule',
      typology: 'remote_control',
      action: 'do_not_install',
      vi: 'Bị yêu cầu bật Trợ năng hoặc chia sẻ màn hình khi nói chuyện về tiền, tài khoản: kẻ gian có thể điều khiển máy bạn.',
      en: 'Being asked to enable Accessibility or share your screen while money or accounts are discussed: they can control your phone.',
    },
  },
  {
    test: (t) =>
      /(viec nhe luong cao|lam nhiem vu|nhiem vu (tren app|online)|chot don|tha tim|cong tac vien|\bctv\b|lam viec tai nha)/.test(t) &&
      /(nap tien|ung truoc|dong phi|nop phi|dat coc)/.test(t),
    reason: {
      code: 'job_task_deposit',
      severity: 'danger',
      source: 'rule',
      typology: 'job_task',
      action: 'do_not_transfer',
      vi: 'Việc làm online bắt nạp tiền, ứng trước hay đóng phí là lừa đảo "làm nhiệm vụ": trả thưởng nhỏ trước, rồi giữ tiền lớn.',
      en: 'An online job that needs a deposit or fee is a "task" scam: small payouts first, then they keep the large sums.',
    },
  },
  {
    test: (t) =>
      /(viec nhe luong cao|lam nhiem vu|nhiem vu (tren app|online)|chot don|tha tim)/.test(t) &&
      /(hoa hong|hoan tien|thanh toan don)/.test(t),
    reason: {
      code: 'job_task',
      severity: 'warning',
      source: 'rule',
      typology: 'job_task',
      action: 'do_not_transfer',
      vi: 'Lời mời "việc nhẹ lương cao", "chốt đơn", "làm nhiệm vụ" ăn hoa hồng là kịch bản lừa đảo phổ biến.',
      en: '"Easy job, high pay", "order confirmation" or commission tasks are a common scam script.',
    },
  },
  {
    test: (t) =>
      /((lay|doi|hoan) lai|thu hoi|ho tro lay lai)(\s+\S+){0,3}?\s+(so )?tien(\s+\S+){0,3}?\s+(da )?(bi )?(lua|mat)/.test(t),
    reason: {
      code: 'recovery_offer',
      severity: 'danger',
      source: 'rule',
      typology: 'recovery_scam',
      action: 'stop_recovery_offer',
      vi: 'Lời hứa lấy lại tiền đã bị lừa (giả luật sư, hacker, cán bộ) là "lừa đảo lần hai". Chỉ công an mới thụ lý vụ việc.',
      en: 'Promises to recover scammed money (fake lawyers, hackers, officials) are "second scams". Only the police handle cases.',
    },
  },
  {
    test: (t) =>
      /(trung thuong|trung giai|qua tang|tri an khach hang|quay so|nhan thuong|phan thuong)/.test(t) &&
      /(phi|chuyen khoan|thanh toan|nop tien|dong tien|thue thu nhap)/.test(t),
    reason: {
      code: 'prize_fee',
      severity: 'warning',
      source: 'rule',
      typology: 'prize',
      action: 'do_not_transfer',
      vi: 'Báo trúng thưởng nhưng đòi đóng phí hay thuế trước: giải thưởng thật không bắt bạn trả tiền để nhận.',
      en: 'A prize that needs a fee or tax paid first: real prizes do not require payment to claim.',
    },
  },
  {
    test: (t) =>
      /(loi nhuan|lai)\s*(tu\s*)?\d+([.,]\d+)?\s*%\s*(\/|moi|mot|1)?\s*(ngay|tuan)|cam ket (loi nhuan|lai|khong lo|hoan von)|bao lo|x2 tai khoan|nhan doi (so )?tien/.test(
        t,
      ),
    reason: {
      code: 'guaranteed_return',
      severity: 'warning',
      source: 'rule',
      typology: 'investment',
      action: 'do_not_transfer',
      vi: 'Cam kết lãi cao theo ngày, theo tuần hoặc "không lỗ" là dấu hiệu đầu tư lừa đảo.',
      en: 'Guaranteed daily or weekly returns, or "no loss", signal an investment scam.',
    },
  },
  {
    test: (t) => /(usdt|bitcoin|tien ao|san giao dich|san dau tu|forex|ngoai hoi)/.test(t) && /(nap|loi nhuan|lai)/.test(t),
    reason: {
      code: 'crypto_platform',
      severity: 'warning',
      source: 'rule',
      typology: 'investment',
      action: 'do_not_transfer',
      vi: 'Mời nạp tiền vào sàn tiền ảo, ngoại hối lạ: tiền nạp vào thường không rút ra được.',
      en: 'Invitations to deposit on unfamiliar crypto or forex platforms: deposits usually cannot be withdrawn.',
    },
  },
  {
    test: (t, hasUrl) =>
      hasUrl &&
      /(tai khoan|the atm|the tin dung|vi dien tu|vneid)(\s+\S+){0,6}?\s+(bi khoa|tam khoa|bi dong bang|bi han che|bi vo hieu|het han|se bi khoa|bi tam ngung)/.test(
        t,
      ),
    reason: {
      code: 'account_locked_link',
      severity: 'warning',
      source: 'rule',
      typology: 'bank_phishing',
      action: 'do_not_click',
      vi: 'Báo tài khoản bị khoá kèm link: link thường dẫn tới trang giả để lấy mật khẩu, OTP.',
      en: 'An "account locked" notice with a link: the link usually leads to a fake page that steals passwords and OTPs.',
    },
  },
  {
    test: (t, hasUrl) =>
      hasUrl &&
      /(don hang|buu pham|buu kien|kien hang|giao hang)/.test(t) &&
      /(phi|thanh toan|cap nhat dia chi|xac nhan dia chi|that bai)/.test(t),
    reason: {
      code: 'delivery_link',
      severity: 'warning',
      source: 'rule',
      typology: 'delivery',
      action: 'do_not_click',
      vi: 'Tin giao hàng kèm link đòi phí hoặc cập nhật địa chỉ: hãy kiểm tra trong ứng dụng mua sắm hoặc hãng giao hàng.',
      en: 'A delivery text with a link asking for a fee or address update: check inside the shopping or courier app instead.',
    },
  },
  {
    test: (t) => /(lenh bat|bi khoi to|giay trieu tap|lien quan (den )?(vu an|duong day|rua tien|ma tuy)|rua tien|truy na)/.test(t),
    reason: {
      code: 'legal_threat',
      severity: 'warning',
      source: 'rule',
      typology: 'impersonate_authority',
      action: 'hang_up_call_official',
      vi: 'Đe doạ bắt, khởi tố, "liên quan đường dây rửa tiền" qua điện thoại, tin nhắn: công an thật làm việc trực tiếp, có giấy tờ.',
      en: 'Threats of arrest or money-laundering charges by phone or text: real police work in person, with paperwork.',
    },
  },
  {
    test: (t) =>
      /khong (duoc )?(noi|bao|ke|chia se) (voi|cho) (ai|nguoi than|gia dinh|bat ky ai)|giu bi mat (cuoc goi|thong tin|vu viec)|bi mat dieu tra/.test(t),
    reason: {
      code: 'secrecy',
      severity: 'warning',
      source: 'rule',
      typology: 'impersonate_authority',
      action: 'verify_in_person',
      vi: 'Bị dặn giữ bí mật, không kể với người thân: kẻ gian cô lập bạn để không ai can ngăn.',
      en: 'Being told to keep it secret from family: scammers isolate you so no one can stop it.',
    },
  },
  {
    test: (t) =>
      /(vay|giai ngan|khoan vay)/.test(t) &&
      /(phi ho so|phi giai ngan|phi bao hiem|dong truoc|nop truoc|dat coc|chung minh thu nhap bang)/.test(t),
    reason: {
      code: 'loan_fee',
      severity: 'warning',
      source: 'rule',
      typology: 'loan_fee',
      action: 'do_not_transfer',
      vi: 'Cho vay nhưng bắt đóng phí trước khi giải ngân: tổ chức tín dụng thật trừ phí vào khoản vay, không thu trước.',
      en: 'A loan that needs a fee before disbursement: real lenders deduct fees from the loan, not before.',
    },
  },
  {
    test: (t) =>
      /(chuyen giup|chuyen khoan giup|chuyen cho|gui giup|cho (con|em|minh|chau|anh|chi) muon|vay)/.test(t) &&
      /(tai khoan|stk|so tk)\s*(nay\s*)?(cua|ben)\s*(ban|nguoi quen|dong nghiep)\b|(stk|so tai khoan|tai khoan) nay (cua|nhe|nha|giup)/.test(t),
    reason: {
      code: 'third_party_account',
      severity: 'warning',
      source: 'rule',
      typology: 'impersonate_authority',
      action: 'verify_in_person',
      vi: 'Người quen nhắn nhờ chuyển tiền vào tài khoản của người khác: tài khoản Zalo, Facebook của họ có thể đã bị chiếm. Hãy gọi lại bằng số đã lưu từ trước.',
      en: 'A contact asks you to send money to someone else\'s account: their Zalo or Facebook may be hijacked. Call them back on the number you saved earlier.',
    },
  },
  {
    test: (t) => /(goi video|video call)/.test(t) && /(muon tien|chuyen tien|vay tien|chuyen giup)/.test(t),
    reason: {
      code: 'video_money_request',
      severity: 'warning',
      source: 'rule',
      typology: 'impersonate_authority',
      action: 'verify_in_person',
      vi: 'Hỏi vay, nhờ chuyển tiền sau cuộc gọi video: hình và giọng có thể bị giả bằng AI.',
      en: 'Money requests after a video call: faces and voices can be faked with AI.',
    },
  },
  {
    test: (t) => /(khan cap|ngay lap tuc|trong vong \d+ (phut|gio)|het han (trong )?hom nay|gap gap)/.test(t),
    reason: {
      code: 'urgency',
      severity: 'info',
      source: 'rule',
      vi: 'Tạo áp lực thời gian ("khẩn cấp", "trong 30 phút") để bạn không kịp suy nghĩ.',
      en: 'Time pressure ("urgent", "within 30 minutes") so you do not stop to think.',
    },
  },
];

export function evaluateText(text: string, hasUrl: boolean): Reason[] {
  const t = foldVietnamese(text);
  return TEXT_RULES.filter((r) => r.test(t, hasUrl)).map((r) => r.reason);
}

const SUSPICIOUS_WORDS = /(hotro|ho-tro|xacminh|xac-minh|khuyenmai|uudai|login|dangnhap|dang-nhap|verify|support|cskh|baomat|capnhat|online|secure|account)/;

/** The host without its public suffix: where brand and government words are looked for. */
export function hostLabels(host: string): string {
  return host.replace(/\.(com|net|org|edu|gov|ac|info|biz)?\.?vn$|\.[a-z]+$/, '');
}

function hasGovernmentToken(host: string): boolean {
  const body = hostLabels(host);
  return GOVERNMENT_TOKENS.some((token) =>
    token === 'gov' ? /(^|[.-])gov([.-]|vn|$)/.test(body) : body.includes(token),
  );
}

export function evaluateEntity(entity: Entity): Reason[] {
  if (entity.kind === 'phone') {
    if (OFFICIAL_SERVICE_NUMBERS[entity.key]) {
      return [
        {
          code: 'official_service_number',
          severity: 'official',
          source: 'official_list',
          vi: `${entity.key} là số dịch vụ công cộng (${OFFICIAL_SERVICE_NUMBERS[entity.key]}).`,
          en: `${entity.key} is a public service number.`,
        },
      ];
    }
    const phone = normalizePhone(entity.raw);
    if (phone?.type === 'international') {
      return [
        {
          code: 'foreign_number',
          severity: 'info',
          source: 'rule',
          action: 'hang_up_call_official',
          vi: 'Số nước ngoài. Ngân hàng và cơ quan nhà nước Việt Nam không gọi cho bạn từ số nước ngoài.',
          en: 'A foreign number. Vietnamese banks and agencies do not call you from foreign numbers.',
        },
      ];
    }
    return [];
  }

  if (entity.kind !== 'url' || !entity.url || !entity.domain) return [];

  const host = new URL(entity.url).hostname;
  const domain = entity.domain;
  const reasons: Reason[] = [];

  if (/\.apk(\?|$)/i.test(entity.url)) {
    reasons.push({
      code: 'apk_link',
      severity: 'danger',
      source: 'rule',
      typology: 'fake_app_apk',
      action: 'do_not_install',
      vi: 'Link tải thẳng file .apk ngoài kho ứng dụng: rất có thể là mã độc.',
      en: 'The link downloads an .apk outside the app store: very likely malware.',
    });
  }

  const official = findOfficialDomain(domain);
  if (official || isGovernmentDomain(domain)) {
    reasons.push({
      code: 'official_domain',
      severity: 'official',
      source: 'official_list',
      vi: official
        ? `${domain} là tên miền chính thức của ${official.brand}.`
        : `${domain} là tên miền cơ quan nhà nước (.gov.vn).`,
      en: official ? `${domain} is the official domain of ${official.brand}.` : `${domain} is a government domain (.gov.vn).`,
    });
    return reasons;
  }

  if (URL_SHORTENERS.has(host)) {
    reasons.push({
      code: 'url_shortener',
      severity: 'warning',
      source: 'rule',
      action: 'do_not_click',
      vi: 'Link rút gọn che địa chỉ thật. Đừng bấm nếu không biết rõ người gửi.',
      en: 'A shortened link hides the real address. Do not tap unless you know the sender.',
    });
  }
  if (isIpHost(host)) {
    reasons.push({
      code: 'ip_host',
      severity: 'warning',
      source: 'rule',
      action: 'do_not_click',
      vi: 'Link dùng địa chỉ IP thay vì tên miền: trang của tổ chức thật không làm vậy.',
      en: 'The link uses a raw IP address instead of a domain: real organisations do not.',
    });
  }

  if (hasGovernmentToken(host)) {
    reasons.push({
      code: 'fake_government_domain',
      severity: 'danger',
      source: 'rule',
      typology: 'brand_impersonation',
      action: 'do_not_click',
      vi: `${domain} mang tên giống cơ quan nhà nước nhưng không phải .gov.vn. Trang dịch vụ công thật luôn có đuôi .gov.vn.`,
      en: `${domain} looks like a government site but is not .gov.vn. Real government services always end in .gov.vn.`,
    });
  }

  const body = hostLabels(host);
  const punycode = host.split('.').some((label) => label.startsWith('xn--'));
  for (const brand of OFFICIAL_DOMAINS) {
    if (!brand.tokens.some((token) => body.includes(token))) continue;
    const strong = punycode || SUSPICIOUS_WORDS.test(body) || /-/.test(body);
    reasons.push({
      code: 'brand_lookalike',
      severity: strong ? 'danger' : 'warning',
      source: 'rule',
      typology: 'brand_impersonation',
      action: 'do_not_click',
      vi: `${domain} chứa tên ${brand.brand} nhưng không phải tên miền chính thức (${brand.domain}).`,
      en: `${domain} contains the name ${brand.brand} but is not its official domain (${brand.domain}).`,
    });
    break;
  }
  if (punycode && !reasons.some((r) => r.code === 'brand_lookalike')) {
    reasons.push({
      code: 'punycode',
      severity: 'warning',
      source: 'rule',
      action: 'do_not_click',
      vi: 'Tên miền dùng ký tự đặc biệt có thể giả chữ cái của trang thật.',
      en: 'The domain uses special characters that can imitate letters of a real site.',
    });
  }
  return reasons;
}
