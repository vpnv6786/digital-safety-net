
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translationService } from '@/services/translationService';

export const useTranslation = () => {
  const { language } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);

  const t = async (text: string): Promise<string> => {
    if (language === 'en') {
      return text;
    }

    if (!translationService.hasApiKey()) {
      return text; // Return original text if no API key
    }

    setIsTranslating(true);
    try {
      const translated = await translationService.translateText(text, language);
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  const translateMany = async (texts: string[]): Promise<string[]> => {
    if (language === 'en') {
      return texts;
    }

    if (!translationService.hasApiKey()) {
      return texts;
    }

    setIsTranslating(true);
    try {
      const translated = await translationService.translateTexts(texts, language);
      return translated;
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts;
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    t,
    translateMany,
    isTranslating,
    hasApiKey: translationService.hasApiKey(),
    currentLanguage: language
  };
};
