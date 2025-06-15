
import { BaseAIProvider } from './baseProvider';
import { ScamAnalysisRequest, ScamAnalysisResponse } from '../aiAgent';

export class PerplexityProvider extends BaseAIProvider {
  initialize(): boolean {
    try {
      if (this.apiKey && this.apiKey.startsWith('pplx-')) {
        this.isInitialized = true;
        console.log('Perplexity Provider initialized successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to initialize Perplexity Provider:', error);
      return false;
    }
  }

  async analyzeScamRisk(request: ScamAnalysisRequest): Promise<ScamAnalysisResponse> {
    if (!this.isAvailable()) {
      throw new Error('Perplexity Provider not available');
    }

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Bạn là chuyên gia an ninh mạng với khả năng tìm kiếm thông tin real-time về lừa đảo tại Việt Nam.'
            },
            {
              role: 'user',
              content: this.buildAnalysisPrompt(request) + '\n\nHãy tìm kiếm thông tin mới nhất về loại lừa đảo này.'
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
          search_domain_filter: ['gov.vn', 'vnexpress.net', 'tuoitre.vn'],
          search_recency_filter: 'month'
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices[0]?.message?.content || '';

      return this.parseAIResponse(text);
    } catch (error) {
      console.error('Perplexity analysis failed:', error);
      throw error;
    }
  }
}
