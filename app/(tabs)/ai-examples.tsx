
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '@/styles/commonStyles';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { IconSymbol } from '@/components/IconSymbol';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useLangChain } from '@/hooks/useLangChain';
import { usePinecone } from '@/hooks/usePinecone';

/**
 * AI Examples Screen
 * Demonstrates how to use the AI hooks with real examples
 */
export default function AIExamplesScreen() {
  const theme = useTheme();
  const openai = useOpenAI();
  const langchain = useLangChain();
  const pinecone = usePinecone();

  // OpenAI examples
  const [openaiPrompt, setOpenaiPrompt] = useState('');
  const [openaiResult, setOpenaiResult] = useState('');

  // LangChain examples
  const [langchainInput, setLangchainInput] = useState('');
  const [langchainResult, setLangchainResult] = useState('');

  // Pinecone examples
  const [pineconeQuery, setPineconeQuery] = useState('');
  const [pineconeResults, setPineconeResults] = useState<any[]>([]);

  /**
   * Example 1: Simple text completion
   */
  const handleSimpleCompletion = async () => {
    if (!openaiPrompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt');
      return;
    }

    const result = await openai.generateCompletion({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: openaiPrompt },
      ],
      temperature: 0.7,
    });

    if (result) {
      setOpenaiResult(result.content);
    } else if (openai.error) {
      Alert.alert('Error', openai.error);
    }
  };

  /**
   * Example 2: Problem solving
   */
  const handleProblemSolving = async () => {
    const problem = 'I need to improve my productivity but I keep getting distracted by notifications.';
    
    const result = await openai.generateSolutions(problem);

    if (result) {
      setOpenaiResult(result.content);
    } else if (openai.error) {
      Alert.alert('Error', openai.error);
    }
  };

  /**
   * Example 3: Travel intent detection
   */
  const handleTravelIntent = async () => {
    const emailText = 'I need to fly to New York next week for a business meeting on Tuesday.';
    
    const result = await openai.detectTravelIntent(emailText);

    if (result) {
      setOpenaiResult(result.content);
    } else if (openai.error) {
      Alert.alert('Error', openai.error);
    }
  };

  /**
   * Example 4: Email response generation
   */
  const handleEmailResponse = async () => {
    const email = 'Hi, I wanted to follow up on our meeting last week. Can we schedule a call to discuss the project timeline?';
    
    const result = await openai.generateEmailResponse(email, 'professional');

    if (result) {
      setOpenaiResult(result.content);
    } else if (openai.error) {
      Alert.alert('Error', openai.error);
    }
  };

  /**
   * Example 5: LangChain agent execution
   */
  const handleAgentExecution = async () => {
    if (!langchainInput.trim()) {
      Alert.alert('Error', 'Please enter an input');
      return;
    }

    const result = await langchain.executeAgent({
      agentId: 'task-automation',
      input: langchainInput,
      tools: ['calendar', 'email', 'search'],
    });

    if (result) {
      setLangchainResult(result.output);
    } else if (langchain.error) {
      Alert.alert('Error', langchain.error);
    }
  };

  /**
   * Example 6: Pinecone semantic search
   */
  const handleSemanticSearch = async () => {
    if (!pineconeQuery.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return;
    }

    const results = await pinecone.search({
      query: pineconeQuery,
      topK: 5,
    });

    if (results) {
      setPineconeResults(results);
    } else if (pinecone.error) {
      Alert.alert('Error', pinecone.error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'AI Examples',
          headerStyle: {
            backgroundColor: theme.dark ? colors.backgroundDark : colors.background,
          },
          headerTintColor: theme.dark ? colors.textDark : colors.text,
        }}
      />
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: theme.dark ? colors.backgroundDark : colors.background },
        ]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <IconSymbol name="brain" size={48} color={colors.primary} />
          <Text style={[styles.title, { color: theme.dark ? colors.textDark : colors.text }]}>
            AI Integration Examples
          </Text>
          <Text style={[styles.subtitle, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
            Learn how to use OpenAI, LangChain, and Pinecone
          </Text>
        </Animated.View>

        {/* OpenAI Examples */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="sparkles" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              OpenAI GPT Examples
            </Text>
          </View>

          {/* Example 1: Simple Completion */}
          <Card variant="compact">
            <Text style={[styles.exampleTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              1. Simple Text Completion
            </Text>
            <Text style={[styles.exampleDescription, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              Enter any prompt and get an AI response
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.dark ? colors.backgroundSecondaryDark : colors.backgroundSecondary,
                  color: theme.dark ? colors.textDark : colors.text,
                  borderColor: theme.dark ? colors.borderDark : colors.border,
                },
              ]}
              placeholder="Enter your prompt..."
              placeholderTextColor={theme.dark ? colors.textMutedDark : colors.textMuted}
              value={openaiPrompt}
              onChangeText={setOpenaiPrompt}
              multiline
            />
            <Button
              variant="primary"
              onPress={handleSimpleCompletion}
              disabled={openai.loading}
              style={styles.button}
            >
              {openai.loading ? 'Generating...' : 'Generate Response'}
            </Button>
          </Card>

          {/* Example 2: Problem Solving */}
          <Card variant="compact">
            <Text style={[styles.exampleTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              2. Problem Solving
            </Text>
            <Text style={[styles.exampleDescription, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              Get AI-powered solutions to problems
            </Text>
            <Button
              variant="outline"
              onPress={handleProblemSolving}
              disabled={openai.loading}
            >
              Solve Example Problem
            </Button>
          </Card>

          {/* Example 3: Travel Intent */}
          <Card variant="compact">
            <Text style={[styles.exampleTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              3. Travel Intent Detection
            </Text>
            <Text style={[styles.exampleDescription, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              Extract travel information from text
            </Text>
            <Button
              variant="outline"
              onPress={handleTravelIntent}
              disabled={openai.loading}
            >
              Detect Travel Intent
            </Button>
          </Card>

          {/* Example 4: Email Response */}
          <Card variant="compact">
            <Text style={[styles.exampleTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              4. Email Response Generation
            </Text>
            <Text style={[styles.exampleDescription, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              Generate professional email responses
            </Text>
            <Button
              variant="outline"
              onPress={handleEmailResponse}
              disabled={openai.loading}
            >
              Generate Email Response
            </Button>
          </Card>

          {/* OpenAI Result */}
          {openai.loading && (
            <View style={styles.loadingContainer}>
              <LoadingSpinner size={30} />
              <Text style={[styles.loadingText, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                Generating response...
              </Text>
            </View>
          )}

          {openaiResult && (
            <Card variant="elevated">
              <View style={styles.resultHeader}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                <Text style={[styles.resultLabel, { color: theme.dark ? colors.textDark : colors.text }]}>
                  AI Response
                </Text>
              </View>
              <Text style={[styles.resultText, { color: theme.dark ? colors.textDark : colors.text }]}>
                {openaiResult}
              </Text>
              {openai.data?.usage && (
                <View style={styles.usageInfo}>
                  <Badge variant="outline" size="sm">
                    {openai.data.usage.totalTokens} tokens
                  </Badge>
                  <Badge variant="outline" size="sm">
                    {openai.data.model}
                  </Badge>
                </View>
              )}
            </Card>
          )}
        </Animated.View>

        <Separator />

        {/* LangChain Examples */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="link" size={24} color={colors.violet} />
            <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              LangChain Agent Examples
            </Text>
          </View>

          <Card variant="compact">
            <Text style={[styles.exampleTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              5. Agent Execution
            </Text>
            <Text style={[styles.exampleDescription, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              Execute complex tasks with AI agents
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.dark ? colors.backgroundSecondaryDark : colors.backgroundSecondary,
                  color: theme.dark ? colors.textDark : colors.text,
                  borderColor: theme.dark ? colors.borderDark : colors.border,
                },
              ]}
              placeholder="Enter task description..."
              placeholderTextColor={theme.dark ? colors.textMutedDark : colors.textMuted}
              value={langchainInput}
              onChangeText={setLangchainInput}
              multiline
            />
            <Button
              variant="primary"
              onPress={handleAgentExecution}
              disabled={langchain.loading}
            >
              {langchain.loading ? 'Executing...' : 'Execute Agent'}
            </Button>
          </Card>

          {langchain.loading && (
            <View style={styles.loadingContainer}>
              <LoadingSpinner size={30} />
              <Text style={[styles.loadingText, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                Agent working...
              </Text>
            </View>
          )}

          {langchainResult && (
            <Card variant="elevated">
              <View style={styles.resultHeader}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                <Text style={[styles.resultLabel, { color: theme.dark ? colors.textDark : colors.text }]}>
                  Agent Result
                </Text>
              </View>
              <Text style={[styles.resultText, { color: theme.dark ? colors.textDark : colors.text }]}>
                {langchainResult}
              </Text>
            </Card>
          )}
        </Animated.View>

        <Separator />

        {/* Pinecone Examples */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="magnifyingglass" size={24} color={colors.emerald} />
            <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              Pinecone Search Examples
            </Text>
          </View>

          <Card variant="compact">
            <Text style={[styles.exampleTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              6. Semantic Search
            </Text>
            <Text style={[styles.exampleDescription, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              Search for similar documents using AI
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.dark ? colors.backgroundSecondaryDark : colors.backgroundSecondary,
                  color: theme.dark ? colors.textDark : colors.text,
                  borderColor: theme.dark ? colors.borderDark : colors.border,
                },
              ]}
              placeholder="Enter search query..."
              placeholderTextColor={theme.dark ? colors.textMutedDark : colors.textMuted}
              value={pineconeQuery}
              onChangeText={setPineconeQuery}
            />
            <Button
              variant="primary"
              onPress={handleSemanticSearch}
              disabled={pinecone.loading}
            >
              {pinecone.loading ? 'Searching...' : 'Search'}
            </Button>
          </Card>

          {pinecone.loading && (
            <View style={styles.loadingContainer}>
              <LoadingSpinner size={30} />
              <Text style={[styles.loadingText, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                Searching...
              </Text>
            </View>
          )}

          {pineconeResults.length > 0 && (
            <Card variant="elevated">
              <View style={styles.resultHeader}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                <Text style={[styles.resultLabel, { color: theme.dark ? colors.textDark : colors.text }]}>
                  Search Results ({pineconeResults.length})
                </Text>
              </View>
              {pineconeResults.map((result, index) => (
                <View key={result.id} style={styles.searchResult}>
                  <View style={styles.searchResultHeader}>
                    <Text style={[styles.searchResultTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
                      Result {index + 1}
                    </Text>
                    <Badge variant="success" size="sm">
                      {(result.score * 100).toFixed(0)}% match
                    </Badge>
                  </View>
                  <Text style={[styles.searchResultText, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                    {result.text}
                  </Text>
                </View>
              ))}
            </Card>
          )}
        </Animated.View>

        {/* Setup Instructions */}
        <Animated.View entering={FadeInDown.delay(800)} style={styles.section}>
          <Card variant="compact">
            <View style={styles.infoHeader}>
              <IconSymbol name="info.circle.fill" size={24} color={colors.info} />
              <Text style={[styles.infoTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
                Setup Required
              </Text>
            </View>
            <Text style={[styles.infoText, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              To use these AI features, you need to:
            </Text>
            <View style={styles.infoList}>
              <Text style={[styles.infoListItem, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                • Set up a Supabase backend
              </Text>
              <Text style={[styles.infoListItem, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                • Deploy edge functions
              </Text>
              <Text style={[styles.infoListItem, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                • Configure API endpoints in AI Config
              </Text>
              <Text style={[styles.infoListItem, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                • Add your OpenAI API key
              </Text>
            </View>
            <Text style={[styles.infoText, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              See docs/BACKEND_SETUP_GUIDE.md for details.
            </Text>
          </Card>
        </Animated.View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 16,
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: -0.2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  exampleDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    borderWidth: 1,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
  },
  usageInfo: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  searchResult: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  searchResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchResultTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  searchResultText: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoList: {
    marginLeft: 8,
    marginBottom: 12,
  },
  infoListItem: {
    fontSize: 14,
    lineHeight: 24,
  },
});
