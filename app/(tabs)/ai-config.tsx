
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Switch, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import Animated, { FadeInDown } from 'react-native-reanimated';

type AutonomyLevel = 'suggest-only' | 'semi-autonomous' | 'fully-autonomous';

interface APIConfig {
  name: string;
  enabled: boolean;
  apiKey: string;
  icon: string;
  color: string;
}

export default function AIConfigScreen() {
  const [activeTab, setActiveTab] = useState<'autonomy' | 'apis' | 'preferences'>('autonomy');
  const [autonomyLevel, setAutonomyLevel] = useState<AutonomyLevel>('semi-autonomous');
  
  // Travel API configurations
  const [travelAPIs, setTravelAPIs] = useState<APIConfig[]>([
    { name: 'Amadeus', enabled: false, apiKey: '', icon: 'airplane', color: colors.primary },
    { name: 'Skyscanner', enabled: false, apiKey: '', icon: 'airplane.departure', color: colors.secondary },
    { name: 'Booking.com', enabled: false, apiKey: '', icon: 'bed.double.fill', color: colors.accent },
    { name: 'Google Flights', enabled: false, apiKey: '', icon: 'globe', color: colors.info },
  ]);

  // AI Service configurations
  const [aiServices, setAIServices] = useState<APIConfig[]>([
    { name: 'OpenAI', enabled: false, apiKey: '', icon: 'brain', color: colors.primary },
    { name: 'Claude', enabled: false, apiKey: '', icon: 'sparkles', color: colors.secondary },
  ]);

  // Voice API configurations
  const [voiceAPIs, setVoiceAPIs] = useState<APIConfig[]>([
    { name: 'OpenAI Whisper (STT)', enabled: false, apiKey: '', icon: 'waveform.circle', color: colors.primary },
    { name: 'OpenAI TTS', enabled: false, apiKey: '', icon: 'speaker.wave.3', color: colors.primary },
    { name: 'ElevenLabs', enabled: false, apiKey: '', icon: 'person.wave.2', color: colors.accent },
    { name: 'Deepgram', enabled: false, apiKey: '', icon: 'mic.fill', color: colors.secondary },
    { name: 'Twilio', enabled: false, apiKey: '', icon: 'phone.fill', color: colors.error },
  ]);

  // Preferences
  const [autoDetectTravel, setAutoDetectTravel] = useState(false);
  const [autoUpdateCalendar, setAutoUpdateCalendar] = useState(false);
  const [trackTrips, setTrackTrips] = useState(true);
  const [sustainabilityPriority, setSustainabilityPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [maxAutoBookAmount, setMaxAutoBookAmount] = useState('500');

  const handleAPIToggle = (index: number, type: 'travel' | 'ai' | 'voice') => {
    if (type === 'travel') {
      const updated = [...travelAPIs];
      updated[index].enabled = !updated[index].enabled;
      setTravelAPIs(updated);
    } else if (type === 'voice') {
      const updated = [...voiceAPIs];
      updated[index].enabled = !updated[index].enabled;
      setVoiceAPIs(updated);
    } else {
      const updated = [...aiServices];
      updated[index].enabled = !updated[index].enabled;
      setAIServices(updated);
    }
    console.log(`Toggled ${type} API at index ${index}`);
  };

  const handleAPIKeyChange = (index: number, value: string, type: 'travel' | 'ai' | 'voice') => {
    if (type === 'travel') {
      const updated = [...travelAPIs];
      updated[index].apiKey = value;
      setTravelAPIs(updated);
    } else if (type === 'voice') {
      const updated = [...voiceAPIs];
      updated[index].apiKey = value;
      setVoiceAPIs(updated);
    } else {
      const updated = [...aiServices];
      updated[index].apiKey = value;
      setAIServices(updated);
    }
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log('Save configuration')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="checkmark.circle.fill" color={colors.success} size={24} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "AI Configuration",
            headerRight: renderHeaderRight,
          }}
        />
      )}
      <View style={styles.container}>
        {/* Header for Android/Web */}
        {Platform.OS !== 'ios' && (
          <View style={styles.headerContainer}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>AI Configuration</Text>
              <Pressable
                onPress={() => console.log('Save configuration')}
                style={styles.headerButton}
              >
                <IconSymbol name="checkmark.circle.fill" color={colors.success} size={24} />
              </Pressable>
            </View>
          </View>
        )}

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'autonomy' && styles.activeTab]}
            onPress={() => setActiveTab('autonomy')}
          >
            <IconSymbol 
              name="slider.horizontal.3" 
              size={20} 
              color={activeTab === 'autonomy' ? colors.primary : colors.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'autonomy' && styles.activeTabText]}>
              Autonomy
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'apis' && styles.activeTab]}
            onPress={() => setActiveTab('apis')}
          >
            <IconSymbol 
              name="key.fill" 
              size={20} 
              color={activeTab === 'apis' ? colors.primary : colors.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'apis' && styles.activeTabText]}>
              APIs
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'preferences' && styles.activeTab]}
            onPress={() => setActiveTab('preferences')}
          >
            <IconSymbol 
              name="heart.fill" 
              size={20} 
              color={activeTab === 'preferences' ? colors.primary : colors.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'preferences' && styles.activeTabText]}>
              Preferences
            </Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Autonomy Level Tab */}
          {activeTab === 'autonomy' && (
            <>
              <Animated.View entering={FadeInDown.delay(100)} style={styles.infoCard}>
                <IconSymbol name="info.circle.fill" size={24} color={colors.info} />
                <Text style={styles.infoText}>
                  Choose how much control you want to give the AI assistant. You can change this anytime.
                </Text>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(200)}>
                <Pressable
                  style={[
                    styles.autonomyCard,
                    autonomyLevel === 'suggest-only' && styles.autonomyCardActive
                  ]}
                  onPress={() => setAutonomyLevel('suggest-only')}
                >
                  <View style={styles.autonomyHeader}>
                    <View style={[styles.autonomyIcon, { backgroundColor: colors.info + '20' }]}>
                      <IconSymbol name="eye.fill" size={28} color={colors.info} />
                    </View>
                    <View style={styles.autonomyInfo}>
                      <Text style={styles.autonomyTitle}>Suggest-Only</Text>
                      <Text style={styles.autonomySubtitle}>Maximum Control</Text>
                    </View>
                    {autonomyLevel === 'suggest-only' && (
                      <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
                    )}
                  </View>
                  <Text style={styles.autonomyDescription}>
                    AI provides solutions, drafts, and travel options. No actions taken without your explicit approval.
                  </Text>
                  <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                      <IconSymbol name="checkmark" size={14} color={colors.success} />
                      <Text style={styles.featureText}>Shows all options and recommendations</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <IconSymbol name="checkmark" size={14} color={colors.success} />
                      <Text style={styles.featureText}>You review and approve everything</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <IconSymbol name="checkmark" size={14} color={colors.success} />
                      <Text style={styles.featureText}>No automatic bookings or actions</Text>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(300)}>
                <Pressable
                  style={[
                    styles.autonomyCard,
                    autonomyLevel === 'semi-autonomous' && styles.autonomyCardActive
                  ]}
                  onPress={() => setAutonomyLevel('semi-autonomous')}
                >
                  <View style={styles.autonomyHeader}>
                    <View style={[styles.autonomyIcon, { backgroundColor: colors.warning + '20' }]}>
                      <IconSymbol name="bolt.fill" size={28} color={colors.warning} />
                    </View>
                    <View style={styles.autonomyInfo}>
                      <Text style={styles.autonomyTitle}>Semi-Autonomous</Text>
                      <Text style={styles.autonomySubtitle}>Balanced Approach</Text>
                    </View>
                    {autonomyLevel === 'semi-autonomous' && (
                      <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
                    )}
                  </View>
                  <Text style={styles.autonomyDescription}>
                    Executes routine tasks and low-risk bookings. Requests confirmation for major actions.
                  </Text>
                  <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                      <IconSymbol name="checkmark" size={14} color={colors.success} />
                      <Text style={styles.featureText}>Auto-handles routine tasks</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <IconSymbol name="checkmark" size={14} color={colors.success} />
                      <Text style={styles.featureText}>Confirms before major bookings</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <IconSymbol name="checkmark" size={14} color={colors.success} />
                      <Text style={styles.featureText}>Updates calendar automatically</Text>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(400)}>
                <Pressable
                  style={[
                    styles.autonomyCard,
                    autonomyLevel === 'fully-autonomous' && styles.autonomyCardActive
                  ]}
                  onPress={() => setAutonomyLevel('fully-autonomous')}
                >
                  <View style={styles.autonomyHeader}>
                    <View style={[styles.autonomyIcon, { backgroundColor: colors.error + '20' }]}>
                      <IconSymbol name="sparkles" size={28} color={colors.error} />
                    </View>
                    <View style={styles.autonomyInfo}>
                      <Text style={styles.autonomyTitle}>Fully Autonomous</Text>
                      <Text style={styles.autonomySubtitle}>Maximum Automation</Text>
                    </View>
                    {autonomyLevel === 'fully-autonomous' && (
                      <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
                    )}
                  </View>
                  <Text style={styles.autonomyDescription}>
                    Executes decisions according to your rules, including booking travel and sending replies.
                  </Text>
                  <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                      <IconSymbol name="checkmark" size={14} color={colors.success} />
                      <Text style={styles.featureText}>Books travel within budget limits</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <IconSymbol name="checkmark" size={14} color={colors.success} />
                      <Text style={styles.featureText}>Handles all routine actions</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <IconSymbol name="exclamationmark.triangle.fill" size={14} color={colors.warning} />
                      <Text style={styles.featureText}>Requires careful rule configuration</Text>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            </>
          )}

          {/* APIs Tab */}
          {activeTab === 'apis' && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>AI Services</Text>
              </View>

              {aiServices.map((service, index) => (
                <Animated.View
                  key={service.name}
                  entering={FadeInDown.delay(100 + index * 100)}
                  style={styles.apiCard}
                >
                  <View style={styles.apiHeader}>
                    <View style={[styles.apiIcon, { backgroundColor: service.color + '20' }]}>
                      <IconSymbol name={service.icon} size={24} color={service.color} />
                    </View>
                    <Text style={styles.apiName}>{service.name}</Text>
                    <Switch
                      value={service.enabled}
                      onValueChange={() => handleAPIToggle(index, 'ai')}
                      trackColor={{ false: colors.border, true: colors.success }}
                      thumbColor={colors.card}
                    />
                  </View>
                  {service.enabled && (
                    <View style={styles.apiKeyContainer}>
                      <TextInput
                        style={styles.apiKeyInput}
                        placeholder="Enter API Key"
                        placeholderTextColor={colors.textSecondary}
                        value={service.apiKey}
                        onChangeText={(value) => handleAPIKeyChange(index, value, 'ai')}
                        secureTextEntry
                      />
                      <IconSymbol name="key.fill" size={16} color={colors.textSecondary} />
                    </View>
                  )}
                </Animated.View>
              ))}

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Voice & Communication APIs</Text>
              </View>

              {voiceAPIs.map((api, index) => (
                <Animated.View
                  key={api.name}
                  entering={FadeInDown.delay(300 + index * 100)}
                  style={styles.apiCard}
                >
                  <View style={styles.apiHeader}>
                    <View style={[styles.apiIcon, { backgroundColor: api.color + '20' }]}>
                      <IconSymbol name={api.icon} size={24} color={api.color} />
                    </View>
                    <Text style={styles.apiName}>{api.name}</Text>
                    <Switch
                      value={api.enabled}
                      onValueChange={() => handleAPIToggle(index, 'voice')}
                      trackColor={{ false: colors.border, true: colors.success }}
                      thumbColor={colors.card}
                    />
                  </View>
                  {api.enabled && (
                    <View style={styles.apiKeyContainer}>
                      <TextInput
                        style={styles.apiKeyInput}
                        placeholder="Enter API Key"
                        placeholderTextColor={colors.textSecondary}
                        value={api.apiKey}
                        onChangeText={(value) => handleAPIKeyChange(index, value, 'voice')}
                        secureTextEntry
                      />
                      <IconSymbol name="key.fill" size={16} color={colors.textSecondary} />
                    </View>
                  )}
                </Animated.View>
              ))}

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Travel APIs</Text>
              </View>

              {travelAPIs.map((api, index) => (
                <Animated.View
                  key={api.name}
                  entering={FadeInDown.delay(600 + index * 100)}
                  style={styles.apiCard}
                >
                  <View style={styles.apiHeader}>
                    <View style={[styles.apiIcon, { backgroundColor: api.color + '20' }]}>
                      <IconSymbol name={api.icon} size={24} color={api.color} />
                    </View>
                    <Text style={styles.apiName}>{api.name}</Text>
                    <Switch
                      value={api.enabled}
                      onValueChange={() => handleAPIToggle(index, 'travel')}
                      trackColor={{ false: colors.border, true: colors.success }}
                      thumbColor={colors.card}
                    />
                  </View>
                  {api.enabled && (
                    <View style={styles.apiKeyContainer}>
                      <TextInput
                        style={styles.apiKeyInput}
                        placeholder="Enter API Key"
                        placeholderTextColor={colors.textSecondary}
                        value={api.apiKey}
                        onChangeText={(value) => handleAPIKeyChange(index, value, 'travel')}
                        secureTextEntry
                      />
                      <IconSymbol name="key.fill" size={16} color={colors.textSecondary} />
                    </View>
                  )}
                </Animated.View>
              ))}

              <Animated.View entering={FadeInDown.delay(700)} style={styles.helpCard}>
                <IconSymbol name="questionmark.circle.fill" size={24} color={colors.info} />
                <View style={styles.helpContent}>
                  <Text style={styles.helpTitle}>Need API Keys?</Text>
                  <Text style={styles.helpText}>
                    Visit the provider websites to sign up and generate API keys. All keys are stored securely on your device.
                  </Text>
                </View>
              </Animated.View>
            </>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Travel Automation</Text>
              </View>

              <Animated.View entering={FadeInDown.delay(100)} style={styles.preferenceCard}>
                <View style={styles.preferenceRow}>
                  <View style={styles.preferenceInfo}>
                    <IconSymbol name="eye.fill" size={20} color={colors.primary} />
                    <View style={styles.preferenceTextContainer}>
                      <Text style={styles.preferenceTitle}>Auto-Detect Travel</Text>
                      <Text style={styles.preferenceDescription}>
                        Scan emails and calendar for travel needs
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={autoDetectTravel}
                    onValueChange={setAutoDetectTravel}
                    trackColor={{ false: colors.border, true: colors.success }}
                    thumbColor={colors.card}
                  />
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(200)} style={styles.preferenceCard}>
                <View style={styles.preferenceRow}>
                  <View style={styles.preferenceInfo}>
                    <IconSymbol name="calendar.badge.clock" size={20} color={colors.secondary} />
                    <View style={styles.preferenceTextContainer}>
                      <Text style={styles.preferenceTitle}>Auto-Update Calendar</Text>
                      <Text style={styles.preferenceDescription}>
                        Add bookings to calendar automatically
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={autoUpdateCalendar}
                    onValueChange={setAutoUpdateCalendar}
                    trackColor={{ false: colors.border, true: colors.success }}
                    thumbColor={colors.card}
                  />
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(300)} style={styles.preferenceCard}>
                <View style={styles.preferenceRow}>
                  <View style={styles.preferenceInfo}>
                    <IconSymbol name="location.fill" size={20} color={colors.accent} />
                    <View style={styles.preferenceTextContainer}>
                      <Text style={styles.preferenceTitle}>Track Trips</Text>
                      <Text style={styles.preferenceDescription}>
                        Real-time updates for delays and changes
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={trackTrips}
                    onValueChange={setTrackTrips}
                    trackColor={{ false: colors.border, true: colors.success }}
                    thumbColor={colors.card}
                  />
                </View>
              </Animated.View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Booking Preferences</Text>
              </View>

              <Animated.View entering={FadeInDown.delay(400)} style={styles.preferenceCard}>
                <Text style={styles.preferenceLabel}>Sustainability Priority</Text>
                <View style={styles.segmentedControl}>
                  <Pressable
                    style={[
                      styles.segment,
                      sustainabilityPriority === 'low' && styles.segmentActive
                    ]}
                    onPress={() => setSustainabilityPriority('low')}
                  >
                    <Text style={[
                      styles.segmentText,
                      sustainabilityPriority === 'low' && styles.segmentTextActive
                    ]}>
                      Low
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.segment,
                      sustainabilityPriority === 'medium' && styles.segmentActive
                    ]}
                    onPress={() => setSustainabilityPriority('medium')}
                  >
                    <Text style={[
                      styles.segmentText,
                      sustainabilityPriority === 'medium' && styles.segmentTextActive
                    ]}>
                      Medium
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.segment,
                      sustainabilityPriority === 'high' && styles.segmentActive
                    ]}
                    onPress={() => setSustainabilityPriority('high')}
                  >
                    <Text style={[
                      styles.segmentText,
                      sustainabilityPriority === 'high' && styles.segmentTextActive
                    ]}>
                      High
                    </Text>
                  </Pressable>
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(500)} style={styles.preferenceCard}>
                <Text style={styles.preferenceLabel}>Max Auto-Book Amount (€)</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="500"
                  placeholderTextColor={colors.textSecondary}
                  value={maxAutoBookAmount}
                  onChangeText={setMaxAutoBookAmount}
                  keyboardType="numeric"
                />
                <Text style={styles.preferenceHint}>
                  Only applies to fully autonomous mode
                </Text>
              </Animated.View>
            </>
          )}

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
    paddingHorizontal: 4,
    borderRadius: 8,
    gap: 4,
  },
  activeTab: {
    backgroundColor: colors.primary + '15',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  infoCard: {
    backgroundColor: colors.info + '15',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  autonomyCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  autonomyCardActive: {
    borderColor: colors.success,
    backgroundColor: colors.success + '05',
  },
  autonomyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  autonomyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  autonomyInfo: {
    flex: 1,
  },
  autonomyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  autonomySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  autonomyDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  apiCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  apiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  apiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  apiName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  apiKeyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  apiKeyInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 10,
  },
  helpCard: {
    backgroundColor: colors.info + '15',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    flexDirection: 'row',
    gap: 12,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  helpText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  preferenceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  preferenceTextContainer: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  preferenceDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  preferenceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.card,
  },
  amountInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  preferenceHint: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: 100,
  },
});
