
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { Card } from '@/components/ui/Card';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import { Separator } from '@/components/ui/Separator';
import { Progress } from '@/components/ui/Progress';
import { IconSymbol } from '@/components/IconSymbol';

interface ProfileStat {
  id: string;
  label: string;
  value: string;
  icon: string;
  color: string;
}

interface Setting {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  route?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [stats] = useState<ProfileStat[]>([
    {
      id: '1',
      label: 'Tasks Completed',
      value: '247',
      icon: 'checkmark.circle.fill',
      color: colors.success,
    },
    {
      id: '2',
      label: 'Meetings Scheduled',
      value: '89',
      icon: 'calendar',
      color: colors.primary,
    },
    {
      id: '3',
      label: 'Emails Triaged',
      value: '1,234',
      icon: 'envelope.fill',
      color: colors.violet,
    },
    {
      id: '4',
      label: 'Hours Saved',
      value: '42',
      icon: 'clock.fill',
      color: colors.amber,
    },
  ]);

  const [settings, setSettings] = useState<Setting[]>([
    {
      id: '1',
      title: 'AI Predictions',
      description: 'Enable task and behavior predictions',
      icon: 'brain',
      enabled: true,
    },
    {
      id: '2',
      title: 'Email Triage',
      description: 'Automatically categorize incoming emails',
      icon: 'envelope.badge',
      enabled: true,
    },
    {
      id: '3',
      title: 'Meeting Scheduling',
      description: 'Auto-schedule meetings based on availability',
      icon: 'calendar.badge.plus',
      enabled: false,
    },
    {
      id: '4',
      title: 'Voice Assistant',
      description: 'Enable voice commands and responses',
      icon: 'mic.fill',
      enabled: true,
    },
  ]);

  const [aiUsage] = useState({
    daily: 85,
    weekly: 72,
    monthly: 68,
  });

  const toggleSetting = (id: string) => {
    setSettings(settings.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
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

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerRight: renderHeaderRight,
          headerStyle: {
            backgroundColor: theme.dark ? colors.backgroundDark : colors.background,
          },
          headerTintColor: theme.dark ? colors.textDark : colors.text,
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
        {/* Profile Header */}
        <AnimatedCard animation="fadeInDown" delay={0} variant="compact">
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: colors.success }]} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.dark ? colors.textDark : colors.text }]}>
                John Doe
              </Text>
              <Text style={[styles.profileEmail, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                john.doe@example.com
              </Text>
              <View style={styles.badgeRow}>
                <Badge variant="primary" size="sm">Pro Plan</Badge>
                <Badge variant="success" size="sm">Verified</Badge>
              </View>
            </View>
          </View>
        </AnimatedCard>

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Your Activity
          </Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <AnimatedCard
                key={stat.id}
                variant="small"
                animation="zoomIn"
                delay={100 + index * 50}
                style={styles.statCard}
              >
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <IconSymbol name={stat.icon} size={20} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: theme.dark ? colors.textDark : colors.text }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, { color: theme.dark ? colors.textMutedDark : colors.textMuted }]}>
                  {stat.label}
                </Text>
              </AnimatedCard>
            ))}
          </View>
        </View>

        <Separator />

        {/* AI Usage */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            AI Usage
          </Text>
          <AnimatedCard animation="fadeInLeft" delay={300}>
            <View style={styles.usageItem}>
              <View style={styles.usageHeader}>
                <Text style={[styles.usageLabel, { color: theme.dark ? colors.textDark : colors.text }]}>
                  Daily Average
                </Text>
                <Text style={[styles.usageValue, { color: colors.primary }]}>
                  {aiUsage.daily}%
                </Text>
              </View>
              <Progress value={aiUsage.daily} color={colors.primary} />
            </View>
            <View style={styles.usageItem}>
              <View style={styles.usageHeader}>
                <Text style={[styles.usageLabel, { color: theme.dark ? colors.textDark : colors.text }]}>
                  Weekly Average
                </Text>
                <Text style={[styles.usageValue, { color: colors.violet }]}>
                  {aiUsage.weekly}%
                </Text>
              </View>
              <Progress value={aiUsage.weekly} color={colors.violet} />
            </View>
            <View style={styles.usageItem}>
              <View style={styles.usageHeader}>
                <Text style={[styles.usageLabel, { color: theme.dark ? colors.textDark : colors.text }]}>
                  Monthly Average
                </Text>
                <Text style={[styles.usageValue, { color: colors.emerald }]}>
                  {aiUsage.monthly}%
                </Text>
              </View>
              <Progress value={aiUsage.monthly} color={colors.emerald} />
            </View>
          </AnimatedCard>
        </View>

        <Separator />

        {/* Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            AI Features
          </Text>
          {settings.map((setting, index) => (
            <AnimatedCard
              key={setting.id}
              variant="compact"
              animation="fadeInRight"
              delay={400 + index * 50}
            >
              <View style={styles.settingRow}>
                <View style={[styles.settingIcon, { backgroundColor: `${colors.primary}20` }]}>
                  <IconSymbol name={setting.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
                    {setting.title}
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                    {setting.description}
                  </Text>
                </View>
                <Switch
                  value={setting.enabled}
                  onValueChange={() => toggleSetting(setting.id)}
                />
              </View>
            </AnimatedCard>
          ))}
        </View>

        <Separator />

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Quick Links
          </Text>
          <AnimatedCard
            variant="compact"
            interactive
            onPress={() => router.push('/(tabs)/integrations')}
            animation="fadeInUp"
            delay={600}
          >
            <View style={styles.linkRow}>
              <IconSymbol name="link.circle" size={24} color={colors.primary} />
              <Text style={[styles.linkText, { color: theme.dark ? colors.textDark : colors.text }]}>
                Manage Integrations
              </Text>
              <IconSymbol name="chevron.right" size={20} color={theme.dark ? colors.textMutedDark : colors.textMuted} />
            </View>
          </AnimatedCard>
          <AnimatedCard
            variant="compact"
            interactive
            onPress={() => router.push('/(tabs)/privacy')}
            animation="fadeInUp"
            delay={650}
          >
            <View style={styles.linkRow}>
              <IconSymbol name="lock.shield" size={24} color={colors.success} />
              <Text style={[styles.linkText, { color: theme.dark ? colors.textDark : colors.text }]}>
                Privacy & Security
              </Text>
              <IconSymbol name="chevron.right" size={20} color={theme.dark ? colors.textMutedDark : colors.textMuted} />
            </View>
          </AnimatedCard>
          <AnimatedCard
            variant="compact"
            interactive
            onPress={() => router.push('/(tabs)/ai-dashboard' as any)}
            animation="fadeInUp"
            delay={700}
          >
            <View style={styles.linkRow}>
              <IconSymbol name="chart.bar.xaxis" size={24} color={colors.indigo} />
              <Text style={[styles.linkText, { color: theme.dark ? colors.textDark : colors.text }]}>
                AI Dashboard
              </Text>
              <IconSymbol name="chevron.right" size={20} color={theme.dark ? colors.textMutedDark : colors.textMuted} />
            </View>
          </AnimatedCard>
          <AnimatedCard
            variant="compact"
            interactive
            onPress={() => router.push('/(tabs)/ui-showcase')}
            animation="fadeInUp"
            delay={750}
          >
            <View style={styles.linkRow}>
              <IconSymbol name="paintbrush" size={24} color={colors.violet} />
              <Text style={[styles.linkText, { color: theme.dark ? colors.textDark : colors.text }]}>
                UI Components Showcase
              </Text>
              <IconSymbol name="chevron.right" size={20} color={theme.dark ? colors.textMutedDark : colors.textMuted} />
            </View>
          </AnimatedCard>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <Button variant="outline" fullWidth onPress={() => console.log('Edit profile')}>
            Edit Profile
          </Button>
          <Button variant="destructive" fullWidth onPress={() => console.log('Sign out')}>
            Sign Out
          </Button>
        </View>

        {/* Bottom Padding */}
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryForeground,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: colors.card,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  usageItem: {
    marginBottom: 20,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  usageLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  usageValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
