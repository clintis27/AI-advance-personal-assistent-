
import { BehaviorMetric, ActivityPattern, MoodDetection, DetectedEvent } from '@/types/behavior';
import { SecureStorage } from './secureStorage';

/**
 * Behavior Tracking Utilities
 * Collects time-of-day activity, task patterns, tone, and frequency
 */

const STORAGE_KEYS = {
  METRICS: 'behavior_metrics',
  PATTERNS: 'activity_patterns',
  MOODS: 'mood_history',
  EVENTS: 'detected_events',
};

export class BehaviorTracker {
  /**
   * Track user activity
   */
  static async trackActivity(
    activity: string,
    context: any = {}
  ): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      const hour = new Date().getHours();
      
      // Store activity with timestamp and context
      const activityData = {
        activity,
        timestamp,
        hour,
        context,
      };

      console.log('Activity tracked:', activityData);
      
      // Update patterns
      await this.updatePatterns(activity, hour);
      
      // Detect mood based on activity
      await this.detectMood(activity, context);
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }

  /**
   * Update activity patterns
   */
  private static async updatePatterns(
    activity: string,
    hour: number
  ): Promise<void> {
    try {
      const patterns = await this.getPatterns();
      const timeOfDay = this.getTimeOfDay(hour);
      
      const existingPattern = patterns.find(
        p => p.activity === activity && p.timeOfDay === timeOfDay
      );

      if (existingPattern) {
        existingPattern.frequency += 1;
        existingPattern.confidence = Math.min(
          95,
          existingPattern.confidence + 0.5
        );
      } else {
        patterns.push({
          id: Date.now().toString(),
          timeOfDay,
          activity,
          frequency: 1,
          duration: '30 min',
          confidence: 50,
          daysTracked: 1,
        });
      }

      await SecureStorage.setItem(
        STORAGE_KEYS.PATTERNS,
        JSON.stringify(patterns)
      );
    } catch (error) {
      console.error('Error updating patterns:', error);
    }
  }

  /**
   * Detect user mood based on activity and context
   */
  private static async detectMood(
    activity: string,
    context: any
  ): Promise<void> {
    try {
      // Simple mood detection logic (can be enhanced with ML)
      let mood: MoodDetection['mood'] = 'focused';
      let confidence = 70;
      const triggers: string[] = [];

      // Analyze activity type
      if (activity.includes('email') || activity.includes('message')) {
        mood = 'focused';
        triggers.push('Communication activity');
      } else if (activity.includes('meeting')) {
        mood = 'energetic';
        triggers.push('Collaborative session');
      } else if (activity.includes('break')) {
        mood = 'relaxed';
        triggers.push('Break time');
      } else if (context.deadline === 'urgent') {
        mood = 'stressed';
        triggers.push('Urgent deadline');
        confidence = 85;
      }

      const moodData: MoodDetection = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
        mood,
        confidence,
        triggers,
        energyLevel: this.calculateEnergyLevel(),
        productivityScore: this.calculateProductivityScore(),
      };

      const moods = await this.getMoods();
      moods.push(moodData);
      
      // Keep only last 10 moods
      if (moods.length > 10) {
        moods.shift();
      }

      await SecureStorage.setItem(
        STORAGE_KEYS.MOODS,
        JSON.stringify(moods)
      );
    } catch (error) {
      console.error('Error detecting mood:', error);
    }
  }

  /**
   * Get time of day category
   */
  private static getTimeOfDay(hour: number): string {
    if (hour >= 6 && hour < 9) return 'Morning (6-9 AM)';
    if (hour >= 9 && hour < 12) return 'Mid-Morning (9-12 PM)';
    if (hour >= 12 && hour < 15) return 'Afternoon (12-3 PM)';
    if (hour >= 15 && hour < 18) return 'Late Afternoon (3-6 PM)';
    if (hour >= 18 && hour < 21) return 'Evening (6-9 PM)';
    return 'Night (9 PM-6 AM)';
  }

  /**
   * Calculate energy level based on time of day
   */
  private static calculateEnergyLevel(): number {
    const hour = new Date().getHours();
    if (hour >= 9 && hour < 12) return 90; // Peak morning
    if (hour >= 14 && hour < 16) return 60; // Post-lunch dip
    if (hour >= 16 && hour < 18) return 75; // Afternoon recovery
    return 50; // Default
  }

  /**
   * Calculate productivity score
   */
  private static calculateProductivityScore(): number {
    // Simple calculation (can be enhanced with ML)
    return Math.floor(Math.random() * 30) + 70; // 70-100
  }

  /**
   * Get stored patterns
   */
  static async getPatterns(): Promise<ActivityPattern[]> {
    try {
      const data = await SecureStorage.getItem(STORAGE_KEYS.PATTERNS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting patterns:', error);
      return [];
    }
  }

  /**
   * Get stored moods
   */
  static async getMoods(): Promise<MoodDetection[]> {
    try {
      const data = await SecureStorage.getItem(STORAGE_KEYS.MOODS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting moods:', error);
      return [];
    }
  }

  /**
   * Get behavior metrics
   */
  static async getMetrics(): Promise<BehaviorMetric[]> {
    try {
      const data = await SecureStorage.getItem(STORAGE_KEYS.METRICS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting metrics:', error);
      return [];
    }
  }

  /**
   * Record detected event
   */
  static async recordEvent(event: DetectedEvent): Promise<void> {
    try {
      const events = await this.getEvents();
      events.push(event);
      
      // Keep only last 50 events
      if (events.length > 50) {
        events.shift();
      }

      await SecureStorage.setItem(
        STORAGE_KEYS.EVENTS,
        JSON.stringify(events)
      );
    } catch (error) {
      console.error('Error recording event:', error);
    }
  }

  /**
   * Get stored events
   */
  static async getEvents(): Promise<DetectedEvent[]> {
    try {
      const data = await SecureStorage.getItem(STORAGE_KEYS.EVENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  }

  /**
   * Clear all behavior data
   */
  static async clearAllData(): Promise<void> {
    try {
      await SecureStorage.deleteItem(STORAGE_KEYS.METRICS);
      await SecureStorage.deleteItem(STORAGE_KEYS.PATTERNS);
      await SecureStorage.deleteItem(STORAGE_KEYS.MOODS);
      await SecureStorage.deleteItem(STORAGE_KEYS.EVENTS);
      console.log('All behavior data cleared');
    } catch (error) {
      console.error('Error clearing behavior data:', error);
    }
  }
}

/**
 * Event Detection Engine
 * Detects triggers like "device on," "new urgent email," etc.
 */
export class EventDetector {
  /**
   * Detect device unlock event
   */
  static async detectDeviceUnlock(): Promise<void> {
    try {
      const event: DetectedEvent = {
        id: Date.now().toString(),
        triggerId: 'device_unlock',
        timestamp: new Date().toISOString(),
        context: { type: 'device', action: 'unlock' },
        actionsExecuted: ['show_priority_tasks'],
        success: true,
      };

      await BehaviorTracker.recordEvent(event);
      console.log('Device unlock detected');
    } catch (error) {
      console.error('Error detecting device unlock:', error);
    }
  }

  /**
   * Detect urgent email
   */
  static async detectUrgentEmail(emailData: any): Promise<void> {
    try {
      const event: DetectedEvent = {
        id: Date.now().toString(),
        triggerId: 'urgent_email',
        timestamp: new Date().toISOString(),
        context: { type: 'email', ...emailData },
        actionsExecuted: ['send_notification', 'prioritize_inbox'],
        success: true,
      };

      await BehaviorTracker.recordEvent(event);
      console.log('Urgent email detected');
    } catch (error) {
      console.error('Error detecting urgent email:', error);
    }
  }

  /**
   * Detect meeting starting soon
   */
  static async detectMeetingStartingSoon(meetingData: any): Promise<void> {
    try {
      const event: DetectedEvent = {
        id: Date.now().toString(),
        triggerId: 'meeting_starting',
        timestamp: new Date().toISOString(),
        context: { type: 'calendar', ...meetingData },
        actionsExecuted: ['prepare_briefing', 'send_reminder'],
        success: true,
      };

      await BehaviorTracker.recordEvent(event);
      console.log('Meeting starting soon detected');
    } catch (error) {
      console.error('Error detecting meeting:', error);
    }
  }

  /**
   * Detect location change
   */
  static async detectLocationChange(location: string): Promise<void> {
    try {
      const event: DetectedEvent = {
        id: Date.now().toString(),
        triggerId: 'location_change',
        timestamp: new Date().toISOString(),
        context: { type: 'location', location },
        actionsExecuted: ['update_work_mode'],
        success: true,
      };

      await BehaviorTracker.recordEvent(event);
      console.log('Location change detected:', location);
    } catch (error) {
      console.error('Error detecting location change:', error);
    }
  }

  /**
   * Detect focus time block
   */
  static async detectFocusTimeBlock(): Promise<void> {
    try {
      const event: DetectedEvent = {
        id: Date.now().toString(),
        triggerId: 'focus_time',
        timestamp: new Date().toISOString(),
        context: { type: 'time', mode: 'focus' },
        actionsExecuted: ['enable_dnd', 'block_distractions'],
        success: true,
      };

      await BehaviorTracker.recordEvent(event);
      console.log('Focus time block detected');
    } catch (error) {
      console.error('Error detecting focus time:', error);
    }
  }
}
