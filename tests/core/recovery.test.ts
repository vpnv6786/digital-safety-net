import { describe, expect, it } from 'vitest';
import {
  RECOVERY_SITUATIONS,
  RECOVERY_STEPS,
  formatAmount,
  policeReportText,
  recoverySteps,
} from '@core/index.ts';

const ids = (situations: Parameters<typeof recoverySteps>[0]) => recoverySteps(situations).map((s) => s.id);

describe('recovery steps', () => {
  it('shows every step when nothing is chosen', () => {
    expect(recoverySteps([])).toEqual(RECOVERY_STEPS);
  });

  it('every situation gets at least one step of its own', () => {
    for (const s of RECOVERY_SITUATIONS) {
      expect(RECOVERY_STEPS.some((step) => step.when !== 'always' && step.when.includes(s.code)), s.code).toBe(true);
    }
  });

  it('a transfer starts with calling the bank and skips unrelated steps', () => {
    const steps = ids(['transferred']);
    expect(steps[0]).toBe('call_bank');
    expect(steps).not.toContain('go_offline');
    expect(steps).not.toContain('warn_contacts');
    expect(steps).toContain('report_police');
    expect(steps).toContain('second_scam');
  });

  it('a remote-control app is cut off before anything else', () => {
    expect(ids(['installed_app', 'transferred']).slice(0, 2)).toEqual(['go_offline', 'call_bank']);
  });

  it('a taken-over account warns contacts and needs no bank call', () => {
    const steps = ids(['account_taken']);
    expect(steps).toContain('warn_contacts');
    expect(steps).not.toContain('call_bank');
  });

  // Phone numbers belong in VERIFIED_CONTACTS only; a step must never carry one.
  it('no step text contains a phone number other than 113', () => {
    for (const step of RECOVERY_STEPS) {
      const text = `${step.vi} ${step.en} ${step.detailVi} ${step.detailEn}`;
      const numbers = text.match(/\d{3,}/g) ?? [];
      expect(numbers.filter((n) => n !== '113'), step.id).toEqual([]);
    }
  });
});

describe('police report', () => {
  const today = new Date(2026, 9, 19);

  it('leaves dotted lines for empty fields and dates the signature', () => {
    const text = policeReportText({}, today);
    expect(text).toContain('ĐƠN TRÌNH BÁO');
    expect(text).toContain('Kính gửi: Công an xã/phường ....');
    expect(text).toContain('Tôi tên là: ....');
    expect(text).toContain('ngày 19 tháng 10 năm 2026');
    expect(text).not.toContain('undefined');
    // No money section unless money was involved.
    expect(text).not.toContain('Số tiền bị chiếm đoạt');
  });

  it('fills what was typed and lists what happened', () => {
    const text = policeReportText(
      {
        fullName: 'Nguyễn Văn A',
        policeStation: 'Công an phường Bến Thành, TP Hồ Chí Minh',
        amount: '5000000',
        transfers: '10:05 18/10/2026, 5.000.000đ, STK 0123456789 tại Ngân hàng X',
        situations: ['shared_otp', 'transferred'],
        place: 'TP Hồ Chí Minh',
      },
      today,
    );
    expect(text).toContain('Kính gửi: Công an phường Bến Thành, TP Hồ Chí Minh');
    expect(text).toContain('Tôi tên là: Nguyễn Văn A');
    expect(text).toContain('Số tiền bị chiếm đoạt: 5.000.000 đồng');
    expect(text).toContain('STK 0123456789 tại Ngân hàng X');
    expect(text).toContain('TP Hồ Chí Minh, ngày 19 tháng 10 năm 2026');
    // Situations keep the canonical order, not the click order.
    expect(text.indexOf('đã chuyển tiền')).toBeLessThan(text.indexOf('mã OTP'));
    expect(text.trimEnd().endsWith('Nguyễn Văn A')).toBe(true);
  });

  it('formats plain amounts and keeps written ones', () => {
    expect(formatAmount('5000000')).toBe('5.000.000 đồng');
    expect(formatAmount('12.500.000')).toBe('12.500.000 đồng');
    expect(formatAmount('005000')).toBe('5.000 đồng');
    expect(formatAmount('khoảng 3 triệu')).toBe('khoảng 3 triệu');
    expect(formatAmount('  ')).toBeUndefined();
  });
});
