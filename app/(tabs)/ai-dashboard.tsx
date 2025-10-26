
/**
 * AI Dashboard Screen
 * Central hub for AI service management and monitoring
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { IconSymbol } from '@/components/IconSymbol';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { colors } from '@/styles/commonStyles';
import { aiService } from '@/services/aiService';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useLangChain } from '@/hooks/useLangChain';
import { usePinecone } from '@/hooks/usePinecone';

interface AIServiceStatus {
  name: string;
  endpoint: keyof typeof aiService.getConfig;
  status: 'online' | 'offline' | 'checking';
  icon: string;
  color: string;
}

export default function AIDashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const openai = useOpenAI();
  const langchain = useLangChain();
  const pinecone = usePinecone();

  const [services, setServices] = useState<AIServiceStatus[]>([
    { name: 'OpenAI GPT', endpoint: 'openaiEndpoint', status: 'checking', icon: 'brain', color: colors.primary },
    { name: 'LangChain', endpoint: 'langchainEndpoint', status: 'checking', icon: 'link', color: colors.violet },
    { name: 'Pinecone', endpoint: 'pineconeEndpoint', status: 'checking', icon: 'database', color: colors.emerald },
    { name: 'Whisper STT', endpoint: 'whisperEndpoint', status: 'checking', icon: 'mic', color: colors.indigo },
    { name: 'ElevenLabs TTS', endpoint: 'elevenLabsEndpoint', status: 'checking', icon: 'speaker.wave.2', color: colors.pink },
  ]);

  const [testPrompt, setTestPrompt] = useState('');
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    checkAllServices();
  }, []);

  const checkAllServices = async () => {
    console.log('Checking all AI services...');
    
    const serviceStatus = await aiService.getServiceStatus();
    
    setServices(prev => prev.map(service => ({
      ...service,
      status: serviceStatus[service.endpoint] ? 'online' : 'offline',
    })));
  };

  const handleTestOpenAI = async () => {
    if (!testPrompt.trim()) {
      Alert.alert('Error', 'Please enter a test prompt');
      return;
    }

    const result = await openai.generateCompletion({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: testPrompt },
      ],
    });

    if (result) {
      setTestResult(result.content);
      Alert.alert('Success', 'OpenAI test completed!');
    } else if (openai.error) {
      Alert.alert('Error', openai.error);
    }
  };

  const getStatusBadgeVariant = (status: string): 'success' | 'error' | 'warning' => {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'error';
      default:
        return 'warning';
    }
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => router.push('/(tabs)/ai-config')}
      style={{ marginRight: 16 }}
    >
      <IconSymbol
        name="gearshape"
        size={24}
        color={theme.dark ? colors.textDark : colors.text}
      />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'AI Dashboard',
          headerRight: renderHeaderRight,
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
          <Text style={[styles.title, { color: theme.dark ? colors.textDark : colors.text }]}>
            AI Service Status
          </Text>
          <Text style={[styles.subtitle, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
            Monitor and test your AI integrations
          </Text>
        </Animated.View>

        {/* Services Status */}
        <View style={styles.section}>
          {services.map((service, index) => (
            <Animated.View key={service.name} entering={FadeInDown.delay(200 + index * 100)}>
              <Card variant="compact">
                <View style={styles.serviceRow}>
                  <View style={[styles.serviceIcon, { backgroundColor: `${service.color}20` }]}>
                    <IconSymbol name={service.icon} size={24} color={service.color} />
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={[styles.serviceName, { color: theme.dark ? colors.textDark : colors.text }]}>
                      {service.name}
                    </Text>
                    <Badge variant={getStatusBadgeVariant(service.status)} size="sm">
                      {service.status}
                    </Badge>
                  </View>
                  <Pressable
                    onPress={() => aiService.testConnection(service.endpoint)}
                    style={styles.testButton}
                  >
                    <IconSymbol
                      name="arrow.clockwise"
                      size={20}
                      color={theme.dark ? colors.textMutedDark : colors.textMuted}
                    />
                  </Pressable>
                </View>
              </Card>
            </Animated.View>
          ))}
        </View>

        <Separator />

        {/* Test OpenAI */}
        <Animated.View entering={FadeInDown.delay(800)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Test OpenAI Integration
          </Text>
          <Card variant="compact">
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.dark ? colors.backgroundSecondaryDark : colors.backgroundSecondary,
                  color: theme.dark ? colors.textDark : colors.text,
                  borderColor: theme.dark ? colors.borderDark : colors.border,
                },
              ]}
              placeholder="Enter a test prompt..."
              placeholderTextColor={theme.dark ? colors.textMutedDark : colors.textMuted}
              value={testPrompt}
              onChangeText={setTestPrompt}
              multiline
              numberOfLines={3}
            />
            <Button
              variant="primary"
              onPress={handleTestOpenAI}
              disabled={openai.loading}
              style={styles.testButton}
            >
              {openai.loading ? 'Testing...' : 'Test OpenAI'}
            </Button>
            {openai.loading && (
              <View style={styles.loadingContainer}>
                <LoadingSpinner size={30} />
              </View>
            )}
            {testResult && (
              <View style={styles.resultContainer}>
                <Text style={[styles.resultLabel, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                  Result:
                </Text>
                <Text style={[styles.resultText, { color: theme.dark ? colors.textDark : colors.text }]}>
                  {testResult}
                </Text>
              </View>
            )}
          </Card>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(900)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <Button
              variant="outline"
              onPress={() => router.push('/(tabs)/problem-solver')}
              style={styles.actionButton}
            >
              Problem Solver
            </Button>
            <Button
              variant="outline"
              onPress={() => router.push('/(tabs)/travel')}
              style={styles.actionButton}
            >
              Travel Assistant
            </Button>
            <Button
              variant="outline"
              onPress={() => router.push('/(tabs)/voice')}
              style={styles.actionButton}
            >
              Voice Features
            </Button>
            <Button
              variant="outline"
              onPress={() => router.push('/(tabs)/behavior')}
              style={styles.actionButton}
            >
              Behavior AI
            </Button>
          </View>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    letterSpacing: -0.2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceInfo: {
    flex: 1,
    gap: 4,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  testButton: {
    padding: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    borderWidth: 1,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  resultContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
  },
});
