import React from 'react';
import { ExternalLink, Phone, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { VERIFIED_CONTACTS } from '@core/index.ts';

const STEPS: { vi: string; en: string; detailVi: string; detailEn: string }[] = [
  {
    vi: 'Gọi ngay ngân hàng của bạn để khoá thẻ, tài khoản',
    en: 'Call your bank now to block your card and account',
    detailVi:
      'Dùng số tổng đài in ở mặt sau thẻ hoặc trong ứng dụng ngân hàng chính thức. Không dùng số ai đó gửi cho bạn. Đề nghị ngân hàng tra soát, phong toả giao dịch đến tài khoản nhận.',
    detailEn:
      'Use the hotline printed on your card or inside the official banking app, never a number someone sent you. Ask the bank to trace and freeze the transfer to the receiving account.',
  },
  {
    vi: 'Ngắt quyền điều khiển điện thoại nếu đã cài ứng dụng lạ',
    en: 'Cut off remote control if you installed an unknown app',
    detailVi:
      'Bật chế độ máy bay, gỡ ứng dụng lạ, tắt Trợ năng (Accessibility) cho ứng dụng đó. Nếu không gỡ được, tắt nguồn và mang máy tới cửa hàng uy tín. Dùng máy khác để đổi mật khẩu ngân hàng, email, Zalo.',
    detailEn:
      'Turn on airplane mode, uninstall the unknown app and turn off its Accessibility access. If you cannot remove it, power off and take the phone to a trusted shop. Change banking, email and Zalo passwords from another device.',
  },
  {
    vi: 'Giữ lại bằng chứng',
    en: 'Keep the evidence',
    detailVi:
      'Chụp màn hình tin nhắn, cuộc gọi, tài khoản nhận tiền, link; lưu sao kê, biên lai chuyển tiền. Đừng xoá cuộc trò chuyện.',
    detailEn: 'Screenshot messages, calls, the receiving account and links; keep statements and transfer receipts. Do not delete the chat.',
  },
  {
    vi: 'Trình báo công an',
    en: 'Report to the police',
    detailVi: 'Đến công an xã, phường nơi bạn ở, hoặc gửi tố giác trên ứng dụng VNeID. Gọi 113 nếu đang bị đe doạ.',
    detailEn: 'Go to your commune or ward police, or file a report in the VNeID app. Call 113 if you are being threatened.',
  },
  {
    vi: 'Cảnh giác với "lừa đảo lần hai"',
    en: 'Watch out for a "second scam"',
    detailVi:
      'Sau khi bị lừa, bạn dễ bị nhắm lại bởi người xưng luật sư, hacker, cán bộ hứa lấy lại tiền nếu đóng phí. Không ai lấy lại tiền giúp bạn qua mạng. Chỉ làm việc với công an.',
    detailEn:
      'After a scam, people posing as lawyers, hackers or officials often promise to recover the money for a fee. Nobody recovers money for you online. Deal only with the police.',
  },
  {
    vi: 'Báo cho người thân và báo cáo lên Vệ Binh Mạng',
    en: 'Tell your family and report it on Vệ Binh Mạng',
    detailVi: 'Kẻ gian thường dùng tài khoản của bạn để lừa tiếp người quen. Báo cáo giúp người khác được cảnh báo sớm.',
    detailEn: 'Scammers often use your accounts to target your contacts next. Your report helps warn others early.',
  },
];

const Help = () => {
  const { language } = useLanguage();
  const vi = language === 'vi';

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-danger-red" aria-hidden="true" />
            {vi ? 'Đã lỡ bị lừa? Làm ngay những việc này' : 'Already scammed? Do this now'}
          </h1>
          <p className="text-gray-600 mt-2">
            {vi
              ? 'Thời gian rất quan trọng: báo ngân hàng càng sớm, khả năng phong toả tiền càng cao.'
              : 'Time matters: the sooner your bank knows, the better the chance to freeze the money.'}
          </p>
        </div>

        <ol className="space-y-3">
          {STEPS.map((s, i) => (
            <li key={s.en}>
              <Card>
                <CardContent className="p-4 flex gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-trust-blue text-white font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <h2 className="font-semibold text-gray-900">{vi ? s.vi : s.en}</h2>
                    <p className="text-sm text-gray-700 mt-1">{vi ? s.detailVi : s.detailEn}</p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>

        <Card>
          <CardHeader>
            <CardTitle>{vi ? 'Nơi liên hệ chính thức' : 'Official contacts'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {VERIFIED_CONTACTS.map((c) => (
              <div key={c.id} className="border-b last:border-0 pb-3 last:pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-900">{vi ? c.vi : c.en}</span>
                  {c.phone && (
                    <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1 text-trust-blue font-semibold">
                      <Phone className="w-4 h-4" aria-hidden="true" />
                      {c.phone}
                    </a>
                  )}
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-trust-blue">
                      {new URL(c.url).hostname}
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{vi ? c.noteVi : c.noteEn}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {vi ? 'Kiểm tra ngày' : 'Checked on'} {c.verifiedAt} ·{' '}
                  <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    {vi ? 'nguồn' : 'source'}
                  </a>
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Alert>
          <AlertDescription className="text-sm">
            {vi
              ? 'Vệ Binh Mạng không liệt kê số tổng đài ngân hàng: hãy dùng số in trên thẻ hoặc trong ứng dụng chính thức. Kẻ gian thường giả số tổng đài trên mạng.'
              : 'Vệ Binh Mạng does not list bank hotlines: use the number on your card or in the official app. Scammers often post fake hotline numbers online.'}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default Help;
