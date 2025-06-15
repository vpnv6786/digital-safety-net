
import { aiManager } from './aiManager';

export interface ScamAnalysisRequest {
  query: string;
  type: 'phone' | 'url' | 'text' | 'email';
  existingReports?: any[];
  userContext?: string;
}

export interface ScamAnalysisResponse {
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
  initialize(apiKey?: string): boolean {
    // Legacy method for backward compatibility
    if (apiKey) {
      return aiManager.setProviderCredentials('gemini', apiKey);
    }
    
    // Initialize from storage
    aiManager.initializeFromStorage();
    return aiManager.hasAvailableProvider();
  }

  async analyzeScamRisk(request: ScamAnalysisRequest): Promise<ScamAnalysisResponse> {
    try {
      // Try AI analysis first
      return await aiManager.analyzeScamRisk(request);
    } catch (error) {
      console.error('AI Agent analysis failed:', error);
      // Fallback to basic analysis
      return this.getFallbackAnalysis(request);
    }
  }

  async analyzeImage(imageFile: File): Promise<ScamAnalysisResponse> {
    try {
      return await aiManager.analyzeImage(imageFile);
    } catch (error) {
      console.error('AI Agent image analysis failed:', error);
      // Return basic image analysis
      return {
        riskLevel: 'suspicious',
        confidence: 50,
        reasons: ['Không thể phân tích hình ảnh với AI'],
        aiAnalysis: 'Cần cấu hình AI provider hỗ trợ phân tích hình ảnh để có kết quả chính xác hơn.',
        recommendations: ['Cẩn thận với hình ảnh từ nguồn không rõ ràng'],
        urgencyLevel: 'medium',
        similarPatterns: [],
        preventionTips: ['Kiểm tra kỹ thông tin trước khi tin tưởng']
      };
    }
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
      aiAnalysis: 'Phân tích cơ bản dựa trên dữ liệu cộng đồng. Để có phân tích AI chi tiết, vui lòng cấu hình AI provider.',
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
    return aiManager.hasAvailableProvider();
  }

  getActiveProvider(): string {
    const provider = aiManager.getActiveProvider();
    return provider ? provider : 'none';
  }

  getConfiguredProviders(): string[] {
    return aiManager.getAvailableProviders();
  }
}

// Export singleton instance
export const scamAnalysisAgent = new ScamAnalysisAgent();
