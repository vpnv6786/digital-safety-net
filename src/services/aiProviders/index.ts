
import { AIProvider } from '@/types/aiProviders';
import { BaseAIProvider } from './baseProvider';
import { GeminiProvider } from './geminiProvider';
import { OpenAIProvider } from './openaiProvider';
import { ClaudeProvider } from './claudeProvider';
import { PerplexityProvider } from './perplexityProvider';

export { BaseAIProvider };

export const createAIProvider = (provider: AIProvider, apiKey: string): BaseAIProvider => {
  switch (provider) {
    case 'gemini':
      return new GeminiProvider(apiKey);
    case 'openai':
      return new OpenAIProvider(apiKey);
    case 'claude':
      return new ClaudeProvider(apiKey);
    case 'perplexity':
      return new PerplexityProvider(apiKey);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
};
