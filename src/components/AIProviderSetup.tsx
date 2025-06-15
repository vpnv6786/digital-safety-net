
import React, { useState, useEffect } from 'react';
import { Brain, Key, CheckCircle, XCircle, ExternalLink, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIProvider, AI_PROVIDERS } from '@/types/aiProviders';
import { aiManager } from '@/services/aiManager';
import { useLanguage } from '@/contexts/LanguageContext';

const AIProviderSetup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AIProvider>('gemini');
  const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
    gemini: '',
    openai: '',
    claude: '',
    perplexity: ''
  });
  const [loading, setLoading] = useState<Record<AIProvider, boolean>>({
    gemini: false,
    openai: false,
    claude: false,
    perplexity: false
  });
  const [configuredProviders, setConfiguredProviders] = useState<
    { provider: AIProvider; name: string; isActive: boolean }[]
  >([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    // Initialize AI Manager and load configured providers
    aiManager.initializeFromStorage();
    updateConfiguredProviders();
  }, []);

  const updateConfiguredProviders = () => {
    setConfiguredProviders(aiManager.getConfiguredProviders());
  };

  const handleSaveProvider = async (provider: AIProvider) => {
    const apiKey = apiKeys[provider].trim();
    if (!apiKey) return;

    setLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      const success = aiManager.setProviderCredentials(provider, apiKey);
      
      if (success) {
        setApiKeys(prev => ({ ...prev, [provider]: '' }));
        updateConfiguredProviders();
      } else {
        alert(`Invalid API key for ${AI_PROVIDERS[provider].name}`);
      }
    } catch (error) {
      console.error('Error saving provider:', error);
      alert(`Failed to configure ${AI_PROVIDERS[provider].name}`);
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleRemoveProvider = (provider: AIProvider) => {
    aiManager.removeProvider(provider);
    updateConfiguredProviders();
  };

  const handleSetActive = (provider: AIProvider) => {
    aiManager.setActiveProvider(provider);
    updateConfiguredProviders();
  };

  const ProviderCard = ({ provider }: { provider: AIProvider }) => {
    const config = AI_PROVIDERS[provider];
    const isConfigured = configuredProviders.find(p => p.provider === provider);
    const isActive = isConfigured?.isActive;

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-500" />
              {config.name}
            </div>
            {isConfigured && (
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive 
                  ? (language === 'en' ? 'Active' : 'Đang sử dụng')
                  : (language === 'en' ? 'Configured' : 'Đã cấu hình')
                }
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">{config.description}</p>
          
          {!isConfigured ? (
            <>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder={config.apiKeyPlaceholder}
                  value={apiKeys[provider]}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, [provider]: e.target.value }))}
                  className="font-mono text-sm"
                />
                {config.setupUrl && (
                  <div className="text-xs text-gray-500">
                    {language === 'en' ? 'Get API key at:' : 'Lấy API key tại:'}{' '}
                    <a
                      href={config.setupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline inline-flex items-center"
                    >
                      {config.setupUrl.replace('https://', '')}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>

              <Button
                onClick={() => handleSaveProvider(provider)}
                disabled={!apiKeys[provider].trim() || loading[provider]}
                className="w-full"
              >
                <Key className="w-4 h-4 mr-2" />
                {loading[provider] 
                  ? (language === 'en' ? 'Configuring...' : 'Đang cấu hình...')
                  : (language === 'en' ? 'Save & Enable' : 'Lưu & Kích hoạt')
                }
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center text-green-600 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Successfully configured' : 'Đã cấu hình thành công'}
              </div>
              
              <div className="flex space-x-2">
                {!isActive && (
                  <Button
                    size="sm"
                    onClick={() => handleSetActive(provider)}
                    className="flex-1"
                  >
                    {language === 'en' ? 'Set as Default' : 'Đặt làm mặc định'}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveProvider(provider)}
                  className="flex-1"
                >
                  {language === 'en' ? 'Remove' : 'Xóa'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center mb-2">
          <Settings className="w-6 h-6 mr-2 text-blue-500" />
          {language === 'en' ? 'Configure AI Providers' : 'Cấu hình AI Providers'}
        </h2>
        <p className="text-gray-600">
          {language === 'en' 
            ? 'Configure AI providers to get the best scam analysis'
            : 'Cấu hình các nhà cung cấp AI để có được phân tích lừa đảo tốt nhất'
          }
        </p>
      </div>

      {configuredProviders.length > 0 && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            {language === 'en' 
              ? `${configuredProviders.length} AI provider(s) configured. Active provider: `
              : `Đã cấu hình ${configuredProviders.length} AI provider(s). Provider đang sử dụng: `
            }
            <strong>
              {configuredProviders.find(p => p.isActive)?.name || (language === 'en' ? 'None' : 'Không có')}
            </strong>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(AI_PROVIDERS).map((config) => (
          <ProviderCard key={config.id} provider={config.id} />
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          💡 {language === 'en' ? 'Recommendations:' : 'Khuyến nghị:'}
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Gemini:</strong> {language === 'en' 
            ? 'Best for image analysis and Vietnamese text'
            : 'Tốt nhất cho phân tích hình ảnh và văn bản tiếng Việt'
          }</li>
          <li>• <strong>OpenAI GPT-4:</strong> {language === 'en'
            ? 'Strong at context analysis and reasoning'
            : 'Mạnh về phân tích ngữ cảnh và reasoning'
          }</li>
          <li>• <strong>Claude:</strong> {language === 'en'
            ? 'Excellent at detailed analysis and safety'
            : 'Excellnt ở phân tích chi tiết và an toàn'
          }</li>
          <li>• <strong>Perplexity:</strong> {language === 'en'
            ? 'Real-time information search capability'
            : 'Có khả năng tìm kiếm thông tin real-time'
          }</li>
        </ul>
      </div>
    </div>
  );
};

export default AIProviderSetup;
