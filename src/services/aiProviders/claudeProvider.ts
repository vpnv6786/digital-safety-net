
import { BaseAIProvider } from './baseProvider';
import { ScamAnalysisRequest, ScamAnalysisResponse } from '../aiAgent';

export class ClaudeProvider extends BaseAIProvider {
  initialize(): boolean {
    try {
      if (this.apiKey && this.apiKey.startsWith('sk-ant-')) {
        this.isInitialized = true;
        console.log('Claude Provider initialized successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to initialize Claude Provider:', error);
      return false;
    }
  }

  async analyzeScamRisk(request: ScamAnalysisRequest): Promise<ScamAnalysisResponse> {
    if (!this.isAvailable()) {
      throw new Error('Claude Provider not available');
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: this.buildAnalysisPrompt(request)
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.content[0]?.text || '';

      return this.parseAIResponse(text);
    } catch (error) {
      console.error('Claude analysis failed:', error);
      throw error;
    }
  }
}
