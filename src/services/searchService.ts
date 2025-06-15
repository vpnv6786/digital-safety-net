
import { scamAnalysisAgent, ScamAnalysisRequest, ScamAnalysisResponse } from './aiAgent';

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

// Mock database - in production this would be a real database
const mockReports: { [key: string]: ReportSummary[] } = {
  '0987654321': [
    {
      id: '1',
      category: 'Giả danh công an',
      description: 'Gọi điện tự xưng là công an, yêu cầu chuyển tiền để giải quyết vụ án',
      reportedAt: '2 ngày trước',
      verifiedBy: 3
    },
    {
      id: '2',
      category: 'Lừa đảo đầu tư',
      description: 'Mời tham gia đầu tư online với lợi nhuận cao',
      reportedAt: '1 tuần trước',
      verifiedBy: 7
    }
  ],
  '0123456789': [
    {
      id: '3',
      category: 'Lừa đảo việc làm',
      description: 'Yêu cầu chuyển tiền phí xử lý hồ sơ việc làm',
      reportedAt: '3 ngày trước',
      verifiedBy: 2
    }
  ],
  'fake-bank-site.com': [
    {
      id: '4',
      category: 'Lừa đảo ngân hàng',
      description: 'Website giả mạo ngân hàng để đánh cắp thông tin',
      reportedAt: '1 ngày trước',
      verifiedBy: 5
    }
  ]
};

// Initialize AI Agent with stored API key
const initializeAIAgent = () => {
  const apiKey = localStorage.getItem('gemini-api-key');
  if (apiKey) {
    scamAnalysisAgent.initialize(apiKey);
  }
};

// Enhanced search with AI Agent
export const searchEntity = async (query: string): Promise<SearchResult> => {
  console.log('Searching for:', query);
  
  // Initialize AI Agent if needed
  initializeAIAgent();
  
  // Get existing reports from mock database
  const reports = mockReports[query] || [];
  
  // Determine entity type
  const type = detectEntityType(query);
  
  // Prepare AI Agent request
  const aiRequest: ScamAnalysisRequest = {
    query,
    type,
    existingReports: reports,
    userContext: `Tìm kiếm từ ứng dụng Vệ Binh Mạng`
  };
  
  // Get AI Agent analysis
  const aiAnalysis: ScamAnalysisResponse = await scamAnalysisAgent.analyzeScamRisk(aiRequest);
  
  return {
    riskLevel: aiAnalysis.riskLevel,
    reportCount: reports.length,
    confidence: aiAnalysis.confidence,
    reasons: aiAnalysis.reasons,
    aiAnalysis: aiAnalysis.aiAnalysis,
    relatedReports: reports,
    summary: generateSummary(reports, aiAnalysis),
    recommendations: aiAnalysis.recommendations,
    urgencyLevel: aiAnalysis.urgencyLevel,
    similarPatterns: aiAnalysis.similarPatterns,
    preventionTips: aiAnalysis.preventionTips
  };
};

// Detect entity type from input
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

// Generate summary combining reports and AI analysis
const generateSummary = (reports: ReportSummary[], aiAnalysis: ScamAnalysisResponse): string => {
  if (reports.length === 0) {
    return aiAnalysis.aiAnalysis;
  }
  
  const reportSummary = `Có ${reports.length} báo cáo từ cộng đồng. `;
  return reportSummary + aiAnalysis.aiAnalysis;
};

// Enhanced report submission with AI pre-analysis
export const submitReport = async (reportData: {
  targetType: string;
  targetValue: string;
  scamCategory: string;
  description: string;
  evidenceFiles: File[];
}): Promise<{ success: boolean; reportId: string; aiInsights?: string }> => {
  try {
    // Initialize AI Agent if needed
    initializeAIAgent();
    
    // AI analysis of the report description
    const aiRequest: ScamAnalysisRequest = {
      query: reportData.description,
      type: 'text',
      userContext: 'Báo cáo từ người dùng'
    };
    
    const aiAnalysis = await scamAnalysisAgent.analyzeScamRisk(aiRequest);
    
    // Generate unique report ID
    const reportId = 'RPT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    console.log('Report submitted with AI insights:', {
      ...reportData,
      reportId,
      aiConfidence: aiAnalysis.confidence,
      aiRiskLevel: aiAnalysis.riskLevel,
      aiRecommendations: aiAnalysis.recommendations
    });
    
    // Add to mock database
    if (!mockReports[reportData.targetValue]) {
      mockReports[reportData.targetValue] = [];
    }
    
    mockReports[reportData.targetValue].push({
      id: reportId,
      category: reportData.scamCategory,
      description: reportData.description,
      reportedAt: 'vừa xong',
      verifiedBy: 0
    });
    
    return {
      success: true,
      reportId,
      aiInsights: aiAnalysis.aiAnalysis
    };
  } catch (error) {
    console.error('Failed to submit report:', error);
    return {
      success: false,
      reportId: '',
      aiInsights: 'Không thể phân tích AI cho báo cáo này'
    };
  }
};
