
import { analyzeScamContent, generateReportSummary } from './aiService';

export interface SearchResult {
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  reportCount: number;
  confidence: number;
  reasons: string[];
  aiAnalysis: string;
  relatedReports: ReportSummary[];
  summary: string;
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

// Enhanced search with AI analysis
export const searchEntity = async (query: string): Promise<SearchResult> => {
  console.log('Searching for:', query);
  
  // Get existing reports from mock database
  const reports = mockReports[query] || [];
  
  // Determine entity type
  const type = detectEntityType(query);
  
  // Get AI analysis
  const aiAnalysis = await analyzeScamContent(query, type);
  
  // Combine database and AI results
  let finalRiskLevel = aiAnalysis.riskLevel;
  let confidence = aiAnalysis.confidence;
  
  // If we have reports, adjust risk level
  if (reports.length > 0) {
    if (reports.length >= 5) {
      finalRiskLevel = 'dangerous';
      confidence = Math.max(confidence, 85);
    } else if (reports.length >= 2) {
      finalRiskLevel = finalRiskLevel === 'safe' ? 'suspicious' : finalRiskLevel;
      confidence = Math.max(confidence, 70);
    }
  }
  
  // Generate summary using AI
  const summary = await generateReportSummary(reports);
  
  return {
    riskLevel: finalRiskLevel,
    reportCount: reports.length,
    confidence,
    reasons: [
      ...aiAnalysis.reasons,
      ...(reports.length > 0 ? [`${reports.length} báo cáo từ cộng đồng`] : [])
    ],
    aiAnalysis: aiAnalysis.aiAnalysis,
    relatedReports: reports,
    summary
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

// Enhanced report submission with AI pre-analysis
export const submitReport = async (reportData: {
  targetType: string;
  targetValue: string;
  scamCategory: string;
  description: string;
  evidenceFiles: File[];
}): Promise<{ success: boolean; reportId: string; aiInsights?: string }> => {
  try {
    // AI analysis of the report description
    const aiAnalysis = await analyzeScamContent(reportData.description, 'text');
    
    // Generate unique report ID
    const reportId = 'RPT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // In production, this would save to a real database
    console.log('Report submitted:', {
      ...reportData,
      reportId,
      aiConfidence: aiAnalysis.confidence,
      aiRiskLevel: aiAnalysis.riskLevel
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
