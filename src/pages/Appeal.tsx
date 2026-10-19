import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { reportKey } from '@/services/reportService';
import { submitAppeal } from '@/services/moderationService';
import type { EntityKind } from '@core/index.ts';

const KINDS: { kind: EntityKind; vi: string; en: string }[] = [
  { kind: 'phone', vi: 'Số điện thoại', en: 'Phone number' },
  { kind: 'url', vi: 'Website', en: 'Website' },
  { kind: 'bank_account', vi: 'Số tài khoản', en: 'Bank account' },
  { kind: 'email', vi: 'Email', en: 'Email' },
];

const Appeal = () => {
  const { language } = useLanguage();
  const vi = language === 'vi';
  const { user, loading } = useAuth();
  const [kind, setKind] = useState<EntityKind>('phone');
  const [value, setValue] = useState('');
  const [reason, setReason] = useState('');
  const [contact, setContact] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const key = value.trim() ? reportKey(kind, value) : null;
  const canSubmit = !!user && !!key && reason.trim().length >= 20 && !busy;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !key) return;
    setBusy(true);
    setMessage(null);
    try {
      await submitAppeal(kind, key, reason.trim(), contact.trim());
      setMessage({
        ok: true,
        text: vi
          ? 'Đã nhận khiếu nại. Trong lúc xem xét, kết quả kiểm tra sẽ ghi rõ là chủ sở hữu đang khiếu nại.'
          : 'Appeal received. While it is reviewed, check results will say the owner has appealed.',
      });
      setReason('');
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? '';
      setMessage({
        ok: false,
        text: msg.includes('already_pending')
          ? vi
            ? 'Bạn đã có một khiếu nại đang chờ cho mục này.'
            : 'You already have a pending appeal for this item.'
          : msg.includes('rate_limited')
            ? vi
              ? 'Bạn đã gửi 5 khiếu nại trong 24 giờ.'
              : 'You sent 5 appeals in 24 hours.'
            : vi
              ? 'Chưa gửi được khiếu nại. Vui lòng thử lại.'
              : 'The appeal could not be sent. Please try again.',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{vi ? 'Khiếu nại báo cáo nhầm' : 'Appeal a wrong report'}</h1>
        <p className="text-gray-700">
          {vi
            ? 'Nếu số điện thoại, website, email hoặc tài khoản của bạn bị báo cáo nhầm, hãy cho người kiểm duyệt biết. Khi khiếu nại được chấp nhận, mọi báo cáo về mục đó bị gỡ và ghi vào nhật ký.'
            : 'If your phone number, website, email or account was reported by mistake, tell the moderators. If the appeal is accepted, every report about it is removed and the decision is logged.'}
        </p>

        {!loading && !user ? (
          <Card>
            <CardContent className="p-5 space-y-3">
              <p className="text-gray-700">
                {vi ? 'Bạn cần đăng nhập bằng số điện thoại để gửi khiếu nại.' : 'Please sign in with your phone number to appeal.'}
              </p>
              <Button asChild>
                <Link to="/auth">{vi ? 'Đăng nhập' : 'Sign in'}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-5">
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <Label>{vi ? 'Mục bị báo cáo' : 'Reported item'}</Label>
                  <Select value={kind} onValueChange={(v) => setKind(v as EntityKind)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {KINDS.map((k) => (
                        <SelectItem key={k.kind} value={k.kind}>
                          {vi ? k.vi : k.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input value={value} onChange={(e) => setValue(e.target.value)} aria-invalid={!!value.trim() && !key} />
                  {value.trim() && !key && <p className="text-sm text-danger-red">{vi ? 'Chưa đúng định dạng.' : 'Not a valid format.'}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appeal-reason">{vi ? 'Vì sao báo cáo là nhầm?' : 'Why is the report wrong?'}</Label>
                  <Textarea
                    id="appeal-reason"
                    rows={5}
                    maxLength={2000}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={
                      vi
                        ? 'Ví dụ: đây là số cửa hàng của tôi từ năm 2020; tôi mới được nhà mạng cấp số này tháng trước…'
                        : 'e.g. this is my shop number since 2020; my carrier gave me this number last month…'
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appeal-contact">{vi ? 'Cách liên hệ lại (không bắt buộc)' : 'How to reach you (optional)'}</Label>
                  <Input id="appeal-contact" value={contact} onChange={(e) => setContact(e.target.value)} maxLength={200} />
                </div>
                {message && (
                  <p role="status" className={`text-sm ${message.ok ? 'text-green-700' : 'text-danger-red'}`}>
                    {message.text}
                  </p>
                )}
                <Button type="submit" disabled={!canSubmit}>
                  {vi ? 'Gửi khiếu nại' : 'Send appeal'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Appeal;
