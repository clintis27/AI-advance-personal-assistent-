
/**
 * Type definitions for App & Platform Integrations
 */

import { IconSymbolName } from '@/components/IconSymbol';

export type IntegrationCategory =
  | 'email' 
  | 'calendar' 
  | 'social' 
  | 'messaging' 
  | 'tasks' 
  | 'travel' 
  | 'payments';

export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'pending';

export interface Integration {
  id: string;
  name: string;
  category: IntegrationCategory;
  description: string;
  icon: IconSymbolName;
  color: string;
  status: IntegrationStatus;
  provider: string;
  capabilities: string[];
  requiredScopes: string[];
  connectedAt?: string;
  lastSync?: string;
  apiEndpoint?: string;
}

export interface OAuthConfig {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scopes: string[];
  authorizationEndpoint: string;
  tokenEndpoint: string;
}

export interface ConnectionData {
  integrationId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  userId?: string;
  email?: string;
  metadata?: Record<string, any>;
}

export interface IntegrationAction {
  id: string;
  integrationId: string;
  type: 'read' | 'write' | 'delete' | 'sync';
  description: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  details?: string;
}

// Email Integrations
export interface EmailIntegration extends Integration {
  category: 'email';
  emailAddress?: string;
  unreadCount?: number;
  canSend: boolean;
  canRead: boolean;
  canSummarize: boolean;
}

// Calendar Integrations
export interface CalendarIntegration extends Integration {
  category: 'calendar';
  calendars?: CalendarInfo[];
  canSchedule: boolean;
  canJoinMeetings: boolean;
  timezone?: string;
}

export interface CalendarInfo {
  id: string;
  name: string;
  color: string;
  isPrimary: boolean;
}

// Social Media Integrations
export interface SocialIntegration extends Integration {
  category: 'social';
  username?: string;
  canPost: boolean;
  canReadDMs: boolean;
  canRespond: boolean;
  followerCount?: number;
}

// Messaging Integrations
export interface MessagingIntegration extends Integration {
  category: 'messaging';
  workspaceName?: string;
  canSendMessages: boolean;
  canReadMessages: boolean;
  channels?: ChannelInfo[];
}

export interface ChannelInfo {
  id: string;
  name: string;
  type: 'public' | 'private' | 'dm';
  unreadCount: number;
}

// Task/Project Tool Integrations
export interface TaskIntegration extends Integration {
  category: 'tasks';
  workspaceName?: string;
  canCreateTasks: boolean;
  canAssignTasks: boolean;
  canReadTasks: boolean;
  projectCount?: number;
}

// Travel API Integrations
export interface TravelIntegration extends Integration {
  category: 'travel';
  canSearchFlights: boolean;
  canSearchHotels: boolean;
  canBook: boolean;
  apiKey?: string;
}

// Payment Integrations
export interface PaymentIntegration extends Integration {
  category: 'payments';
  canProcessPayments: boolean;
  canRefund: boolean;
  currency: string;
  testMode: boolean;
}

// Integration Statistics
export interface IntegrationStats {
  totalIntegrations: number;
  connectedIntegrations: number;
  lastSyncTime?: string;
  actionsToday: number;
  errorCount: number;
}
