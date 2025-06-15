
import { AIProvider, AIProviderCredentials, AI_PROVIDERS } from '@/types/aiProviders';
import { createAIProvider, BaseAIProvider } from './aiProviders';
import { ScamAnalysisRequest, ScamAnalysisResponse } from './aiAgent';

class AIManager {
  private providers: Map<AIProvider, BaseAIProvider> = new Map();
  private activeProvider: AIProvider | null = null;

  // Load credentials from localStorage
  loadCredentials(): AIProviderCredentials[] {
    const stored = localStorage.getItem('ai_provider_credentials');
    return stored ? JSON.parse(stored) : [];
  }

  // Save credentials to localStorage
  saveCredentials(credentials: AIProviderCredentials[]): void {
    localStorage.setItem('ai_provider_credentials', JSON.stringify(credentials));
  }

  // Add or update provider credentials
  setProviderCredentials(provider: AIProvider, apiKey: string): boolean {
    try {
      const providerInstance = createAIProvider(provider, apiKey);
      const success = providerInstance.initialize();
      
      if (success) {
        this.providers.set(provider, providerInstance);
        
        // Update stored credentials
        const credentials = this.loadCredentials();
        const existingIndex = credentials.findIndex(c => c.provider === provider);
        
        const newCredential: AIProviderCredentials = {
          provider,
          apiKey,
          isActive: true
        };

        if (existingIndex >= 0) {
          credentials[existingIndex] = newCredential;
        } else {
          credentials.push(newCredential);
        }

        this.saveCredentials(credentials);
        
        // Set as active if it's the first provider or no active provider
        if (!this.activeProvider || !this.isProviderAvailable(this.activeProvider)) {
          this.activeProvider = provider;
        }
        
        console.log(`${AI_PROVIDERS[provider].name} configured successfully`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to configure ${provider}:`, error);
      return false;
    }
  }

  // Remove provider credentials
  removeProvider(provider: AIProvider): void {
    this.providers.delete(provider);
    
    const credentials = this.loadCredentials().filter(c => c.provider !== provider);
    this.saveCredentials(credentials);
    
    if (this.activeProvider === provider) {
      this.activeProvider = this.getAvailableProviders()[0] || null;
    }
  }

  // Set active provider
  setActiveProvider(provider: AIProvider): boolean {
    if (this.isProviderAvailable(provider)) {
      this.activeProvider = provider;
      return true;
    }
    return false;
  }

  // Get active provider
  getActiveProvider(): AIProvider | null {
    return this.activeProvider;
  }

  // Check if provider is available
  isProviderAvailable(provider: AIProvider): boolean {
    return this.providers.has(provider) && this.providers.get(provider)?.isAvailable() === true;
  }

  // Get list of available providers
  getAvailableProviders(): AIProvider[] {
    return Array.from(this.providers.keys()).filter(p => this.isProviderAvailable(p));
  }

  // Get configured providers info
  getConfiguredProviders(): { provider: AIProvider; name: string; isActive: boolean }[] {
    const credentials = this.loadCredentials();
    return credentials.map(c => ({
      provider: c.provider,
      name: AI_PROVIDERS[c.provider].name,
      isActive: this.activeProvider === c.provider
    }));
  }

  // Analyze with active provider
  async analyzeScamRisk(request: ScamAnalysisRequest): Promise<ScamAnalysisResponse> {
    if (!this.activeProvider || !this.isProviderAvailable(this.activeProvider)) {
      throw new Error('No AI provider available. Please configure an AI provider first.');
    }

    const provider = this.providers.get(this.activeProvider)!;
    return await provider.analyzeScamRisk(request);
  }

  // Analyze image (only supported by some providers)
  async analyzeImage(imageFile: File): Promise<ScamAnalysisResponse> {
    if (!this.activeProvider || !this.isProviderAvailable(this.activeProvider)) {
      throw new Error('No AI provider available. Please configure an AI provider first.');
    }

    const provider = this.providers.get(this.activeProvider)!;
    
    if (provider.analyzeImage) {
      return await provider.analyzeImage(imageFile);
    } else {
      throw new Error(`${AI_PROVIDERS[this.activeProvider].name} does not support image analysis`);
    }
  }

  // Initialize from stored credentials
  initializeFromStorage(): void {
    const credentials = this.loadCredentials();
    
    for (const credential of credentials) {
      if (credential.isActive) {
        this.setProviderCredentials(credential.provider, credential.apiKey);
      }
    }
  }

  // Check if any provider is available
  hasAvailableProvider(): boolean {
    return this.getAvailableProviders().length > 0;
  }
}

// Export singleton instance
export const aiManager = new AIManager();
