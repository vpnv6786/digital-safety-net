
import React from 'react';
import { Phone, Shield, AlertTriangle, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
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
      name: language === 'en' ? 'Criminal Police' : 'Cảnh sát Hình sự',
      phone: '069.2209.668',
      description: language === 'en' ? 'Criminal Police Department - HCMC Police' : 'Phòng Cảnh sát Hình sự - Công an TP.HCM',
      type: 'police',
      available: language === 'en' ? 'Business hours' : 'Giờ hành chính'
    }
  ];

  const antiScamAgencies = [
    {
      name: language === 'en' ? 'Information Security Department - MICT' : 'Cục An toàn Thông tin - Bộ TT&TT',
      phone: '024.7305.8899',
      email: 'info@attt.gov.vn',
      description: language === 'en' ? 'Information Security Department - Ministry of Information and Communications' : 'Cục An toàn Thông tin - Bộ Thông tin và Truyền thông',
      website: 'https://attt.gov.vn',
      address: language === 'en' ? 'Hanoi' : 'Hà Nội',
      services: language === 'en' ? ['Report online fraud', 'Network security consulting'] : ['Báo cáo lừa đảo trực tuyến', 'Tư vấn an toàn mạng']
    },
    {
      name: language === 'en' ? 'National Cyber Security Center (NCSC)' : 'Trung tâm Giám sát An toàn không gian mạng quốc gia (NCSC)',
      phone: '024.7305.6600',
      email: 'ncsc@mic.gov.vn',
      description: language === 'en' ? 'National Cyber Security Monitoring Center' : 'Trung tâm Giám sát An toàn không gian mạng quốc gia',
      website: 'https://ncsc.gov.vn',
      address: language === 'en' ? 'Hanoi' : 'Hà Nội',
      services: language === 'en' ? ['Malware alerts', 'Report network fraud'] : ['Cảnh báo mã độc', 'Phản ánh lừa đảo mạng']
    },
    {
      name: language === 'en' ? 'Ho Chi Minh City Police' : 'Công an TP. Hồ Chí Minh',
      phone: '028.3829.8426',
      description: language === 'en' ? 'Cyber Security and High-Tech Crime Prevention Department' : 'Phòng An ninh mạng và phòng chống tội phạm công nghệ cao',
      address: language === 'en' ? 'Ho Chi Minh City' : 'TP. Hồ Chí Minh',
      services: language === 'en' ? ['Report cyber crime', 'Network security consulting'] : ['Báo cáo tội phạm mạng', 'Tư vấn an toàn mạng']
    },
    {
      name: language === 'en' ? 'Hanoi Police' : 'Công an TP. Hà Nội',
      phone: '024.3826.3030',
      description: language === 'en' ? 'Cyber Security and High-Tech Crime Prevention Department' : 'Phòng An ninh mạng và phòng chống tội phạm công nghệ cao',
      address: language === 'en' ? 'Hanoi' : 'Hà Nội',
      services: language === 'en' ? ['Report cyber crime', 'Support fraud victims'] : ['Báo cáo tội phạm mạng', 'Hỗ trợ nạn nhân lừa đảo']
    }
  ];

  const bankingAuthorities = [
    {
      name: language === 'en' ? 'State Bank of Vietnam' : 'Ngân hàng Nhà nước Việt Nam',
      phone: '024.3825.7799',
      hotline: '1900.1559',
      email: 'contact@sbv.gov.vn',
      description: language === 'en' ? 'Central Bank - Monetary management agency' : 'Ngân hàng Trung ương - Cơ quan quản lý tiền tệ',
      website: 'https://www.sbv.gov.vn',
      services: language === 'en' ? ['Report banking fraud', 'Financial service complaints'] : ['Báo cáo lừa đảo ngân hàng', 'Khiếu nại dịch vụ tài chính']
    },
    {
      name: language === 'en' ? 'Vietnam Banks Association (VNBA)' : 'Hiệp hội Ngân hàng Việt Nam (VNBA)',
      phone: '024.3936.6389',
      email: 'info@vnba.org.vn',
      description: language === 'en' ? 'Association of Vietnamese commercial banks' : 'Hiệp hội các ngân hàng thương mại Việt Nam',
      website: 'https://www.vnba.org.vn',
      services: language === 'en' ? ['Banking safety consulting', 'Financial fraud alerts'] : ['Tư vấn an toàn ngân hàng', 'Cảnh báo lừa đảo tài chính']
    }
  ];

  const telecommunicationAuthorities = [
    {
      name: language === 'en' ? 'Telecommunications Department - MICT' : 'Cục Viễn thông - Bộ TT&TT',
      phone: '024.7306.6767',
      email: 'cucvienthong@mic.gov.vn',
      description: language === 'en' ? 'Telecommunications Department - Ministry of Information and Communications' : 'Cục Viễn thông - Bộ Thông tin và Truyền thông',
      website: 'https://vta.gov.vn',
      services: language === 'en' ? ['Report spam SMS/Call', 'Telecom service complaints'] : ['Báo cáo spam SMS/Call', 'Khiếu nại dịch vụ viễn thông']
    },
    {
      name: 'Viettel - 198',
      phone: '198',
      description: language === 'en' ? 'Viettel customer support hotline' : 'Tổng đài hỗ trợ khách hàng Viettel',
      services: language === 'en' ? ['Report spam calls', 'Block spam messages'] : ['Báo cáo cuộc gọi rác', 'Chặn tin nhắn spam']
    },
    {
      name: 'VNPT - 1800.1166',
      phone: '1800.1166',
      description: language === 'en' ? 'VNPT customer support hotline' : 'Tổng đài hỗ trợ khách hàng VNPT',
      services: language === 'en' ? ['Report phone fraud', 'Call blocking service'] : ['Báo cáo lừa đảo qua điện thoại', 'Dịch vụ chặn cuộc gọi']
    },
    {
      name: 'Mobifone - 9090',
      phone: '9090',
      description: language === 'en' ? 'Mobifone customer support hotline' : 'Tổng đài hỗ trợ khách hàng Mobifone',
      services: language === 'en' ? ['Report fraud messages', 'Security support'] : ['Báo cáo tin nhắn lừa đảo', 'Hỗ trợ bảo mật']
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
            <CardDescription className="text-gray-600">
              {contact.description}
            </CardDescription>
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

        {contact.hotline && (
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-green-600" />
            <span className="font-mono font-medium text-green-600">
              Hotline: {contact.hotline}
            </span>
          </div>
        )}

        {contact.email && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">✉️ {contact.email}</span>
          </div>
        )}

        {contact.address && (
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{contact.address}</span>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Header />
      
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
              ? 'List of phone numbers and contact information of authorities supporting anti-fraud in Vietnam'
              : 'Danh sách các số điện thoại và thông tin liên hệ của các cơ quan chức năng hỗ trợ phòng chống lừa đảo tại Việt Nam'
            }
          </p>
        </div>

        {/* Emergency Contacts */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            {language === 'en' ? 'Emergency numbers' : 'Số điện thoại khẩn cấp'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {emergencyContacts.map((contact, index) => (
              <ContactCard key={index} contact={contact} type="emergency" />
            ))}
          </div>
        </section>

        {/* Anti-Scam Agencies */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Shield className="h-6 w-6 text-trust-blue mr-2" />
            {language === 'en' ? 'Cyber security agencies' : 'Cơ quan an toàn mạng'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {antiScamAgencies.map((contact, index) => (
              <ContactCard key={index} contact={contact} />
            ))}
          </div>
        </section>

        {/* Banking Authorities */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-green-600 mr-2">🏦</span>
            {language === 'en' ? 'Banking authorities' : 'Cơ quan tài chính ngân hàng'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {bankingAuthorities.map((contact, index) => (
              <ContactCard key={index} contact={contact} />
            ))}
          </div>
        </section>

        {/* Telecommunication Authorities */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-blue-600 mr-2">📱</span>
            {language === 'en' ? 'Telecom providers' : 'Nhà mạng và viễn thông'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {telecommunicationAuthorities.map((contact, index) => (
              <ContactCard key={index} contact={contact} />
            ))}
          </div>
        </section>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
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
                  <li>{language === 'en' ? 'Do not provide personal information over the phone if you are not sure' : 'Không cung cấp thông tin cá nhân qua điện thoại nếu không chắc chắn'}</li>
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
