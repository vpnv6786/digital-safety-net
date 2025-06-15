
import React, { useState, useEffect } from 'react';
import { Shield, MapPin, Clock, AlertTriangle, Battery, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { locationService } from '@/services/locationService';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import EmergencyButton from './EmergencyButton';
import EmergencyContactsManager from './EmergencyContactsManager';

const SafetyDashboard = () => {
  const { language } = useLanguage();
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [nearbyDangers, setNearbyDangers] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check if tracking is already active
    checkTrackingStatus();
    
    // Get current location for display
    getCurrentLocation();
    
    // Get battery level
    getBatteryLevel();
  }, []);

  const checkTrackingStatus = () => {
    // Check if geolocation permission is granted
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setIsTracking(result.state === 'granted');
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const getBatteryLevel = async () => {
    try {
      // @ts-ignore - Battery API might not be available in all browsers
      if ('getBattery' in navigator) {
        // @ts-ignore
        const battery = await navigator.getBattery();
        setBatteryLevel(Math.round(battery.level * 100));
      }
    } catch (error) {
      console.log('Battery API not available');
    }
  };

  const handleToggleTracking = async () => {
    if (!isTracking) {
      const success = await locationService.startTracking();
      if (success) {
        setIsTracking(true);
        toast({
          title: language === 'en' ? "GPS tracking enabled" : "Đã bật theo dõi GPS",
          description: language === 'en' 
            ? "System will monitor location and alert about dangerous areas"
            : "Hệ thống sẽ giám sát vị trí và cảnh báo khu vực nguy hiểm",
        });
      } else {
        toast({
          title: language === 'en' ? "Cannot enable GPS" : "Không thể bật GPS",
          description: language === 'en' 
            ? "Please allow location access in browser"
            : "Vui lòng cho phép truy cập vị trí trong trình duyệt",
          variant: "destructive",
        });
      }
    } else {
      locationService.stopTracking();
      setIsTracking(false);
      toast({
        title: language === 'en' ? "GPS tracking disabled" : "Đã tắt theo dõi GPS",
        description: language === 'en' 
          ? "System stopped monitoring location"
          : "Hệ thống ngừng giám sát vị trí",
      });
    }
  };

  const formatLocation = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'en' ? '🛡️ Safety Dashboard' : '🛡️ Bảng điều khiển an toàn'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Monitor location and receive alerts about dangerous areas'
              : 'Theo dõi vị trí và nhận cảnh báo về khu vực nguy hiểm'
            }
          </p>
        </div>

        {/* Main Controls */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* GPS Tracking Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="w-5 h-5 mr-2" />
                {language === 'en' ? 'GPS Tracking' : 'Theo dõi GPS'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tracking-switch">
                    {language === 'en' ? 'Enable location tracking' : 'Bật theo dõi vị trí'}
                  </Label>
                  <Switch
                    id="tracking-switch"
                    checked={isTracking}
                    onCheckedChange={handleToggleTracking}
                  />
                </div>
                
                <div className="text-sm text-gray-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {currentLocation 
                        ? `${language === 'en' ? 'Location:' : 'Vị trí:'} ${formatLocation(currentLocation.lat, currentLocation.lng)}`
                        : (language === 'en' ? 'No location available' : 'Chưa có vị trí')
                      }
                    </span>
                  </div>
                  
                  {batteryLevel !== null && (
                    <div className="flex items-center space-x-2">
                      <Battery className="w-4 h-4" />
                      <span>{language === 'en' ? 'Battery:' : 'Pin:'} {batteryLevel}%</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm">
                    {isTracking 
                      ? (language === 'en' ? 'Tracking active' : 'Đang theo dõi')
                      : (language === 'en' ? 'Tracking disabled' : 'Đã tắt')
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Button */}
          <EmergencyButton />
        </div>

        {/* Safety Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              {language === 'en' ? 'Safety Status' : 'Tình trạng an toàn'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-medium">
                  {language === 'en' ? 'Safe Area' : 'Khu vực an toàn'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'No dangers detected' : 'Không phát hiện nguy hiểm'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-medium">
                  {language === 'en' ? 'Safe Hours' : 'Giờ an toàn'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Current time is safe' : 'Thời gian hiện tại an toàn'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-medium">
                  {language === 'en' ? 'Alert Ready' : 'Sẵn sàng cảnh báo'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'System is monitoring' : 'Hệ thống đang giám sát'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zones Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {language === 'en' ? 'Nearby Danger Zones' : 'Khu vực nguy hiểm gần đây'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-800">
                    {language === 'en' ? 'Train station area at night' : 'Khu vực ga tàu lúc đêm'}
                  </h4>
                  <p className="text-sm text-red-600">
                    {language === 'en' ? 'High danger from 22:00 - 05:00' : 'Nguy hiểm cao từ 22:00 - 05:00'}
                  </p>
                  <p className="text-xs text-red-500">
                    {language === 'en' ? 'Radius: 500m' : 'Bán kính: 500m'}
                  </p>
                </div>
                <Badge variant="destructive">
                  {language === 'en' ? 'High' : 'Cao'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-yellow-800">
                    {language === 'en' ? 'Remote industrial area' : 'Khu công nghiệp xa xôi'}
                  </h4>
                  <p className="text-sm text-yellow-600">
                    {language === 'en' ? 'Medium danger from 20:00 - 06:00' : 'Nguy hiểm trung bình từ 20:00 - 06:00'}
                  </p>
                  <p className="text-xs text-yellow-500">
                    {language === 'en' ? 'Radius: 1000m' : 'Bán kính: 1000m'}
                  </p>
                </div>
                <Badge variant="secondary">
                  {language === 'en' ? 'Medium' : 'Trung bình'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-orange-800">
                    {language === 'en' ? 'Port area at night' : 'Khu vực cầu cảng đêm'}
                  </h4>
                  <p className="text-sm text-orange-600">
                    {language === 'en' ? 'High danger from 21:00 - 05:30' : 'Nguy hiểm cao từ 21:00 - 05:30'}
                  </p>
                  <p className="text-xs text-orange-500">
                    {language === 'en' ? 'Radius: 800m' : 'Bán kính: 800m'}
                  </p>
                </div>
                <Badge variant="destructive">
                  {language === 'en' ? 'High' : 'Cao'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts Manager */}
        <EmergencyContactsManager />

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Usage Instructions' : 'Hướng dẫn sử dụng'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p>
                  <strong>
                    {language === 'en' ? 'Enable GPS tracking:' : 'Bật theo dõi GPS:'}
                  </strong>{' '}
                  {language === 'en' 
                    ? 'Allow app to access location for danger zone alerts'
                    : 'Cho phép ứng dụng truy cập vị trí để nhận cảnh báo khu vực nguy hiểm'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p>
                  <strong>
                    {language === 'en' ? 'Add contacts:' : 'Thêm người liên hệ:'}
                  </strong>{' '}
                  {language === 'en' 
                    ? 'Add people who will receive notifications in emergency'
                    : 'Thêm những người sẽ nhận thông báo khi bạn gặp khẩn cấp'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p>
                  <strong>
                    {language === 'en' ? 'Emergency button:' : 'Nút khẩn cấp:'}
                  </strong>{' '}
                  {language === 'en' 
                    ? 'Press and hold for 3 seconds to send alert to contacts'
                    : 'Nhấn và giữ 3 giây để gửi cảnh báo đến những người liên hệ'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p>
                  <strong>
                    {language === 'en' ? 'Automatic alerts:' : 'Cảnh báo tự động:'}
                  </strong>{' '}
                  {language === 'en' 
                    ? 'System will automatically alert when entering danger zones'
                    : 'Hệ thống sẽ tự động cảnh báo khi bạn đi vào khu vực nguy hiểm'
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

export default SafetyDashboard;
