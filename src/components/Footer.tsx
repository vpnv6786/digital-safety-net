
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo và giới thiệu */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">ScamGuard</span>
            </div>
            <p className="text-gray-400 text-sm">
              {language === 'en' 
                ? 'Protecting the Vietnamese community from online scams with AI technology and community alerts.'
                : 'Bảo vệ cộng đồng Việt Nam khỏi lừa đảo trực tuyến bằng công nghệ AI và cảnh báo cộng đồng.'
              }
            </p>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'en' ? 'Quick Links' : 'Liên kết nhanh'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'Home' : 'Trang chủ'}
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'Safety' : 'An toàn'}
                </Link>
              </li>
              <li>
                <Link to="/scam-rankings" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'Scam Rankings' : 'Bảng xếp hạng lừa đảo'}
                </Link>
              </li>
              <li>
                <Link to="/community-alerts" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'Community Alerts' : 'Cảnh báo cộng đồng'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Thông tin */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'en' ? 'Information' : 'Thông tin'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'About' : 'Giới thiệu'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'Contact' : 'Liên hệ'}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'Privacy Policy' : 'Chính sách bảo mật'}
                </Link>
              </li>
              <li>
                <Link to="/authorities" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'Authorities' : 'Cơ quan chức năng'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Liên hệ khẩn cấp */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'en' ? 'Emergency Contact' : 'Liên hệ khẩn cấp'}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-red-400" />
                <span className="text-gray-400">
                  {language === 'en' ? 'Police: 113' : 'Công an: 113'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">support@scamguard.vn</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="text-gray-400">Hotline: 1900-888-999</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            {language === 'en' 
              ? '© 2024 ScamGuard. All rights reserved. Protecting Vietnamese community from online scams.'
              : '© 2024 ScamGuard. Tất cả quyền được bảo lưu. Bảo vệ cộng đồng Việt Nam khỏi lừa đảo trực tuyến.'
            }
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
