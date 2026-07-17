
/**
 * Authentication Service
 * Handles user authentication, session management, and multi-device login
 */

import { SecureStorage } from '@/utils/secureStorage';
import { 
  User, 
  AuthSession, 
  LoginCredentials, 
  SignupData, 
  AuthProvider,
  UserDevice 
} from '@/types/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export class AuthService {
  private static instance: AuthService;
  private currentSession: AuthSession | null = null;
  private currentUser: User | null = null;

  private constructor() {
    this.loadSession();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Load saved session from secure storage
   */
  private async loadSession() {
    try {
      const sessionData = await SecureStorage.getItem('auth_session');
      if (sessionData) {
        this.currentSession = JSON.parse(sessionData);
        
        // Check if session is expired
        if (this.currentSession && this.currentSession.expiresAt < Date.now()) {
          console.log('Session expired, refreshing...');
          await this.refreshSession();
        }
        await this.loadUser();
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<User> {
    console.log('Logging in user:', credentials.email);
    
    try {
      // In production, this would call your backend API
      // For now, we'll simulate the login
      const mockSession: AuthSession = {
        userId: 'user_' + Date.now(),
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        deviceId: await this.getDeviceId(),
      };

      const mockUser: User = {
        id: mockSession.userId,
        email: credentials.email,
        name: credentials.email.split('@')[0],
        provider: 'email',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        devices: [await this.getCurrentDevice()],
        preferences: this.getDefaultPreferences(),
      };

      await this.saveSession(mockSession);
      await this.saveUser(mockUser);

      this.currentSession = mockSession;
      this.currentUser = mockUser;

      return mockUser;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to login. Please check your credentials.');
    }
  }

  /**
   * Sign up new user
   */
  async signup(data: SignupData): Promise<User> {
    console.log('Signing up user:', data.email);
    
    try {
      // In production, this would call your backend API
      const mockSession: AuthSession = {
        userId: 'user_' + Date.now(),
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000),
        deviceId: await this.getDeviceId(),
      };

      const mockUser: User = {
        id: mockSession.userId,
        email: data.email,
        name: data.name,
        provider: data.provider,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        devices: [await this.getCurrentDevice()],
        preferences: this.getDefaultPreferences(),
      };

      await this.saveSession(mockSession);
      await this.saveUser(mockUser);

      this.currentSession = mockSession;
      this.currentUser = mockUser;

      return mockUser;
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Failed to create account. Please try again.');
    }
  }

  /**
   * OAuth login (Google, Apple, Microsoft)
   */
  async loginWithOAuth(provider: AuthProvider): Promise<User> {
    console.log('Logging in with OAuth provider:', provider);
    
    try {
      const redirectUrl = Linking.createURL('/auth/callback');
      
      // OAuth endpoints (replace with your actual endpoints)
      const authUrls = {
        google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=${redirectUrl}&response_type=code&scope=openid%20email%20profile`,
        apple: `https://appleid.apple.com/auth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=${redirectUrl}&response_type=code&scope=email%20name`,
        microsoft: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=${redirectUrl}&response_type=code&scope=openid%20email%20profile`,
        email: '',
      };

      const authUrl = authUrls[provider];
      
      if (!authUrl) {
        throw new Error('Invalid OAuth provider');
      }

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

      if (result.type === 'success' && result.url) {
        const { queryParams } = Linking.parse(result.url);
        const code = queryParams?.code as string;

        if (code) {
          // Exchange code for tokens (call your backend)
          return await this.exchangeCodeForTokens(code, provider);
        }
      }

      throw new Error('OAuth authentication failed');
    } catch (error) {
      console.error('OAuth login error:', error);
      throw new Error(`Failed to login with ${provider}. Please try again.`);
    }
  }

  /**
   * Exchange OAuth code for tokens
   */
  private async exchangeCodeForTokens(code: string, provider: AuthProvider): Promise<User> {
    // In production, call your backend to exchange the code
    console.log('Exchanging code for tokens:', code);
    
    const mockSession: AuthSession = {
      userId: 'user_oauth_' + Date.now(),
      accessToken: 'oauth_access_token_' + Date.now(),
      refreshToken: 'oauth_refresh_token_' + Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000),
      deviceId: await this.getDeviceId(),
    };

    const mockUser: User = {
      id: mockSession.userId,
      email: `user@${provider}.com`,
      name: `${provider} User`,
      provider: provider,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      devices: [await this.getCurrentDevice()],
      preferences: this.getDefaultPreferences(),
    };

    await this.saveSession(mockSession);
    await this.saveUser(mockUser);

    this.currentSession = mockSession;
    this.currentUser = mockUser;

    return mockUser;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    console.log('Logging out user');
    
    try {
      await SecureStorage.deleteItem('auth_session');
      await SecureStorage.deleteItem('current_user');
      
      this.currentSession = null;
      this.currentUser = null;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Refresh session
   */
  async refreshSession(): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session to refresh');
    }

    console.log('Refreshing session...');
    
    try {
      // In production, call your backend to refresh the token
      const newSession: AuthSession = {
        ...this.currentSession,
        accessToken: 'refreshed_access_token_' + Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000),
      };

      await this.saveSession(newSession);
      this.currentSession = newSession;
    } catch (error) {
      console.error('Session refresh error:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Get current session
   */
  getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentSession && this.currentSession.expiresAt > Date.now();
  }

  /**
   * Save session to secure storage
   */
  private async saveSession(session: AuthSession): Promise<void> {
    await SecureStorage.setItem('auth_session', JSON.stringify(session));
  }

  /**
   * Save user to secure storage
   */
  private async saveUser(user: User): Promise<void> {
    await SecureStorage.setItem('current_user', JSON.stringify(user));
  }

  /**
   * Load user from secure storage
   */
  private async loadUser(): Promise<void> {
    const userData = await SecureStorage.getItem('current_user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  /**
   * Get device ID
   */
  private async getDeviceId(): Promise<string> {
    let deviceId = await SecureStorage.getItem('device_id');
    
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      await SecureStorage.setItem('device_id', deviceId);
    }
    
    return deviceId;
  }

  /**
   * Get current device info
   */
  private async getCurrentDevice(): Promise<UserDevice> {
    const deviceId = await this.getDeviceId();
    
    return {
      id: deviceId,
      name: this.getDeviceName(),
      type: this.getDeviceType(),
      platform: Platform.OS,
      lastActive: new Date().toISOString(),
      isCurrentDevice: true,
    };
  }

  /**
   * Get device name
   */
  private getDeviceName(): string {
    if (Platform.OS === 'ios') return 'iPhone';
    if (Platform.OS === 'android') return 'Android Device';
    if (Platform.OS === 'web') return 'Web Browser';
    return 'Desktop';
  }

  /**
   * Get device type
   */
  private getDeviceType(): 'ios' | 'android' | 'web' | 'desktop' {
    if (Platform.OS === 'ios') return 'ios';
    if (Platform.OS === 'android') return 'android';
    if (Platform.OS === 'web') return 'web';
    return 'desktop';
  }

  /**
   * Get default user preferences
   */
  private getDefaultPreferences() {
    return {
      theme: 'auto' as const,
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: {
        enabled: true,
        email: true,
        push: true,
        sms: false,
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00',
        },
      },
      voice: {
        enabled: true,
        wakeWord: 'Hey Assistant',
        voiceId: 'default',
        language: 'en-US',
        autoListen: false,
      },
      privacy: {
        dataCollection: true,
        analytics: true,
        locationTracking: false,
        voiceRecording: true,
      },
    };
  }
}

export const authService = AuthService.getInstance();
