
import { Stack, useRouter } from "expo-router";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { colors } from "@/styles/commonStyles";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform } from "react-native";
import React, { useState } from "react";
import { IconSymbol } from "@/components/IconSymbol";
import { AIStatusIndicator } from "@/components/AIStatusIndicator";
import { useTheme } from "@react-navigation/native";
import { Card } from "@/components/ui/Card";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Separator } from "@/components/ui/Separator";
import * as Haptics from "expo-haptics";

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

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [predictedTasks] = useState<PredictedTask[]>([
    {
      id: '1',
      title: 'Review Q4 Budget',
      description: 'Based on your calendar, this is due tomorrow',
      priority: 'high',
      predictedTime: '2:00 PM',
      confidence: 92,
    },
    {
      id: '2',
      title: 'Prepare for Team Standup',
      description: 'You usually do this 30 minutes before',
      priority: 'medium',
      predictedTime: '9:30 AM',
      confidence: 85,
    },
    {
      id: '3',
      title: 'Follow up with Sarah',
      description: 'Email thread has been inactive for 3 days',
      priority: 'low',
      predictedTime: '4:00 PM',
      confidence: 78,
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
      title: 'Product Strategy Review',
      time: '10:00 AM',
      duration: '1h',
      attendees: 8,
    },
    {
      id: '2',
      title: '1:1 with Manager',
      time: '2:30 PM',
      duration: '30m',
      attendees: 2,
    },
  ]);

  const [quickActions] = useState<QuickAction[]>([
    {
      id: '1',
      title: 'Problem Solver',
      icon: 'lightbulb',
      color: colors.amber,
      route: '/(tabs)/problem-solver',
    },
    {
      id: '2',
      title: 'Travel',
      icon: 'airplane',
      color: colors.indigo,
      route: '/(tabs)/travel',
    },
    {
      id: '3',
      title: 'Voice',
      icon: 'mic',
      color: colors.violet,
      route: '/(tabs)/voice',
    },
    {
      id: '4',
      title: 'Behavior',
      icon: 'chart.bar',
      color: colors.teal,
      route: '/(tabs)/behavior',
    },
  ]);

  const getPriorityColor = (priority: string) => {
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
  };

  const getPriorityVariant = (priority: string): 'error' | 'warning' | 'info' => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'info';
    }
  };

  const handleQuickActionPress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => router.push('/(tabs)/ai-config')}
      style={{ marginRight: 16 }}
    >
      <IconSymbol
        name="gearshape"
        size={24}
        color={theme.dark ? colors.textDark : colors.text}
      />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <View style={{ marginLeft: 16 }}>
      <Text style={[styles.greeting, { color: theme.dark ? colors.textDark : colors.text }]}>
        Good Morning
      </Text>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerLeft: renderHeaderLeft,
          headerRight: renderHeaderRight,
          headerStyle: {
            backgroundColor: theme.dark ? colors.backgroundDark : colors.background,
          },
          headerShadowVisible: false,
        }}
      />
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: theme.dark ? colors.backgroundDark : colors.background },
        ]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.heroSection}>
          <Text style={[styles.heroTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Your AI Personal Assistant
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
            Powered by GPT-5 + LangChain + Pinecone
          </Text>
          <View style={styles.statusContainer}>
            <AIStatusIndicator onPress={() => router.push('/(tabs)/ai-dashboard' as any)} />
          </View>
        </Animated.View>

        {/* Quick Actions - Modern & Simple Design */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <Animated.View
                key={action.id}
                entering={FadeInDown.delay(index * 80).duration(400).springify()}
                style={styles.quickActionWrapper}
              >
                <Pressable
                  onPress={() => handleQuickActionPress(action.route)}
                  style={({ pressed }) => [
                    styles.quickAction,
                    {
                      backgroundColor: theme.dark ? colors.cardDark : colors.card,
                      borderColor: theme.dark ? colors.borderDark : colors.border,
                      transform: [{ scale: pressed ? 0.96 : 1 }],
                    },
                  ]}
                >
                  <View style={styles.quickActionContent}>
                    <View style={[styles.iconContainer, { backgroundColor: `${action.color}15` }]}>
                      <IconSymbol name={action.icon} size={28} color={action.color} />
                    </View>
                    <Text 
                      style={[
                        styles.quickActionLabel, 
                        { color: theme.dark ? colors.textDark : colors.text }
                      ]}
                      numberOfLines={1}
                    >
                      {action.title}
                    </Text>
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </View>

        <Separator />

        {/* Email Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              Email Triage
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => router.push('/(tabs)/email')}
            >
              View All
            </Button>
          </View>
          <AnimatedCard variant="compact" animation="fadeInLeft" delay={200}>
            <View style={styles.emailSummaryRow}>
              <View style={styles.emailSummaryItem}>
                <Badge variant="error" size="sm">
                  {emailSummary.important}
                </Badge>
                <Text style={[styles.emailSummaryLabel, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                  Important
                </Text>
              </View>
              <View style={styles.emailSummaryItem}>
                <Badge variant="info" size="sm">
                  {emailSummary.informational}
                </Badge>
                <Text style={[styles.emailSummaryLabel, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                  Info
                </Text>
              </View>
              <View style={styles.emailSummaryItem}>
                <Badge variant="warning" size="sm">
                  {emailSummary.spam}
                </Badge>
                <Text style={[styles.emailSummaryLabel, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                  Spam
                </Text>
              </View>
              <View style={styles.emailSummaryItem}>
                <Badge variant="outline" size="sm">
                  {emailSummary.unread}
                </Badge>
                <Text style={[styles.emailSummaryLabel, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                  Unread
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Upcoming Meetings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              Upcoming Meetings
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => router.push('/(tabs)/meetings')}
            >
              View All
            </Button>
          </View>
          {upcomingMeetings.map((meeting, index) => (
            <AnimatedCard
              key={meeting.id}
              variant="small"
              interactive
              onPress={() => router.push('/(tabs)/meetings')}
              animation="fadeInRight"
              delay={300 + index * 100}
            >
              <View style={styles.meetingHeader}>
                <View style={styles.meetingIconContainer}>
                  <IconSymbol name="calendar" size={20} color={colors.primary} />
                </View>
                <View style={styles.meetingInfo}>
                  <Text style={[styles.meetingTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
                    {meeting.title}
                  </Text>
                  <View style={styles.meetingMeta}>
                    <Text style={[styles.meetingTime, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                      {meeting.time}
                    </Text>
                    <Text style={[styles.meetingDuration, { color: theme.dark ? colors.textMutedDark : colors.textMuted }]}>
                      • {meeting.duration}
                    </Text>
                    <Text style={[styles.meetingAttendees, { color: theme.dark ? colors.textMutedDark : colors.textMuted }]}>
                      • {meeting.attendees} attendees
                    </Text>
                  </View>
                </View>
              </View>
            </AnimatedCard>
          ))}
        </View>

        <Separator />

        {/* Predicted Tasks */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Predicted Tasks
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
            AI-powered task predictions based on your behavior
          </Text>
          {predictedTasks.map((task, index) => (
            <AnimatedCard
              key={task.id}
              variant="compact"
              interactive
              animation="fadeInUp"
              delay={400 + index * 100}
            >
              <View style={styles.taskHeader}>
                <View style={styles.taskTitleRow}>
                  <Text style={[styles.taskTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
                    {task.title}
                  </Text>
                  <Badge variant={getPriorityVariant(task.priority)} size="sm">
                    {task.priority}
                  </Badge>
                </View>
                <Text style={[styles.taskDescription, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                  {task.description}
                </Text>
              </View>
              <View style={styles.taskFooter}>
                <View style={styles.taskTimeContainer}>
                  <IconSymbol name="clock" size={14} color={theme.dark ? colors.textMutedDark : colors.textMuted} />
                  <Text style={[styles.taskTime, { color: theme.dark ? colors.textMutedDark : colors.textMuted }]}>
                    {task.predictedTime}
                  </Text>
                </View>
                <View style={styles.confidenceContainer}>
                  <Text style={[styles.confidenceLabel, { color: theme.dark ? colors.textMutedDark : colors.textMuted }]}>
                    Confidence:
                  </Text>
                  <Progress
                    value={task.confidence}
                    height={6}
                    style={styles.confidenceProgress}
                  />
                  <Text style={[styles.confidenceValue, { color: theme.dark ? colors.textDark : colors.text }]}>
                    {task.confidence}%
                  </Text>
                </View>
              </View>
            </AnimatedCard>
          ))}
        </View>

        {/* Bottom Padding for FloatingTabBar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  heroSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  statusContainer: {
    marginTop: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  // Modern Quick Actions Design
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginTop: 4,
  },
  quickActionWrapper: {
    width: '50%',
    padding: 6,
  },
  quickAction: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  quickActionContent: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  emailSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  emailSummaryItem: {
    alignItems: 'center',
    gap: 8,
  },
  emailSummaryLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  meetingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  meetingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  meetingInfo: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  meetingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meetingTime: {
    fontSize: 13,
    fontWeight: '500',
  },
  meetingDuration: {
    fontSize: 13,
  },
  meetingAttendees: {
    fontSize: 13,
  },
  taskHeader: {
    marginBottom: 12,
  },
  taskTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
    letterSpacing: -0.3,
  },
  taskDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  taskFooter: {
    gap: 12,
  },
  taskTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  taskTime: {
    fontSize: 13,
    fontWeight: '500',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confidenceLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  confidenceProgress: {
    flex: 1,
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
});
