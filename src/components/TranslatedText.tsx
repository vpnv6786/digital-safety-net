
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translationService } from '@/services/translationService';

interface TranslatedTextProps {
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'span' 
}) => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(children);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translateText = async () => {
      if (language === 'en' || !translationService.hasApiKey()) {
        setTranslatedText(children);
        return;
      }

      setIsLoading(true);
      try {
        const translated = await translationService.translateText(children, language);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(children);
      } finally {
        setIsLoading(false);
      }
    };

    translateText();
  }, [children, language]);

  return (
    <Component className={className}>
      {isLoading ? children : translatedText}
    </Component>
  );
};

export default TranslatedText;
