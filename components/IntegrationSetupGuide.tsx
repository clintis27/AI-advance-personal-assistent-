
import { colors } from '@/styles/commonStyles';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { IconSymbol, IconSymbolName } from '@/components/IconSymbol';
import React from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: IconSymbolName;
  status: 'pending' | 'completed' | 'optional';
}

interface IntegrationSetupGuideProps {
  integrationId: string;
  integrationName: string;
  onClose: () => void;
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  stepCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: colors.info + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
    flex: 1,
  },
  warningBox: {
    backgroundColor: colors.warning + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  warningText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
    flex: 1,
  },
  scopesList: {
    marginTop: 8,
  },
  scopeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  scopeBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  scopeText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default function IntegrationSetupGuide({
  integrationId,
  integrationName,
  onClose,
}: IntegrationSetupGuideProps) {
  const getSetupSteps = (): SetupStep[] => {
    // Return setup steps based on integration type
    const commonSteps: SetupStep[] = [
      {
        id: '1',
        title: 'Review Permissions',
        description: 'Understand what data the integration will access and how it will be used.',
        icon: 'eye.fill',
        status: 'pending',
      },
      {
        id: '2',
        title: 'Authorize Access',
        description: 'Sign in to your account and grant the necessary permissions.',
        icon: 'key.fill',
        status: 'pending',
      },
      {
        id: '3',
        title: 'Configure Settings',
        description: 'Set up automation rules and preferences for this integration.',
        icon: 'gearshape.fill',
        status: 'pending',
      },
      {
        id: '4',
        title: 'Test Connection',
        description: 'Verify that the integration is working correctly.',
        icon: 'checkmark.circle.fill',
        status: 'optional',
      },
    ];

    return commonSteps;
  };

  const getRequiredScopes = (): string[] => {
    // Return required scopes based on integration
    const scopeMap: Record<string, string[]> = {
      gmail: ['Read emails', 'Send emails', 'Access labels'],
      googleCalendar: ['View calendar events', 'Create events', 'Modify events'],
      slack: ['Read messages', 'Send messages', 'Access channels'],
      notion: ['Read pages', 'Create pages', 'Update content'],
      stripe: ['Process payments', 'View transactions', 'Issue refunds'],
    };

    return scopeMap[integrationId] || ['Basic access'];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'optional':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={styles.overlay}>
      <Animated.View entering={FadeInDown.duration(300)} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Setup {integrationName}</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.infoBox}>
            <IconSymbol
              name="info.circle.fill"
              size={20}
              color={colors.info}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              This integration uses OAuth 2.0 for secure authentication. Your credentials are
              never stored by our app.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Required Permissions</Text>
            <View style={styles.scopesList}>
              {getRequiredScopes().map((scope, index) => (
                <View key={index} style={styles.scopeItem}>
                  <View style={styles.scopeBullet} />
                  <Text style={styles.scopeText}>{scope}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.warningBox}>
            <IconSymbol
              name="exclamationmark.triangle.fill"
              size={20}
              color={colors.warning}
              style={styles.warningIcon}
            />
            <Text style={styles.warningText}>
              You can revoke access at any time from your account settings or the integration
              provider&apos;s dashboard.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Setup Steps</Text>
            {getSetupSteps().map((step, index) => (
              <Animated.View
                key={step.id}
                entering={FadeInDown.duration(300).delay(100 + index * 50)}
              >
                <View style={styles.stepCard}>
                  <View
                    style={[
                      styles.stepIcon,
                      { backgroundColor: getStatusColor(step.status) + '20' },
                    ]}
                  >
                    <IconSymbol
                      name={step.icon}
                      size={20}
                      color={getStatusColor(step.status)}
                    />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(step.status) + '20' },
                      ]}
                    >
                      <Text
                        style={[styles.statusText, { color: getStatusColor(step.status) }]}
                      >
                        {step.status === 'optional' ? 'Optional' : 'Required'}
                      </Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>

          <Pressable style={styles.actionButton} onPress={onClose}>
            <Text style={styles.actionButtonText}>Got It</Text>
          </Pressable>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
