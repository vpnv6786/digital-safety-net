
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, Users, BarChart3, AlertTriangle, User, LogIn } from 'lucide-react';
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

const Header = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ScamGuard</span>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <Home className="w-4 h-4" />
                <span>{t('home.hero.title') || 'Trang chủ'}</span>
              </Button>
            </Link>
            
            <Link to="/safety">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <Shield className="w-4 h-4" />
                <span>An toàn</span>
              </Button>
            </Link>

            <Link to="/scam-rankings">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <BarChart3 className="w-4 h-4" />
                <span>Bảng xếp hạng lừa đảo</span>
              </Button>
            </Link>

            <Link to="/community-alerts">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <AlertTriangle className="w-4 h-4" />
                <span>Cảnh báo cộng đồng</span>
              </Button>
            </Link>

            <Link to="/authorities">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <Users className="w-4 h-4" />
                <span>Cơ quan chức năng</span>
              </Button>
            </Link>

            <Link to="/about">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <Users className="w-4 h-4" />
                <span>Giới thiệu</span>
              </Button>
            </Link>
          </nav>

          {/* Right side - Language Selector and Auth */}
          <div className="flex items-center space-x-3">
            <LanguageSelector />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{user.phone || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="outline" size="sm">Menu</Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
