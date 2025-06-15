
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const NotFound = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-white font-be-vietnam flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <AlertTriangle className="w-24 h-24 text-warning-orange mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {language === 'en' ? 'Page not found' : 'Trang không tồn tại'}
          </h2>
          <p className="text-gray-600 mb-8">
            {language === 'en' 
              ? 'The page you are looking for does not exist or has been moved.'
              : 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.'
            }
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full bg-trust-blue hover:bg-trust-blue-dark">
              <Home className="w-5 h-5 mr-2" />
              {language === 'en' ? 'Back to home' : 'Về trang chủ'}
            </Button>
          </Link>
          
          <Link to="/">
            <Button variant="outline" className="w-full border-trust-blue text-trust-blue hover:bg-trust-blue hover:text-white">
              <Search className="w-5 h-5 mr-2" />
              {language === 'en' ? 'Safe search' : 'Tìm kiếm an toàn'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
