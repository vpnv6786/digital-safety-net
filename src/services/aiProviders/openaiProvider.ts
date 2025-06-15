
import { BaseAIProvider } from './baseProvider';
import { ScamAnalysisRequest, ScamAnalysisResponse } from '../aiAgent';

export class OpenAIProvider extends BaseAIProvider {
  initialize(): boolean {
    try {
      if (this.apiKey && this.apiKey.startsWith('sk-')) {
        this.isInitialized = true;
        console.log('OpenAI Provider initialized successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to initialize OpenAI Provider:', error);
      return false;
    }
  }

  async analyzeScamRisk(request: ScamAnalysisRequest): Promise<ScamAnalysisResponse> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI Provider not available');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'Bạn là chuyên gia an ninh mạng chuyên phân tích lừa đảo tại Việt Nam. Luôn trả về JSON hợp lệ.'
            },
            {
              role: 'user',
              content: this.buildAnalysisPrompt(request)
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices[0]?.message?.content || '';

      return this.parseAIResponse(text);
    } catch (error) {
      console.error('OpenAI analysis failed:', error);
      throw error;
    }
  }
}
