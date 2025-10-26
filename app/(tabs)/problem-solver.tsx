
/**
 * AI Problem-Solving Engine
 * 
 * FEATURES:
 * - Analyze tasks, messages, and project descriptions to detect issues
 * - Generate contextual solutions with impact scores
 * - Suggest alternate approaches ranked by effort and impact
 * - Integrate with productivity tools (Notion, Trello, Asana, ClickUp, Jira)
 * - Learn from user feedback to adapt recommendations
 * - Output structured recommendations (summary + action list + impact score)
 * 
 * INTEGRATION POINTS:
 * - Email/Calendar: Auto-detect problems from incoming messages
 * - Task Managers: Log action items and track execution
 * - AI/ML Services: Connect to OpenAI, Claude, or custom models for analysis
 * - User Feedback: Track helpful/not helpful to improve suggestions
 * 
 * WORKFLOW:
 * 1. User inputs problem text or system auto-detects from integrations
 * 2. AI analyzes text to extract: objective, deadline, blockers
 * 3. System retrieves context from past tasks and similar issues
 * 4. AI generates multiple solution approaches
 * 5. Solutions ranked by impact score and effort level
 * 6. User selects solution and provides feedback
 * 7. System logs action to connected productivity tools
 * 
 * FUTURE ENHANCEMENTS:
 * - Real-time problem detection from email/calendar
 * - Automatic execution of low-risk solutions
 * - Integration with more productivity tools
 * - Advanced ML model for better solution generation
 * - Collaborative problem-solving with team members
 */

import { colors } from "@/styles/commonStyles";
import React, { useState } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { IconSymbol } from "@/components/IconSymbol";
import { Stack } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, TextInput } from "react-native";

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
  icon: string;
  connected: boolean;
  color: string;
}

export default function ProblemSolverScreen() {
  const [activeTab, setActiveTab] = useState<'problems' | 'solutions' | 'integrations'>('problems');
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const [problems] = useState<Problem[]>([
    {
      id: '1',
      title: 'Client report missing Q3 data',
      description: 'We need to deliver the client report by Friday, but half the data is missing.',
      detectedFrom: 'email',
      timestamp: '2 hours ago',
      status: 'new',
      blockers: ['Missing Q3 sales data', 'Finance team not responding', 'Incomplete projections'],
      deadline: 'Friday, 3:00 PM',
    },
    {
      id: '2',
      title: 'Project deadline conflict',
      description: 'Two major projects have overlapping deadlines next week.',
      detectedFrom: 'task',
      timestamp: '5 hours ago',
      status: 'analyzing',
      blockers: ['Limited team resources', 'Client expectations', 'Technical dependencies'],
      deadline: 'Next Monday',
    },
    {
      id: '3',
      title: 'Meeting scheduling conflict',
      description: 'Three important meetings scheduled at the same time tomorrow.',
      detectedFrom: 'calendar',
      timestamp: '1 day ago',
      status: 'solved',
      blockers: ['Timezone confusion', 'Double booking'],
      deadline: 'Tomorrow, 10:00 AM',
    },
  ]);

  const [solutions] = useState<Solution[]>([
    {
      id: '1',
      problemId: '1',
      title: 'Pull data from CRM',
      description: 'Extract the last 3 months of sales data directly from the CRM system.',
      impact: 'high',
      effort: 'low',
      impactScore: 92,
      steps: [
        'Access CRM dashboard',
        'Export Q3 sales report',
        'Validate data completeness',
        'Import into client report template',
      ],
      estimatedTime: '30 minutes',
      helpful: undefined,
    },
    {
      id: '2',
      problemId: '1',
      title: 'Request data from finance team',
      description: 'Send automated follow-up request to finance team with deadline.',
      impact: 'high',
      effort: 'low',
      impactScore: 85,
      steps: [
        'Draft urgent request email',
        'CC relevant stakeholders',
        'Set follow-up reminder',
        'Prepare backup plan',
      ],
      estimatedTime: '15 minutes',
      helpful: undefined,
    },
    {
      id: '3',
      problemId: '1',
      title: 'Generate estimates from projections',
      description: 'Use historical data and current projections to estimate missing values.',
      impact: 'medium',
      effort: 'medium',
      impactScore: 70,
      steps: [
        'Analyze historical trends',
        'Apply growth projections',
        'Calculate estimates',
        'Add disclaimer note',
      ],
      estimatedTime: '1 hour',
      helpful: undefined,
    },
  ]);

  const [integrations] = useState<Integration[]>([
    { id: '1', name: 'Notion', icon: 'doc.text.fill', connected: true, color: colors.text },
    { id: '2', name: 'Trello', icon: 'square.grid.2x2.fill', connected: true, color: '#0079BF' },
    { id: '3', name: 'Asana', icon: 'checkmark.circle.fill', connected: false, color: '#F06A6A' },
    { id: '4', name: 'ClickUp', icon: 'square.stack.3d.up.fill', connected: false, color: '#7B68EE' },
    { id: '5', name: 'Jira', icon: 'list.bullet.rectangle', connected: true, color: '#0052CC' },
  ]);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'email': return 'envelope.fill';
      case 'task': return 'checkmark.circle.fill';
      case 'message': return 'message.fill';
      case 'calendar': return 'calendar';
      default: return 'doc.text.fill';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'email': return colors.accent;
      case 'task': return colors.primary;
      case 'message': return colors.secondary;
      case 'calendar': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return colors.error;
      case 'analyzing': return colors.warning;
      case 'solved': return colors.success;
      case 'dismissed': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return colors.success;
      case 'medium': return colors.warning;
      case 'low': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    
    setAnalyzing(true);
    console.log('Analyzing problem:', inputText);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalyzing(false);
      setInputText('');
      console.log('Analysis complete');
    }, 2000);
  };

  const handleSolutionFeedback = (solutionId: string, helpful: boolean) => {
    console.log(`Solution ${solutionId} marked as ${helpful ? 'helpful' : 'not helpful'}`);
    // Update solution feedback state
  };

  const handleExecuteSolution = (solution: Solution) => {
    console.log('Executing solution:', solution.title);
    // Navigate to integration or execute action
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log('Open problem solver settings')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="gear" color={colors.primary} size={24} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Problem Solver",
            headerRight: renderHeaderRight,
          }}
        />
      )}
      <View style={styles.container}>
        {/* Header for Android/Web */}
        {Platform.OS !== 'ios' && (
          <View style={styles.headerContainer}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>Problem Solver</Text>
              <Pressable
                onPress={() => console.log('Open problem solver settings')}
                style={styles.headerButton}
              >
                <IconSymbol name="gear" color={colors.primary} size={24} />
              </Pressable>
            </View>
          </View>
        )}

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'problems' && styles.activeTab]}
            onPress={() => setActiveTab('problems')}
          >
            <IconSymbol 
              name="exclamationmark.triangle.fill" 
              size={20} 
              color={activeTab === 'problems' ? colors.primary : colors.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'problems' && styles.activeTabText]}>
              Problems
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'solutions' && styles.activeTab]}
            onPress={() => setActiveTab('solutions')}
          >
            <IconSymbol 
              name="lightbulb.fill" 
              size={20} 
              color={activeTab === 'solutions' ? colors.primary : colors.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'solutions' && styles.activeTabText]}>
              Solutions
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'integrations' && styles.activeTab]}
            onPress={() => setActiveTab('integrations')}
          >
            <IconSymbol 
              name="link.circle.fill" 
              size={20} 
              color={activeTab === 'integrations' ? colors.primary : colors.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'integrations' && styles.activeTabText]}>
              Tools
            </Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Input Section */}
          {activeTab === 'problems' && (
            <Animated.View entering={FadeInDown.delay(100)} style={styles.inputSection}>
              <View style={styles.inputHeader}>
                <IconSymbol name="brain" color={colors.secondary} size={24} />
                <Text style={styles.inputTitle}>Describe a Problem</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Paste an email, task, or describe an issue..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                value={inputText}
                onChangeText={setInputText}
              />
              <Pressable
                style={[styles.analyzeButton, analyzing && styles.analyzingButton]}
                onPress={handleAnalyze}
                disabled={analyzing || !inputText.trim()}
              >
                {analyzing ? (
                  <>
                    <IconSymbol name="arrow.triangle.2.circlepath" size={20} color={colors.card} />
                    <Text style={styles.analyzeButtonText}>Analyzing...</Text>
                  </>
                ) : (
                  <>
                    <IconSymbol name="sparkles" size={20} color={colors.card} />
                    <Text style={styles.analyzeButtonText}>Analyze Problem</Text>
                  </>
                )}
              </Pressable>
            </Animated.View>
          )}

          {/* Problems Tab */}
          {activeTab === 'problems' && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Detected Issues</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{problems.filter(p => p.status === 'new').length}</Text>
                </View>
              </View>

              {problems.map((problem, index) => (
                <Animated.View
                  key={problem.id}
                  entering={FadeInDown.delay(200 + index * 100)}
                >
                  <Pressable
                    style={styles.card}
                    onPress={() => console.log('Problem pressed:', problem.title)}
                  >
                    <View style={styles.problemHeader}>
                      <View style={styles.problemTitleRow}>
                        <View style={[styles.sourceIcon, { backgroundColor: getSourceColor(problem.detectedFrom) + '20' }]}>
                          <IconSymbol name={getSourceIcon(problem.detectedFrom)} size={16} color={getSourceColor(problem.detectedFrom)} />
                        </View>
                        <Text style={styles.problemTitle}>{problem.title}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(problem.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(problem.status) }]}>
                          {problem.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.problemDescription}>{problem.description}</Text>

                    {problem.blockers.length > 0 && (
                      <View style={styles.blockersSection}>
                        <Text style={styles.blockersTitle}>Blockers:</Text>
                        {problem.blockers.map((blocker, idx) => (
                          <View key={idx} style={styles.blockerItem}>
                            <View style={styles.blockerDot} />
                            <Text style={styles.blockerText}>{blocker}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <View style={styles.problemFooter}>
                      <View style={styles.timeContainer}>
                        <IconSymbol name="clock" color={colors.textSecondary} size={14} />
                        <Text style={styles.timeText}>{problem.timestamp}</Text>
                      </View>
                      {problem.deadline && (
                        <View style={styles.deadlineContainer}>
                          <IconSymbol name="calendar.badge.exclamationmark" color={colors.error} size={14} />
                          <Text style={styles.deadlineText}>{problem.deadline}</Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
            </>
          )}

          {/* Solutions Tab */}
          {activeTab === 'solutions' && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommended Solutions</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{solutions.length}</Text>
                </View>
              </View>

              {solutions.map((solution, index) => (
                <Animated.View
                  key={solution.id}
                  entering={FadeInDown.delay(100 + index * 100)}
                >
                  <View style={styles.card}>
                    <View style={styles.solutionHeader}>
                      <Text style={styles.solutionTitle}>{solution.title}</Text>
                      <View style={styles.impactScoreBadge}>
                        <Text style={styles.impactScoreText}>{solution.impactScore}</Text>
                      </View>
                    </View>

                    <Text style={styles.solutionDescription}>{solution.description}</Text>

                    <View style={styles.metricsRow}>
                      <View style={styles.metric}>
                        <Text style={styles.metricLabel}>Impact</Text>
                        <View style={[styles.metricBadge, { backgroundColor: getImpactColor(solution.impact) + '20' }]}>
                          <Text style={[styles.metricValue, { color: getImpactColor(solution.impact) }]}>
                            {solution.impact}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.metric}>
                        <Text style={styles.metricLabel}>Effort</Text>
                        <View style={[styles.metricBadge, { backgroundColor: getEffortColor(solution.effort) + '20' }]}>
                          <Text style={[styles.metricValue, { color: getEffortColor(solution.effort) }]}>
                            {solution.effort}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.metric}>
                        <Text style={styles.metricLabel}>Time</Text>
                        <Text style={styles.metricValue}>{solution.estimatedTime}</Text>
                      </View>
                    </View>

                    <View style={styles.stepsSection}>
                      <Text style={styles.stepsTitle}>Action Steps:</Text>
                      {solution.steps.map((step, idx) => (
                        <View key={idx} style={styles.stepItem}>
                          <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>{idx + 1}</Text>
                          </View>
                          <Text style={styles.stepText}>{step}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.solutionActions}>
                      <Pressable
                        style={styles.executeButton}
                        onPress={() => handleExecuteSolution(solution)}
                      >
                        <IconSymbol name="play.fill" size={16} color={colors.card} />
                        <Text style={styles.executeButtonText}>Execute</Text>
                      </Pressable>
                      <View style={styles.feedbackButtons}>
                        <Pressable
                          style={[styles.feedbackButton, solution.helpful === true && styles.feedbackButtonActive]}
                          onPress={() => handleSolutionFeedback(solution.id, true)}
                        >
                          <IconSymbol name="hand.thumbsup.fill" size={16} color={solution.helpful === true ? colors.success : colors.textSecondary} />
                        </Pressable>
                        <Pressable
                          style={[styles.feedbackButton, solution.helpful === false && styles.feedbackButtonActive]}
                          onPress={() => handleSolutionFeedback(solution.id, false)}
                        >
                          <IconSymbol name="hand.thumbsdown.fill" size={16} color={solution.helpful === false ? colors.error : colors.textSecondary} />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Productivity Tools</Text>
              </View>

              <Animated.View entering={FadeInDown.delay(100)} style={styles.infoCard}>
                <IconSymbol name="info.circle.fill" size={24} color={colors.info} />
                <Text style={styles.infoText}>
                  Connect your productivity tools to automatically log and execute action items from AI-generated solutions.
                </Text>
              </Animated.View>

              {integrations.map((integration, index) => (
                <Animated.View
                  key={integration.id}
                  entering={FadeInDown.delay(200 + index * 100)}
                >
                  <Pressable
                    style={styles.integrationCard}
                    onPress={() => console.log('Toggle integration:', integration.name)}
                  >
                    <View style={styles.integrationLeft}>
                      <View style={[styles.integrationIcon, { backgroundColor: integration.color + '20' }]}>
                        <IconSymbol name={integration.icon} size={24} color={integration.color} />
                      </View>
                      <View style={styles.integrationInfo}>
                        <Text style={styles.integrationName}>{integration.name}</Text>
                        <Text style={styles.integrationStatus}>
                          {integration.connected ? 'Connected' : 'Not connected'}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.connectionIndicator, { backgroundColor: integration.connected ? colors.success : colors.textSecondary }]} />
                  </Pressable>
                </Animated.View>
              ))}

              <Animated.View entering={FadeInDown.delay(700)} style={styles.addIntegrationCard}>
                <IconSymbol name="plus.circle.fill" size={32} color={colors.primary} />
                <Text style={styles.addIntegrationText}>Add More Tools</Text>
              </Animated.View>
            </>
          )}

          {/* Bottom padding for floating tab bar */}
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
    paddingTop: 16,
  },
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 4,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: colors.primary + '15',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  inputSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  analyzeButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  analyzingButton: {
    opacity: 0.7,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.card,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  problemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  problemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  sourceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  problemTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  problemDescription: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  blockersSection: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  blockersTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  blockerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  blockerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.error,
  },
  blockerText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  problemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deadlineText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  solutionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  solutionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  impactScoreBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 44,
    alignItems: 'center',
  },
  impactScoreText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.card,
  },
  solutionDescription: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  metricBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  stepsSection: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  stepsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.card,
  },
  stepText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
  solutionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  executeButton: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  executeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.card,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  feedbackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackButtonActive: {
    backgroundColor: colors.highlight,
  },
  infoCard: {
    backgroundColor: colors.info + '15',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  integrationCard: {
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
  integrationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  integrationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  integrationInfo: {
    flex: 1,
  },
  integrationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  integrationStatus: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  connectionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  addIntegrationCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  addIntegrationText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 8,
  },
  bottomPadding: {
    height: 100,
  },
});
