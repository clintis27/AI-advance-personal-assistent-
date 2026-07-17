
import { useTheme } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { colors } from "@/styles/commonStyles";
import { Separator } from "@/components/ui/Separator";
import { Card } from "@/components/ui/Card";
import { AIStatusIndicator } from "@/components/AIStatusIndicator";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { Button } from "@/components/ui/Button";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import React, { useState, useEffect } from "react";
import { IconSymbol, IconSymbolName } from "@/components/IconSymbol";
import { authService } from "@/services/authService";
import { syncService } from "@/services/syncService";
import { notificationService } from "@/services/notificationService";
import { User } from "@/types/auth";
import { SyncState } from "@/types/sync";

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
  icon: IconSymbolName;
  color: string;
  route: string;
}

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [syncState, setSyncState] = useState<SyncState | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    loadUserData();
    
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      router.replace('/(tabs)/auth/login' as any);
    }
  }, []);

  const loadUserData = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    const currentSyncState = syncService.getSyncState();
    setSyncState(currentSyncState);
    
    const notifications = notificationService.getUnreadNotifications();
    setUnreadNotifications(notifications.length);
  };

  const handleSync = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      await syncService.syncNow();
      loadUserData();
      Alert.alert('Success', 'Data synced successfully');
    } catch (error) {
      console.error('Sync error:', error);
      Alert.alert('Error', 'Failed to sync data');
    }
  };

  const [predictedTasks] = useState<PredictedTask[]>([
    {
      id: '1',
      title: 'Review Q4 Budget',
      description: 'Based on your calendar, this is due before your 2 PM meeting',
      priority: 'high',
      predictedTime: '11:00 AM',
      confidence: 92,
    },
    {
      id: '2',
      title: 'Respond to Client Email',
      description: 'High-priority email from Sarah Johnson',
      priority: 'high',
      predictedTime: '10:30 AM',
      confidence: 88,
    },
    {
      id: '3',
      title: 'Book Flight to NYC',
      description: 'Detected from your calendar event next week',
      priority: 'medium',
      predictedTime: '3:00 PM',
      confidence: 75,
    },
  ]);

  const [emailSummary] = useState<EmailSummary>({
    important: 3,
    informational: 12,
    spam: 5,
    unread: 20,
  });

  const [upcomingMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Team Standup',
      time: '9:00 AM',
      duration: '30 min',
      attendees: 5,
    },
    {
      id: '2',
      title: 'Client Presentation',
      time: '2:00 PM',
      duration: '1 hour',
      attendees: 8,
    },
  ]);

  const quickActions: QuickAction[] = [
    { id: '1', title: 'Voice', icon: 'mic.fill', color: colors.primary, route: '/(tabs)/voice' },
    { id: '2', title: 'Travel', icon: 'airplane.departure', color: colors.secondary, route: '/(tabs)/travel' },
    { id: '3', title: 'Meetings', icon: 'calendar', color: colors.primary, route: '/(tabs)/meetings' },
    { id: '4', title: 'Email', icon: 'envelope.fill', color: colors.secondary, route: '/(tabs)/email' },
    { id: '5', title: 'Agent', icon: 'person.crop.circle.badge.checkmark', color: colors.primary, route: '/(tabs)/agent' },
    { id: '6', title: 'Behavior', icon: 'brain.head.profile', color: colors.secondary, route: '/(tabs)/behavior' },
  ];

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

  const getPriorityVariant = (priority: string): 'default' | 'success' | 'warning' | 'error' => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleQuickActionPress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  };

  const renderHeaderRight = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginRight: 20 }}>
      {syncState && (
        <Pressable onPress={handleSync}>
          <View style={{ position: 'relative' }}>
            <IconSymbol
              name={syncState.status === 'syncing' ? 'arrow.triangle.2.circlepath' : 'arrow.triangle.2.circlepath'}
              size={24}
              color={
                syncState.status === 'syncing'
                  ? colors.primary
                  : syncState.status === 'error'
                  ? colors.error
                  : syncState.status === 'offline'
                  ? colors.textMuted
                  : colors.success
              }
            />
            {syncState.pendingChanges > 0 && (
              <View style={styles.syncBadge}>
                <Text style={styles.syncBadgeText}>{syncState.pendingChanges}</Text>
              </View>
            )}
          </View>
        </Pressable>
      )}
      <Pressable onPress={() => router.push('/(tabs)/startup-summary' as any)}>
        <View style={{ position: 'relative' }}>
          <IconSymbol name="bell.fill" size={24} color={colors.text} />
          {unreadNotifications > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{unreadNotifications}</Text>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );

  const renderHeaderLeft = () => (
    <View style={{ marginLeft: 20 }}>
      <Text style={styles.greeting}>
        {user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome'}
      </Text>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerShown: true,
          headerTransparent: false,
          headerStyle: {
            backgroundColor: theme.dark ? colors.backgroundDark : colors.background,
          },
          headerShadowVisible: false,
          headerLeft: renderHeaderLeft,
          headerRight: renderHeaderRight,
        }}
      />
      <ScrollView style={[styles.container, { backgroundColor: theme.dark ? colors.backgroundDark : colors.background }]} contentContainerStyle={styles.content}>
        {/* AI Status */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <AIStatusIndicator />
        </Animated.View>

        {/* Sync Status */}
        {syncState && syncState.status === 'offline' && (
          <Animated.View entering={FadeInDown.delay(150)}>
            <Card style={styles.offlineCard}>
              <View style={styles.offlineHeader}>
                <IconSymbol name="wifi.slash" size={24} color={colors.warning} />
                <Text style={styles.offlineTitle}>Offline Mode</Text>
              </View>
              <Text style={styles.offlineText}>
                You&apos;re working offline. Changes will sync when you&apos;re back online.
              </Text>
              {syncState.pendingChanges > 0 && (
                <Text style={styles.pendingText}>
                  {syncState.pendingChanges} changes pending sync
                </Text>
              )}
            </Card>
          </Animated.View>
        )}

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <Pressable
                key={action.id}
                style={({ pressed }) => [
                  styles.quickActionCard,
                  pressed && styles.quickActionCardPressed,
                ]}
                onPress={() => handleQuickActionPress(action.route)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <IconSymbol name={action.icon} size={24} color={colors.primaryForeground} />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Predicted Tasks */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Predicted Tasks</Text>
            <Badge variant="default">AI-Powered</Badge>
          </View>
          {predictedTasks.map((task, index) => (
            <AnimatedCard key={task.id} delay={350 + index * 50} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <View style={{ flex: 1 }}>
                  <View style={styles.taskTitleRow}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
                  </View>
                  <Text style={styles.taskDescription}>{task.description}</Text>
                </View>
              </View>
              <View style={styles.taskFooter}>
                <View style={styles.taskMeta}>
                  <IconSymbol name="clock.fill" size={14} color={colors.textSecondary} />
                  <Text style={styles.taskMetaText}>{task.predictedTime}</Text>
                </View>
                <View style={styles.taskMeta}>
                  <IconSymbol name="chart.bar.fill" size={14} color={colors.textSecondary} />
                  <Text style={styles.taskMetaText}>{task.confidence}% confidence</Text>
                </View>
              </View>
            </AnimatedCard>
          ))}
        </Animated.View>

        {/* Email Summary */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Email Summary</Text>
          <Card style={styles.emailCard}>
            <View style={styles.emailRow}>
              <View style={styles.emailItem}>
                <Text style={styles.emailCount}>{emailSummary.important}</Text>
                <Text style={styles.emailLabel}>Important</Text>
              </View>
              <View style={styles.emailDivider} />
              <View style={styles.emailItem}>
                <Text style={styles.emailCount}>{emailSummary.informational}</Text>
                <Text style={styles.emailLabel}>Informational</Text>
              </View>
              <View style={styles.emailDivider} />
              <View style={styles.emailItem}>
                <Text style={styles.emailCount}>{emailSummary.unread}</Text>
                <Text style={styles.emailLabel}>Unread</Text>
              </View>
            </View>
            <Button
              variant="outline"
              onPress={() => router.push('/(tabs)/email' as any)}
              style={{ marginTop: 20 }}
            >
              View All Emails
            </Button>
          </Card>
        </Animated.View>

        {/* Upcoming Meetings */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Meetings</Text>
          {upcomingMeetings.map((meeting, index) => (
            <Card key={meeting.id} style={styles.meetingCard}>
              <View style={styles.meetingHeader}>
                <View style={styles.meetingIcon}>
                  <IconSymbol name="video.fill" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.meetingTitle}>{meeting.title}</Text>
                  <View style={styles.meetingMeta}>
                    <View style={styles.meetingMetaItem}>
                      <IconSymbol name="clock.fill" size={12} color={colors.textSecondary} />
                      <Text style={styles.meetingMetaText}>{meeting.time} • {meeting.duration}</Text>
                    </View>
                    <View style={styles.meetingMetaItem}>
                      <IconSymbol name="person.2.fill" size={12} color={colors.textSecondary} />
                      <Text style={styles.meetingMetaText}>{meeting.attendees} attendees</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </Animated.View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -1,
  },
  syncBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  syncBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryForeground,
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryForeground,
  },
  offlineCard: {
    marginBottom: 20,
    backgroundColor: colors.warning + '10',
    borderColor: colors.warning,
  },
  offlineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  offlineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  offlineText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.warning,
    marginTop: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  quickActionCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  taskCard: {
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    letterSpacing: -0.3,
  },
  taskDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  taskFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  taskMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emailCard: {
    padding: 24,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailItem: {
    flex: 1,
    alignItems: 'center',
  },
  emailCount: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -1.5,
  },
  emailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  emailDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.border,
  },
  meetingCard: {
    marginBottom: 12,
    padding: 18,
  },
  meetingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  meetingIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  meetingMeta: {
    flexDirection: 'column',
    gap: 4,
  },
  meetingMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meetingMetaText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
