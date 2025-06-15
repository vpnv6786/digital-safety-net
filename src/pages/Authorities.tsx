
import React from 'react';
import { Phone, Shield, AlertTriangle, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

const Authorities = () => {
  const emergencyContacts = [
    {
      name: 'Công an 113',
      phone: '113',
      description: 'Số điện thoại khẩn cấp của Công an nhân dân',
      type: 'emergency',
      available: '24/7'
    },
    {
      name: 'Cảnh sát Hình sự',
      phone: '069.2209.668',
      description: 'Phòng Cảnh sát Hình sự - Công an TP.HCM',
      type: 'police',
      available: 'Giờ hành chính'
    }
  ];

  const antiScamAgencies = [
    {
      name: 'Cục An toàn Thông tin - Bộ TT&TT',
      phone: '024.7305.8899',
      email: 'info@attt.gov.vn',
      description: 'Cục An toàn Thông tin - Bộ Thông tin và Truyền thông',
      website: 'https://attt.gov.vn',
      address: 'Hà Nội',
      services: ['Báo cáo lừa đảo trực tuyến', 'Tư vấn an toàn mạng']
    },
    {
      name: 'Trung tâm Giám sát An toàn không gian mạng quốc gia (NCSC)',
      phone: '024.7305.6600',
      email: 'ncsc@mic.gov.vn',
      description: 'Trung tâm Giám sát An toàn không gian mạng quốc gia',
      website: 'https://ncsc.gov.vn',
      address: 'Hà Nội',
      services: ['Cảnh báo mã độc', 'Phản ánh lừa đảo mạng']
    },
    {
      name: 'Công an TP. Hồ Chí Minh',
      phone: '028.3829.8426',
      description: 'Phòng An ninh mạng và phòng chống tội phạm công nghệ cao',
      address: 'TP. Hồ Chí Minh',
      services: ['Báo cáo tội phạm mạng', 'Tư vấn an toàn mạng']
    },
    {
      name: 'Công an TP. Hà Nội',
      phone: '024.3826.3030',
      description: 'Phòng An ninh mạng và phòng chống tội phạm công nghệ cao',
      address: 'Hà Nội',
      services: ['Báo cáo tội phạm mạng', 'Hỗ trợ nạn nhân lừa đảo']
    }
  ];

  const bankingAuthorities = [
    {
      name: 'Ngân hàng Nhà nước Việt Nam',
      phone: '024.3825.7799',
      hotline: '1900.1559',
      email: 'contact@sbv.gov.vn',
      description: 'Ngân hàng Trung ương - Cơ quan quản lý tiền tệ',
      website: 'https://www.sbv.gov.vn',
      services: ['Báo cáo lừa đảo ngân hàng', 'Khiếu nại dịch vụ tài chính']
    },
    {
      name: 'Hiệp hội Ngân hàng Việt Nam (VNBA)',
      phone: '024.3936.6389',
      email: 'info@vnba.org.vn',
      description: 'Hiệp hội các ngân hàng thương mại Việt Nam',
      website: 'https://www.vnba.org.vn',
      services: ['Tư vấn an toàn ngân hàng', 'Cảnh báo lừa đảo tài chính']
    }
  ];

  const telecommunicationAuthorities = [
    {
      name: 'Cục Viễn thông - Bộ TT&TT',
      phone: '024.7306.6767',
      email: 'cucvienthong@mic.gov.vn',
      description: 'Cục Viễn thông - Bộ Thông tin và Truyền thông',
      website: 'https://vta.gov.vn',
      services: ['Báo cáo spam SMS/Call', 'Khiếu nại dịch vụ viễn thông']
    },
    {
      name: 'Viettel - 198',
      phone: '198',
      description: 'Tổng đài hỗ trợ khách hàng Viettel',
      services: ['Báo cáo cuộc gọi rác', 'Chặn tin nhắn spam']
    },
    {
      name: 'VNPT - 1800.1166',
      phone: '1800.1166',
      description: 'Tổng đài hỗ trợ khách hàng VNPT',
      services: ['Báo cáo lừa đảo qua điện thoại', 'Dịch vụ chặn cuộc gọi']
    },
    {
      name: 'Mobifone - 9090',
      phone: '9090',
      description: 'Tổng đài hỗ trợ khách hàng Mobifone',
      services: ['Báo cáo tin nhắn lừa đảo', 'Hỗ trợ bảo mật']
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
              Khẩn cấp
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
              Truy cập website
            </a>
          </Button>
        )}

        {contact.services && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Dịch vụ:</p>
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
            Cơ quan chức năng phòng chống lừa đảo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Danh sách các số điện thoại và thông tin liên hệ của các cơ quan chức năng 
            hỗ trợ phòng chống lừa đảo tại Việt Nam
          </p>
        </div>

        {/* Emergency Contacts */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            Số điện thoại khẩn cấp
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
            Cơ quan an toàn mạng
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
            Cơ quan tài chính ngân hàng
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
            Nhà mạng và viễn thông
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
                Lưu ý quan trọng
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Khi gặp tình huống khẩn cấp, hãy gọi ngay số 113</li>
                  <li>Lưu trữ các số điện thoại này trong danh bạ để sử dụng khi cần</li>
                  <li>Báo cáo ngay khi phát hiện hoạt động lừa đảo để bảo vệ cộng đồng</li>
                  <li>Không cung cấp thông tin cá nhân qua điện thoại nếu không chắc chắn</li>
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
