
/**
 * Notification Service
 * Handles push notifications, startup summaries, and missed updates
 */

import { SecureStorage } from '@/utils/secureStorage';
import { authService } from './authService';
import {
  AppNotification,
  NotificationType,
  NotificationPriority,
  StartupSummary,
  UpcomingEvent,
  PendingTask,
  EmailSummaryItem,
} from '@/types/notifications';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  private static instance: NotificationService;
  private notifications: AppNotification[] = [];
  private lastCheckTime: string | null = null;

  private constructor() {
    this.initialize();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize notification service
   */
  private async initialize() {
    console.log('Initializing notification service...');
    
    // Request notification permissions
    await this.requestPermissions();
    
    // Load saved notifications
    await this.loadNotifications();
    
    // Set up notification listeners
    this.setupListeners();
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return false;
      }

      // Get push token
      if (Platform.OS !== 'web') {
        const token = await Notifications.getExpoPushTokenAsync();
        console.log('Push token:', token.data);
        
        // Save push token to user profile
        await SecureStorage.setItem('push_token', token.data);
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Set up notification listeners
   */
  private setupListeners() {
    // Handle notification received while app is in foreground
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      this.handleNotificationReceived(notification);
    });

    // Handle notification tapped
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      this.handleNotificationTapped(response);
    });
  }

  /**
   * Handle notification received
   */
  private handleNotificationReceived(notification: Notifications.Notification) {
    const appNotification: AppNotification = {
      id: notification.request.identifier,
      type: (notification.request.content.data?.type as NotificationType) || 'system',
      title: notification.request.content.title || '',
      body: notification.request.content.body || '',
      priority: (notification.request.content.data?.priority as NotificationPriority) || 'medium',
      timestamp: new Date().toISOString(),
      read: false,
      actionable: !!notification.request.content.data?.actions,
      data: notification.request.content.data,
    };

    this.notifications.unshift(appNotification);
    this.saveNotifications();
  }

  /**
   * Handle notification tapped
   */
  private handleNotificationTapped(response: Notifications.NotificationResponse) {
    const notificationId = response.notification.request.identifier;
    this.markAsRead(notificationId);
    
    // Handle action if present
    if (response.actionIdentifier) {
      console.log('Notification action:', response.actionIdentifier);
    }
  }

  /**
   * Send local notification
   */
  async sendNotification(
    title: string,
    body: string,
    type: NotificationType = 'system',
    priority: NotificationPriority = 'medium',
    data?: any
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { type, priority, ...data },
          sound: true,
          priority: this.getPriorityLevel(priority),
        },
        trigger: null, // Send immediately
      });

      console.log('Notification sent:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Schedule notification
   */
  async scheduleNotification(
    title: string,
    body: string,
    triggerDate: Date,
    type: NotificationType = 'reminder',
    priority: NotificationPriority = 'medium',
    data?: any
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { type, priority, ...data },
          sound: true,
          priority: this.getPriorityLevel(priority),
        },
        trigger: triggerDate,
      });

      console.log('Notification scheduled:', notificationId, 'for', triggerDate);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  /**
   * Generate startup summary
   */
  async generateStartupSummary(): Promise<StartupSummary> {
    console.log('Generating startup summary...');
    
    const lastCheck = this.lastCheckTime || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    // Get missed notifications
    const missedNotifications = this.notifications.filter(
      n => !n.read && new Date(n.timestamp) > new Date(lastCheck)
    );

    // Mock data for demonstration
    const summary: StartupSummary = {
      missedNotifications,
      upcomingEvents: this.getMockUpcomingEvents(),
      pendingTasks: this.getMockPendingTasks(),
      importantEmails: this.getMockImportantEmails(),
      travelUpdates: [],
      systemUpdates: [],
      generatedAt: new Date().toISOString(),
    };

    this.lastCheckTime = new Date().toISOString();
    await SecureStorage.setItem('last_check_time', this.lastCheckTime);

    return summary;
  }

  /**
   * Get all notifications
   */
  getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  /**
   * Get unread notifications
   */
  getUnreadNotifications(): AppNotification[] {
    return this.notifications.filter(n => !n.read);
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.read = true;
      await this.saveNotifications();
    }
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(): Promise<void> {
    this.notifications.forEach(n => n.read = true);
    await this.saveNotifications();
  }

  /**
   * Clear all notifications
   */
  async clearAll(): Promise<void> {
    this.notifications = [];
    await this.saveNotifications();
    await Notifications.dismissAllNotificationsAsync();
  }

  /**
   * Save notifications to storage
   */
  private async saveNotifications(): Promise<void> {
    try {
      await SecureStorage.setItem('notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  /**
   * Load notifications from storage
   */
  private async loadNotifications(): Promise<void> {
    try {
      const data = await SecureStorage.getItem('notifications');
      
      if (data) {
        this.notifications = JSON.parse(data);
        console.log('Loaded notifications:', this.notifications.length);
      }

      const lastCheck = await SecureStorage.getItem('last_check_time');
      if (lastCheck) {
        this.lastCheckTime = lastCheck;
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  /**
   * Get priority level for Expo notifications
   */
  private getPriorityLevel(priority: NotificationPriority): Notifications.AndroidNotificationPriority {
    switch (priority) {
      case 'urgent':
        return Notifications.AndroidNotificationPriority.MAX;
      case 'high':
        return Notifications.AndroidNotificationPriority.HIGH;
      case 'medium':
        return Notifications.AndroidNotificationPriority.DEFAULT;
      case 'low':
        return Notifications.AndroidNotificationPriority.LOW;
      default:
        return Notifications.AndroidNotificationPriority.DEFAULT;
    }
  }

  /**
   * Mock data generators
   */
  private getMockUpcomingEvents(): UpcomingEvent[] {
    return [
      {
        id: '1',
        title: 'Team Standup',
        time: '09:00 AM',
        duration: '30 min',
        attendees: 5,
      },
      {
        id: '2',
        title: 'Client Meeting',
        time: '02:00 PM',
        duration: '1 hour',
        location: 'Conference Room A',
        attendees: 8,
      },
    ];
  }

  private getMockPendingTasks(): PendingTask[] {
    return [
      {
        id: '1',
        title: 'Review project proposal',
        priority: 'high',
        dueDate: 'Today',
        overdue: false,
      },
      {
        id: '2',
        title: 'Submit expense report',
        priority: 'medium',
        dueDate: 'Tomorrow',
        overdue: false,
      },
    ];
  }

  private getMockImportantEmails(): EmailSummaryItem[] {
    return [
      {
        id: '1',
        from: 'boss@company.com',
        subject: 'Q4 Planning Meeting',
        preview: 'Please review the attached documents before our meeting...',
        timestamp: '2 hours ago',
        important: true,
      },
    ];
  }
}

export const notificationService = NotificationService.getInstance();
