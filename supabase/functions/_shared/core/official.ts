// Official domains and contacts. Every entry was checked on 2026-10-19 by
// loading the site and reading its title, or comes from a cited government
// source. A wrong entry here would tell people a scam site is official, so add
// only what you have verified, with the date.

export interface OfficialDomain {
  domain: string;
  brand: string;
  /** Folded words that identify the brand in a hostname. Only distinctive words. */
  tokens: string[];
}

export const OFFICIAL_DOMAINS_VERIFIED_AT = '2026-10-19';

export const OFFICIAL_DOMAINS: OfficialDomain[] = [
  { domain: 'vietcombank.com.vn', brand: 'Vietcombank', tokens: ['vietcombank'] },
  { domain: 'techcombank.com', brand: 'Techcombank', tokens: ['techcombank'] },
  { domain: 'bidv.com.vn', brand: 'BIDV', tokens: ['bidv'] },
  { domain: 'vietinbank.vn', brand: 'VietinBank', tokens: ['vietinbank'] },
  { domain: 'agribank.com.vn', brand: 'Agribank', tokens: ['agribank'] },
  { domain: 'mbbank.com.vn', brand: 'MB Bank', tokens: ['mbbank'] },
  { domain: 'acb.com.vn', brand: 'ACB', tokens: [] },
  { domain: 'vpbank.com.vn', brand: 'VPBank', tokens: ['vpbank'] },
  { domain: 'sacombank.com.vn', brand: 'Sacombank', tokens: ['sacombank'] },
  { domain: 'hdbank.com.vn', brand: 'HDBank', tokens: ['hdbank'] },
  { domain: 'vib.com.vn', brand: 'VIB', tokens: [] },
  { domain: 'shb.com.vn', brand: 'SHB', tokens: [] },
  { domain: 'ocb.com.vn', brand: 'OCB', tokens: [] },
  { domain: 'msb.com.vn', brand: 'MSB', tokens: [] },
  { domain: 'seabank.com.vn', brand: 'SeABank', tokens: ['seabank'] },
  { domain: 'eximbank.com.vn', brand: 'Eximbank', tokens: ['eximbank'] },
  { domain: 'momo.vn', brand: 'MoMo', tokens: ['momo'] },
  { domain: 'zalopay.vn', brand: 'ZaloPay', tokens: ['zalopay'] },
  { domain: 'vnpay.vn', brand: 'VNPAY', tokens: ['vnpay'] },
  { domain: 'zalo.me', brand: 'Zalo', tokens: [] },
  { domain: 'shopee.vn', brand: 'Shopee', tokens: ['shopee'] },
  { domain: 'lazada.vn', brand: 'Lazada', tokens: ['lazada'] },
  { domain: 'tiki.vn', brand: 'Tiki', tokens: [] },
  { domain: 'evn.com.vn', brand: 'EVN', tokens: [] },
  { domain: 'viettel.com.vn', brand: 'Viettel', tokens: [] },
  { domain: 'mobifone.vn', brand: 'MobiFone', tokens: ['mobifone'] },
  { domain: 'vnpost.vn', brand: 'Vietnam Post', tokens: ['vnpost'] },
  { domain: 'ghn.vn', brand: 'Giao Hàng Nhanh', tokens: [] },
  { domain: 'ghtk.vn', brand: 'Giao Hàng Tiết Kiệm', tokens: [] },
  { domain: 'tinnhiemmang.vn', brand: 'Tín nhiệm mạng', tokens: ['tinnhiemmang'] },
  { domain: 'chongluadao.vn', brand: 'ChongLuaDao', tokens: [] },
];

/** Only government bodies can register under .gov.vn. */
export function isGovernmentDomain(domain: string): boolean {
  return domain.endsWith('.gov.vn');
}

/** Words that only a government domain should carry. */
export const GOVERNMENT_TOKENS = ['gov', 'dichvucong', 'vneid', 'bocongan', 'dinhdanh', 'baohiemxahoi', 'chinhphu'];

export function findOfficialDomain(domain: string): OfficialDomain | undefined {
  return OFFICIAL_DOMAINS.find((d) => d.domain === domain);
}

export interface VerifiedContact {
  id: string;
  vi: string;
  en: string;
  /** Phone number to call, if this contact is a number. */
  phone?: string;
  /** Web page to open, if this contact is a website. */
  url?: string;
  noteVi: string;
  noteEn: string;
  sourceUrl: string;
  verifiedAt: string;
}

// Bank hotlines are deliberately absent: people should use the number printed
// on their card or inside the bank's official app, never one from a message.
export const VERIFIED_CONTACTS: VerifiedContact[] = [
  {
    id: 'police_113',
    vi: 'Công an (khẩn cấp)',
    en: 'Police (emergency)',
    phone: '113',
    noteVi: 'Khi đang bị đe doạ hoặc cần công an đến ngay.',
    noteEn: 'When you are threatened or need police right away.',
    sourceUrl: 'https://bocongan.gov.vn/',
    verifiedAt: '2026-10-19',
  },
  {
    id: 'spam_156',
    vi: 'Phản ánh cuộc gọi, tin nhắn rác và lừa đảo',
    en: 'Report spam and scam calls or texts',
    phone: '156',
    noteVi: 'Gọi miễn phí, cung cấp số đã gọi hoặc nhắn cho bạn. Tin nhắn rác có thể gửi về 5656.',
    noteEn: 'Free call; give the number that called or texted you. Spam texts can also go to 5656.',
    sourceUrl: 'https://tuoitre.vn/phan-anh-ve-cuoc-goi-lua-dao-cuoc-goi-rac-cu-goi-156-20221031192001952.htm',
    verifiedAt: '2026-10-19',
  },
  {
    id: 'vneid_report',
    vi: 'Tố giác tội phạm trên ứng dụng VNeID',
    en: 'Report a crime in the VNeID app',
    noteVi: 'Mở ứng dụng VNeID chính thức (tải từ App Store hoặc Google Play), chọn mục "Tố giác tội phạm".',
    noteEn: 'Open the official VNeID app (from App Store or Google Play) and choose "Tố giác tội phạm".',
    sourceUrl: 'https://lsvn.vn/cach-to-giac-toi-pham-tren-app-dinh-danh-dien-tu-vneid-1693366585-a134622.html',
    verifiedAt: '2026-10-19',
  },
  {
    id: 'local_police',
    vi: 'Công an xã, phường nơi bạn ở',
    en: 'Your local commune or ward police',
    noteVi: 'Mang theo giấy tờ tùy thân và bằng chứng (ảnh chụp tin nhắn, sao kê giao dịch).',
    noteEn: 'Bring ID and evidence (screenshots, transaction statement).',
    sourceUrl: 'https://bocongan.gov.vn/',
    verifiedAt: '2026-10-19',
  },
  {
    id: 'tinnhiemmang',
    vi: 'Tín nhiệm mạng: tra cứu và báo cáo website lừa đảo',
    en: 'Tín nhiệm mạng: look up and report scam websites',
    url: 'https://tinnhiemmang.vn/',
    noteVi: 'Cổng do cơ quan nhà nước vận hành.',
    noteEn: 'Run by a government agency.',
    sourceUrl: 'https://tinnhiemmang.vn/gioi-thieu',
    verifiedAt: '2026-10-19',
  },
  {
    id: 'chongluadao',
    vi: 'ChongLuaDao: báo cáo website lừa đảo',
    en: 'ChongLuaDao: report scam websites',
    url: 'https://chongluadao.vn/',
    noteVi: 'Tổ chức phi lợi nhuận.',
    noteEn: 'Non-profit organisation.',
    sourceUrl: 'https://chongluadao.vn/',
    verifiedAt: '2026-10-19',
  },
];

/** Service numbers that are themselves official (a call from 113 is the police). */
export const OFFICIAL_SERVICE_NUMBERS: Record<string, string> = {
  '113': 'Công an',
  '114': 'Cứu hoả',
  '115': 'Cấp cứu',
  '156': 'Tổng đài phản ánh cuộc gọi, tin nhắn rác',
};
