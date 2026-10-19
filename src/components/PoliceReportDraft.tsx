import { useMemo, useState } from 'react';
import { Copy, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { policeReportText, type PoliceReportInput, type RecoverySituation } from '@core/index.ts';

type Field = Exclude<keyof PoliceReportInput, 'situations'>;

const FIELDS: { key: Field; vi: string; en: string; placeholder?: string; long?: boolean; max: number }[] = [
  { key: 'fullName', vi: 'Họ và tên', en: 'Full name', max: 100 },
  { key: 'birthYear', vi: 'Năm sinh', en: 'Year of birth', max: 10 },
  { key: 'idNumber', vi: 'Số căn cước công dân', en: 'ID card number', max: 20 },
  { key: 'phone', vi: 'Số điện thoại của bạn', en: 'Your phone number', max: 20 },
  { key: 'address', vi: 'Nơi ở hiện tại', en: 'Current address', max: 200 },
  { key: 'policeStation', vi: 'Gửi tới', en: 'Addressed to', placeholder: 'Công an phường ..., TP ...', max: 150 },
  { key: 'place', vi: 'Tỉnh, thành phố (dòng ký tên)', en: 'City or province (signature line)', max: 60 },
  { key: 'when', vi: 'Thời gian xảy ra', en: 'When it happened', placeholder: '9 giờ sáng 18/10/2026', max: 100 },
  { key: 'channel', vi: 'Họ liên lạc với bạn qua', en: 'How they contacted you', placeholder: 'Cuộc gọi từ số 09..., sau đó nhắn Zalo', max: 200 },
  { key: 'scammerDetails', vi: 'Số điện thoại, tài khoản, link họ đã dùng', en: 'Numbers, accounts, links they used', max: 500, long: true },
  { key: 'story', vi: 'Diễn biến (họ nói gì, bạn đã làm gì)', en: 'What happened (what they said, what you did)', max: 3000, long: true },
  { key: 'amount', vi: 'Tổng số tiền đã mất', en: 'Total amount lost', placeholder: '5000000', max: 50 },
  { key: 'transfers', vi: 'Từng lần chuyển: giờ, số tiền, STK và ngân hàng nhận', en: 'Each transfer: time, amount, receiving account and bank', max: 1000, long: true },
];

// Everything typed here stays in this component's state: it is never sent,
// logged or saved, because it holds an ID number and bank details.
const PoliceReportDraft = ({ situations }: { situations: RecoverySituation[] }) => {
  const { language } = useLanguage();
  const vi = language === 'vi';
  const [values, setValues] = useState<Partial<Record<Field, string>>>({});
  const [copied, setCopied] = useState(false);

  const text = useMemo(() => policeReportText({ ...values, situations }), [values, situations]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'don-trinh-bao.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card id="don-trinh-bao">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-trust-blue" aria-hidden="true" />
          {vi ? 'Soạn đơn trình báo công an' : 'Draft a police report'}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {vi
            ? 'Điền những gì bạn nhớ; ô nào trống sẽ để dòng chấm để viết tay. Thông tin chỉ nằm trên máy của bạn, không được gửi đi hay lưu lại.'
            : 'Fill in what you remember; empty fields stay as dotted lines to write by hand. The report is in Vietnamese for the police. What you type stays on your device and is never sent or saved.'}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.long ? 'sm:col-span-2 space-y-1' : 'space-y-1'}>
              <Label htmlFor={`report-${f.key}`}>{vi ? f.vi : f.en}</Label>
              {f.long ? (
                <Textarea
                  id={`report-${f.key}`}
                  rows={f.key === 'story' ? 5 : 3}
                  maxLength={f.max}
                  placeholder={f.placeholder}
                  value={values[f.key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                />
              ) : (
                <Input
                  id={`report-${f.key}`}
                  maxLength={f.max}
                  placeholder={f.placeholder}
                  autoComplete="off"
                  value={values[f.key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="report-preview">{vi ? 'Bản đơn' : 'Report'}</Label>
          <Textarea id="report-preview" readOnly rows={16} value={text} className="font-mono text-xs leading-relaxed bg-white" />
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={copy}>
              <Copy className="w-4 h-4 mr-1" aria-hidden="true" />
              {copied ? (vi ? 'Đã sao chép' : 'Copied') : vi ? 'Sao chép' : 'Copy'}
            </Button>
            <Button type="button" variant="outline" onClick={download}>
              <Download className="w-4 h-4 mr-1" aria-hidden="true" />
              {vi ? 'Tải về để in' : 'Download to print'}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            {vi
              ? 'Mang đơn đã ký cùng giấy tờ tuỳ thân và bằng chứng tới công an. Có thể chép tay lại nếu không in được.'
              : 'Take the signed report with your ID and evidence to the police. Copying it by hand is fine if you cannot print.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoliceReportDraft;
