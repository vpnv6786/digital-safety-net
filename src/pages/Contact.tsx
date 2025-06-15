
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Shield, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
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
            {language === 'en' ? 'Contact us' : 'Liên hệ với chúng tôi'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Have questions, feedback or need support? We are always ready to listen and help you.'
              : 'Có câu hỏi, góp ý hoặc cần hỗ trợ? Chúng tôi luôn sẵn sàng lắng nghe và giúp đỡ bạn.'
            }
          </p>
        </section>

        {/* Contact Options */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-trust-blue flex items-center">
                <Mail className="w-6 h-6 mr-2" />
                {language === 'en' ? 'Email support' : 'Email hỗ trợ'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                {language === 'en' 
                  ? 'Send an email to get direct support from our team'
                  : 'Gửi email để được hỗ trợ trực tiếp từ đội ngũ của chúng tôi'
                }
              </p>
              <Button className="w-full bg-trust-blue hover:bg-trust-blue-dark">
                <Mail className="w-4 h-4 mr-2" />
                support@vebinh.com
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-trust-blue flex items-center">
                <MessageCircle className="w-6 h-6 mr-2" />
                {language === 'en' ? 'Emergency report' : 'Báo cáo khẩn cấp'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                {language === 'en' 
                  ? 'Report dangerous scam cases immediately'
                  : 'Báo cáo ngay các trường hợp lừa đảo nguy hiểm'
                }
              </p>
              <Button className="w-full bg-danger-red hover:bg-red-700">
                <Phone className="w-4 h-4 mr-2" />
                Hotline: 1900-888-999
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {language === 'en' ? 'Frequently asked questions' : 'Câu hỏi thường gặp'}
          </h2>
          
          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'en' 
                    ? 'How to report a scam phone number?'
                    : 'Làm sao để báo cáo một số điện thoại lừa đảo?'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {language === 'en' 
                    ? 'You can use the "Report" feature on the homepage, fill in detailed information about the scam case and submit the report. The information will be reviewed and updated in the system.'
                    : 'Bạn có thể sử dụng tính năng "Báo cáo" trên trang chủ, điền thông tin chi tiết về trường hợp lừa đảo và gửi báo cáo. Thông tin sẽ được xem xét và cập nhật vào hệ thống.'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'en' 
                    ? 'How accurate is the AI Agent?'
                    : 'Độ chính xác của AI Agent như thế nào?'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {language === 'en' 
                    ? 'The AI Agent is trained with data on common scam patterns in Vietnam and is continuously updated. However, the results are for reference only and you should verify information from multiple sources.'
                    : 'AI Agent được đào tạo với dữ liệu về các mẫu lừa đảo phổ biến tại Việt Nam và liên tục cập nhật. Tuy nhiên, kết quả chỉ mang tính tham khảo và bạn nên xác minh thông tin từ nhiều nguồn.'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'en' 
                    ? 'Is personal information kept confidential?'
                    : 'Thông tin cá nhân có được bảo mật không?'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {language === 'en' 
                    ? 'We are committed to protecting users\' personal information according to the highest security standards. Information is only used for analysis and safety alerts.'
                    : 'Chúng tôi cam kết bảo vệ thông tin cá nhân của người dùng theo tiêu chuẩn bảo mật cao nhất. Thông tin chỉ được sử dụng cho mục đích phân tích và cảnh báo an toàn.'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'en' 
                    ? 'Is there a fee for using the service?'
                    : 'Có mất phí khi sử dụng dịch vụ không?'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {language === 'en' 
                    ? 'ScamGuard is completely free for users. We are committed to providing community protection services without charging fees.'
                    : 'Vệ Binh Mạng hoàn toàn miễn phí cho người dùng. Chúng tôi cam kết cung cấp dịch vụ bảo vệ cộng đồng mà không thu phí.'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="bg-danger-red/5 border border-danger-red/20 rounded-lg py-8 px-6 text-center">
          <h2 className="text-2xl font-bold text-danger-red mb-4">
            ⚠️ {language === 'en' ? 'Emergency case' : 'Trường hợp khẩn cấp'}
          </h2>
          <p className="text-gray-700 mb-6">
            {language === 'en' 
              ? 'If you are being scammed or have lost money, please contact the authorities immediately:'
              : 'Nếu bạn đang bị lừa đảo hoặc mất tiền, hãy liên hệ ngay với cơ quan chức năng:'
            }
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="destructive" className="w-full">
              <Phone className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Police: 113' : 'Công an: 113'}
            </Button>
            <Button variant="destructive" className="w-full">
              <Phone className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Emergency: 115' : 'Cứu trợ: 115'}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
