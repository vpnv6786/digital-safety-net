
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ScamAnalysisRequest {
  query: string;
  type: 'phone' | 'url' | 'text' | 'email';
  existingReports?: any[];
  userContext?: string;
}

interface ScamAnalysisResponse {
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  confidence: number;
  reasons: string[];
  aiAnalysis: string;
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  similarPatterns: string[];
  preventionTips: string[];
}

class ScamAnalysisAgent {
  private genAI: GoogleGenerativeAI | null = null;
  private isInitialized = false;

  initialize(apiKey: string): boolean {
    try {
      if (apiKey && apiKey !== 'your-gemini-api-key-here') {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.isInitialized = true;
        console.log('Scam Analysis Agent initialized successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to initialize Scam Analysis Agent:', error);
      return false;
    }
  }

  async analyzeScamRisk(request: ScamAnalysisRequest): Promise<ScamAnalysisResponse> {
    if (!this.isInitialized || !this.genAI) {
      return this.getFallbackAnalysis(request);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = this.buildAnalysisPrompt(request);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAIResponse(text, request);
    } catch (error) {
      console.error('AI Agent analysis failed:', error);
      return this.getFallbackAnalysis(request);
    }
  }

  private buildAnalysisPrompt(request: ScamAnalysisRequest): string {
    return `
Bạn là một chuyên gia an ninh mạng AI Agent chuyên phân tích lừa đảo tại Việt Nam. Phân tích đối tượng sau:

Loại: ${request.type}
Nội dung: "${request.query}"
Báo cáo hiện có: ${request.existingReports?.length || 0} báo cáo
Context: ${request.userContext || 'Không có'}

Hãy trả về phân tích theo format JSON chính xác sau:
{
  "riskLevel": "safe|suspicious|dangerous",
  "confidence": 0-100,
  "reasons": ["lý do 1", "lý do 2", ...],
  "aiAnalysis": "phân tích chi tiết bằng tiếng Việt",
  "recommendations": ["khuyến nghị 1", "khuyến nghị 2", ...],
  "urgencyLevel": "low|medium|high|critical",
  "similarPatterns": ["mẫu lừa đảo tương tự 1", "mẫu 2", ...],
  "preventionTips": ["mẹo phòng tránh 1", "mẹo 2", ...]
}

Tiêu chí phân tích cho Việt Nam:
1. Lừa đảo giả danh công an/ngân hàng
2. Đầu tư tài chính với lợi nhuận cao bất thường  
3. Việc làm yêu cầu đóng phí trước
4. Lừa tình qua mạng xã hội
5. Khuyến mãi giả từ thương hiệu lớn
6. Tin nhắn/cuộc gọi khẩn cấp tạo áp lực

Mức độ khẩn cấp:
- critical: Nguy hiểm cao, cần cảnh báo ngay
- high: Đáng ngờ cao, cần thận trọng
- medium: Có dấu hiệu đáng ngờ
- low: Mức độ rủi ro thấp

Hãy đưa ra phân tích chính xác và khuyến nghị thiết thực.
`;
  }

  private parseAIResponse(text: string, request: ScamAnalysisRequest): ScamAnalysisResponse {
    try {
      const analysis = JSON.parse(text);
      
      // Validate and ensure all required fields
      return {
        riskLevel: this.validateRiskLevel(analysis.riskLevel),
        confidence: Math.min(100, Math.max(0, analysis.confidence || 50)),
        reasons: Array.isArray(analysis.reasons) ? analysis.reasons : ['AI analysis completed'],
        aiAnalysis: analysis.aiAnalysis || 'Phân tích đã hoàn thành',
        recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : ['Cẩn thận khi tương tác'],
        urgencyLevel: this.validateUrgencyLevel(analysis.urgencyLevel),
        similarPatterns: Array.isArray(analysis.similarPatterns) ? analysis.similarPatterns : [],
        preventionTips: Array.isArray(analysis.preventionTips) ? analysis.preventionTips : []
      };
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return this.extractFromText(text, request);
    }
  }

  private extractFromText(text: string, request: ScamAnalysisRequest): ScamAnalysisResponse {
    const lowerText = text.toLowerCase();
    
    let riskLevel: 'safe' | 'suspicious' | 'dangerous' = 'safe';
    let urgencyLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (lowerText.includes('dangerous') || lowerText.includes('nguy hiểm')) {
      riskLevel = 'dangerous';
      urgencyLevel = 'high';
    } else if (lowerText.includes('suspicious') || lowerText.includes('đáng ngờ')) {
      riskLevel = 'suspicious';
      urgencyLevel = 'medium';
    }

    return {
      riskLevel,
      confidence: 70,
      reasons: ['Phân tích dựa trên mẫu AI'],
      aiAnalysis: text.substring(0, 300) + '...',
      recommendations: ['Thận trọng khi tương tác với đối tượng này'],
      urgencyLevel,
      similarPatterns: [],
      preventionTips: ['Luôn xác minh thông tin từ nguồn chính thức']
    };
  }

  private validateRiskLevel(level: string): 'safe' | 'suspicious' | 'dangerous' {
    return ['safe', 'suspicious', 'dangerous'].includes(level) ? level as any : 'safe';
  }

  private validateUrgencyLevel(level: string): 'low' | 'medium' | 'high' | 'critical' {
    return ['low', 'medium', 'high', 'critical'].includes(level) ? level as any : 'low';
  }

  private getFallbackAnalysis(request: ScamAnalysisRequest): ScamAnalysisResponse {
    // Basic fallback analysis when AI is not available
    const hasReports = request.existingReports && request.existingReports.length > 0;
    
    let riskLevel: 'safe' | 'suspicious' | 'dangerous' = 'safe';
    let urgencyLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (hasReports) {
      const reportCount = request.existingReports!.length;
      if (reportCount >= 5) {
        riskLevel = 'dangerous';
        urgencyLevel = 'high';
      } else if (reportCount >= 2) {
        riskLevel = 'suspicious';
        urgencyLevel = 'medium';
      }
    }

    return {
      riskLevel,
      confidence: hasReports ? 80 : 50,
      reasons: hasReports ? [`${request.existingReports!.length} báo cáo từ cộng đồng`] : ['Chưa có báo cáo nào'],
      aiAnalysis: 'Phân tích cơ bản dựa trên dữ liệu cộng đồng. Để có phân tích AI chi tiết, vui lòng cung cấp API key.',
      recommendations: ['Cẩn thận khi tương tác', 'Xác minh thông tin từ nguồn đáng tin cậy'],
      urgencyLevel,
      similarPatterns: [],
      preventionTips: [
        'Không cung cấp thông tin cá nhân cho người lạ',
        'Luôn xác minh qua kênh chính thức',
        'Không chuyển tiền khi chưa chắc chắn'
      ]
    };
  }

  isAvailable(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const scamAnalysisAgent = new ScamAnalysisAgent();

// Export types for use in other components
export type { ScamAnalysisRequest, ScamAnalysisResponse };
