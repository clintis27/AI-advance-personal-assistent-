
import { Stack, useRouter } from "expo-router";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { colors } from "@/styles/commonStyles";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform } from "react-native";
import React, { useState } from "react";
import { IconSymbol } from "@/components/IconSymbol";

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textMuted,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -1.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.7,
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: `0px 4px 16px ${colors.shadow}`,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.4,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  taskItemLast: {
    borderBottomWidth: 0,
  },
  taskPriority: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: 14,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  taskDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskTime: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
    letterSpacing: -0.2,
  },
  taskConfidence: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  meetingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  meetingItemLast: {
    borderBottomWidth: 0,
  },
  meetingTime: {
    width: 70,
    marginRight: 16,
  },
  meetingTimeText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  meetingDuration: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 2,
    letterSpacing: -0.2,
  },
  meetingContent: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  meetingAttendees: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 12,
    boxShadow: `0px 2px 8px ${colors.shadowMedium}`,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryForeground,
    letterSpacing: -0.2,
  },
  quickActionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: `0px 4px 16px ${colors.shadow}`,
    elevation: 2,
  },
  quickActionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.4,
  },
  quickActionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
});

export default function HomeScreen() {
  const router = useRouter();
  
  const [predictedTasks] = useState<PredictedTask[]>([
    {
      id: '1',
      title: 'Review Q4 Budget',
      description: 'Based on your calendar, this is typically done on Monday mornings',
      priority: 'high',
      predictedTime: '9:00 AM',
      confidence: 92,
    },
    {
      id: '2',
      title: 'Team Standup Prep',
      description: 'You usually prepare notes 15 minutes before the meeting',
      priority: 'medium',
      predictedTime: '9:45 AM',
      confidence: 88,
    },
    {
      id: '3',
      title: 'Lunch Break',
      description: 'Your typical lunch time based on recent patterns',
      priority: 'low',
      predictedTime: '12:30 PM',
      confidence: 95,
    },
  ]);

  const [emailSummary] = useState<EmailSummary>({
    important: 5,
    informational: 12,
    spam: 3,
    unread: 20,
  });

  const [upcomingMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Team Standup',
      time: '10:00 AM',
      duration: '15 min',
      attendees: 8,
    },
    {
      id: '2',
      title: 'Product Review',
      time: '2:00 PM',
      duration: '1 hour',
      attendees: 5,
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.textMuted;
    }
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => router.push('/profile')}
      style={{ marginRight: 16 }}
    >
      <View style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
      }}>
        <IconSymbol name="person.fill" size={20} color={colors.text} />
      </View>
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <View style={{ marginLeft: 16, flexDirection: 'row', alignItems: 'center' }}>
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
      }}>
        <IconSymbol name="sparkles" size={18} color={colors.primaryForeground} />
      </View>
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, letterSpacing: -0.5 }}>
        AI Assistant
      </Text>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerTransparent: true,
          headerLeft: renderHeaderLeft,
          headerRight: renderHeaderRight,
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View 
            entering={FadeInDown.duration(500).delay(100)}
            style={styles.header}
          >
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Your AI assistant is ready to help you stay productive and organized.
            </Text>
          </Animated.View>

          {/* Stats Overview */}
          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today&apos;s Overview</Text>
            </View>
            <View style={styles.statsGrid}>
              <Pressable style={styles.statCard} onPress={() => router.push('/email')}>
                <Text style={styles.statValue}>{emailSummary.important}</Text>
                <Text style={styles.statLabel}>Important</Text>
              </Pressable>
              <Pressable style={styles.statCard} onPress={() => router.push('/email')}>
                <Text style={styles.statValue}>{emailSummary.unread}</Text>
                <Text style={styles.statLabel}>Unread</Text>
              </Pressable>
              <Pressable style={styles.statCard} onPress={() => router.push('/meetings')}>
                <Text style={styles.statValue}>{upcomingMeetings.length}</Text>
                <Text style={styles.statLabel}>Meetings</Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View entering={FadeInDown.duration(500).delay(300)}>
            <View style={styles.quickActionCard}>
              <Text style={styles.quickActionTitle}>Quick Actions</Text>
              <View style={styles.quickActionGrid}>
                <Pressable 
                  style={styles.quickActionButton}
                  onPress={() => router.push('/email')}
                >
                  <View style={styles.quickActionIcon}>
                    <IconSymbol name="envelope.fill" size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.quickActionLabel}>Email</Text>
                </Pressable>
                <Pressable 
                  style={styles.quickActionButton}
                  onPress={() => router.push('/meetings')}
                >
                  <View style={styles.quickActionIcon}>
                    <IconSymbol name="calendar" size={24} color={colors.violet} />
                  </View>
                  <Text style={styles.quickActionLabel}>Calendar</Text>
                </Pressable>
                <Pressable 
                  style={styles.quickActionButton}
                  onPress={() => router.push('/voice')}
                >
                  <View style={styles.quickActionIcon}>
                    <IconSymbol name="mic.fill" size={24} color={colors.emerald} />
                  </View>
                  <Text style={styles.quickActionLabel}>Voice</Text>
                </Pressable>
                <Pressable 
                  style={styles.quickActionButton}
                  onPress={() => router.push('/travel')}
                >
                  <View style={styles.quickActionIcon}>
                    <IconSymbol name="airplane" size={24} color={colors.amber} />
                  </View>
                  <Text style={styles.quickActionLabel}>Travel</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>

          {/* Predicted Tasks */}
          <Animated.View entering={FadeInDown.duration(500).delay(400)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Predicted Tasks</Text>
              <Pressable style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See all</Text>
              </Pressable>
            </View>
            <View style={styles.card}>
              {predictedTasks.map((task, index) => (
                <View
                  key={task.id}
                  style={[
                    styles.taskItem,
                    index === predictedTasks.length - 1 && styles.taskItemLast,
                  ]}
                >
                  <View
                    style={[
                      styles.taskPriority,
                      { backgroundColor: getPriorityColor(task.priority) },
                    ]}
                  />
                  <View style={styles.taskContent}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskDescription}>{task.description}</Text>
                    <View style={styles.taskMeta}>
                      <Text style={styles.taskTime}>{task.predictedTime}</Text>
                      <Text style={styles.taskConfidence}>{task.confidence}% confident</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Upcoming Meetings */}
          <Animated.View entering={FadeInDown.duration(500).delay(500)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Meetings</Text>
              <Pressable style={styles.seeAllButton} onPress={() => router.push('/meetings')}>
                <Text style={styles.seeAllText}>See all</Text>
              </Pressable>
            </View>
            <View style={styles.card}>
              {upcomingMeetings.map((meeting, index) => (
                <View
                  key={meeting.id}
                  style={[
                    styles.meetingItem,
                    index === upcomingMeetings.length - 1 && styles.meetingItemLast,
                  ]}
                >
                  <View style={styles.meetingTime}>
                    <Text style={styles.meetingTimeText}>{meeting.time}</Text>
                    <Text style={styles.meetingDuration}>{meeting.duration}</Text>
                  </View>
                  <View style={styles.meetingContent}>
                    <Text style={styles.meetingTitle}>{meeting.title}</Text>
                    <Text style={styles.meetingAttendees}>
                      {meeting.attendees} attendees
                    </Text>
                  </View>
                </View>
              ))}
              <Pressable style={styles.actionButton} onPress={() => router.push('/meetings')}>
                <Text style={styles.actionButtonText}>Schedule New Meeting</Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </>
  );
}
