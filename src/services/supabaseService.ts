
import { supabase } from '@/integrations/supabase/client';
import { ScamAnalysisRequest, ScamAnalysisResponse } from './aiAgent';

export interface SupabaseSearchResult {
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  reportCount: number;
  confidence: number;
  reasons: string[];
  relatedReports: SupabaseReportSummary[];
  summary: string;
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface SupabaseReportSummary {
  id: string;
  category: string;
  description: string;
  reportedAt: string;
  verifiedBy: number;
}

// Search entity in Supabase database
export const searchEntityInSupabase = async (query: string): Promise<SupabaseSearchResult | null> => {
  try {
    console.log('Searching entity in Supabase:', query);
    
    // Determine entity type
    const entityType = detectEntityType(query);
    
    // Search for entity
    const { data: entity, error: entityError } = await supabase
      .from('entities')
      .select('*')
      .eq('entity_value', query)
      .eq('entity_type', entityType)
      .maybeSingle();

    if (entityError) {
      console.error('Entity search error:', entityError);
      return null;
    }

    if (!entity) {
      // No entity found, return safe result
      return {
        riskLevel: 'safe',
        reportCount: 0,
        confidence: 60,
        reasons: ['Chưa có báo cáo nào từ cộng đồng'],
        relatedReports: [],
        summary: 'Chưa có thông tin báo cáo về đối tượng này.',
        recommendations: ['Vẫn nên cẩn thận khi tương tác', 'Báo cáo nếu phát hiện dấu hiệu lừa đảo'],
        urgencyLevel: 'low'
      };
    }

    // Get related reports
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select(`
        id,
        scam_category,
        description,
        created_at,
        status
      `)
      .eq('entity_id', entity.id)
      .eq('status', 'verified')
      .order('created_at', { ascending: false })
      .limit(5);

    if (reportsError) {
      console.error('Reports search error:', reportsError);
    }

    const relatedReports: SupabaseReportSummary[] = (reports || []).map(report => ({
      id: report.id,
      category: report.scam_category,
      description: report.description.substring(0, 100) + '...',
      reportedAt: formatDate(report.created_at),
      verifiedBy: 1 // Simplified for now
    }));

    // Determine risk level based on report count and risk score
    let riskLevel: 'safe' | 'suspicious' | 'dangerous' = 'safe';
    let urgencyLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    if (entity.risk_score >= 80) {
      riskLevel = 'dangerous';
      urgencyLevel = 'high';
    } else if (entity.risk_score >= 40) {
      riskLevel = 'suspicious';
      urgencyLevel = 'medium';
    }

    const reasons = [];
    if (entity.report_count > 0) {
      reasons.push(`${entity.report_count} báo cáo từ cộng đồng`);
    }
    if (entity.risk_score > 50) {
      reasons.push(`Điểm rủi ro cao: ${entity.risk_score}/100`);
    }

    return {
      riskLevel,
      reportCount: entity.report_count || 0,
      confidence: Math.min(95, 60 + (entity.report_count * 10)),
      reasons,
      relatedReports,
      summary: generateSummary(entity, relatedReports),
      recommendations: generateRecommendations(riskLevel),
      urgencyLevel
    };

  } catch (error) {
    console.error('Supabase search error:', error);
    return null;
  }
};

// Submit report to Supabase
export const submitReportToSupabase = async (reportData: {
  targetType: string;
  targetValue: string;
  scamCategory: string;
  description: string;
  evidenceFiles: File[];
}): Promise<{ success: boolean; reportId: string; message?: string }> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      return { success: false, reportId: '', message: 'Bạn cần đăng nhập để báo cáo' };
    }

    // First, find or create entity
    const entityType = mapTargetTypeToEntityType(reportData.targetType);
    
    let { data: entity, error: entityError } = await supabase
      .from('entities')
      .select('id')
      .eq('entity_value', reportData.targetValue)
      .eq('entity_type', entityType)
      .maybeSingle();

    if (entityError && entityError.code !== 'PGRST116') {
      throw entityError;
    }

    if (!entity) {
      // Create new entity
      const { data: newEntity, error: createError } = await supabase
        .from('entities')
        .insert({
          entity_value: reportData.targetValue,
          entity_type: entityType
        })
        .select('id')
        .single();

      if (createError) {
        throw createError;
      }
      entity = newEntity;
    }

    // Create report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert({
        reporter_user_id: user.id,
        entity_id: entity.id,
        scam_category: reportData.scamCategory,
        description: reportData.description,
        evidence_urls: [] // File upload will be implemented later
      })
      .select('id')
      .single();

    if (reportError) {
      throw reportError;
    }

    return {
      success: true,
      reportId: report.id,
      message: 'Báo cáo đã được gửi thành công'
    };

  } catch (error) {
    console.error('Submit report error:', error);
    return {
      success: false,
      reportId: '',
      message: 'Có lỗi xảy ra khi gửi báo cáo'
    };
  }
};

// Helper functions
const detectEntityType = (input: string): string => {
  if (/^[0-9+\-\s()]+$/.test(input.replace(/\s/g, ''))) {
    return 'phone';
  }
  if (input.includes('@')) {
    return 'email';
  }
  if (input.includes('.') && (input.includes('http') || input.includes('www') || input.includes('.com') || input.includes('.vn'))) {
    return 'url';
  }
  return 'other';
};

const mapTargetTypeToEntityType = (targetType: string): string => {
  const mapping: { [key: string]: string } = {
    'phone': 'phone',
    'website': 'url',
    'email': 'email',
    'bank': 'bank_account',
    'other': 'other'
  };
  return mapping[targetType] || 'other';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} tuần trước`;
  return `${Math.ceil(diffDays / 30)} tháng trước`;
};

const generateSummary = (entity: any, reports: SupabaseReportSummary[]): string => {
  if (reports.length === 0) {
    return 'Chưa có báo cáo chi tiết nào về đối tượng này.';
  }
  
  const reportText = reports.length === 1 ? 'báo cáo' : 'báo cáo';
  return `Có ${reports.length} ${reportText} đã được xác minh từ cộng đồng. Điểm rủi ro hiện tại: ${entity.risk_score}/100.`;
};

const generateRecommendations = (riskLevel: string): string[] => {
  switch (riskLevel) {
    case 'dangerous':
      return [
        'TRÁNH tương tác với đối tượng này',
        'Không cung cấp thông tin cá nhân',
        'Không chuyển tiền dưới mọi hình thức',
        'Báo cáo cho cơ quan chức năng'
      ];
    case 'suspicious':
      return [
        'Cẩn thận khi tương tác',
        'Xác minh thông tin qua kênh chính thức',
        'Không cung cấp thông tin nhạy cảm',
        'Tham khảo ý kiến người thân'
      ];
    default:
      return [
        'Luôn cảnh giác với thông tin lạ',
        'Xác minh trước khi tin tưởng',
        'Báo cáo nếu phát hiện dấu hiệu bất thường'
      ];
  }
};
