import { describe, expect, it } from 'vitest';
import { classifyInput, extractEntities, normalizePhone, normalizeUrl, registrableDomain } from '@core/index.ts';

describe('normalizePhone', () => {
  it('maps every common way of writing a mobile number to one E.164 key', () => {
    for (const raw of ['0912 345 678', '0912.345.678', '+84912345678', '84912345678', '0084 912 345 678', '(091) 234-5678']) {
      expect(normalizePhone(raw)?.key, raw).toMatch(/^\+849/);
    }
    expect(normalizePhone('0912 345 678')?.key).toBe('+84912345678');
  });

  it('converts 2018 legacy 11-digit mobile prefixes', () => {
    expect(normalizePhone('01682345678')?.key).toBe('+84382345678');
    expect(normalizePhone('0120 123 4567')?.key).toBe('+84701234567');
  });

  it('keeps landlines, service numbers and foreign numbers distinct', () => {
    expect(normalizePhone('024 3826 3030')).toEqual({ key: '+842438263030', type: 'landline' });
    expect(normalizePhone('113')).toEqual({ key: '113', type: 'service' });
    expect(normalizePhone('1900 1234')).toEqual({ key: '19001234', type: 'service' });
    expect(normalizePhone('+855 12 345 678')).toEqual({ key: '+85512345678', type: 'international' });
  });

  it('rejects things that are not phone numbers', () => {
    expect(normalizePhone('12345')).toBeNull();
    expect(normalizePhone('0123')).toBeNull();
    expect(normalizePhone('abc0912345678')).toBeNull();
  });
});

describe('normalizeUrl', () => {
  it('keys ordinary sites on the registrable domain', () => {
    expect(normalizeUrl('https://www.Example.com/')?.key).toBe('example.com');
    expect(normalizeUrl('example.com')?.key).toBe('example.com');
    expect(normalizeUrl('http://login.vietcombank-hotro.com/a?b=1')?.key).toBe('vietcombank-hotro.com');
    expect(registrableDomain('ebanking.vietcombank.com.vn')).toBe('vietcombank.com.vn');
  });

  it('keys shared platforms on the tenant, not the platform', () => {
    expect(normalizeUrl('https://www.facebook.com/someshop/posts/1')?.key).toBe('facebook.com/someshop');
    expect(normalizeUrl('https://scam.github.io/x')?.key).toBe('scam.github.io');
    expect(normalizeUrl('https://bit.ly/abc123')?.key).toBe('bit.ly/abc123');
    expect(normalizeUrl('https://docs.google.com/forms/d/XYZ/viewform')?.key).toBe('docs.google.com/forms/d/xyz');
  });

  it('refuses non-web schemes', () => {
    expect(normalizeUrl('javascript:alert(1)')).toBeNull();
    expect(normalizeUrl('data:text/html,hi')).toBeNull();
  });
});

describe('classifyInput', () => {
  it('recognises a single value', () => {
    expect(classifyInput('0912345678').entities[0]).toMatchObject({ kind: 'phone', key: '+84912345678' });
    expect(classifyInput('vcb-xacminh.com').entities[0]).toMatchObject({ kind: 'url', key: 'vcb-xacminh.com' });
    expect(classifyInput('a@B.com').entities[0]).toMatchObject({ kind: 'email', key: 'a@b.com' });
    expect(classifyInput('1234 5678 9012').entities[0]).toMatchObject({ kind: 'bank_account', key: '123456789012' });
  });

  it('treats digits as a bank account when the user picked a bank', () => {
    expect(classifyInput('0912345678', 'MB').entities[0]).toMatchObject({ kind: 'bank_account', key: '0912345678', bankCode: 'MB' });
  });

  it('extracts every entity from a pasted message', () => {
    const msg =
      'Chao anh, em la can bo cong an. Anh chuyen tien vao STK 1903 4567 8901 Techcombank, ' +
      'goi lai 0987.654.321 hoac vao https://dichvucong-vn.com/xacminh de xac nhan. Email: hotro@abc.vn';
    const { isMessage, entities } = classifyInput(msg);
    expect(isMessage).toBe(true);
    expect(entities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: 'bank_account', key: '190345678901', bankCode: 'TCB' }),
        expect.objectContaining({ kind: 'phone', key: '+84987654321' }),
        expect.objectContaining({ kind: 'url', key: 'dichvucong-vn.com' }),
        expect.objectContaining({ kind: 'email', key: 'hotro@abc.vn' }),
      ]),
    );
  });

  it('does not read money amounts as websites', () => {
    expect(extractEntities('Chuyen 1.000.000 dong').filter((e) => e.kind === 'url')).toEqual([]);
  });

  it('strips invisible characters before reading', () => {
    expect(classifyInput('09​12345678').entities[0]).toMatchObject({ kind: 'phone', key: '+84912345678' });
  });
});
