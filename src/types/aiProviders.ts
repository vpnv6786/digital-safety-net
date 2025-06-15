
export type AIProvider = 'gemini' | 'openai' | 'claude' | 'perplexity';

export interface AIProviderConfig {
  id: AIProvider;
  name: string;
  description: string;
  requiresApiKey: boolean;
  apiKeyLabel: string;
  apiKeyPlaceholder: string;
  setupUrl?: string;
}

export interface AIProviderCredentials {
  provider: AIProvider;
  apiKey: string;
  isActive: boolean;
}

export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Google\'s advanced AI model với khả năng phân tích hình ảnh',
    requiresApiKey: true,
    apiKeyLabel: 'Gemini API Key',
    apiKeyPlaceholder: 'Nhập Gemini API key của bạn',
    setupUrl: 'https://aistudio.google.com/app/apikey'
  },
  openai: {
    id: 'openai',
    name: 'OpenAI GPT-4',
    description: 'OpenAI GPT-4 với khả năng phân tích văn bản tiên tiến',
    requiresApiKey: true,
    apiKeyLabel: 'OpenAI API Key',
    apiKeyPlaceholder: 'Nhập OpenAI API key của bạn',
    setupUrl: 'https://platform.openai.com/api-keys'
  },
  claude: {
    id: 'claude',
    name: 'Anthropic Claude',
    description: 'Claude AI với khả năng phân tích chi tiết và an toàn',
    requiresApiKey: true,
    apiKeyLabel: 'Claude API Key',
    apiKeyPlaceholder: 'Nhập Claude API key của bạn',
    setupUrl: 'https://console.anthropic.com/'
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity AI',
    description: 'AI với khả năng tìm kiếm thông tin real-time',
    requiresApiKey: true,
    apiKeyLabel: 'Perplexity API Key',
    apiKeyPlaceholder: 'Nhập Perplexity API key của bạn',
    setupUrl: 'https://docs.perplexity.ai/docs/getting-started'
  }
};
