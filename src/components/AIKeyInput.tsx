
import React, { useState, useEffect } from 'react';
import { Brain, Settings, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { aiManager } from '@/services/aiManager';
import { AI_PROVIDERS } from '@/types/aiProviders';
import { useLanguage } from '@/contexts/LanguageContext';
import TranslatedText from './TranslatedText';
import AIProviderSetup from './AIProviderSetup';

const AIKeyInput: React.FC = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string>('');
  const [showSetup, setShowSetup] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Initialize and check configuration
    aiManager.initializeFromStorage();
    updateStatus();
  }, []);

  const updateStatus = () => {
    const hasProvider = aiManager.hasAvailableProvider();
    const active = aiManager.getActiveProvider();
    
    setIsConfigured(hasProvider);
    setActiveProvider(active ? AI_PROVIDERS[active].name : '');
  };

  const handleSetupComplete = () => {
    updateStatus();
    setShowSetup(false);
  };

  if (isConfigured) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <Brain className="w-4 h-4 text-green-500" />
        <span className="text-green-600">AI: {activeProvider}</span>
        <Dialog open={showSetup} onOpenChange={setShowSetup}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs">
              <Settings className="w-3 h-3 mr-1" />
              <TranslatedText>{language === 'en' ? 'Configure' : 'Cấu hình'}</TranslatedText>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                <TranslatedText>{language === 'en' ? 'AI Configuration' : 'Cấu hình AI'}</TranslatedText>
              </DialogTitle>
            </DialogHeader>
            <AIProviderSetup />
            <div className="flex justify-end pt-4">
              <Button onClick={handleSetupComplete}>
                <TranslatedText>{language === 'en' ? 'Close' : 'Đóng'}</TranslatedText>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <Dialog open={showSetup} onOpenChange={setShowSetup}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSetup(true)}
          className="border-blue-500 text-blue-500 hover:bg-blue-50"
        >
          <Brain className="w-4 h-4 mr-2" />
          <TranslatedText>{language === 'en' ? 'Enable AI' : 'Kích hoạt AI'}</TranslatedText>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <TranslatedText>{language === 'en' ? 'AI Configuration' : 'Cấu hình AI'}</TranslatedText>
          </DialogTitle>
        </DialogHeader>
        <AIProviderSetup />
        <div className="flex justify-end pt-4">
          <Button onClick={handleSetupComplete}>
            <TranslatedText>{language === 'en' ? 'Close' : 'Đóng'}</TranslatedText>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIKeyInput;
