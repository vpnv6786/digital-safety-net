
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Users, Brain, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-white font-be-vietnam">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="text-trust-blue hover:bg-trust-blue/10">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Về trang chủ
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-trust-blue" />
            <span className="text-lg font-semibold text-gray-800">Vệ Binh Mạng</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Về Vệ Binh Mạng
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Vệ Binh Mạng là nền tảng bảo vệ cộng đồng khỏi các hoạt động lừa đảo trực tuyến, 
            sử dụng công nghệ AI tiên tiến và sức mạnh của cộng đồng để tạo ra một môi trường mạng an toàn hơn.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-trust-blue flex items-center">
                <Shield className="w-6 h-6 mr-2" />
                Sứ mệnh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Bảo vệ người dùng Việt Nam khỏi các hình thức lừa đảo trực tuyến bằng cách 
                cung cấp công cụ phân tích thông minh, cơ sở dữ liệu cộng đồng và cảnh báo kịp thời.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-trust-blue flex items-center">
                <Brain className="w-6 h-6 mr-2" />
                Tầm nhìn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Trở thành nền tảng hàng đầu Việt Nam trong việc phòng chống lừa đảo trực tuyến, 
                tạo ra một cộng đồng mạng an toàn và tin cậy cho mọi người.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Tính năng nổi bật
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">AI Agent Thông Minh</h3>
                <p className="text-gray-600">
                  Phân tích chuyên sâu với AI chuyên dụng, đưa ra cảnh báo chính xác và khuyến nghị phòng tránh hiệu quả.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <Users className="w-12 h-12 text-trust-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Cộng Đồng Báo Cáo</h3>
                <p className="text-gray-600">
                  Hệ thống báo cáo từ cộng đồng giúp cập nhật và chia sẻ thông tin về các mối đe dọa mới nhất.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <CheckCircle className="w-12 h-12 text-safe-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Xác Minh Đáng Tin</h3>
                <p className="text-gray-600">
                  Thông tin được xác minh bởi cộng đồng và hệ thống AI để đảm bảo độ chính xác cao.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Cách thức hoạt động
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="bg-trust-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Tìm kiếm & Phân tích</h3>
                <p className="text-gray-600">
                  Nhập số điện thoại, website hoặc nội dung cần kiểm tra. AI Agent sẽ phân tích và đưa ra đánh giá về mức độ rủi ro.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="bg-trust-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Nhận cảnh báo & khuyến nghị</h3>
                <p className="text-gray-600">
                  Nhận được kết quả phân tích chi tiết với mức độ rủi ro, lý do và các khuyến nghị phòng tránh cụ thể.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="bg-trust-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Báo cáo & Chia sẻ</h3>
                <p className="text-gray-600">
                  Báo cáo các trường hợp lừa đảo mới để giúp cộng đồng và chia sẻ cảnh báo với người thân.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-trust-blue/5 rounded-lg py-12 px-8 text-center">
          <h2 className="text-2xl font-bold text-trust-blue mb-4">
            Cùng nhau xây dựng cộng đồng mạng an toàn
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Hãy tham gia cùng chúng tôi trong việc bảo vệ cộng đồng khỏi các hoạt động lừa đảo trực tuyến. 
            Mỗi báo cáo của bạn đều góp phần tạo nên một môi trường mạng an toàn hơn.
          </p>
          <Link to="/">
            <Button className="bg-trust-blue hover:bg-trust-blue-dark">
              Bắt đầu bảo vệ ngay
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default About;
