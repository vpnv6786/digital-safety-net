import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Phone, Key, ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import TranslatedText from './TranslatedText';

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage = ({ onBack }: AuthPageProps) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [method, setMethod] = useState<'phone' | 'email' | 'social'>('phone');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { language } = useLanguage();

  const formatPhoneNumber = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '+84' + cleaned.substring(1);
    }
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
        options: { channel: 'sms' }
      });

      if (error) throw error;
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

      if (error) throw error;
      toast.success('Đăng nhập thành công!');
      onBack();
    } catch (error: any) {
      console.error('OTP verify error:', error);
      setError(error.message || 'Mã OTP không đúng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl }
        });
        if (error) throw error;
        toast.success('Vui lòng kiểm tra email để xác thực tài khoản');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast.success('Đăng nhập thành công!');
        onBack();
      }
    } catch (error: any) {
      console.error('Email auth error:', error);
      setError(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    setError('');

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Social auth error:', error);
      setError(error.message || 'Không thể đăng nhập. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('input');
      setOtp('');
      setError('');
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-md mx-auto pt-20">
        <Button variant="ghost" onClick={handleBack} className="mb-4 text-gray-600">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <TranslatedText>{language === 'en' ? 'Back' : 'Quay lại'}</TranslatedText>
        </Button>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              ScamGuard
            </CardTitle>
            <CardDescription className="text-gray-600">
              <TranslatedText>
                {step === 'otp' 
                  ? (language === 'en' ? 'Verify OTP Code' : 'Xác thực mã OTP')
                  : authMode === 'signin' 
                    ? (language === 'en' ? 'Sign in to your account' : 'Đăng nhập tài khoản')
                    : (language === 'en' ? 'Create new account' : 'Tạo tài khoản mới')
                }
              </TranslatedText>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 'input' ? (
              <>
                {/* Auth Mode Toggle */}
                <div className="flex rounded-lg border p-1">
                  <Button
                    variant={authMode === 'signin' ? 'default' : 'ghost'}
                    onClick={() => setAuthMode('signin')}
                    className="flex-1"
                  >
                    <TranslatedText>{language === 'en' ? 'Sign In' : 'Đăng nhập'}</TranslatedText>
                  </Button>
                  <Button
                    variant={authMode === 'signup' ? 'default' : 'ghost'}
                    onClick={() => setAuthMode('signup')}
                    className="flex-1"
                  >
                    <TranslatedText>{language === 'en' ? 'Sign Up' : 'Đăng ký'}</TranslatedText>
                  </Button>
                </div>

                {/* Method Selection */}
                <div className="flex rounded-lg border p-1">
                  <Button
                    variant={method === 'phone' ? 'default' : 'ghost'}
                    onClick={() => setMethod('phone')}
                    className="flex-1 text-xs"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    <TranslatedText>{language === 'en' ? 'Phone' : 'SĐT'}</TranslatedText>
                  </Button>
                  <Button
                    variant={method === 'email' ? 'default' : 'ghost'}
                    onClick={() => setMethod('email')}
                    className="flex-1 text-xs"
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                  <Button
                    variant={method === 'social' ? 'default' : 'ghost'}
                    onClick={() => setMethod('social')}
                    className="flex-1 text-xs"
                  >
                    Social
                  </Button>
                </div>

                {/* Phone Method */}
                {method === 'phone' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        <TranslatedText>{language === 'en' ? 'Phone Number' : 'Số điện thoại'}</TranslatedText>
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
                    </div>
                    <Button onClick={handleSendOTP} disabled={loading} className="w-full">
                      <TranslatedText>
                        {loading 
                          ? (language === 'en' ? 'Sending...' : 'Đang gửi...')
                          : (language === 'en' ? 'Send OTP' : 'Gửi mã OTP')
                        }
                      </TranslatedText>
                    </Button>
                  </>
                )}

                {/* Email Method */}
                {method === 'email' && (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          <TranslatedText>{language === 'en' ? 'Password' : 'Mật khẩu'}</TranslatedText>
                        </label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <Button onClick={handleEmailAuth} disabled={loading} className="w-full">
                      <TranslatedText>
                        {loading 
                          ? (language === 'en' ? 'Processing...' : 'Đang xử lý...')
                          : authMode === 'signin' 
                            ? (language === 'en' ? 'Sign In' : 'Đăng nhập')
                            : (language === 'en' ? 'Sign Up' : 'Đăng ký')
                        }
                      </TranslatedText>
                    </Button>
                  </>
                )}

                {/* Social Method */}
                {method === 'social' && (
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleSocialAuth('google')}
                      disabled={loading}
                      variant="outline"
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <span>🔍</span>
                      <TranslatedText>{language === 'en' ? 'Continue with Google' : 'Tiếp tục với Google'}</TranslatedText>
                    </Button>
                    <Button
                      onClick={() => handleSocialAuth('facebook')}
                      disabled={loading}
                      variant="outline"
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <span>📘</span>
                      <TranslatedText>{language === 'en' ? 'Continue with Facebook' : 'Tiếp tục với Facebook'}</TranslatedText>
                    </Button>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              // OTP Step
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    <TranslatedText>{language === 'en' ? 'OTP Code' : 'Mã OTP'}</TranslatedText>
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
                    <TranslatedText>
                      {language === 'en' 
                        ? `Enter the 6-digit code sent to ${phone}`
                        : `Nhập mã 6 số được gửi đến ${phone}`
                      }
                    </TranslatedText>
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
                    className="w-full"
                  >
                    <TranslatedText>
                      {loading 
                        ? (language === 'en' ? 'Verifying...' : 'Đang xác thực...')
                        : (language === 'en' ? 'Verify OTP' : 'Xác thực OTP')
                      }
                    </TranslatedText>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStep('input')}
                    disabled={loading}
                    className="w-full"
                  >
                    <TranslatedText>{language === 'en' ? 'Resend Code' : 'Gửi lại mã'}</TranslatedText>
                  </Button>
                </div>
              </>
            )}

            <div className="text-center pt-4">
              <p className="text-xs text-gray-500">
                <TranslatedText>
                  {language === 'en' 
                    ? 'By signing in, you agree to our Terms of Service'
                    : 'Bằng cách đăng nhập, bạn đồng ý với Điều khoản sử dụng của chúng tôi'
                  }
                </TranslatedText>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
