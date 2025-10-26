
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Dimensions } from "react-native";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

interface BehaviorMetric {
  id: string;
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
}

interface ActivityPattern {
  id: string;
  timeOfDay: string;
  activity: string;
  frequency: number;
  duration: string;
  confidence: number;
}

interface MoodDetection {
  id: string;
  timestamp: string;
  mood: 'energetic' | 'focused' | 'stressed' | 'relaxed';
  confidence: number;
  triggers: string[];
}

interface EventTrigger {
  id: string;
  name: string;
  type: 'device' | 'email' | 'calendar' | 'location' | 'time';
  enabled: boolean;
  lastTriggered?: string;
  action: string;
}

const { width } = Dimensions.get('window');

export default function BehaviorScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const [behaviorMetrics] = useState<BehaviorMetric[]>([
    {
      id: '1',
      name: 'Daily Active Hours',
      value: '8.5h',
      change: 12,
      trend: 'up',
      icon: 'clock.fill',
      color: colors.primary,
    },
    {
      id: '2',
      name: 'Task Completion',
      value: '87%',
      change: 5,
      trend: 'up',
      icon: 'checkmark.circle.fill',
      color: colors.accent,
    },
    {
      id: '3',
      name: 'Response Time',
      value: '2.3h',
      change: -15,
      trend: 'down',
      icon: 'arrow.triangle.2.circlepath',
      color: colors.secondary,
    },
    {
      id: '4',
      name: 'Focus Score',
      value: '92',
      change: 8,
      trend: 'up',
      icon: 'brain',
      color: colors.warning,
    },
  ]);

  const [activityPatterns] = useState<ActivityPattern[]>([
    {
      id: '1',
      timeOfDay: 'Morning (6-9 AM)',
      activity: 'Email & Planning',
      frequency: 95,
      duration: '45 min',
      confidence: 94,
    },
    {
      id: '2',
      timeOfDay: 'Mid-Morning (9-12 PM)',
      activity: 'Deep Work',
      frequency: 88,
      duration: '2.5 hours',
      confidence: 91,
    },
    {
      id: '3',
      timeOfDay: 'Afternoon (12-3 PM)',
      activity: 'Meetings & Collaboration',
      frequency: 82,
      duration: '1.5 hours',
      confidence: 87,
    },
    {
      id: '4',
      timeOfDay: 'Late Afternoon (3-6 PM)',
      activity: 'Task Completion',
      frequency: 78,
      duration: '2 hours',
      confidence: 85,
    },
  ]);

  const [moodHistory] = useState<MoodDetection[]>([
    {
      id: '1',
      timestamp: '9:00 AM',
      mood: 'energetic',
      confidence: 92,
      triggers: ['Morning coffee', 'Good sleep'],
    },
    {
      id: '2',
      timestamp: '11:30 AM',
      mood: 'focused',
      confidence: 88,
      triggers: ['Deep work session', 'No interruptions'],
    },
    {
      id: '3',
      timestamp: '2:00 PM',
      mood: 'stressed',
      confidence: 85,
      triggers: ['Back-to-back meetings', 'Tight deadline'],
    },
    {
      id: '4',
      timestamp: '4:30 PM',
      mood: 'relaxed',
      confidence: 90,
      triggers: ['Tasks completed', 'Break taken'],
    },
  ]);

  const [eventTriggers, setEventTriggers] = useState<EventTrigger[]>([
    {
      id: '1',
      name: 'Device Unlocked',
      type: 'device',
      enabled: true,
      lastTriggered: '2 min ago',
      action: 'Show priority tasks',
    },
    {
      id: '2',
      name: 'Urgent Email Received',
      type: 'email',
      enabled: true,
      lastTriggered: '15 min ago',
      action: 'Smart notification',
    },
    {
      id: '3',
      name: 'Meeting Starting Soon',
      type: 'calendar',
      enabled: true,
      lastTriggered: '1 hour ago',
      action: 'Prepare briefing',
    },
    {
      id: '4',
      name: 'Arrived at Office',
      type: 'location',
      enabled: false,
      action: 'Start work mode',
    },
    {
      id: '5',
      name: 'Focus Time Block',
      type: 'time',
      enabled: true,
      lastTriggered: '3 hours ago',
      action: 'Enable DND mode',
    },
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'arrow.up.right';
      case 'down':
        return 'arrow.down.right';
      default:
        return 'arrow.right';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return colors.accent;
      case 'down':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'energetic':
        return 'bolt.fill';
      case 'focused':
        return 'target';
      case 'stressed':
        return 'exclamationmark.triangle.fill';
      case 'relaxed':
        return 'leaf.fill';
      default:
        return 'face.smiling';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'energetic':
        return colors.warning;
      case 'focused':
        return colors.primary;
      case 'stressed':
        return colors.error;
      case 'relaxed':
        return colors.accent;
      default:
        return colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'device':
        return 'iphone';
      case 'email':
        return 'envelope.fill';
      case 'calendar':
        return 'calendar';
      case 'location':
        return 'location.fill';
      case 'time':
        return 'clock.fill';
      default:
        return 'bell.fill';
    }
  };

  const toggleTrigger = (id: string) => {
    setEventTriggers(prev =>
      prev.map(trigger =>
        trigger.id === id ? { ...trigger, enabled: !trigger.enabled } : trigger
      )
    );
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log('Behavior settings')}
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
            title: "Behavior Intelligence",
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
                <Text style={styles.headerTitle}>Behavior Intelligence</Text>
                <Pressable
                  onPress={() => console.log('Behavior settings')}
                  style={styles.headerButton}
                >
                  <IconSymbol name="slider.horizontal.3" color={colors.primary} size={24} />
                </Pressable>
              </View>
            </View>
          )}

          {/* Hero Card */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.heroCard}>
            <View style={styles.heroContent}>
              <View style={styles.heroIcon}>
                <IconSymbol name="brain" size={48} color={colors.primary} />
              </View>
              <Text style={styles.heroTitle}>Digital Body Language</Text>
              <Text style={styles.heroSubtitle}>
                AI learns your habits and adapts decisions automatically
              </Text>
              <View style={styles.heroStats}>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatValue}>94%</Text>
                  <Text style={styles.heroStatLabel}>Accuracy</Text>
                </View>
                <View style={styles.heroDivider} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatValue}>2.5k</Text>
                  <Text style={styles.heroStatLabel}>Patterns</Text>
                </View>
                <View style={styles.heroDivider} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatValue}>30d</Text>
                  <Text style={styles.heroStatLabel}>Learning</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Behavior Metrics Grid */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="chart.bar.fill" color={colors.primary} size={24} />
              <Text style={styles.sectionTitle}>Behavior Metrics</Text>
            </View>
            <View style={styles.metricsGrid}>
              {behaviorMetrics.map((metric, index) => (
                <Animated.View
                  key={metric.id}
                  entering={FadeInUp.delay(300 + index * 100)}
                  style={styles.metricCard}
                >
                  <Pressable
                    onPress={() => console.log('Metric details:', metric.id)}
                    style={styles.metricPressable}
                  >
                    <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
                      <IconSymbol name={metric.icon} size={24} color={metric.color} />
                    </View>
                    <Text style={styles.metricValue}>{metric.value}</Text>
                    <Text style={styles.metricName}>{metric.name}</Text>
                    <View style={styles.metricChange}>
                      <IconSymbol
                        name={getTrendIcon(metric.trend)}
                        size={12}
                        color={getTrendColor(metric.trend)}
                      />
                      <Text style={[styles.metricChangeText, { color: getTrendColor(metric.trend) }]}>
                        {Math.abs(metric.change)}%
                      </Text>
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Activity Patterns */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="clock.arrow.circlepath" color={colors.secondary} size={24} />
              <Text style={styles.sectionTitle}>Time-of-Day Patterns</Text>
            </View>
            {activityPatterns.map((pattern) => (
              <Pressable
                key={pattern.id}
                style={styles.patternCard}
                onPress={() => console.log('Pattern details:', pattern.id)}
              >
                <View style={styles.patternHeader}>
                  <Text style={styles.patternTime}>{pattern.timeOfDay}</Text>
                  <View style={styles.confidenceBadge}>
                    <IconSymbol name="checkmark.seal.fill" size={12} color={colors.accent} />
                    <Text style={styles.confidenceText}>{pattern.confidence}%</Text>
                  </View>
                </View>
                <Text style={styles.patternActivity}>{pattern.activity}</Text>
                <View style={styles.patternStats}>
                  <View style={styles.patternStat}>
                    <IconSymbol name="arrow.clockwise" size={14} color={colors.textSecondary} />
                    <Text style={styles.patternStatText}>{pattern.frequency}% frequency</Text>
                  </View>
                  <View style={styles.patternStat}>
                    <IconSymbol name="timer" size={14} color={colors.textSecondary} />
                    <Text style={styles.patternStatText}>{pattern.duration}</Text>
                  </View>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${pattern.frequency}%`, backgroundColor: colors.primary },
                    ]}
                  />
                </View>
              </Pressable>
            ))}
          </Animated.View>

          {/* Mood Detection */}
          <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="face.smiling" color={colors.accent} size={24} />
              <Text style={styles.sectionTitle}>Mood & Energy Tracking</Text>
            </View>
            <View style={styles.moodTimeline}>
              {moodHistory.map((mood, index) => (
                <View key={mood.id}>
                  {index > 0 && <View style={styles.moodConnector} />}
                  <Pressable
                    style={styles.moodItem}
                    onPress={() => console.log('Mood details:', mood.id)}
                  >
                    <View style={styles.moodTime}>
                      <Text style={styles.moodTimeText}>{mood.timestamp}</Text>
                    </View>
                    <View
                      style={[
                        styles.moodDot,
                        { backgroundColor: getMoodColor(mood.mood) },
                      ]}
                    >
                      <IconSymbol
                        name={getMoodIcon(mood.mood)}
                        size={16}
                        color={colors.card}
                      />
                    </View>
                    <View style={styles.moodContent}>
                      <View style={styles.moodHeader}>
                        <Text style={styles.moodLabel}>
                          {mood.mood.charAt(0).toUpperCase() + mood.mood.slice(1)}
                        </Text>
                        <Text style={styles.moodConfidence}>{mood.confidence}%</Text>
                      </View>
                      <View style={styles.moodTriggers}>
                        {mood.triggers.map((trigger, idx) => (
                          <View key={idx} style={styles.triggerTag}>
                            <Text style={styles.triggerText}>{trigger}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </Pressable>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Event Detection */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="bolt.fill" color={colors.warning} size={24} />
              <Text style={styles.sectionTitle}>Event Triggers</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Automatic actions based on detected events and patterns
            </Text>
            {eventTriggers.map((trigger) => (
              <Pressable
                key={trigger.id}
                style={[
                  styles.triggerCard,
                  !trigger.enabled && styles.triggerCardDisabled,
                ]}
                onPress={() => toggleTrigger(trigger.id)}
              >
                <View style={styles.triggerLeft}>
                  <View
                    style={[
                      styles.triggerIcon,
                      {
                        backgroundColor: trigger.enabled
                          ? colors.primary + '20'
                          : colors.border,
                      },
                    ]}
                  >
                    <IconSymbol
                      name={getTypeIcon(trigger.type)}
                      size={20}
                      color={trigger.enabled ? colors.primary : colors.textSecondary}
                    />
                  </View>
                  <View style={styles.triggerInfo}>
                    <Text
                      style={[
                        styles.triggerName,
                        !trigger.enabled && styles.triggerNameDisabled,
                      ]}
                    >
                      {trigger.name}
                    </Text>
                    <Text style={styles.triggerAction}>{trigger.action}</Text>
                    {trigger.lastTriggered && (
                      <Text style={styles.triggerLast}>Last: {trigger.lastTriggered}</Text>
                    )}
                  </View>
                </View>
                <View
                  style={[
                    styles.triggerToggle,
                    trigger.enabled && styles.triggerToggleActive,
                  ]}
                >
                  <View
                    style={[
                      styles.triggerToggleKnob,
                      trigger.enabled && styles.triggerToggleKnobActive,
                    ]}
                  />
                </View>
              </Pressable>
            ))}
          </Animated.View>

          {/* ML Pipeline Status */}
          <Animated.View entering={FadeInDown.delay(700)} style={styles.section}>
            <View style={styles.mlCard}>
              <View style={styles.mlHeader}>
                <IconSymbol name="cpu" size={32} color={colors.primary} />
                <Text style={styles.mlTitle}>Machine Learning Pipeline</Text>
              </View>
              <Text style={styles.mlDescription}>
                Lightweight models continuously analyze your patterns to predict intent and optimize your workflow.
              </Text>
              <View style={styles.mlStats}>
                <View style={styles.mlStat}>
                  <Text style={styles.mlStatLabel}>Model Accuracy</Text>
                  <Text style={styles.mlStatValue}>94.2%</Text>
                </View>
                <View style={styles.mlStat}>
                  <Text style={styles.mlStatLabel}>Training Data</Text>
                  <Text style={styles.mlStatValue}>2,547 points</Text>
                </View>
                <View style={styles.mlStat}>
                  <Text style={styles.mlStatLabel}>Last Updated</Text>
                  <Text style={styles.mlStatValue}>2 hours ago</Text>
                </View>
              </View>
              <Pressable
                style={styles.mlButton}
                onPress={() => console.log('View ML details')}
              >
                <Text style={styles.mlButtonText}>View Training Details</Text>
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
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  heroStat: {
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  heroStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  heroDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
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
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: (width - 44) / 2,
    backgroundColor: colors.card,
    borderRadius: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  metricPressable: {
    padding: 16,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  metricName: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricChangeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  patternCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  patternTime: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accent,
  },
  patternActivity: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  patternStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  patternStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  patternStatText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  moodTimeline: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  moodItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  moodTime: {
    width: 70,
    paddingTop: 8,
  },
  moodTimeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  moodDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodContent: {
    flex: 1,
    paddingBottom: 16,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  moodConfidence: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  moodTriggers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  triggerTag: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  triggerText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  moodConnector: {
    width: 2,
    height: 16,
    backgroundColor: colors.border,
    marginLeft: 85,
  },
  triggerCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  triggerCardDisabled: {
    opacity: 0.6,
  },
  triggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  triggerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triggerInfo: {
    flex: 1,
  },
  triggerName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  triggerNameDisabled: {
    color: colors.textSecondary,
  },
  triggerAction: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  triggerLast: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  triggerToggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  triggerToggleActive: {
    backgroundColor: colors.primary,
  },
  triggerToggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  triggerToggleKnobActive: {
    transform: [{ translateX: 20 }],
  },
  mlCard: {
    backgroundColor: colors.primary + '10',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  mlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  mlTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  mlDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  mlStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mlStat: {
    flex: 1,
  },
  mlStatLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  mlStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  mlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
  },
  mlButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  bottomPadding: {
    height: 100,
  },
});
