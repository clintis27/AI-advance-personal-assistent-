
import { colors } from "@/styles/commonStyles";
import React, { useState, useEffect } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { IconSymbol } from "@/components/IconSymbol";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Switch, Alert } from "react-native";
import { Stack } from "expo-router";
import { Integration, IntegrationCategory, IntegrationStats } from "@/types/integrations";
import { 
  initiateOAuthFlow, 
  disconnectIntegration, 
  isIntegrationConnected,
  testIntegrationConnection 
} from "@/utils/integrationHelpers";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  categoryIcon: {
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  integrationCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  integrationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  integrationInfo: {
    flex: 1,
  },
  integrationName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  integrationDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  capabilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  capabilityBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  capabilityText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  integrationActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  connectButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disconnectButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  testButton: {
    backgroundColor: colors.info,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
});

export default function IntegrationsScreen() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    // Email Integrations
    {
      id: 'gmail',
      name: 'Gmail',
      category: 'email',
      description: 'Read, summarize, and send emails',
      icon: 'envelope.fill',
      color: '#EA4335',
      status: 'disconnected',
      provider: 'Google',
      capabilities: ['Read', 'Send', 'Summarize'],
      requiredScopes: ['gmail.readonly', 'gmail.send'],
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      category: 'email',
      description: 'Manage your Outlook emails',
      icon: 'envelope.badge.fill',
      color: '#0078D4',
      status: 'disconnected',
      provider: 'Microsoft',
      capabilities: ['Read', 'Send', 'Organize'],
      requiredScopes: ['Mail.Read', 'Mail.Send'],
    },
    // Calendar Integrations
    {
      id: 'googleCalendar',
      name: 'Google Calendar',
      category: 'calendar',
      description: 'Schedule and join meetings automatically',
      icon: 'calendar',
      color: '#4285F4',
      status: 'disconnected',
      provider: 'Google',
      capabilities: ['Schedule', 'View', 'Join Meetings'],
      requiredScopes: ['calendar', 'calendar.events'],
    },
    {
      id: 'outlookCalendar',
      name: 'Outlook Calendar',
      category: 'calendar',
      description: 'Manage Microsoft calendar events',
      icon: 'calendar.badge.clock',
      color: '#0078D4',
      status: 'disconnected',
      provider: 'Microsoft',
      capabilities: ['Schedule', 'View', 'Sync'],
      requiredScopes: ['Calendars.ReadWrite'],
    },
    {
      id: 'zoom',
      name: 'Zoom',
      category: 'calendar',
      description: 'Create and join Zoom meetings',
      icon: 'video.fill',
      color: '#2D8CFF',
      status: 'disconnected',
      provider: 'Zoom',
      capabilities: ['Create Meetings', 'Join', 'Record'],
      requiredScopes: ['meeting:write', 'meeting:read'],
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      category: 'calendar',
      description: 'Teams meetings and collaboration',
      icon: 'person.3.fill',
      color: '#6264A7',
      status: 'disconnected',
      provider: 'Microsoft',
      capabilities: ['Meetings', 'Chat', 'Calls'],
      requiredScopes: ['OnlineMeetings.ReadWrite'],
    },
    // Social Media Integrations
    {
      id: 'twitter',
      name: 'Twitter / X',
      category: 'social',
      description: 'Post and manage Twitter content',
      icon: 'at',
      color: '#1DA1F2',
      status: 'disconnected',
      provider: 'Twitter',
      capabilities: ['Post', 'Read DMs', 'Respond'],
      requiredScopes: ['tweet.read', 'tweet.write', 'dm.read'],
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      category: 'social',
      description: 'Professional networking and posts',
      icon: 'briefcase.fill',
      color: '#0A66C2',
      status: 'disconnected',
      provider: 'LinkedIn',
      capabilities: ['Post', 'Network', 'Messages'],
      requiredScopes: ['w_member_social', 'r_basicprofile'],
    },
    {
      id: 'facebook',
      name: 'Facebook',
      category: 'social',
      description: 'Manage Facebook posts and pages',
      icon: 'person.2.fill',
      color: '#1877F2',
      status: 'disconnected',
      provider: 'Facebook',
      capabilities: ['Post', 'Pages', 'Messages'],
      requiredScopes: ['pages_manage_posts', 'pages_read_engagement'],
    },
    {
      id: 'instagram',
      name: 'Instagram',
      category: 'social',
      description: 'Instagram content and DMs',
      icon: 'camera.fill',
      color: '#E4405F',
      status: 'disconnected',
      provider: 'Instagram',
      capabilities: ['Post', 'Stories', 'DMs'],
      requiredScopes: ['instagram_basic', 'instagram_content_publish'],
    },
    // Messaging Integrations
    {
      id: 'slack',
      name: 'Slack',
      category: 'messaging',
      description: 'Unified Slack workspace control',
      icon: 'message.fill',
      color: '#4A154B',
      status: 'disconnected',
      provider: 'Slack',
      capabilities: ['Send', 'Read', 'Channels'],
      requiredScopes: ['chat:write', 'channels:read', 'im:read'],
    },
    {
      id: 'discord',
      name: 'Discord',
      category: 'messaging',
      description: 'Discord server management',
      icon: 'bubble.left.and.bubble.right.fill',
      color: '#5865F2',
      status: 'disconnected',
      provider: 'Discord',
      capabilities: ['Messages', 'Servers', 'Voice'],
      requiredScopes: ['bot', 'messages.read'],
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      category: 'messaging',
      description: 'WhatsApp business messaging',
      icon: 'phone.fill',
      color: '#25D366',
      status: 'disconnected',
      provider: 'WhatsApp',
      capabilities: ['Send', 'Receive', 'Templates'],
      requiredScopes: ['whatsapp_business_messaging'],
    },
    {
      id: 'telegram',
      name: 'Telegram',
      category: 'messaging',
      description: 'Telegram bot integration',
      icon: 'paperplane.fill',
      color: '#0088CC',
      status: 'disconnected',
      provider: 'Telegram',
      capabilities: ['Bot', 'Messages', 'Groups'],
      requiredScopes: ['bot'],
    },
    // Task/Project Tools
    {
      id: 'notion',
      name: 'Notion',
      category: 'tasks',
      description: 'Notion workspace and databases',
      icon: 'doc.text.fill',
      color: '#000000',
      status: 'disconnected',
      provider: 'Notion',
      capabilities: ['Read', 'Create', 'Update'],
      requiredScopes: ['read_content', 'update_content'],
    },
    {
      id: 'trello',
      name: 'Trello',
      category: 'tasks',
      description: 'Trello boards and cards',
      icon: 'square.grid.2x2.fill',
      color: '#0079BF',
      status: 'disconnected',
      provider: 'Trello',
      capabilities: ['Boards', 'Cards', 'Lists'],
      requiredScopes: ['read', 'write'],
    },
    {
      id: 'asana',
      name: 'Asana',
      category: 'tasks',
      description: 'Asana project management',
      icon: 'checkmark.circle.fill',
      color: '#F06A6A',
      status: 'disconnected',
      provider: 'Asana',
      capabilities: ['Tasks', 'Projects', 'Assign'],
      requiredScopes: ['default'],
    },
    {
      id: 'clickup',
      name: 'ClickUp',
      category: 'tasks',
      description: 'ClickUp workspace management',
      icon: 'list.bullet.circle.fill',
      color: '#7B68EE',
      status: 'disconnected',
      provider: 'ClickUp',
      capabilities: ['Tasks', 'Spaces', 'Time Tracking'],
      requiredScopes: ['task:read', 'task:write'],
    },
    // Travel APIs
    {
      id: 'amadeus',
      name: 'Amadeus',
      category: 'travel',
      description: 'Flight and hotel search',
      icon: 'airplane',
      color: '#1B4F9B',
      status: 'disconnected',
      provider: 'Amadeus',
      capabilities: ['Flights', 'Hotels', 'Search'],
      requiredScopes: ['api_key'],
    },
    {
      id: 'skyscanner',
      name: 'Skyscanner',
      category: 'travel',
      description: 'Travel search and comparison',
      icon: 'airplane.departure',
      color: '#00B2D6',
      status: 'disconnected',
      provider: 'Skyscanner',
      capabilities: ['Flights', 'Compare', 'Prices'],
      requiredScopes: ['api_key'],
    },
    {
      id: 'booking',
      name: 'Booking.com',
      category: 'travel',
      description: 'Hotel bookings and search',
      icon: 'bed.double.fill',
      color: '#003580',
      status: 'disconnected',
      provider: 'Booking.com',
      capabilities: ['Hotels', 'Book', 'Reviews'],
      requiredScopes: ['api_key'],
    },
    {
      id: 'googleFlights',
      name: 'Google Flights',
      category: 'travel',
      description: 'Flight search and tracking',
      icon: 'airplane.circle.fill',
      color: '#4285F4',
      status: 'disconnected',
      provider: 'Google',
      capabilities: ['Search', 'Track', 'Alerts'],
      requiredScopes: ['api_key'],
    },
    // Payment Integrations
    {
      id: 'stripe',
      name: 'Stripe',
      category: 'payments',
      description: 'Secure payment processing',
      icon: 'creditcard.fill',
      color: '#635BFF',
      status: 'disconnected',
      provider: 'Stripe',
      capabilities: ['Payments', 'Refunds', 'Subscriptions'],
      requiredScopes: ['api_key'],
    },
    {
      id: 'paypal',
      name: 'PayPal',
      category: 'payments',
      description: 'PayPal payment gateway',
      icon: 'dollarsign.circle.fill',
      color: '#00457C',
      status: 'disconnected',
      provider: 'PayPal',
      capabilities: ['Payments', 'Transfers', 'Invoices'],
      requiredScopes: ['api_key'],
    },
    {
      id: 'applePay',
      name: 'Apple Pay',
      category: 'payments',
      description: 'Apple Pay integration',
      icon: 'apple.logo',
      color: '#000000',
      status: 'disconnected',
      provider: 'Apple',
      capabilities: ['Payments', 'Wallet', 'Secure'],
      requiredScopes: ['merchant_id'],
    },
  ]);

  const [stats, setStats] = useState<IntegrationStats>({
    totalIntegrations: 0,
    connectedIntegrations: 0,
    lastSyncTime: undefined,
    actionsToday: 0,
    errorCount: 0,
  });

  useEffect(() => {
    loadIntegrationStatuses();
    updateStats();
  }, []);

  const loadIntegrationStatuses = async () => {
    const updatedIntegrations = await Promise.all(
      integrations.map(async (integration) => {
        const isConnected = await isIntegrationConnected(integration.id);
        return {
          ...integration,
          status: isConnected ? 'connected' : 'disconnected',
        };
      })
    );
    setIntegrations(updatedIntegrations as Integration[]);
  };

  const updateStats = () => {
    const connected = integrations.filter(i => i.status === 'connected').length;
    setStats({
      totalIntegrations: integrations.length,
      connectedIntegrations: connected,
      lastSyncTime: new Date().toISOString(),
      actionsToday: 0,
      errorCount: 0,
    });
  };

  const handleConnect = async (integrationId: string) => {
    try {
      const success = await initiateOAuthFlow(integrationId);
      if (success) {
        setIntegrations(prev =>
          prev.map(i =>
            i.id === integrationId
              ? { ...i, status: 'connected', connectedAt: new Date().toISOString() }
              : i
          )
        );
        Alert.alert('Success', 'Integration connected successfully!');
        updateStats();
      } else {
        Alert.alert('Error', 'Failed to connect integration. Please try again.');
      }
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Error', 'An error occurred while connecting.');
    }
  };

  const handleDisconnect = async (integrationId: string, integrationName: string) => {
    Alert.alert(
      'Disconnect Integration',
      `Are you sure you want to disconnect ${integrationName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            try {
              await disconnectIntegration(integrationId);
              setIntegrations(prev =>
                prev.map(i =>
                  i.id === integrationId
                    ? { ...i, status: 'disconnected', connectedAt: undefined }
                    : i
                )
              );
              Alert.alert('Success', 'Integration disconnected.');
              updateStats();
            } catch (error) {
              console.error('Disconnect error:', error);
              Alert.alert('Error', 'Failed to disconnect integration.');
            }
          },
        },
      ]
    );
  };

  const handleTest = async (integrationId: string, integrationName: string) => {
    try {
      const success = await testIntegrationConnection(integrationId);
      if (success) {
        Alert.alert('Test Successful', `${integrationName} is working correctly!`);
      } else {
        Alert.alert('Test Failed', `Unable to connect to ${integrationName}.`);
      }
    } catch (error) {
      console.error('Test error:', error);
      Alert.alert('Error', 'An error occurred during testing.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return colors.success;
      case 'error':
        return colors.error;
      case 'pending':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getCategoryIcon = (category: IntegrationCategory) => {
    switch (category) {
      case 'email':
        return 'envelope.fill';
      case 'calendar':
        return 'calendar';
      case 'social':
        return 'person.2.fill';
      case 'messaging':
        return 'message.fill';
      case 'tasks':
        return 'checkmark.circle.fill';
      case 'travel':
        return 'airplane';
      case 'payments':
        return 'creditcard.fill';
      default:
        return 'app.fill';
    }
  };

  const getCategoryTitle = (category: IntegrationCategory) => {
    switch (category) {
      case 'email':
        return 'Email';
      case 'calendar':
        return 'Calendar & Meetings';
      case 'social':
        return 'Social Media';
      case 'messaging':
        return 'Messaging';
      case 'tasks':
        return 'Task & Project Tools';
      case 'travel':
        return 'Travel APIs';
      case 'payments':
        return 'Payments';
      default:
        return 'Other';
    }
  };

  const renderIntegrationsByCategory = (category: IntegrationCategory) => {
    const categoryIntegrations = integrations.filter(i => i.category === category);
    
    if (categoryIntegrations.length === 0) return null;

    return (
      <Animated.View
        entering={FadeInDown.duration(400).delay(100)}
        style={styles.categorySection}
        key={category}
      >
        <View style={styles.categoryHeader}>
          <IconSymbol
            name={getCategoryIcon(category)}
            size={24}
            color={colors.primary}
            style={styles.categoryIcon}
          />
          <Text style={styles.categoryTitle}>{getCategoryTitle(category)}</Text>
          <Text style={styles.categoryCount}>
            {categoryIntegrations.filter(i => i.status === 'connected').length}/
            {categoryIntegrations.length}
          </Text>
        </View>

        {categoryIntegrations.map((integration, index) => (
          <Animated.View
            entering={FadeInDown.duration(400).delay(150 + index * 50)}
            key={integration.id}
          >
            <View style={styles.integrationCard}>
              <View
                style={[
                  styles.integrationIconContainer,
                  { backgroundColor: integration.color + '20' },
                ]}
              >
                <IconSymbol
                  name={integration.icon}
                  size={24}
                  color={integration.color}
                />
              </View>

              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>{integration.name}</Text>
                <Text style={styles.integrationDescription}>
                  {integration.description}
                </Text>
                <View style={styles.capabilitiesRow}>
                  {integration.capabilities.slice(0, 3).map((capability, idx) => (
                    <View key={idx} style={styles.capabilityBadge}>
                      <Text style={styles.capabilityText}>{capability}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.integrationActions}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(integration.status) + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(integration.status) },
                    ]}
                  >
                    {integration.status === 'connected' ? 'Connected' : 'Not Connected'}
                  </Text>
                </View>

                {integration.status === 'connected' ? (
                  <>
                    <Pressable
                      style={styles.testButton}
                      onPress={() => handleTest(integration.id, integration.name)}
                    >
                      <Text style={styles.buttonText}>Test</Text>
                    </Pressable>
                    <Pressable
                      style={styles.disconnectButton}
                      onPress={() => handleDisconnect(integration.id, integration.name)}
                    >
                      <Text style={styles.buttonText}>Disconnect</Text>
                    </Pressable>
                  </>
                ) : (
                  <Pressable
                    style={styles.connectButton}
                    onPress={() => handleConnect(integration.id)}
                  >
                    <Text style={styles.buttonText}>Connect</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </Animated.View>
        ))}
      </Animated.View>
    );
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => {
        Alert.alert(
          'Integration Help',
          'Connect your digital platforms to enable the AI assistant to manage your email, calendar, social media, and more.\n\nAll connections use secure OAuth authentication and your data is encrypted.'
        );
      }}
      style={{ marginRight: 16 }}
    >
      <IconSymbol name="questionmark.circle.fill" size={24} color={colors.primary} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'App Integrations',
          headerShown: true,
          headerLargeTitle: false,
          headerTransparent: false,
          headerBlurEffect: 'regular',
          headerRight: renderHeaderRight,
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400)} style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalIntegrations}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {stats.connectedIntegrations}
              </Text>
              <Text style={styles.statLabel}>Connected</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.textSecondary }]}>
                {stats.totalIntegrations - stats.connectedIntegrations}
              </Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
          </View>
        </Animated.View>

        {renderIntegrationsByCategory('email')}
        {renderIntegrationsByCategory('calendar')}
        {renderIntegrationsByCategory('social')}
        {renderIntegrationsByCategory('messaging')}
        {renderIntegrationsByCategory('tasks')}
        {renderIntegrationsByCategory('travel')}
        {renderIntegrationsByCategory('payments')}
      </ScrollView>
    </View>
  );
}
