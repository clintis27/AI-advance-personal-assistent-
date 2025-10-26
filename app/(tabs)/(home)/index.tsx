
/**
 * AI Personal Assistant - Home Screen
 * 
 * CORE FEATURES:
 * - Seamless integration with email, calendar, meetings, and social apps
 * - Autonomous spoken agent for calls/messages/meetings
 * - Automatic schedule updates based on daily routine
 * - Digital behavior modeling ("digital body language")
 * - Strict privacy, consent, and audit trails
 * 
 * ARCHITECTURE:
 * - Tab-based navigation with 5 main screens:
 *   1. Home: Dashboard with predicted tasks, mood detection, email summary
 *   2. Agent: Autonomous agent controls and recent actions
 *   3. Routine: Daily patterns, schedule automation, behavior insights
 *   4. Privacy: Permissions, audit trail, data management
 *   5. Profile: User info, AI preferences, statistics
 * 
 * DATA FLOW:
 * - Mock data currently used for demonstration
 * - Ready for backend integration (Supabase recommended)
 * - All AI features are UI-ready for ML model integration
 * 
 * PRIVACY & SECURITY:
 * - Granular permission controls per service
 * - Complete audit trail of all AI actions
 * - End-to-end encryption support
 * - Data retention policies
 * - GDPR/CCPA compliant design
 * 
 * FUTURE INTEGRATIONS:
 * - Email APIs (Gmail, Outlook, etc.)
 * - Calendar APIs (Google Calendar, iCal, etc.)
 * - Meeting platforms (Zoom, Teams, Meet)
 * - Voice/Speech APIs (for autonomous agent)
 * - ML models for behavior prediction
 */

import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import Animated, { FadeInDown } from "react-native-reanimated";

interface PredictedTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  predictedTime: string;
  confidence: number;
}

interface EmailSummary {
  important: number;
  informational: number;
  spam: number;
  unread: number;
}

interface Meeting {
  id: string;
  title: string;
  time: string;
  duration: string;
  attendees: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const [predictedTasks] = useState<PredictedTask[]>([
    {
      id: '1',
      title: 'Review quarterly reports',
      description: 'Based on your calendar pattern, you usually review reports on Monday mornings',
      priority: 'high',
      predictedTime: '9:00 AM',
      confidence: 92,
    },
    {
      id: '2',
      title: 'Follow up with client emails',
      description: 'You typically respond to client emails after lunch',
      priority: 'medium',
      predictedTime: '2:00 PM',
      confidence: 85,
    },
    {
      id: '3',
      title: 'Prepare for tomorrow&apos;s presentation',
      description: 'AI detected a meeting scheduled for tomorrow',
      priority: 'high',
      predictedTime: '4:00 PM',
      confidence: 88,
    },
  ]);

  const [emailSummary] = useState<EmailSummary>({
    important: 12,
    informational: 28,
    spam: 5,
    unread: 45,
  });

  const [upcomingMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Team Standup',
      time: '10:00 AM',
      duration: '30 min',
      attendees: 8,
    },
    {
      id: '2',
      title: 'Client Presentation',
      time: '2:30 PM',
      duration: '1 hour',
      attendees: 5,
    },
  ]);

  const [moodDetection] = useState({
    currentMood: 'focused',
    energyLevel: 78,
    suggestion: 'Great time for deep work tasks',
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.accent;
      default:
        return colors.textSecondary;
    }
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log('Add new task')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="plus" color={colors.primary} size={24} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => console.log('Open settings')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="gear" color={colors.primary} size={24} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "AI Assistant",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header for Android/Web */}
          {Platform.OS !== 'ios' && (
            <View style={styles.headerContainer}>
              <View style={styles.headerTitleRow}>
                <Pressable
                  onPress={() => console.log('Open settings')}
                  style={styles.headerButton}
                >
                  <IconSymbol name="gear" color={colors.primary} size={24} />
                </Pressable>
                <Text style={styles.headerTitle}>AI Assistant</Text>
                <Pressable
                  onPress={() => console.log('Add new task')}
                  style={styles.headerButton}
                >
                  <IconSymbol name="plus" color={colors.primary} size={24} />
                </Pressable>
              </View>
            </View>
          )}

          {/* Mood & Energy Section */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="brain" color={colors.secondary} size={24} />
              <Text style={styles.sectionTitle}>Your Current State</Text>
            </View>
            <View style={[styles.card, styles.moodCard]}>
              <View style={styles.moodRow}>
                <View style={styles.moodInfo}>
                  <Text style={styles.moodLabel}>Mood</Text>
                  <Text style={styles.moodValue}>{moodDetection.currentMood}</Text>
                </View>
                <View style={styles.energyContainer}>
                  <Text style={styles.energyLabel}>Energy</Text>
                  <View style={styles.energyBar}>
                    <View 
                      style={[
                        styles.energyFill, 
                        { width: `${moodDetection.energyLevel}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.energyValue}>{moodDetection.energyLevel}%</Text>
                </View>
              </View>
              <View style={styles.suggestionContainer}>
                <IconSymbol name="lightbulb.fill" color={colors.warning} size={16} />
                <Text style={styles.suggestionText}>{moodDetection.suggestion}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Predicted Tasks Section */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="sparkles" color={colors.primary} size={24} />
              <Text style={styles.sectionTitle}>Predicted Tasks</Text>
            </View>
            {predictedTasks.map((task, index) => (
              <Pressable 
                key={task.id} 
                style={styles.card}
                onPress={() => console.log('Task pressed:', task.title)}
              >
                <View style={styles.taskHeader}>
                  <View style={styles.taskTitleRow}>
                    <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
                    <Text style={styles.taskTitle}>{task.title}</Text>
                  </View>
                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>{task.confidence}%</Text>
                  </View>
                </View>
                <Text style={styles.taskDescription}>{task.description}</Text>
                <View style={styles.taskFooter}>
                  <View style={styles.timeContainer}>
                    <IconSymbol name="clock" color={colors.textSecondary} size={14} />
                    <Text style={styles.taskTime}>{task.predictedTime}</Text>
                  </View>
                  <Text style={styles.priorityLabel}>{task.priority.toUpperCase()}</Text>
                </View>
              </Pressable>
            ))}
          </Animated.View>

          {/* Email Triage Summary */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="envelope.fill" color={colors.accent} size={24} />
              <Text style={styles.sectionTitle}>Email Triage</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.emailGrid}>
                <View style={styles.emailStat}>
                  <Text style={styles.emailCount}>{emailSummary.important}</Text>
                  <Text style={styles.emailLabel}>Important</Text>
                  <View style={[styles.emailIndicator, { backgroundColor: colors.error }]} />
                </View>
                <View style={styles.emailStat}>
                  <Text style={styles.emailCount}>{emailSummary.informational}</Text>
                  <Text style={styles.emailLabel}>Info</Text>
                  <View style={[styles.emailIndicator, { backgroundColor: colors.primary }]} />
                </View>
                <View style={styles.emailStat}>
                  <Text style={styles.emailCount}>{emailSummary.spam}</Text>
                  <Text style={styles.emailLabel}>Spam</Text>
                  <View style={[styles.emailIndicator, { backgroundColor: colors.textSecondary }]} />
                </View>
                <View style={styles.emailStat}>
                  <Text style={styles.emailCount}>{emailSummary.unread}</Text>
                  <Text style={styles.emailLabel}>Unread</Text>
                  <View style={[styles.emailIndicator, { backgroundColor: colors.warning }]} />
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Upcoming Meetings */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="calendar" color={colors.secondary} size={24} />
              <Text style={styles.sectionTitle}>Today&apos;s Meetings</Text>
            </View>
            {upcomingMeetings.map((meeting) => (
              <Pressable 
                key={meeting.id} 
                style={styles.card}
                onPress={() => console.log('Meeting pressed:', meeting.title)}
              >
                <View style={styles.meetingHeader}>
                  <Text style={styles.meetingTitle}>{meeting.title}</Text>
                  <View style={styles.attendeesContainer}>
                    <IconSymbol name="person.2.fill" color={colors.textSecondary} size={14} />
                    <Text style={styles.attendeesText}>{meeting.attendees}</Text>
                  </View>
                </View>
                <View style={styles.meetingFooter}>
                  <View style={styles.meetingTimeContainer}>
                    <IconSymbol name="clock.fill" color={colors.primary} size={14} />
                    <Text style={styles.meetingTime}>{meeting.time}</Text>
                  </View>
                  <Text style={styles.meetingDuration}>{meeting.duration}</Text>
                </View>
              </Pressable>
            ))}
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="bolt.fill" color={colors.warning} size={24} />
              <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>
            <View style={styles.quickActionsGrid}>
              <Pressable 
                style={styles.quickActionCard}
                onPress={() => router.push('/(tabs)/problem-solver')}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: colors.secondary + '20' }]}>
                  <IconSymbol name="lightbulb.fill" size={28} color={colors.secondary} />
                </View>
                <Text style={styles.quickActionLabel}>Problem Solver</Text>
              </Pressable>
              <Pressable 
                style={styles.quickActionCard}
                onPress={() => router.push('/(tabs)/travel')}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: colors.info + '20' }]}>
                  <IconSymbol name="airplane.departure" size={28} color={colors.info} />
                </View>
                <Text style={styles.quickActionLabel}>Travel</Text>
              </Pressable>
              <Pressable 
                style={styles.quickActionCard}
                onPress={() => router.push('/(tabs)/agent')}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '20' }]}>
                  <IconSymbol name="person.crop.circle.badge.checkmark" size={28} color={colors.primary} />
                </View>
                <Text style={styles.quickActionLabel}>Agent Status</Text>
              </Pressable>
              <Pressable 
                style={styles.quickActionCard}
                onPress={() => router.push('/(tabs)/routine')}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: colors.accent + '20' }]}>
                  <IconSymbol name="calendar.badge.clock" size={28} color={colors.accent} />
                </View>
                <Text style={styles.quickActionLabel}>My Routine</Text>
              </Pressable>
              <Pressable 
                style={styles.quickActionCard}
                onPress={() => router.push('/(tabs)/email')}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: colors.warning + '20' }]}>
                  <IconSymbol name="envelope.fill" size={28} color={colors.warning} />
                </View>
                <Text style={styles.quickActionLabel}>Email Triage</Text>
              </Pressable>
              <Pressable 
                style={styles.quickActionCard}
                onPress={() => router.push('/(tabs)/privacy')}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: colors.error + '20' }]}>
                  <IconSymbol name="lock.shield.fill" size={28} color={colors.error} />
                </View>
                <Text style={styles.quickActionLabel}>Privacy</Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Integration Status */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
            <View style={styles.integrationBanner}>
              <View style={styles.integrationHeader}>
                <IconSymbol name="link.circle.fill" size={24} color={colors.info} />
                <Text style={styles.integrationTitle}>Connected Services</Text>
              </View>
              <View style={styles.integrationList}>
                <View style={styles.integrationItem}>
                  <IconSymbol name="envelope.fill" size={16} color={colors.accent} />
                  <Text style={styles.integrationText}>Email</Text>
                  <View style={[styles.integrationStatus, { backgroundColor: colors.accent }]} />
                </View>
                <View style={styles.integrationItem}>
                  <IconSymbol name="calendar" size={16} color={colors.accent} />
                  <Text style={styles.integrationText}>Calendar</Text>
                  <View style={[styles.integrationStatus, { backgroundColor: colors.accent }]} />
                </View>
                <View style={styles.integrationItem}>
                  <IconSymbol name="message.fill" size={16} color={colors.textSecondary} />
                  <Text style={styles.integrationText}>Messages</Text>
                  <View style={[styles.integrationStatus, { backgroundColor: colors.textSecondary }]} />
                </View>
              </View>
              <Text style={styles.integrationNote}>
                Tap to manage integrations and permissions
              </Text>
            </View>
          </Animated.View>

          {/* Bottom padding for floating tab bar */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : 0,
  },
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  headerButtonContainer: {
    padding: 8,
  },
  
  // Mood Card Styles
  moodCard: {
    backgroundColor: colors.highlight,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodInfo: {
    flex: 1,
  },
  moodLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  moodValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'capitalize',
  },
  energyContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  energyLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  energyBar: {
    width: 120,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  energyFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  energyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  suggestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },

  // Task Card Styles
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.card,
  },
  taskDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskTime: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  priorityLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // Email Grid Styles
  emailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  emailStat: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  emailCount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  emailLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emailIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },

  // Meeting Card Styles
  meetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  attendeesText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  meetingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meetingTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meetingTime: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  meetingDuration: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  integrationBanner: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  integrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  integrationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  integrationList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  integrationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  integrationText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  integrationStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  integrationNote: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  bottomPadding: {
    height: 100,
  },
});
