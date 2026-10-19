import { describe, expect, it } from 'vitest';
import { runCheck, type CommunitySignal, type Entity } from '@core/index.ts';

const NONE: CommunitySignal = {
  found: false,
  verifiedReports: 0,
  unverifiedReporters: 0,
  lastVerifiedAt: null,
  lastReportAt: null,
  categories: [],
};
const empty = async () => NONE;
const failing = async (): Promise<CommunitySignal> => {
  throw new Error('network');
};
const withSignal = (signal: Partial<CommunitySignal>) => async (_e: Entity) => ({ ...NONE, found: true, ...signal });

describe('runCheck: never "safe" by default', () => {
  it('answers unknown for a number nobody reported', async () => {
    const r = await runCheck('0912345678', empty);
    expect(r.verdict.level).toBe('unknown');
    expect(r.verdict.action).toBe('verify_official');
  });

  it('answers unknown, and says so, when the lookup fails', async () => {
    const r = await runCheck('0912345678', failing);
    expect(r.verdict.level).toBe('unknown');
    expect(r.verdict.reasons.map((x) => x.code)).toContain('lookup_failed');
  });

  it('answers unknown for empty input', async () => {
    expect((await runCheck('   ', empty)).verdict.level).toBe('unknown');
  });
});

describe('runCheck: community reports', () => {
  it('marks danger only on moderator-verified reports', async () => {
    const r = await runCheck('0912345678', withSignal({ verifiedReports: 2, lastVerifiedAt: new Date().toISOString() }));
    expect(r.verdict.level).toBe('danger');
  });

  it('marks warning, worded as unverified, for several unverified reporters', async () => {
    const r = await runCheck('0912345678', withSignal({ unverifiedReporters: 3 }));
    expect(r.verdict.level).toBe('warning');
    expect(r.verdict.reasons[0].vi).toContain('chưa được kiểm duyệt');
  });

  it('does not raise the level for a single unverified report', async () => {
    expect((await runCheck('0912345678', withSignal({ unverifiedReporters: 1 }))).verdict.level).toBe('unknown');
  });

  it('downgrades year-old verified phone reports because numbers get reassigned', async () => {
    const old = new Date(Date.now() - 400 * 24 * 3600 * 1000).toISOString();
    const r = await runCheck('0912345678', withSignal({ verifiedReports: 1, lastVerifiedAt: old }));
    expect(r.verdict.level).toBe('warning');
  });

  it('mentions an open appeal next to the reports', async () => {
    const r = await runCheck('0912345678', withSignal({ unverifiedReporters: 2, appealPending: true }));
    expect(r.allReasons.map((x) => x.code)).toContain('appeal_pending');
    expect(r.verdict.level).toBe('warning');
  });

  it('ignores unverified mass reports against an official domain', async () => {
    const r = await runCheck('https://vietcombank.com.vn', withSignal({ unverifiedReporters: 50 }));
    expect(r.verdict.level).toBe('official');
  });
});

describe('runCheck: links', () => {
  it('recognises official and government domains', async () => {
    expect((await runCheck('https://www.vietcombank.com.vn/vi', empty)).verdict.level).toBe('official');
    expect((await runCheck('dichvucong.gov.vn', empty)).verdict.level).toBe('official');
  });

  it('flags fake government domains', async () => {
    for (const url of ['dichvucong-vn.com', 'vneid-capnhat.online', 'https://gov-vn.cc/login']) {
      expect((await runCheck(url, empty)).verdict.level, url).toBe('danger');
    }
  });

  it('does not mistake a district name for "gov"', async () => {
    expect((await runCheck('nhakhoagovap.com', empty)).verdict.level).toBe('unknown');
  });

  it('flags bank lookalikes', async () => {
    expect((await runCheck('vietcombank-hotro.com', empty)).verdict.level).toBe('danger');
    expect((await runCheck('vietcombankvn.net', empty)).verdict.level).toBe('warning');
  });

  it('flags apk downloads and shorteners', async () => {
    expect((await runCheck('http://abc.xyz/app.apk', empty)).verdict.level).toBe('danger');
    expect((await runCheck('https://bit.ly/3abc', empty)).verdict.level).toBe('warning');
  });
});

describe('runCheck: scam scripts in messages', () => {
  const cases: [string, string, string][] = [
    [
      'impersonating police, safe account',
      'Day la Cong an quan 1. Tai khoan cua ba lien quan duong day rua tien, ba phai chuyen toan bo tien vao tai khoan tam giu de xac minh.',
      'danger',
    ],
    [
      'fake VNeID app',
      'Cong an phuong thong bao: tai khoan dinh danh muc 2 cua ban bi loi, vui long tai ung dung VNeID moi tai link https://vneid-gov.top/app de cap nhat.',
      'danger',
    ],
    ['OTP request', 'Em ben ngan hang, anh doc giup em ma OTP vua gui ve may de huy giao dich nhe', 'danger'],
    [
      'task scam',
      'Tuyen CTV lam nhiem vu tren app, hoa hong 10-30%, nap tien lam nhiem vu tiep de rut goc',
      'danger',
    ],
    ['recovery scam', 'Van phong luat su ho tro lay lai tien bi lua dao 100%, chi phi tu 2 trieu', 'danger'],
    ['guaranteed return', 'San dau tu uy tin, loi nhuan 5%/ngay, cam ket khong lo', 'warning'],
    ['prize fee', 'Chuc mung ban trung thuong xe SH, vui long chuyen khoan phi nhan thuong 2.000.000d', 'warning'],
  ];
  for (const [name, text, level] of cases) {
    it(name, async () => {
      expect((await runCheck(text, empty)).verdict.level).toBe(level);
    });
  }

  it('works on text with Vietnamese diacritics', async () => {
    const r = await runCheck('Anh đọc giúp em mã OTP vừa gửi về máy nhé, bên em là ngân hàng.', empty);
    expect(r.verdict.level).toBe('danger');
    expect(r.verdict.action).toBe('never_share_otp');
  });
});

describe('runCheck: legitimate messages stay unknown', () => {
  const legit = [
    'Ma OTP cua Quy khach la 482913. Tuyet doi KHONG cung cap ma OTP cho bat ky ai, ke ca nhan vien ngan hang.',
    'Mã OTP của Quý khách là 482913. Không chia sẻ mã OTP với bất kỳ ai.',
    'Don hang 240915ABC da duoc giao thanh cong. Cam on ban da mua sam.',
    'Con oi toi nay me ve muon, con nho an com truoc nhe.',
    'TK 1903xxx789 +2,000,000VND luc 10:15 18/10. SD: 5,230,000VND. ND: luong thang 10',
  ];
  for (const text of legit) {
    it(text.slice(0, 40), async () => {
      expect((await runCheck(text, empty)).verdict.level).toBe('unknown');
    });
  }
});
