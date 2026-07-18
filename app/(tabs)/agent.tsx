
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Switch } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
import {
  Settings,
  Bot,
  Wand2,
  MessageSquare,
  Video,
  Phone,
  Mail,
  AudioWaveform,
  User,
  MessageCircle,
  Globe,
  ChevronRight,
  History,
  BadgeCheck,
  Info,
  Calendar,
  Sparkles,
  LucideIcon,
} from "lucide-react-native";
import { colors } from "@/styles/commonStyles";
import { FloatingCard } from "@/components/v2/FloatingCard";
import { GlassCard } from "@/components/v2/GlassCard";
import Animated, { FadeInDown } from "react-native-reanimated";

interface AgentStatus {
  active: boolean;
  mode: 'available' | 'busy' | 'meeting' | 'offline';
  lastActive: string;
}

interface AgentAction {
  id: string;
  type: 'call' | 'message' | 'email' | 'meeting';
  description: string;
  timestamp: string;
  confidence: number;
  status: 'completed' | 'pending' | 'review';
}

export default function AgentScreen() {
  const theme = useTheme();
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    active: true,
    mode: 'available',
    lastActive: '2 minutes ago',
  });

  const [agentEnabled, setAgentEnabled] = useState(true);
  const [autoReply, setAutoReply] = useState(true);
  const [joinMeetings, setJoinMeetings] = useState(false);
  const [handleCalls, setHandleCalls] = useState(false);

  const [recentActions] = useState<AgentAction[]>([
    {
      id: '1',
      type: 'message',
      description: 'Replied to Sarah: "I\'m in a meeting, will get back to you in 30 minutes"',
      timestamp: '10 minutes ago',
      confidence: 95,
      status: 'completed',
    },
    {
      id: '2',
      type: 'email',
      description: 'Auto-triaged 5 emails to Important category',
      timestamp: '25 minutes ago',
      confidence: 92,
      status: 'completed',
    },
    {
      id: '3',
      type: 'call',
      description: 'Declined call from unknown number with polite message',
      timestamp: '1 hour ago',
      confidence: 88,
      status: 'completed',
    },
    {
      id: '4',
      type: 'meeting',
      description: 'Suggested rescheduling conflicting meeting',
      timestamp: '2 hours ago',
      confidence: 85,
      status: 'review',
    },
  ]);

  const getActionIcon = (type: string): LucideIcon => {
    switch (type) {
      case 'call':
        return Phone;
      case 'message':
        return MessageSquare;
      case 'email':
        return Mail;
      case 'meeting':
        return Calendar;
      default:
        return Sparkles;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'call':
        return colors.accent;
      case 'message':
        return colors.primary;
      case 'email':
        return colors.accent;
      case 'meeting':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'review':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'available':
        return colors.success;
      case 'busy':
        return colors.error;
      case 'meeting':
        return colors.warning;
      case 'offline':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log('Agent settings')}
      style={styles.headerButtonContainer}
    >
      <Settings color={colors.primary} size={22} strokeWidth={1.75} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Autonomous Agent",
            headerRight: renderHeaderRight,
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: theme.dark ? colors.surfaceMutedDark : colors.surfaceMuted }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header for Android/Web */}
          {Platform.OS !== 'ios' && (
            <View style={styles.headerContainer}>
              <View style={styles.headerTitleRow}>
                <Text style={[styles.headerTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Autonomous Agent</Text>
                <Pressable
                  onPress={() => console.log('Agent settings')}
                  style={[styles.headerButton, { backgroundColor: theme.dark ? colors.cardDark : colors.card }]}
                >
                  <Settings color={colors.primary} size={22} strokeWidth={1.75} />
                </Pressable>
              </View>
            </View>
          )}

          {/* Agent Status Card */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <FloatingCard
              radius="xl"
              style={[styles.statusCard, { backgroundColor: theme.dark ? colors.secondaryDark : colors.secondary }]}
            >
              <View style={styles.statusHeader}>
                <View style={styles.statusInfo}>
                  <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: getModeColor(agentStatus.mode) }]} />
                    <Text style={styles.statusTitle}>Agent Status</Text>
                  </View>
                  <Text style={styles.statusMode}>{agentStatus.mode.toUpperCase()}</Text>
                  <Text style={styles.statusTime}>Last active: {agentStatus.lastActive}</Text>
                </View>
                <View style={styles.agentIconContainer}>
                  <Bot size={44} color={colors.accentLight} strokeWidth={1.5} />
                </View>
              </View>

              <View style={styles.statusToggle}>
                <Text style={styles.toggleLabel}>Enable Autonomous Agent</Text>
                <Switch
                  value={agentEnabled}
                  onValueChange={(value) => {
                    setAgentEnabled(value);
                    console.log('Agent enabled:', value);
                  }}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={colors.card}
                />
              </View>
            </FloatingCard>
          </Animated.View>

          {/* Agent Capabilities */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Wand2 color={colors.primary} size={22} strokeWidth={1.75} />
              <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Agent Capabilities</Text>
            </View>
            <FloatingCard radius="lg" style={styles.card}>
              <View style={styles.capabilityRow}>
                <View style={styles.capabilityInfo}>
                  <MessageSquare color={colors.primary} size={19} strokeWidth={1.75} />
                  <View style={styles.capabilityText}>
                    <Text style={[styles.capabilityTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Auto-Reply Messages</Text>
                    <Text style={styles.capabilityDescription}>
                      Respond to messages when you&apos;re busy
                    </Text>
                  </View>
                </View>
                <Switch
                  value={autoReply}
                  onValueChange={(value) => {
                    setAutoReply(value);
                    console.log('Auto-reply:', value);
                  }}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={colors.card}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.capabilityRow}>
                <View style={styles.capabilityInfo}>
                  <Video color={colors.accent} size={19} strokeWidth={1.75} />
                  <View style={styles.capabilityText}>
                    <Text style={[styles.capabilityTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Join Meetings</Text>
                    <Text style={styles.capabilityDescription}>
                      Attend meetings and take notes for you
                    </Text>
                  </View>
                </View>
                <Switch
                  value={joinMeetings}
                  onValueChange={(value) => {
                    setJoinMeetings(value);
                    console.log('Join meetings:', value);
                  }}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={colors.card}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.capabilityRow}>
                <View style={styles.capabilityInfo}>
                  <Phone color={colors.accent} size={19} strokeWidth={1.75} />
                  <View style={styles.capabilityText}>
                    <Text style={[styles.capabilityTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Handle Calls</Text>
                    <Text style={styles.capabilityDescription}>
                      Answer calls with contextual responses
                    </Text>
                  </View>
                </View>
                <Switch
                  value={handleCalls}
                  onValueChange={(value) => {
                    setHandleCalls(value);
                    console.log('Handle calls:', value);
                  }}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={colors.card}
                />
              </View>
            </FloatingCard>
          </Animated.View>

          {/* Voice Settings */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <AudioWaveform color={colors.accent} size={22} strokeWidth={1.75} />
              <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Voice Settings</Text>
            </View>
            <FloatingCard radius="lg" style={styles.card}>
              <Pressable
                style={styles.settingRow}
                onPress={() => console.log('Voice selection')}
              >
                <User size={19} strokeWidth={1.75} color={theme.dark ? colors.textMutedDark : colors.textSecondary} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Voice Profile</Text>
                  <Text style={styles.settingValue}>Professional Male</Text>
                </View>
                <ChevronRight size={16} strokeWidth={1.75} color={theme.dark ? colors.textMutedDark : colors.textSecondary} />
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={styles.settingRow}
                onPress={() => console.log('Response style')}
              >
                <MessageCircle size={19} strokeWidth={1.75} color={theme.dark ? colors.textMutedDark : colors.textSecondary} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Response Style</Text>
                  <Text style={styles.settingValue}>Concise & Friendly</Text>
                </View>
                <ChevronRight size={16} strokeWidth={1.75} color={theme.dark ? colors.textMutedDark : colors.textSecondary} />
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={styles.settingRow}
                onPress={() => console.log('Language settings')}
              >
                <Globe size={19} strokeWidth={1.75} color={theme.dark ? colors.textMutedDark : colors.textSecondary} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Language</Text>
                  <Text style={styles.settingValue}>English (US)</Text>
                </View>
                <ChevronRight size={16} strokeWidth={1.75} color={theme.dark ? colors.textMutedDark : colors.textSecondary} />
              </Pressable>
            </FloatingCard>
          </Animated.View>

          {/* Recent Actions */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <History color={theme.dark ? colors.textMutedDark : colors.secondary} size={22} strokeWidth={1.75} />
              <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Recent Actions</Text>
            </View>
            {recentActions.map((action) => {
              const ActionIcon = getActionIcon(action.type);
              return (
                <Pressable key={action.id} onPress={() => console.log('Action details:', action.id)}>
                  <FloatingCard radius="lg" style={styles.card}>
                    <View style={styles.actionHeader}>
                      <View style={[styles.actionIconContainer, { backgroundColor: getActionColor(action.type) + '20' }]}>
                        <ActionIcon size={19} strokeWidth={1.75} color={getActionColor(action.type)} />
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(action.status) }]}>
                        <Text style={styles.statusBadgeText}>{action.status}</Text>
                      </View>
                    </View>
                    <Text style={[styles.actionDescription, { color: theme.dark ? colors.textDark : colors.text }]}>{action.description}</Text>
                    <View style={styles.actionFooter}>
                      <Text style={styles.actionTime}>{action.timestamp}</Text>
                      <View style={styles.confidenceContainer}>
                        <BadgeCheck size={14} strokeWidth={1.75} color={colors.accent} />
                        <Text style={styles.confidenceText}>{action.confidence}% confident</Text>
                      </View>
                    </View>
                  </FloatingCard>
                </Pressable>
              );
            })}
          </Animated.View>

          {/* Info Banner */}
          <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
            <GlassCard radius="lg" style={styles.infoBanner}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                <Info size={19} strokeWidth={1.75} color={colors.info} />
                <Text style={[styles.infoBannerText, { color: theme.dark ? colors.textDark : colors.text }]}>
                  Your agent learns from your communication style and adapts responses to match your tone and preferences.
                </Text>
              </View>
            </GlassCard>
          </Animated.View>

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
  headerButtonContainer: {
    padding: 8,
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
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  statusCard: {
    marginBottom: 0,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTitle: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    fontWeight: '600',
  },
  statusMode: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  statusTime: {
    fontSize: 13,
    color: colors.textSecondaryDark,
  },
  agentIconContainer: {
    marginLeft: 16,
  },
  statusToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorderDark,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  capabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  capabilityInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  capabilityText: {
    flex: 1,
  },
  capabilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  capabilityDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.card,
    textTransform: 'uppercase',
  },
  actionDescription: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  actionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionTime: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  confidenceText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  infoBanner: {},
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});
