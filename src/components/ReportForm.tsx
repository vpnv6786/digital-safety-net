
import React, { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle, AlertTriangle, Phone, CreditCard, Globe, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

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

  const targetTypes = [
    { id: 'phone', label: 'Số điện thoại', icon: Phone, description: 'Số điện thoại lừa đảo' },
    { id: 'bank_account', label: 'Tài khoản ngân hàng', icon: CreditCard, description: 'STK hoặc thông tin ngân hàng' },
    { id: 'url', label: 'Website/Link', icon: Globe, description: 'Trang web hoặc đường link lừa đảo' },
    { id: 'other', label: 'Khác', icon: HelpCircle, description: 'Hình thức lừa đảo khác' }
  ];

  const scamCategories = [
    'Giả danh công an',
    'Lừa đảo ngân hàng',
    'Việc làm online',
    'Đầu tư tài chính',
    'Mua bán online',
    'Giả danh nhân viên viễn thông',
    'Khuyến mãi giả',
    'Khác'
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
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Báo cáo đã được gửi!</h2>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã góp phần bảo vệ cộng đồng. Báo cáo của bạn sẽ được xem xét và xác minh trong thời gian sớm nhất.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={onBack} className="bg-trust-blue hover:bg-trust-blue-dark">
                Về trang chủ
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
                Báo cáo khác
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
            Quay lại
          </Button>
          
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
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Báo cáo Lừa đảo</h1>
          <p className="text-gray-600">Giúp cộng đồng bằng cách chia sẻ thông tin về lừa đảo</p>
        </div>

        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-warning-orange mr-2" />
              {currentStep === 1 && "Loại thông tin muốn báo cáo"}
              {currentStep === 2 && "Thông tin chi tiết"}
              {currentStep === 3 && "Mô tả sự việc"}
              {currentStep === 4 && "Bằng chứng (tùy chọn)"}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {/* Step 1: Target Type */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-gray-600 mb-6">Bạn muốn báo cáo về loại thông tin nào?</p>
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
                  {formData.targetType === 'phone' && 'Nhập số điện thoại'}
                  {formData.targetType === 'bank_account' && 'Nhập số tài khoản ngân hàng'}
                  {formData.targetType === 'url' && 'Nhập website hoặc link'}
                  {formData.targetType === 'other' && 'Mô tả thông tin cần báo cáo'}
                </Label>
                <Input
                  id="targetValue"
                  type="text"
                  placeholder={
                    formData.targetType === 'phone' ? 'VD: 0123456789' :
                    formData.targetType === 'bank_account' ? 'VD: 1234567890' :
                    formData.targetType === 'url' ? 'VD: https://example.com' :
                    'VD: Tên công ty, địa chỉ email...'
                  }
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  className="text-lg py-3"
                />
                <p className="text-sm text-gray-500">
                  Thông tin này sẽ được bảo mật và chỉ sử dụng để cảnh báo cộng đồng
                </p>
              </div>
            )}

            {/* Step 3: Description */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="category" className="text-lg font-semibold mb-3 block">
                    Loại lừa đảo
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
                    Mô tả chi tiết sự việc
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Hãy mô tả những gì đã xảy ra: họ nói gì, yêu cầu gì, thời gian diễn ra..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-32 text-base"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Càng chi tiết càng giúp cảnh báo hiệu quả hơn
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Evidence */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-semibold mb-3 block">
                    Tải lên bằng chứng
                  </Label>
                  <p className="text-gray-600 mb-4">
                    Ảnh chụp màn hình tin nhắn, cuộc gọi, hoặc bất kỳ bằng chứng nào khác (không bắt buộc)
                  </p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-trust-blue transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Kéo thả file vào đây hoặc click để chọn</p>
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
                        Chọn file
                      </Button>
                    </Label>
                  </div>

                  {formData.evidenceFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label className="font-semibold">File đã chọn:</Label>
                      {formData.evidenceFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            Xóa
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-trust-blue/5 border border-trust-blue/20 rounded-lg p-4">
                  <h4 className="font-semibold text-trust-blue mb-2">Cam kết bảo mật</h4>
                  <p className="text-sm text-gray-600">
                    Mọi thông tin và bằng chứng bạn cung cấp sẽ được bảo mật tuyệt đối. 
                    Chúng tôi chỉ sử dụng để xác minh và cảnh báo cộng đồng mà không tiết lộ danh tính của bạn.
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
                Quay lại
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed(currentStep)}
                  className="bg-trust-blue hover:bg-trust-blue-dark"
                >
                  Tiếp tục
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
                      Đang gửi...
                    </div>
                  ) : (
                    'Gửi báo cáo'
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
