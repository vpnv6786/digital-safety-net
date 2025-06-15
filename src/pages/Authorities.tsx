import React from 'react';
import { Phone, Shield, AlertTriangle, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

const Authorities = () => {
  const { language } = useLanguage();

  const emergencyContacts = [
    {
      name: language === 'en' ? 'Police 113' : 'Công an 113',
      phone: '113',
      description: language === 'en' ? 'Emergency number of People\'s Police' : 'Số điện thoại khẩn cấp của Công an nhân dân',
      type: 'emergency',
      available: '24/7'
    },
    {
      name: language === 'en' ? 'Fire Department 114' : 'Cứu hỏa 114',
      phone: '114',
      description: language === 'en' ? 'Fire and rescue emergency' : 'Cứu hỏa và cứu nạn khẩn cấp',
      type: 'emergency',
      available: '24/7'
    },
    {
      name: language === 'en' ? 'Medical Emergency 115' : 'Cấp cứu y tế 115',
      phone: '115',
      description: language === 'en' ? 'Medical emergency services' : 'Dịch vụ cấp cứu y tế',
      type: 'emergency',
      available: '24/7'
    },
    {
      name: language === 'en' ? 'National Traffic Safety Committee' : 'Ủy ban An toàn Giao thông Quốc gia',
      phone: '122',
      description: language === 'en' ? 'Traffic accident reporting' : 'Báo cáo tai nạn giao thông',
      type: 'emergency',
      available: '24/7'
    }
  ];

  const provincialPolice = [
    // Northern Region
    { name: language === 'en' ? 'Hanoi Police' : 'Công an TP. Hà Nội', phone: '024.3826.3030', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Hai Phong Police' : 'Công an TP. Hải Phòng', phone: '0225.3842.345', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Quang Ninh Police' : 'Công an Quảng Ninh', phone: '0203.3829.999', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Hai Duong Police' : 'Công an Hải Dương', phone: '0220.3861.234', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Hung Yen Police' : 'Công an Hưng Yên', phone: '0221.3861.345', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Thai Binh Police' : 'Công an Thái Bình', phone: '0227.3831.234', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Ha Nam Police' : 'Công an Hà Nam', phone: '0226.3851.123', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Nam Dinh Police' : 'Công an Nam Định', phone: '0228.3831.456', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Ninh Binh Police' : 'Công an Ninh Bình', phone: '0229.3871.234', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Vinh Phuc Police' : 'Công an Vĩnh Phúc', phone: '0211.3861.567', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Bac Ninh Police' : 'Công an Bắc Ninh', phone: '0222.3881.234', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Bac Giang Police' : 'Công an Bắc Giang', phone: '0204.3851.234', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Lang Son Police' : 'Công an Lạng Sơn', phone: '0205.3871.123', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Cao Bang Police' : 'Công an Cao Bằng', phone: '0206.3851.234', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Thai Nguyen Police' : 'Công an Thái Nguyên', phone: '0208.3851.567', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Tuyen Quang Police' : 'Công an Tuyên Quang', phone: '0207.3821.234', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Ha Giang Police' : 'Công an Hà Giang', phone: '0219.3861.234', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Yen Bai Police' : 'Công an Yên Bái', phone: '0216.3851.234', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Lao Cai Police' : 'Công an Lào Cai', phone: '0214.3831.234', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Lai Chau Police' : 'Công an Lai Châu', phone: '0213.3861.234', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Dien Bien Police' : 'Công an Điện Biên', phone: '0215.3824.567', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Son La Police' : 'Công an Sơn La', phone: '0212.3851.234', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Hoa Binh Police' : 'Công an Hòa Bình', phone: '0218.3851.567', region: language === 'en' ? 'North' : 'Miền Bắc' },
    { name: language === 'en' ? 'Phu Tho Police' : 'Công an Phú Thọ', phone: '0210.3831.234', region: language === 'en' ? 'North' : 'Miền Bắc' },

    // Central Region
    { name: language === 'en' ? 'Thanh Hoa Police' : 'Công an Thanh Hóa', phone: '0237.3851.234', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Nghe An Police' : 'Công an Nghệ An', phone: '0238.3831.567', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Ha Tinh Police' : 'Công an Hà Tĩnh', phone: '0239.3851.234', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Quang Binh Police' : 'Công an Quảng Bình', phone: '0232.3822.567', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Quang Tri Police' : 'Công an Quảng Trị', phone: '0233.3851.234', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Thua Thien Hue Police' : 'Công an Thừa Thiên Huế', phone: '0234.3822.345', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Da Nang Police' : 'Công an TP. Đà Nẵng', phone: '0236.3822.567', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Quang Nam Police' : 'Công an Quảng Nam', phone: '0235.3851.234', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Quang Ngai Police' : 'Công an Quảng Ngãi', phone: '0255.3821.567', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Binh Dinh Police' : 'Công an Bình Định', phone: '0256.3822.234', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Phu Yen Police' : 'Công an Phú Yên', phone: '0257.3822.567', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Khanh Hoa Police' : 'Công an Khánh Hòa', phone: '0258.3831.234', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Ninh Thuan Police' : 'Công an Ninh Thuận', phone: '0259.3871.234', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Binh Thuan Police' : 'Công an Bình Thuận', phone: '0252.3821.567', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Kon Tum Police' : 'Công an Kon Tum', phone: '0260.3862.234', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Gia Lai Police' : 'Công an Gia Lai', phone: '0269.3871.567', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Dak Lak Police' : 'Công an Đắk Lắk', phone: '0262.3851.234', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Dak Nong Police' : 'Công an Đắk Nông', phone: '0261.3851.567', region: language === 'en' ? 'Central' : 'Miền Trung' },
    { name: language === 'en' ? 'Lam Dong Police' : 'Công an Lâm Đồng', phone: '0263.3822.234', region: language === 'en' ? 'Central' : 'Miền Trung' },

    // Southern Region
    { name: language === 'en' ? 'Ho Chi Minh City Police' : 'Công an TP. Hồ Chí Minh', phone: '028.3829.8426', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Dong Nai Police' : 'Công an Đồng Nai', phone: '0251.3831.234', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Binh Duong Police' : 'Công an Bình Dương', phone: '0274.3822.567', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Ba Ria Vung Tau Police' : 'Công an Bà Rịa - Vũng Tàu', phone: '0254.3851.234', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Tay Ninh Police' : 'Công an Tây Ninh', phone: '0276.3822.567', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Binh Phuoc Police' : 'Công an Bình Phước', phone: '0271.3871.234', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Long An Police' : 'Công an Long An', phone: '0272.3831.567', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Dong Thap Police' : 'Công an Đồng Tháp', phone: '0277.3851.234', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Tien Giang Police' : 'Công an Tiền Giang', phone: '0273.3871.567', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'An Giang Police' : 'Công an An Giang', phone: '0296.3851.234', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Ben Tre Police' : 'Công an Bến Tre', phone: '0275.3822.567', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Vinh Long Police' : 'Công an Vĩnh Long', phone: '0270.3831.234', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Tra Vinh Police' : 'Công an Trà Vinh', phone: '0294.3851.567', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Can Tho Police' : 'Công an TP. Cần Thơ', phone: '0292.3831.234', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Hau Giang Police' : 'Công an Hậu Giang', phone: '0293.3851.567', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Soc Trang Police' : 'Công an Sóc Trăng', phone: '0299.3821.234', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Bac Lieu Police' : 'Công an Bạc Liêu', phone: '0291.3822.567', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Ca Mau Police' : 'Công an Cà Mau', phone: '0290.3831.234', region: language === 'en' ? 'South' : 'Miền Nam' },
    { name: language === 'en' ? 'Kien Giang Police' : 'Công an Kiên Giang', phone: '0297.3871.567', region: language === 'en' ? 'South' : 'Miền Nam' }
  ];

  const internationalAgencies = [
    {
      name: language === 'en' ? 'Interpol Vietnam' : 'Interpol Việt Nam',
      phone: '024.3826.3030',
      email: 'interpol.vietnam@boCA.gov.vn',
      description: language === 'en' ? 'International Criminal Police Organization - Vietnam Bureau' : 'Tổ chức Cảnh sát Hình sự Quốc tế - Văn phòng Việt Nam',
      services: language === 'en' ? ['International crime cooperation', 'Cross-border fraud cases'] : ['Hợp tác tội phạm quốc tế', 'Các vụ lừa đảo xuyên biên giới']
    },
    {
      name: language === 'en' ? 'ASEAN Cybercrime Coordination Center' : 'Trung tâm Điều phối Tội phạm Mạng ASEAN',
      phone: '+65.6325.2877',
      email: 'info@asean-cybercrime.org',
      website: 'https://www.asean.org',
      description: language === 'en' ? 'ASEAN regional cybercrime coordination' : 'Điều phối tội phạm mạng khu vực ASEAN',
      services: language === 'en' ? ['Regional cybercrime alerts', 'Cross-border investigation'] : ['Cảnh báo tội phạm mạng khu vực', 'Điều tra xuyên biên giới']
    },
    {
      name: language === 'en' ? 'FBI Internet Crime Complaint Center (IC3)' : 'Trung tâm Khiếu nại Tội phạm Internet FBI',
      phone: '+1.304.625.2000',
      email: 'ic3@fbi.gov',
      website: 'https://www.ic3.gov',
      description: language === 'en' ? 'US FBI Internet Crime Complaint Center' : 'Trung tâm Khiếu nại Tội phạm Internet của FBI Mỹ',
      services: language === 'en' ? ['International fraud reports', 'Cybercrime investigations'] : ['Báo cáo lừa đảo quốc tế', 'Điều tra tội phạm mạng']
    },
    {
      name: language === 'en' ? 'Anti-Phishing Working Group (APWG)' : 'Nhóm Làm việc Chống Lừa đảo Trực tuyến',
      email: 'reportphishing@apwg.org',
      website: 'https://apwg.org',
      description: language === 'en' ? 'Global coalition against phishing and cybercrime' : 'Liên minh toàn cầu chống lừa đảo trực tuyến và tội phạm mạng',
      services: language === 'en' ? ['Phishing reports', 'Global threat intelligence'] : ['Báo cáo lừa đảo trực tuyến', 'Thông tin tình báo mối đe dọa toàn cầu']
    },
    {
      name: language === 'en' ? 'UNODC Global Programme against Cybercrime' : 'Chương trình Toàn cầu Chống Tội phạm Mạng UNODC',
      phone: '+43.1.26060.0',
      email: 'cybercrime@unodc.org',
      website: 'https://www.unodc.org/unodc/en/cybercrime/',
      description: language === 'en' ? 'UN Office on Drugs and Crime - Cybercrime Programme' : 'Văn phòng LHQ về Ma túy và Tội phạm - Chương trình Tội phạm Mạng',
      services: language === 'en' ? ['International cooperation', 'Capacity building'] : ['Hợp tác quốc tế', 'Xây dựng năng lực']
    }
  ];

  const ContactCard = ({ contact, type = 'authority' }: { contact: any, type?: string }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {contact.name}
            </CardTitle>
            {contact.description && (
              <CardDescription className="text-gray-600">
                {contact.description}
              </CardDescription>
            )}
            {contact.region && (
              <Badge variant="outline" className="mt-2">
                {contact.region}
              </Badge>
            )}
          </div>
          {type === 'emergency' && (
            <Badge variant="destructive" className="ml-2">
              {language === 'en' ? 'Emergency' : 'Khẩn cấp'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-3">
          <Phone className="h-4 w-4 text-trust-blue" />
          <span className="font-mono text-lg font-semibold text-trust-blue">
            {contact.phone}
          </span>
          {contact.available && (
            <Badge variant="outline" className="text-xs">
              {contact.available}
            </Badge>
          )}
        </div>

        {contact.email && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">✉️ {contact.email}</span>
          </div>
        )}

        {contact.website && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={contact.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Visit website' : 'Truy cập website'}
            </a>
          </Button>
        )}

        {contact.services && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Services:' : 'Dịch vụ:'}
            </p>
            <div className="flex flex-wrap gap-1">
              {contact.services.map((service: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const ProvinceCard = ({ contact }: { contact: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{contact.name}</h3>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-trust-blue" />
              <span className="font-mono text-trust-blue">{contact.phone}</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {contact.region}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'en' 
              ? 'Anti-fraud authorities'
              : 'Cơ quan chức năng phòng chống lừa đảo'
            }
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Comprehensive contact information of Vietnamese and international anti-fraud authorities'
              : 'Thông tin liên hệ đầy đủ của các cơ quan chức năng phòng chống lừa đảo Việt Nam và quốc tế'
            }
          </p>
        </div>

        <Tabs defaultValue="emergency" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="emergency">
              {language === 'en' ? 'Emergency' : 'Khẩn cấp'}
            </TabsTrigger>
            <TabsTrigger value="provincial">
              {language === 'en' ? 'Provincial Police' : 'Công an tỉnh thành'}
            </TabsTrigger>
            <TabsTrigger value="national">
              {language === 'en' ? 'National Agencies' : 'Cơ quan quốc gia'}
            </TabsTrigger>
            <TabsTrigger value="international">
              {language === 'en' ? 'International' : 'Quốc tế'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emergency" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
              {language === 'en' ? 'Emergency numbers' : 'Số điện thoại khẩn cấp'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {emergencyContacts.map((contact, index) => (
                <ContactCard key={index} contact={contact} type="emergency" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="provincial" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="h-6 w-6 text-trust-blue mr-2" />
              {language === 'en' ? 'Provincial police departments (63 provinces)' : 'Công an các tỉnh thành (63 tỉnh thành)'}
            </h2>
            
            {/* Group by regions */}
            {['North', 'Central', 'South'].map((regionEn) => {
              const regionVi = regionEn === 'North' ? 'Miền Bắc' : regionEn === 'Central' ? 'Miền Trung' : 'Miền Nam';
              const regionName = language === 'en' ? regionEn : regionVi;
              const regionContacts = provincialPolice.filter(contact => 
                contact.region === (language === 'en' ? regionEn : regionVi)
              );
              
              return (
                <div key={regionEn} className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    {regionName}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {regionContacts.map((contact, index) => (
                      <ProvinceCard key={index} contact={contact} />
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="national" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="h-6 w-6 text-trust-blue mr-2" />
              {language === 'en' ? 'National agencies' : 'Cơ quan quốc gia'}
            </h2>
            
            {/* National Cyber Security */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {language === 'en' ? 'Cyber security agencies' : 'Cơ quan an toàn mạng'}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ContactCard contact={{
                  name: language === 'en' ? 'Information Security Department - MICT' : 'Cục An toàn Thông tin - Bộ TT&TT',
                  phone: '024.7305.8899',
                  email: 'info@attt.gov.vn',
                  website: 'https://attt.gov.vn',
                  description: language === 'en' ? 'Information Security Department - Ministry of Information and Communications' : 'Cục An toàn Thông tin - Bộ Thông tin và Truyền thông',
                  services: language === 'en' ? ['Report online fraud', 'Network security consulting'] : ['Báo cáo lừa đảo trực tuyến', 'Tư vấn an toàn mạng']
                }} />
                <ContactCard contact={{
                  name: language === 'en' ? 'National Cyber Security Center (NCSC)' : 'Trung tâm Giám sát An toàn không gian mạng quốc gia (NCSC)',
                  phone: '024.7305.6600',
                  email: 'ncsc@mic.gov.vn',
                  website: 'https://ncsc.gov.vn',
                  description: language === 'en' ? 'National Cyber Security Monitoring Center' : 'Trung tâm Giám sát An toàn không gian mạng quốc gia',
                  services: language === 'en' ? ['Malware alerts', 'Report network fraud'] : ['Cảnh báo mã độc', 'Phản ánh lừa đảo mạng']
                }} />
              </div>
            </div>

            {/* Banking Authorities */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                🏦 {language === 'en' ? 'Banking authorities' : 'Cơ quan tài chính ngân hàng'}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ContactCard contact={{
                  name: language === 'en' ? 'State Bank of Vietnam' : 'Ngân hàng Nhà nước Việt Nam',
                  phone: '024.3825.7799',
                  hotline: '1900.1559',
                  email: 'contact@sbv.gov.vn',
                  website: 'https://www.sbv.gov.vn',
                  description: language === 'en' ? 'Central Bank - Monetary management agency' : 'Ngân hàng Trung ương - Cơ quan quản lý tiền tệ',
                  services: language === 'en' ? ['Report banking fraud', 'Financial service complaints'] : ['Báo cáo lừa đảo ngân hàng', 'Khiếu nại dịch vụ tài chính']
                }} />
                <ContactCard contact={{
                  name: language === 'en' ? 'Vietnam Banks Association (VNBA)' : 'Hiệp hội Ngân hàng Việt Nam (VNBA)',
                  phone: '024.3936.6389',
                  email: 'info@vnba.org.vn',
                  website: 'https://www.vnba.org.vn',
                  description: language === 'en' ? 'Association of Vietnamese commercial banks' : 'Hiệp hội các ngân hàng thương mại Việt Nam',
                  services: language === 'en' ? ['Banking safety consulting', 'Financial fraud alerts'] : ['Tư vấn an toàn ngân hàng', 'Cảnh báo lừa đảo tài chính']
                }} />
              </div>
            </div>

            {/* Telecommunications */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📱 {language === 'en' ? 'Telecommunications' : 'Viễn thông'}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Viettel - 198', phone: '198' },
                  { name: 'VNPT - 1800.1166', phone: '1800.1166' },
                  { name: 'Mobifone - 9090', phone: '9090' },
                  { name: 'VinaPhone - 9191', phone: '9191' }
                ].map((provider, index) => (
                  <ProvinceCard key={index} contact={{
                    name: provider.name,
                    phone: provider.phone,
                    region: language === 'en' ? 'Telecom' : 'Viễn thông'
                  }} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="international" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="text-blue-600 mr-2">🌍</span>
              {language === 'en' ? 'International agencies' : 'Cơ quan quốc tế'}
            </h2>
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
              {internationalAgencies.map((contact, index) => (
                <ContactCard key={index} contact={contact} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mt-8">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                {language === 'en' ? 'Important notes' : 'Lưu ý quan trọng'}
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>{language === 'en' ? 'In emergency situations, call 113 immediately' : 'Khi gặp tình huống khẩn cấp, hãy gọi ngay số 113'}</li>
                  <li>{language === 'en' ? 'Save these numbers in your contacts for when needed' : 'Lưu trữ các số điện thoại này trong danh bạ để sử dụng khi cần'}</li>
                  <li>{language === 'en' ? 'Report immediately when detecting fraud activities to protect the community' : 'Báo cáo ngay khi phát hiện hoạt động lừa đảo để bảo vệ cộng đồng'}</li>
                  <li>{language === 'en' ? 'Contact your local provincial police for regional cases' : 'Liên hệ công an địa phương cho các vụ việc trong khu vực'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authorities;
