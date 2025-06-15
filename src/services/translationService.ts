
// Translation service using Google Translate API
class TranslationService {
  private static instance: TranslationService;
  private cache: Map<string, string> = new Map();
  private apiKey: string | null = null;

  private constructor() {
    // Try to get API key from localStorage if available
    this.apiKey = localStorage.getItem('google_translate_api_key');
  }

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('google_translate_api_key', apiKey);
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  private getCacheKey(text: string, targetLang: string): string {
    return `${targetLang}:${text}`;
  }

  async translateText(text: string, targetLang: string): Promise<string> {
    // Return original text if same language or no API key
    if (targetLang === 'en' || !this.apiKey) {
      return text;
    }

    const cacheKey = this.getCacheKey(text, targetLang);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            target: targetLang,
            source: 'en',
            format: 'text'
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      const translatedText = data.data.translations[0].translatedText;
      
      // Cache the result
      this.cache.set(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    }
  }

  // Batch translate multiple texts
  async translateTexts(texts: string[], targetLang: string): Promise<string[]> {
    if (targetLang === 'en' || !this.apiKey) {
      return texts;
    }

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: texts,
            target: targetLang,
            source: 'en',
            format: 'text'
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Batch translation failed');
      }

      const data = await response.json();
      const translatedTexts = data.data.translations.map((t: any) => t.translatedText);
      
      // Cache the results
      texts.forEach((text, index) => {
        const cacheKey = this.getCacheKey(text, targetLang);
        this.cache.set(cacheKey, translatedTexts[index]);
      });
      
      return translatedTexts;
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts; // Return original texts on error
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const translationService = TranslationService.getInstance();
