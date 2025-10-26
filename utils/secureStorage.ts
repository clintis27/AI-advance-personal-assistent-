
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Secure Storage Utility
 * Uses expo-secure-store for encrypted storage on device
 * Follows OAuth best practices for token management
 */

const ENCRYPTION_KEY_PREFIX = 'encrypted_';

export class SecureStorage {
  /**
   * Store encrypted data
   */
  static async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Fallback to localStorage for web (with warning)
        console.warn('SecureStore not available on web, using localStorage');
        localStorage.setItem(ENCRYPTION_KEY_PREFIX + key, value);
        return;
      }
      
      await SecureStore.setItemAsync(ENCRYPTION_KEY_PREFIX + key, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
      console.log('Securely stored:', key);
    } catch (error) {
      console.error('Error storing secure data:', error);
      throw error;
    }
  }

  /**
   * Retrieve encrypted data
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(ENCRYPTION_KEY_PREFIX + key);
      }
      
      const value = await SecureStore.getItemAsync(ENCRYPTION_KEY_PREFIX + key);
      return value;
    } catch (error) {
      console.error('Error retrieving secure data:', error);
      return null;
    }
  }

  /**
   * Delete encrypted data
   */
  static async deleteItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(ENCRYPTION_KEY_PREFIX + key);
        return;
      }
      
      await SecureStore.deleteItemAsync(ENCRYPTION_KEY_PREFIX + key);
      console.log('Securely deleted:', key);
    } catch (error) {
      console.error('Error deleting secure data:', error);
      throw error;
    }
  }

  /**
   * Store OAuth tokens securely
   */
  static async storeTokens(service: string, tokens: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
  }): Promise<void> {
    const tokenData = JSON.stringify(tokens);
    await this.setItem(`oauth_${service}`, tokenData);
  }

  /**
   * Retrieve OAuth tokens
   */
  static async getTokens(service: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
  } | null> {
    const tokenData = await this.getItem(`oauth_${service}`);
    if (!tokenData) return null;
    
    try {
      return JSON.parse(tokenData);
    } catch (error) {
      console.error('Error parsing token data:', error);
      return null;
    }
  }

  /**
   * Delete OAuth tokens
   */
  static async deleteTokens(service: string): Promise<void> {
    await this.deleteItem(`oauth_${service}`);
  }

  /**
   * Check if tokens are expired
   */
  static isTokenExpired(expiresAt?: number): boolean {
    if (!expiresAt) return false;
    return Date.now() >= expiresAt;
  }

  /**
   * Store user consent
   */
  static async storeConsent(consentId: string, consentData: any): Promise<void> {
    const data = JSON.stringify({
      ...consentData,
      timestamp: new Date().toISOString(),
    });
    await this.setItem(`consent_${consentId}`, data);
  }

  /**
   * Get user consent
   */
  static async getConsent(consentId: string): Promise<any | null> {
    const data = await this.getItem(`consent_${consentId}`);
    if (!data) return null;
    
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing consent data:', error);
      return null;
    }
  }

  /**
   * Clear all secure data (for account deletion)
   */
  static async clearAll(): Promise<void> {
    console.log('Clearing all secure storage...');
    // Note: SecureStore doesn't have a clear all method
    // In production, you'd need to track all keys and delete them individually
    if (Platform.OS === 'web') {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(ENCRYPTION_KEY_PREFIX)
      );
      keys.forEach(key => localStorage.removeItem(key));
    }
  }
}
