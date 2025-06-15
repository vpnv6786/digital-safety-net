
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseAIProvider } from './baseProvider';
import { ScamAnalysisRequest, ScamAnalysisResponse } from '../aiAgent';

export class GeminiProvider extends BaseAIProvider {
  private genAI: GoogleGenerativeAI | null = null;

  initialize(): boolean {
    try {
      if (this.apiKey && this.apiKey !== 'your-gemini-api-key-here') {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.isInitialized = true;
        console.log('Gemini Provider initialized successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to initialize Gemini Provider:', error);
      return false;
    }
  }

  async analyzeScamRisk(request: ScamAnalysisRequest): Promise<ScamAnalysisResponse> {
    if (!this.isAvailable() || !this.genAI) {
      throw new Error('Gemini Provider not available');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = this.buildAnalysisPrompt(request);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAIResponse(text);
    } catch (error) {
      console.error('Gemini analysis failed:', error);
      throw error;
    }
  }

  async analyzeImage(imageFile: File): Promise<ScamAnalysisResponse> {
    if (!this.isAvailable() || !this.genAI) {
      throw new Error('Gemini Provider not available');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const imagePart = await this.fileToGenerativePart(imageFile);

      const prompt = `
Phân tích hình ảnh này để tìm các dấu hiệu lừa đảo. Trả về JSON theo format:
{
  "riskLevel": "safe|suspicious|dangerous",
  "confidence": 0-100,
  "reasons": ["lý do 1", "lý do 2", ...],
  "aiAnalysis": "phân tích chi tiết bằng tiếng Việt",
  "recommendations": ["khuyến nghị 1", "khuyến nghị 2", ...],
  "urgencyLevel": "low|medium|high|critical",
  "similarPatterns": ["mẫu lừa đảo tương tự"],
  "preventionTips": ["mẹo phòng tránh"]
}

Tìm kiếm các dấu hiệu:
- Tin nhắn giả mạo ngân hàng/công an
- Khuyến mãi giả mạo
- Thông tin liên lạc đáng ngờ
- Thiết kế website giả mạo
- Lời mời đầu tư không thực tế
`;

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      return this.parseAIResponse(text);
    } catch (error) {
      console.error('Gemini image analysis failed:', error);
      throw error;
    }
  }

  private fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
