
import React, { useState } from 'react';
import { Search, ShieldAlert, Lightbulb, Users, CheckCheck, PlusCircle } from 'lucide-react';
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
  const { t } = useLanguage();

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
            <span className="text-lg font-semibold text-gray-800">Vệ Binh Mạng</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <AIKeyInput />
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('home.hero.title')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex justify-center space-x-4">
            <Input
              type="text"
              placeholder={t('home.search.placeholder')}
              className="w-full max-w-md rounded-full shadow-sm"
              value={searchQuery}
              onChange={handleSearchInput}
              onKeyPress={handleKeyPress}
              disabled={isSearching}
            />
            <Button 
              onClick={handleSearchSubmit} 
              className="rounded-full"
              disabled={isSearching || !searchQuery.trim()}
            >
              <Search className={`w-5 h-5 mr-2 ${isSearching ? 'animate-spin' : ''}`} />
              {isSearching ? 'Đang phân tích...' : t('home.search.button')}
            </Button>
          </div>
          <Button variant="link" onClick={onReport} className="mt-4">
            <PlusCircle className="w-4 h-4 mr-2" />
            {t('home.report.button')}
          </Button>
        </section>

        {/* Enhanced Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-md border-2 border-blue-100 hover:border-blue-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Lightbulb className="w-8 h-8 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">AI Agent Thông Minh</h3>
              </div>
              <p className="text-gray-600">Phân tích chuyên sâu với AI Agent chuyên dụng, đưa ra cảnh báo chính xác và khuyến nghị phòng tránh.</p>
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

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-gray-500 text-sm">
        {t('footer.copyright')}
      </footer>
    </div>
  );
};

export default HomePage;
