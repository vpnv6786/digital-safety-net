
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Users, Brain, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
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
            {language === 'en' ? 'About ScamGuard' : 'Về Vệ Binh Mạng'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {language === 'en' 
              ? 'ScamGuard is a community protection platform against online scam activities, using advanced AI technology and community power to create a safer online environment.'
              : 'Vệ Binh Mạng là nền tảng bảo vệ cộng đồng khỏi các hoạt động lừa đảo trực tuyến, sử dụng công nghệ AI tiên tiến và sức mạnh của cộng đồng để tạo ra một môi trường mạng an toàn hơn.'
            }
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-trust-blue flex items-center">
                <Shield className="w-6 h-6 mr-2" />
                {language === 'en' ? 'Mission' : 'Sứ mệnh'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {language === 'en' 
                  ? 'Protect Vietnamese users from online scam forms by providing intelligent analysis tools, community database and timely alerts.'
                  : 'Bảo vệ người dùng Việt Nam khỏi các hình thức lừa đảo trực tuyến bằng cách cung cấp công cụ phân tích thông minh, cơ sở dữ liệu cộng đồng và cảnh báo kịp thời.'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-trust-blue flex items-center">
                <Brain className="w-6 h-6 mr-2" />
                {language === 'en' ? 'Vision' : 'Tầm nhìn'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {language === 'en' 
                  ? 'Become Vietnam\'s leading platform in preventing online scams, creating a safe and trusted online community for everyone.'
                  : 'Trở thành nền tảng hàng đầu Việt Nam trong việc phòng chống lừa đảo trực tuyến, tạo ra một cộng đồng mạng an toàn và tin cậy cho mọi người.'
                }
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {language === 'en' ? 'Key features' : 'Tính năng nổi bật'}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">
                  {language === 'en' ? 'Smart AI Agent' : 'AI Agent Thông Minh'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'In-depth analysis with specialized AI, providing accurate alerts and effective prevention recommendations.'
                    : 'Phân tích chuyên sâu với AI chuyên dụng, đưa ra cảnh báo chính xác và khuyến nghị phòng tránh hiệu quả.'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <Users className="w-12 h-12 text-trust-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">
                  {language === 'en' ? 'Community Reports' : 'Cộng Đồng Báo Cáo'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'Community reporting system helps update and share information about the latest threats.'
                    : 'Hệ thống báo cáo từ cộng đồng giúp cập nhật và chia sẻ thông tin về các mối đe dọa mới nhất.'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <CheckCircle className="w-12 h-12 text-safe-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">
                  {language === 'en' ? 'Trusted Verification' : 'Xác Minh Đáng Tin'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'Information verified by community and AI system to ensure high accuracy.'
                    : 'Thông tin được xác minh bởi cộng đồng và hệ thống AI để đảm bảo độ chính xác cao.'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {language === 'en' ? 'How it works' : 'Cách thức hoạt động'}
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="bg-trust-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {language === 'en' ? 'Search & Analysis' : 'Tìm kiếm & Phân tích'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'Enter phone number, website or content to check. AI Agent will analyze and assess the risk level.'
                    : 'Nhập số điện thoại, website hoặc nội dung cần kiểm tra. AI Agent sẽ phân tích và đưa ra đánh giá về mức độ rủi ro.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="bg-trust-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {language === 'en' ? 'Receive alerts & recommendations' : 'Nhận cảnh báo & khuyến nghị'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'Receive detailed analysis results with risk level, reasons and specific prevention recommendations.'
                    : 'Nhận được kết quả phân tích chi tiết với mức độ rủi ro, lý do và các khuyến nghị phòng tránh cụ thể.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="bg-trust-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {language === 'en' ? 'Report & Share' : 'Báo cáo & Chia sẻ'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'Report new scam cases to help the community and share alerts with loved ones.'
                    : 'Báo cáo các trường hợp lừa đảo mới để giúp cộng đồng và chia sẻ cảnh báo với người thân.'
                  }
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-trust-blue/5 rounded-lg py-12 px-8 text-center">
          <h2 className="text-2xl font-bold text-trust-blue mb-4">
            {language === 'en' ? 'Together building a safe online community' : 'Cùng nhau xây dựng cộng đồng mạng an toàn'}
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Join us in protecting the community from online scam activities. Each of your reports contributes to creating a safer online environment.'
              : 'Hãy tham gia cùng chúng tôi trong việc bảo vệ cộng đồng khỏi các hoạt động lừa đảo trực tuyến. Mỗi báo cáo của bạn đều góp phần tạo nên một môi trường mạng an toàn hơn.'
            }
          </p>
          <Link to="/">
            <Button className="bg-trust-blue hover:bg-trust-blue-dark">
              {language === 'en' ? 'Start protecting now' : 'Bắt đầu bảo vệ ngay'}
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default About;
