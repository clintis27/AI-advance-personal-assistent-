
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Switch } from '@/components/ui/Switch';
import { useTheme } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { Separator } from '@/components/ui/Separator';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/authService';
import { syncService } from '@/services/syncService';
import { User, UserDevice } from '@/types/auth';
import * as Haptics from 'expo-haptics';
import {
  Settings as SettingsIcon,
  UserCircle,
  BadgeCheck,
  CheckCircle2,
  Calendar,
  Mail,
  PlaneTakeoff,
  Bell,
  Mic,
  RefreshCw,
  WifiOff,
  Smartphone,
  Globe,
  Monitor,
  History,
  ShieldCheck,
  Cpu,
  ChevronRight,
  LogOut,
  LucideIcon,
} from 'lucide-react-native';
import { FloatingCard } from '@/components/v2/FloatingCard';
import { StatCard } from '@/components/v2/StatCard';
import { DetailCard } from '@/components/v2/DetailCard';

interface ProfileStat {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

interface Setting {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  enabled: boolean;
  route?: string;
}

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [devices, setDevices] = useState<UserDevice[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      setDevices(currentUser.devices);
    }
  };

  const [stats] = useState<ProfileStat[]>([
    { id: '1', label: 'Tasks Completed', value: '127', icon: CheckCircle2, color: colors.success },
    { id: '2', label: 'Meetings Scheduled', value: '43', icon: Calendar, color: colors.info },
    { id: '3', label: 'Emails Processed', value: '892', icon: Mail, color: colors.warning },
    { id: '4', label: 'Travel Bookings', value: '12', icon: PlaneTakeoff, color: colors.violet },
  ]);

  const [settings, setSettings] = useState<Setting[]>([
    {
      id: '1',
      title: 'Push Notifications',
      description: 'Receive notifications for important updates',
      icon: Bell,
      enabled: true,
    },
    {
      id: '2',
      title: 'Voice Assistant',
      description: 'Enable voice commands and responses',
      icon: Mic,
      enabled: true,
    },
    {
      id: '3',
      title: 'Auto-Sync',
      description: 'Automatically sync data across devices',
      icon: RefreshCw,
      enabled: true,
    },
    {
      id: '4',
      title: 'Offline Mode',
      description: 'Work offline and sync later',
      icon: WifiOff,
      enabled: false,
    },
  ]);

  const toggleSetting = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSettings(settings.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? Your data will remain synced across devices.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              router.replace('/(tabs)/auth/login' as any);
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const handleSyncNow = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      await syncService.syncNow();
      Alert.alert('Success', 'Data synced successfully');
    } catch (error) {
      console.error('Sync error:', error);
      Alert.alert('Error', 'Failed to sync data');
    }
  };

  const renderHeaderRight = () => (
    <Pressable onPress={() => router.push('/(tabs)/ai-config' as any)} style={{ marginRight: 16 }}>
      <SettingsIcon size={22} strokeWidth={1.75} color={colors.text} />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
          headerRight: renderHeaderRight,
        }}
      />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.dark ? colors.surfaceMutedDark : colors.surfaceMuted }]}
        contentContainerStyle={styles.content}
      >
        {/* Profile Header */}
        <FloatingCard
          radius="xl"
          style={[styles.profileCard, { backgroundColor: theme.dark ? colors.secondaryDark : colors.secondary }]}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <UserCircle size={48} color={colors.accentLight} strokeWidth={1.5} />
            </View>
            <View
              style={[
                styles.onlineIndicator,
                { borderColor: theme.dark ? colors.secondaryDark : colors.secondary },
              ]}
            />
          </View>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
          <View style={styles.providerBadge}>
            <BadgeCheck size={15} strokeWidth={1.75} color={colors.textDark} />
            <Text style={styles.providerText}>
              {user?.provider === 'email' ? 'Email' : user?.provider || 'Email'}
            </Text>
          </View>
        </FloatingCard>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <StatCard
                key={stat.id}
                value={stat.value}
                label={stat.label}
                cluster={[{ key: stat.id, icon: StatIcon, color: stat.color }]}
                style={styles.statCardItem}
              />
            );
          })}
        </View>

        <Separator />

        {/* Connected Devices */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Connected Devices</Text>
          {devices.map((device) => {
            const DeviceIcon =
              device.type === 'web' ? Globe : device.type === 'desktop' ? Monitor : Smartphone;
            return (
              <DetailCard
                key={device.id}
                title={device.name}
                subtitle={`Last active: ${new Date(device.lastActive).toLocaleDateString()}`}
                stats={[
                  { key: 'type', icon: DeviceIcon, label: device.type },
                  ...(device.isCurrentDevice
                    ? [{ key: 'current', icon: CheckCircle2, label: 'Current device' }]
                    : []),
                ]}
                style={styles.deviceCard}
              />
            );
          })}
        </View>

        <Separator />

        {/* Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Settings</Text>
          {settings.map((setting) => {
            const SettingIcon = setting.icon;
            return (
              <FloatingCard key={setting.id} radius="lg" style={styles.settingCard}>
                <View style={styles.settingContent}>
                  <View style={styles.settingIcon}>
                    <SettingIcon size={18} strokeWidth={1.75} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.settingTitle, { color: theme.dark ? colors.textDark : colors.text }]}>{setting.title}</Text>
                    <Text style={styles.settingDescription}>{setting.description}</Text>
                  </View>
                  <Switch value={setting.enabled} onValueChange={() => toggleSetting(setting.id)} />
                </View>
              </FloatingCard>
            );
          })}
        </View>

        <Separator />

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Quick Actions</Text>

          <Pressable onPress={handleSyncNow}>
            <FloatingCard radius="lg" style={styles.actionButton}>
              <RefreshCw size={19} strokeWidth={1.75} color={colors.primary} />
              <Text style={[styles.actionButtonText, { color: theme.dark ? colors.textDark : colors.text }]}>Sync Now</Text>
              <ChevronRight size={16} strokeWidth={1.75} color={colors.textSecondary} />
            </FloatingCard>
          </Pressable>

          <Pressable onPress={() => router.push('/(tabs)/startup-summary' as any)}>
            <FloatingCard radius="lg" style={styles.actionButton}>
              <History size={19} strokeWidth={1.75} color={colors.info} />
              <Text style={[styles.actionButtonText, { color: theme.dark ? colors.textDark : colors.text }]}>View Startup Summary</Text>
              <ChevronRight size={16} strokeWidth={1.75} color={colors.textSecondary} />
            </FloatingCard>
          </Pressable>

          <Pressable onPress={() => router.push('/(tabs)/privacy' as any)}>
            <FloatingCard radius="lg" style={styles.actionButton}>
              <ShieldCheck size={19} strokeWidth={1.75} color={colors.warning} />
              <Text style={[styles.actionButtonText, { color: theme.dark ? colors.textDark : colors.text }]}>Privacy & Security</Text>
              <ChevronRight size={16} strokeWidth={1.75} color={colors.textSecondary} />
            </FloatingCard>
          </Pressable>

          <Pressable onPress={() => router.push('/(tabs)/ai-config' as any)}>
            <FloatingCard radius="lg" style={styles.actionButton}>
              <Cpu size={19} strokeWidth={1.75} color={colors.violet} />
              <Text style={[styles.actionButtonText, { color: theme.dark ? colors.textDark : colors.text }]}>AI Configuration</Text>
              <ChevronRight size={16} strokeWidth={1.75} color={colors.textSecondary} />
            </FloatingCard>
          </Pressable>
        </View>

        <Separator />

        {/* Logout */}
        <View style={styles.section}>
          <Button variant="destructive" onPress={handleLogout}>
            <LogOut size={18} strokeWidth={1.75} color={colors.primaryForeground} />
            <Text style={{ marginLeft: 8 }}>Logout</Text>
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>PVA+ v1.0.0</Text>
          <Text style={styles.footerText}>
            Last synced: {syncService.getSyncState().lastSync || 'Never'}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.glassTintDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.accent,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    borderWidth: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondaryDark,
    marginBottom: 12,
  },
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.glassTintDark,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.glassBorderDark,
  },
  providerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDark,
    textTransform: 'capitalize',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCardItem: {
    width: '48%',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  deviceCard: {
    marginBottom: 12,
  },
  settingCard: {
    marginBottom: 12,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
});
