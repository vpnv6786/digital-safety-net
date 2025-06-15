
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'vi' | 'zh' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Header
    'app.name': 'CyberGuard',
    'app.tagline': 'Check before you trust',
    'header.login': 'Sign In',
    
    // Hero Section
    'hero.title.line1': 'Received a suspicious message?',
    'hero.title.line2': 'Check before you trust.',
    'hero.subtitle': 'CyberGuard is a free community shield that helps you check and report online scams in seconds.',
    'hero.search.placeholder': 'Enter phone number, bank account, website to check...',
    'hero.search.button': 'Check',
    'hero.report.button': 'Report Scam',
    'hero.examples': 'Try with examples:',
    'hero.examples.dangerous': '(Dangerous)',
    'hero.examples.suspicious': '(Suspicious)', 
    'hero.examples.safe': '(Safe)',
    
    // Stats
    'stats.reports.processed': 'Reports Processed',
    'stats.users.joined': 'Users Joined',
    'stats.situations.prevented': 'Situations Prevented',
    
    // Recent Warnings
    'warnings.title': 'Warning Board',
    'warnings.subtitle': 'Latest warnings from the community',
    'warnings.reports': 'reports',
    'warnings.view.details': 'View details →',
    'warnings.categories.fake.police': 'Fake Police',
    'warnings.categories.bank.fraud': 'Bank Fraud',
    'warnings.categories.job.scam': 'Online Job Scam',
    
    // How it works
    'how.title': 'How does CyberGuard work?',
    'how.step1.title': '1. Instant Search',
    'how.step1.desc': 'Enter suspicious information in the search bar',
    'how.step2.title': '2. Get Alerts',
    'how.step2.desc': 'View results from community database',
    'how.step3.title': '3. Protect Together',
    'how.step3.desc': 'Report to help others',
    
    // Footer
    'footer.description': 'Join thousands of users building a safer digital space. Every report you make helps protect the community.',
    'footer.links': 'Links',
    'footer.user.guide': 'User Guide',
    'footer.faq': 'FAQ',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact',
    'footer.email': 'Email: support@cyberguard.com',
    'footer.hotline': 'Hotline: 1900-xxx-xxx',
    'footer.copyright': '© 2024 CyberGuard. All rights reserved.',
    
    // Search Results
    'results.title': 'Search Results',
    'results.searched.for': 'Searched for: ',
    'results.safe.title': 'INFORMATION SAFE',
    'results.safe.message': 'No reports found for this information. Always stay cautious.',
    'results.safe.description': 'No community warnings for this information.',
    'results.safe.action': 'I want to report',
    'results.suspicious.title': 'SUSPICIOUS WARNING',
    'results.suspicious.message': 'Some reports exist for this information. Be careful.',
    'results.suspicious.description': 'Community has sent some warnings about this information.',
    'results.suspicious.action': 'I experienced this too',
    'results.dangerous.title': 'DANGER WARNING',
    'results.dangerous.message': 'Multiple scam reports for this information. ABSOLUTELY DO NOT trust!',
    'results.dangerous.description': 'Many users have reported scam activities from this information.',
    'results.dangerous.action': 'I was scammed too',
    'results.reports.received': 'Reports Received',
    'results.verified': 'Verified',
    'results.reliability': 'Reliability',
    'results.related.reports': 'Related Reports',
    'results.reported.at': 'reported',
    'results.verified.by': 'people confirmed',
    'results.safety.tip': 'Safety Tip:',
    'results.safety.message': 'Regardless of the results, always verify thoroughly before providing personal information or transferring money. When in doubt, contact the official organization directly.',
    'results.back': 'Back',
    'results.share.warning': 'Share Warning',
    
    // Report Form
    'report.title': 'Report Scam',
    'report.subtitle': 'Help the community by sharing scam information',
    'report.step1.title': 'Type of information to report',
    'report.step1.question': 'What type of information do you want to report?',
    'report.step1.phone': 'Phone Number',
    'report.step1.phone.desc': 'Scam phone number',
    'report.step1.bank': 'Bank Account',
    'report.step1.bank.desc': 'Bank account or banking information',
    'report.step1.url': 'Website/Link',
    'report.step1.url.desc': 'Scam website or link',
    'report.step1.other': 'Other',
    'report.step1.other.desc': 'Other types of scams',
    'report.step2.title': 'Detailed Information',
    'report.step2.phone.label': 'Enter phone number',
    'report.step2.bank.label': 'Enter bank account number',
    'report.step2.url.label': 'Enter website or link',
    'report.step2.other.label': 'Describe the information to report',
    'report.step2.phone.placeholder': 'e.g. 0123456789',
    'report.step2.bank.placeholder': 'e.g. 1234567890',
    'report.step2.url.placeholder': 'e.g. https://example.com',
    'report.step2.other.placeholder': 'e.g. Company name, email address...',
    'report.step2.privacy': 'This information will be kept confidential and only used to warn the community',
    'report.step3.title': 'Describe the incident',
    'report.step3.category.label': 'Type of scam',
    'report.step3.description.label': 'Detailed description of the incident',
    'report.step3.description.placeholder': 'Please describe what happened: what they said, what they requested, when it occurred...',
    'report.step3.description.tip': 'The more detailed, the more effective the warning',
    'report.step4.title': 'Evidence (optional)',
    'report.step4.upload.label': 'Upload evidence',
    'report.step4.upload.description': 'Screenshots of messages, calls, or any other evidence (not required)',
    'report.step4.upload.instruction': 'Drag and drop files here or click to select',
    'report.step4.upload.button': 'Choose files',
    'report.step4.files.selected': 'Selected files:',
    'report.step4.remove': 'Remove',
    'report.step4.privacy.title': 'Privacy Commitment',
    'report.step4.privacy.message': 'All information and evidence you provide will be strictly confidential. We only use it to verify and warn the community without revealing your identity.',
    'report.categories.fake.police': 'Fake Police',
    'report.categories.bank.fraud': 'Bank Fraud',
    'report.categories.job.scam': 'Online Job Scam',
    'report.categories.investment': 'Investment Fraud',
    'report.categories.online.shopping': 'Online Shopping',
    'report.categories.telecom.fraud': 'Fake Telecom Staff',
    'report.categories.fake.promotion': 'Fake Promotion',
    'report.categories.other': 'Other',
    'report.navigation.back': 'Back',
    'report.navigation.continue': 'Continue',
    'report.navigation.submit': 'Submit Report',
    'report.navigation.submitting': 'Submitting...',
    'report.success.title': 'Report Submitted!',
    'report.success.message': 'Thank you for helping protect the community. Your report will be reviewed and verified as soon as possible.',
    'report.success.home': 'Go to Home',
    'report.success.report.another': 'Report Another',
    
    // Language names
    'language.english': 'English',
    'language.vietnamese': 'Tiếng Việt',
    'language.chinese': '中文',
    'language.spanish': 'Español'
  },
  vi: {
    // Header
    'app.name': 'Vệ Binh Mạng',
    'app.tagline': 'Tra cứu trước khi tin',
    'header.login': 'Đăng nhập',
    
    // Hero Section
    'hero.title.line1': 'Nhận tin nhắn lạ?',
    'hero.title.line2': 'Tra cứu trước khi tin.',
    'hero.subtitle': 'Vệ Binh Mạng là lá chắn cộng đồng miễn phí, giúp bạn kiểm tra và báo cáo lừa đảo trực tuyến chỉ trong vài giây.',
    'hero.search.placeholder': 'Nhập SĐT, tài khoản ngân hàng, website để kiểm tra...',
    'hero.search.button': 'Kiểm tra',
    'hero.report.button': 'Báo cáo Lừa đảo',
    'hero.examples': 'Thử ngay với các ví dụ:',
    'hero.examples.dangerous': '(Nguy hiểm)',
    'hero.examples.suspicious': '(Nghi ngờ)',
    'hero.examples.safe': '(An toàn)',
    
    // Stats
    'stats.reports.processed': 'Báo cáo đã xử lý',
    'stats.users.joined': 'Người dùng đã tham gia',
    'stats.situations.prevented': 'Tình huống đã ngăn chặn',
    
    // Recent Warnings
    'warnings.title': 'Bảng tin Cảnh báo',
    'warnings.subtitle': 'Những cảnh báo mới nhất từ cộng đồng',
    'warnings.reports': 'báo cáo',
    'warnings.view.details': 'Xem chi tiết →',
    'warnings.categories.fake.police': 'Giả danh công an',
    'warnings.categories.bank.fraud': 'Lừa đảo ngân hàng',
    'warnings.categories.job.scam': 'Việc làm online',
    
    // How it works
    'how.title': 'Vệ Binh Mạng hoạt động như thế nào?',
    'how.step1.title': '1. Tra cứu tức thì',
    'how.step1.desc': 'Nhập thông tin nghi ngờ vào thanh tìm kiếm',
    'how.step2.title': '2. Nhận cảnh báo',
    'how.step2.desc': 'Xem kết quả từ cơ sở dữ liệu cộng đồng',
    'how.step3.title': '3. Chung tay bảo vệ',
    'how.step3.desc': 'Báo cáo để giúp đỡ người khác',
    
    // Footer
    'footer.description': 'Tham gia cùng hàng ngàn người dùng xây dựng một không gian mạng an toàn hơn. Mỗi báo cáo của bạn đều góp phần bảo vệ cộng đồng.',
    'footer.links': 'Liên kết',
    'footer.user.guide': 'Hướng dẫn sử dụng',
    'footer.faq': 'Câu hỏi thường gặp',
    'footer.privacy': 'Chính sách bảo mật',
    'footer.terms': 'Điều khoản sử dụng',
    'footer.contact': 'Liên hệ',
    'footer.email': 'Email: support@vebinhmang.vn',
    'footer.hotline': 'Hotline: 1900-xxx-xxx',
    'footer.copyright': '© 2024 Vệ Binh Mạng. Tất cả quyền được bảo lưu.',
    
    // Search Results
    'results.title': 'Kết quả tra cứu',
    'results.searched.for': 'Thông tin tìm kiếm: ',
    'results.safe.title': 'THÔNG TIN AN TOÀN',
    'results.safe.message': 'Thông tin này chưa có báo cáo nào. Hãy luôn cẩn trọng.',
    'results.safe.description': 'Không có cảnh báo nào từ cộng đồng cho thông tin này.',
    'results.safe.action': 'Tôi muốn báo cáo',
    'results.suspicious.title': 'CẢNH BÁO NGHI NGỜ',
    'results.suspicious.message': 'Có một số báo cáo về thông tin này. Hãy thận trọng.',
    'results.suspicious.description': 'Cộng đồng đã gửi một số cảnh báo về thông tin này.',
    'results.suspicious.action': 'Tôi cũng gặp phải',
    'results.dangerous.title': 'CẢNH BÁO NGUY HIỂM',
    'results.dangerous.message': 'Thông tin này có nhiều báo cáo lừa đảo. TUYỆT ĐỐI KHÔNG tin tưởng!',
    'results.dangerous.description': 'Nhiều người dùng đã báo cáo về hoạt động lừa đảo từ thông tin này.',
    'results.dangerous.action': 'Tôi cũng bị lừa',
    'results.reports.received': 'Báo cáo đã nhận',
    'results.verified': 'Đã xác minh',
    'results.reliability': 'Độ tin cậy',
    'results.related.reports': 'Các báo cáo liên quan',
    'results.reported.at': 'báo cáo',
    'results.verified.by': 'người xác nhận',
    'results.safety.tip': 'Lời khuyên an toàn:',
    'results.safety.message': 'Dù kết quả như thế nào, hãy luôn kiểm tra kỹ lưỡng trước khi cung cấp thông tin cá nhân hoặc chuyển tiền. Khi có nghi ngờ, hãy liên hệ trực tiếp với tổ chức/cơ quan chính thức.',
    'results.back': 'Quay lại',
    'results.share.warning': 'Chia sẻ cảnh báo',
    
    // Report Form
    'report.title': 'Báo cáo Lừa đảo',
    'report.subtitle': 'Giúp cộng đồng bằng cách chia sẻ thông tin về lừa đảo',
    'report.step1.title': 'Loại thông tin muốn báo cáo',
    'report.step1.question': 'Bạn muốn báo cáo về loại thông tin nào?',
    'report.step1.phone': 'Số điện thoại',
    'report.step1.phone.desc': 'Số điện thoại lừa đảo',
    'report.step1.bank': 'Tài khoản ngân hàng',
    'report.step1.bank.desc': 'STK hoặc thông tin ngân hàng',
    'report.step1.url': 'Website/Link',
    'report.step1.url.desc': 'Trang web hoặc đường link lừa đảo',
    'report.step1.other': 'Khác',
    'report.step1.other.desc': 'Hình thức lừa đảo khác',
    'report.step2.title': 'Thông tin chi tiết',
    'report.step2.phone.label': 'Nhập số điện thoại',
    'report.step2.bank.label': 'Nhập số tài khoản ngân hàng',
    'report.step2.url.label': 'Nhập website hoặc link',
    'report.step2.other.label': 'Mô tả thông tin cần báo cáo',
    'report.step2.phone.placeholder': 'VD: 0123456789',
    'report.step2.bank.placeholder': 'VD: 1234567890',
    'report.step2.url.placeholder': 'VD: https://example.com',
    'report.step2.other.placeholder': 'VD: Tên công ty, địa chỉ email...',
    'report.step2.privacy': 'Thông tin này sẽ được bảo mật và chỉ sử dụng để cảnh báo cộng đồng',
    'report.step3.title': 'Mô tả sự việc',
    'report.step3.category.label': 'Loại lừa đảo',
    'report.step3.description.label': 'Mô tả chi tiết sự việc',
    'report.step3.description.placeholder': 'Hãy mô tả những gì đã xảy ra: họ nói gì, yêu cầu gì, thời gian diễn ra...',
    'report.step3.description.tip': 'Càng chi tiết càng giúp cảnh báo hiệu quả hơn',
    'report.step4.title': 'Bằng chứng (tùy chọn)',
    'report.step4.upload.label': 'Tải lên bằng chứng',
    'report.step4.upload.description': 'Ảnh chụp màn hình tin nhắn, cuộc gọi, hoặc bất kỳ bằng chứng nào khác (không bắt buộc)',
    'report.step4.upload.instruction': 'Kéo thả file vào đây hoặc click để chọn',
    'report.step4.upload.button': 'Chọn file',
    'report.step4.files.selected': 'File đã chọn:',
    'report.step4.remove': 'Xóa',
    'report.step4.privacy.title': 'Cam kết bảo mật',
    'report.step4.privacy.message': 'Mọi thông tin và bằng chứng bạn cung cấp sẽ được bảo mật tuyệt đối. Chúng tôi chỉ sử dụng để xác minh và cảnh báo cộng đồng mà không tiết lộ danh tính của bạn.',
    'report.categories.fake.police': 'Giả danh công an',
    'report.categories.bank.fraud': 'Lừa đảo ngân hàng',
    'report.categories.job.scam': 'Việc làm online',
    'report.categories.investment': 'Đầu tư tài chính',
    'report.categories.online.shopping': 'Mua bán online',
    'report.categories.telecom.fraud': 'Giả danh nhân viên viễn thông',
    'report.categories.fake.promotion': 'Khuyến mãi giả',
    'report.categories.other': 'Khác',
    'report.navigation.back': 'Quay lại',
    'report.navigation.continue': 'Tiếp tục',
    'report.navigation.submit': 'Gửi báo cáo',
    'report.navigation.submitting': 'Đang gửi...',
    'report.success.title': 'Báo cáo đã được gửi!',
    'report.success.message': 'Cảm ơn bạn đã góp phần bảo vệ cộng đồng. Báo cáo của bạn sẽ được xem xét và xác minh trong thời gian sớm nhất.',
    'report.success.home': 'Về trang chủ',
    'report.success.report.another': 'Báo cáo khác',
    
    // Language names
    'language.english': 'English',
    'language.vietnamese': 'Tiếng Việt',
    'language.chinese': '中文',
    'language.spanish': 'Español'
  },
  zh: {
    // Header
    'app.name': '网络卫士',
    'app.tagline': '先查询再信任',
    'header.login': '登录',
    
    // Hero Section
    'hero.title.line1': '收到可疑消息？',
    'hero.title.line2': '先查询再信任。',
    'hero.subtitle': '网络卫士是免费的社区防护盾，帮您在几秒内检查和举报网络诈骗。',
    'hero.search.placeholder': '输入电话号码、银行账户、网站进行查询...',
    'hero.search.button': '查询',
    'hero.report.button': '举报诈骗',
    'hero.examples': '试试这些例子：',
    'hero.examples.dangerous': '（危险）',
    'hero.examples.suspicious': '（可疑）',
    'hero.examples.safe': '（安全）',
    
    // Stats
    'stats.reports.processed': '已处理举报',
    'stats.users.joined': '用户加入',
    'stats.situations.prevented': '阻止的情况',
    
    // Recent Warnings
    'warnings.title': '警告板',
    'warnings.subtitle': '来自社区的最新警告',
    'warnings.reports': '举报',
    'warnings.view.details': '查看详情 →',
    'warnings.categories.fake.police': '冒充警察',
    'warnings.categories.bank.fraud': '银行诈骗',
    'warnings.categories.job.scam': '网络招聘诈骗',
    
    // How it works
    'how.title': '网络卫士如何工作？',
    'how.step1.title': '1. 即时搜索',
    'how.step1.desc': '在搜索栏输入可疑信息',
    'how.step2.title': '2. 获取警报',
    'how.step2.desc': '查看来自社区数据库的结果',
    'how.step3.title': '3. 共同保护',
    'how.step3.desc': '举报以帮助他人',
    
    // Footer
    'footer.description': '与成千上万的用户一起构建更安全的数字空间。您的每一份举报都有助于保护社区。',
    'footer.links': '链接',
    'footer.user.guide': '用户指南',
    'footer.faq': '常见问题',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',
    'footer.contact': '联系我们',
    'footer.email': '邮箱：support@cyberguard.com',
    'footer.hotline': '热线：1900-xxx-xxx',
    'footer.copyright': '© 2024 网络卫士。保留所有权利。',
    
    // Search Results
    'results.title': '搜索结果',
    'results.searched.for': '搜索内容：',
    'results.safe.title': '信息安全',
    'results.safe.message': '此信息未发现举报。请始终保持谨慎。',
    'results.safe.description': '社区对此信息没有警告。',
    'results.safe.action': '我要举报',
    'results.suspicious.title': '可疑警告',
    'results.suspicious.message': '此信息存在一些举报。请小心。',
    'results.suspicious.description': '社区对此信息发出了一些警告。',
    'results.suspicious.action': '我也遇到了',
    'results.dangerous.title': '危险警告',
    'results.dangerous.message': '此信息有多个诈骗举报。绝对不要信任！',
    'results.dangerous.description': '许多用户举报了来自此信息的诈骗活动。',
    'results.dangerous.action': '我也被骗了',
    'results.reports.received': '收到举报',
    'results.verified': '已验证',
    'results.reliability': '可靠性',
    'results.related.reports': '相关举报',
    'results.reported.at': '举报于',
    'results.verified.by': '人确认',
    'results.safety.tip': '安全提示：',
    'results.safety.message': '无论结果如何，在提供个人信息或转账前请始终仔细验证。有疑问时，请直接联系官方机构。',
    'results.back': '返回',
    'results.share.warning': '分享警告',
    
    // Report Form
    'report.title': '举报诈骗',
    'report.subtitle': '通过分享诈骗信息帮助社区',
    'report.step1.title': '要举报的信息类型',
    'report.step1.question': '您要举报什么类型的信息？',
    'report.step1.phone': '电话号码',
    'report.step1.phone.desc': '诈骗电话号码',
    'report.step1.bank': '银行账户',
    'report.step1.bank.desc': '银行账户或银行信息',
    'report.step1.url': '网站/链接',
    'report.step1.url.desc': '诈骗网站或链接',
    'report.step1.other': '其他',
    'report.step1.other.desc': '其他类型的诈骗',
    'report.step2.title': '详细信息',
    'report.step2.phone.label': '输入电话号码',
    'report.step2.bank.label': '输入银行账号',
    'report.step2.url.label': '输入网站或链接',
    'report.step2.other.label': '描述要举报的信息',
    'report.step2.phone.placeholder': '例如：0123456789',
    'report.step2.bank.placeholder': '例如：1234567890',
    'report.step2.url.placeholder': '例如：https://example.com',
    'report.step2.other.placeholder': '例如：公司名称、电子邮箱...',
    'report.step2.privacy': '此信息将被保密，仅用于警告社区',
    'report.step3.title': '描述事件',
    'report.step3.category.label': '诈骗类型',
    'report.step3.description.label': '详细描述事件',
    'report.step3.description.placeholder': '请描述发生了什么：他们说了什么，要求什么，发生时间...',
    'report.step3.description.tip': '越详细，警告效果越好',
    'report.step4.title': '证据（可选）',
    'report.step4.upload.label': '上传证据',
    'report.step4.upload.description': '消息截图、通话记录或任何其他证据（非必需）',
    'report.step4.upload.instruction': '拖拽文件到这里或点击选择',
    'report.step4.upload.button': '选择文件',
    'report.step4.files.selected': '已选择文件：',
    'report.step4.remove': '删除',
    'report.step4.privacy.title': '隐私承诺',
    'report.step4.privacy.message': '您提供的所有信息和证据将严格保密。我们仅用于验证和警告社区，不会泄露您的身份。',
    'report.categories.fake.police': '冒充警察',
    'report.categories.bank.fraud': '银行诈骗',
    'report.categories.job.scam': '网络招聘诈骗',
    'report.categories.investment': '投资诈骗',
    'report.categories.online.shopping': '网购诈骗',
    'report.categories.telecom.fraud': '冒充电信工作人员',
    'report.categories.fake.promotion': '虚假促销',
    'report.categories.other': '其他',
    'report.navigation.back': '返回',
    'report.navigation.continue': '继续',
    'report.navigation.submit': '提交举报',
    'report.navigation.submitting': '提交中...',
    'report.success.title': '举报已提交！',
    'report.success.message': '感谢您帮助保护社区。您的举报将尽快得到审核和验证。',
    'report.success.home': '回到首页',
    'report.success.report.another': '举报其他',
    
    // Language names
    'language.english': 'English',
    'language.vietnamese': 'Tiếng Việt',
    'language.chinese': '中文',
    'language.spanish': 'Español'
  },
  es: {
    // Header
    'app.name': 'CiberGuardián',
    'app.tagline': 'Verifica antes de confiar',
    'header.login': 'Iniciar Sesión',
    
    // Hero Section
    'hero.title.line1': '¿Recibiste un mensaje sospechoso?',
    'hero.title.line2': 'Verifica antes de confiar.',
    'hero.subtitle': 'CiberGuardián es un escudo comunitario gratuito que te ayuda a verificar y reportar estafas en línea en segundos.',
    'hero.search.placeholder': 'Ingresa número de teléfono, cuenta bancaria, sitio web para verificar...',
    'hero.search.button': 'Verificar',
    'hero.report.button': 'Reportar Estafa',
    'hero.examples': 'Prueba con ejemplos:',
    'hero.examples.dangerous': '(Peligroso)',
    'hero.examples.suspicious': '(Sospechoso)',
    'hero.examples.safe': '(Seguro)',
    
    // Stats
    'stats.reports.processed': 'Reportes Procesados',
    'stats.users.joined': 'Usuarios Unidos',
    'stats.situations.prevented': 'Situaciones Prevenidas',
    
    // Recent Warnings
    'warnings.title': 'Tablero de Alertas',
    'warnings.subtitle': 'Últimas alertas de la comunidad',
    'warnings.reports': 'reportes',
    'warnings.view.details': 'Ver detalles →',
    'warnings.categories.fake.police': 'Falsa Policía',
    'warnings.categories.bank.fraud': 'Fraude Bancario',
    'warnings.categories.job.scam': 'Estafa de Trabajo Online',
    
    // How it works
    'how.title': '¿Cómo funciona CiberGuardián?',
    'how.step1.title': '1. Búsqueda Instantánea',
    'how.step1.desc': 'Ingresa información sospechosa en la barra de búsqueda',
    'how.step2.title': '2. Recibe Alertas',
    'how.step2.desc': 'Ve resultados de la base de datos comunitaria',
    'how.step3.title': '3. Protege Juntos',
    'how.step3.desc': 'Reporta para ayudar a otros',
    
    // Footer
    'footer.description': 'Únete a miles de usuarios construyendo un espacio digital más seguro. Cada reporte que haces ayuda a proteger la comunidad.',
    'footer.links': 'Enlaces',
    'footer.user.guide': 'Guía del Usuario',
    'footer.faq': 'Preguntas Frecuentes',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',
    'footer.contact': 'Contacto',
    'footer.email': 'Email: support@ciberguardian.com',
    'footer.hotline': 'Línea directa: 1900-xxx-xxx',
    'footer.copyright': '© 2024 CiberGuardián. Todos los derechos reservados.',
    
    // Search Results
    'results.title': 'Resultados de Búsqueda',
    'results.searched.for': 'Búsqueda realizada: ',
    'results.safe.title': 'INFORMACIÓN SEGURA',
    'results.safe.message': 'No se encontraron reportes para esta información. Mantente siempre cauteloso.',
    'results.safe.description': 'No hay advertencias de la comunidad para esta información.',
    'results.safe.action': 'Quiero reportar',
    'results.suspicious.title': 'ADVERTENCIA SOSPECHOSA',
    'results.suspicious.message': 'Existen algunos reportes para esta información. Ten cuidado.',
    'results.suspicious.description': 'La comunidad ha enviado algunas advertencias sobre esta información.',
    'results.suspicious.action': 'Yo también lo experimenté',
    'results.dangerous.title': 'ADVERTENCIA DE PELIGRO',
    'results.dangerous.message': 'Múltiples reportes de estafa para esta información. ¡ABSOLUTAMENTE NO confíes!',
    'results.dangerous.description': 'Muchos usuarios han reportado actividades fraudulentas de esta información.',
    'results.dangerous.action': 'Yo también fui estafado',
    'results.reports.received': 'Reportes Recibidos',
    'results.verified': 'Verificado',
    'results.reliability': 'Confiabilidad',
    'results.related.reports': 'Reportes Relacionados',
    'results.reported.at': 'reportado',
    'results.verified.by': 'personas confirmaron',
    'results.safety.tip': 'Consejo de Seguridad:',
    'results.safety.message': 'Independientemente de los resultados, siempre verifica cuidadosamente antes de proporcionar información personal o transferir dinero. Cuando tengas dudas, contacta directamente a la organización oficial.',
    'results.back': 'Volver',
    'results.share.warning': 'Compartir Advertencia',
    
    // Report Form
    'report.title': 'Reportar Estafa',
    'report.subtitle': 'Ayuda a la comunidad compartiendo información sobre estafas',
    'report.step1.title': 'Tipo de información a reportar',
    'report.step1.question': '¿Qué tipo de información quieres reportar?',
    'report.step1.phone': 'Número de Teléfono',
    'report.step1.phone.desc': 'Número telefónico de estafa',
    'report.step1.bank': 'Cuenta Bancaria',
    'report.step1.bank.desc': 'Cuenta bancaria o información bancaria',
    'report.step1.url': 'Sitio Web/Enlace',
    'report.step1.url.desc': 'Sitio web o enlace de estafa',
    'report.step1.other': 'Otro',
    'report.step1.other.desc': 'Otros tipos de estafas',
    'report.step2.title': 'Información Detallada',
    'report.step2.phone.label': 'Ingresa número de teléfono',
    'report.step2.bank.label': 'Ingresa número de cuenta bancaria',
    'report.step2.url.label': 'Ingresa sitio web o enlace',
    'report.step2.other.label': 'Describe la información a reportar',
    'report.step2.phone.placeholder': 'ej. 0123456789',
    'report.step2.bank.placeholder': 'ej. 1234567890',
    'report.step2.url.placeholder': 'ej. https://example.com',
    'report.step2.other.placeholder': 'ej. Nombre de empresa, dirección de email...',
    'report.step2.privacy': 'Esta información será confidencial y solo se usará para advertir a la comunidad',
    'report.step3.title': 'Describir el incidente',
    'report.step3.category.label': 'Tipo de estafa',
    'report.step3.description.label': 'Descripción detallada del incidente',
    'report.step3.description.placeholder': 'Por favor describe lo que pasó: qué dijeron, qué pidieron, cuándo ocurrió...',
    'report.step3.description.tip': 'Mientras más detallado, más efectiva la advertencia',
    'report.step4.title': 'Evidencia (opcional)',
    'report.step4.upload.label': 'Subir evidencia',
    'report.step4.upload.description': 'Capturas de pantalla de mensajes, llamadas, o cualquier otra evidencia (no requerido)',
    'report.step4.upload.instruction': 'Arrastra y suelta archivos aquí o haz clic para seleccionar',
    'report.step4.upload.button': 'Elegir archivos',
    'report.step4.files.selected': 'Archivos seleccionados:',
    'report.step4.remove': 'Eliminar',
    'report.step4.privacy.title': 'Compromiso de Privacidad',
    'report.step4.privacy.message': 'Toda la información y evidencia que proporciones será estrictamente confidencial. Solo la usamos para verificar y advertir a la comunidad sin revelar tu identidad.',
    'report.categories.fake.police': 'Falsa Policía',
    'report.categories.bank.fraud': 'Fraude Bancario',
    'report.categories.job.scam': 'Estafa de Trabajo Online',
    'report.categories.investment': 'Fraude de Inversión',
    'report.categories.online.shopping': 'Compras en Línea',
    'report.categories.telecom.fraud': 'Personal Falso de Telecomunicaciones',
    'report.categories.fake.promotion': 'Promoción Falsa',
    'report.categories.other': 'Otro',
    'report.navigation.back': 'Volver',
    'report.navigation.continue': 'Continuar',
    'report.navigation.submit': 'Enviar Reporte',
    'report.navigation.submitting': 'Enviando...',
    'report.success.title': '¡Reporte Enviado!',
    'report.success.message': 'Gracias por ayudar a proteger la comunidad. Tu reporte será revisado y verificado lo antes posible.',
    'report.success.home': 'Ir al Inicio',
    'report.success.report.another': 'Reportar Otro',
    
    // Language names
    'language.english': 'English',
    'language.vietnamese': 'Tiếng Việt',
    'language.chinese': '中文',
    'language.spanish': 'Español'
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'vi', 'zh', 'es'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
