
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Phone, Key, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage = ({ onBack }: AuthPageProps) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhoneNumber = (phoneNumber: string) => {
    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add +84 if it starts with 0
    if (cleaned.startsWith('0')) {
      return '+84' + cleaned.substring(1);
    }
    
    // Add +84 if no country code
    if (!cleaned.startsWith('84')) {
      return '+84' + cleaned;
    }
    
    return '+' + cleaned;
  };

  const handleSendOTP = async () => {
    if (!phone) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formattedPhone = formatPhoneNumber(phone);
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          channel: 'sms'
        }
      });

      if (error) {
        throw error;
      }

      setStep('otp');
      toast.success('Mã OTP đã được gửi đến số điện thoại của bạn');
    } catch (error: any) {
      console.error('OTP send error:', error);
      setError(error.message || 'Không thể gửi mã OTP. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Vui lòng nhập mã OTP 6 số');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formattedPhone = formatPhoneNumber(phone);
      
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });

      if (error) {
        throw error;
      }

      toast.success('Đăng nhập thành công!');
      onBack(); // Return to main app
    } catch (error: any) {
      console.error('OTP verify error:', error);
      setError(error.message || 'Mã OTP không đúng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('phone');
      setOtp('');
      setError('');
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-md mx-auto pt-20">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4 text-gray-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Vệ Binh Mạng
            </CardTitle>
            <CardDescription className="text-gray-600">
              {step === 'phone' ? 'Đăng nhập với số điện thoại' : 'Xác thực mã OTP'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 'phone' ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="tel"
                      placeholder="0901234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Chúng tôi sẽ gửi mã xác thực qua SMS
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mã OTP
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="pl-10 text-center text-lg tracking-widest"
                      disabled={loading}
                      maxLength={6}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Nhập mã 6 số được gửi đến {phone}
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setStep('phone')}
                    disabled={loading}
                    className="w-full"
                  >
                    Gửi lại mã
                  </Button>
                </div>
              </>
            )}

            <div className="text-center pt-4">
              <p className="text-xs text-gray-500">
                Bằng cách đăng nhập, bạn đồng ý với{' '}
                <span className="text-blue-600 underline cursor-pointer">
                  Điều khoản sử dụng
                </span>{' '}
                của chúng tôi
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
