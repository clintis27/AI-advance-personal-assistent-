
/**
 * AI Service Layer
 * Centralized service for all AI operations
 * Integrates OpenAI, LangChain, and Pinecone
 */

import { SecureStorage } from '@/utils/secureStorage';

export interface AIServiceConfig {
  openaiEndpoint?: string;
  langchainEndpoint?: string;
  pineconeEndpoint?: string;
  whisperEndpoint?: string;
  elevenLabsEndpoint?: string;
}

export class AIService {
  private static instance: AIService;
  private config: AIServiceConfig = {};

  private constructor() {
    this.loadConfig();
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Load configuration from secure storage
   */
  private async loadConfig() {
    console.log('Loading AI service configuration...');
    
    this.config = {
      openaiEndpoint: await SecureStorage.getItem('openai_endpoint') || undefined,
      langchainEndpoint: await SecureStorage.getItem('langchain_endpoint') || undefined,
      pineconeEndpoint: await SecureStorage.getItem('pinecone_endpoint') || undefined,
      whisperEndpoint: await SecureStorage.getItem('whisper_endpoint') || undefined,
      elevenLabsEndpoint: await SecureStorage.getItem('elevenlabs_endpoint') || undefined,
    };
  }

  /**
   * Update configuration
   */
  async updateConfig(config: Partial<AIServiceConfig>) {
    console.log('Updating AI service configuration...');
    
    if (config.openaiEndpoint) {
      await SecureStorage.setItem('openai_endpoint', config.openaiEndpoint);
      this.config.openaiEndpoint = config.openaiEndpoint;
    }
    
    if (config.langchainEndpoint) {
      await SecureStorage.setItem('langchain_endpoint', config.langchainEndpoint);
      this.config.langchainEndpoint = config.langchainEndpoint;
    }
    
    if (config.pineconeEndpoint) {
      await SecureStorage.setItem('pinecone_endpoint', config.pineconeEndpoint);
      this.config.pineconeEndpoint = config.pineconeEndpoint;
    }
    
    if (config.whisperEndpoint) {
      await SecureStorage.setItem('whisper_endpoint', config.whisperEndpoint);
      this.config.whisperEndpoint = config.whisperEndpoint;
    }
    
    if (config.elevenLabsEndpoint) {
      await SecureStorage.setItem('elevenlabs_endpoint', config.elevenLabsEndpoint);
      this.config.elevenLabsEndpoint = config.elevenLabsEndpoint;
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): AIServiceConfig {
    return { ...this.config };
  }

  /**
   * Check if service is configured
   */
  isConfigured(service: keyof AIServiceConfig): boolean {
    return !!this.config[service];
  }

  /**
   * Test connection to a service
   */
  async testConnection(service: keyof AIServiceConfig): Promise<boolean> {
    const endpoint = this.config[service];
    
    if (!endpoint) {
      console.error(`${service} endpoint not configured`);
      return false;
    }

    try {
      const response = await fetch(`${endpoint}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error(`Failed to connect to ${service}:`, error);
      return false;
    }
  }

  /**
   * Get service status
   */
  async getServiceStatus(): Promise<Record<string, boolean>> {
    const services: Array<keyof AIServiceConfig> = [
      'openaiEndpoint',
      'langchainEndpoint',
      'pineconeEndpoint',
      'whisperEndpoint',
      'elevenLabsEndpoint',
    ];

    const status: Record<string, boolean> = {};

    for (const service of services) {
      status[service] = await this.testConnection(service);
    }

    return status;
  }
}

export const aiService = AIService.getInstance();
