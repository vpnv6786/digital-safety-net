import React, { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle, AlertTriangle, Phone, CreditCard, Globe, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { submitReport } from '@/services/searchService';

interface ReportFormProps {
  onBack: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    targetType: '',
    targetValue: '',
    scamCategory: '',
    description: '',
    evidenceFiles: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();

  const targetTypes = [
    { id: 'phone', label: t('report.step1.phone'), icon: Phone, description: t('report.step1.phone.desc') },
    { id: 'bank_account', label: t('report.step1.bank'), icon: CreditCard, description: t('report.step1.bank.desc') },
    { id: 'url', label: t('report.step1.url'), icon: Globe, description: t('report.step1.url.desc') },
    { id: 'other', label: t('report.step1.other'), icon: HelpCircle, description: t('report.step1.other.desc') }
  ];

  const scamCategories = [
    t('report.categories.fake.police'),
    t('report.categories.bank.fraud'),
    t('report.categories.job.scam'),
    t('report.categories.investment'),
    t('report.categories.online.shopping'),
    t('report.categories.telecom.fraud'),
    t('report.categories.fake.promotion'),
    t('report.categories.other')
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData({ ...formData, evidenceFiles: [...formData.evidenceFiles, ...files] });
  };

  const removeFile = (index: number) => {
    const newFiles = formData.evidenceFiles.filter((_, i) => i !== index);
    setFormData({ ...formData, evidenceFiles: newFiles });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Use the enhanced report submission with AI analysis
      const result = await submitReport(formData);
      
      if (result.success) {
        console.log('Report submitted successfully:', result.reportId);
        if (result.aiInsights) {
          console.log('AI Insights:', result.aiInsights);
        }
        setIsSubmitted(true);
      } else {
        alert('Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Report submission failed:', error);
      alert('An error occurred while submitting the report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = (step: number) => {
    switch (step) {
      case 1: return formData.targetType !== '';
      case 2: return formData.targetValue.trim() !== '';
      case 3: return formData.scamCategory !== '' && formData.description.trim() !== '';
      default: return true;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light to-white font-be-vietnam flex items-center justify-center">
        <Card className="max-w-md mx-4 text-center animate-shield-build">
          <CardContent className="pt-8">
            <div className="w-20 h-20 bg-safe-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-safe-green" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('report.success.title')}</h2>
            <p className="text-gray-600 mb-6">
              {t('report.success.message')}
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={onBack} className="bg-trust-blue hover:bg-trust-blue-dark">
                {t('report.success.home')}
              </Button>
              <Button variant="outline" onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
                setFormData({
                  targetType: '',
                  targetValue: '',
                  scamCategory: '',
                  description: '',
                  evidenceFiles: []
                });
              }}>
                {t('report.success.report.another')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            {t('results.back')}
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    ${currentStep >= step ? 'bg-trust-blue text-white' : 'bg-gray-200 text-gray-500'}
                  `}
                >
                  {step}
                </div>
              ))}
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('report.title')}</h1>
          <p className="text-gray-600">{t('report.subtitle')}</p>
          <div className="mt-2 text-xs text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full">
            🤖 AI-enhanced report analysis
          </div>
        </div>

        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-warning-orange mr-2" />
              {currentStep === 1 && t('report.step1.title')}
              {currentStep === 2 && t('report.step2.title')}
              {currentStep === 3 && t('report.step3.title')}
              {currentStep === 4 && t('report.step4.title')}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {/* Step 1: Target Type */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-gray-600 mb-6">{t('report.step1.question')}</p>
                <div className="grid gap-4">
                  {targetTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={type.id}
                        onClick={() => setFormData({ ...formData, targetType: type.id })}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md
                          ${formData.targetType === type.id 
                            ? 'border-trust-blue bg-trust-blue/5' 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className={`w-6 h-6 ${formData.targetType === type.id ? 'text-trust-blue' : 'text-gray-400'}`} />
                          <div>
                            <div className="font-semibold">{type.label}</div>
                            <div className="text-sm text-gray-500">{type.description}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Target Value */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Label htmlFor="targetValue" className="text-lg font-semibold">
                  {formData.targetType === 'phone' && t('report.step2.phone.label')}
                  {formData.targetType === 'bank_account' && t('report.step2.bank.label')}
                  {formData.targetType === 'url' && t('report.step2.url.label')}
                  {formData.targetType === 'other' && t('report.step2.other.label')}
                </Label>
                <Input
                  id="targetValue"
                  type="text"
                  placeholder={
                    formData.targetType === 'phone' ? t('report.step2.phone.placeholder') :
                    formData.targetType === 'bank_account' ? t('report.step2.bank.placeholder') :
                    formData.targetType === 'url' ? t('report.step2.url.placeholder') :
                    t('report.step2.other.placeholder')
                  }
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  className="text-lg py-3"
                />
                <p className="text-sm text-gray-500">
                  {t('report.step2.privacy')}
                </p>
              </div>
            )}

            {/* Step 3: Description */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="category" className="text-lg font-semibold mb-3 block">
                    {t('report.step3.category.label')}
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {scamCategories.map((category) => (
                      <Button
                        key={category}
                        variant={formData.scamCategory === category ? "default" : "outline"}
                        onClick={() => setFormData({ ...formData, scamCategory: category })}
                        className={`justify-start h-auto py-3 ${
                          formData.scamCategory === category 
                            ? 'bg-trust-blue hover:bg-trust-blue-dark' 
                            : 'border-gray-200 hover:border-trust-blue hover:text-trust-blue'
                        }`}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-lg font-semibold mb-3 block">
                    {t('report.step3.description.label')}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={t('report.step3.description.placeholder')}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-32 text-base"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {t('report.step3.description.tip')}
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Evidence */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-semibold mb-3 block">
                    {t('report.step4.upload.label')}
                  </Label>
                  <p className="text-gray-600 mb-4">
                    {t('report.step4.upload.description')}
                  </p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-trust-blue transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">{t('report.step4.upload.instruction')}</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="fileUpload"
                    />
                    <Label htmlFor="fileUpload">
                      <Button variant="outline" className="cursor-pointer">
                        {t('report.step4.upload.button')}
                      </Button>
                    </Label>
                  </div>

                  {formData.evidenceFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label className="font-semibold">{t('report.step4.files.selected')}</Label>
                      {formData.evidenceFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            {t('report.step4.remove')}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-trust-blue/5 border border-trust-blue/20 rounded-lg p-4">
                  <h4 className="font-semibold text-trust-blue mb-2">{t('report.step4.privacy.title')}</h4>
                  <p className="text-sm text-gray-600">
                    {t('report.step4.privacy.message')}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="border-trust-blue text-trust-blue hover:bg-trust-blue hover:text-white"
              >
                {t('report.navigation.back')}
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed(currentStep)}
                  className="bg-trust-blue hover:bg-trust-blue-dark"
                >
                  {t('report.navigation.continue')}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canProceed(currentStep)}
                  className="bg-warning-orange hover:bg-orange-600"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t('report.navigation.submitting')}
                    </div>
                  ) : (
                    t('report.navigation.submit')
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportForm;
