
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, AlertTriangle, Shield, Eye, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface ScamStatistic {
  id: string;
  scam_type: string;
  title: string;
  description: string;
  danger_level: 'low' | 'medium' | 'high' | 'critical';
  frequency_score: number;
  damage_score: number;
  total_reports: number;
  recent_trend: 'increasing' | 'stable' | 'decreasing';
  prevention_tips: string[];
  warning_signs: string[];
}

const ScamRankings = () => {
  const [scamStats, setScamStats] = useState<ScamStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'frequency' | 'damage' | 'reports'>('frequency');

  useEffect(() => {
    loadScamStatistics();
  }, []);

  const loadScamStatistics = async () => {
    try {
      const { data, error } = await supabase
        .from('scam_statistics')
        .select('*')
        .order('frequency_score', { ascending: false });

      if (error) {
        console.error('Error loading scam statistics:', error);
        return;
      }

      setScamStats(data || []);
    } catch (error) {
      console.error('Error loading scam statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSortedStats = () => {
    const sorted = [...scamStats];
    switch (sortBy) {
      case 'frequency':
        return sorted.sort((a, b) => b.frequency_score - a.frequency_score);
      case 'damage':
        return sorted.sort((a, b) => b.damage_score - a.damage_score);
      case 'reports':
        return sorted.sort((a, b) => b.total_reports - a.total_reports);
      default:
        return sorted;
    }
  };

  const getDangerBadgeVariant = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-green-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'Đang tăng';
      case 'decreasing': return 'Đang giảm';
      case 'stable': return 'Ổn định';
      default: return 'Không rõ';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trust-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="text-trust-blue hover:bg-trust-blue/10">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Về trang chủ
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-trust-blue" />
            <span className="text-lg font-semibold text-gray-800">Bảng xếp hạng lừa đảo</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Bảng xếp hạng các dạng lừa đảo nguy hiểm
          </h1>
          <p className="text-gray-600">
            Thống kê và phân tích các hình thức lừa đảo phổ biến nhất hiện nay
          </p>
        </div>

        {/* Sort Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Sắp xếp theo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={sortBy === 'frequency' ? 'default' : 'outline'}
                onClick={() => setSortBy('frequency')}
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Tần suất xuất hiện</span>
              </Button>
              <Button
                variant={sortBy === 'damage' ? 'default' : 'outline'}
                onClick={() => setSortBy('damage')}
                className="flex items-center space-x-2"
              >
                <DollarSign className="w-4 h-4" />
                <span>Mức độ thiệt hại</span>
              </Button>
              <Button
                variant={sortBy === 'reports' ? 'default' : 'outline'}
                onClick={() => setSortBy('reports')}
                className="flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Số báo cáo</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scam Statistics List */}
        <div className="space-y-4">
          {getSortedStats().map((stat, index) => (
            <Card key={stat.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-trust-blue text-white rounded-full font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{stat.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{stat.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={getDangerBadgeVariant(stat.danger_level)}>
                      {stat.danger_level === 'critical' && 'Cực kỳ nguy hiểm'}
                      {stat.danger_level === 'high' && 'Nguy hiểm cao'}
                      {stat.danger_level === 'medium' && 'Nguy hiểm trung bình'}
                      {stat.danger_level === 'low' && 'Nguy hiểm thấp'}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm">
                      {getTrendIcon(stat.recent_trend)}
                      <span className="text-gray-600">{getTrendText(stat.recent_trend)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{stat.frequency_score}</div>
                    <div className="text-sm text-gray-600">Điểm tần suất</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{stat.damage_score}</div>
                    <div className="text-sm text-gray-600">Điểm thiệt hại</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stat.total_reports.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Số báo cáo</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🚨 Dấu hiệu cảnh báo:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {stat.warning_signs.map((sign, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🛡️ Cách phòng chống:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {stat.prevention_tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Warning Note */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">Lưu ý quan trọng</h4>
                <p className="text-sm text-yellow-700">
                  Dữ liệu này được thu thập từ báo cáo của cộng đồng và các cơ quan chức năng. 
                  Hãy luôn cảnh giác và cập nhật thông tin mới nhất để bảo vệ bản thân.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScamRankings;
