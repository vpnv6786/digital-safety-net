
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Privacy = () => {
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
            Chính sách bảo mật
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn với tiêu chuẩn bảo mật cao nhất.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </section>

        {/* Privacy Principles */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-trust-blue flex items-center">
                <Lock className="w-6 h-6 mr-2" />
                Bảo mật thông tin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Mọi thông tin bạn cung cấp đều được mã hóa và bảo vệ bằng công nghệ bảo mật tiên tiến.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-trust-blue flex items-center">
                <Eye className="w-6 h-6 mr-2" />
                Minh bạch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Chúng tôi luôn minh bạch về cách thu thập, sử dụng và bảo vệ dữ liệu của bạn.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Main Content */}
        <section className="space-y-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">1. Thông tin chúng tôi thu thập</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Thông tin tìm kiếm:</h4>
                <p className="text-gray-700">
                  - Số điện thoại, website, email mà bạn tìm kiếm<br/>
                  - Nội dung mô tả trong báo cáo<br/>
                  - Hình ảnh được upload để phân tích
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Thông tin kỹ thuật:</h4>
                <p className="text-gray-700">
                  - Địa chỉ IP và thông tin trình duyệt<br/>
                  - Thời gian truy cập và sử dụng dịch vụ<br/>
                  - Logs hệ thống để cải thiện dịch vụ
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">2. Cách chúng tôi sử dụng thông tin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                <strong>Mục đích sử dụng:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Phân tích và cảnh báo về các mối đe dọa lừa đảo</li>
                <li>Cập nhật cơ sở dữ liệu cộng đồng</li>
                <li>Cải thiện độ chính xác của AI Agent</li>
                <li>Cung cấp thống kê và báo cáo cho cộng đồng</li>
                <li>Liên hệ hỗ trợ khi cần thiết</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">3. Chia sẻ thông tin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                <strong>Chúng tôi KHÔNG bán hoặc cho thuê thông tin cá nhân của bạn.</strong>
              </p>
              <p className="text-gray-700">
                Thông tin chỉ được chia sẻ trong các trường hợp:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Với cơ quan chức năng khi có yêu cầu pháp lý</li>
                <li>Dữ liệu đã được ẩn danh để nghiên cứu bảo mật</li>
                <li>Với đối tác công nghệ để cải thiện dịch vụ (sau khi ẩn danh)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">4. Bảo mật dữ liệu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                <strong>Các biện pháp bảo mật:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Mã hóa SSL/TLS cho mọi giao tiếp</li>
                <li>Hệ thống xác thực đa lớp</li>
                <li>Sao lưu dữ liệu định kỳ</li>
                <li>Kiểm tra bảo mật thường xuyên</li>
                <li>Đào tạo nhân viên về bảo mật thông tin</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">5. Quyền của người dùng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">Bạn có quyền:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Truy cập và xem thông tin cá nhân đã cung cấp</li>
                <li>Yêu cầu chỉnh sửa thông tin không chính xác</li>
                <li>Yêu cầu xóa dữ liệu cá nhân (trừ dữ liệu cần thiết cho an ninh)</li>
                <li>Rút lại sự đồng ý xử lý dữ liệu</li>
                <li>Khiếu nại về việc xử lý dữ liệu</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">6. Liên hệ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Nếu có câu hỏi về chính sách bảo mật này, vui lòng liên hệ:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@vebinh.com<br/>
                  <strong>Địa chỉ:</strong> Tầng 10, Tòa nhà ABC, Quận 1, TP.HCM<br/>
                  <strong>Điện thoại:</strong> 1900-888-999
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer CTA */}
        <section className="bg-trust-blue/5 rounded-lg py-8 px-6 text-center mt-16">
          <h2 className="text-2xl font-bold text-trust-blue mb-4">
            Bảo mật là ưu tiên hàng đầu
          </h2>
          <p className="text-gray-700 mb-6">
            Chúng tôi cam kết bảo vệ thông tin của bạn với mức độ bảo mật cao nhất. 
            Mọi thắc mắc về quyền riêng tư, vui lòng liên hệ với chúng tôi.
          </p>
          <Link to="/contact">
            <Button className="bg-trust-blue hover:bg-trust-blue-dark">
              <UserCheck className="w-4 h-4 mr-2" />
              Liên hệ hỗ trợ
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
