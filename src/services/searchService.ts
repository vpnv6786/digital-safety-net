
import { scamAnalysisAgent, ScamAnalysisRequest, ScamAnalysisResponse } from './aiAgent';
import { searchEntityInSupabase, SupabaseSearchResult } from './supabaseService';

export interface SearchResult {
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  reportCount: number;
  confidence: number;
  reasons: string[];
  aiAnalysis: string;
  relatedReports: ReportSummary[];
  summary: string;
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  similarPatterns: string[];
  preventionTips: string[];
}

export interface ReportSummary {
  id: string;
  category: string;
  description: string;
  reportedAt: string;
  verifiedBy: number;
}

// Enhanced search with both Supabase and AI
export const searchEntity = async (query: string): Promise<SearchResult> => {
  console.log('Searching for:', query);
  
  // First search in Supabase database
  const supabaseResult = await searchEntityInSupabase(query);
  
  // Prepare for AI analysis
  const type = detectEntityType(query);
  
  // Convert Supabase reports to expected format
  const existingReports = supabaseResult?.relatedReports.map(report => ({
    id: report.id,
    category: report.category,
    description: report.description,
    reportedAt: report.reportedAt,
    verifiedBy: report.verifiedBy
  })) || [];

  // Prepare AI Agent request
  const aiRequest: ScamAnalysisRequest = {
    query,
    type,
    existingReports,
    userContext: `Tìm kiếm từ ứng dụng Vệ Binh Mạng. Database có ${existingReports.length} báo cáo.`
  };
  
  // Get AI Agent analysis
  let aiAnalysis: ScamAnalysisResponse;
  try {
    aiAnalysis = await scamAnalysisAgent.analyzeScamRisk(aiRequest);
  } catch (error) {
    console.error('AI analysis failed, using fallback:', error);
    // Fallback to Supabase data if available
    if (supabaseResult) {
      aiAnalysis = {
        riskLevel: supabaseResult.riskLevel,
        confidence: supabaseResult.confidence,
        reasons: supabaseResult.reasons,
        aiAnalysis: supabaseResult.summary,
        recommendations: supabaseResult.recommendations,
        urgencyLevel: supabaseResult.urgencyLevel,
        similarPatterns: [],
        preventionTips: getDefaultPreventionTips()
      };
    } else {
      // Complete fallback
      aiAnalysis = getFallbackAnalysis(query);
    }
  }

  // Combine Supabase and AI results
  const finalResult: SearchResult = {
    riskLevel: supabaseResult?.riskLevel || aiAnalysis.riskLevel,
    reportCount: supabaseResult?.reportCount || 0,
    confidence: Math.max(supabaseResult?.confidence || 0, aiAnalysis.confidence),
    reasons: [...(supabaseResult?.reasons || []), ...aiAnalysis.reasons],
    aiAnalysis: aiAnalysis.aiAnalysis,
    relatedReports: supabaseResult?.relatedReports || [],
    summary: supabaseResult?.summary || aiAnalysis.aiAnalysis,
    recommendations: aiAnalysis.recommendations,
    urgencyLevel: getHigherUrgency(supabaseResult?.urgencyLevel, aiAnalysis.urgencyLevel),
    similarPatterns: aiAnalysis.similarPatterns,
    preventionTips: aiAnalysis.preventionTips
  };

  return finalResult;
};

// Enhanced report submission with both Supabase and AI
export const submitReport = async (reportData: {
  targetType: string;
  targetValue: string;
  scamCategory: string;
  description: string;
  evidenceFiles: File[];
}): Promise<{ success: boolean; reportId: string; aiInsights?: string }> => {
  try {
    // Submit to Supabase first
    const supabaseResult = await supabaseService.submitReportToSupabase(reportData);
    
    if (!supabaseResult.success) {
      return {
        success: false,
        reportId: '',
        aiInsights: supabaseResult.message
      };
    }

    // AI analysis of the report description for insights
    let aiInsights = '';
    try {
      const aiRequest: ScamAnalysisRequest = {
        query: reportData.description,
        type: 'text',
        userContext: 'Báo cáo từ người dùng'
      };
      
      const aiAnalysis = await scamAnalysisAgent.analyzeScamRisk(aiRequest);
      aiInsights = aiAnalysis.aiAnalysis;
    } catch (error) {
      console.error('AI insights failed:', error);
      aiInsights = 'Báo cáo đã được ghi nhận. Cảm ơn bạn đã đóng góp bảo vệ cộng đồng.';
    }

    console.log('Report submitted successfully:', {
      reportId: supabaseResult.reportId,
      aiInsights
    });
    
    return {
      success: true,
      reportId: supabaseResult.reportId,
      aiInsights
    };
  } catch (error) {
    console.error('Failed to submit report:', error);
    return {
      success: false,
      reportId: '',
      aiInsights: 'Có lỗi xảy ra khi gửi báo cáo'
    };
  }
};

// Helper functions
const detectEntityType = (input: string): 'phone' | 'url' | 'text' | 'email' => {
  if (/^[0-9+\-\s()]+$/.test(input.replace(/\s/g, ''))) {
    return 'phone';
  }
  if (input.includes('@')) {
    return 'email';
  }
  if (input.includes('.') && (input.includes('http') || input.includes('www') || input.includes('.com') || input.includes('.vn'))) {
    return 'url';
  }
  return 'text';
};

const getHigherUrgency = (
  urgency1?: 'low' | 'medium' | 'high' | 'critical',
  urgency2?: 'low' | 'medium' | 'high' | 'critical'
): 'low' | 'medium' | 'high' | 'critical' => {
  const levels = { low: 1, medium: 2, high: 3, critical: 4 };
  const level1 = levels[urgency1 || 'low'];
  const level2 = levels[urgency2 || 'low'];
  const maxLevel = Math.max(level1, level2);
  
  return Object.keys(levels).find(key => levels[key as keyof typeof levels] === maxLevel) as 'low' | 'medium' | 'high' | 'critical';
};

const getDefaultPreventionTips = (): string[] => [
  'Không cung cấp thông tin cá nhân cho người lạ',
  'Luôn xác minh qua kênh chính thức',
  'Không chuyển tiền khi chưa chắc chắn',
  'Báo cáo ngay khi phát hiện dấu hiệu lừa đảo'
];

const getFallbackAnalysis = (query: string): ScamAnalysisResponse => ({
  riskLevel: 'safe',
  confidence: 50,
  reasons: ['Chưa có thông tin từ cơ sở dữ liệu'],
  aiAnalysis: 'Không tìm thấy thông tin cụ thể về đối tượng này. Vui lòng cẩn thận và báo cáo nếu phát hiện dấu hiệu bất thường.',
  recommendations: getDefaultPreventionTips(),
  urgencyLevel: 'low',
  similarPatterns: [],
  preventionTips: getDefaultPreventionTips()
});

// Import statement fix
import * as supabaseService from './supabaseService';
