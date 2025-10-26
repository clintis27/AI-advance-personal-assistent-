
// Security, Privacy & Legal Types

export interface ConsentItem {
  id: string;
  service: string;
  description: string;
  permissions: string[];
  granted: boolean;
  grantedAt?: string;
  icon: string;
  color: string;
}

export interface ContactPermission {
  contactId: string;
  contactName: string;
  contactEmail?: string;
  allowAutoRespond: boolean;
  allowScheduling: boolean;
  allowVoiceCall: boolean;
  allowDataAccess: boolean;
  customRules?: string;
}

export interface ActionPermission {
  id: string;
  action: string;
  description: string;
  enabled: boolean;
  requiresConfirmation: boolean;
  allowedContacts: string[];
}

export interface TranscriptSettings {
  enabled: boolean;
  retentionDays: number;
  autoDelete: boolean;
  encryptionEnabled: boolean;
}

export interface VoiceConsent {
  granted: boolean;
  grantedAt?: string;
  signature?: string;
  disclaimerRead: boolean;
  testCallCompleted: boolean;
}

export interface DataExportRequest {
  id: string;
  requestedAt: string;
  status: 'pending' | 'processing' | 'ready' | 'downloaded';
  downloadUrl?: string;
  expiresAt?: string;
}

export interface RoutineSettings {
  workHoursStart: string;
  workHoursEnd: string;
  focusModeEnabled: boolean;
  focusModeSchedule: { start: string; end: string }[];
  autoRespondRules: AutoRespondRule[];
}

export interface AutoRespondRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: {
    timeRange?: { start: string; end: string };
    contactGroups?: string[];
    keywords?: string[];
  };
  response: string;
  priority: number;
}

export interface BusyModeSettings {
  enabled: boolean;
  allowCalls: boolean;
  allowMessages: boolean;
  allowMeetings: boolean;
  customMessage?: string;
  exceptions: string[];
}

export interface DigitalBodyLanguage {
  typingSpeed: number;
  replyLatency: number;
  calendarPatterns: {
    averageStartTime: string;
    averageEndTime: string;
    preferredMeetingTimes: string[];
  };
  meetingParticipation: {
    speakingFrequency: number;
    mutedPercentage: number;
  };
  deviceUsagePatterns: {
    activeHours: string[];
    peakProductivityTime: string;
  };
}

export interface AuditAction {
  id: string;
  action: string;
  timestamp: string;
  category: 'data_access' | 'permission' | 'action' | 'sync' | 'voice' | 'auto_respond';
  details: string;
  canUndo: boolean;
  undoData?: any;
  explanation?: string;
  confidence?: number;
}
