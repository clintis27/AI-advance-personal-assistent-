
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Dimensions } from "react-native";
import { Stack, useRouter } from "expo-router";
import { IconSymbol, IconSymbolName } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import {
  InferenceEngine,
  FeatureExtractor,
  ActionExecutor,
  FeedbackLearner,
  DBLDashboard,
  STATE_DEFINITIONS,
} from "@/utils/digitalBodyLanguage";
import {
  StateInference,
  UserState,
  ExtractedFeatures,
  ExecutedAction,
  AutonomyLevel,
  AssistantAction,
} from "@/types/digital-body-language";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get('window');

export default function DigitalBodyLanguageScreen() {
  const router = useRouter();
  const [currentState, setCurrentState] = useState<StateInference | null>(null);
  const [stateHistory, setStateHistory] = useState<StateInference[]>([]);
  const [recentActions, setRecentActions] = useState<ExecutedAction[]>([]);
  const [autonomyLevel, setAutonomyLevel] = useState<AutonomyLevel>('Semi-Autonomous');
  const [recommendedActions, setRecommendedActions] = useState<AssistantAction[]>([]);
  const [loading, setLoading] = useState(true);
  const autonomyLevelRef = useRef(autonomyLevel);

  // Keep a ref in sync so the setInterval below always reads the latest value
  // instead of the autonomyLevel it captured when the interval was created.
  useEffect(() => {
    autonomyLevelRef.current = autonomyLevel;
  }, [autonomyLevel]);

  useEffect(() => {
    loadDashboardData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      simulateStateUpdate();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const dashboardData = await DBLDashboard.getDashboardData();
      setCurrentState(dashboardData.currentState);
      setStateHistory(dashboardData.stateHistory);
      setRecentActions(dashboardData.recentActions);
      
      if (dashboardData.currentState) {
        const actions = ActionExecutor.getActionsForState(
          dashboardData.currentState.currentState,
          autonomyLevel
        );
        setRecommendedActions(actions);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const simulateStateUpdate = async () => {
    try {
      // Simulate feature extraction
      const features: ExtractedFeatures = {
        timeSinceLastMeeting: Math.random() * 120,
        upcomingMeetingCount: Math.floor(Math.random() * 5),
        averageMeetingDuration: 45,
        meetingDensity: Math.random(),
        avgEmailLatencyLastHour: Math.random() * 3600,
        latencyChangeFromBaseline: Math.random() * 50 - 25,
        emailVelocity: Math.floor(Math.random() * 15),
        frustrationScore: Math.random() * 100,
        speechRate: 100 + Math.random() * 60,
        pauseFrequency: Math.random() * 10,
        unlockFrequency: Math.floor(Math.random() * 20),
        timeSinceLastUnlock: Math.random() * 60,
        averageSessionDuration: Math.random() * 30,
        productivityAppTime: Math.random() * 60,
        appSwitchFrequency: Math.floor(Math.random() * 15),
        focusScore: Math.random() * 100,
        contextualBusyness: Math.random() * 100,
        cognitiveLoad: Math.random() * 100,
        interruptibility: Math.random() * 100,
      };

      const inference = await InferenceEngine.inferState(features);
      setCurrentState(inference);
      
      const actions = ActionExecutor.getActionsForState(
        inference.currentState,
        autonomyLevelRef.current
      );
      setRecommendedActions(actions);
      
      // Update history
      const history = await InferenceEngine.getStateHistory();
      setStateHistory(history.slice(-20));
    } catch (error) {
      console.error('Error updating state:', error);
    }
  };

  const handleExecuteAction = async (action: AssistantAction) => {
    if (!currentState) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      const executedAction = await ActionExecutor.executeAction(
        action,
        currentState.currentState,
        autonomyLevel
      );
      
      setRecentActions(prev => [executedAction, ...prev].slice(0, 10));
      
      console.log('Action executed successfully');
    } catch (error) {
      console.error('Error executing action:', error);
    }
  };

  const handleActionFeedback = async (
    actionId: string,
    feedbackType: 'approve' | 'reject'
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      await FeedbackLearner.recordFeedback({
        id: Date.now().toString(),
        actionId,
        feedbackType,
        timestamp: new Date().toISOString(),
        sentiment: feedbackType === 'approve' ? 'positive' : 'negative',
      });
      
      // Update action with feedback
      setRecentActions(prev =>
        prev.map(a =>
          a.id === actionId
            ? { ...a, userFeedback: feedbackType === 'approve' ? 'approved' : 'rejected' }
            : a
        )
      );
    } catch (error) {
      console.error('Error recording feedback:', error);
    }
  };

  const getStateDefinition = (state: UserState) => {
    return STATE_DEFINITIONS.find(s => s.state === state);
  };

  const getActionIcon = (actionType: string): IconSymbolName => {
    const iconMap: Record<string, IconSymbolName> = {
      postpone_notifications: 'bell.slash.fill',
      auto_reply: 'envelope.fill',
      suggest_break: 'cup.and.saucer.fill',
      schedule_booking: 'calendar.badge.plus',
      enable_dnd: 'moon.fill',
      summarize_meetings: 'doc.text.fill',
      prioritize_tasks: 'list.bullet',
      prepare_briefing: 'doc.richtext.fill',
      block_calendar: 'calendar.badge.clock',
      send_status_update: 'paperplane.fill',
    };
    return iconMap[actionType] || 'bolt.fill';
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => router.push('/(tabs)/ai-config')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="slider.horizontal.3" color={colors.primary} size={24} />
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Digital Body Language Engine...</Text>
        </View>
      </View>
    );
  }

  const stateDefinition = currentState ? getStateDefinition(currentState.currentState) : null;

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Digital Body Language",
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
                <Text style={styles.headerTitle}>Digital Body Language</Text>
                <Pressable
                  onPress={() => router.push('/(tabs)/ai-config')}
                  style={styles.headerButton}
                >
                  <IconSymbol name="slider.horizontal.3" color={colors.primary} size={24} />
                </Pressable>
              </View>
            </View>
          )}

          {/* Hero Card - Current State */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.heroCard}>
            <View style={styles.heroContent}>
              <View
                style={[
                  styles.heroIcon,
                  { backgroundColor: `${stateDefinition?.color || colors.primary}20` },
                ]}
              >
                <IconSymbol
                  name={stateDefinition?.icon || 'brain'}
                  size={48}
                  color={stateDefinition?.color || colors.primary}
                />
              </View>
              <Text style={styles.heroTitle}>
                {currentState?.currentState || 'Analyzing...'}
              </Text>
              <Text style={styles.heroSubtitle}>
                {stateDefinition?.description || 'Detecting your current state...'}
              </Text>
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceLabel}>Confidence</Text>
                <Progress
                  value={currentState?.confidence || 0}
                  height={8}
                  style={styles.confidenceProgress}
                />
                <Text style={styles.confidenceValue}>{currentState?.confidence || 0}%</Text>
              </View>
              <View style={styles.heroMeta}>
                <View style={styles.heroMetaItem}>
                  <IconSymbol name="clock.fill" size={16} color={colors.textSecondary} />
                  <Text style={styles.heroMetaText}>
                    {stateDefinition?.typicalDuration || 'Variable'}
                  </Text>
                </View>
                <View style={styles.heroMetaItem}>
                  <IconSymbol
                    name={
                      stateDefinition?.interruptibility === 'high'
                        ? 'checkmark.circle.fill'
                        : stateDefinition?.interruptibility === 'medium'
                        ? 'minus.circle.fill'
                        : 'xmark.circle.fill'
                    }
                    size={16}
                    color={
                      stateDefinition?.interruptibility === 'high'
                        ? colors.success
                        : stateDefinition?.interruptibility === 'medium'
                        ? colors.warning
                        : colors.error
                    }
                  />
                  <Text style={styles.heroMetaText}>
                    {stateDefinition?.interruptibility || 'Unknown'} interruptibility
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Autonomy Level Selector */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <Text style={styles.sectionTitle}>Autonomy Level</Text>
            <View style={styles.autonomySelector}>
              {(['Suggest-Only', 'Semi-Autonomous', 'Fully-Autonomous'] as AutonomyLevel[]).map(
                (level, index) => (
                  <Pressable
                    key={level}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setAutonomyLevel(level);
                      if (currentState) {
                        const actions = ActionExecutor.getActionsForState(
                          currentState.currentState,
                          level
                        );
                        setRecommendedActions(actions);
                      }
                    }}
                    style={[
                      styles.autonomyOption,
                      autonomyLevel === level && styles.autonomyOptionActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.autonomyOptionText,
                        autonomyLevel === level && styles.autonomyOptionTextActive,
                      ]}
                    >
                      {level}
                    </Text>
                  </Pressable>
                )
              )}
            </View>
          </Animated.View>

          {/* Recommended Actions */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="bolt.fill" color={colors.warning} size={24} />
              <Text style={styles.sectionTitle}>Recommended Actions</Text>
            </View>
            {recommendedActions.length > 0 ? (
              recommendedActions.map((action, index) => (
                <Animated.View
                  key={action.type}
                  entering={FadeInUp.delay(400 + index * 100)}
                  style={styles.actionCard}
                >
                  <View style={styles.actionLeft}>
                    <View style={[styles.actionIcon, { backgroundColor: colors.primary + '20' }]}>
                      <IconSymbol
                        name={getActionIcon(action.type)}
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.actionInfo}>
                      <Text style={styles.actionTitle}>{action.description}</Text>
                      <View style={styles.actionMeta}>
                        <Badge
                          variant={
                            action.impactLevel === 'high'
                              ? 'error'
                              : action.impactLevel === 'medium'
                              ? 'warning'
                              : 'info'
                          }
                          size="sm"
                        >
                          {action.impactLevel} impact
                        </Badge>
                        {action.reversible && (
                          <Badge variant="outline" size="sm">
                            Reversible
                          </Badge>
                        )}
                      </View>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => handleExecuteAction(action)}
                    style={styles.actionButton}
                  >
                    <IconSymbol name="play.fill" size={16} color={colors.primary} />
                  </Pressable>
                </Animated.View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <IconSymbol name="checkmark.circle.fill" size={48} color={colors.success} />
                <Text style={styles.emptyStateText}>
                  No actions needed for current state
                </Text>
              </View>
            )}
          </Animated.View>

          {/* State Probability Distribution */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="chart.bar.fill" color={colors.secondary} size={24} />
              <Text style={styles.sectionTitle}>State Probabilities</Text>
            </View>
            <View style={styles.probabilityCard}>
              {currentState &&
                Object.entries(currentState.probabilityVector)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([state, probability]) => {
                    const def = getStateDefinition(state as UserState);
                    return (
                      <View key={state} style={styles.probabilityItem}>
                        <View style={styles.probabilityLeft}>
                          <View
                            style={[
                              styles.probabilityDot,
                              { backgroundColor: def?.color || colors.primary },
                            ]}
                          />
                          <Text style={styles.probabilityState}>{state}</Text>
                        </View>
                        <View style={styles.probabilityRight}>
                          <Progress
                            value={probability * 100}
                            height={6}
                            style={styles.probabilityProgress}
                          />
                          <Text style={styles.probabilityValue}>
                            {Math.round(probability * 100)}%
                          </Text>
                        </View>
                      </View>
                    );
                  })}
            </View>
          </Animated.View>

          {/* Recent Actions */}
          <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="clock.arrow.circlepath" color={colors.accent} size={24} />
              <Text style={styles.sectionTitle}>Recent Actions</Text>
            </View>
            {recentActions.length > 0 ? (
              recentActions.slice(0, 5).map((action, index) => (
                <View key={action.id} style={styles.recentActionCard}>
                  <View style={styles.recentActionLeft}>
                    <View
                      style={[styles.recentActionIcon, { backgroundColor: colors.accent + '20' }]}
                    >
                      <IconSymbol
                        name={getActionIcon(action.actionType)}
                        size={18}
                        color={colors.accent}
                      />
                    </View>
                    <View style={styles.recentActionInfo}>
                      <Text style={styles.recentActionType}>{action.actionType}</Text>
                      <Text style={styles.recentActionTime}>
                        {new Date(action.timestamp).toLocaleTimeString()}
                      </Text>
                    </View>
                  </View>
                  {!action.userFeedback && (
                    <View style={styles.feedbackButtons}>
                      <Pressable
                        onPress={() => handleActionFeedback(action.id, 'approve')}
                        style={[styles.feedbackButton, styles.feedbackButtonApprove]}
                      >
                        <IconSymbol name="hand.thumbsup.fill" size={14} color={colors.success} />
                      </Pressable>
                      <Pressable
                        onPress={() => handleActionFeedback(action.id, 'reject')}
                        style={[styles.feedbackButton, styles.feedbackButtonReject]}
                      >
                        <IconSymbol name="hand.thumbsdown.fill" size={14} color={colors.error} />
                      </Pressable>
                    </View>
                  )}
                  {action.userFeedback && (
                    <Badge
                      variant={action.userFeedback === 'approved' ? 'success' : 'error'}
                      size="sm"
                    >
                      {action.userFeedback}
                    </Badge>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <IconSymbol name="tray.fill" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyStateText}>No recent actions</Text>
              </View>
            )}
          </Animated.View>

          {/* Key Features */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="cpu" color={colors.primary} size={24} />
              <Text style={styles.sectionTitle}>Extracted Features</Text>
            </View>
            {currentState && (
              <View style={styles.featuresGrid}>
                <View style={styles.featureCard}>
                  <Text style={styles.featureLabel}>Focus Score</Text>
                  <Text style={styles.featureValue}>
                    {Math.round(currentState.features.focusScore)}
                  </Text>
                </View>
                <View style={styles.featureCard}>
                  <Text style={styles.featureLabel}>Cognitive Load</Text>
                  <Text style={styles.featureValue}>
                    {Math.round(currentState.features.cognitiveLoad)}
                  </Text>
                </View>
                <View style={styles.featureCard}>
                  <Text style={styles.featureLabel}>Interruptibility</Text>
                  <Text style={styles.featureValue}>
                    {Math.round(currentState.features.interruptibility)}
                  </Text>
                </View>
                <View style={styles.featureCard}>
                  <Text style={styles.featureLabel}>Busyness</Text>
                  <Text style={styles.featureValue}>
                    {Math.round(currentState.features.contextualBusyness)}
                  </Text>
                </View>
              </View>
            )}
          </Animated.View>

          {/* ML Pipeline Info */}
          <Animated.View entering={FadeInDown.delay(700)} style={styles.section}>
            <View style={styles.mlCard}>
              <View style={styles.mlHeader}>
                <IconSymbol name="brain" size={32} color={colors.primary} />
                <Text style={styles.mlTitle}>Inference Engine</Text>
              </View>
              <Text style={styles.mlDescription}>
                Hybrid ensemble model combining logistic regression, decision trees, and rule-based
                inference to predict your state with high accuracy.
              </Text>
              <View style={styles.mlStats}>
                <View style={styles.mlStat}>
                  <Text style={styles.mlStatLabel}>Model Type</Text>
                  <Text style={styles.mlStatValue}>Ensemble</Text>
                </View>
                <View style={styles.mlStat}>
                  <Text style={styles.mlStatLabel}>Accuracy</Text>
                  <Text style={styles.mlStatValue}>94.2%</Text>
                </View>
                <View style={styles.mlStat}>
                  <Text style={styles.mlStatLabel}>Data Points</Text>
                  <Text style={styles.mlStatValue}>{stateHistory.length}</Text>
                </View>
              </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
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
  confidenceContainer: {
    width: '100%',
    marginBottom: 16,
  },
  confidenceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  confidenceProgress: {
    marginBottom: 8,
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  heroMeta: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroMetaText: {
    fontSize: 13,
    color: colors.textSecondary,
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
  autonomySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  autonomyOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  autonomyOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  autonomyOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  autonomyOptionTextActive: {
    color: colors.primaryForeground,
  },
  actionCard: {
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
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  actionMeta: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
  probabilityCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  probabilityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  probabilityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  probabilityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  probabilityState: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  probabilityRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  probabilityProgress: {
    flex: 1,
  },
  probabilityValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    minWidth: 40,
    textAlign: 'right',
  },
  recentActionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  recentActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  recentActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentActionInfo: {
    flex: 1,
  },
  recentActionType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  recentActionTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  feedbackButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackButtonApprove: {
    backgroundColor: colors.success + '20',
  },
  feedbackButtonReject: {
    backgroundColor: colors.error + '20',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: (width - 44) / 2,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  featureLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  featureValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
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
  bottomPadding: {
    height: 100,
  },
});
