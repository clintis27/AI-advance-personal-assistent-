
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'pending' | 'completed' | 'optional';
}

interface AISetupGuideProps {
  feature: 'problem-solver' | 'travel';
  onClose: () => void;
}

export default function AISetupGuide({ feature, onClose }: AISetupGuideProps) {
  const problemSolverSteps: SetupStep[] = [
    {
      id: '1',
      title: 'Connect AI Service',
      description: 'Add your OpenAI or Claude API key to enable AI-powered problem analysis.',
      icon: 'brain',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Link Productivity Tools',
      description: 'Connect Notion, Trello, Asana, or other tools to automatically log action items.',
      icon: 'link.circle.fill',
      status: 'optional',
    },
    {
      id: '3',
      title: 'Enable Auto-Detection',
      description: 'Allow the app to scan emails and messages for problems (requires permissions).',
      icon: 'eye.fill',
      status: 'optional',
    },
    {
      id: '4',
      title: 'Set Preferences',
      description: 'Configure how solutions are ranked and which factors matter most to you.',
      icon: 'slider.horizontal.3',
      status: 'optional',
    },
  ];

  const travelSteps: SetupStep[] = [
    {
      id: '1',
      title: 'Connect Travel APIs',
      description: 'Add API keys for Amadeus, Skyscanner, or Booking.com to search real travel options.',
      icon: 'airplane.departure',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Set Travel Preferences',
      description: 'Configure your preferred airlines, seat preferences, and sustainability priorities.',
      icon: 'heart.fill',
      status: 'optional',
    },
    {
      id: '3',
      title: 'Link Calendar',
      description: 'Connect your calendar to auto-update with travel plans and detect travel needs.',
      icon: 'calendar',
      status: 'optional',
    },
    {
      id: '4',
      title: 'Configure Autonomy',
      description: 'Set booking rules: manual review, semi-autonomous, or fully-autonomous.',
      icon: 'gear',
      status: 'optional',
    },
  ];

  const steps = feature === 'problem-solver' ? problemSolverSteps : travelSteps;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'pending': return colors.warning;
      case 'optional': return colors.info;
      default: return colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconSymbol 
            name={feature === 'problem-solver' ? 'lightbulb.fill' : 'airplane.departure'} 
            size={28} 
            color={colors.primary} 
          />
          <Text style={styles.headerTitle}>
            {feature === 'problem-solver' ? 'Problem Solver Setup' : 'Travel Assistant Setup'}
          </Text>
        </View>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.infoCard}>
          <IconSymbol name="info.circle.fill" size={24} color={colors.info} />
          <Text style={styles.infoText}>
            {feature === 'problem-solver' 
              ? 'The Problem Solver uses AI to analyze issues and generate actionable solutions. Follow these steps to get started.'
              : 'The Travel Assistant helps you find and book travel options automatically. Follow these steps to enable all features.'}
          </Text>
        </Animated.View>

        {steps.map((step, index) => (
          <Animated.View 
            key={step.id} 
            entering={FadeInDown.delay(200 + index * 100)}
            style={styles.stepCard}
          >
            <View style={styles.stepHeader}>
              <View style={[styles.stepIcon, { backgroundColor: getStatusColor(step.status) + '20' }]}>
                <IconSymbol name={step.icon} size={24} color={getStatusColor(step.status)} />
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(step.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(step.status) }]}>
                    {step.status}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.stepDescription}>{step.description}</Text>
            <Pressable style={styles.stepButton}>
              <Text style={styles.stepButtonText}>Configure</Text>
              <IconSymbol name="arrow.right" size={16} color={colors.primary} />
            </Pressable>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInDown.delay(600)} style={styles.demoCard}>
          <IconSymbol name="play.circle.fill" size={32} color={colors.accent} />
          <Text style={styles.demoTitle}>Try Demo Mode</Text>
          <Text style={styles.demoDescription}>
            Explore the features with sample data before connecting real services.
          </Text>
          <Pressable style={styles.demoButton} onPress={onClose}>
            <Text style={styles.demoButtonText}>Continue with Demo</Text>
          </Pressable>
        </Animated.View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: colors.info + '15',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    flexDirection: 'row',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  stepCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  stepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary + '15',
    paddingVertical: 10,
    borderRadius: 8,
  },
  stepButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  demoCard: {
    backgroundColor: colors.accent + '15',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  demoDescription: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  demoButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  demoButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.card,
  },
  bottomPadding: {
    height: 40,
  },
});
