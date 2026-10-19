import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Globe, Info, Mail, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { REPORT_ERROR_TEXT, reportKey, submitReport } from '@/services/reportService';
import { BANKS, REPORT_CATEGORIES, type EntityKind } from '@core/index.ts';

const KINDS: { kind: EntityKind; icon: React.ElementType; vi: string; en: string; placeholderVi: string; placeholderEn: string }[] = [
  { kind: 'phone', icon: Phone, vi: 'Số điện thoại', en: 'Phone number', placeholderVi: 'Ví dụ: 09xx xxx xxx', placeholderEn: 'e.g. 09xx xxx xxx' },
  { kind: 'url', icon: Globe, vi: 'Website, link', en: 'Website or link', placeholderVi: 'Ví dụ: ten-mien-la.com', placeholderEn: 'e.g. strange-domain.com' },
  { kind: 'bank_account', icon: CreditCard, vi: 'Số tài khoản', en: 'Bank account', placeholderVi: 'Số tài khoản nhận tiền', placeholderEn: 'Receiving account number' },
  { kind: 'email', icon: Mail, vi: 'Email', en: 'Email', placeholderVi: 'Địa chỉ email', placeholderEn: 'Email address' },
];

interface ReportFormProps {
  initialKind?: EntityKind;
  initialValue?: string;
  initialBankCode?: string;
  onDone?: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ initialKind = 'phone', initialValue = '', initialBankCode, onDone }) => {
  const { language } = useLanguage();
  const vi = language === 'vi';
  const { user, loading } = useAuth();
  const [kind, setKind] = useState<EntityKind>(initialKind);
  const [value, setValue] = useState(initialValue);
  const [bankCode, setBankCode] = useState<string | undefined>(initialBankCode);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const current = KINDS.find((k) => k.kind === kind)!;
  const valueValid = value.trim() === '' || reportKey(kind, value) !== null;
  const canSubmit = !!user && value.trim() && valueValid && category && description.trim().length >= 10 && !submitting;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setMessage(null);
    const result = await submitReport({ kind, value, bankCode, category, description });
    setSubmitting(false);
    if (result.ok === true) {
      setMessage({
        ok: true,
        text: vi
          ? 'Đã nhận báo cáo. Báo cáo sẽ được kiểm duyệt trước khi ảnh hưởng tới kết luận công khai. Cảm ơn bạn.'
          : 'Report received. It will be reviewed before it affects public answers. Thank you.',
      });
      setValue('');
      setDescription('');
      setCategory('');
      onDone?.();
    } else {
      const text = REPORT_ERROR_TEXT[result.error];
      setMessage({ ok: false, text: vi ? text.vi : text.en });
    }
  };

  if (!loading && !user) {
    return (
      <div className="text-center space-y-4 py-6">
        <p className="text-gray-700">
          {vi
            ? 'Để chống báo cáo giả, bạn cần đăng nhập bằng số điện thoại trước khi gửi báo cáo.'
            : 'To prevent fake reports, please sign in with your phone number before reporting.'}
        </p>
        <Button asChild>
          <Link to="/auth">{vi ? 'Đăng nhập' : 'Sign in'}</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <Label className="mb-2 block">{vi ? 'Bạn muốn báo cáo gì?' : 'What are you reporting?'}</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {KINDS.map((k) => (
            <Button
              key={k.kind}
              type="button"
              variant={kind === k.kind ? 'default' : 'outline'}
              onClick={() => setKind(k.kind)}
              className="justify-start"
            >
              <k.icon className="w-4 h-4 mr-2" />
              {vi ? k.vi : k.en}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="report-value">{vi ? current.vi : current.en}</Label>
        <Input
          id="report-value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={vi ? current.placeholderVi : current.placeholderEn}
          aria-invalid={!valueValid}
        />
        {!valueValid && (
          <p className="text-sm text-danger-red">{vi ? 'Chưa đúng định dạng.' : 'Not a valid format.'}</p>
        )}
      </div>

      {kind === 'bank_account' && (
        <div className="space-y-2">
          <Label>{vi ? 'Ngân hàng' : 'Bank'}</Label>
          <Select value={bankCode} onValueChange={setBankCode}>
            <SelectTrigger>
              <SelectValue placeholder={vi ? 'Chọn ngân hàng (nếu biết)' : 'Choose the bank (if known)'} />
            </SelectTrigger>
            <SelectContent>
              {BANKS.map((b) => (
                <SelectItem key={b.code} value={b.code}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            {vi
              ? 'Số tài khoản là dữ liệu nhạy cảm: Vệ Binh Mạng chỉ lưu mã băm và 4 số cuối.'
              : 'Account numbers are sensitive: Vệ Binh Mạng stores only a hash and the last 4 digits.'}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label>{vi ? 'Thủ đoạn' : 'Scam type'}</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder={vi ? 'Chọn thủ đoạn gần nhất' : 'Choose the closest type'} />
          </SelectTrigger>
          <SelectContent>
            {REPORT_CATEGORIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {vi ? c.vi : c.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="report-description">{vi ? 'Chuyện gì đã xảy ra?' : 'What happened?'}</Label>
        <Textarea
          id="report-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder={
            vi
              ? 'Họ liên hệ qua kênh nào, xưng là ai, yêu cầu bạn làm gì. Không ghi số CCCD, mật khẩu hay mã OTP của bạn.'
              : 'How they contacted you, who they claimed to be, what they asked. Do not include your ID number, password or OTP.'
          }
        />
        <p className="text-xs text-gray-500">{description.length}/2000</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          {vi
            ? 'Báo cáo chỉ được tính là "đã xác minh" sau khi người kiểm duyệt xem xét. Báo cáo sai sự thật về người khác có thể vi phạm pháp luật. Tính năng đính kèm ảnh bằng chứng sẽ có ở bản sau.'
            : 'A report only counts as "verified" after a moderator reviews it. False reports about others can be unlawful. Attaching screenshots comes in a later version.'}
        </AlertDescription>
      </Alert>

      {message && (
        <p role="status" className={`text-sm ${message.ok ? 'text-green-700' : 'text-danger-red'}`}>
          {message.text}
        </p>
      )}

      <Button type="submit" disabled={!canSubmit} className="w-full sm:w-auto">
        <Send className="w-4 h-4 mr-2" />
        {submitting ? (vi ? 'Đang gửi…' : 'Sending…') : vi ? 'Gửi báo cáo' : 'Send report'}
      </Button>
    </form>
  );
};

export default ReportForm;
