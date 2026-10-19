import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { CONTACT_EMAIL } from '@/lib/site';

const Privacy = () => {
  const { language } = useLanguage();
  const vi = language === 'vi';

  const sections = vi
    ? [
        {
          title: 'Khi bạn kiểm tra',
          body: [
            'Nội dung bạn dán được phân tích ngay trên trình duyệt.',
            'Chỉ số điện thoại, tên miền, email hoặc số tài khoản tìm thấy được gửi đi để tra báo cáo cộng đồng. Chúng không được lưu vào cơ sở dữ liệu của Vệ Binh Mạng.',
            'Nhà cung cấp hạ tầng (Supabase) có thể ghi nhật ký kỹ thuật của yêu cầu theo chính sách của họ.',
          ],
        },
        {
          title: 'Khi bạn đăng nhập và báo cáo',
          body: [
            'Tài khoản: số điện thoại hoặc email dùng để đăng nhập.',
            'Báo cáo: loại mục, số điện thoại / tên miền / email bị báo cáo, thủ đoạn, mô tả, thời gian.',
            'Số tài khoản ngân hàng là dữ liệu cá nhân nhạy cảm: chỉ lưu mã băm một chiều và 4 số cuối, không lưu số đầy đủ.',
            'Người dùng khác không xem được báo cáo hay danh tính của bạn; công chúng chỉ thấy số lượng báo cáo.',
          ],
        },
        {
          title: 'Không thu thập',
          body: ['Vị trí, danh bạ, nội dung tin nhắn trong máy bạn. Các tính năng định vị cũ đã được gỡ bỏ.'],
        },
        {
          title: 'Quyền của bạn',
          body: [
            'Theo Luật Bảo vệ dữ liệu cá nhân 2025 và Nghị định 356/2025, bạn có quyền xem, sửa, xoá dữ liệu và rút lại sự đồng ý.',
            CONTACT_EMAIL ? `Gửi yêu cầu tới ${CONTACT_EMAIL}.` : 'Kênh tiếp nhận yêu cầu đang được thiết lập.',
          ],
        },
      ]
    : [
        {
          title: 'When you check something',
          body: [
            'What you paste is analysed in your browser.',
            'Only phone numbers, domains, emails or account numbers found are sent to look up community reports. They are not stored in the Vệ Binh Mạng database.',
            'Our infrastructure provider (Supabase) may keep technical request logs under its own policy.',
          ],
        },
        {
          title: 'When you sign in and report',
          body: [
            'Account: the phone number or email used to sign in.',
            'Reports: item type, the reported phone / domain / email, scam type, description, time.',
            'Bank account numbers are sensitive personal data: only a one-way hash and the last 4 digits are stored.',
            'Other users cannot see your reports or identity; the public sees report counts only.',
          ],
        },
        { title: 'Not collected', body: ['Location, contacts, or messages on your phone. The old location features were removed.'] },
        {
          title: 'Your rights',
          body: [
            'Under the 2025 Personal Data Protection Law and Decree 356/2025 you can access, correct and delete your data and withdraw consent.',
            CONTACT_EMAIL ? `Send requests to ${CONTACT_EMAIL}.` : 'A channel for requests is being set up.',
          ],
        },
      ];

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{vi ? 'Quyền riêng tư' : 'Privacy'}</h1>
        <p className="text-sm text-gray-600">
          {vi ? 'Cập nhật 19/10/2026. Chính sách này đang được rà soát pháp lý.' : 'Updated 19 Oct 2026. This policy is under legal review.'}
        </p>
        {sections.map((s) => (
          <Card key={s.title}>
            <CardContent className="p-5">
              <h2 className="font-semibold text-gray-900 mb-2">{s.title}</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {s.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Privacy;
