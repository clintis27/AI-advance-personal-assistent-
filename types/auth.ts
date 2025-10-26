
/**
 * Authentication and User Management Types
 */

export type AuthProvider = 'google' | 'apple' | 'microsoft' | 'email';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: AuthProvider;
  createdAt: string;
  lastLogin: string;
  devices: UserDevice[];
  preferences: UserPreferences;
}

export interface UserDevice {
  id: string;
  name: string;
  type: 'ios' | 'android' | 'web' | 'desktop';
  platform: string;
  lastActive: string;
  isCurrentDevice: boolean;
  pushToken?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  voice: VoicePreferences;
  privacy: PrivacyPreferences;
}

export interface NotificationPreferences {
  enabled: boolean;
  email: boolean;
  push: boolean;
  sms: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface VoicePreferences {
  enabled: boolean;
  wakeWord: string;
  voiceId: string;
  language: string;
  autoListen: boolean;
}

export interface PrivacyPreferences {
  dataCollection: boolean;
  analytics: boolean;
  locationTracking: boolean;
  voiceRecording: boolean;
}

export interface AuthSession {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  deviceId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  name: string;
  provider: AuthProvider;
}
