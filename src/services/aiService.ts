import { GoogleGenerativeAI } from '@google/generative-ai';

// For demo purposes, we'll use a placeholder API key
// In production, this should be stored securely in environment variables
const GEMINI_API_KEY = 'your-gemini-api-key-here';

let genAI: GoogleGenerativeAI | null = null;

// Initialize Gemini AI
export const initializeAI = (apiKey?: string) => {
  try {
    const key = apiKey || GEMINI_API_KEY;
    if (key && key !== 'your-gemini-api-key-here') {
      genAI = new GoogleGenerativeAI(key);
      console.log('Gemini AI initialized successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to initialize Gemini AI:', error);
    return false;
  }
};

// Convert file to base64
const fileToGenerativePart = (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(',')[1]; // Remove data:image/jpeg;base64, prefix
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Analyze image for scam patterns using Gemini Vision
export const analyzeScamImage = async (imageFile: File): Promise<{
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  confidence: number;
  reasons: string[];
  aiAnalysis: string;
  extractedInfo: string[];
}> => {
  if (!genAI) {
    return {
      riskLevel: 'safe',
      confidence: 50,
      reasons: ['AI analysis not available'],
      aiAnalysis: 'Basic analysis performed without AI assistance',
      extractedInfo: []
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const imagePart = await fileToGenerativePart(imageFile);

    const prompt = `
You are a cybersecurity expert specializing in Vietnamese scam detection. Analyze this image for potential scam indicators.

Provide your analysis in this exact JSON format:
{
  "riskLevel": "safe|suspicious|dangerous",
  "confidence": 0-100,
  "reasons": ["reason1", "reason2", ...],
  "aiAnalysis": "detailed explanation in Vietnamese",
  "extractedInfo": ["phone numbers", "bank accounts", "urls", "suspicious text"]
}

Look for these Vietnamese scam patterns in the image:
- Fake police/government messages demanding money transfers
- Investment schemes with unrealistic returns
- Job scams requiring upfront payments
- Bank phishing with urgent account suspension claims
- Fake promotions requiring personal information
- Romance scams on dating platforms
- Suspicious contact information (phone numbers, bank accounts)
- Urgent language creating pressure
- Poor grammar or suspicious formatting
- Fake official logos or letterheads

Extract any phone numbers, bank accounts, URLs, or suspicious text found in the image.
Focus on Vietnamese context and language patterns. Be conservative - only mark as "dangerous" if very confident.
`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON response
    try {
      const analysis = JSON.parse(text);
      return {
        riskLevel: analysis.riskLevel || 'safe',
        confidence: Math.min(100, Math.max(0, analysis.confidence || 50)),
        reasons: Array.isArray(analysis.reasons) ? analysis.reasons : ['AI analysis completed'],
        aiAnalysis: analysis.aiAnalysis || 'Analysis completed',
        extractedInfo: Array.isArray(analysis.extractedInfo) ? analysis.extractedInfo : []
      };
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        riskLevel: text.toLowerCase().includes('dangerous') ? 'dangerous' : 
                  text.toLowerCase().includes('suspicious') ? 'suspicious' : 'safe',
        confidence: 70,
        reasons: ['AI analysis pattern detection'],
        aiAnalysis: text.substring(0, 200) + '...',
        extractedInfo: []
      };
    }
  } catch (error) {
    console.error('AI image analysis failed:', error);
    return {
      riskLevel: 'safe',
      confidence: 30,
      reasons: ['AI image analysis failed'],
      aiAnalysis: 'Unable to perform AI image analysis at this time',
      extractedInfo: []
    };
  }
};

// Analyze text for scam patterns using Gemini
export const analyzeScamContent = async (content: string, type: 'phone' | 'url' | 'text' | 'email'): Promise<{
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  confidence: number;
  reasons: string[];
  aiAnalysis: string;
}> => {
  if (!genAI) {
    // Fallback analysis without AI
    return {
      riskLevel: 'safe',
      confidence: 50,
      reasons: ['AI analysis not available'],
      aiAnalysis: 'Basic analysis performed without AI assistance'
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are a cybersecurity expert specializing in Vietnamese scam detection. Analyze this ${type} for potential scam indicators:

Content: "${content}"

Provide your analysis in this exact JSON format:
{
  "riskLevel": "safe|suspicious|dangerous",
  "confidence": 0-100,
  "reasons": ["reason1", "reason2", ...],
  "aiAnalysis": "detailed explanation in Vietnamese"
}

Consider these Vietnamese scam patterns:
- Fake police/government calls demanding money transfers
- Investment schemes promising unrealistic returns
- Job scams requiring upfront payments
- Bank phishing with urgent account suspension claims
- Fake promotions requiring personal information
- Romance scams on dating platforms

Focus on Vietnamese context and language patterns. Be conservative - only mark as "dangerous" if very confident.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON response
    try {
      const analysis = JSON.parse(text);
      return {
        riskLevel: analysis.riskLevel || 'safe',
        confidence: Math.min(100, Math.max(0, analysis.confidence || 50)),
        reasons: Array.isArray(analysis.reasons) ? analysis.reasons : ['AI analysis completed'],
        aiAnalysis: analysis.aiAnalysis || 'Analysis completed'
      };
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        riskLevel: text.toLowerCase().includes('dangerous') ? 'dangerous' : 
                  text.toLowerCase().includes('suspicious') ? 'suspicious' : 'safe',
        confidence: 70,
        reasons: ['AI analysis pattern detection'],
        aiAnalysis: text.substring(0, 200) + '...'
      };
    }
  } catch (error) {
    console.error('AI analysis failed:', error);
    return {
      riskLevel: 'safe',
      confidence: 30,
      reasons: ['AI analysis failed'],
      aiAnalysis: 'Unable to perform AI analysis at this time'
    };
  }
};

// Generate scam report summary using AI
export const generateReportSummary = async (reports: any[]): Promise<string> => {
  if (!genAI || reports.length === 0) {
    return 'Có báo cáo từ cộng đồng về đối tượng này';
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const reportsText = reports.map(r => `${r.category}: ${r.description}`).join('\n');
    
    const prompt = `
Tóm tắt các báo cáo lừa đảo sau thành một đoạn văn ngắn gọn (tối đa 100 từ) bằng tiếng Việt:

${reportsText}

Hãy tập trung vào:
- Phương thức lừa đảo chính
- Mức độ nguy hiểm
- Lời khuyên bảo vệ

Viết theo giọng cảnh báo nhưng không gây hoảng loạn.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || 'Có nhiều báo cáo về hoạt động đáng ngờ liên quan đến đối tượng này';
  } catch (error) {
    console.error('Failed to generate report summary:', error);
    return 'Có báo cáo từ cộng đồng về đối tượng này';
  }
};

// Check if AI is available
export const isAIAvailable = (): boolean => {
  return genAI !== null;
};
