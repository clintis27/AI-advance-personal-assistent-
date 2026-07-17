
import Animated, { FadeInDown } from "react-native-reanimated";
import { Stack } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, TextInput, Image } from "react-native";
import React, { useState } from "react";
import { IconSymbol, IconSymbolName } from "@/components/IconSymbol";

interface Problem {
  id: string;
  title: string;
  description: string;
  detectedFrom: 'email' | 'task' | 'message' | 'calendar';
  timestamp: string;
  status: 'new' | 'analyzing' | 'solved' | 'dismissed';
  blockers: string[];
  deadline?: string;
}

interface Solution {
  id: string;
  problemId: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  impactScore: number;
  steps: string[];
  estimatedTime: string;
  helpful?: boolean;
}

interface Integration {
  id: string;
  name: string;
  icon: IconSymbolName;
  connected: boolean;
  color: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  featuredCard: {
    backgroundColor: colors.card,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 24,
    boxShadow: `0px 12px 32px ${colors.shadow}`,
    elevation: 4,
  },
  featuredImage: {
    width: '100%',
    height: 220,
    backgroundColor: colors.cardSecondary,
  },
  featuredContent: {
    padding: 24,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.cardSecondary,
    marginBottom: 12,
  },
  featuredBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  featuredDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.3,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    boxShadow: `0px 8px 24px ${colors.shadow}`,
    elevation: 3,
  },
  cardCompact: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    boxShadow: `0px 6px 20px ${colors.shadow}`,
    elevation: 2,
  },
  problemItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  problemItemLast: {
    borderBottomWidth: 0,
  },
  problemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  problemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  problemDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  problemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  solutionCard: {
    backgroundColor: colors.cardSecondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  solutionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  solutionTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginRight: 12,
  },
  impactBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  solutionDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  solutionStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  stepsList: {
    gap: 8,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 20,
    paddingTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonTextPrimary: {
    color: colors.card,
  },
  actionButtonTextSecondary: {
    color: colors.text,
  },
  integrationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  integrationCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    boxShadow: `0px 6px 20px ${colors.shadow}`,
    elevation: 2,
  },
  integrationIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  integrationName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  integrationStatus: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
  },
});

export default function ProblemSolverScreen() {
  const [problems] = useState<Problem[]>([
    {
      id: '1',
      title: 'Budget Approval Delayed',
      description: 'Q4 budget needs approval from finance team before Friday',
      detectedFrom: 'email',
      timestamp: '2 hours ago',
      status: 'new',
      blockers: ['Finance team unavailable', 'Missing cost breakdown'],
      deadline: 'Dec 15, 2024',
    },
    {
      id: '2',
      title: 'Project Timeline Conflict',
      description: 'Two major deliverables scheduled for the same week',
      detectedFrom: 'calendar',
      timestamp: '5 hours ago',
      status: 'analyzing',
      blockers: ['Resource constraints', 'Client expectations'],
    },
  ]);

  const [solutions] = useState<Solution[]>([
    {
      id: '1',
      problemId: '1',
      title: 'Expedite Approval Process',
      description: 'Schedule urgent meeting with finance team and prepare detailed cost breakdown',
      impact: 'high',
      effort: 'medium',
      impactScore: 85,
      steps: [
        'Prepare detailed cost breakdown document',
        'Schedule 30-min meeting with finance team',
        'Send pre-read materials 24 hours before meeting',
        'Follow up with action items immediately after',
      ],
      estimatedTime: '2 hours',
    },
    {
      id: '2',
      problemId: '1',
      title: 'Request Extension',
      description: 'Negotiate deadline extension with stakeholders',
      impact: 'medium',
      effort: 'low',
      impactScore: 65,
      steps: [
        'Identify key stakeholders',
        'Draft extension request email',
        'Propose new timeline with buffer',
        'Get written confirmation',
      ],
      estimatedTime: '1 hour',
    },
  ]);

  const [integrations] = useState<Integration[]>([
    { id: '1', name: 'Gmail', icon: 'envelope', connected: true, color: colors.error },
    { id: '2', name: 'Slack', icon: 'message', connected: true, color: colors.primary },
    { id: '3', name: 'Notion', icon: 'doc', connected: false, color: colors.text },
    { id: '4', name: 'Asana', icon: 'checkmark.circle', connected: false, color: colors.accent },
  ]);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'email':
        return 'envelope';
      case 'task':
        return 'checkmark.circle';
      case 'message':
        return 'message';
      case 'calendar':
        return 'calendar';
      default:
        return 'doc';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'email':
        return colors.error;
      case 'task':
        return colors.success;
      case 'message':
        return colors.info;
      case 'calendar':
        return colors.warning;
      default:
        return colors.textMuted;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'solved':
        return colors.success;
      case 'analyzing':
        return colors.info;
      case 'new':
        return colors.warning;
      case 'dismissed':
        return colors.textMuted;
      default:
        return colors.textMuted;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.textMuted;
      default:
        return colors.textMuted;
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.textMuted;
    }
  };

  const handleAnalyze = () => {
    console.log('Analyzing problems...');
  };

  const handleSolutionFeedback = (solutionId: string, helpful: boolean) => {
    console.log(`Solution ${solutionId} marked as ${helpful ? 'helpful' : 'not helpful'}`);
  };

  const handleExecuteSolution = (solution: Solution) => {
    console.log('Executing solution:', solution.title);
  };

  const renderHeaderRight = () => (
    <Pressable style={{ marginRight: 16 }} onPress={handleAnalyze}>
      <IconSymbol name="sparkles" size={28} color={colors.primary} />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerTransparent: true,
          headerRight: renderHeaderRight,
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.header}>
            <Text style={styles.title}>Problem Solver</Text>
            <Text style={styles.subtitle}>
              AI-powered problem detection and solution generation. We analyze your workflow and suggest actionable solutions.
            </Text>
          </Animated.View>

          {/* Featured Insight */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)}>
            <View style={styles.featuredCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80' }}
                style={styles.featuredImage}
                resizeMode="cover"
              />
              <View style={styles.featuredContent}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>Insight</Text>
                </View>
                <Text style={styles.featuredTitle}>Blue blood.</Text>
                <Text style={styles.featuredDescription}>
                  With the best things in life are unexpected because they were never no expectations.
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Detected Problems */}
          <Animated.View entering={FadeInDown.duration(600).delay(300)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Detected Problems</Text>
            </View>
            <View style={styles.card}>
              {problems.map((problem, index) => (
                <View
                  key={problem.id}
                  style={[
                    styles.problemItem,
                    index === problems.length - 1 && styles.problemItemLast,
                  ]}
                >
                  <View style={styles.problemHeader}>
                    <Text style={styles.problemTitle}>{problem.title}</Text>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: getStatusColor(problem.status) + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          { color: getStatusColor(problem.status) },
                        ]}
                      >
                        {problem.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.problemDescription}>{problem.description}</Text>
                  <View style={styles.problemMeta}>
                    <View style={styles.metaItem}>
                      <IconSymbol
                        name={getSourceIcon(problem.detectedFrom)}
                        size={14}
                        color={getSourceColor(problem.detectedFrom)}
                      />
                      <Text style={styles.metaText}>{problem.detectedFrom}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <IconSymbol name="clock" size={14} color={colors.textMuted} />
                      <Text style={styles.metaText}>{problem.timestamp}</Text>
                    </View>
                    {problem.deadline && (
                      <View style={styles.metaItem}>
                        <IconSymbol name="calendar" size={14} color={colors.textMuted} />
                        <Text style={styles.metaText}>{problem.deadline}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Suggested Solutions */}
          <Animated.View entering={FadeInDown.duration(600).delay(400)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Suggested Solutions</Text>
            </View>
            {solutions.map((solution) => (
              <View key={solution.id} style={styles.solutionCard}>
                <View style={styles.solutionHeader}>
                  <Text style={styles.solutionTitle}>{solution.title}</Text>
                  <View
                    style={[
                      styles.impactBadge,
                      { backgroundColor: getImpactColor(solution.impact) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: getImpactColor(solution.impact) },
                      ]}
                    >
                      {solution.impact}
                    </Text>
                  </View>
                </View>
                <Text style={styles.solutionDescription}>{solution.description}</Text>
                <View style={styles.solutionStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Impact Score</Text>
                    <Text style={styles.statValue}>{solution.impactScore}%</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Effort</Text>
                    <Text style={[styles.statValue, { color: getEffortColor(solution.effort) }]}>
                      {solution.effort}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Time</Text>
                    <Text style={styles.statValue}>{solution.estimatedTime}</Text>
                  </View>
                </View>
                <View style={styles.stepsList}>
                  {solution.steps.map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.actionButtons}>
                  <Pressable
                    style={[styles.actionButton, styles.actionButtonPrimary]}
                    onPress={() => handleExecuteSolution(solution)}
                  >
                    <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
                      Execute
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, styles.actionButtonSecondary]}
                    onPress={() => handleSolutionFeedback(solution.id, false)}
                  >
                    <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
                      Dismiss
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </Animated.View>

          {/* Integrations */}
          <Animated.View entering={FadeInDown.duration(600).delay(500)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Connected Tools</Text>
            </View>
            <View style={styles.integrationsGrid}>
              {integrations.map((integration) => (
                <View key={integration.id} style={styles.integrationCard}>
                  <View
                    style={[
                      styles.integrationIcon,
                      { backgroundColor: integration.color + '20' },
                    ]}
                  >
                    <IconSymbol
                      name={integration.icon}
                      size={24}
                      color={integration.color}
                    />
                  </View>
                  <Text style={styles.integrationName}>{integration.name}</Text>
                  <Text style={styles.integrationStatus}>
                    {integration.connected ? 'Connected' : 'Not connected'}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </>
  );
}
