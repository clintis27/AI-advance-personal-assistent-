
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Switch } from "react-native";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import Animated, { FadeInDown } from "react-native-reanimated";

interface AuditLogEntry {
  id: string;
  action: string;
  timestamp: string;
  category: 'data_access' | 'permission' | 'action' | 'sync';
  details: string;
}

interface PermissionItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
}

export default function PrivacyScreen() {
  const [permissions, setPermissions] = useState<PermissionItem[]>([
    {
      id: '1',
      name: 'Email Access',
      description: 'Read and categorize emails',
      enabled: true,
      icon: 'envelope.fill',
    },
    {
      id: '2',
      name: 'Calendar Access',
      description: 'View and manage calendar events',
      enabled: true,
      icon: 'calendar',
    },
    {
      id: '3',
      name: 'Contacts Access',
      description: 'Access contact information',
      enabled: true,
      icon: 'person.2.fill',
    },
    {
      id: '4',
      name: 'Microphone',
      description: 'Voice commands and call handling',
      enabled: false,
      icon: 'mic.fill',
    },
    {
      id: '5',
      name: 'Notifications',
      description: 'Send alerts and reminders',
      enabled: true,
      icon: 'bell.fill',
    },
  ]);

  const [auditLog] = useState<AuditLogEntry[]>([
    {
      id: '1',
      action: 'Email Triage Performed',
      timestamp: '2 minutes ago',
      category: 'action',
      details: 'Categorized 15 emails into Important, Informational, and Spam',
    },
    {
      id: '2',
      action: 'Calendar Sync',
      timestamp: '15 minutes ago',
      category: 'sync',
      details: 'Synchronized calendar with 3 new events',
    },
    {
      id: '3',
      action: 'Data Access',
      timestamp: '1 hour ago',
      category: 'data_access',
      details: 'Accessed contact list to suggest meeting attendees',
    },
    {
      id: '4',
      action: 'Permission Updated',
      timestamp: '3 hours ago',
      category: 'permission',
      details: 'Notifications permission enabled',
    },
    {
      id: '5',
      action: 'Auto-Reply Sent',
      timestamp: '5 hours ago',
      category: 'action',
      details: 'Sent automated response to incoming message',
    },
  ]);

  const [dataRetention, setDataRetention] = useState('30 days');
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [anonymousAnalytics, setAnonymousAnalytics] = useState(true);

  const togglePermission = (id: string) => {
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
    console.log('Permission toggled:', id);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'data_access':
        return colors.info;
      case 'permission':
        return colors.warning;
      case 'action':
        return colors.accent;
      case 'sync':
        return colors.secondary;
      default:
        return colors.textSecondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data_access':
        return 'eye.fill';
      case 'permission':
        return 'lock.shield.fill';
      case 'action':
        return 'bolt.fill';
      case 'sync':
        return 'arrow.triangle.2.circlepath';
      default:
        return 'circle.fill';
    }
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log('Export audit log')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="square.and.arrow.up" color={colors.primary} size={24} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Privacy & Security",
            headerRight: renderHeaderRight,
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
                <Text style={styles.headerTitle}>Privacy & Security</Text>
                <Pressable
                  onPress={() => console.log('Export audit log')}
                  style={styles.headerButton}
                >
                  <IconSymbol name="square.and.arrow.up" color={colors.primary} size={24} />
                </Pressable>
              </View>
            </View>
          )}

          {/* Privacy Overview */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <View style={[styles.card, styles.overviewCard]}>
              <View style={styles.overviewHeader}>
                <IconSymbol name="lock.shield.fill" size={48} color={colors.accent} />
                <View style={styles.overviewText}>
                  <Text style={styles.overviewTitle}>Your Data is Protected</Text>
                  <Text style={styles.overviewDescription}>
                    All data is encrypted and stored securely. You have full control over what the AI can access.
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Permissions */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="checkmark.shield.fill" color={colors.primary} size={24} />
              <Text style={styles.sectionTitle}>Permissions</Text>
            </View>
            <View style={styles.card}>
              {permissions.map((permission, index) => (
                <View key={permission.id}>
                  {index > 0 && <View style={styles.divider} />}
                  <View style={styles.permissionRow}>
                    <View style={styles.permissionInfo}>
                      <View style={[styles.permissionIcon, { backgroundColor: permission.enabled ? colors.accent + '20' : colors.border }]}>
                        <IconSymbol 
                          name={permission.icon} 
                          size={20} 
                          color={permission.enabled ? colors.accent : colors.textSecondary} 
                        />
                      </View>
                      <View style={styles.permissionText}>
                        <Text style={styles.permissionName}>{permission.name}</Text>
                        <Text style={styles.permissionDescription}>{permission.description}</Text>
                      </View>
                    </View>
                    <Switch
                      value={permission.enabled}
                      onValueChange={() => togglePermission(permission.id)}
                      trackColor={{ false: colors.border, true: colors.accent }}
                      thumbColor={colors.card}
                    />
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Data Management */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="externaldrive.fill" color={colors.secondary} size={24} />
              <Text style={styles.sectionTitle}>Data Management</Text>
            </View>
            <View style={styles.card}>
              <Pressable 
                style={styles.settingRow}
                onPress={() => console.log('Data retention settings')}
              >
                <IconSymbol name="clock.arrow.circlepath" size={20} color={colors.textSecondary} />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Data Retention</Text>
                  <Text style={styles.settingValue}>{dataRetention}</Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              </Pressable>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <IconSymbol name="lock.fill" size={20} color={colors.textSecondary} />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>End-to-End Encryption</Text>
                  <Text style={styles.settingValue}>All data encrypted at rest</Text>
                </View>
                <Switch
                  value={encryptionEnabled}
                  onValueChange={setEncryptionEnabled}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={colors.card}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <IconSymbol name="chart.bar.fill" size={20} color={colors.textSecondary} />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Anonymous Analytics</Text>
                  <Text style={styles.settingValue}>Help improve the app</Text>
                </View>
                <Switch
                  value={anonymousAnalytics}
                  onValueChange={setAnonymousAnalytics}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={colors.card}
                />
              </View>

              <View style={styles.divider} />

              <Pressable 
                style={styles.settingRow}
                onPress={() => console.log('Export data')}
              >
                <IconSymbol name="square.and.arrow.down.fill" size={20} color={colors.textSecondary} />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Export Your Data</Text>
                  <Text style={styles.settingValue}>Download all your data</Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              </Pressable>

              <View style={styles.divider} />

              <Pressable 
                style={styles.settingRow}
                onPress={() => console.log('Delete data')}
              >
                <IconSymbol name="trash.fill" size={20} color={colors.error} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: colors.error }]}>Delete All Data</Text>
                  <Text style={styles.settingValue}>Permanently remove your data</Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              </Pressable>
            </View>
          </Animated.View>

          {/* Audit Trail */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="list.bullet.clipboard.fill" color={colors.warning} size={24} />
              <Text style={styles.sectionTitle}>Audit Trail</Text>
            </View>
            {auditLog.map((entry) => (
              <Pressable
                key={entry.id}
                style={styles.card}
                onPress={() => console.log('Audit entry details:', entry.id)}
              >
                <View style={styles.auditHeader}>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(entry.category) + '20' }]}>
                    <IconSymbol 
                      name={getCategoryIcon(entry.category)} 
                      size={16} 
                      color={getCategoryColor(entry.category)} 
                    />
                  </View>
                  <Text style={styles.auditTime}>{entry.timestamp}</Text>
                </View>
                <Text style={styles.auditAction}>{entry.action}</Text>
                <Text style={styles.auditDetails}>{entry.details}</Text>
              </Pressable>
            ))}
            <Pressable 
              style={styles.viewAllButton}
              onPress={() => console.log('View all audit logs')}
            >
              <Text style={styles.viewAllText}>View Complete Audit Log</Text>
              <IconSymbol name="arrow.right" size={16} color={colors.primary} />
            </Pressable>
          </Animated.View>

          {/* Compliance Info */}
          <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
            <View style={styles.complianceCard}>
              <View style={styles.complianceHeader}>
                <IconSymbol name="checkmark.seal.fill" size={24} color={colors.accent} />
                <Text style={styles.complianceTitle}>Privacy Compliance</Text>
              </View>
              <Text style={styles.complianceText}>
                This app complies with GDPR, CCPA, and other privacy regulations. Your data is never sold to third parties.
              </Text>
              <Pressable 
                style={styles.complianceButton}
                onPress={() => console.log('View privacy policy')}
              >
                <Text style={styles.complianceButtonText}>Read Privacy Policy</Text>
              </Pressable>
            </View>
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
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  overviewCard: {
    backgroundColor: colors.accent + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  overviewText: {
    flex: 1,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  overviewDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  permissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  permissionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    flex: 1,
  },
  permissionName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  permissionDescription: {
    fontSize: 13,
    color: colors.textSecondary,
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
  auditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  auditTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  auditAction: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  auditDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  complianceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  complianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  complianceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  complianceText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  complianceButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  complianceButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.card,
  },
  bottomPadding: {
    height: 100,
  },
});
