
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translationService } from '@/services/translationService';

export type Language = 'en' | 'vi';

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  hasTranslationSetup: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'vi' ? 'vi' : 'en') as Language;
  });

  const [hasTranslationSetup, setHasTranslationSetup] = useState(false);

  useEffect(() => {
    localStorage.setItem('language', language);
    // Check if translation is set up
    setHasTranslationSetup(translationService.hasApiKey());
  }, [language]);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      hasTranslationSetup
    }}>
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
