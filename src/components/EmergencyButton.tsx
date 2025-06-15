
import React, { useState } from 'react';
import { AlertTriangle, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { locationService } from '@/services/locationService';
import { useToast } from '@/hooks/use-toast';

const EmergencyButton = () => {
  const [isActivating, setIsActivating] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const handleEmergencyPress = async () => {
    setIsActivating(true);
    setCountdown(3);

    // 3-second countdown to prevent accidental activation
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          activateEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelEmergency = () => {
    setIsActivating(false);
    setCountdown(0);
    toast({
      title: "Đã hủy",
      description: "Cảnh báo khẩn cấp đã được hủy",
    });
  };

  const activateEmergency = async () => {
    try {
      const success = await locationService.sendEmergencyAlert();
      
      if (success) {
        toast({
          title: "🚨 Cảnh báo đã gửi!",
          description: "Thông báo khẩn cấp đã được gửi đến những người liên hệ",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể gửi cảnh báo khẩn cấp. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Emergency activation failed:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi gửi cảnh báo",
        variant: "destructive",
      });
    } finally {
      setIsActivating(false);
      setCountdown(0);
    }
  };

  if (isActivating) {
    return (
      <Card className="border-red-500 bg-red-50">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-red-700 mb-2">
            Đang kích hoạt cảnh báo khẩn cấp
          </h3>
          <div className="text-3xl font-bold text-red-600 mb-4">
            {countdown}
          </div>
          <Button 
            onClick={cancelEmergency}
            variant="outline"
            className="w-full"
          >
            HỦY CẢNH BÁO
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-500">
      <CardContent className="p-6 text-center">
        <div className="mb-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Cảnh báo khẩn cấp
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Nhấn để gửi thông báo khẩn cấp đến những người liên hệ của bạn
        </p>
        
        <Button 
          onClick={handleEmergencyPress}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3"
          size="lg"
        >
          <Phone className="w-5 h-5 mr-2" />
          KHẨN CẤP
        </Button>
        
        <div className="mt-4 text-xs text-gray-500">
          <MapPin className="w-4 h-4 inline mr-1" />
          Vị trí GPS sẽ được gửi kèm
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyButton;
