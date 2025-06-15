
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Privacy = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-white font-be-vietnam">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="text-trust-blue hover:bg-trust-blue/10">
              <ArrowLeft className="w-5 h-5 mr-2" />
              {language === 'en' ? 'Back to home' : 'Về trang chủ'}
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-trust-blue" />
            <span className="text-lg font-semibold text-gray-800">
              {language === 'en' ? 'ScamGuard' : 'Vệ Binh Mạng'}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {language === 'en' ? 'Privacy Policy' : 'Chính sách bảo mật'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'We are committed to protecting your privacy and personal information with the highest security standards.'
              : 'Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn với tiêu chuẩn bảo mật cao nhất.'
            }
          </p>
          <p className="text-sm text-gray-500 mt-4">
            {language === 'en' ? 'Last updated: ' : 'Cập nhật lần cuối: '}{new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'vi-VN')}
          </p>
        </section>

        {/* Privacy Principles */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-trust-blue flex items-center">
                <Lock className="w-6 h-6 mr-2" />
                {language === 'en' ? 'Information Security' : 'Bảo mật thông tin'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {language === 'en' 
                  ? 'All information you provide is encrypted and protected with advanced security technology.'
                  : 'Mọi thông tin bạn cung cấp đều được mã hóa và bảo vệ bằng công nghệ bảo mật tiên tiến.'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-trust-blue flex items-center">
                <Eye className="w-6 h-6 mr-2" />
                {language === 'en' ? 'Transparency' : 'Minh bạch'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {language === 'en' 
                  ? 'We are always transparent about how we collect, use and protect your data.'
                  : 'Chúng tôi luôn minh bạch về cách thu thập, sử dụng và bảo vệ dữ liệu của bạn.'
                }
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Main Content */}
        <section className="space-y-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">
                {language === 'en' ? '1. Information we collect' : '1. Thông tin chúng tôi thu thập'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">
                  {language === 'en' ? 'Search information:' : 'Thông tin tìm kiếm:'}
                </h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>{language === 'en' ? 'Phone numbers, websites, emails you search' : 'Số điện thoại, website, email mà bạn tìm kiếm'}</li>
                  <li>{language === 'en' ? 'Content descriptions in reports' : 'Nội dung mô tả trong báo cáo'}</li>
                  <li>{language === 'en' ? 'Images uploaded for analysis' : 'Hình ảnh được upload để phân tích'}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  {language === 'en' ? 'Technical information:' : 'Thông tin kỹ thuật:'}
                </h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>{language === 'en' ? 'IP address and browser information' : 'Địa chỉ IP và thông tin trình duyệt'}</li>
                  <li>{language === 'en' ? 'Access time and service usage' : 'Thời gian truy cập và sử dụng dịch vụ'}</li>
                  <li>{language === 'en' ? 'System logs to improve service' : 'Logs hệ thống để cải thiện dịch vụ'}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">
                {language === 'en' ? '2. How we use information' : '2. Cách chúng tôi sử dụng thông tin'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                <strong>{language === 'en' ? 'Purpose of use:' : 'Mục đích sử dụng:'}</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>{language === 'en' ? 'Analyze and alert about scam threats' : 'Phân tích và cảnh báo về các mối đe dọa lừa đảo'}</li>
                <li>{language === 'en' ? 'Update community database' : 'Cập nhật cơ sở dữ liệu cộng đồng'}</li>
                <li>{language === 'en' ? 'Improve AI Agent accuracy' : 'Cải thiện độ chính xác của AI Agent'}</li>
                <li>{language === 'en' ? 'Provide statistics and reports for community' : 'Cung cấp thống kê và báo cáo cho cộng đồng'}</li>
                <li>{language === 'en' ? 'Contact support when necessary' : 'Liên hệ hỗ trợ khi cần thiết'}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">
                {language === 'en' ? '3. Information sharing' : '3. Chia sẻ thông tin'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                <strong>
                  {language === 'en' 
                    ? 'We DO NOT sell or rent your personal information.'
                    : 'Chúng tôi KHÔNG bán hoặc cho thuê thông tin cá nhân của bạn.'
                  }
                </strong>
              </p>
              <p className="text-gray-700">
                {language === 'en' 
                  ? 'Information is only shared in the following cases:'
                  : 'Thông tin chỉ được chia sẻ trong các trường hợp:'
                }
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>{language === 'en' ? 'With authorities when legally required' : 'Với cơ quan chức năng khi có yêu cầu pháp lý'}</li>
                <li>{language === 'en' ? 'Anonymized data for security research' : 'Dữ liệu đã được ẩn danh để nghiên cứu bảo mật'}</li>
                <li>{language === 'en' ? 'With technology partners to improve service (after anonymization)' : 'Với đối tác công nghệ để cải thiện dịch vụ (sau khi ẩn danh)'}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">
                {language === 'en' ? '4. Data security' : '4. Bảo mật dữ liệu'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                <strong>{language === 'en' ? 'Security measures:' : 'Các biện pháp bảo mật:'}</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>{language === 'en' ? 'SSL/TLS encryption for all communications' : 'Mã hóa SSL/TLS cho mọi giao tiếp'}</li>
                <li>{language === 'en' ? 'Multi-layer authentication system' : 'Hệ thống xác thực đa lớp'}</li>
                <li>{language === 'en' ? 'Regular data backup' : 'Sao lưu dữ liệu định kỳ'}</li>
                <li>{language === 'en' ? 'Regular security audits' : 'Kiểm tra bảo mật thường xuyên'}</li>
                <li>{language === 'en' ? 'Staff training on information security' : 'Đào tạo nhân viên về bảo mật thông tin'}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">
                {language === 'en' ? '5. User rights' : '5. Quyền của người dùng'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{language === 'en' ? 'You have the right to:' : 'Bạn có quyền:'}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>{language === 'en' ? 'Access and view personal information provided' : 'Truy cập và xem thông tin cá nhân đã cung cấp'}</li>
                <li>{language === 'en' ? 'Request correction of inaccurate information' : 'Yêu cầu chỉnh sửa thông tin không chính xác'}</li>
                <li>{language === 'en' ? 'Request deletion of personal data (except data necessary for security)' : 'Yêu cầu xóa dữ liệu cá nhân (trừ dữ liệu cần thiết cho an ninh)'}</li>
                <li>{language === 'en' ? 'Withdraw consent for data processing' : 'Rút lại sự đồng ý xử lý dữ liệu'}</li>
                <li>{language === 'en' ? 'Complain about data processing' : 'Khiếu nại về việc xử lý dữ liệu'}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">
                {language === 'en' ? '6. Contact' : '6. Liên hệ'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                {language === 'en' 
                  ? 'If you have questions about this privacy policy, please contact:'
                  : 'Nếu có câu hỏi về chính sách bảo mật này, vui lòng liên hệ:'
                }
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@vebinh.com<br/>
                  <strong>{language === 'en' ? 'Address:' : 'Địa chỉ'}:</strong> {language === 'en' ? 'Floor 10, ABC Building, District 1, Ho Chi Minh City' : 'Tầng 10, Tòa nhà ABC, Quận 1, TP.HCM'}<br/>
                  <strong>{language === 'en' ? 'Phone:' : 'Điện thoại'}:</strong> 1900-888-999
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer CTA */}
        <section className="bg-trust-blue/5 rounded-lg py-8 px-6 text-center mt-16">
          <h2 className="text-2xl font-bold text-trust-blue mb-4">
            {language === 'en' ? 'Security is our top priority' : 'Bảo mật là ưu tiên hàng đầu'}
          </h2>
          <p className="text-gray-700 mb-6">
            {language === 'en' 
              ? 'We are committed to protecting your information with the highest level of security. For any privacy questions, please contact us.'
              : 'Chúng tôi cam kết bảo vệ thông tin của bạn với mức độ bảo mật cao nhất. Mọi thắc mắc về quyền riêng tư, vui lòng liên hệ với chúng tôi.'
            }
          </p>
          <Link to="/contact">
            <Button className="bg-trust-blue hover:bg-trust-blue-dark">
              <UserCheck className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Contact support' : 'Liên hệ hỗ trợ'}
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
