
import React, { useState } from 'react';
import { Globe, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
          <Globe className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{currentLanguage?.flag} {currentLanguage?.name}</span>
          <span className="sm:hidden">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer ${language === lang.code ? 'bg-blue-600/10' : ''}`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled
          className="opacity-50 cursor-not-allowed"
        >
          <Settings className="w-4 h-4 mr-2" />
          Cài đặt dịch (không cần)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;

