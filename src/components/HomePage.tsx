
import React, { useState } from 'react';
import { Search, ShieldAlert, Lightbulb, Users, CheckCheck, PlusCircle, Info, Phone, Lock, Shield, AlertTriangle, Activity, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import AIKeyInput from '@/components/AIKeyInput';
import ImageAnalysis from '@/components/ImageAnalysis';
import { searchEntity } from '@/services/searchService';

interface HomePageProps {
  onSearch: (query: string, result?: any) => void;
  onReport: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSearch, onReport }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { t, language } = useLanguage();

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async () => {
    if (searchQuery.trim() !== '') {
      setIsSearching(true);
      try {
        // Use AI Agent enhanced search
        const result = await searchEntity(searchQuery.trim());
        onSearch(searchQuery, result);
      } catch (error) {
        console.error('Search failed:', error);
        // Fallback to basic search
        onSearch(searchQuery);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-white font-be-vietnam">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-trust-blue" />
            <span className="text-lg font-semibold text-gray-800">
              {language === 'en' ? 'Scam Guard' : 'Vệ Binh Mạng'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/about" className="text-gray-600 hover:text-trust-blue transition-colors">
                <div className="flex items-center space-x-1">
                  <Info className="w-4 h-4" />
                  <span>{language === 'en' ? 'About' : 'Giới thiệu'}</span>
                </div>
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-trust-blue transition-colors">
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{language === 'en' ? 'Contact' : 'Liên hệ'}</span>
                </div>
              </Link>
              <Link to="/privacy" className="text-gray-600 hover:text-trust-blue transition-colors">
                <div className="flex items-center space-x-1">
                  <Lock className="w-4 h-4" />
                  <span>{language === 'en' ? 'Privacy' : 'Bảo mật'}</span>
                </div>
              </Link>
            </nav>
            
            <AIKeyInput />
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section - Enhanced with proper copy */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {language === 'en' 
              ? 'Suspicious Message? Check Before You Trust.'
              : 'Nhận tin nhắn lạ? Tra cứu trước khi tin.'
            }
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            {language === 'en'
              ? 'Scam Guard is a free community shield that helps you verify and report online scams in seconds.'
              : 'Vệ Binh Mạng là lá chắn cộng đồng miễn phí, giúp bạn kiểm tra và báo cáo lừa đảo trực tuyến chỉ trong vài giây.'
            }
          </p>
          
          {/* Enhanced Search Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Input
                type="text"
                placeholder={language === 'en' 
                  ? 'Enter phone, bank account, website to check...'
                  : 'Nhập SĐT, tài khoản ngân hàng, website để kiểm tra...'
                }
                className="w-full text-lg py-4 px-6 rounded-full shadow-lg border-2 border-gray-200 focus:border-trust-blue text-center sm:text-left"
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
              />
              <Button 
                onClick={handleSearchSubmit} 
                className="w-full sm:w-auto bg-trust-blue hover:bg-trust-blue-dark text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all transform hover:scale-105"
                disabled={isSearching || !searchQuery.trim()}
              >
                <Search className={`w-5 h-5 mr-2 ${isSearching ? 'animate-spin' : ''}`} />
                {isSearching 
                  ? (language === 'en' ? 'Analyzing...' : 'Đang phân tích...') 
                  : (language === 'en' ? 'Check Now' : 'Kiểm tra ngay')
                }
              </Button>
            </div>
            
            <Button 
              variant="link" 
              onClick={onReport} 
              className="mt-4 text-warning-orange hover:text-orange-600 text-lg font-medium"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              {language === 'en' ? 'Report a Scam' : 'Báo cáo Lừa đảo'}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 mb-8">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-trust-blue" />
              <span>{language === 'en' ? 'Community Protected' : 'Bảo vệ cộng đồng'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCheck className="w-4 h-4 text-safe-green" />
              <span>{language === 'en' ? 'AI-Powered Analysis' : 'Phân tích AI thông minh'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-warning-orange" />
              <span>{language === 'en' ? 'Real-time Updates' : 'Cập nhật thời gian thực'}</span>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="mb-16 bg-red-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'en' 
                ? 'The Growing Threat of Online Scams'
                : 'Mỗi ngày, hàng ngàn người Việt trở thành nạn nhân của lừa đảo qua mạng'
              }
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {language === 'en'
                ? 'From fake police calls to fraudulent job offers, scammers are getting more sophisticated every day.'
                : 'Từ giả danh công an đến lừa đảo việc làm online, các thủ đoạn ngày càng tinh vi và khó nhận biết.'
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'en' ? 'Fake Authority Calls' : 'Giả danh công an'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'en' 
                  ? 'Scammers impersonate police officers demanding money transfers'
                  : 'Gọi điện tự xưng là công an, yêu cầu chuyển tiền để giải quyết vụ án'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'en' ? 'Fake Job Offers' : 'Việc làm online'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'en'
                  ? 'Fraudulent job postings asking for upfront payments'
                  : 'Yêu cầu chuyển tiền phí xử lý hồ sơ việc làm'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'en' ? 'Account Lockouts' : 'Khóa tài khoản ngân hàng'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'en'
                  ? 'Fake bank notifications claiming account suspension'
                  : 'Website giả mạo ngân hàng để đánh cắp thông tin'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Solution Section - How it works */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'How Scam Guard Works' : 'Vệ Binh Mạng hoạt động như thế nào?'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === 'en'
                ? 'Three simple steps to protect yourself and your community'
                : 'Ba bước đơn giản để bảo vệ bản thân và cộng đồng'
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-trust-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-trust-blue" />
                <span className="absolute -mt-2 -mr-2 bg-trust-blue text-white rounded-full w-6 h-6 text-sm flex items-center justify-center font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {language === 'en' ? 'Instant Search' : 'Tra cứu tức thì'}
              </h3>
              <p className="text-gray-600">
                {language === 'en'
                  ? 'Enter suspicious phone numbers, accounts, or links for immediate verification'
                  : 'Nhập thông tin nghi ngờ và nhận kết quả phân tích tức thì'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-warning-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-warning-orange" />
                <span className="absolute -mt-2 -mr-2 bg-warning-orange text-white rounded-full w-6 h-6 text-sm flex items-center justify-center font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {language === 'en' ? 'Get Alerts' : 'Nhận cảnh báo'}
              </h3>
              <p className="text-gray-600">
                {language === 'en'
                  ? 'See results from our community-powered database with AI analysis'
                  : 'Xem kết quả từ cơ sở dữ liệu do cộng đồng đóng góp'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-safe-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-safe-green" />
                <span className="absolute -mt-2 -mr-2 bg-safe-green text-white rounded-full w-6 h-6 text-sm flex items-center justify-center font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {language === 'en' ? 'Help Protect Others' : 'Chung tay bảo vệ'}
              </h3>
              <p className="text-gray-600">
                {language === 'en'
                  ? 'Report cases you encounter to help protect others in the community'
                  : 'Báo cáo trường hợp bạn gặp phải để giúp người khác'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-md border-2 border-blue-100 hover:border-blue-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Lightbulb className="w-8 h-8 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'en' ? 'Smart AI Agent' : 'AI Agent Thông Minh'}
                </h3>
              </div>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Advanced AI agent for deep analysis, providing accurate alerts and prevention recommendations.'
                  : 'Phân tích chuyên sâu với AI Agent chuyên dụng, đưa ra cảnh báo chính xác và khuyến nghị phòng tránh.'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Users className="w-6 h-6 text-trust-blue" />
                <h3 className="text-lg font-semibold text-gray-900">{t('home.features.community.title')}</h3>
              </div>
              <p className="text-gray-600">{t('home.features.community.description')}</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <CheckCheck className="w-6 h-6 text-safe-green" />
                <h3 className="text-lg font-semibold text-gray-900">{t('home.features.verified.title')}</h3>
              </div>
              <p className="text-gray-600">{t('home.features.verified.description')}</p>
            </CardContent>
          </Card>
        </section>

        {/* Social Proof Section */}
        <section className="mb-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {language === 'en' 
              ? 'Join Thousands Building a Safer Digital Space'
              : 'Tham gia cùng hàng ngàn người dùng xây dựng một không gian mạng an toàn hơn'
            }
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-trust-blue mb-2">5,000+</div>
              <div className="text-gray-600">{language === 'en' ? 'Scams Reported' : 'Vụ lừa đảo đã báo cáo'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-safe-green mb-2">15,000+</div>
              <div className="text-gray-600">{language === 'en' ? 'Users Protected' : 'Người dùng được bảo vệ'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning-orange mb-2">95%</div>
              <div className="text-gray-600">{language === 'en' ? 'Accuracy Rate' : 'Độ chính xác'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">{language === 'en' ? 'Protection' : 'Bảo vệ liên tục'}</div>
            </div>
          </div>
        </section>

        {/* Image Analysis Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('image.analysis.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('image.upload.instruction')}
            </p>
          </div>
          <ImageAnalysis />
        </section>

        {/* Recent Alerts Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('home.alerts.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mock Alert Cards - Replace with actual data */}
            <Card className="bg-warning-orange/5 shadow-sm border border-warning-orange/20">
              <CardContent className="p-4">
                <p className="text-sm text-gray-700">
                  {t('home.alerts.recent')}: <span className="font-semibold">0909090909</span>
                </p>
                <p className="text-xs text-gray-500">
                  {t('home.alerts.reported')}: 2 {t('home.alerts.times')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-suspicious-yellow/5 shadow-sm border border-suspicious-yellow/20">
              <CardContent className="p-4">
                <p className="text-sm text-gray-700">
                  {t('home.alerts.recent')}: <span className="font-semibold">fake-bank.cc</span>
                </p>
                <p className="text-xs text-gray-500">
                  {t('home.alerts.reported')}: 5 {t('home.alerts.times')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-safe-green/5 shadow-sm border border-safe-green/20">
              <CardContent className="p-4">
                <p className="text-sm text-gray-700">
                  {t('home.alerts.recent')}: <span className="font-semibold">safe-website.com</span>
                </p>
                <p className="text-xs text-gray-500">
                  {t('home.alerts.reported')}: 0 {t('home.alerts.times')}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-trust-blue/5 rounded-lg py-12 px-6 text-center">
          <h2 className="text-2xl font-bold text-trust-blue mb-4">
            {t('home.trust.title')}
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            {t('home.trust.description')}
          </p>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <ShieldAlert className="w-6 h-6 text-trust-blue" />
                <span className="text-lg font-semibold">
                  {language === 'en' ? 'Scam Guard' : 'Vệ Binh Mạng'}
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {language === 'en' 
                  ? 'Protecting the community from online scams with advanced AI technology and community power.'
                  : 'Bảo vệ cộng đồng khỏi lừa đảo trực tuyến với công nghệ AI tiên tiến và sức mạnh cộng đồng.'
                }
              </p>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <h3 className="font-semibold mb-4">
                {language === 'en' ? 'Quick Links' : 'Liên kết nhanh'}
              </h3>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-400 hover:text-white transition-colors text-sm">
                  {language === 'en' ? 'About' : 'Giới thiệu'}
                </Link>
                <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors text-sm">
                  {language === 'en' ? 'Contact' : 'Liên hệ'}
                </Link>
                <Link to="/privacy" className="block text-gray-400 hover:text-white transition-colors text-sm">
                  {language === 'en' ? 'Privacy Policy' : 'Chính sách bảo mật'}
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="col-span-1">
              <h3 className="font-semibold mb-4">
                {language === 'en' ? 'Support' : 'Hỗ trợ'}
              </h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Email: support@vebinh.com</p>
                <p>Hotline: 1900-888-999</p>
                <p>{language === 'en' ? 'Emergency: 113' : 'Khẩn cấp: 113'}</p>
              </div>
            </div>

            {/* Legal */}
            <div className="col-span-1">
              <h3 className="font-semibold mb-4">
                {language === 'en' ? 'Legal' : 'Pháp lý'}
              </h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>© 2024 {language === 'en' ? 'Scam Guard' : 'Vệ Binh Mạng'}</p>
                <p>{language === 'en' ? 'All rights reserved' : 'Bảo lưu mọi quyền'}</p>
                <p>{language === 'en' ? 'Version 1.0' : 'Phiên bản 1.0'}</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>
              {language === 'en' 
                ? 'Scam Guard - Platform protecting community from online scams. Developed with ❤️ in Vietnam.'
                : 'Vệ Binh Mạng - Nền tảng bảo vệ cộng đồng khỏi lừa đảo trực tuyến. Được phát triển với ❤️ tại Việt Nam.'
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
