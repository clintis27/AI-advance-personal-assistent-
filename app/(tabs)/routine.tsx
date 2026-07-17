
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable } from "react-native";
import { Stack } from "expo-router";
import { IconSymbol, IconSymbolName } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import Animated, { FadeInDown } from "react-native-reanimated";

interface RoutinePattern {
  id: string;
  time: string;
  activity: string;
  frequency: number;
  confidence: number;
  icon: IconSymbolName;
  color: string;
}

interface BehaviorInsight {
  id: string;
  title: string;
  description: string;
  metric: string;
  trend: 'up' | 'down' | 'stable';
  icon: IconSymbolName;
}

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  type: 'predicted' | 'scheduled' | 'suggested';
  priority: 'high' | 'medium' | 'low';
}

export default function RoutineScreen() {
  const [routinePatterns] = useState<RoutinePattern[]>([
    {
      id: '1',
      time: '8:00 AM',
      activity: 'Check emails',
      frequency: 95,
      confidence: 92,
      icon: 'envelope.fill',
      color: colors.primary,
    },
    {
      id: '2',
      time: '10:00 AM',
      activity: 'Team standup',
      frequency: 88,
      confidence: 90,
      icon: 'person.3.fill',
      color: colors.secondary,
    },
    {
      id: '3',
      time: '2:00 PM',
      activity: 'Deep work session',
      frequency: 82,
      confidence: 85,
      icon: 'brain',
      color: colors.accent,
    },
    {
      id: '4',
      time: '4:30 PM',
      activity: 'Review tasks',
      frequency: 78,
      confidence: 80,
      icon: 'checkmark.circle.fill',
      color: colors.warning,
    },
  ]);

  const [behaviorInsights] = useState<BehaviorInsight[]>([
    {
      id: '1',
      title: 'Peak Productivity',
      description: 'You&apos;re most productive between 9 AM - 12 PM',
      metric: '3 hours',
      trend: 'stable',
      icon: 'chart.line.uptrend.xyaxis',
    },
    {
      id: '2',
      title: 'Response Time',
      description: 'Average email response time',
      metric: '2.5 hours',
      trend: 'down',
      icon: 'clock.arrow.circlepath',
    },
    {
      id: '3',
      title: 'Meeting Load',
      description: 'Weekly meeting hours',
      metric: '12 hours',
      trend: 'up',
      icon: 'calendar.badge.clock',
    },
    {
      id: '4',
      title: 'Focus Time',
      description: 'Uninterrupted work blocks',
      metric: '4.2 hours/day',
      trend: 'up',
      icon: 'timer',
    },
  ]);

  const [todaySchedule] = useState<ScheduleItem[]>([
    {
      id: '1',
      time: '9:00 AM',
      title: 'Review quarterly reports',
      type: 'predicted',
      priority: 'high',
    },
    {
      id: '2',
      time: '10:00 AM',
      title: 'Team Standup',
      type: 'scheduled',
      priority: 'medium',
    },
    {
      id: '3',
      time: '11:30 AM',
      title: 'Coffee break (suggested)',
      type: 'suggested',
      priority: 'low',
    },
    {
      id: '4',
      time: '2:00 PM',
      title: 'Client Presentation',
      type: 'scheduled',
      priority: 'high',
    },
    {
      id: '5',
      time: '4:00 PM',
      title: 'Prepare for tomorrow',
      type: 'predicted',
      priority: 'medium',
    },
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'arrow.up.right';
      case 'down':
        return 'arrow.down.right';
      case 'stable':
        return 'arrow.right';
      default:
        return 'minus';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return colors.accent;
      case 'down':
        return colors.error;
      case 'stable':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'predicted':
        return colors.primary;
      case 'scheduled':
        return colors.accent;
      case 'suggested':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'predicted':
        return 'AI Predicted';
      case 'scheduled':
        return 'Scheduled';
      case 'suggested':
        return 'Suggested';
      default:
        return type;
    }
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log('Routine settings')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="slider.horizontal.3" color={colors.primary} size={24} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Daily Routine",
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
                <Text style={styles.headerTitle}>Daily Routine</Text>
                <Pressable
                  onPress={() => console.log('Routine settings')}
                  style={styles.headerButton}
                >
                  <IconSymbol name="slider.horizontal.3" color={colors.primary} size={24} />
                </Pressable>
              </View>
            </View>
          )}

          {/* Today's Auto-Schedule */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="calendar.badge.clock" color={colors.primary} size={24} />
              <Text style={styles.sectionTitle}>Today&apos;s Schedule</Text>
            </View>
            <View style={styles.timelineCard}>
              {todaySchedule.map((item, index) => (
                <View key={item.id}>
                  {index > 0 && <View style={styles.timelineConnector} />}
                  <Pressable
                    style={styles.timelineItem}
                    onPress={() => console.log('Schedule item:', item.id)}
                  >
                    <View style={styles.timelineTime}>
                      <Text style={styles.timeText}>{item.time}</Text>
                    </View>
                    <View style={[styles.timelineDot, { backgroundColor: getTypeColor(item.type) }]} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineTitle}>{item.title}</Text>
                      <View style={styles.timelineMeta}>
                        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) + '20' }]}>
                          <Text style={[styles.typeBadgeText, { color: getTypeColor(item.type) }]}>
                            {getTypeBadge(item.type)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Routine Patterns */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="arrow.triangle.2.circlepath" color={colors.secondary} size={24} />
              <Text style={styles.sectionTitle}>Learned Patterns</Text>
            </View>
            {routinePatterns.map((pattern) => (
              <Pressable
                key={pattern.id}
                style={styles.card}
                onPress={() => console.log('Pattern details:', pattern.id)}
              >
                <View style={styles.patternHeader}>
                  <View style={[styles.patternIcon, { backgroundColor: pattern.color + '20' }]}>
                    <IconSymbol name={pattern.icon} size={24} color={pattern.color} />
                  </View>
                  <View style={styles.patternInfo}>
                    <Text style={styles.patternTime}>{pattern.time}</Text>
                    <Text style={styles.patternActivity}>{pattern.activity}</Text>
                  </View>
                </View>
                <View style={styles.patternStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Frequency</Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${pattern.frequency}%`, backgroundColor: pattern.color }]} />
                    </View>
                    <Text style={styles.statValue}>{pattern.frequency}%</Text>
                  </View>
                  <View style={styles.confidenceBadge}>
                    <IconSymbol name="checkmark.seal.fill" size={14} color={colors.accent} />
                    <Text style={styles.confidenceText}>{pattern.confidence}%</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </Animated.View>

          {/* Behavior Insights */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="chart.bar.fill" color={colors.accent} size={24} />
              <Text style={styles.sectionTitle}>Behavior Insights</Text>
            </View>
            <View style={styles.insightsGrid}>
              {behaviorInsights.map((insight) => (
                <Pressable
                  key={insight.id}
                  style={styles.insightCard}
                  onPress={() => console.log('Insight details:', insight.id)}
                >
                  <View style={styles.insightHeader}>
                    <IconSymbol name={insight.icon} size={28} color={colors.primary} />
                    <View style={[styles.trendBadge, { backgroundColor: getTrendColor(insight.trend) + '20' }]}>
                      <IconSymbol name={getTrendIcon(insight.trend)} size={12} color={getTrendColor(insight.trend)} />
                    </View>
                  </View>
                  <Text style={styles.insightMetric}>{insight.metric}</Text>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightDescription}>{insight.description}</Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Digital Body Language */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="person.badge.clock.fill" color={colors.warning} size={24} />
              <Text style={styles.sectionTitle}>Digital Body Language</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.bodyLanguageTitle}>Communication Style</Text>
              <Text style={styles.bodyLanguageDescription}>
                Your communication is typically concise and professional, with quick responses in the morning and more detailed replies in the afternoon.
              </Text>
              
              <View style={styles.divider} />
              
              <Text style={styles.bodyLanguageTitle}>Work Patterns</Text>
              <Text style={styles.bodyLanguageDescription}>
                You prefer focused work blocks in the morning, collaborative sessions mid-day, and administrative tasks in the late afternoon.
              </Text>
              
              <View style={styles.divider} />
              
              <Text style={styles.bodyLanguageTitle}>Decision Making</Text>
              <Text style={styles.bodyLanguageDescription}>
                You tend to make quick decisions on routine matters but take more time for strategic planning, usually scheduling thinking time.
              </Text>
            </View>
          </Animated.View>

          {/* Auto-Optimization */}
          <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
            <View style={styles.optimizationBanner}>
              <View style={styles.optimizationHeader}>
                <IconSymbol name="sparkles" size={32} color={colors.primary} />
                <Text style={styles.optimizationTitle}>AI Optimization Active</Text>
              </View>
              <Text style={styles.optimizationText}>
                Your schedule is automatically optimized based on your routine patterns and energy levels throughout the day.
              </Text>
              <Pressable 
                style={styles.optimizationButton}
                onPress={() => console.log('View optimization details')}
              >
                <Text style={styles.optimizationButtonText}>View Details</Text>
                <IconSymbol name="arrow.right" size={16} color={colors.primary} />
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
  timelineCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timelineTime: {
    width: 70,
    paddingTop: 2,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  timelineMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timelineConnector: {
    width: 2,
    height: 16,
    backgroundColor: colors.border,
    marginLeft: 75,
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  patternIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patternInfo: {
    flex: 1,
  },
  patternTime: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  patternActivity: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  patternStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    marginRight: 12,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  insightCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  trendBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightMetric: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  bodyLanguageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  bodyLanguageDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  optimizationBanner: {
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  optimizationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  optimizationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  optimizationText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  optimizationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
  },
  optimizationButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  bottomPadding: {
    height: 100,
  },
});
