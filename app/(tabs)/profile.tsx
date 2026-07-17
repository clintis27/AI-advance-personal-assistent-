
import { IconSymbol, IconSymbolName } from '@/components/IconSymbol';
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { Switch } from '@/components/ui/Switch';
import { useTheme } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Progress } from '@/components/ui/Progress';
import { Separator } from '@/components/ui/Separator';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { authService } from '@/services/authService';
import { syncService } from '@/services/syncService';
import { User, UserDevice } from '@/types/auth';
import * as Haptics from 'expo-haptics';

interface ProfileStat {
  id: string;
  label: string;
  value: string;
  icon: IconSymbolName;
  color: string;
}

interface Setting {
  id: string;
  title: string;
  description: string;
  icon: IconSymbolName;
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
    { id: '1', label: 'Tasks Completed', value: '127', icon: 'checkmark.circle.fill', color: colors.success },
    { id: '2', label: 'Meetings Scheduled', value: '43', icon: 'calendar', color: colors.info },
    { id: '3', label: 'Emails Processed', value: '892', icon: 'envelope.fill', color: colors.warning },
    { id: '4', label: 'Travel Bookings', value: '12', icon: 'airplane.departure', color: colors.violet },
  ]);

  const [settings, setSettings] = useState<Setting[]>([
    {
      id: '1',
      title: 'Push Notifications',
      description: 'Receive notifications for important updates',
      icon: 'bell.fill',
      enabled: true,
    },
    {
      id: '2',
      title: 'Voice Assistant',
      description: 'Enable voice commands and responses',
      icon: 'mic.fill',
      enabled: true,
    },
    {
      id: '3',
      title: 'Auto-Sync',
      description: 'Automatically sync data across devices',
      icon: 'arrow.triangle.2.circlepath',
      enabled: true,
    },
    {
      id: '4',
      title: 'Offline Mode',
      description: 'Work offline and sync later',
      icon: 'wifi.slash',
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
      <IconSymbol name="gearshape.fill" size={24} color={colors.text} />
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
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <AnimatedCard delay={100} style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <IconSymbol name="person.fill" size={48} color={colors.primary} />
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
          <View style={styles.providerBadge}>
            <IconSymbol
              name={
                user?.provider === 'google'
                  ? 'g.circle.fill'
                  : user?.provider === 'apple'
                  ? 'apple.logo'
                  : user?.provider === 'microsoft'
                  ? 'app.fill'
                  : 'envelope.fill'
              }
              size={16}
              color={colors.text}
            />
            <Text style={styles.providerText}>
              {user?.provider === 'email' ? 'Email' : user?.provider || 'Email'}
            </Text>
          </View>
        </AnimatedCard>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <AnimatedCard key={stat.id} delay={200 + index * 50} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <IconSymbol name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </AnimatedCard>
          ))}
        </View>

        <Separator />

        {/* Connected Devices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Devices</Text>
          {devices.map((device, index) => (
            <Card key={device.id} style={styles.deviceCard}>
              <View style={styles.deviceHeader}>
                <View style={styles.deviceIcon}>
                  <IconSymbol
                    name={
                      device.type === 'ios'
                        ? 'iphone'
                        : device.type === 'android'
                        ? 'smartphone'
                        : device.type === 'web'
                        ? 'globe'
                        : 'desktopcomputer'
                    }
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.deviceTitleRow}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    {device.isCurrentDevice && <Badge variant="success">Current</Badge>}
                  </View>
                  <Text style={styles.deviceMeta}>
                    Last active: {new Date(device.lastActive).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <Separator />

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settings.map((setting, index) => (
            <Card key={setting.id} style={styles.settingCard}>
              <View style={styles.settingContent}>
                <View style={styles.settingIcon}>
                  <IconSymbol name={setting.icon} size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                <Switch value={setting.enabled} onValueChange={() => toggleSetting(setting.id)} />
              </View>
            </Card>
          ))}
        </View>

        <Separator />

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <Pressable style={styles.actionButton} onPress={handleSyncNow}>
            <IconSymbol name="arrow.triangle.2.circlepath" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Sync Now</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/startup-summary' as any)}
          >
            <IconSymbol name="clock.arrow.circlepath" size={20} color={colors.info} />
            <Text style={styles.actionButtonText}>View Startup Summary</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/privacy' as any)}
          >
            <IconSymbol name="lock.shield.fill" size={20} color={colors.warning} />
            <Text style={styles.actionButtonText}>Privacy & Security</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/ai-config' as any)}
          >
            <IconSymbol name="cpu" size={20} color={colors.violet} />
            <Text style={styles.actionButtonText}>AI Configuration</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>
        </View>

        <Separator />

        {/* Logout */}
        <View style={styles.section}>
          <Button variant="destructive" onPress={handleLogout}>
            <IconSymbol name="arrow.right.square.fill" size={20} color={colors.primaryForeground} />
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
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
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
    borderColor: colors.card,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  providerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'capitalize',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
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
    padding: 16,
    marginBottom: 12,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  deviceMeta: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  settingCard: {
    padding: 16,
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
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
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
