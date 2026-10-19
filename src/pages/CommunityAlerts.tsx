
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, MapPin, Clock, Users, TrendingUp, Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { communityService, CommunityAlert } from '@/services/communityService';
import { useLanguage } from '@/contexts/LanguageContext';

const CommunityAlerts = () => {
  const [alerts, setAlerts] = useState<CommunityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'scam'>('all');
  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    loadCommunityAlerts();
    
    // Set up real-time subscription
    const channel = communityService.subscribeToAlerts((newAlert: CommunityAlert) => {
            setAlerts(prev => [newAlert, ...prev]);
      toast({
        title: language === 'en' ? "🚨 New Alert" : "🚨 Cảnh Báo Mới",
        description: language === 'en' ? "New alert from community" : "Có cảnh báo mới từ cộng đồng",
      });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [toast, language]);

  const loadCommunityAlerts = async () => {
    try {
      const data = await communityService.getCommunityAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Error loading community alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAlerts = () => {
    switch (filter) {
      case 'urgent':
        return alerts.filter(alert => alert.alert_type === 'urgent_alert' || alert.severity === 'critical');
      case 'scam':
        return alerts.filter(alert => alert.alert_type === 'scam_warning');
      default:
        return alerts;
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent_alert': return '🚨';
      case 'scam_warning': return '⚠️';
      case 'danger_zone': return '⛔';
      case 'safety_tip': return '💡';
      default: return '📢';
    }
  };

  const getAlertTypeName = (type: string) => {
    const types = {
      'urgent_alert': language === 'en' ? 'Urgent Alert' : 'Cảnh Báo Khẩn Cấp',
      'scam_warning': language === 'en' ? 'Scam Warning' : 'Cảnh Báo Lừa Đảo',
      'danger_zone': language === 'en' ? 'Danger Zone' : 'Khu Vực Nguy Hiểm',
      'safety_tip': language === 'en' ? 'Safety Tip' : 'Mẹo An Toàn'
    };
    return types[type as keyof typeof types] || (language === 'en' ? 'Notification' : 'Thông Báo');
  };

  const getSourceTypeName = (type: string) => {
    const sources = {
      'authority': language === 'en' ? 'Authority' : 'Cơ Quan Chức Năng',
      'community': language === 'en' ? 'Community' : 'Cộng Đồng',
      'user_report': language === 'en' ? 'User Report' : 'Báo Cáo Người Dùng',
      'auto_detected': language === 'en' ? 'Auto Detected' : 'Tự Động Phát Hiện'
    };
    return sources[type as keyof typeof sources] || (language === 'en' ? 'Unknown' : 'Không Rõ');
  };

  const getSeverityText = (severity: string) => {
    const severities = {
      'critical': language === 'en' ? 'Critical Risk' : 'Cực Kỳ Nguy Hiểm',
      'high': language === 'en' ? 'High Risk' : 'Nguy Hiểm Cao',
      'medium': language === 'en' ? 'Medium Risk' : 'Nguy Hiểm Trung Bình',
      'low': language === 'en' ? 'Low Risk' : 'Nguy Hiểm Thấp'
    };
    return severities[severity as keyof typeof severities] || severity;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (language === 'en') {
      if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} days ago`;
    } else {
      if (diffMinutes < 60) return `${diffMinutes} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      return `${diffDays} ngày trước`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trust-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {language === 'en' ? 'Loading alerts...' : 'Đang tải cảnh báo...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'en' ? 'Community alerts' : 'Cảnh báo cộng đồng'}
          </h1>
          <p className="text-gray-600">
            {language === 'en'
              ? 'Only alerts reviewed by a moderator are shown. Alerts you submit appear here after review.'
              : 'Chỉ hiển thị cảnh báo đã được kiểm duyệt. Cảnh báo bạn gửi sẽ xuất hiện sau khi được xem xét.'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{language === 'en' ? 'Filter Alerts' : 'Lọc Cảnh Báo'}</span>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Eye className="w-4 h-4" />
                <span>{getFilteredAlerts().length} {language === 'en' ? 'alerts' : 'cảnh báo'}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className="flex items-center space-x-2"
              >
                <span>{language === 'en' ? 'All' : 'Tất Cả'}</span>
              </Button>
              <Button
                variant={filter === 'urgent' ? 'default' : 'outline'}
                onClick={() => setFilter('urgent')}
                className="flex items-center space-x-2"
              >
                <span>{language === 'en' ? '🚨 Urgent' : '🚨 Khẩn Cấp'}</span>
              </Button>
              <Button
                variant={filter === 'scam' ? 'default' : 'outline'}
                onClick={() => setFilter('scam')}
                className="flex items-center space-x-2"
              >
                <span>{language === 'en' ? '⚠️ Scam' : '⚠️ Lừa Đảo'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {getFilteredAlerts().map((alert) => (
            <Card key={alert.id} className={`overflow-hidden ${alert.severity === 'critical' ? 'border-red-300 bg-red-50' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getAlertTypeIcon(alert.alert_type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                        {alert.is_verified && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {language === 'en' ? '✓ Verified' : '✓ Đã Xác Minh'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{alert.description}</p>
                      
                      {alert.location_name && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{alert.location_name}</span>
                        </div>
                      )}
                      
                      {alert.tags && alert.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {alert.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                      {getSeverityText(alert.severity)}
                    </Badge>
                    
                    <div className="text-xs text-gray-500 text-right">
                      <div>{getAlertTypeName(alert.alert_type)}</div>
                      <div>{getSourceTypeName(alert.source_type || 'user_report')}</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{alert.created_at ? formatTimeAgo(alert.created_at) : (language === 'en' ? 'Unknown' : 'Không Rõ')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{alert.view_count || 0} {language === 'en' ? 'views' : 'lượt xem'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span>{alert.upvotes || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                      <span>{alert.downvotes || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {getFilteredAlerts().length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {language === 'en' ? 'No Alerts' : 'Không Có Cảnh Báo Nào'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Currently no alerts match the selected filter.'
                  : 'Hiện tại không có cảnh báo nào phù hợp với bộ lọc đã chọn.'
                }
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">
                  {language === 'en' ? 'Real-time Information' : 'Thông Tin Realtime'}
                </h4>
                <p className="text-sm text-blue-700">
                  {language === 'en' 
                    ? 'This page updates alerts in real-time. Keep your browser open to receive the latest notifications about threats and fraud from the community and authorities.'
                    : 'Trang này cập nhật cảnh báo theo thời gian thực. Hãy để trình duyệt mở để nhận thông báo mới nhất về các mối nguy hiểm và lừa đảo từ cộng đồng và cơ quan chức năng.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityAlerts;
