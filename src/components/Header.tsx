
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, Users, BarChart3, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-trust-blue" />
            <span className="text-xl font-bold text-gray-900">ScamGuard</span>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-trust-blue">
                <Home className="w-4 h-4" />
                <span>Trang chủ</span>
              </Button>
            </Link>
            
            <Link to="/safety">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-trust-blue">
                <Shield className="w-4 h-4" />
                <span>An toàn</span>
              </Button>
            </Link>

            <Link to="/scam-rankings">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-trust-blue">
                <BarChart3 className="w-4 h-4" />
                <span>Bảng xếp hạng lừa đảo</span>
              </Button>
            </Link>

            <Link to="/community-alerts">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-trust-blue">
                <AlertTriangle className="w-4 h-4" />
                <span>Cảnh báo cộng đồng</span>
              </Button>
            </Link>

            <Link to="/about">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-trust-blue">
                <Users className="w-4 h-4" />
                <span>Giới thiệu</span>
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="outline" size="sm">Menu</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
