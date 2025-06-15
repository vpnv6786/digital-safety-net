
import React, { useState } from 'react';
import { Key, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { translationService } from '@/services/translationService';

interface TranslationSetupProps {
  onClose: () => void;
  onSuccess: () => void;
}

const TranslationSetup: React.FC<TranslationSetupProps> = ({ onClose, onSuccess }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Vui lòng nhập API key');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Test the API key by making a simple translation request
      translationService.setApiKey(apiKey.trim());
      await translationService.translateText('Hello', 'vi');
      
      onSuccess();
      onClose();
    } catch (err) {
      setError('API key không hợp lệ hoặc đã xảy ra lỗi');
      translationService.setApiKey(''); // Clear invalid key
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-blue-600" />
              <CardTitle>Cài đặt Google Translate</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Nhập Google Translate API key để sử dụng chức năng dịch tự động
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Nhập Google Translate API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Alert>
              <AlertDescription>
                <div className="text-sm space-y-2">
                  <p><strong>Cách lấy API key:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Truy cập Google Cloud Console</li>
                    <li>Tạo project hoặc chọn project có sẵn</li>
                    <li>Bật Cloud Translation API</li>
                    <li>Tạo API key trong phần Credentials</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex space-x-2">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Đang kiểm tra...' : 'Lưu API Key'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationSetup;
