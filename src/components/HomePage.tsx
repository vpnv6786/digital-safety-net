
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
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'report' | 'image'>('search');
  const { language } = useLanguage();
  const isMobile = useIsMobile();

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
    { 
      icon: Phone, 
      text: "0123456789", 
      type: language === 'en' ? 'Phone number' : 'Số điện thoại' 
    },
    { 
      icon: Globe, 
      text: "scam-website.com", 
      type: "Website" 
    },
    { 
      icon: CreditCard, 
      text: "1234567890123456", 
      type: language === 'en' ? 'Account number' : 'Số tài khoản' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Hero Section */}
      <section className="px-4 py-8 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            {language === 'en' ? 'Protect yourself from' : 'Bảo vệ bạn khỏi'}{' '}
            <span className="text-blue-600">
              {language === 'en' ? 'scams' : 'lừa đảo'}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            {language === 'en' 
              ? 'Check phone numbers, websites and suspicious information. Get real-time alerts and share experiences with the community.'
              : 'Kiểm tra số điện thoại, website và thông tin đáng ngờ. Nhận cảnh báo thời gian thực và chia sẻ kinh nghiệm với cộng đồng.'
            }
          </p>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 sm:mb-8">
            <Link to="/safety" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur h-full">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2 sm:mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                    {language === 'en' ? 'Personal Safety' : 'An toàn cá nhân'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {language === 'en' 
                      ? 'GPS tracking and dangerous area alerts'
                      : 'Theo dõi GPS và cảnh báo khu vực nguy hiểm'
                    }
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/scam-rankings" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur h-full">
                <CardContent className="p-4 sm:p-6 text-center">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2 sm:mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                    {language === 'en' ? 'Scam Rankings' : 'Bảng xếp hạng lừa đảo'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {language === 'en'
                      ? 'Statistics of the most dangerous scam types'
                      : 'Thống kê các hình thức lừa đảo nguy hiểm nhất'
                    }
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/community-alerts" className="block sm:col-span-2 md:col-span-1">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur h-full">
                <CardContent className="p-4 sm:p-6 text-center">
                  <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2 sm:mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                    {language === 'en' ? 'Community Alerts' : 'Cảnh báo cộng đồng'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {language === 'en'
                      ? 'Real-time alert information from the community'
                      : 'Thông tin cảnh báo thời gian thực từ cộng đồng'
                    }
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Search Section */}
      <section className="px-4 pb-8 sm:pb-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <Button
                  variant={activeTab === 'search' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('search')}
                  className="flex items-center space-x-2 text-xs sm:text-sm"
                  size={isMobile ? 'sm' : 'default'}
                >
                  <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                  {language === 'en' ? 'Check Information' : 'Kiểm tra thông tin'}
                </Button>
                <Button
                  variant={activeTab === 'report' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('report')}
                  className="flex items-center space-x-2 text-xs sm:text-sm"
                  size={isMobile ? 'sm' : 'default'}
                >
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {language === 'en' ? 'Report Scam' : 'Báo cáo lừa đảo'}
                </Button>
                <Button
                  variant={activeTab === 'image' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('image')}
                  className="flex items-center space-x-2 text-xs sm:text-sm"
                  size={isMobile ? 'sm' : 'default'}
                >
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  {language === 'en' ? 'Image Analysis' : 'Phân tích hình ảnh'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === 'search' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        placeholder={
                          language === 'en' 
                            ? "Enter phone number, website, email or information to check..."
                            : "Nhập số điện thoại, website, email hoặc thông tin cần kiểm tra..."
                        }
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 h-10 sm:h-12 text-sm sm:text-lg"
                      />
                      <Button onClick={handleSearch} size={isMobile ? 'default' : 'lg'} className="px-4 sm:px-8">
                        <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                        {language === 'en' ? 'Check' : 'Kiểm tra'}
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="text-xs sm:text-sm text-gray-600 mr-2">
                        {language === 'en' ? 'Examples:' : 'Ví dụ:'}
                      </span>
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
      <section className="px-4 py-8 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            {language === 'en' ? 'Community Protection Statistics' : 'Thống kê bảo vệ cộng đồng'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-sm sm:text-base text-gray-600">
                {language === 'en' ? 'Phone numbers checked' : 'Số điện thoại được kiểm tra'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">15,000+</div>
              <div className="text-sm sm:text-base text-gray-600">
                {language === 'en' ? 'Scam reports' : 'Báo cáo lừa đảo'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-sm sm:text-base text-gray-600">
                {language === 'en' ? 'Detection accuracy' : 'Độ chính xác phát hiện'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-sm sm:text-base text-gray-600">
                {language === 'en' ? 'Continuous monitoring' : 'Giám sát liên tục'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Provider Setup */}
      <section className="px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <AIProviderSetup />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                <span className="text-lg sm:text-xl font-bold">ScamGuard</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400">
                {language === 'en' 
                  ? 'Protect yourself from scams with advanced AI technology and community alerts.'
                  : 'Bảo vệ bạn khỏi lừa đảo với công nghệ AI tiên tiến và cảnh báo cộng đồng.'
                }
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-sm sm:text-base">
                {language === 'en' ? 'Quick Links' : 'Liên kết nhanh'}
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/safety" className="hover:text-white">
                  {language === 'en' ? 'Personal Safety' : 'An toàn cá nhân'}
                </Link></li>
                <li><Link to="/scam-rankings" className="hover:text-white">
                  {language === 'en' ? 'Rankings' : 'Bảng xếp hạng'}
                </Link></li>
                <li><Link to="/community-alerts" className="hover:text-white">
                  {language === 'en' ? 'Community Alerts' : 'Cảnh báo cộng đồng'}
                </Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-sm sm:text-base">
                {language === 'en' ? 'Support' : 'Hỗ trợ'}
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white">
                  {language === 'en' ? 'About' : 'Giới thiệu'}
                </Link></li>
                <li><Link to="/contact" className="hover:text-white">
                  {language === 'en' ? 'Contact' : 'Liên hệ'}
                </Link></li>
                <li><Link to="/privacy" className="hover:text-white">
                  {language === 'en' ? 'Privacy Policy' : 'Chính sách bảo mật'}
                </Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-sm sm:text-base">
                {language === 'en' ? 'Authorities' : 'Cơ quan chức năng'}
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/authorities" className="hover:text-white">
                  {language === 'en' ? 'Emergency Numbers' : 'Số điện thoại khẩn cấp'}
                </Link></li>
                <li><a href="tel:113" className="hover:text-white">113 - {language === 'en' ? 'Police' : 'Cảnh sát'}</a></li>
                <li><a href="tel:1900545464" className="hover:text-white">1900 545464 - {language === 'en' ? 'Banking' : 'Ngân hàng'}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; 2024 ScamGuard. {language === 'en' ? 'All rights reserved.' : 'Tất cả quyền được bảo lưu.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
