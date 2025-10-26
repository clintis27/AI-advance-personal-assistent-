
/**
 * Notification and Update Types
 */

export type NotificationType = 
  | 'reminder'
  | 'meeting'
  | 'email'
  | 'task'
  | 'travel'
  | 'system'
  | 'update';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  priority: NotificationPriority;
  timestamp: string;
  read: boolean;
  actionable: boolean;
  actions?: NotificationAction[];
  data?: any;
}

export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  destructive?: boolean;
}

export interface StartupSummary {
  missedNotifications: AppNotification[];
  upcomingEvents: UpcomingEvent[];
  pendingTasks: PendingTask[];
  importantEmails: EmailSummaryItem[];
  travelUpdates: TravelUpdate[];
  systemUpdates: SystemUpdate[];
  generatedAt: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  location?: string;
  attendees?: number;
}

export interface PendingTask {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  overdue: boolean;
}

export interface EmailSummaryItem {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: string;
  important: boolean;
}

export interface TravelUpdate {
  id: string;
  type: 'flight' | 'hotel' | 'car';
  status: string;
  details: string;
  timestamp: string;
}

export interface SystemUpdate {
  id: string;
  title: string;
  description: string;
  version?: string;
  timestamp: string;
}
