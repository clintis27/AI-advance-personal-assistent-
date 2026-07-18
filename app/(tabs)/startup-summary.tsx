
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { notificationService } from '@/services/notificationService';
import { syncService } from '@/services/syncService';
import { StartupSummary } from '@/types/notifications';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function StartupSummaryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<StartupSummary | null>(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      // Sync data first
      await syncService.syncNow();
      
      // Generate summary
      const summaryData = await notificationService.generateStartupSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)/(home)');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Catching you up...</Text>
      </View>
    );
  }

  if (!summary) {
    return (
      <View style={styles.errorContainer}>
        <IconSymbol name="exclamationmark.triangle.fill" size={48} color={colors.error} />
        <Text style={styles.errorText}>Failed to load summary</Text>
        <Pressable style={styles.retryButton} onPress={loadSummary}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const hasUpdates =
    summary.missedNotifications.length > 0 ||
    summary.upcomingEvents.length > 0 ||
    summary.pendingTasks.length > 0 ||
    summary.importantEmails.length > 0;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Welcome Back',
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerRight: () => (
            <Pressable onPress={handleContinue}>
              <Text style={styles.skipButton}>Skip</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <IconSymbol name="sparkles" size={64} color={colors.primary} />
          <Text style={styles.title}>Here&apos;s what you missed</Text>
          <Text style={styles.subtitle}>
            {hasUpdates
              ? 'Your assistant has been busy while you were away'
              : 'You&apos;re all caught up!'}
          </Text>
        </Animated.View>

        {summary.missedNotifications.length > 0 && (
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="bell.badge.fill" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>
                {summary.missedNotifications.length} Notifications
              </Text>
            </View>
            {summary.missedNotifications.slice(0, 3).map((notification, index) => (
              <View key={notification.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{notification.title}</Text>
                  <Text style={styles.cardTime}>
                    {new Date(notification.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <Text style={styles.cardBody}>{notification.body}</Text>
              </View>
            ))}
            {summary.missedNotifications.length > 3 && (
              <Text style={styles.moreText}>
                +{summary.missedNotifications.length - 3} more notifications
              </Text>
            )}
          </Animated.View>
        )}

        {summary.upcomingEvents.length > 0 && (
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="calendar.badge.clock" size={24} color={colors.info} />
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
            </View>
            {summary.upcomingEvents.map((event, index) => (
              <View key={event.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{event.title}</Text>
                  <Text style={styles.cardTime}>{event.time}</Text>
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventDetail}>
                    <IconSymbol name="clock.fill" size={14} color={colors.textSecondary} />{' '}
                    {event.duration}
                  </Text>
                  {event.attendees && (
                    <Text style={styles.eventDetail}>
                      <IconSymbol name="person.2.fill" size={14} color={colors.textSecondary} />{' '}
                      {event.attendees} attendees
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {summary.pendingTasks.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="checkmark.circle.fill" size={24} color={colors.warning} />
              <Text style={styles.sectionTitle}>Pending Tasks</Text>
            </View>
            {summary.pendingTasks.map((task, index) => (
              <View key={task.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{task.title}</Text>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: getPriorityColor(task.priority) },
                    ]}
                  >
                    <Text style={styles.priorityText}>{task.priority}</Text>
                  </View>
                </View>
                {task.dueDate && (
                  <Text style={[styles.dueDate, task.overdue && styles.overdue]}>
                    {task.overdue ? 'Overdue: ' : 'Due: '}
                    {task.dueDate}
                  </Text>
                )}
              </View>
            ))}
          </Animated.View>
        )}

        {summary.importantEmails.length > 0 && (
          <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="envelope.badge.fill" size={24} color={colors.error} />
              <Text style={styles.sectionTitle}>Important Emails</Text>
            </View>
            {summary.importantEmails.map((email, index) => (
              <View key={email.id} style={styles.card}>
                <Text style={styles.emailFrom}>{email.from}</Text>
                <Text style={styles.emailSubject}>{email.subject}</Text>
                <Text style={styles.emailPreview}>{email.preview}</Text>
                <Text style={styles.emailTime}>{email.timestamp}</Text>
              </View>
            ))}
          </Animated.View>
        )}

        {!hasUpdates && (
          <Animated.View entering={FadeInDown.delay(200)} style={styles.emptyState}>
            <IconSymbol name="checkmark.circle.fill" size={80} color={colors.success} />
            <Text style={styles.emptyStateTitle}>All Caught Up!</Text>
            <Text style={styles.emptyStateText}>
              No new updates while you were away. Your assistant is ready to help you today.
            </Text>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(600)} style={styles.footer}>
          <Pressable style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue to Dashboard</Text>
            <IconSymbol name="arrow.right" size={20} color={colors.primaryForeground} />
          </Pressable>
        </Animated.View>
      </ScrollView>
    </>
  );
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return colors.error;
    case 'medium':
      return colors.warning;
    case 'low':
      return colors.info;
    default:
      return colors.textMuted;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  skipButton: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  cardTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardBody: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  eventDetails: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  eventDetail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryForeground,
    textTransform: 'uppercase',
  },
  dueDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  overdue: {
    color: colors.error,
    fontWeight: '600',
  },
  emailFrom: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  emailSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emailPreview: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  emailTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  moreText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  footer: {
    marginTop: 16,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
});
