
import { Stack, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { colors } from "@/styles/commonStyles";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform, Image } from "react-native";
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textMuted,
    lineHeight: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.3,
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  featuredCard: {
    backgroundColor: colors.card,
    borderRadius: 28,
    padding: 0,
    marginBottom: 24,
    overflow: 'hidden',
    boxShadow: `0px 12px 32px ${colors.shadow}`,
    elevation: 4,
  },
  featuredImage: {
    width: '100%',
    height: 280,
    backgroundColor: colors.cardSecondary,
  },
  featuredContent: {
    padding: 24,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.cardSecondary,
    marginBottom: 12,
  },
  featuredBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  featuredDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    boxShadow: `0px 8px 24px ${colors.shadow}`,
    elevation: 3,
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
    letterSpacing: -0.3,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  taskItemLast: {
    borderBottomWidth: 0,
  },
  taskPriority: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskTime: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  taskConfidence: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    boxShadow: `0px 6px 20px ${colors.shadow}`,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  meetingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  meetingItemLast: {
    borderBottomWidth: 0,
  },
  meetingTime: {
    width: 60,
    marginRight: 16,
  },
  meetingTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  meetingDuration: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 2,
  },
  meetingContent: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  meetingAttendees: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
    boxShadow: `0px 6px 20px ${colors.shadow}`,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.card,
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
      <IconSymbol name="person.circle.fill" size={28} color={colors.primary} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <View style={{ marginLeft: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>UNICORN</Text>
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
            entering={FadeInDown.duration(600).delay(100)}
            style={styles.header}
          >
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.title}>Destiny.</Text>
            <Text style={styles.subtitle}>
              A voyage fueled by desire to know. Seeking for timeless wisdom.
            </Text>
          </Animated.View>

          {/* Featured Card */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)}>
            <Pressable style={styles.featuredCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' }}
                style={styles.featuredImage}
                resizeMode="cover"
              />
              <View style={styles.featuredContent}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>Featured</Text>
                </View>
                <Text style={styles.featuredTitle}>The humming.</Text>
                <Text style={styles.featuredDescription}>
                  What is life without a little risk? It&apos;s time to fly and reach the sky!
                </Text>
              </View>
            </Pressable>
          </Animated.View>

          {/* Email Stats */}
          <Animated.View entering={FadeInDown.duration(600).delay(300)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today&apos;s Overview</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{emailSummary.important}</Text>
                <Text style={styles.statLabel}>Important</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{emailSummary.unread}</Text>
                <Text style={styles.statLabel}>Unread</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{upcomingMeetings.length}</Text>
                <Text style={styles.statLabel}>Meetings</Text>
              </View>
            </View>
          </Animated.View>

          {/* Predicted Tasks */}
          <Animated.View entering={FadeInDown.duration(600).delay(400)}>
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
          <Animated.View entering={FadeInDown.duration(600).delay(500)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Meetings</Text>
              <Pressable style={styles.seeAllButton}>
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
              <Pressable style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Schedule New Meeting</Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </>
  );
}
