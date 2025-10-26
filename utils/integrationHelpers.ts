
import { Integration, IntegrationCategory, ConnectionData, OAuthConfig } from '@/types/integrations';
import { SecureStorage } from './secureStorage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

/**
 * Integration Helper Utilities
 * Manages OAuth flows, token storage, and API connections
 */

// OAuth Configuration for different providers
export const OAUTH_CONFIGS: Record<string, OAuthConfig> = {
  gmail: {
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    redirectUri: Linking.createURL('/oauth-callback'),
    scopes: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'],
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  },
  outlook: {
    clientId: 'YOUR_MICROSOFT_CLIENT_ID',
    redirectUri: Linking.createURL('/oauth-callback'),
    scopes: ['openid', 'email', 'profile', 'Mail.Read', 'Mail.Send'],
    authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  },
  googleCalendar: {
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    redirectUri: Linking.createURL('/oauth-callback'),
    scopes: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  },
  outlookCalendar: {
    clientId: 'YOUR_MICROSOFT_CLIENT_ID',
    redirectUri: Linking.createURL('/oauth-callback'),
    scopes: ['openid', 'email', 'profile', 'Calendars.ReadWrite'],
    authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  },
  slack: {
    clientId: 'YOUR_SLACK_CLIENT_ID',
    redirectUri: Linking.createURL('/oauth-callback'),
    scopes: ['channels:read', 'chat:write', 'users:read', 'im:read', 'im:write'],
    authorizationEndpoint: 'https://slack.com/oauth/v2/authorize',
    tokenEndpoint: 'https://slack.com/api/oauth.v2.access',
  },
  notion: {
    clientId: 'YOUR_NOTION_CLIENT_ID',
    redirectUri: Linking.createURL('/oauth-callback'),
    scopes: ['read_content', 'update_content', 'insert_content'],
    authorizationEndpoint: 'https://api.notion.com/v1/oauth/authorize',
    tokenEndpoint: 'https://api.notion.com/v1/oauth/token',
  },
};

/**
 * Initiate OAuth flow for an integration
 */
export const initiateOAuthFlow = async (integrationId: string): Promise<boolean> => {
  try {
    const config = OAUTH_CONFIGS[integrationId];
    if (!config) {
      console.error('OAuth config not found for:', integrationId);
      return false;
    }

    // Build authorization URL
    const authUrl = buildAuthorizationUrl(config);
    console.log('Opening OAuth URL:', authUrl);

    // Open browser for OAuth
    const result = await WebBrowser.openAuthSessionAsync(authUrl, config.redirectUri);

    if (result.type === 'success' && result.url) {
      // Extract authorization code from callback URL
      const code = extractAuthCode(result.url);
      if (code) {
        // Exchange code for tokens
        const tokens = await exchangeCodeForTokens(integrationId, code, config);
        if (tokens) {
          // Store tokens securely
          await SecureStorage.storeTokens(integrationId, tokens);
          console.log('OAuth flow completed successfully for:', integrationId);
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('OAuth flow error:', error);
    return false;
  }
};

/**
 * Build OAuth authorization URL
 */
const buildAuthorizationUrl = (config: OAuthConfig): string => {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent',
  });

  return `${config.authorizationEndpoint}?${params.toString()}`;
};

/**
 * Extract authorization code from callback URL
 */
const extractAuthCode = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('code');
  } catch (error) {
    console.error('Error extracting auth code:', error);
    return null;
  }
};

/**
 * Exchange authorization code for access tokens
 */
const exchangeCodeForTokens = async (
  integrationId: string,
  code: string,
  config: OAuthConfig
): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: number } | null> => {
  try {
    // In production, this should be done through your backend to keep client_secret secure
    console.log('Exchanging code for tokens (mock):', integrationId);
    
    // Mock token response for demo
    return {
      accessToken: `mock_access_token_${integrationId}_${Date.now()}`,
      refreshToken: `mock_refresh_token_${integrationId}_${Date.now()}`,
      expiresAt: Date.now() + 3600000, // 1 hour from now
    };
  } catch (error) {
    console.error('Token exchange error:', error);
    return null;
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (integrationId: string): Promise<boolean> => {
  try {
    const tokens = await SecureStorage.getTokens(integrationId);
    if (!tokens || !tokens.refreshToken) {
      console.error('No refresh token available for:', integrationId);
      return false;
    }

    const config = OAUTH_CONFIGS[integrationId];
    if (!config) {
      console.error('OAuth config not found for:', integrationId);
      return false;
    }

    // In production, call token endpoint with refresh token
    console.log('Refreshing access token (mock):', integrationId);
    
    // Mock new tokens
    const newTokens = {
      accessToken: `mock_refreshed_token_${integrationId}_${Date.now()}`,
      refreshToken: tokens.refreshToken,
      expiresAt: Date.now() + 3600000,
    };

    await SecureStorage.storeTokens(integrationId, newTokens);
    return true;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
};

/**
 * Disconnect an integration
 */
export const disconnectIntegration = async (integrationId: string): Promise<void> => {
  try {
    await SecureStorage.deleteTokens(integrationId);
    console.log('Integration disconnected:', integrationId);
  } catch (error) {
    console.error('Error disconnecting integration:', error);
    throw error;
  }
};

/**
 * Check if integration is connected
 */
export const isIntegrationConnected = async (integrationId: string): Promise<boolean> => {
  try {
    const tokens = await SecureStorage.getTokens(integrationId);
    if (!tokens) return false;

    // Check if token is expired
    if (SecureStorage.isTokenExpired(tokens.expiresAt)) {
      // Try to refresh
      return await refreshAccessToken(integrationId);
    }

    return true;
  } catch (error) {
    console.error('Error checking integration status:', error);
    return false;
  }
};

/**
 * Get integration access token
 */
export const getIntegrationToken = async (integrationId: string): Promise<string | null> => {
  try {
    const tokens = await SecureStorage.getTokens(integrationId);
    if (!tokens) return null;

    // Check if token is expired and refresh if needed
    if (SecureStorage.isTokenExpired(tokens.expiresAt)) {
      const refreshed = await refreshAccessToken(integrationId);
      if (!refreshed) return null;
      
      const newTokens = await SecureStorage.getTokens(integrationId);
      return newTokens?.accessToken || null;
    }

    return tokens.accessToken;
  } catch (error) {
    console.error('Error getting integration token:', error);
    return null;
  }
};

/**
 * Test integration connection
 */
export const testIntegrationConnection = async (integrationId: string): Promise<boolean> => {
  try {
    const token = await getIntegrationToken(integrationId);
    if (!token) return false;

    // In production, make a test API call to verify connection
    console.log('Testing integration connection (mock):', integrationId);
    
    // Mock successful test
    return true;
  } catch (error) {
    console.error('Integration test error:', error);
    return false;
  }
};

/**
 * Get integration statistics
 */
export const getIntegrationStats = async (): Promise<{
  total: number;
  connected: number;
  disconnected: number;
}> => {
  // In production, this would query actual integration statuses
  return {
    total: 0,
    connected: 0,
    disconnected: 0,
  };
};
