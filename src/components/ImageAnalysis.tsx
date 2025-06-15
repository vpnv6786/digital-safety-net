
import React, { useState } from 'react';
import { Upload, Image, AlertTriangle, CheckCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { analyzeScamImage } from '@/services/aiService';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImageAnalysisResult {
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  confidence: number;
  reasons: string[];
  aiAnalysis: string;
  extractedInfo: string[];
}

const ImageAnalysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const { t } = useLanguage();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeScamImage(selectedFile);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Image analysis failed:', error);
      setAnalysisResult({
        riskLevel: 'safe',
        confidence: 0,
        reasons: ['Analysis failed'],
        aiAnalysis: 'Unable to analyze image',
        extractedInfo: []
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setAnalysisResult(null);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'dangerous': return 'text-red-600 bg-red-50 border-red-200';
      case 'suspicious': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'dangerous': return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'suspicious': return <AlertTriangle className="w-6 h-6 text-orange-600" />;
      default: return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Image className="w-6 h-6 mr-2 text-blue-500" />
          {t('image.analysis.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedFile ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{t('image.upload.instruction')}</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="imageUpload"
            />
            <label htmlFor="imageUpload">
              <Button variant="outline" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {t('image.upload.button')}
              </Button>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={previewUrl!}
                alt="Preview"
                className="w-full max-h-96 object-contain rounded-lg border"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={clearImage}
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('image.analyzing')}
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {t('image.analyze.button')}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={clearImage}>
                {t('image.clear')}
              </Button>
            </div>
          </div>
        )}

        {analysisResult && (
          <div className="space-y-4">
            <Alert className={`border-2 ${getRiskColor(analysisResult.riskLevel)}`}>
              <div className="flex items-center space-x-3">
                {getRiskIcon(analysisResult.riskLevel)}
                <div className="flex-1">
                  <div className="font-semibold text-lg">
                    {analysisResult.riskLevel === 'dangerous' && t('results.risk.dangerous')}
                    {analysisResult.riskLevel === 'suspicious' && t('results.risk.suspicious')}
                    {analysisResult.riskLevel === 'safe' && t('results.risk.safe')}
                  </div>
                  <div className="text-sm opacity-75">
                    {t('results.confidence')}: {analysisResult.confidence}%
                  </div>
                </div>
              </div>
            </Alert>

            <div className="grid gap-4">
              <div>
                <h4 className="font-semibold mb-2">{t('image.analysis.details')}</h4>
                <p className="text-gray-700 text-sm">{analysisResult.aiAnalysis}</p>
              </div>

              {analysisResult.reasons.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">{t('results.reasons')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.reasons.map((reason, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {analysisResult.extractedInfo.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">{t('image.extracted.info')}</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {analysisResult.extractedInfo.map((info, index) => (
                      <div key={index} className="text-sm font-mono bg-white px-2 py-1 rounded mb-1">
                        {info}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageAnalysis;
