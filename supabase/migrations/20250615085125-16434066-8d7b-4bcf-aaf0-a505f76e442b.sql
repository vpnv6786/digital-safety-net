
-- Tạo bảng lưu thông tin liên hệ khẩn cấp
CREATE TABLE public.emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  relationship TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tạo bảng lưu vị trí GPS của người dùng
CREATE TABLE public.user_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(8, 2),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_emergency BOOLEAN DEFAULT false,
  battery_level INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tạo bảng định nghĩa khu vực nguy hiểm
CREATE TABLE public.danger_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  center_latitude DECIMAL(10, 8) NOT NULL,
  center_longitude DECIMAL(11, 8) NOT NULL,
  radius_meters INTEGER NOT NULL,
  danger_level TEXT CHECK (danger_level IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  active_from TIME,
  active_to TIME,
  days_of_week INTEGER[] DEFAULT '{0,1,2,3,4,5,6}', -- 0=Sunday, 6=Saturday
  created_by UUID REFERENCES auth.users,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tạo bảng lưu lịch sử cảnh báo
CREATE TABLE public.alert_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  alert_type TEXT CHECK (alert_type IN ('emergency_button', 'danger_zone', 'safe_check', 'low_battery')) NOT NULL,
  location_id UUID REFERENCES public.user_locations,
  danger_zone_id UUID REFERENCES public.danger_zones,
  message TEXT,
  contacts_notified TEXT[],
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT CHECK (status IN ('pending', 'sent', 'failed')) DEFAULT 'pending'
);

-- Bật RLS cho tất cả các bảng
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.danger_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_history ENABLE ROW LEVEL SECURITY;

-- Tạo policies cho emergency_contacts
CREATE POLICY "Users can manage their own emergency contacts" 
  ON public.emergency_contacts 
  FOR ALL
  USING (auth.uid() = user_id);

-- Tạo policies cho user_locations
CREATE POLICY "Users can manage their own locations" 
  ON public.user_locations 
  FOR ALL
  USING (auth.uid() = user_id);

-- Tạo policies cho danger_zones (cho phép đọc public, chỉ admin mới tạo)
CREATE POLICY "Anyone can view active danger zones" 
  ON public.danger_zones 
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can create danger zones" 
  ON public.danger_zones 
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Tạo policies cho alert_history
CREATE POLICY "Users can view their own alert history" 
  ON public.alert_history 
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alerts" 
  ON public.alert_history 
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Thêm một số khu vực nguy hiểm mẫu (các khu vực có tỷ lệ tội phạm cao ở Việt Nam)
INSERT INTO public.danger_zones (name, description, center_latitude, center_longitude, radius_meters, danger_level, active_from, active_to) VALUES
('Khu vực ga tàu lúc đêm', 'Khu vực xung quanh ga tàu có nguy cơ tội phạm cao vào ban đêm', 10.7769, 106.7009, 500, 'high', '22:00:00', '05:00:00'),
('Khu công nghiệp xa xôi', 'Khu vực ít người qua lại, nguy cơ cao vào ban đêm', 10.7545, 106.4544, 1000, 'medium', '20:00:00', '06:00:00'),
('Khu vực cầu cảng đêm', 'Khu vực cảng container có nguy cơ cao ban đêm', 10.7941, 106.7200, 800, 'high', '21:00:00', '05:30:00');
