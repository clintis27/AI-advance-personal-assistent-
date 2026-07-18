
import { useTheme } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { Badge } from "@/components/ui/Badge";
import Animated, { FadeInDown } from "react-native-reanimated";
import { colors } from "@/styles/commonStyles";
import { AIStatusIndicator } from "@/components/AIStatusIndicator";
import { Button } from "@/components/ui/Button";
import { ScrollView, Pressable, StyleSheet, View, Text, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import React, { useState, useEffect } from "react";
import {
  Mic,
  PlaneTakeoff,
  Calendar,
  Mail,
  Bot,
  Brain,
  Clock,
  BarChart3,
  Users,
  Bell,
  RefreshCw,
  WifiOff,
  Sparkles,
  LucideIcon,
} from "lucide-react-native";
import { FloatingCard } from "@/components/v2/FloatingCard";
import { GlassCard } from "@/components/v2/GlassCard";
import { DetailCard } from "@/components/v2/DetailCard";
import { GradientBadge } from "@/components/v2/GradientBadge";
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
  icon: LucideIcon;
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
    { id: '1', title: 'Voice', icon: Mic, color: colors.primary, route: '/(tabs)/voice' },
    { id: '2', title: 'Travel', icon: PlaneTakeoff, color: colors.accent, route: '/(tabs)/travel' },
    { id: '3', title: 'Meetings', icon: Calendar, color: colors.primary, route: '/(tabs)/meetings' },
    { id: '4', title: 'Email', icon: Mail, color: colors.accent, route: '/(tabs)/email' },
    { id: '5', title: 'Agent', icon: Bot, color: colors.primary, route: '/(tabs)/agent' },
    { id: '6', title: 'Behavior', icon: Brain, color: colors.accent, route: '/(tabs)/behavior' },
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
            <RefreshCw
              size={22}
              strokeWidth={1.75}
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
          <Bell size={22} strokeWidth={1.75} color={colors.text} />
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
      <ScrollView
        style={[styles.container, { backgroundColor: theme.dark ? colors.surfaceMutedDark : colors.surfaceMuted }]}
        contentContainerStyle={styles.content}
      >
        {/* AI Status */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
          <Animated.View entering={FadeInDown.delay(100)} style={{ flex: 1 }}>
            <AIStatusIndicator />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(120)}>
            <GradientBadge
              icon={<Sparkles size={20} color={colors.primaryForeground} strokeWidth={2} />}
              size={48}
              onPress={() => router.push('/(tabs)/agent' as any)}
            />
          </Animated.View>
        </View>

        {/* Sync Status */}
        {syncState && syncState.status === 'offline' && (
          <Animated.View entering={FadeInDown.delay(150)}>
            <GlassCard radius="lg" style={styles.offlineCard}>
              <View style={styles.offlineHeader}>
                <WifiOff size={20} strokeWidth={1.75} color={colors.warning} />
                <Text style={[styles.offlineTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Offline Mode</Text>
              </View>
              <Text style={[styles.offlineText, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                You&apos;re working offline. Changes will sync when you&apos;re back online.
              </Text>
              {syncState.pendingChanges > 0 && (
                <Text style={styles.pendingText}>
                  {syncState.pendingChanges} changes pending sync
                </Text>
              )}
            </GlassCard>
          </Animated.View>
        )}

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Pressable
                  key={action.id}
                  style={({ pressed }) => [
                    styles.quickActionCard,
                    { backgroundColor: theme.dark ? colors.cardDark : colors.card },
                    pressed && styles.quickActionCardPressed,
                  ]}
                  onPress={() => handleQuickActionPress(action.route)}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                    <Icon size={22} color={colors.primaryForeground} strokeWidth={1.75} />
                  </View>
                  <Text style={[styles.quickActionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>{action.title}</Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Predicted Tasks */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text, marginBottom: 0 }]}>Predicted Tasks</Text>
            <Badge variant="default">AI-Powered</Badge>
          </View>
          {predictedTasks.map((task, index) => (
            <Animated.View key={task.id} entering={FadeInDown.delay(350 + index * 50)}>
              <FloatingCard radius="lg" style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.taskTitleRow}>
                      <Text style={[styles.taskTitle, { color: theme.dark ? colors.textDark : colors.text }]}>{task.title}</Text>
                      <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
                    </View>
                    <Text style={[styles.taskDescription, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                      {task.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.taskFooter}>
                  <View style={styles.taskMeta}>
                    <Clock size={13} strokeWidth={1.75} color={theme.dark ? colors.textMutedDark : colors.textSecondary} />
                    <Text style={styles.taskMetaText}>{task.predictedTime}</Text>
                  </View>
                  <View style={styles.taskMeta}>
                    <BarChart3 size={13} strokeWidth={1.75} color={theme.dark ? colors.textMutedDark : colors.textSecondary} />
                    <Text style={styles.taskMetaText}>{task.confidence}% confidence</Text>
                  </View>
                </View>
              </FloatingCard>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Email Summary */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Email Summary</Text>
          <FloatingCard radius="lg" style={styles.emailCard}>
            <View style={styles.emailRow}>
              <View style={styles.emailItem}>
                <Text style={[styles.emailCount, { color: theme.dark ? colors.textDark : colors.text }]}>{emailSummary.important}</Text>
                <Text style={styles.emailLabel}>Important</Text>
              </View>
              <View style={[styles.emailDivider, { backgroundColor: theme.dark ? colors.borderDark : colors.border }]} />
              <View style={styles.emailItem}>
                <Text style={[styles.emailCount, { color: theme.dark ? colors.textDark : colors.text }]}>{emailSummary.informational}</Text>
                <Text style={styles.emailLabel}>Informational</Text>
              </View>
              <View style={[styles.emailDivider, { backgroundColor: theme.dark ? colors.borderDark : colors.border }]} />
              <View style={styles.emailItem}>
                <Text style={[styles.emailCount, { color: theme.dark ? colors.textDark : colors.text }]}>{emailSummary.unread}</Text>
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
          </FloatingCard>
        </Animated.View>

        {/* Upcoming Meetings */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Upcoming Meetings</Text>
          {upcomingMeetings.map((meeting) => (
            <DetailCard
              key={meeting.id}
              title={meeting.title}
              subtitle={`${meeting.time} · ${meeting.duration}`}
              stats={[
                { key: 'attendees', icon: Users, label: `${meeting.attendees} attendees` },
              ]}
              style={styles.meetingCard}
            />
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
    marginTop: 16,
    marginBottom: 4,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
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
  },
});
