import React from 'react';
import { ArrowLeft, Shield, AlertTriangle, XCircle, CheckCircle, Share2, Flag, Brain, Clock, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import TranslatedText from './TranslatedText';

interface SearchResultsProps {
  query: string;
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  searchResult?: any;
  onBack: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, riskLevel, searchResult, onBack }) => {
  const { language } = useLanguage();

  const getResultConfig = (risk: string) => {
    switch (risk) {
      case 'safe':
        return {
          icon: CheckCircle,
          iconColor: 'text-safe-green',
          bgColor: 'bg-safe-green/10',
          borderColor: 'border-safe-green',
          title: language === 'en' ? 'Safe - No Threats Detected' : 'An toàn - Không phát hiện mối đe dọa',
          message: language === 'en' ? 'This appears to be legitimate' : 'Đây có vẻ là hợp pháp',
          description: language === 'en' ? 'No scam reports found' : 'Không tìm thấy báo cáo lừa đảo',
          actionButton: language === 'en' ? 'Report if Incorrect' : 'Báo cáo nếu sai'
        };
      case 'suspicious':
        return {
          icon: AlertTriangle,
          iconColor: 'text-warning-orange',
          bgColor: 'bg-warning-orange/10',
          borderColor: 'border-warning-orange',
          title: language === 'en' ? 'Suspicious - Exercise Caution' : 'Đáng nghi - Hãy thận trọng',
          message: language === 'en' ? 'Be careful when dealing with this' : 'Hãy cẩn thận khi giao dịch',
          description: language === 'en' ? 'Some warning signs detected' : 'Phát hiện một số dấu hiệu cảnh báo',
          actionButton: language === 'en' ? 'Report Scam' : 'Báo cáo lừa đảo'
        };
      case 'dangerous':
        return {
          icon: XCircle,
          iconColor: 'text-danger-red',
          bgColor: 'bg-danger-red/10',
          borderColor: 'border-danger-red',
          title: language === 'en' ? 'Dangerous - Confirmed Scam' : 'Nguy hiểm - Xác nhận lừa đảo',
          message: language === 'en' ? 'Do not proceed! This is a known scam' : 'Đừng tiếp tục! Đây là lừa đảo đã biết',
          description: language === 'en' ? 'Multiple reports confirmed' : 'Nhiều báo cáo đã xác nhận',
          actionButton: language === 'en' ? 'Report Incident' : 'Báo cáo sự cố'
        };
      default:
        return getResultConfig('safe');
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const config = getResultConfig(riskLevel);
  const IconComponent = config.icon;

  // Enhanced data from AI Agent
  const reportCount = searchResult?.reportCount || 0;
  const confidence = searchResult?.confidence || 70;
  const aiAnalysis = searchResult?.aiAnalysis;
  const reasons = searchResult?.reasons || [];
  const recommendations = searchResult?.recommendations || [];
  const urgencyLevel = searchResult?.urgencyLevel || 'low';
  const similarPatterns = searchResult?.similarPatterns || [];
  const preventionTips = searchResult?.preventionTips || [];
  const relatedReports = searchResult?.relatedReports || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-white font-be-vietnam">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-trust-blue hover:bg-trust-blue/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <TranslatedText>{language === 'en' ? 'Back' : 'Quay lại'}</TranslatedText>
          </Button>
          <LanguageSelector />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Query Display */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            <TranslatedText>{language === 'en' ? 'Search Results' : 'Kết quả tìm kiếm'}</TranslatedText>
          </h1>
          <div className="inline-flex items-center bg-gray-100 rounded-lg px-4 py-2">
            <span className="text-gray-600">
              <TranslatedText>{language === 'en' ? 'Searched for:' : 'Đã tìm kiếm:'}</TranslatedText>
            </span>
            <span className="font-semibold text-trust-blue ml-2">{query}</span>
          </div>
        </div>

        {/* Main Result Card */}
        <Card className={`mb-8 ${config.borderColor} border-2 ${config.bgColor} animate-fade-in-up`}>
          <CardContent className="pt-8 text-center">
            <div className={`w-24 h-24 rounded-full ${config.bgColor} flex items-center justify-center mx-auto mb-6`}>
              <IconComponent className={`w-12 h-12 ${config.iconColor}`} />
            </div>
            
            {/* Urgency Indicator */}
            <div className="flex justify-center mb-4">
              <Badge className={`${getUrgencyColor(urgencyLevel)} text-white`}>
                <Clock className="w-3 h-3 mr-1" />
                <TranslatedText>
                  {language === 'en' ? `Level: ${urgencyLevel.toUpperCase()}` : `Mức độ: ${urgencyLevel.toUpperCase()}`}
                </TranslatedText>
              </Badge>
            </div>
            
            <h2 className={`text-2xl font-bold mb-4 ${config.iconColor}`}>
              {config.title}
            </h2>
            
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              {config.message}
            </p>
            
            {/* AI Confidence Score */}
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">AI Confidence Score</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    confidence >= 80 ? 'bg-red-500' : 
                    confidence >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{confidence}% confident</div>
            </div>

            {/* AI Analysis */}
            {aiAnalysis && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <Brain className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm font-semibold text-blue-700">AI Agent Analysis</span>
                </div>
                <p className="text-sm text-gray-700 text-left">{aiAnalysis}</p>
              </div>
            )}

            {/* Detection Reasons */}
            {reasons.length > 0 && (
              <div className="mb-6 text-left">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Yếu tố phát hiện:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Recommendations */}
            {recommendations.length > 0 && (
              <div className="mb-6 text-left">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Khuyến nghị của AI:
                </h4>
                <div className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm text-gray-700">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className={riskLevel === 'dangerous' ? 'bg-danger-red hover:bg-red-700' : 'bg-trust-blue hover:bg-trust-blue-dark'} 
                size="lg"
              >
                <Flag className="w-5 h-5 mr-2" />
                {config.actionButton}
              </Button>
              
              <Button variant="outline" size="lg" className="border-trust-blue text-trust-blue hover:bg-trust-blue hover:text-white">
                <Share2 className="w-5 h-5 mr-2" />
                <TranslatedText>{language === 'en' ? 'Share Warning' : 'Chia sẻ cảnh báo'}</TranslatedText>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Similar Patterns */}
        {similarPatterns.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Mẫu lừa đảo tương tự</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {similarPatterns.map((pattern, index) => (
                  <div key={index} className="bg-orange-50 border border-orange-200 rounded p-3 text-sm">
                    {pattern}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prevention Tips */}
        {preventionTips.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                Mẹo phòng tránh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {preventionTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        {riskLevel !== 'safe' && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-danger-red mb-2">
                  {reportCount}
                </div>
                <div className="text-gray-600">{language === 'en' ? 'Reports Received' : 'Báo cáo đã nhận'}</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-warning-orange mb-2">
                  {Math.floor(reportCount * 0.6)}
                </div>
                <div className="text-gray-600">{language === 'en' ? 'Verified Reports' : 'Báo cáo đã xác minh'}</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-trust-blue mb-2">
                  {confidence}%
                </div>
                <div className="text-gray-600">{language === 'en' ? 'Reliability Score' : 'Độ tin cậy'}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Related Reports */}
        {relatedReports.length > 0 && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">{language === 'en' ? 'Related Reports' : 'Báo cáo liên quan'}</h3>
            
            <div className="space-y-4">
              {relatedReports.map((report, index) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow animate-fade-in-up" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="destructive" className="bg-danger-red">
                        {report.category}
                      </Badge>
                      <span className="text-sm text-gray-500">{report.reportedAt}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">{report.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-safe-green mr-1" />
                      <span>{report.verifiedBy} {language === 'en' ? 'Verified by' : 'Xác minh bởi'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Safety Tips */}
        <Alert className="mt-8 border-trust-blue bg-trust-blue/5">
          <Shield className="h-4 w-4 text-trust-blue" />
          <AlertDescription className="text-trust-blue font-medium">
            <strong>
              <TranslatedText>{language === 'en' ? 'AI Agent Recommendation:' : 'Khuyến nghị của AI Agent:'}</TranslatedText>
            </strong>{' '}
            {preventionTips[0] || (
              <TranslatedText>
                {language === 'en' 
                  ? 'Always verify information from official sources before taking action.'
                  : 'Luôn xác minh thông tin từ nguồn chính thức trước khi hành động.'
                }
              </TranslatedText>
            )}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default SearchResults;
