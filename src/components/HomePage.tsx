import React, { useState } from 'react';
import { Shield, Search, AlertTriangle, Users, TrendingUp, MapPin, Phone, Globe, CreditCard, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import SearchResults from './SearchResults';
import ReportForm from './ReportForm';
import ImageAnalysis from './ImageAnalysis';
import AIProviderSetup from './AIProviderSetup';
import SocialShare from './SocialShare';
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

          {/* Social Share Section */}
          <div className="mb-6 sm:mb-8">
            <Card className="bg-white/80 backdrop-blur shadow-lg max-w-2xl mx-auto">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Share className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                    {language === 'en' ? 'Help protect the community' : 'Giúp bảo vệ cộng đồng'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 text-center">
                  {language === 'en' 
                    ? 'Share ScamGuard with your friends and family to keep them safe'
                    : 'Chia sẻ ScamGuard với bạn bè và gia đình để bảo vệ họ'
                  }
                </p>
                <div className="flex justify-center">
                  <SocialShare
                    title={language === 'en' ? 'ScamGuard - Protect Yourself from Online Scams' : 'ScamGuard - Bảo vệ bản thân khỏi lừa đảo trực tuyến'}
                    description={language === 'en' 
                      ? 'AI-powered protection against online scams for Vietnamese community'
                      : 'Công nghệ AI bảo vệ cộng đồng Việt Nam khỏi lừa đảo trực tuyến'
                    }
                    hashtags={['ScamGuard', 'OnlineSafety', 'Vietnam', 'CyberSecurity']}
                    className="justify-center"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

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
    </div>
  );
};

export default HomePage;
