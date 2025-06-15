
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SocialShare from './SocialShare';

const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Logo và giới thiệu */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-blue-400" />
              <span className="text-lg lg:text-xl font-bold">ScamGuard</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {language === 'en' 
                ? 'Protecting the Vietnamese community from online scams with AI technology and community alerts.'
                : 'Bảo vệ cộng đồng Việt Nam khỏi lừa đảo trực tuyến bằng công nghệ AI và cảnh báo cộng đồng.'
              }
            </p>
            
            {/* Social Share Section */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-3">
                {language === 'en' ? 'Share ScamGuard:' : 'Chia sẻ ScamGuard:'}
              </p>
              <SocialShare
                title={language === 'en' ? 'ScamGuard - Protect Yourself from Online Scams' : 'ScamGuard - Bảo vệ bản thân khỏi lừa đảo trực tuyến'}
                description={language === 'en' 
                  ? 'AI-powered protection against online scams for Vietnamese community'
                  : 'Công nghệ AI bảo vệ cộng đồng Việt Nam khỏi lừa đảo trực tuyến'
                }
                hashtags={['ScamGuard', 'OnlineSafety', 'Vietnam', 'CyberSecurity']}
                className="justify-start"
              />
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div className="order-2 lg:order-2">
            <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">
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
          <div className="order-3 lg:order-3">
            <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">
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
          <div className="order-4 lg:order-4">
            <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">
              {language === 'en' ? 'Emergency Contact' : 'Liên hệ khẩn cấp'}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-gray-400">
                  {language === 'en' ? 'Police: 113' : 'Công an: 113'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400 break-all">support@scamguard.vn</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-400">Hotline: 1900-888-999</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 lg:mt-8 pt-6 lg:pt-8 text-center">
          <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
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
