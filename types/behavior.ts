
/**
 * Type definitions for Behavior & Routine Intelligence
 */

// Behavior Tracking Types
export interface BehaviorMetric {
  id: string;
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
  timestamp: string;
}

export interface ActivityPattern {
  id: string;
  timeOfDay: string;
  activity: string;
  frequency: number;
  duration: string;
  confidence: number;
  daysTracked: number;
}

export interface TimeOfDayActivity {
  hour: number;
  activity: string;
  intensity: number;
  type: 'work' | 'break' | 'meeting' | 'focus' | 'communication';
}

// Machine Learning Types
export interface MLModel {
  id: string;
  name: string;
  type: 'intent-prediction' | 'mood-detection' | 'task-prioritization' | 'schedule-optimization';
  accuracy: number;
  trainingDataPoints: number;
  lastTrained: string;
  version: string;
}

export interface IntentPrediction {
  id: string;
  predictedIntent: string;
  confidence: number;
  context: string[];
  suggestedActions: string[];
  timestamp: string;
}

export interface MoodDetection {
  id: string;
  timestamp: string;
  mood: 'energetic' | 'focused' | 'stressed' | 'relaxed' | 'tired' | 'motivated';
  confidence: number;
  triggers: string[];
  energyLevel: number;
  productivityScore: number;
}

// User Profiling Types
export interface UserProfile {
  id: string;
  preferences: UserPreferences;
  routines: RoutineProfile[];
  workingHours: WorkingHoursProfile;
  communicationStyle: CommunicationStyle;
  autonomyThresholds: AutonomyThresholds;
}

export interface UserPreferences {
  preferredWorkingHours: {
    start: string;
    end: string;
  };
  breakPreferences: {
    frequency: number;
    duration: number;
  };
  notificationPreferences: {
    urgentOnly: boolean;
    quietHours: { start: string; end: string };
    channels: ('push' | 'email' | 'sms')[];
  };
  taskPreferences: {
    preferredTaskDuration: number;
    maxConcurrentTasks: number;
    prioritizationMethod: 'deadline' | 'importance' | 'effort' | 'ai-suggested';
  };
}

export interface RoutineProfile {
  id: string;
  name: string;
  timeSlot: string;
  activities: string[];
  frequency: number;
  flexibility: 'rigid' | 'flexible' | 'adaptive';
}

export interface WorkingHoursProfile {
  peakProductivityHours: string[];
  lowEnergyHours: string[];
  preferredMeetingTimes: string[];
  focusTimeBlocks: { start: string; end: string }[];
}

export interface CommunicationStyle {
  responseTime: {
    average: number;
    byPriority: {
      urgent: number;
      normal: number;
      low: number;
    };
  };
  tone: 'formal' | 'casual' | 'mixed';
  verbosity: 'concise' | 'detailed' | 'adaptive';
  preferredChannels: string[];
}

export interface AutonomyThresholds {
  autoApproveThreshold: number;
  requireConfirmationAbove: number;
  maxAutonomousActions: number;
  riskTolerance: 'low' | 'medium' | 'high';
}

// Event Detection Types
export interface EventTrigger {
  id: string;
  name: string;
  type: 'device' | 'email' | 'calendar' | 'location' | 'time' | 'behavior';
  enabled: boolean;
  conditions: TriggerCondition[];
  actions: TriggerAction[];
  lastTriggered?: string;
  triggerCount: number;
}

export interface TriggerCondition {
  type: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: any;
}

export interface TriggerAction {
  type: 'notification' | 'task' | 'automation' | 'mode_change';
  config: any;
  priority: 'high' | 'medium' | 'low';
}

export interface DetectedEvent {
  id: string;
  triggerId: string;
  timestamp: string;
  context: any;
  actionsExecuted: string[];
  success: boolean;
}

// Analytics Types
export interface BehaviorAnalytics {
  dailyStats: DailyStats;
  weeklyTrends: WeeklyTrends;
  patterns: PatternAnalysis[];
  insights: BehaviorInsight[];
}

export interface DailyStats {
  date: string;
  activeHours: number;
  tasksCompleted: number;
  meetingsAttended: number;
  focusTime: number;
  breakTime: number;
  productivityScore: number;
}

export interface WeeklyTrends {
  weekStart: string;
  averageProductivity: number;
  totalFocusTime: number;
  taskCompletionRate: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  energyLevelTrend: 'increasing' | 'stable' | 'decreasing';
}

export interface PatternAnalysis {
  id: string;
  pattern: string;
  frequency: number;
  confidence: number;
  impact: 'positive' | 'neutral' | 'negative';
  recommendation?: string;
}

export interface BehaviorInsight {
  id: string;
  title: string;
  description: string;
  category: 'productivity' | 'wellbeing' | 'communication' | 'time-management';
  actionable: boolean;
  suggestedAction?: string;
  priority: 'high' | 'medium' | 'low';
}

// Storage Types
export interface BehaviorDataStore {
  userId: string;
  profile: UserProfile;
  metrics: BehaviorMetric[];
  patterns: ActivityPattern[];
  moods: MoodDetection[];
  events: DetectedEvent[];
  analytics: BehaviorAnalytics;
  lastUpdated: string;
}
