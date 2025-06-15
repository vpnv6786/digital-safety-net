
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SafetyDashboard from '@/components/SafetyDashboard';
import { useLanguage } from '@/contexts/LanguageContext';

const Safety = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
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
              {language === 'en' ? 'Personal Safety' : 'An toàn cá nhân'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <SafetyDashboard />
    </div>
  );
};

export default Safety;
