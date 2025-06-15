
import React from 'react';
import { ArrowLeft, Shield, AlertTriangle, XCircle, CheckCircle, Share2, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SearchResultsProps {
  query: string;
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  onBack: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, riskLevel, onBack }) => {
  const getResultConfig = (risk: string) => {
    switch (risk) {
      case 'safe':
        return {
          icon: CheckCircle,
          iconColor: 'text-safe-green',
          bgColor: 'bg-safe-green/10',
          borderColor: 'border-safe-green',
          title: 'THÔNG TIN AN TOÀN',
          message: 'Thông tin này chưa có báo cáo nào. Hãy luôn cẩn trọng.',
          description: 'Không có cảnh báo nào từ cộng đồng cho thông tin này.',
          actionButton: 'Tôi muốn báo cáo'
        };
      case 'suspicious':
        return {
          icon: AlertTriangle,
          iconColor: 'text-warning-orange',
          bgColor: 'bg-warning-orange/10',
          borderColor: 'border-warning-orange',
          title: 'CẢNH BÁO NGHI NGỜ',
          message: 'Có một số báo cáo về thông tin này. Hãy thận trọng.',
          description: 'Cộng đồng đã gửi một số cảnh báo về thông tin này.',
          actionButton: 'Tôi cũng gặp phải'
        };
      case 'dangerous':
        return {
          icon: XCircle,
          iconColor: 'text-danger-red',
          bgColor: 'bg-danger-red/10',
          borderColor: 'border-danger-red',
          title: 'CẢNH BÁO NGUY HIỂM',
          message: 'Thông tin này có nhiều báo cáo lừa đảo. TUYỆT ĐỐI KHÔNG tin tưởng!',
          description: 'Nhiều người dùng đã báo cáo về hoạt động lừa đảo từ thông tin này.',
          actionButton: 'Tôi cũng bị lừa'
        };
      default:
        return getResultConfig('safe');
    }
  };

  const config = getResultConfig(riskLevel);
  const IconComponent = config.icon;

  const mockReports = riskLevel !== 'safe' ? [
    {
      id: 1,
      category: 'Giả danh công an',
      description: 'Gọi điện tự xưng là công an, yêu cầu chuyển tiền để giải quyết vụ án',
      reportedAt: '2 ngày trước',
      verifiedBy: 3
    },
    {
      id: 2,
      category: 'Lừa đảo đầu tư',
      description: 'Mời tham gia đầu tư online với lợi nhuận cao',
      reportedAt: '1 tuần trước',
      verifiedBy: 7
    }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-white font-be-vietnam">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-trust-blue hover:bg-trust-blue/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Query Display */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Kết quả tra cứu</h1>
          <div className="inline-flex items-center bg-gray-100 rounded-lg px-4 py-2">
            <span className="text-gray-600">Thông tin tìm kiếm: </span>
            <span className="font-semibold text-trust-blue ml-2">{query}</span>
          </div>
        </div>

        {/* Main Result Card */}
        <Card className={`mb-8 ${config.borderColor} border-2 ${config.bgColor} animate-fade-in-up`}>
          <CardContent className="pt-8 text-center">
            <div className={`w-24 h-24 rounded-full ${config.bgColor} flex items-center justify-center mx-auto mb-6`}>
              <IconComponent className={`w-12 h-12 ${config.iconColor}`} />
            </div>
            
            <h2 className={`text-2xl font-bold mb-4 ${config.iconColor}`}>
              {config.title}
            </h2>
            
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              {config.message}
            </p>
            
            <p className="text-gray-600 mb-8">
              {config.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className={riskLevel === 'dangerous' ? 'bg-danger-red hover:bg-red-700' : 'bg-trust-blue hover:bg-trust-blue-dark'} 
                size="lg"
              >
                <Flag className="w-5 h-5 mr-2" />
                {config.actionButton}
              </Button>
              
              <Button variant="outline" size="lg" className="border-trust-blue text-trust-blue hover:bg-trust-blue hover:text-white">
                <Share2 className="w-5 h-5 mr-2" />
                Chia sẻ cảnh báo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        {riskLevel !== 'safe' && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-danger-red mb-2">
                  {riskLevel === 'dangerous' ? '24' : '8'}
                </div>
                <div className="text-gray-600">Báo cáo đã nhận</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-warning-orange mb-2">
                  {riskLevel === 'dangerous' ? '15' : '5'}
                </div>
                <div className="text-gray-600">Đã xác minh</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-trust-blue mb-2">
                  {riskLevel === 'dangerous' ? '95%' : '70%'}
                </div>
                <div className="text-gray-600">Độ tin cậy</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Related Reports */}
        {mockReports.length > 0 && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Các báo cáo liên quan</h3>
            
            <div className="space-y-4">
              {mockReports.map((report, index) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow animate-fade-in-up" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="destructive" className="bg-danger-red">
                        {report.category}
                      </Badge>
                      <span className="text-sm text-gray-500">{report.reportedAt}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">{report.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-safe-green mr-1" />
                      <span>{report.verifiedBy} người xác nhận</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Safety Tips */}
        <Alert className="mt-8 border-trust-blue bg-trust-blue/5">
          <Shield className="h-4 w-4 text-trust-blue" />
          <AlertDescription className="text-trust-blue font-medium">
            <strong>Lời khuyên an toàn:</strong> Dù kết quả như thế nào, hãy luôn kiểm tra kỹ lưỡng trước khi cung cấp thông tin cá nhân hoặc chuyển tiền. Khi có nghi ngờ, hãy liên hệ trực tiếp với tổ chức/cơ quan chính thức.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default SearchResults;
