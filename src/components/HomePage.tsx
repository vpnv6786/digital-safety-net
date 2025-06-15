import React, { useState } from 'react';
import { Search, Shield, AlertTriangle, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { searchEntity } from '@/services/searchService';
import AIKeyInput from '@/components/AIKeyInput';

interface HomePageProps {
  onSearch: (query: string, result?: any) => void;
  onReport: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSearch, onReport }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { t } = useLanguage();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Use the enhanced search service with AI
      const result = await searchEntity(searchQuery.trim());
      console.log('Search result:', result);
      
      // Pass the result to the parent component
      onSearch(searchQuery, result);
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to basic search
      setTimeout(() => {
        setIsSearching(false);
        onSearch(searchQuery);
      }, 1000);
    }
  };

  const recentWarnings = [
    {
      id: 1,
      type: 'phone',
      value: '0987654321',
      category: t('warnings.categories.fake.police'),
      reports: 15,
      risk: 'high',
      time: '2 ' + t('results.reported.at')
    },
    {
      id: 2,
      type: 'url',
      value: 'fake-bank-site.com',
      category: t('warnings.categories.bank.fraud'),
      reports: 8,
      risk: 'high',
      time: '5 ' + t('results.reported.at')
    },
    {
      id: 3,
      type: 'phone',
      value: '0123456789',
      category: t('warnings.categories.job.scam'),
      reports: 12,
      risk: 'medium',
      time: '1 ' + t('results.reported.at')
    }
  ];

  const stats = [
    { label: t('stats.reports.processed'), value: '2,847', icon: Shield },
    { label: t('stats.users.joined'), value: '15,420', icon: Users },
    { label: t('stats.situations.prevented'), value: '892', icon: CheckCircle }
  ];

  const handleWarningClick = (warning: typeof recentWarnings[0]) => {
    onSearch(warning.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-white font-be-vietnam">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-trust-blue rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-trust-blue">{t('app.name')}</h1>
              <p className="text-sm text-gray-600">{t('app.tagline')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AIKeyInput />
            <LanguageSelector />
            <Button variant="outline" className="border-trust-blue text-trust-blue hover:bg-trust-blue hover:text-white">
              {t('header.login')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('hero.title.line1')} <br />
            <span className="text-trust-blue">{t('hero.title.line2')}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative">
            <div className="flex rounded-2xl border-2 border-trust-blue shadow-lg bg-white overflow-hidden">
              <Input
                type="text"
                placeholder={t('hero.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="border-0 text-lg px-6 py-4 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                style={{ fontSize: '18px' }}
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-trust-blue hover:bg-trust-blue-dark text-white px-8 py-4 text-lg font-semibold rounded-none"
              >
                {isSearching ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-6 h-6 mr-2" />
                    {t('hero.search.button')}
                  </>
                )}
              </Button>
            </div>
            {isSearching && (
              <div className="absolute inset-0 bg-trust-blue/5 rounded-2xl">
                <div className="absolute bottom-0 left-0 h-1 bg-trust-blue animate-radar-scan rounded-full"></div>
              </div>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            🤖 AI-powered scam detection • Enhanced with Gemini
          </div>
        </div>

        {/* CTA Button */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Button
            size="lg"
            onClick={onReport}
            className="bg-warning-orange hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
          >
            <AlertTriangle className="w-6 h-6 mr-2" />
            {t('hero.report.button')}
          </Button>
        </div>

        {/* Quick test examples */}
        <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-gray-500 mb-4">{t('hero.examples')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery('0987654321')}
              className="border-danger-red text-danger-red hover:bg-danger-red hover:text-white"
            >
              0987654321 {t('hero.examples.dangerous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery('0123456789')}
              className="border-warning-orange text-warning-orange hover:bg-warning-orange hover:text-white"
            >
              0123456789 {t('hero.examples.suspicious')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery('0999888777')}
              className="border-safe-green text-safe-green hover:bg-safe-green hover:text-white"
            >
              0999888777 {t('hero.examples.safe')}
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="text-center border-2 border-trust-blue/10 hover:border-trust-blue/30 transition-colors animate-fade-in-up" style={{ animationDelay: `${0.8 + index * 0.1}s` }}>
              <CardContent className="pt-6">
                <stat.icon className="w-12 h-12 text-trust-blue mx-auto mb-4" />
                <div className="text-3xl font-bold text-trust-blue mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Warnings */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('warnings.title')}</h2>
          <p className="text-gray-600">{t('warnings.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentWarnings.map((warning, index) => (
            <Card 
              key={warning.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer animate-fade-in-up" 
              style={{ animationDelay: `${1.1 + index * 0.1}s` }}
              onClick={() => handleWarningClick(warning)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={warning.risk === 'high' ? 'destructive' : 'secondary'}
                    className={warning.risk === 'high' ? 'bg-danger-red' : 'bg-warning-orange'}
                  >
                    {warning.risk === 'high' ? t('results.dangerous.title').split(' ')[1] : t('results.suspicious.title').split(' ')[1]}
                  </Badge>
                  <span className="text-sm text-gray-500">{warning.time}</span>
                </div>
                <CardTitle className="text-lg">
                  {warning.type === 'phone' ? '📱' : '🌐'} {warning.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">{warning.category}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{warning.reports} {t('warnings.reports')}</span>
                  <span className="text-trust-blue font-medium">{t('warnings.view.details')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('how.title')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-trust-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('how.step1.title')}</h3>
              <p className="text-gray-600">{t('how.step1.desc')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-warning-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('how.step2.title')}</h3>
              <p className="text-gray-600">{t('how.step2.desc')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-safe-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('how.step3.title')}</h3>
              <p className="text-gray-600">{t('how.step3.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-trust-blue text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-trust-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('app.name')}</h3>
                  <p className="text-blue-200">{t('app.tagline')}</p>
                </div>
              </div>
              <p className="text-blue-200 leading-relaxed">
                {t('footer.description')}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t('footer.links')}</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.user.guide')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.faq')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
              <ul className="space-y-2 text-blue-200">
                <li>{t('footer.email')}</li>
                <li>{t('footer.hotline')}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-400 mt-8 pt-8 text-center text-blue-200">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
