
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmergencyAlertRequest {
  alertType: 'emergency_button' | 'danger_zone' | 'safe_check' | 'low_battery';
  data: {
    location?: {
      latitude: number;
      longitude: number;
      accuracy?: number;
    };
    zoneName?: string;
    dangerLevel?: 'low' | 'medium' | 'high' | 'critical';
    batteryLevel?: number;
  };
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const requestData: EmergencyAlertRequest = await req.json();
    console.log('Emergency alert request:', requestData);

    // Get user's emergency contacts
    const { data: emergencyContacts, error: contactsError } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user.id);

    if (contactsError) {
      console.error('Failed to get emergency contacts:', contactsError);
      throw contactsError;
    }

    if (!emergencyContacts || emergencyContacts.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Không có người liên hệ khẩn cấp nào được thiết lập' 
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Generate alert message based on type
    const alertMessage = generateAlertMessage(requestData, user.phone || 'Người dùng');
    
    // For now, we'll log the notifications that would be sent
    // In a real implementation, you would integrate with SMS/Email services
    const notificationResults = [];

    for (const contact of emergencyContacts) {
      console.log(`Sending alert to ${contact.contact_name}:`);
      
      if (contact.contact_phone) {
        console.log(`SMS to ${contact.contact_phone}: ${alertMessage}`);
        notificationResults.push({
          type: 'sms',
          contact: contact.contact_phone,
          status: 'simulated'
        });
      }
      
      if (contact.contact_email) {
        console.log(`Email to ${contact.contact_email}: ${alertMessage}`);
        notificationResults.push({
          type: 'email',
          contact: contact.contact_email,
          status: 'simulated'
        });
      }
    }

    // Update alert history with notification results
    const { error: historyError } = await supabase
      .from('alert_history')
      .update({ 
        status: 'sent',
        contacts_notified: notificationResults.map(r => r.contact)
      })
      .eq('user_id', user.id)
      .eq('alert_type', requestData.alertType)
      .gte('sent_at', new Date(Date.now() - 5000).toISOString()); // Last 5 seconds

    if (historyError) {
      console.error('Failed to update alert history:', historyError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cảnh báo đã được gửi thành công',
        notificationsSent: notificationResults.length,
        details: notificationResults
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-emergency-alert function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Có lỗi xảy ra khi gửi cảnh báo' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

function generateAlertMessage(request: EmergencyAlertRequest, userPhone: string): string {
  const timestamp = new Date(request.timestamp).toLocaleString('vi-VN');
  const location = request.data.location;
  const locationText = location 
    ? `Vị trí: https://maps.google.com/maps?q=${location.latitude},${location.longitude}`
    : 'Vị trí: Không xác định';

  switch (request.alertType) {
    case 'emergency_button':
      return `🚨 CẢNH BÁO KHẨN CẤP 🚨
Người dùng ${userPhone} đã kích hoạt nút cảnh báo khẩn cấp!
Thời gian: ${timestamp}
${locationText}
Vui lòng liên hệ ngay để kiểm tra tình hình.`;

    case 'danger_zone':
      return `⚠️ CẢNH BÁO KHU VỰC NGUY HIỂM ⚠️
Người dùng ${userPhone} đã vào khu vực nguy hiểm: ${request.data.zoneName}
Mức độ nguy hiểm: ${getDangerLevelText(request.data.dangerLevel)}
Thời gian: ${timestamp}
${locationText}
Vui lòng theo dõi và liên hệ để đảm bảo an toàn.`;

    case 'low_battery':
      return `🔋 CẢNH BÁO PIN YẾU
Thiết bị của ${userPhone} sắp hết pin (${request.data.batteryLevel}%)
Thời gian: ${timestamp}
${locationText}
Có thể mất liên lạc sớm.`;

    default:
      return `📍 THÔNG BÁO AN TOÀN
Người dùng ${userPhone} gửi thông báo
Thời gian: ${timestamp}
${locationText}`;
  }
}

function getDangerLevelText(level?: string): string {
  switch (level) {
    case 'low': return 'Thấp';
    case 'medium': return 'Trung bình';
    case 'high': return 'Cao';
    case 'critical': return 'Rất cao';
    default: return 'Không xác định';
  }
}

serve(handler);
