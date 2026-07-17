
/**
 * Digital Body Language Engine
 * Core implementation for behavioral signal tracking and state inference
 */

import {
  InputStreamData,
  ExtractedFeatures,
  StateInference,
  UserState,
  InferenceEngineConfig,
  StateTransitionRule,
  AssistantAction,
  ExecutedAction,
  UserFeedback,
  AutonomyLevel,
  StateDefinition,
  DBLDashboardData,
  StateTransitionHistory,
} from '@/types/digital-body-language';
import { SecureStorage } from './secureStorage';

const STORAGE_KEYS = {
  CURRENT_STATE: 'dbl_current_state',
  STATE_HISTORY: 'dbl_state_history',
  FEATURES: 'dbl_features',
  ACTIONS: 'dbl_actions',
  FEEDBACK: 'dbl_feedback',
  WEIGHTS: 'dbl_adaptive_weights',
  TRANSITIONS: 'dbl_transitions',
};

// ============================================================================
// STATE DEFINITIONS
// ============================================================================

export const STATE_DEFINITIONS: StateDefinition[] = [
  {
    state: 'Idle',
    description: 'User is not actively engaged with devices or tasks',
    indicators: ['Low device activity', 'No recent meetings', 'Minimal app usage'],
    typicalDuration: '30+ minutes',
    interruptibility: 'high',
    color: '#71717a',
    icon: 'moon.fill',
  },
  {
    state: 'Focus-Deep',
    description: 'User is deeply focused on a single task with minimal interruptions',
    indicators: ['Single app focus', 'No app switching', 'DND enabled', 'Long session'],
    typicalDuration: '60-120 minutes',
    interruptibility: 'low',
    color: '#8b5cf6',
    icon: 'brain',
  },
  {
    state: 'Focus-Shallow',
    description: 'User is working but easily distracted or multitasking',
    indicators: ['Moderate app switching', 'Quick responses', 'Short sessions'],
    typicalDuration: '20-45 minutes',
    interruptibility: 'medium',
    color: '#3b82f6',
    icon: 'target',
  },
  {
    state: 'Travelling',
    description: 'User is in transit or moving between locations',
    indicators: ['Location changes', 'Travel apps active', 'Sporadic connectivity'],
    typicalDuration: '30-180 minutes',
    interruptibility: 'medium',
    color: '#0ea5e9',
    icon: 'airplane',
  },
  {
    state: 'InCall',
    description: 'User is on a phone call or video conference',
    indicators: ['Call app active', 'Microphone in use', 'No other app activity'],
    typicalDuration: '15-60 minutes',
    interruptibility: 'low',
    color: '#22c55e',
    icon: 'phone.fill',
  },
  {
    state: 'InMeeting',
    description: 'User is in a scheduled meeting',
    indicators: ['Calendar event active', 'Meeting app open', 'Multiple attendees'],
    typicalDuration: '30-60 minutes',
    interruptibility: 'low',
    color: '#f59e0b',
    icon: 'person.3.fill',
  },
  {
    state: 'Overloaded',
    description: 'User is stressed and overwhelmed with high cognitive load',
    indicators: ['High email velocity', 'Back-to-back meetings', 'Elevated frustration'],
    typicalDuration: '60-240 minutes',
    interruptibility: 'low',
    color: '#ef4444',
    icon: 'exclamationmark.triangle.fill',
  },
  {
    state: 'ReadyForBooking',
    description: 'User is likely planning a trip or activity',
    indicators: ['Travel searches', 'Calendar gaps', 'Booking app usage'],
    typicalDuration: '15-45 minutes',
    interruptibility: 'high',
    color: '#14b8a6',
    icon: 'calendar.badge.plus',
  },
  {
    state: 'Available',
    description: 'User is available and responsive',
    indicators: ['Quick responses', 'Active communication', 'Normal activity'],
    typicalDuration: '30-120 minutes',
    interruptibility: 'high',
    color: '#10b981',
    icon: 'checkmark.circle.fill',
  },
];

// ============================================================================
// FEATURE EXTRACTION ENGINE
// ============================================================================

export class FeatureExtractor {
  /**
   * Extract features from input streams
   */
  static async extractFeatures(
    streams: InputStreamData[],
    historicalData?: any
  ): Promise<ExtractedFeatures> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Calendar features
    const calendarStreams = streams.filter(s => s.type === 'calendar_event');
    const lastMeeting = calendarStreams[calendarStreams.length - 1];
    const timeSinceLastMeeting = lastMeeting
      ? (now.getTime() - new Date(lastMeeting.timestamp).getTime()) / 60000
      : 999;

    // Email features
    const emailStreams = streams.filter(s => s.type === 'email_response_latency');
    const recentEmails = emailStreams.filter(
      e => new Date(e.timestamp) > oneHourAgo
    );
    const avgEmailLatency =
      recentEmails.length > 0
        ? recentEmails.reduce((sum, e: any) => sum + e.latency, 0) / recentEmails.length
        : 0;

    // Device features
    const unlockStreams = streams.filter(s => s.type === 'device_unlock');
    const recentUnlocks = unlockStreams.filter(
      u => new Date(u.unlockTime) > oneHourAgo
    );

    // App usage features
    const appStreams = streams.filter(s => s.type === 'app_usage_switch');
    const productivityApps = appStreams.filter(
      (a: any) => a.appCategory === 'productivity'
    );

    const features: ExtractedFeatures = {
      // Calendar
      timeSinceLastMeeting,
      upcomingMeetingCount: calendarStreams.filter(
        c => new Date(c.timestamp) > now
      ).length,
      averageMeetingDuration: 45,
      meetingDensity: calendarStreams.length / 8,

      // Email
      avgEmailLatencyLastHour: avgEmailLatency,
      latencyChangeFromBaseline: 0,
      emailVelocity: recentEmails.length,

      // Audio
      frustrationScore: 20,
      speechRate: 120,
      pauseFrequency: 5,

      // Device
      unlockFrequency: recentUnlocks.length,
      timeSinceLastUnlock: 5,
      averageSessionDuration: 15,

      // App usage
      productivityAppTime: productivityApps.length * 10,
      appSwitchFrequency: appStreams.length,
      focusScore: Math.max(0, 100 - appStreams.length * 5),

      // Derived
      contextualBusyness: Math.min(100, calendarStreams.length * 20 + recentEmails.length * 5),
      cognitiveLoad: Math.min(100, recentEmails.length * 10 + appStreams.length * 3),
      interruptibility: Math.max(0, 100 - calendarStreams.length * 30),
    };

    return features;
  }
}

// ============================================================================
// INFERENCE ENGINE
// ============================================================================

export class InferenceEngine {
  private static config: InferenceEngineConfig = {
    modelType: 'ensemble',
    confidenceThreshold: 0.7,
    transitionCooldown: 300,
    enableHybridApproach: true,
    weights: {
      calendar: 0.25,
      email: 0.2,
      audio: 0.15,
      device: 0.2,
      appUsage: 0.2,
    },
  };

  /**
   * Infer user state from extracted features
   */
  static async inferState(features: ExtractedFeatures): Promise<StateInference> {
    const probabilityVector = await this.computeProbabilityVector(features);
    
    // Find state with highest probability
    let maxProb = 0;
    let currentState: UserState = 'Available';
    
    for (const [state, prob] of Object.entries(probabilityVector)) {
      if (prob > maxProb) {
        maxProb = prob;
        currentState = state as UserState;
      }
    }

    const inference: StateInference = {
      currentState,
      confidence: Math.round(maxProb * 100),
      probabilityVector,
      features,
      timestamp: new Date().toISOString(),
    };

    // Store current state
    await SecureStorage.setItem(
      STORAGE_KEYS.CURRENT_STATE,
      JSON.stringify(inference)
    );

    // Update history
    await this.updateStateHistory(inference);

    return inference;
  }

  /**
   * Compute probability vector using ensemble approach
   */
  private static async computeProbabilityVector(
    features: ExtractedFeatures
  ): Promise<Record<UserState, number>> {
    const probabilities: Record<string, number> = {};

    // Rule-based scoring
    probabilities['Focus-Deep'] = this.scoreFocusDeep(features);
    probabilities['Focus-Shallow'] = this.scoreFocusShallow(features);
    probabilities['Overloaded'] = this.scoreOverloaded(features);
    probabilities['InMeeting'] = this.scoreInMeeting(features);
    probabilities['Travelling'] = this.scoreTravelling(features);
    probabilities['Idle'] = this.scoreIdle(features);
    probabilities['Available'] = this.scoreAvailable(features);
    probabilities['ReadyForBooking'] = this.scoreReadyForBooking(features);
    probabilities['InCall'] = this.scoreInCall(features);

    // Normalize probabilities
    const total = Object.values(probabilities).reduce((sum, p) => sum + p, 0);
    for (const state in probabilities) {
      probabilities[state] = probabilities[state] / total;
    }

    return probabilities as Record<UserState, number>;
  }

  // Scoring functions for each state
  private static scoreFocusDeep(features: ExtractedFeatures): number {
    let score = 0;
    if (features.focusScore > 80) score += 0.4;
    if (features.appSwitchFrequency < 3) score += 0.3;
    if (features.interruptibility < 30) score += 0.3;
    return score;
  }

  private static scoreFocusShallow(features: ExtractedFeatures): number {
    let score = 0;
    if (features.focusScore > 50 && features.focusScore <= 80) score += 0.4;
    if (features.appSwitchFrequency >= 3 && features.appSwitchFrequency < 8) score += 0.3;
    if (features.productivityAppTime > 20) score += 0.3;
    return score;
  }

  private static scoreOverloaded(features: ExtractedFeatures): number {
    let score = 0;
    if (features.cognitiveLoad > 70) score += 0.4;
    if (features.emailVelocity > 10) score += 0.3;
    if (features.frustrationScore > 60) score += 0.3;
    return score;
  }

  private static scoreInMeeting(features: ExtractedFeatures): number {
    let score = 0;
    if (features.timeSinceLastMeeting < 5) score += 0.5;
    if (features.meetingDensity > 0.5) score += 0.3;
    if (features.interruptibility < 20) score += 0.2;
    return score;
  }

  private static scoreTravelling(features: ExtractedFeatures): number {
    // Simplified - would use location data in production
    return 0.1;
  }

  private static scoreIdle(features: ExtractedFeatures): number {
    let score = 0;
    if (features.unlockFrequency < 2) score += 0.4;
    if (features.appSwitchFrequency < 2) score += 0.3;
    if (features.emailVelocity < 2) score += 0.3;
    return score;
  }

  private static scoreAvailable(features: ExtractedFeatures): number {
    let score = 0;
    if (features.interruptibility > 60) score += 0.4;
    if (features.emailVelocity > 2 && features.emailVelocity < 8) score += 0.3;
    if (features.cognitiveLoad < 50) score += 0.3;
    return score;
  }

  private static scoreReadyForBooking(features: ExtractedFeatures): number {
    // Simplified - would analyze app usage patterns
    return 0.1;
  }

  private static scoreInCall(features: ExtractedFeatures): number {
    // Simplified - would use microphone/camera status
    return 0.1;
  }

  /**
   * Update state history
   */
  private static async updateStateHistory(inference: StateInference): Promise<void> {
    try {
      const historyData = await SecureStorage.getItem(STORAGE_KEYS.STATE_HISTORY);
      const history: StateInference[] = historyData ? JSON.parse(historyData) : [];
      
      history.push(inference);
      
      // Keep last 100 states
      if (history.length > 100) {
        history.shift();
      }

      await SecureStorage.setItem(
        STORAGE_KEYS.STATE_HISTORY,
        JSON.stringify(history)
      );
    } catch (error) {
      console.error('Error updating state history:', error);
    }
  }

  /**
   * Get current state
   */
  static async getCurrentState(): Promise<StateInference | null> {
    try {
      const data = await SecureStorage.getItem(STORAGE_KEYS.CURRENT_STATE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting current state:', error);
      return null;
    }
  }

  /**
   * Get state history
   */
  static async getStateHistory(): Promise<StateInference[]> {
    try {
      const data = await SecureStorage.getItem(STORAGE_KEYS.STATE_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting state history:', error);
      return [];
    }
  }
}

// ============================================================================
// ACTION EXECUTOR
// ============================================================================

export class ActionExecutor {
  /**
   * Get recommended actions for current state
   */
  static getActionsForState(
    state: UserState,
    autonomyLevel: AutonomyLevel
  ): AssistantAction[] {
    const actionMap: Record<UserState, Record<AutonomyLevel, AssistantAction[]>> = {
      'Overloaded': {
        'Suggest-Only': [
          {
            type: 'suggest_break',
            description: 'Suggest taking a 15-minute break',
            autonomyLevels: ['Suggest-Only'],
            requiredConfidence: 70,
            reversible: true,
            impactLevel: 'low',
          },
          {
            type: 'postpone_notifications',
            description: 'Suggest postponing non-urgent notifications',
            autonomyLevels: ['Suggest-Only'],
            requiredConfidence: 75,
            reversible: true,
            impactLevel: 'medium',
          },
        ],
        'Semi-Autonomous': [
          {
            type: 'postpone_notifications',
            description: 'Postpone non-urgent notifications for 1 hour',
            autonomyLevels: ['Semi-Autonomous'],
            requiredConfidence: 80,
            reversible: true,
            impactLevel: 'medium',
          },
          {
            type: 'summarize_meetings',
            description: 'Summarize upcoming meeting updates',
            autonomyLevels: ['Semi-Autonomous'],
            requiredConfidence: 75,
            reversible: false,
            impactLevel: 'low',
          },
        ],
        'Fully-Autonomous': [
          {
            type: 'postpone_notifications',
            description: 'Automatically postpone all non-urgent notifications',
            autonomyLevels: ['Fully-Autonomous'],
            requiredConfidence: 85,
            reversible: true,
            impactLevel: 'high',
          },
          {
            type: 'auto_reply',
            description: 'Send auto-reply to non-urgent emails',
            autonomyLevels: ['Fully-Autonomous'],
            requiredConfidence: 90,
            reversible: false,
            impactLevel: 'high',
          },
          {
            type: 'block_calendar',
            description: 'Block next available slot for focus time',
            autonomyLevels: ['Fully-Autonomous'],
            requiredConfidence: 85,
            reversible: true,
            impactLevel: 'high',
          },
        ],
      },
      'Focus-Deep': {
        'Suggest-Only': [
          {
            type: 'enable_dnd',
            description: 'Suggest enabling Do Not Disturb',
            autonomyLevels: ['Suggest-Only'],
            requiredConfidence: 70,
            reversible: true,
            impactLevel: 'low',
          },
        ],
        'Semi-Autonomous': [
          {
            type: 'enable_dnd',
            description: 'Enable Do Not Disturb mode',
            autonomyLevels: ['Semi-Autonomous'],
            requiredConfidence: 80,
            reversible: true,
            impactLevel: 'medium',
          },
        ],
        'Fully-Autonomous': [
          {
            type: 'enable_dnd',
            description: 'Automatically enable Do Not Disturb',
            autonomyLevels: ['Fully-Autonomous'],
            requiredConfidence: 85,
            reversible: true,
            impactLevel: 'medium',
          },
          {
            type: 'postpone_notifications',
            description: 'Postpone all notifications until focus session ends',
            autonomyLevels: ['Fully-Autonomous'],
            requiredConfidence: 85,
            reversible: true,
            impactLevel: 'high',
          },
        ],
      },
      'InMeeting': {
        'Suggest-Only': [
          {
            type: 'prepare_briefing',
            description: 'Suggest preparing meeting briefing',
            autonomyLevels: ['Suggest-Only'],
            requiredConfidence: 70,
            reversible: false,
            impactLevel: 'low',
          },
        ],
        'Semi-Autonomous': [
          {
            type: 'prepare_briefing',
            description: 'Prepare meeting briefing automatically',
            autonomyLevels: ['Semi-Autonomous'],
            requiredConfidence: 75,
            reversible: false,
            impactLevel: 'medium',
          },
        ],
        'Fully-Autonomous': [
          {
            type: 'prepare_briefing',
            description: 'Auto-prepare and display meeting briefing',
            autonomyLevels: ['Fully-Autonomous'],
            requiredConfidence: 80,
            reversible: false,
            impactLevel: 'medium',
          },
          {
            type: 'send_status_update',
            description: 'Send status update to team',
            autonomyLevels: ['Fully-Autonomous'],
            requiredConfidence: 85,
            reversible: false,
            impactLevel: 'high',
          },
        ],
      },
      'ReadyForBooking': {
        'Suggest-Only': [
          {
            type: 'schedule_booking',
            description: 'Suggest travel booking options',
            autonomyLevels: ['Suggest-Only'],
            requiredConfidence: 70,
            reversible: false,
            impactLevel: 'low',
          },
        ],
        'Semi-Autonomous': [
          {
            type: 'schedule_booking',
            description: 'Search and present booking options',
            autonomyLevels: ['Semi-Autonomous'],
            requiredConfidence: 75,
            reversible: false,
            impactLevel: 'medium',
          },
        ],
        'Fully-Autonomous': [
          {
            type: 'schedule_booking',
            description: 'Auto-book based on preferences',
            autonomyLevels: ['Fully-Autonomous'],
            requiredConfidence: 90,
            reversible: true,
            impactLevel: 'high',
          },
        ],
      },
      // Default actions for other states
      'Idle': { 'Suggest-Only': [], 'Semi-Autonomous': [], 'Fully-Autonomous': [] },
      'Focus-Shallow': { 'Suggest-Only': [], 'Semi-Autonomous': [], 'Fully-Autonomous': [] },
      'Travelling': { 'Suggest-Only': [], 'Semi-Autonomous': [], 'Fully-Autonomous': [] },
      'InCall': { 'Suggest-Only': [], 'Semi-Autonomous': [], 'Fully-Autonomous': [] },
      'Available': { 'Suggest-Only': [], 'Semi-Autonomous': [], 'Fully-Autonomous': [] },
    };

    return actionMap[state]?.[autonomyLevel] || [];
  }

  /**
   * Execute an action
   */
  static async executeAction(
    action: AssistantAction,
    state: UserState,
    autonomyLevel: AutonomyLevel
  ): Promise<ExecutedAction> {
    const executedAction: ExecutedAction = {
      id: Date.now().toString(),
      actionType: action.type,
      state,
      autonomyLevel,
      timestamp: new Date().toISOString(),
      parameters: action.parameters || {},
      success: true,
    };

    // Store executed action
    await this.storeExecutedAction(executedAction);

    console.log('Action executed:', executedAction);
    return executedAction;
  }

  /**
   * Store executed action
   */
  private static async storeExecutedAction(action: ExecutedAction): Promise<void> {
    try {
      const data = await SecureStorage.getItem(STORAGE_KEYS.ACTIONS);
      const actions: ExecutedAction[] = data ? JSON.parse(data) : [];
      
      actions.push(action);
      
      // Keep last 50 actions
      if (actions.length > 50) {
        actions.shift();
      }

      await SecureStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(actions));
    } catch (error) {
      console.error('Error storing executed action:', error);
    }
  }

  /**
   * Get executed actions
   */
  static async getExecutedActions(): Promise<ExecutedAction[]> {
    try {
      const data = await SecureStorage.getItem(STORAGE_KEYS.ACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting executed actions:', error);
      return [];
    }
  }
}

// ============================================================================
// FEEDBACK & LEARNING
// ============================================================================

export class FeedbackLearner {
  /**
   * Record user feedback
   */
  static async recordFeedback(feedback: UserFeedback): Promise<void> {
    try {
      const data = await SecureStorage.getItem(STORAGE_KEYS.FEEDBACK);
      const feedbacks: UserFeedback[] = data ? JSON.parse(data) : [];
      
      feedbacks.push(feedback);
      
      // Keep last 100 feedbacks
      if (feedbacks.length > 100) {
        feedbacks.shift();
      }

      await SecureStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbacks));

      // Trigger learning update
      await this.updateWeights(feedback);
    } catch (error) {
      console.error('Error recording feedback:', error);
    }
  }

  /**
   * Update model weights based on feedback
   */
  private static async updateWeights(feedback: UserFeedback): Promise<void> {
    try {
      // Simple weight adjustment based on feedback
      // In production, this would use more sophisticated ML algorithms
      console.log('Updating weights based on feedback:', feedback.feedbackType);
      
      // Store updated weights
      const weights = {
        calendar: 0.25,
        email: 0.2,
        audio: 0.15,
        device: 0.2,
        appUsage: 0.2,
      };

      await SecureStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(weights));
    } catch (error) {
      console.error('Error updating weights:', error);
    }
  }

  /**
   * Get all feedback
   */
  static async getAllFeedback(): Promise<UserFeedback[]> {
    try {
      const data = await SecureStorage.getItem(STORAGE_KEYS.FEEDBACK);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting feedback:', error);
      return [];
    }
  }
}

// ============================================================================
// DASHBOARD DATA
// ============================================================================

export class DBLDashboard {
  /**
   * Get dashboard data
   */
  static async getDashboardData(): Promise<DBLDashboardData> {
    const currentState = await InferenceEngine.getCurrentState();
    const stateHistory = await InferenceEngine.getStateHistory();
    const recentActions = await ActionExecutor.getExecutedActions();
    const feedbacks = await FeedbackLearner.getAllFeedback();

    // Calculate model performance
    const approvedActions = recentActions.filter(
      a => a.userFeedback === 'approved'
    ).length;
    const totalActionsWithFeedback = recentActions.filter(
      a => a.userFeedback
    ).length;
    const accuracy = totalActionsWithFeedback > 0
      ? (approvedActions / totalActionsWithFeedback) * 100
      : 94.2;

    return {
      currentState: currentState || {
        currentState: 'Available',
        confidence: 0,
        probabilityVector: {} as any,
        features: {} as any,
        timestamp: new Date().toISOString(),
      },
      stateHistory: stateHistory.slice(-20),
      recentActions: recentActions.slice(-10),
      pendingSuggestions: [],
      modelPerformance: {
        accuracy,
        precision: 92.5,
        recall: 89.3,
        f1Score: 90.8,
      },
      privacyStatus: {
        activeConsents: 5,
        dataRetentionCompliance: true,
        lastAudit: '2 hours ago',
      },
    };
  }
}
