
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'vi' | 'zh' | 'es';

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface Translation {
  [key: string]: string | Translation;
}

const translations: { [key: string]: Translation } = {
  en: {
    home: {
      hero: {
        title: 'Protecting the Vietnamese Community from Online Scams',
        subtitle: 'AI-powered scam detection and community reporting platform'
      },
      search: {
        placeholder: 'Search for phone numbers, URLs, or keywords...',
        button: 'Search'
      },
      report: {
        button: 'Report a Scam'
      },
      features: {
        ai: {
          title: 'AI-Powered Detection',
          description: 'Advanced AI analyzes patterns to identify potential scams'
        },
        community: {
          title: 'Community Reports',
          description: 'Real reports from Vietnamese community members'
        },
        verified: {
          title: 'Verified Information',
          description: 'Cross-referenced data for accurate results'
        }
      },
      alerts: {
        title: 'Recent Scam Alerts',
        recent: 'Recently reported',
        reported: 'Reported',
        times: 'times'
      },
      trust: {
        title: 'Join the Fight Against Scams',
        description: 'Together, we can make the internet a safer place for everyone.'
      }
    },
    report: {
      title: 'Report a Scam',
      subtitle: 'Help protect others by reporting scams you encounter.',
      step1: {
        title: 'Target Type',
        question: 'What are you reporting?',
        phone: 'Phone Number',
        phoneDesc: 'Report a suspicious phone number',
        bank: 'Bank Account',
        bankDesc: 'Report a fraudulent bank account',
        url: 'Website / URL',
        urlDesc: 'Report a phishing or scam website',
        other: 'Other',
        otherDesc: 'Report other types of scams'
      },
      step2: {
        title: 'Target Details',
        phone: {
          label: 'Enter Phone Number',
          placeholder: 'e.g., 0901234567'
        },
        bank: {
          label: 'Enter Bank Account Number',
          placeholder: 'e.g., 19038828811011'
        },
        url: {
          label: 'Enter Website URL',
          placeholder: 'e.g., scamwebsite.com'
        },
        other: {
          label: 'Describe the Target',
          placeholder: 'Describe what you are reporting'
        },
        privacy: 'We will not share your personal information with the reported target.'
      },
      step3: {
        title: 'Scam Details',
        category: {
          label: 'Select Scam Category'
        },
        description: {
          label: 'Describe the Scam',
          placeholder: 'Provide details about the scam, how it works, and what happened.',
          tip: 'The more details you provide, the better we can understand and prevent similar scams.'
        }
      },
      step4: {
        title: 'Evidence (Optional)',
        upload: {
          label: 'Upload Evidence',
          description: 'Upload screenshots, documents, or other evidence to support your report.',
          instruction: 'Drag and drop files here or click to upload',
          button: 'Upload Files'
        },
        files: {
          selected: 'Selected Files'
        },
        remove: 'Remove',
        privacy: {
          title: 'Privacy Notice',
          message: 'Your uploaded files will be securely stored and used only for scam analysis. We will not share your personal information.'
        }
      },
      categories: {
        fakePolice: 'Fake Police/Gov Official',
        bankFraud: 'Bank Fraud/Phishing',
        jobScam: 'Job Scam',
        investment: 'Investment Scam',
        onlineShopping: 'Online Shopping Scam',
        telecomFraud: 'Telecom Fraud',
        fakePromotion: 'Fake Promotion',
        other: 'Other'
      },
      navigation: {
        back: 'Back',
        continue: 'Continue',
        submit: 'Submit Report',
        submitting: 'Submitting...'
      },
      success: {
        title: 'Report Submitted!',
        message: 'Thank you for helping protect the community. Your report will be reviewed by our team.',
        home: 'Back to Home',
        reportAnother: 'Report Another Scam'
      },
      titleAI: 'AI Analysis'
    },
    results: {
      title: 'Search Results',
      back: 'Back to Home',
      risk: {
        safe: 'No significant risk detected',
        suspicious: 'Potentially suspicious',
        dangerous: 'High risk of scam'
      },
      confidence: 'Confidence Level',
      reportCount: 'Community Reports',
      aiAnalysis: 'AI Analysis',
      reasons: 'Reasons',
      relatedReports: 'Related Reports',
      report: 'Report',
      summary: 'Summary'
    },
    aiKey: {
      title: 'AI Enhancement Setup',
      description: 'To enable advanced AI scam detection, please enter your Google Gemini API key. This will be stored locally and used to analyze content for scam patterns.',
      inputPlaceholder: 'Enter your Gemini API key',
      getKey: 'Get your free API key at: ',
      saveEnable: 'Save & Enable AI',
      cancel: 'Cancel',
      remove: 'Remove AI Key',
      aiEnhanced: 'AI Enhanced',
      configure: 'Configure',
      enableAI: 'Enable AI Analysis'
    },
    image: {
      analysis: {
        title: "Image Analysis",
        details: "AI Analysis Details"
      },
      upload: {
        instruction: "Upload a screenshot or image to analyze for scam patterns",
        button: "Select Image"
      },
      analyze: {
        button: "Analyze Image"
      },
      analyzing: "Analyzing...",
      clear: "Clear",
      extracted: {
        info: "Extracted Information"
      }
    },
    language: {
      english: 'English',
      vietnamese: 'Vietnamese',
      chinese: 'Chinese',
      spanish: 'Spanish'
    },
    footer: {
      copyright: '© 2024 Vệ Binh Mạng. All rights reserved.'
    }
  },
  vi: {
    home: {
      hero: {
        title: 'Bảo Vệ Cộng Đồng Việt Nam Khỏi Lừa Đảo Trực Tuyến',
        subtitle: 'Nền tảng phát hiện lừa đảo bằng AI và báo cáo cộng đồng'
      },
      search: {
        placeholder: 'Tìm kiếm số điện thoại, URL hoặc từ khóa...',
        button: 'Tìm kiếm'
      },
      report: {
        button: 'Báo Cáo Lừa Đảo'
      },
      features: {
        ai: {
          title: 'Phát Hiện Bằng AI',
          description: 'AI tiên tiến phân tích các mẫu để xác định lừa đảo tiềm ẩn'
        },
        community: {
          title: 'Báo Cáo Cộng Đồng',
          description: 'Báo cáo thực từ các thành viên cộng đồng Việt Nam'
        },
        verified: {
          title: 'Thông Tin Xác Minh',
          description: 'Dữ liệu được tham chiếu chéo để có kết quả chính xác'
        }
      },
      alerts: {
        title: 'Cảnh Báo Lừa Đảo Gần Đây',
        recent: 'Vừa được báo cáo',
        reported: 'Đã báo cáo',
        times: 'lần'
      },
      trust: {
        title: 'Tham Gia Chống Lại Lừa Đảo',
        description: 'Cùng nhau, chúng ta có thể làm cho internet trở nên an toàn hơn cho mọi người.'
      }
    },
    report: {
      title: 'Báo Cáo Lừa Đảo',
      subtitle: 'Giúp bảo vệ người khác bằng cách báo cáo các hành vi lừa đảo bạn gặp phải.',
      step1: {
        title: 'Loại Đối Tượng',
        question: 'Bạn đang báo cáo về cái gì?',
        phone: 'Số Điện Thoại',
        phoneDesc: 'Báo cáo một số điện thoại đáng ngờ',
        bank: 'Tài Khoản Ngân Hàng',
        bankDesc: 'Báo cáo một tài khoản ngân hàng gian lận',
        url: 'Trang Web / URL',
        urlDesc: 'Báo cáo một trang web lừa đảo hoặc giả mạo',
        other: 'Khác',
        otherDesc: 'Báo cáo các loại lừa đảo khác'
      },
      step2: {
        title: 'Chi Tiết Đối Tượng',
        phone: {
          label: 'Nhập Số Điện Thoại',
          placeholder: 'ví dụ: 0901234567'
        },
        bank: {
          label: 'Nhập Số Tài Khoản Ngân Hàng',
          placeholder: 'ví dụ: 19038828811011'
        },
        url: {
          label: 'Nhập URL Trang Web',
          placeholder: 'ví dụ: trangwebgiandao.com'
        },
        other: {
          label: 'Mô Tả Đối Tượng',
          placeholder: 'Mô tả những gì bạn đang báo cáo'
        },
        privacy: 'Chúng tôi sẽ không chia sẻ thông tin cá nhân của bạn với đối tượng bị báo cáo.'
      },
      step3: {
        title: 'Chi Tiết Lừa Đảo',
        category: {
          label: 'Chọn Danh Mục Lừa Đảo'
        },
        description: {
          label: 'Mô Tả Vụ Lừa Đảo',
          placeholder: 'Cung cấp chi tiết về vụ lừa đảo, cách thức hoạt động và những gì đã xảy ra.',
          tip: 'Bạn cung cấp càng nhiều chi tiết, chúng tôi càng hiểu rõ hơn và ngăn chặn các vụ lừa đảo tương tự.'
        }
      },
      step4: {
        title: 'Bằng Chứng (Tùy Chọn)',
        upload: {
          label: 'Tải Lên Bằng Chứng',
          description: 'Tải lên ảnh chụp màn hình, tài liệu hoặc bằng chứng khác để hỗ trợ báo cáo của bạn.',
          instruction: 'Kéo và thả tệp vào đây hoặc nhấp để tải lên',
          button: 'Tải Lên Tệp'
        },
        files: {
          selected: 'Các Tệp Đã Chọn'
        },
        remove: 'Xóa',
        privacy: {
          title: 'Thông Báo Về Quyền Riêng Tư',
          message: 'Các tệp bạn tải lên sẽ được lưu trữ an toàn và chỉ được sử dụng cho mục đích phân tích lừa đảo. Chúng tôi sẽ không chia sẻ thông tin cá nhân của bạn.'
        }
      },
      categories: {
        fakePolice: 'Giả Danh Công An/Quan Chức',
        bankFraud: 'Gian Lận/Lừa Đảo Ngân Hàng',
        jobScam: 'Lừa Đảo Việc Làm',
        investment: 'Lừa Đảo Đầu Tư',
        onlineShopping: 'Lừa Đảo Mua Sắm Trực Tuyến',
        telecomFraud: 'Lừa Đảo Viễn Thông',
        fakePromotion: 'Khuyến Mãi Giả Mạo',
        other: 'Khác'
      },
      navigation: {
        back: 'Quay Lại',
        continue: 'Tiếp Tục',
        submit: 'Gửi Báo Cáo',
        submitting: 'Đang Gửi...'
      },
      success: {
        title: 'Đã Gửi Báo Cáo!',
        message: 'Cảm ơn bạn đã giúp bảo vệ cộng đồng. Báo cáo của bạn sẽ được xem xét bởi đội ngũ của chúng tôi.',
        home: 'Về Trang Chủ',
        reportAnother: 'Báo Cáo Vụ Lừa Đảo Khác'
      },
      titleAI: 'Phân tích AI'
    },
    results: {
      title: 'Kết Quả Tìm Kiếm',
      back: 'Về Trang Chủ',
      risk: {
        safe: 'Không phát hiện rủi ro đáng kể',
        suspicious: 'Có khả năng đáng ngờ',
        dangerous: 'Nguy cơ lừa đảo cao'
      },
      confidence: 'Mức Độ Tin Cậy',
      reportCount: 'Báo Cáo Từ Cộng Đồng',
      aiAnalysis: 'Phân Tích AI',
      reasons: 'Lý Do',
      relatedReports: 'Báo Cáo Liên Quan',
      report: 'Báo cáo',
      summary: 'Tóm tắt'
    },
    aiKey: {
      title: 'Thiết Lập Nâng Cao AI',
      description: 'Để kích hoạt tính năng phát hiện lừa đảo nâng cao bằng AI, vui lòng nhập khóa API Google Gemini của bạn. Khóa này sẽ được lưu trữ cục bộ và sử dụng để phân tích nội dung nhằm tìm các mẫu lừa đảo.',
      inputPlaceholder: 'Nhập khóa API Gemini của bạn',
      getKey: 'Nhận khóa API miễn phí của bạn tại: ',
      saveEnable: 'Lưu & Kích Hoạt AI',
      cancel: 'Hủy',
      remove: 'Xóa Khóa AI',
      aiEnhanced: 'Tăng Cường AI',
      configure: 'Cấu Hình',
      enableAI: 'Kích Hoạt Phân Tích AI'
    },
    image: {
      analysis: {
        title: "Phân Tích Hình Ảnh",
        details: "Chi Tiết Phân Tích AI"
      },
      upload: {
        instruction: "Tải lên ảnh chụp màn hình để phân tích các dấu hiệu lừa đảo",
        button: "Chọn Hình Ảnh"
      },
      analyze: {
        button: "Phân Tích Hình Ảnh"
      },
      analyzing: "Đang phân tích...",
      clear: "Xóa",
      extracted: {
        info: "Thông Tin Trích Xuất"
      }
    },
    language: {
      english: 'Tiếng Anh',
      vietnamese: 'Tiếng Việt',
      chinese: 'Tiếng Trung',
      spanish: 'Tiếng Tây Ban Nha'
    },
    footer: {
      copyright: '© 2024 Vệ Binh Mạng. Bảo lưu mọi quyền.'
    }
  },
  zh: {
    home: {
      hero: {
        title: '保护越南社区免受网络诈骗',
        subtitle: 'AI驱动的诈骗检测和社区报告平台'
      },
      search: {
        placeholder: '搜索电话号码、网址或关键词...',
        button: '搜索'
      },
      report: {
        button: '报告诈骗'
      },
      features: {
        ai: {
          title: 'AI驱动检测',
          description: '先进的AI分析模式以识别潜在诈骗'
        },
        community: {
          title: '社区报告',
          description: '来自越南社区成员的真实报告'
        },
        verified: {
          title: '验证信息',
          description: '交叉引用数据以获得准确结果'
        }
      },
      alerts: {
        title: '最近的诈骗警报',
        recent: '最近报告',
        reported: '已报告',
        times: '次'
      },
      trust: {
        title: '加入打击诈骗的行列',
        description: '齐心协力，我们可以让互联网对每个人都更安全。'
      }
    },
    report: {
      title: '报告诈骗',
      subtitle: '通过报告您遇到的诈骗行为，帮助保护他人。',
      step1: {
        title: '目标类型',
        question: '您要报告什么？',
        phone: '电话号码',
        phoneDesc: '报告可疑电话号码',
        bank: '银行账户',
        bankDesc: '报告欺诈性银行账户',
        url: '网站/网址',
        urlDesc: '报告网络钓鱼或诈骗网站',
        other: '其他',
        otherDesc: '报告其他类型的诈骗'
      },
      step2: {
        title: '目标详情',
        phone: {
          label: '输入电话号码',
          placeholder: '例如，0901234567'
        },
        bank: {
          label: '输入银行账号',
          placeholder: '例如，19038828811011'
        },
        url: {
          label: '输入网站网址',
          placeholder: '例如，scamwebsite.com'
        },
        other: {
          label: '描述目标',
          placeholder: '描述您要报告的内容'
        },
        privacy: '我们不会与被报告的目标分享您的个人信息。'
      },
      step3: {
        title: '诈骗详情',
        category: {
          label: '选择诈骗类别'
        },
        description: {
          label: '描述诈骗',
          placeholder: '提供有关诈骗的详细信息、其运作方式以及发生的情况。',
          tip: '您提供的详细信息越多，我们就越能理解和预防类似的诈骗。'
        }
      },
      step4: {
        title: '证据（可选）',
        upload: {
          label: '上传证据',
          description: '上传屏幕截图、文档或其他证据以支持您的报告。',
          instruction: '将文件拖放到此处或单击以上传',
          button: '上传文件'
        },
        files: {
          selected: '选定的文件'
        },
        remove: '移除',
        privacy: {
          title: '隐私声明',
          message: '您上传的文件将被安全存储，仅用于诈骗分析。我们不会分享您的个人信息。'
        }
      },
      categories: {
        fakePolice: '假冒警察/政府官员',
        bankFraud: '银行欺诈/网络钓鱼',
        jobScam: '求职诈骗',
        investment: '投资诈骗',
        onlineShopping: '网上购物诈骗',
        telecomFraud: '电信诈骗',
        fakePromotion: '虚假促销',
        other: '其他'
      },
      navigation: {
        back: '返回',
        continue: '继续',
        submit: '提交报告',
        submitting: '提交中...'
      },
      success: {
        title: '报告已提交！',
        message: '感谢您帮助保护社区。您的报告将由我们的团队审核。',
        home: '返回主页',
        reportAnother: '报告另一起诈骗'
      },
      titleAI: 'AI分析'
    },
    results: {
      title: '搜索结果',
      back: '返回主页',
      risk: {
        safe: '未检测到重大风险',
        suspicious: '可能可疑',
        dangerous: '高诈骗风险'
      },
      confidence: '信心水平',
      reportCount: '社区报告',
      aiAnalysis: 'AI分析',
      reasons: '理由',
      relatedReports: '相关报告',
      report: '报告',
      summary: '概要'
    },
    aiKey: {
      title: 'AI增强设置',
      description: '要启用高级AI诈骗检测，请输入您的Google Gemini API密钥。该密钥将存储在本地，并用于分析内容以查找诈骗模式。',
      inputPlaceholder: '输入您的Gemini API密钥',
      getKey: '在以下位置获取您的免费API密钥：',
      saveEnable: '保存并启用AI',
      cancel: '取消',
      remove: '删除AI密钥',
      aiEnhanced: 'AI增强',
      configure: '配置',
      enableAI: '启用AI分析'
    },
    image: {
      analysis: {
        title: "图像分析",
        details: "AI分析详情"
      },
      upload: {
        instruction: "上传截图或图片以分析诈骗模式",
        button: "选择图片"
      },
      analyze: {
        button: "分析图片"
      },
      analyzing: "分析中...",
      clear: "清除",
      extracted: {
        info: "提取信息"
      }
    },
    language: {
      english: '英语',
      vietnamese: '越南语',
      chinese: '中文',
      spanish: '西班牙语'
    },
    footer: {
      copyright: '© 2024 Vệ Binh Mạng. 版权所有。'
    }
  },
  es: {
    home: {
      hero: {
        title: 'Protegiendo a la Comunidad Vietnamita de las Estafas en Línea',
        subtitle: 'Plataforma de detección de estafas impulsada por IA y reporte comunitario'
      },
      search: {
        placeholder: 'Buscar números de teléfono, URLs o palabras clave...',
        button: 'Buscar'
      },
      report: {
        button: 'Reportar una Estafa'
      },
      features: {
        ai: {
          title: 'Detección Impulsada por IA',
          description: 'IA avanzada analiza patrones para identificar posibles estafas'
        },
        community: {
          title: 'Reportes de la Comunidad',
          description: 'Reportes reales de miembros de la comunidad vietnamita'
        },
        verified: {
          title: 'Información Verificada',
          description: 'Datos referenciados cruzadamente para resultados precisos'
        }
      },
      alerts: {
        title: 'Alertas de Estafas Recientes',
        recent: 'Recientemente reportado',
        reported: 'Reportado',
        times: 'veces'
      },
      trust: {
        title: 'Únete a la Lucha Contra las Estafas',
        description: 'Juntos, podemos hacer de Internet un lugar más seguro para todos.'
      }
    },
    report: {
      title: 'Reportar una Estafa',
      subtitle: 'Ayuda a proteger a otros reportando las estafas que encuentres.',
      step1: {
        title: 'Tipo de Objetivo',
        question: '¿Qué estás reportando?',
        phone: 'Número de Teléfono',
        phoneDesc: 'Reportar un número de teléfono sospechoso',
        bank: 'Cuenta Bancaria',
        bankDesc: 'Reportar una cuenta bancaria fraudulenta',
        url: 'Sitio Web / URL',
        urlDesc: 'Reportar un sitio web de phishing o estafa',
        other: 'Otro',
        otherDesc: 'Reportar otros tipos de estafas'
      },
      step2: {
        title: 'Detalles del Objetivo',
        phone: {
          label: 'Ingresar Número de Teléfono',
          placeholder: 'ej., 0901234567'
        },
        bank: {
          label: 'Ingresar Número de Cuenta Bancaria',
          placeholder: 'ej., 19038828811011'
        },
        url: {
          label: 'Ingresar URL del Sitio Web',
          placeholder: 'ej., sitioestafa.com'
        },
        other: {
          label: 'Describir el Objetivo',
          placeholder: 'Describir qué estás reportando'
        },
        privacy: 'No compartiremos tu información personal con el objetivo reportado.'
      },
      step3: {
        title: 'Detalles de la Estafa',
        category: {
          label: 'Seleccionar Categoría de Estafa'
        },
        description: {
          label: 'Describir la Estafa',
          placeholder: 'Proporcionar detalles sobre la estafa, cómo funciona y qué sucedió.',
          tip: 'Cuantos más detalles proporciones, mejor podremos entender y prevenir estafas similares.'
        }
      },
      step4: {
        title: 'Evidencia (Opcional)',
        upload: {
          label: 'Subir Evidencia',
          description: 'Subir capturas de pantalla, documentos u otra evidencia para apoyar tu reporte.',
          instruction: 'Arrastra y suelta archivos aquí o haz clic para subir',
          button: 'Subir Archivos'
        },
        files: {
          selected: 'Archivos Seleccionados'
        },
        remove: 'Eliminar',
        privacy: {
          title: 'Aviso de Privacidad',
          message: 'Tus archivos subidos se almacenarán de forma segura y solo se utilizarán para análisis de estafas. No compartiremos tu información personal.'
        }
      },
      categories: {
        fakePolice: 'Policía/Funcionario del Gobierno Falso',
        bankFraud: 'Fraude Bancario/Phishing',
        jobScam: 'Estafa de Empleo',
        investment: 'Estafa de Inversión',
        onlineShopping: 'Estafa de Compras en Línea',
        telecomFraud: 'Fraude de Telecomunicaciones',
        fakePromotion: 'Promoción Falsa',
        other: 'Otro'
      },
      navigation: {
        back: 'Volver',
        continue: 'Continuar',
        submit: 'Enviar Reporte',
        submitting: 'Enviando...'
      },
      success: {
        title: '¡Reporte Enviado!',
        message: 'Gracias por ayudar a proteger a la comunidad. Tu reporte será revisado por nuestro equipo.',
        home: 'Volver al Inicio',
        reportAnother: 'Reportar Otra Estafa'
      },
      titleAI: 'Análisis de IA'
    },
    results: {
      title: 'Resultados de la Búsqueda',
      back: 'Volver al Inicio',
      risk: {
        safe: 'No se detectó riesgo significativo',
        suspicious: 'Potencialmente sospechoso',
        dangerous: 'Alto riesgo de estafa'
      },
      confidence: 'Nivel de Confianza',
      reportCount: 'Reportes de la Comunidad',
      aiAnalysis: 'Análisis de IA',
      reasons: 'Razones',
      relatedReports: 'Reportes Relacionados',
      report: 'Reporte',
      summary: 'Resumen'
    },
    aiKey: {
      title: 'Configuración de Mejora de IA',
      description: 'Para habilitar la detección avanzada de estafas con IA, ingresa tu clave API de Google Gemini. Esta clave se almacenará localmente y se utilizará para analizar el contenido en busca de patrones de estafa.',
      inputPlaceholder: 'Ingresa tu clave API de Gemini',
      getKey: 'Obtén tu clave API gratuita en: ',
      saveEnable: 'Guardar y Habilitar IA',
      cancel: 'Cancelar',
      remove: 'Eliminar Clave de IA',
      aiEnhanced: 'IA Mejorada',
      configure: 'Configurar',
      enableAI: 'Habilitar Análisis de IA'
    },
    image: {
      analysis: {
        title: "Análisis de Imagen",
        details: "Detalles del Análisis AI"
      },
      upload: {
        instruction: "Sube una captura de pantalla o imagen para analizar patrones de estafa",
        button: "Seleccionar Imagen"
      },
      analyze: {
        button: "Analizar Imagen"
      },
      analyzing: "Analizando...",
      clear: "Limpiar",
      extracted: {
        info: "Información Extraída"
      }
    },
    language: {
      english: 'Inglés',
      vietnamese: 'Vietnamita',
      chinese: 'Chino',
      spanish: 'Español'
    },
    footer: {
      copyright: '© 2024 Vệ Binh Mạng. Todos los derechos reservados.'
    }
  }
};

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'vi';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { LanguageProvider, useLanguage };
