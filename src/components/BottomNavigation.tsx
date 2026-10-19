
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, AlertTriangle, BookOpen, LifeBuoy } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const BottomNavigation = () => {
  const { language } = useLanguage();
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: language === 'en' ? 'Home' : 'Trang chủ'
    },
    {
      path: '/scam-rankings',
      icon: BookOpen,
      label: language === 'en' ? 'Scam types' : 'Thủ đoạn'
    },
    {
      path: '/community-alerts',
      icon: AlertTriangle,
      label: language === 'en' ? 'Alerts' : 'Cảnh báo'
    },
    {
      path: '/tro-giup',
      icon: LifeBuoy,
      label: language === 'en' ? 'Scammed?' : 'Đã bị lừa?'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden safe-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-1 min-h-[60px] flex-1 transition-colors ${
                isActive 
                  ? 'text-trust-blue' 
                  : 'text-gray-500 hover:text-trust-blue'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-trust-blue' : ''}`} />
              <span className={`text-xs leading-tight text-center ${
                isActive ? 'text-trust-blue font-medium' : 'text-gray-600'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
