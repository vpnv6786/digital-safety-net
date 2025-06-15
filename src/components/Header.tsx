
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, Users, BarChart3, AlertTriangle, User, LogIn, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const navigationItems = [
    { to: '/', icon: Home, label: t('home.navigation.home') || 'Trang chủ' },
    { to: '/safety', icon: Shield, label: t('home.navigation.safety') || 'An toàn' },
    { to: '/scam-rankings', icon: BarChart3, label: t('home.navigation.scamRankings') || 'Bảng xếp hạng lừa đảo' },
    { to: '/community-alerts', icon: AlertTriangle, label: t('home.navigation.communityAlerts') || 'Cảnh báo cộng đồng' },
    { to: '/authorities', icon: Users, label: t('home.navigation.authorities') || 'Cơ quan chức năng' },
    { to: '/about', icon: Users, label: t('home.navigation.about') || 'Giới thiệu' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <span className="text-lg sm:text-xl font-bold text-gray-900">ScamGuard</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </nav>
          )}

          {/* Right side - Language Selector and Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <LanguageSelector />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{user.phone || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    {t('home.navigation.logout') || 'Đăng xuất'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" onClick={closeMobileMenu}>
                <Button className="flex items-center space-x-1 sm:space-x-2 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-2 sm:px-4">
                  <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{t('home.navigation.login') || 'Đăng nhập'}</span>
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            {isMobile && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2 pt-4">
              {navigationItems.map((item) => (
                <Link key={item.to} to={item.to} onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full justify-start flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
