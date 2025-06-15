
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import TranslatedText from './TranslatedText';

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
              <TranslatedText>
                {language === 'en' 
                  ? 'Protecting the Vietnamese community from online scams with AI technology and community alerts.'
                  : 'Bảo vệ cộng đồng Việt Nam khỏi lừa đảo trực tuyến bằng công nghệ AI và cảnh báo cộng đồng.'
                }
              </TranslatedText>
            </p>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              <TranslatedText>
                {language === 'en' ? 'Quick Links' : 'Liên kết nhanh'}
              </TranslatedText>
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  <TranslatedText>
                    {language === 'en' ? 'Home' : 'Trang chủ'}
                  </TranslatedText>
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-gray-400 hover:text-white transition-colors">
                  <TranslatedText>
                    {language === 'en' ? 'Safety' : 'An toàn'}
                  </TranslatedText>
                </Link>
              </li>
              <li>
                <Link to="/scam-rankings" className="text-gray-400 hover:text-white transition-colors">
                  <TranslatedText>
                    {language === 'en' ? 'Scam Rankings' : 'Bảng xếp hạng lừa đảo'}
                  </TranslatedText>
                </Link>
              </li>
              <li>
                <Link to="/community-alerts" className="text-gray-400 hover:text-white transition-colors">
                  <TranslatedText>
                    {language === 'en' ? 'Community Alerts' : 'Cảnh báo cộng đồng'}
                  </TranslatedText>
                </Link>
              </li>
            </ul>
          </div>

          {/* Thông tin */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              <TranslatedText>
                {language === 'en' ? 'Information' : 'Thông tin'}
              </TranslatedText>
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  <TranslatedText>
                    {language === 'en' ? 'About' : 'Giới thiệu'}
                  </TranslatedText>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  <TranslatedText>
                    {language === 'en' ? 'Contact' : 'Liên hệ'}
                  </TranslatedText>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  <TranslatedText>
                    {language === 'en' ? 'Privacy Policy' : 'Chính sách bảo mật'}
                  </TranslatedText>
                </Link>
              </li>
              <li>
                <Link to="/authorities" className="text-gray-400 hover:text-white transition-colors">
                  <TranslatedText>
                    {language === 'en' ? 'Authorities' : 'Cơ quan chức năng'}
                  </TranslatedText>
                </Link>
              </li>
            </ul>
          </div>

          {/* Liên hệ khẩn cấp */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              <TranslatedText>
                {language === 'en' ? 'Emergency Contact' : 'Liên hệ khẩn cấp'}
              </TranslatedText>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-red-400" />
                <span className="text-gray-400">
                  <TranslatedText>
                    {language === 'en' ? 'Police: 113' : 'Công an: 113'}
                  </TranslatedText>
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
            <TranslatedText>
              {language === 'en' 
                ? '© 2024 ScamGuard. All rights reserved. Protecting Vietnamese community from online scams.'
                : '© 2024 ScamGuard. Tất cả quyền được bảo lưu. Bảo vệ cộng đồng Việt Nam khỏi lừa đảo trực tuyến.'
              }
            </TranslatedText>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
