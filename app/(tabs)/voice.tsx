
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Switch, TextInput, Alert } from "react-native";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import Animated, { FadeInDown } from "react-native-reanimated";
import { 
  STTService, 
  TTSService, 
  VoiceCloningService, 
  CallService,
  AudioRecordingService,
  formatDuration,
  formatPhoneNumber 
} from "@/utils/voiceServices";
import { VoiceProfile, CallSession, VoicemailMessage, AudioRecording } from "@/types/voice-communication";

interface VoiceFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  configured: boolean;
  provider?: string;
}

export default function VoiceScreen() {
  const [features, setFeatures] = useState<VoiceFeature[]>([
    {
      id: 'stt',
      name: 'Speech-to-Text',
      description: 'Convert audio to text in real-time',
      icon: 'waveform.circle.fill',
      enabled: false,
      configured: false,
      provider: 'OpenAI Whisper',
    },
    {
      id: 'tts',
      name: 'Text-to-Speech',
      description: 'Generate realistic voice replies',
      icon: 'speaker.wave.3.fill',
      enabled: false,
      configured: false,
      provider: 'OpenAI TTS',
    },
    {
      id: 'voice-cloning',
      name: 'Voice Cloning',
      description: 'Create a custom voice that sounds like you',
      icon: 'person.wave.2.fill',
      enabled: false,
      configured: false,
      provider: 'ElevenLabs',
    },
    {
      id: 'realtime',
      name: 'Real-time Voice',
      description: 'Live conversation with AI assistant',
      icon: 'phone.bubble.left.fill',
      enabled: false,
      configured: false,
      provider: 'WebRTC + Realtime API',
    },
    {
      id: 'calls',
      name: 'Call Integration',
      description: 'Handle voice calls, SMS, and voicemail',
      icon: 'phone.fill',
      enabled: false,
      configured: false,
      provider: 'Twilio',
    },
  ]);

  const [selectedVoice, setSelectedVoice] = useState<VoiceProfile | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [testText, setTestText] = useState("Hello! This is a test of the text-to-speech system.");

  const [recentCalls] = useState<CallSession[]>([
    {
      id: 'call-1',
      type: 'inbound',
      from: '+1 (555) 123-4567',
      to: '+1 (555) 987-6543',
      status: 'completed',
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date(Date.now() - 3300000).toISOString(),
      duration: 300,
      transcript: 'Agent handled call from vendor about delivery confirmation.',
    },
    {
      id: 'call-2',
      type: 'outbound',
      from: '+1 (555) 987-6543',
      to: '+1 (555) 234-5678',
      status: 'completed',
      startTime: new Date(Date.now() - 7200000).toISOString(),
      endTime: new Date(Date.now() - 6900000).toISOString(),
      duration: 180,
    },
  ]);

  const [voicemails] = useState<VoicemailMessage[]>([
    {
      id: 'vm-1',
      from: '+1 (555) 345-6789',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      duration: 45,
      audioUrl: 'mock://voicemail1.mp3',
      transcribed: true,
      transcript: 'Hi, this is Sarah. Just wanted to follow up on our meeting. Call me back when you get a chance.',
      listened: false,
    },
  ]);

  const toggleFeature = (featureId: string) => {
    setFeatures(features.map(f => 
      f.id === featureId ? { ...f, enabled: !f.enabled } : f
    ));
    console.log('Toggled feature:', featureId);
  };

  const handleTestSTT = async () => {
    Alert.alert(
      'Speech-to-Text Test',
      'This will start recording audio and transcribe it. Make sure you have configured your API keys in the AI Config screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Recording', 
          onPress: async () => {
            try {
              const recorder = new AudioRecordingService();
              await recorder.startRecording();
              setIsRecording(true);
              
              // Simulate recording for 5 seconds
              setTimeout(async () => {
                const recording = await recorder.stopRecording();
                setIsRecording(false);
                
                // Transcribe
                const sttService = new STTService({
                  provider: 'openai-whisper',
                  language: 'en',
                  realTime: false,
                });
                
                const result = await sttService.transcribe(recording.uri);
                Alert.alert('Transcription Result', result.text);
              }, 5000);
            } catch (error) {
              console.error('STT test error:', error);
              Alert.alert('Error', 'Failed to test speech-to-text');
            }
          }
        },
      ]
    );
  };

  const handleTestTTS = async () => {
    if (!testText.trim()) {
      Alert.alert('Error', 'Please enter some text to synthesize');
      return;
    }

    try {
      const ttsService = new TTSService({
        provider: 'openai',
        voice: 'alloy',
        speed: 1.0,
        pitch: 1.0,
        language: 'en-US',
      });

      const result = await ttsService.synthesize(testText);
      Alert.alert(
        'Speech Synthesized',
        `Audio generated successfully!\nDuration: ${formatDuration(result.duration)}\nSize: ${Math.round(result.size / 1024)}KB`
      );
    } catch (error) {
      console.error('TTS test error:', error);
      Alert.alert('Error', 'Failed to synthesize speech. Make sure your API key is configured.');
    }
  };

  const handleVoiceCloning = () => {
    Alert.alert(
      'Voice Cloning',
      'Voice cloning requires:\n\n• At least 3 audio samples (30 seconds each)\n• Explicit consent\n• High-quality recordings\n\nThis feature creates a custom voice that sounds like you for use in calls and meetings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Setup', onPress: () => console.log('Voice cloning setup') },
      ]
    );
  };

  const handleCallTest = () => {
    Alert.alert(
      'Call Integration',
      'To enable call integration, you need to:\n\n1. Sign up for Twilio, Vonage, or SignalWire\n2. Get your API credentials\n3. Configure them in AI Config\n4. Set up a phone number\n\nThe agent will then be able to handle calls on your behalf.',
      [{ text: 'OK' }]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'in-progress':
        return colors.warning;
      case 'failed':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getCallTypeIcon = (type: string) => {
    return type === 'inbound' ? 'phone.arrow.down.left.fill' : 'phone.arrow.up.right.fill';
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log('Voice settings')}
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
            title: "Voice & Communication",
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
                <Text style={styles.headerTitle}>Voice & Communication</Text>
                <Pressable
                  onPress={() => console.log('Voice settings')}
                  style={styles.headerButton}
                >
                  <IconSymbol name="gear" color={colors.primary} size={24} />
                </Pressable>
              </View>
            </View>
          )}

          {/* Voice Features */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="waveform" color={colors.primary} size={24} />
              <Text style={styles.sectionTitle}>Voice Features</Text>
            </View>
            <View style={styles.card}>
              {features.map((feature, index) => (
                <View key={feature.id}>
                  {index > 0 && <View style={styles.divider} />}
                  <View style={styles.featureRow}>
                    <View style={styles.featureInfo}>
                      <View style={[styles.featureIconContainer, { backgroundColor: colors.primary + '20' }]}>
                        <IconSymbol name={feature.icon} size={24} color={colors.primary} />
                      </View>
                      <View style={styles.featureText}>
                        <Text style={styles.featureTitle}>{feature.name}</Text>
                        <Text style={styles.featureDescription}>{feature.description}</Text>
                        {feature.provider && (
                          <Text style={styles.featureProvider}>Provider: {feature.provider}</Text>
                        )}
                      </View>
                    </View>
                    <Switch
                      value={feature.enabled}
                      onValueChange={() => toggleFeature(feature.id)}
                      trackColor={{ false: colors.border, true: colors.accent }}
                      thumbColor={colors.card}
                    />
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Speech-to-Text Testing */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="mic.fill" color={colors.accent} size={24} />
              <Text style={styles.sectionTitle}>Speech-to-Text Test</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardDescription}>
                Test the speech-to-text functionality by recording a short audio clip.
              </Text>
              <Pressable
                style={[styles.testButton, isRecording && styles.testButtonRecording]}
                onPress={handleTestSTT}
                disabled={isRecording}
              >
                <IconSymbol 
                  name={isRecording ? "stop.circle.fill" : "mic.circle.fill"} 
                  size={24} 
                  color={colors.card} 
                />
                <Text style={styles.testButtonText}>
                  {isRecording ? 'Recording...' : 'Test Speech-to-Text'}
                </Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Text-to-Speech Testing */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="speaker.wave.3.fill" color={colors.secondary} size={24} />
              <Text style={styles.sectionTitle}>Text-to-Speech Test</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardDescription}>
                Enter text to convert to speech and hear how your agent will sound.
              </Text>
              <TextInput
                style={styles.textInput}
                value={testText}
                onChangeText={setTestText}
                placeholder="Enter text to synthesize..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
              <Pressable
                style={styles.testButton}
                onPress={handleTestTTS}
              >
                <IconSymbol name="play.circle.fill" size={24} color={colors.card} />
                <Text style={styles.testButtonText}>Generate Speech</Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Voice Cloning */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="person.wave.2.fill" color={colors.warning} size={24} />
              <Text style={styles.sectionTitle}>Voice Cloning</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.warningBanner}>
                <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.warning} />
                <Text style={styles.warningText}>
                  Voice cloning requires explicit consent and high-quality audio samples.
                </Text>
              </View>
              <Pressable
                style={[styles.testButton, styles.secondaryButton]}
                onPress={handleVoiceCloning}
              >
                <IconSymbol name="waveform.badge.plus" size={24} color={colors.primary} />
                <Text style={[styles.testButtonText, styles.secondaryButtonText]}>
                  Set Up Voice Cloning
                </Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Call Integration */}
          <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="phone.fill" color={colors.info} size={24} />
              <Text style={styles.sectionTitle}>Call Integration</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardDescription}>
                Enable your agent to handle phone calls, SMS, and voicemail automatically.
              </Text>
              <Pressable
                style={[styles.testButton, styles.secondaryButton]}
                onPress={handleCallTest}
              >
                <IconSymbol name="phone.badge.plus" size={24} color={colors.primary} />
                <Text style={[styles.testButtonText, styles.secondaryButtonText]}>
                  Configure Call Integration
                </Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Recent Calls */}
          {recentCalls.length > 0 && (
            <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconSymbol name="clock.arrow.circlepath" color={colors.secondary} size={24} />
                <Text style={styles.sectionTitle}>Recent Calls</Text>
              </View>
              {recentCalls.map((call) => (
                <Pressable
                  key={call.id}
                  style={styles.card}
                  onPress={() => console.log('Call details:', call.id)}
                >
                  <View style={styles.callHeader}>
                    <View style={[styles.callIconContainer, { backgroundColor: getStatusColor(call.status) + '20' }]}>
                      <IconSymbol 
                        name={getCallTypeIcon(call.type)} 
                        size={20} 
                        color={getStatusColor(call.status)} 
                      />
                    </View>
                    <View style={styles.callInfo}>
                      <Text style={styles.callNumber}>
                        {call.type === 'inbound' ? call.from : call.to}
                      </Text>
                      <Text style={styles.callTime}>
                        {new Date(call.startTime).toLocaleString()}
                      </Text>
                    </View>
                    {call.duration && (
                      <View style={styles.callDuration}>
                        <IconSymbol name="clock.fill" size={14} color={colors.textSecondary} />
                        <Text style={styles.callDurationText}>
                          {formatDuration(call.duration)}
                        </Text>
                      </View>
                    )}
                  </View>
                  {call.transcript && (
                    <Text style={styles.callTranscript} numberOfLines={2}>
                      {call.transcript}
                    </Text>
                  )}
                </Pressable>
              ))}
            </Animated.View>
          )}

          {/* Voicemails */}
          {voicemails.length > 0 && (
            <Animated.View entering={FadeInDown.delay(700)} style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconSymbol name="voicemail" color={colors.accent} size={24} />
                <Text style={styles.sectionTitle}>Voicemails</Text>
              </View>
              {voicemails.map((vm) => (
                <Pressable
                  key={vm.id}
                  style={[styles.card, !vm.listened && styles.unreadCard]}
                  onPress={() => console.log('Play voicemail:', vm.id)}
                >
                  <View style={styles.voicemailHeader}>
                    <View style={styles.voicemailInfo}>
                      <Text style={styles.voicemailFrom}>{vm.from}</Text>
                      <Text style={styles.voicemailTime}>
                        {new Date(vm.timestamp).toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.voicemailDuration}>
                      <IconSymbol name="waveform" size={16} color={colors.accent} />
                      <Text style={styles.voicemailDurationText}>
                        {formatDuration(vm.duration)}
                      </Text>
                    </View>
                  </View>
                  {vm.transcribed && vm.transcript && (
                    <View style={styles.transcriptContainer}>
                      <IconSymbol name="text.bubble.fill" size={14} color={colors.textSecondary} />
                      <Text style={styles.transcriptText} numberOfLines={3}>
                        {vm.transcript}
                      </Text>
                    </View>
                  )}
                  {!vm.listened && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>NEW</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </Animated.View>
          )}

          {/* Info Banner */}
          <Animated.View entering={FadeInDown.delay(800)} style={styles.section}>
            <View style={styles.infoBanner}>
              <IconSymbol name="info.circle.fill" size={20} color={colors.info} />
              <Text style={styles.infoBannerText}>
                Voice features require API keys from providers like OpenAI, ElevenLabs, or Twilio. 
                Configure them in the AI Config screen to enable these features.
              </Text>
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
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 2,
  },
  featureProvider: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 14,
    gap: 8,
  },
  testButtonRecording: {
    backgroundColor: colors.error,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
  secondaryButton: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.warning + '15',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  callHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  callIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callInfo: {
    flex: 1,
  },
  callNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  callTime: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  callDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  callDurationText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  callTranscript: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontStyle: 'italic',
    paddingLeft: 52,
  },
  voicemailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  voicemailInfo: {
    flex: 1,
  },
  voicemailFrom: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  voicemailTime: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  voicemailDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  voicemailDurationText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
  transcriptContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 10,
  },
  transcriptText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  unreadBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.card,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.info + '15',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});
