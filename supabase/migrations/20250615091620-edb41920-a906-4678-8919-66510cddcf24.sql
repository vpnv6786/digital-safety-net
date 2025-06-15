
-- Thêm các khu vực nguy hiểm mới, đặc biệt là khu vực biên giới Campuchia và các điểm nóng lừa đảo
INSERT INTO public.danger_zones (name, description, center_latitude, center_longitude, radius_meters, danger_level, active_from, active_to) VALUES
-- Khu vực biên giới Campuchia (các khu casino bất hợp pháp)
('Khu vực Tam Thái Tử - Bavet', 'Khu vực casino bất hợp pháp, có nhiều vụ lừa đảo việc làm và bắt cóc', 11.0847, 106.8831, 5000, 'critical', '00:00:00', '23:59:59'),
('Khu vực biên giới Tây Ninh', 'Khu vực có nguy cơ cao về lừa đảo việc làm casino', 11.3254, 106.1110, 3000, 'high', '00:00:00', '23:59:59'),
('Khu vực biên giới An Giang - Campuchia', 'Khu vực có nhiều vụ lừa đảo qua biên giới', 10.7800, 105.1200, 4000, 'high', '00:00:00', '23:59:59'),
('Khu vực Svay Rieng - Poipet', 'Khu vực casino có nhiều vụ bắt cóc người Việt', 11.4167, 102.5667, 6000, 'critical', '00:00:00', '23:59:59'),

-- Các khu vực trong nước có nguy cơ cao
('Khu vực chợ Bến Thành đêm', 'Khu vực có nhiều vụ móc túi và lừa đảo khách du lịch', 10.7724, 106.6988, 300, 'medium', '20:00:00', '06:00:00'),
('Khu vực Chợ Lớn đêm', 'Khu vực có tỷ lệ tội phạm cao vào ban đêm', 10.7546, 106.6520, 800, 'medium', '21:00:00', '05:00:00'),
('Khu vực cầu Sài Gòn', 'Khu vực có nhiều vụ cướp giật vào ban đêm', 10.7626, 106.7035, 400, 'high', '22:00:00', '05:00:00'),
('Khu công nghiệp Vũng Tàu', 'Khu vực xa xôi có nguy cơ an ninh', 10.4493, 107.1561, 1200, 'medium', '20:00:00', '06:00:00'),

-- Các khu vực tập trung lừa đảo online
('Khu vực Tân Phú - trung tâm call center lừa đảo', 'Khu vực có nhiều tổ chức lừa đảo qua điện thoại', 10.8007, 106.6256, 1500, 'high', '08:00:00', '22:00:00'),
('Khu vực Bình Tân - trụ sở lừa đảo đa cấp', 'Khu vực có nhiều công ty đa cấp lừa đảo', 10.7937, 106.6200, 2000, 'medium', '08:00:00', '18:00:00');

-- Tạo bảng thống kê các loại lừa đảo phổ biến
CREATE TABLE public.scam_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scam_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  danger_level TEXT CHECK (danger_level IN ('low', 'medium', 'high', 'critical')) NOT NULL,
  frequency_score INTEGER DEFAULT 0, -- Điểm số về tần suất xuất hiện
  damage_score INTEGER DEFAULT 0, -- Điểm số về mức độ thiệt hại
  total_reports INTEGER DEFAULT 0,
  recent_trend TEXT CHECK (recent_trend IN ('increasing', 'stable', 'decreasing')) DEFAULT 'stable',
  prevention_tips TEXT[],
  warning_signs TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Thêm dữ liệu thống kê các loại lừa đảo phổ biến
INSERT INTO public.scam_statistics (scam_type, title, description, danger_level, frequency_score, damage_score, total_reports, recent_trend, prevention_tips, warning_signs) VALUES
('fake_authority', 'Giả danh cơ quan chức năng', 'Gọi điện tự xưng là công an, viện kiểm sát yêu cầu chuyển tiền để giải quyết vụ án', 'critical', 95, 90, 2847, 'increasing', 
  ARRAY['Không bao giờ chuyển tiền qua điện thoại', 'Liên hệ trực tiếp cơ quan để xác minh', 'Ghi âm cuộc gọi'], 
  ARRAY['Yêu cầu chuyển tiền gấp', 'Đe dọa bắt giam', 'Không cho phép liên hệ người thân']),

('fake_job_casino', 'Lừa đảo việc làm casino Campuchia', 'Tuyển dụng việc làm casino với lương cao, sau đó bắt cóc buộc làm việc', 'critical', 88, 95, 1234, 'increasing',
  ARRAY['Không đi làm việc ở casino nước ngoài', 'Kiểm tra kỹ thông tin công ty', 'Báo cho gia đình khi đi xa'],
  ARRAY['Lương quá cao bất thường', 'Yêu cầu đi ngay lập tức', 'Không cung cấp hợp đồng rõ ràng']),

('fake_bank_website', 'Website ngân hàng giả mạo', 'Tạo website giống ngân hàng thật để đánh cắp thông tin đăng nhập', 'high', 82, 75, 1876, 'stable',
  ARRAY['Kiểm tra URL cẩn thận', 'Chỉ truy cập từ app chính thức', 'Bật xác thực 2 lớp'],
  ARRAY['URL khác lạ', 'Yêu cầu nhập mật khẩu nhiều lần', 'Thiết kế khác thường']),

('fake_online_job', 'Việc làm online lừa đảo', 'Tuyển dụng việc làm online với yêu cầu nộp phí trước', 'high', 78, 60, 3421, 'increasing',
  ARRAY['Không nộp tiền trước khi làm việc', 'Kiểm tra thông tin công ty', 'Gặp mặt trực tiếp'],
  ARRAY['Yêu cầu nộp phí', 'Lương quá cao', 'Không có địa chỉ rõ ràng']),

('fake_investment', 'Đầu tư tài chính lừa đảo', 'Mời gọi đầu tư với lãi suất cao bất thường', 'high', 71, 85, 2156, 'stable',
  ARRAY['Không tin vào lãi suất quá cao', 'Kiểm tra giấy phép kinh doanh', 'Tham khảo chuyên gia'],
  ARRAY['Lãi suất phi thực tế', 'Áp lực đầu tư ngay', 'Không có giấy tờ pháp lý']),

('fake_charity', 'Từ thiện giả mạo', 'Giả mạo các tổ chức từ thiện để quyên góp tiền', 'medium', 65, 45, 987, 'stable',
  ARRAY['Kiểm tra thông tin tổ chức', 'Quyên góp qua kênh chính thức', 'Yêu cầu biên lai'],
  ARRAY['Không có thông tin rõ ràng', 'Thúc ép quyên góp', 'Không cung cấp biên lai']),

('fake_delivery', 'Giao hàng giả mạo', 'Giả danh nhân viên giao hàng để lừa đảo', 'medium', 58, 40, 1543, 'decreasing',
  ARRAY['Xác minh đơn hàng', 'Không thanh toán COD lạ', 'Liên hệ shop để xác nhận'],
  ARRAY['Đơn hàng không đặt', 'Yêu cầu thanh toán ngay', 'Không có thông tin shop']);

-- Bật RLS cho bảng mới
ALTER TABLE public.scam_statistics ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép mọi người đọc thống kê lừa đảo
CREATE POLICY "Anyone can view scam statistics" 
  ON public.scam_statistics 
  FOR SELECT
  USING (true);

-- Tạo bảng community alerts cho cảnh báo realtime
CREATE TABLE public.community_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  alert_type TEXT CHECK (alert_type IN ('scam_warning', 'danger_zone', 'safety_tip', 'urgent_alert')) NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
  location_name TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  affected_areas TEXT[],
  source_type TEXT CHECK (source_type IN ('user_report', 'authority', 'community', 'auto_detected')) DEFAULT 'user_report',
  reporter_user_id UUID REFERENCES auth.users,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES auth.users,
  expires_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  tags TEXT[],
  contact_info TEXT,
  evidence_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bật RLS cho community alerts
ALTER TABLE public.community_alerts ENABLE ROW LEVEL SECURITY;

-- Policy cho phép mọi người xem alerts
CREATE POLICY "Anyone can view community alerts" 
  ON public.community_alerts 
  FOR SELECT
  USING (true);

-- Policy cho phép user tạo alerts
CREATE POLICY "Authenticated users can create alerts" 
  ON public.community_alerts 
  FOR INSERT
  WITH CHECK (auth.uid() = reporter_user_id);

-- Thêm một số cảnh báo mẫu (sửa lỗi mảng rỗng)
INSERT INTO public.community_alerts (title, description, alert_type, severity, location_name, latitude, longitude, source_type, is_verified, tags, evidence_urls) VALUES
('Cảnh báo: Gia tăng lừa đảo việc làm casino tại biên giới', 'Gần đây có nhiều trường hợp người Việt bị lừa sang Campuchia làm việc casino rồi bị bắt giữ, cưỡng bức lao động. Tuyệt đối không nghe theo lời mời gọi làm việc casino với mức lương cao bất thường.', 'urgent_alert', 'critical', 'Khu vực biên giới Việt-Campuchia', 11.0847, 106.8831, 'authority', true, ARRAY['casino', 'việc làm', 'biên giới', 'campuchia'], ARRAY[]::text[]),

('Phát hiện website ngân hàng giả mạo Vietcombank', 'Xuất hiện website giả mạo Vietcombank với domain vcb-bank.com thay vì vietcombank.com.vn chính thức. Website này đánh cắp thông tin đăng nhập của khách hàng.', 'scam_warning', 'high', 'Toàn quốc', NULL, NULL, 'community', true, ARRAY['ngân hàng', 'website giả', 'vietcombank'], ARRAY[]::text[]),

('Cảnh báo: Điểm nóng tội phạm tại khu vực ga Sài Gòn', 'Tăng cường cảnh giác khi đi qua khu vực ga Sài Gòn vào ban đêm. Gần đây có nhiều vụ cướp giật xảy ra từ 22h đến 5h sáng.', 'danger_zone', 'high', 'Ga Sài Gòn, Quận 3, TP.HCM', 10.7769, 106.7009, 'authority', true, ARRAY['ga tàu', 'cướp giật', 'đêm'], ARRAY[]::text[]),

('Mạo danh Shopee lừa đảo qua tin nhắn SMS', 'Có tin nhắn SMS giả mạo Shopee thông báo tài khoản bị khóa, yêu cầu click link để mở khóa. Đây là chiêu trò lừa đảo để đánh cắp thông tin.', 'scam_warning', 'medium', 'Toàn quốc', NULL, NULL, 'user_report', true, ARRAY['shopee', 'sms', 'link độc'], ARRAY[]::text[]);
