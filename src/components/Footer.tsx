
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';
import SocialShare from './SocialShare';

const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-blue-400" />
              <span className="text-lg lg:text-xl font-bold">{SITE_NAME}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {language === 'en'
                ? 'Ask before you pay, install an app or tap a link. Free for everyone.'
                : 'Hỏi trước khi chuyển tiền, cài app hay bấm link. Miễn phí cho mọi người.'}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-3">
                {language === 'en' ? 'Share with your family:' : 'Chia sẻ cho người thân:'}
              </p>
              <SocialShare
                title={language === 'en' ? 'Vệ Binh Mạng - Ask before you pay' : 'Vệ Binh Mạng - Hỏi trước khi chuyển tiền'}
                description={language === 'en' ? 'Check messages, numbers and links for scam signs' : 'Kiểm tra tin nhắn, số điện thoại, link có dấu hiệu lừa đảo'}
                hashtags={['VeBinhMang', 'ChongLuaDao']}
                className="justify-start"
              />
            </div>
          </div>

          <div>
            <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">
              {language === 'en' ? 'Quick links' : 'Liên kết nhanh'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">{language === 'en' ? 'Check' : 'Kiểm tra'}</Link></li>
              <li><Link to="/scam-rankings" className="text-gray-400 hover:text-white transition-colors">{language === 'en' ? 'Common scams' : 'Thủ đoạn phổ biến'}</Link></li>
              <li><Link to="/luyen-tap" className="text-gray-400 hover:text-white transition-colors">{language === 'en' ? 'Practice' : 'Luyện tập'}</Link></li>
              <li><Link to="/community-alerts" className="text-gray-400 hover:text-white transition-colors">{language === 'en' ? 'Community alerts' : 'Cảnh báo cộng đồng'}</Link></li>
              <li><Link to="/tro-giup" className="text-gray-400 hover:text-white transition-colors">{language === 'en' ? 'Already scammed?' : 'Đã lỡ bị lừa?'}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">
              {language === 'en' ? 'Information' : 'Thông tin'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">{language === 'en' ? 'About' : 'Giới thiệu'}</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">{language === 'en' ? 'Contact' : 'Liên hệ'}</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">{language === 'en' ? 'Privacy' : 'Quyền riêng tư'}</Link></li>
              <li><Link to="/khieu-nai" className="text-gray-400 hover:text-white transition-colors">{language === 'en' ? 'Appeal a wrong report' : 'Khiếu nại báo cáo nhầm'}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">
              {language === 'en' ? 'Emergency' : 'Khẩn cấp'}
            </h3>
            <div className="space-y-3 text-sm">
              <a href="tel:113" className="flex items-center space-x-2 text-gray-400 hover:text-white">
                <Phone className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{language === 'en' ? 'Police: 113' : 'Công an: 113'}</span>
              </a>
              <a href="tel:156" className="flex items-center space-x-2 text-gray-400 hover:text-white">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>{language === 'en' ? 'Report scam calls: 156' : 'Phản ánh cuộc gọi lừa đảo: 156'}</span>
              </a>
              {CONTACT_EMAIL && (
                <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center space-x-2 text-gray-400 hover:text-white">
                  <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="break-all">{CONTACT_EMAIL}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 lg:mt-8 pt-6 lg:pt-8 text-center">
          <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
            © {new Date().getFullYear()} {SITE_NAME}.{' '}
            {language === 'en'
              ? 'Answers are guidance, not legal findings. When in doubt, contact your bank or the police.'
              : 'Kết luận chỉ mang tính tham khảo, không phải kết luận pháp lý. Khi nghi ngờ, hãy liên hệ ngân hàng hoặc công an.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
