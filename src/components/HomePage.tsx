
import React, { useState } from 'react';
import { Shield, Search, AlertTriangle, Users, TrendingUp, MapPin, Phone, Globe, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import SearchResults from './SearchResults';
import ReportForm from './ReportForm';
import ImageAnalysis from './ImageAnalysis';
import AIProviderSetup from './AIProviderSetup';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'report' | 'image'>('search');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowResults(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const exampleSearches = [
    { icon: Phone, text: "0123456789", type: "Số điện thoại" },
    { icon: Globe, text: "scam-website.com", type: "Website" },
    { icon: CreditCard, text: "1234567890123456", type: "Số tài khoản" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Hero Section */}
      <section className="px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Shield className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Bảo vệ bạn khỏi{' '}
            <span className="text-blue-600">lừa đảo</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Kiểm tra số điện thoại, website và thông tin đáng ngờ. 
            Nhận cảnh báo realtime và chia sẻ kinh nghiệm với cộng đồng.
          </p>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Link to="/safety" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">An toàn cá nhân</h3>
                  <p className="text-sm text-gray-600">Theo dõi GPS và cảnh báo khu vực nguy hiểm</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/scam-rankings" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Bảng xếp hạng lừa đảo</h3>
                  <p className="text-sm text-gray-600">Thống kê các hình thức lừa đảo nguy hiểm nhất</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/community-alerts" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Cảnh báo cộng đồng</h3>
                  <p className="text-sm text-gray-600">Thông tin cảnh báo realtime từ cộng đồng</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Search Section */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur shadow-xl">
            <CardHeader>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <Button
                  variant={activeTab === 'search' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('search')}
                  className="flex items-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Kiểm tra thông tin</span>
                </Button>
                <Button
                  variant={activeTab === 'report' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('report')}
                  className="flex items-center space-x-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Báo cáo lừa đảo</span>
                </Button>
                <Button
                  variant={activeTab === 'image' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('image')}
                  className="flex items-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Phân tích hình ảnh</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === 'search' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập số điện thoại, website, email hoặc thông tin cần kiểm tra..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 h-12 text-lg"
                      />
                      <Button onClick={handleSearch} size="lg" className="px-8">
                        <Search className="w-5 h-5 mr-2" />
                        Kiểm tra
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="text-sm text-gray-600 mr-2">Ví dụ:</span>
                      {exampleSearches.map((example, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery(example.text)}
                          className="flex items-center space-x-1 text-xs"
                        >
                          <example.icon className="w-3 h-3" />
                          <span>{example.text}</span>
                          <Badge variant="secondary" className="text-xs">{example.type}</Badge>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {showResults && <SearchResults query={searchQuery} riskLevel="safe" onBack={() => setShowResults(false)} />}
                </div>
              )}

              {activeTab === 'report' && <ReportForm onBack={() => setActiveTab('search')} />}
              {activeTab === 'image' && <ImageAnalysis />}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Thống kê bảo vệ cộng đồng
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Số điện thoại được kiểm tra</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">15,000+</div>
              <div className="text-gray-600">Báo cáo lừa đảo</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Độ chính xác phát hiện</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Giám sát liên tục</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Provider Setup */}
      <section className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AIProviderSetup />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold">ScamGuard</span>
              </div>
              <p className="text-gray-400">
                Bảo vệ bạn khỏi lừa đảo với công nghệ AI tiên tiến và cộng đồng cảnh báo.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Liên kết nhanh</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/safety" className="hover:text-white">An toàn cá nhân</Link></li>
                <li><Link to="/scam-rankings" className="hover:text-white">Bảng xếp hạng</Link></li>
                <li><Link to="/community-alerts" className="hover:text-white">Cảnh báo cộng đồng</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">Giới thiệu</Link></li>
                <li><Link to="/contact" className="hover:text-white">Liên hệ</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Chính sách bảo mật</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Cơ quan chức năng</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/authorities" className="hover:text-white">Số điện thoại khẩn cấp</Link></li>
                <li><a href="tel:113" className="hover:text-white">113 - Cảnh sát</a></li>
                <li><a href="tel:1900545464" className="hover:text-white">1900 545464 - Ngân hàng</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ScamGuard. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
