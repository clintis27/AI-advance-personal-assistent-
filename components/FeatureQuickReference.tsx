
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface QuickTip {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export default function FeatureQuickReference() {
  const problemSolverTips: QuickTip[] = [
    {
      icon: 'text.bubble.fill',
      title: 'Paste Anything',
      description: 'Copy emails, messages, or task descriptions and paste them for instant analysis.',
      color: colors.primary,
    },
    {
      icon: 'chart.bar.fill',
      title: 'Impact Scores',
      description: 'Higher scores (80-100) mean bigger impact. Focus on high-impact, low-effort solutions.',
      color: colors.success,
    },
    {
      icon: 'hand.thumbsup.fill',
      title: 'Rate Solutions',
      description: 'Thumbs up/down helps the AI learn your preferences and improve future suggestions.',
      color: colors.accent,
    },
    {
      icon: 'link.circle.fill',
      title: 'Auto-Log Actions',
      description: 'Connect Notion, Trello, or Jira to automatically create tasks from solutions.',
      color: colors.secondary,
    },
  ];

  const travelTips: QuickTip[] = [
    {
      icon: 'magnifyingglass',
      title: 'Natural Language',
      description: 'Just type "Meeting in Berlin tomorrow" and let AI extract all the details.',
      color: colors.primary,
    },
    {
      icon: 'leaf.fill',
      title: 'Sustainability',
      description: 'Green leaf icons show eco-friendly options. Trains usually score highest.',
      color: colors.success,
    },
    {
      icon: 'clock.fill',
      title: 'Buffer Time',
      description: 'Itineraries include buffer time before meetings. Adjust in settings if needed.',
      color: colors.warning,
    },
    {
      icon: 'calendar.badge.clock',
      title: 'Smart Returns',
      description: 'AI suggests return times based on your next scheduled tasks and meetings.',
      color: colors.info,
    },
  ];

  const generalTips: QuickTip[] = [
    {
      icon: 'sparkles',
      title: 'Demo Mode',
      description: 'All features work with sample data. No API keys needed to explore.',
      color: colors.accent,
    },
    {
      icon: 'lock.shield.fill',
      title: 'Privacy First',
      description: 'Your data stays on device by default. Cloud sync requires explicit consent.',
      color: colors.error,
    },
    {
      icon: 'bell.badge.fill',
      title: 'Smart Notifications',
      description: 'Get alerts for detected problems, travel updates, and solution suggestions.',
      color: colors.warning,
    },
    {
      icon: 'arrow.triangle.2.circlepath',
      title: 'Continuous Learning',
      description: 'The more you use it, the better it gets at understanding your preferences.',
      color: colors.secondary,
    },
  ];

  const renderTipCard = (tip: QuickTip, index: number) => (
    <Animated.View
      key={index}
      entering={FadeInDown.delay(100 + index * 50)}
      style={styles.tipCard}
    >
      <View style={[styles.tipIcon, { backgroundColor: tip.color + '20' }]}>
        <IconSymbol name={tip.icon} size={24} color={tip.color} />
      </View>
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <Text style={styles.tipDescription}>{tip.description}</Text>
      </View>
    </Animated.View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="lightbulb.fill" size={24} color={colors.secondary} />
          <Text style={styles.sectionTitle}>Problem Solver Tips</Text>
        </View>
        {problemSolverTips.map(renderTipCard)}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="airplane.departure" size={24} color={colors.info} />
          <Text style={styles.sectionTitle}>Travel Assistant Tips</Text>
        </View>
        {travelTips.map(renderTipCard)}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
          <Text style={styles.sectionTitle}>General Tips</Text>
        </View>
        {generalTips.map(renderTipCard)}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 40,
  },
});
