
/**
 * Digital Body Language (DBL) Engine Types
 * Comprehensive type definitions for behavioral signal tracking and state inference
 */

// ============================================================================
// INPUT STREAMS
// ============================================================================

export type InputStreamType = 
  | 'calendar_event'
  | 'email_response_latency'
  | 'microphone_audio_tone'
  | 'device_unlock'
  | 'app_usage_switch'
  | 'typing_speed'
  | 'notification_interaction'
  | 'location_change';

export interface InputStreamConfig {
  type: InputStreamType;
  enabled: boolean;
  samplingFrequency: 'realtime' | 'continuous' | 'intermittent' | 'on_event';
  privacyLevel: 'high' | 'medium' | 'low';
  consentRequired: boolean;
  dataRetentionDays: number;
  description: string;
}

export interface CalendarEventStream {
  type: 'calendar_event';
  eventId: string;
  eventType: 'start' | 'end' | 'update';
  timestamp: string;
  duration?: number;
  attendeeCount?: number;
}

export interface EmailLatencyStream {
  type: 'email_response_latency';
  emailId: string;
  latency: number; // in seconds
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

export interface AudioToneStream {
  type: 'microphone_audio_tone';
  frequency: number;
  pitch: number;
  intensity: number;
  frustrationScore: number; // 0-100
  timestamp: string;
}

export interface DeviceUnlockStream {
  type: 'device_unlock';
  unlockTime: string;
  lockDuration: number; // in seconds
  unlockMethod: 'biometric' | 'pin' | 'pattern';
}

export interface AppUsageStream {
  type: 'app_usage_switch';
  appCategory: 'productivity' | 'communication' | 'entertainment' | 'social' | 'other';
  appName: string;
  eventType: 'foreground' | 'background';
  timestamp: string;
  duration?: number;
}

export type InputStreamData = 
  | CalendarEventStream
  | EmailLatencyStream
  | AudioToneStream
  | DeviceUnlockStream
  | AppUsageStream;

// ============================================================================
// FEATURE ENGINEERING
// ============================================================================

export interface ExtractedFeatures {
  // Calendar features
  timeSinceLastMeeting: number; // in minutes
  upcomingMeetingCount: number;
  averageMeetingDuration: number;
  meetingDensity: number; // meetings per hour
  
  // Email features
  avgEmailLatencyLastHour: number; // in seconds
  latencyChangeFromBaseline: number; // percentage
  emailVelocity: number; // emails per hour
  
  // Audio features
  frustrationScore: number; // 0-100
  speechRate: number; // words per minute
  pauseFrequency: number; // pauses per minute
  
  // Device features
  unlockFrequency: number; // unlocks per hour
  timeSinceLastUnlock: number; // in minutes
  averageSessionDuration: number; // in minutes
  
  // App usage features
  productivityAppTime: number; // minutes in last hour
  appSwitchFrequency: number; // switches per hour
  focusScore: number; // 0-100, based on app switching
  
  // Derived features
  contextualBusyness: number; // 0-100
  cognitiveLoad: number; // 0-100
  interruptibility: number; // 0-100
}

// ============================================================================
// STATE SPACE
// ============================================================================

export type UserState = 
  | 'Idle'
  | 'Focus-Deep'
  | 'Focus-Shallow'
  | 'Travelling'
  | 'InCall'
  | 'Overloaded'
  | 'ReadyForBooking'
  | 'InMeeting'
  | 'Available';

export interface StateDefinition {
  state: UserState;
  description: string;
  indicators: string[];
  typicalDuration: string;
  interruptibility: 'high' | 'medium' | 'low';
  color: string;
  icon: string;
}

export interface StateInference {
  currentState: UserState;
  confidence: number; // 0-100
  probabilityVector: Record<UserState, number>;
  features: ExtractedFeatures;
  timestamp: string;
  transitionReason?: string;
}

// ============================================================================
// INFERENCE ENGINE
// ============================================================================

export type InferenceModelType = 
  | 'logistic_regression'
  | 'decision_tree'
  | 'neural_network'
  | 'ensemble'
  | 'rule_based';

export interface InferenceEngineConfig {
  modelType: InferenceModelType;
  confidenceThreshold: number; // 0-1
  transitionCooldown: number; // seconds
  enableHybridApproach: boolean;
  weights: {
    calendar: number;
    email: number;
    audio: number;
    device: number;
    appUsage: number;
  };
}

export interface StateTransitionRule {
  fromState: UserState | 'any';
  toState: UserState;
  conditions: TransitionCondition[];
  threshold: number;
  cooldown: number; // seconds
}

export interface TransitionCondition {
  feature: keyof ExtractedFeatures;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'between';
  value: number | [number, number];
  weight: number;
}

// ============================================================================
// ACTION MAPPING
// ============================================================================

export type AutonomyLevel = 'Suggest-Only' | 'Semi-Autonomous' | 'Fully-Autonomous';

export type AssistantActionType =
  | 'postpone_notifications'
  | 'auto_reply'
  | 'suggest_break'
  | 'schedule_booking'
  | 'enable_dnd'
  | 'summarize_meetings'
  | 'prioritize_tasks'
  | 'prepare_briefing'
  | 'block_calendar'
  | 'send_status_update';

export interface AssistantAction {
  type: AssistantActionType;
  description: string;
  autonomyLevels: AutonomyLevel[];
  requiredConfidence: number;
  parameters?: Record<string, any>;
  reversible: boolean;
  impactLevel: 'low' | 'medium' | 'high';
}

export interface StateActionMapping {
  state: UserState;
  actions: {
    [K in AutonomyLevel]: AssistantAction[];
  };
}

export interface ExecutedAction {
  id: string;
  actionType: AssistantActionType;
  state: UserState;
  autonomyLevel: AutonomyLevel;
  timestamp: string;
  parameters: Record<string, any>;
  success: boolean;
  userFeedback?: 'approved' | 'rejected' | 'modified';
  reversedAt?: string;
}

// ============================================================================
// FEEDBACK & LEARNING
// ============================================================================

export interface UserFeedback {
  id: string;
  actionId: string;
  feedbackType: 'approve' | 'reject' | 'modify' | 'undo';
  timestamp: string;
  reason?: string;
  modifications?: Record<string, any>;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface LearningUpdate {
  id: string;
  timestamp: string;
  feedbackId: string;
  modelType: InferenceModelType;
  adjustments: {
    weights?: Partial<InferenceEngineConfig['weights']>;
    thresholds?: Partial<Record<UserState, number>>;
    rules?: StateTransitionRule[];
  };
  performanceImprovement: number; // percentage
}

export interface AdaptiveWeights {
  userId: string;
  weights: InferenceEngineConfig['weights'];
  thresholds: Record<UserState, number>;
  lastUpdated: string;
  trainingDataPoints: number;
  accuracy: number;
}

// ============================================================================
// PRIVACY & TRANSPARENCY
// ============================================================================

export interface PrivacyConfig {
  dataEncryption: boolean;
  processingLocation: 'local' | 'cloud' | 'hybrid';
  anonymization: boolean;
  dataRetentionDays: number;
  allowDataExport: boolean;
  allowDataDeletion: boolean;
}

export interface ConsentRecord {
  userId: string;
  streamType: InputStreamType;
  granted: boolean;
  timestamp: string;
  expiresAt?: string;
  version: string;
}

export interface BehaviorDataAudit {
  id: string;
  timestamp: string;
  dataType: 'stream' | 'feature' | 'inference' | 'action';
  operation: 'collect' | 'process' | 'store' | 'delete' | 'export';
  dataId: string;
  userId: string;
  purpose: string;
  automated: boolean;
}

export interface TransparencyReport {
  userId: string;
  period: {
    start: string;
    end: string;
  };
  dataCollected: {
    streamType: InputStreamType;
    count: number;
    lastCollected: string;
  }[];
  inferencesPerformed: number;
  actionsExecuted: {
    actionType: AssistantActionType;
    count: number;
    approvalRate: number;
  }[];
  userFeedbackCount: number;
  modelAccuracy: number;
}

// ============================================================================
// SCENARIO EXAMPLES
// ============================================================================

export interface UsageScenario {
  id: string;
  name: string;
  description: string;
  inputStreams: InputStreamData[];
  extractedFeatures: ExtractedFeatures;
  inferredState: StateInference;
  triggeredActions: ExecutedAction[];
  userFeedback?: UserFeedback[];
  outcome: string;
}

// ============================================================================
// DASHBOARD & MONITORING
// ============================================================================

export interface DBLDashboardData {
  currentState: StateInference;
  stateHistory: StateInference[];
  recentActions: ExecutedAction[];
  pendingSuggestions: AssistantAction[];
  modelPerformance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  privacyStatus: {
    activeConsents: number;
    dataRetentionCompliance: boolean;
    lastAudit: string;
  };
}

export interface StateTransitionHistory {
  id: string;
  fromState: UserState;
  toState: UserState;
  timestamp: string;
  confidence: number;
  trigger: string;
  duration: number; // seconds in previous state
}
