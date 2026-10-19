// Banks people name in messages. Codes are labels only; they are not routing numbers.

export interface BankInfo {
  code: string;
  name: string;
  /** Folded (no diacritics, lowercase) words that name the bank in a message. */
  aliases: string[];
}

export const BANKS: BankInfo[] = [
  { code: 'VCB', name: 'Vietcombank', aliases: ['vietcombank', 'vcb', 'ngan hang ngoai thuong'] },
  { code: 'BIDV', name: 'BIDV', aliases: ['bidv', 'ngan hang dau tu va phat trien'] },
  { code: 'VTB', name: 'VietinBank', aliases: ['vietinbank', 'viettinbank', 'ngan hang cong thuong'] },
  { code: 'AGR', name: 'Agribank', aliases: ['agribank', 'ngan hang nong nghiep'] },
  { code: 'TCB', name: 'Techcombank', aliases: ['techcombank', 'tcb', 'ngan hang ky thuong'] },
  { code: 'MB', name: 'MB Bank', aliases: ['mbbank', 'mb bank', 'ngan hang quan doi'] },
  { code: 'ACB', name: 'ACB', aliases: ['acb', 'ngan hang a chau'] },
  { code: 'VPB', name: 'VPBank', aliases: ['vpbank', 'vp bank'] },
  { code: 'TPB', name: 'TPBank', aliases: ['tpbank', 'tp bank', 'ngan hang tien phong'] },
  { code: 'STB', name: 'Sacombank', aliases: ['sacombank', 'ngan hang sai gon thuong tin'] },
  { code: 'HDB', name: 'HDBank', aliases: ['hdbank', 'hd bank'] },
  { code: 'VIB', name: 'VIB', aliases: ['vib', 'ngan hang quoc te'] },
  { code: 'SHB', name: 'SHB', aliases: ['shb', 'ngan hang sai gon ha noi'] },
  { code: 'OCB', name: 'OCB', aliases: ['ocb', 'ngan hang phuong dong'] },
  { code: 'MSB', name: 'MSB', aliases: ['msb', 'ngan hang hang hai'] },
  { code: 'SEAB', name: 'SeABank', aliases: ['seabank', 'ngan hang dong nam a'] },
  { code: 'EIB', name: 'Eximbank', aliases: ['eximbank', 'ngan hang xuat nhap khau'] },
  { code: 'LPB', name: 'LPBank', aliases: ['lpbank', 'lienvietpostbank', 'ngan hang loc phat'] },
  { code: 'NAB', name: 'Nam A Bank', aliases: ['nam a bank', 'namabank'] },
  { code: 'BAB', name: 'Bac A Bank', aliases: ['bac a bank', 'bacabank'] },
  { code: 'ABB', name: 'ABBANK', aliases: ['abbank', 'ngan hang an binh'] },
  { code: 'KLB', name: 'KienlongBank', aliases: ['kienlongbank', 'ngan hang kien long'] },
  { code: 'NCB', name: 'NCB', aliases: ['ncb', 'ngan hang quoc dan'] },
  { code: 'PVCB', name: 'PVcomBank', aliases: ['pvcombank'] },
  { code: 'CAKE', name: 'Cake by VPBank', aliases: ['cake'] },
  { code: 'TIMO', name: 'Timo', aliases: ['timo'] },
];

export function findBankCode(foldedWindow: string): string | undefined {
  for (const bank of BANKS) {
    for (const alias of bank.aliases) {
      if (new RegExp(`(^|[^a-z])${alias}([^a-z]|$)`).test(foldedWindow)) return bank.code;
    }
  }
  return undefined;
}

export function bankName(code: string | undefined): string | undefined {
  return BANKS.find((b) => b.code === code)?.name;
}
