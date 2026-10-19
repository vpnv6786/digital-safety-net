import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { language } = useLanguage();
  const vi = language === 'vi';

  const sections = vi
    ? [
        {
          title: 'Vệ Binh Mạng là gì',
          body: 'Một công cụ miễn phí giúp người dân tự kiểm tra tin nhắn, số điện thoại, link, email và số tài khoản trước khi chuyển tiền, cài ứng dụng hay bấm link, và biết phải làm gì nếu đã lỡ bị lừa.',
        },
        {
          title: 'Cách kết luận',
          body: 'Kết luận dựa trên luật nhận diện các kịch bản lừa đảo phổ biến ở Việt Nam, danh sách tên miền chính thức đã kiểm tra, và báo cáo cộng đồng đã được kiểm duyệt. Không có mức "an toàn": khi chưa có dữ liệu, câu trả lời là "chưa đủ thông tin".',
        },
        {
          title: 'Báo cáo cộng đồng',
          body: 'Người báo cáo phải đăng nhập bằng số điện thoại. Mỗi người chỉ báo cáo một lần cho một mục. Báo cáo chỉ được tính là "đã xác minh" sau khi người kiểm duyệt xem xét. Chủ số điện thoại hoặc website bị báo cáo nhầm có thể liên hệ để được xem xét lại.',
        },
        {
          title: 'Vệ Binh Mạng không phải',
          body: 'Không phải cơ quan nhà nước, không thay thế công an hay ngân hàng, và không lấy lại tiền đã mất. Kết luận chỉ mang tính tham khảo.',
        },
      ]
    : [
        {
          title: 'What Vệ Binh Mạng is',
          body: 'A free tool that lets people check messages, phone numbers, links, emails and bank accounts before paying, installing an app or tapping a link, and tells them what to do if they were already scammed.',
        },
        {
          title: 'How it decides',
          body: 'Answers use rules for common Vietnamese scam scripts, a checked list of official domains, and moderator-reviewed community reports. There is no "safe" answer: without data, the answer is "not enough information".',
        },
        {
          title: 'Community reports',
          body: 'Reporters sign in with a phone number. Each person can report an item once. A report counts as "verified" only after a moderator reviews it. Owners of wrongly reported numbers or sites can ask for a review.',
        },
        {
          title: 'What it is not',
          body: 'It is not a government body, does not replace the police or your bank, and cannot recover lost money. Answers are guidance only.',
        },
      ];

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{vi ? 'Giới thiệu' : 'About'}</h1>
        {sections.map((s) => (
          <Card key={s.title}>
            <CardContent className="p-5">
              <h2 className="font-semibold text-gray-900 mb-1">{s.title}</h2>
              <p className="text-gray-700 text-sm sm:text-base">{s.body}</p>
            </CardContent>
          </Card>
        ))}
        <p className="text-sm text-gray-600">
          <Link to="/" className="text-trust-blue underline">
            {vi ? 'Kiểm tra ngay' : 'Check something now'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default About;
