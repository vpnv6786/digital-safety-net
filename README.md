
# ScamGuard - AI-Powered Scam Protection Platform

[![Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4.svg)](https://lovable.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📖 Giới thiệu / About

**ScamGuard** là nền tảng bảo vệ khỏi lừa đảo trực tuyến được trang bị công nghệ AI tiên tiến, được thiết kế đặc biệt cho cộng đồng Việt Nam. Ứng dụng giúp người dùng kiểm tra độ tin cậy của số điện thoại, website, email và các thông tin khác, đồng thời cung cấp hệ thống cảnh báo cộng đồng và bảo vệ an toàn cá nhân.

**ScamGuard** is an AI-powered online scam protection platform specifically designed for the Vietnamese community. The application helps users verify the reliability of phone numbers, websites, emails, and other information while providing community alert systems and personal safety protection.

## 🌟 Tính năng chính / Key Features

### 🔍 Kiểm tra thông tin / Information Verification
- **Kiểm tra số điện thoại**: Xác minh độ tin cậy của số điện thoại với cơ sở dữ liệu lừa đảo
- **Kiểm tra website**: Phân tích website để phát hiện các trang web lừa đảo
- **Kiểm tra email**: Xác minh tính hợp lệ và độ an toàn của địa chỉ email
- **Phân tích hình ảnh**: Sử dụng AI để phát hiện hình ảnh giả mạo và lừa đảo

### 🚨 Hệ thống cảnh báo / Alert System
- **Cảnh báo cộng đồng**: Thông báo thời gian thực từ cộng đồng về các mối đe dọa mới
- **Báo cáo lừa đảo**: Cho phép người dùng báo cáo các trường hợp lừa đảo
- **Thống kê và xếp hạng**: Bảng xếp hạng các loại hình lừa đảo phổ biến nhất

### 🛡️ An toàn cá nhân / Personal Safety
- **Theo dõi GPS**: Giám sát vị trí và cảnh báo khu vực nguy hiểm
- **Nút khẩn cấp**: Gửi cảnh báo khẩn cấp đến danh bạ tin cậy
- **Quản lý danh bạ khẩn cấp**: Thiết lập và quản lý danh sách liên hệ khẩn cấp

### 🤖 Công nghệ AI / AI Technology
- **Đa nhà cung cấp AI**: Tích hợp OpenAI, Google Gemini, Claude, Perplexity
- **Phân tích thông minh**: Sử dụng machine learning để phát hiện patterns lừa đảo
- **Cải thiện liên tục**: Học hỏi từ dữ liệu cộng đồng để nâng cao độ chính xác

### 🌐 Đa ngôn ngữ / Multi-language
- **Tiếng Việt**: Giao diện và nội dung hoàn toàn bằng tiếng Việt
- **English**: Full English interface and content support
- **Dịch thuật tự động**: Tích hợp dịch thuật AI cho các ngôn ngữ khác

## 🚀 Bắt đầu / Getting Started

### Yêu cầu hệ thống / Prerequisites

- **Node.js** 18.0 hoặc cao hơn
- **npm** hoặc **yarn**
- **Git**

### Cài đặt / Installation

1. **Clone repository**
```bash
git clone https://github.com/your-username/scamguard.git
cd scamguard
```

2. **Cài đặt dependencies**
```bash
npm install
# hoặc
yarn install
```

3. **Thiết lập biến môi trường**
```bash
cp .env.example .env.local
```

Cập nhật file `.env.local` với các thông tin cần thiết:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Provider Keys (Optional)
VITE_OPENAI_API_KEY=your_openai_key
VITE_GOOGLE_API_KEY=your_google_key
VITE_CLAUDE_API_KEY=your_claude_key
VITE_PERPLEXITY_API_KEY=your_perplexity_key
```

4. **Chạy ứng dụng**
```bash
npm run dev
# hoặc
yarn dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

## 🏗️ Kiến trúc / Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Database + Auth + Real-time)
- **AI Integration**: Multiple providers (OpenAI, Gemini, Claude, Perplexity)
- **State Management**: TanStack Query + React Context
- **Routing**: React Router DOM

### Cấu trúc thư mục / Project Structure
```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── HomePage.tsx     # Main homepage component
│   ├── Layout.tsx       # Page layout wrapper
│   ├── SearchResults.tsx # Search results display
│   └── ...
├── contexts/            # React contexts
│   └── LanguageContext.tsx
├── hooks/               # Custom React hooks
│   ├── useAuth.tsx      # Authentication hook
│   └── use-mobile.tsx   # Mobile detection hook
├── pages/               # Page components
│   ├── Index.tsx        # Homepage
│   ├── Safety.tsx       # Safety features
│   └── ...
├── services/            # API and business logic
│   ├── aiService.ts     # AI integration
│   ├── searchService.ts # Search functionality
│   └── ...
├── integrations/        # Third-party integrations
│   └── supabase/        # Supabase client and types
└── types/               # TypeScript type definitions
```

## 🛠️ Phát triển / Development

### Quy tắc coding / Coding Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting và formatting
- **Prettier**: Code formatting
- **Component Structure**: Functional components với hooks
- **File Naming**: camelCase cho files, PascalCase cho components

### Thêm tính năng mới / Adding New Features

1. **Tạo component mới**
```bash
# Tạo component trong thư mục phù hợp
touch src/components/NewFeature.tsx
```

2. **Implement component**
```typescript
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const NewFeature = () => {
  const { language } = useLanguage();
  
  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default NewFeature;
```

3. **Thêm routing (nếu cần)**
```typescript
// src/App.tsx
<Route path="/new-feature" element={
  <Layout>
    <NewFeature />
  </Layout>
} />
```

### Testing
```bash
# Chạy tests
npm run test

# Chạy tests với coverage
npm run test:coverage
```

## 📱 Mobile App Features

### Bottom Navigation
- **Responsive Design**: Tự động ẩn/hiện trên desktop/mobile
- **Quick Access**: Truy cập nhanh các tính năng chính
- **Active State**: Highlight trang hiện tại

### PWA Support
- **Offline Capability**: Hoạt động khi không có internet
- **Install Prompt**: Có thể cài đặt như app native
- **Push Notifications**: Nhận thông báo cảnh báo

## 🔧 Tích hợp AI / AI Integration

### Supported Providers
1. **OpenAI GPT**: Phân tích văn bản và pattern recognition
2. **Google Gemini**: Xử lý đa phương tiện và phân tích hình ảnh
3. **Claude**: Phân tích ngữ cảnh và reasoning
4. **Perplexity**: Search và fact-checking

### Cấu hình AI Provider
```typescript
// src/services/aiManager.ts
const aiManager = new AIManager({
  providers: ['openai', 'gemini', 'claude'],
  fallbackEnabled: true,
  rateLimiting: true
});
```

## 🗄️ Database Schema

### Bảng chính / Main Tables
- **profiles**: Thông tin người dùng
- **entities**: Thông tin các entity (số ĐT, website, email)
- **reports**: Báo cáo lừa đảo từ người dùng
- **community_alerts**: Cảnh báo cộng đồng
- **danger_zones**: Khu vực nguy hiểm
- **emergency_contacts**: Danh bạ khẩn cấp

### Row Level Security (RLS)
- Tất cả bảng đều có RLS enabled
- User chỉ có thể truy cập dữ liệu của mình
- Moderator có quyền truy cập để xác minh

## 🌐 Deployment

### Lovable Platform
```bash
# Deploy lên Lovable
# Sử dụng nút "Publish" trong Lovable editor
```

### Custom Deployment
```bash
# Build production
npm run build

# Deploy to your hosting provider
# (Vercel, Netlify, etc.)
```

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
```

## 📊 Analytics & Monitoring

### Metrics Tracked
- **Usage Statistics**: Số lượng tìm kiếm, báo cáo
- **Performance Metrics**: Response time, error rates
- **User Engagement**: Active users, feature usage
- **Security Events**: Threat detection, false positives

## 🤝 Đóng góp / Contributing

### Báo cáo lỗi / Bug Reports
1. Kiểm tra [Issues](https://github.com/your-username/scamguard/issues) có tồn tại chưa
2. Tạo issue mới với template bug report
3. Cung cấp thông tin chi tiết về lỗi

### Feature Requests
1. Tạo issue với label "enhancement"
2. Mô tả chi tiết tính năng mong muốn
3. Giải thích use case và benefit

### Pull Requests
1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

## 🔒 Bảo mật / Security

### Data Protection
- **Encryption**: Tất cả dữ liệu nhạy cảm được mã hóa
- **Authentication**: Supabase Auth với JWT tokens
- **Authorization**: Row Level Security (RLS)
- **Privacy**: Tuân thủ GDPR và CCPA

### Security Best Practices
- Regular security updates
- Input validation và sanitization
- Rate limiting cho API calls
- Secure headers và CSP

## 📞 Hỗ trợ / Support

### Liên hệ / Contact
- **Email**: support@scamguard.vn
- **Website**: https://scamguard.lovable.app
- **GitHub Issues**: [Report Issues](https://github.com/your-username/scamguard/issues)

### Số điện thoại khẩn cấp / Emergency Numbers
- **113**: Cảnh sát Việt Nam
- **1900 545 464**: Ngân hàng Nhà nước
- **1900 561 558**: Bộ Công Thương

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Lovable Platform**: For providing the development platform
- **Supabase**: For backend infrastructure
- **shadcn/ui**: For beautiful UI components
- **Vietnamese Community**: For feedback and support
- **AI Providers**: OpenAI, Google, Anthropic, Perplexity

---

**Built with ❤️ for the Vietnamese community**

**Được xây dựng với ❤️ cho cộng đồng Việt Nam**

---

## 🔄 Changelog

### v1.0.0 (Current)
- ✅ Core search functionality
- ✅ Community alert system
- ✅ Personal safety features
- ✅ Multi-language support
- ✅ AI integration
- ✅ Mobile-responsive design
- ✅ PWA capabilities

### Roadmap
- 🔄 Advanced AI threat detection
- 🔄 Real-time location sharing
- 🔄 Integration with law enforcement
- 🔄 Advanced analytics dashboard
- 🔄 API for third-party integration
