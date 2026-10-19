import { Link } from 'react-router-dom';
import { Flag, LifeBuoy, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { CONTACT_EMAIL } from '@/lib/site';

const Contact = () => {
  const { language } = useLanguage();
  const vi = language === 'vi';

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{vi ? 'Liên hệ' : 'Contact'}</h1>

        <Card className="border-danger-red/40">
          <CardContent className="p-5 space-y-3">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-danger-red" aria-hidden="true" />
              {vi ? 'Đang gặp nguy hiểm hoặc vừa mất tiền?' : 'In danger or just lost money?'}
            </h2>
            <p className="text-sm text-gray-700">
              {vi
                ? 'Gọi 113 nếu đang bị đe doạ. Gọi ngay ngân hàng bằng số in trên thẻ để khoá tài khoản. Vệ Binh Mạng không thể can thiệp giao dịch.'
                : 'Call 113 if you are threatened. Call your bank on the number printed on your card to block the account. Vệ Binh Mạng cannot stop transactions.'}
            </p>
            <Button asChild variant="destructive">
              <Link to="/tro-giup">
                <LifeBuoy className="w-4 h-4 mr-2" />
                {vi ? 'Các bước cần làm ngay' : 'Steps to take now'}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-3">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Flag className="w-5 h-5 text-trust-blue" aria-hidden="true" />
              {vi ? 'Báo cáo lừa đảo' : 'Report a scam'}
            </h2>
            <p className="text-sm text-gray-700">
              {vi
                ? 'Dùng mục "Báo cáo lừa đảo" trên trang chủ. Báo cáo được kiểm duyệt trước khi ảnh hưởng tới kết luận công khai.'
                : 'Use "Report a scam" on the home page. Reports are reviewed before they affect public answers.'}
            </p>
            <Button asChild variant="outline">
              <Link to="/">{vi ? 'Mở trang báo cáo' : 'Open the report form'}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-2">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-trust-blue" aria-hidden="true" />
              {vi ? 'Góp ý, khiếu nại báo cáo nhầm, quyền dữ liệu' : 'Feedback, wrong reports, data requests'}
            </h2>
            {CONTACT_EMAIL ? (
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-trust-blue underline break-all">
                {CONTACT_EMAIL}
              </a>
            ) : (
              <p className="text-sm text-gray-600">
                {vi ? 'Địa chỉ liên hệ đang được thiết lập.' : 'A contact address is being set up.'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
