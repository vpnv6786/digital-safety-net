
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'vi';

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface Translation {
  [key: string]: string | Translation;
}

const translations: { [key: string]: Translation } = {
  en: {
    home: {
      hero: {
        title: 'Protecting You from Scams',
        subtitle: 'Check phone numbers, websites and suspicious information. Get real-time alerts and share experiences with the community.'
      },
      search: {
        placeholder: 'Enter phone number, website, email or information to check...',
        button: 'Check'
      },
      navigation: {
        home: 'Home',
        safety: 'Safety',
        scamRankings: 'Scam Rankings',
        communityAlerts: 'Community Alerts',
        authorities: 'Authorities',
        about: 'About',
        login: 'Login',
        logout: 'Logout'
      }
    },
    authorities: {
      title: 'Emergency Contacts & Authorities',
      subtitle: 'Important contact numbers for fraud prevention and emergency situations',
      emergency: 'Emergency Services',
      cybersecurity: 'Cybersecurity & Fraud Prevention',
      banking: 'Banking Security',
      telecommunications: 'Telecommunications'
    }
  },
  vi: {
    home: {
      hero: {
        title: 'Bảo vệ bạn khỏi lừa đảo',
        subtitle: 'Kiểm tra số điện thoại, website và thông tin đáng ngờ. Nhận cảnh báo realtime và chia sẻ kinh nghiệm với cộng đồng.'
      },
      search: {
        placeholder: 'Nhập số điện thoại, website, email hoặc thông tin cần kiểm tra...',
        button: 'Kiểm tra'
      },
      navigation: {
        home: 'Trang chủ',
        safety: 'An toàn',
        scamRankings: 'Bảng xếp hạng lừa đảo',
        communityAlerts: 'Cảnh báo cộng đồng',
        authorities: 'Cơ quan chức năng',
        about: 'Giới thiệu',
        login: 'Đăng nhập',
        logout: 'Đăng xuất'
      }
    },
    authorities: {
      title: 'Liên hệ khẩn cấp & Cơ quan chức năng',
      subtitle: 'Số điện thoại quan trọng cho phòng chống lừa đảo và tình huống khẩn cấp',
      emergency: 'Dịch vụ khẩn cấp',
      cybersecurity: 'An ninh mạng & Phòng chống lừa đảo',
      banking: 'Bảo mật ngân hàng',
      telecommunications: 'Viễn thông'
    }
  }
};

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'vi' ? 'vi' : 'en') as Language;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to key if translation not found
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { LanguageProvider, useLanguage };
