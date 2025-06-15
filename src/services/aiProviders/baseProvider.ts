
import { ScamAnalysisRequest, ScamAnalysisResponse } from '../aiAgent';

export abstract class BaseAIProvider {
  protected apiKey: string;
  protected isInitialized: boolean = false;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  abstract initialize(): boolean;
  abstract analyzeScamRisk(request: ScamAnalysisRequest): Promise<ScamAnalysisResponse>;
  abstract analyzeImage?(imageFile: File): Promise<ScamAnalysisResponse>;

  isAvailable(): boolean {
    return this.isInitialized && !!this.apiKey;
  }

  protected buildAnalysisPrompt(request: ScamAnalysisRequest): string {
    return `
Bạn là một chuyên gia an ninh mạng AI chuyên phân tích lừa đảo tại Việt Nam. Phân tích đối tượng sau:

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

Hãy đưa ra phân tích chính xác và khuyến nghị thiết thực.
`;
  }

  protected parseAIResponse(text: string): ScamAnalysisResponse {
    try {
      const analysis = JSON.parse(text);
      
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
      return this.extractFromText(text);
    }
  }

  private validateRiskLevel(level: string): 'safe' | 'suspicious' | 'dangerous' {
    return ['safe', 'suspicious', 'dangerous'].includes(level) ? level as any : 'safe';
  }

  private validateUrgencyLevel(level: string): 'low' | 'medium' | 'high' | 'critical' {
    return ['low', 'medium', 'high', 'critical'].includes(level) ? level as any : 'low';
  }

  private extractFromText(text: string): ScamAnalysisResponse {
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
}
