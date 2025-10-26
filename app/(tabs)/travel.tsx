
import Animated, { FadeInDown } from "react-native-reanimated";
import { Stack } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, TextInput, Image } from "react-native";
import React, { useState } from "react";
import { IconSymbol } from "@/components/IconSymbol";

interface TravelIntent {
  id: string;
  destination: string;
  purpose: string;
  date: string;
  detectedFrom: 'email' | 'calendar' | 'message';
  status: 'pending' | 'searching' | 'booked';
  urgency: 'urgent' | 'normal' | 'flexible';
}

interface TravelOption {
  id: string;
  type: 'flight' | 'train' | 'hotel' | 'car';
  provider: string;
  name: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  price: number;
  currency: string;
  rating?: number;
  sustainability?: 'high' | 'medium' | 'low';
  distance?: string;
  checkIn?: string;
  checkOut?: string;
}

interface Itinerary {
  id: string;
  destination: string;
  date: string;
  flights: TravelOption[];
  hotel?: TravelOption;
  transport?: TravelOption;
  totalCost: number;
  travelTime: string;
  bufferTime: string;
  returnDate?: string;
}

interface TripDashboard {
  flightStatus: string;
  weather: string;
  temperature: string;
  exchangeRate: string;
  localTime: string;
  meetingLocation: string;
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
  searchCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    boxShadow: `0px 8px 24px ${colors.shadow}`,
    elevation: 3,
  },
  searchInput: {
    backgroundColor: colors.cardSecondary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    boxShadow: `0px 6px 20px ${colors.shadow}`,
    elevation: 3,
  },
  searchButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.card,
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
  featuredCard: {
    backgroundColor: colors.card,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 16,
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
    marginBottom: 16,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    boxShadow: `0px 6px 20px ${colors.shadow}`,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.3,
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
  intentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  intentItemLast: {
    borderBottomWidth: 0,
  },
  intentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  intentDestination: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  intentDetails: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  intentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionCard: {
    backgroundColor: colors.cardSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionProvider: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  optionPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  optionDetails: {
    gap: 6,
  },
  optionDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionDetailText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    boxShadow: `0px 6px 20px ${colors.shadow}`,
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
});

export default function TravelScreen() {
  const [destination, setDestination] = useState('');
  const [travelIntents] = useState<TravelIntent[]>([
    {
      id: '1',
      destination: 'San Francisco',
      purpose: 'Business Meeting',
      date: 'Dec 15, 2024',
      detectedFrom: 'email',
      status: 'pending',
      urgency: 'urgent',
    },
    {
      id: '2',
      destination: 'Tokyo',
      purpose: 'Conference',
      date: 'Jan 20, 2025',
      detectedFrom: 'calendar',
      status: 'searching',
      urgency: 'normal',
    },
  ]);

  const [travelOptions] = useState<TravelOption[]>([
    {
      id: '1',
      type: 'flight',
      provider: 'United Airlines',
      name: 'UA 1234',
      departureTime: '10:00 AM',
      arrivalTime: '1:30 PM',
      duration: '3h 30m',
      price: 450,
      currency: 'USD',
      sustainability: 'high',
    },
    {
      id: '2',
      type: 'hotel',
      provider: 'Marriott',
      name: 'Marriott Downtown',
      checkIn: 'Dec 15',
      checkOut: 'Dec 17',
      price: 280,
      currency: 'USD',
      rating: 4.5,
    },
  ]);

  const [tripDashboard] = useState<TripDashboard>({
    flightStatus: 'On Time',
    weather: 'Sunny',
    temperature: '72°F',
    exchangeRate: '1 USD = 0.85 EUR',
    localTime: '10:30 AM',
    meetingLocation: '123 Market St',
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return colors.error;
      case 'normal':
        return colors.warning;
      case 'flexible':
        return colors.success;
      default:
        return colors.textMuted;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return colors.success;
      case 'searching':
        return colors.info;
      case 'pending':
        return colors.warning;
      default:
        return colors.textMuted;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return 'airplane';
      case 'hotel':
        return 'building.2';
      case 'train':
        return 'tram';
      case 'car':
        return 'car';
      default:
        return 'mappin';
    }
  };

  const getSustainabilityColor = () => {
    return colors.success;
  };

  const handleSearch = () => {
    console.log('Searching for travel options to:', destination);
  };

  const handleBookItinerary = () => {
    console.log('Booking itinerary');
  };

  const renderHeaderRight = () => (
    <Pressable style={{ marginRight: 16 }}>
      <IconSymbol name="plus.circle.fill" size={28} color={colors.primary} />
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
            <Text style={styles.title}>Travel Assistant</Text>
            <Text style={styles.subtitle}>
              Intelligent travel planning powered by AI. We detect your travel needs and find the best options.
            </Text>
          </Animated.View>

          {/* Featured Destination */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)}>
            <View style={styles.featuredCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' }}
                style={styles.featuredImage}
                resizeMode="cover"
              />
              <View style={styles.featuredContent}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>Trending</Text>
                </View>
                <Text style={styles.featuredTitle}>Takin&apos; it back.</Text>
                <Text style={styles.featuredDescription}>
                  We are always happy to share with you. Now is the time for the gift.
                </Text>
                <View style={styles.featuredMeta}>
                  <View style={styles.metaItem}>
                    <IconSymbol name="airplane" size={14} color={colors.textMuted} />
                    <Text style={styles.metaText}>3h 30m</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <IconSymbol name="star.fill" size={14} color={colors.textMuted} />
                    <Text style={styles.metaText}>4.8</Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Search */}
          <Animated.View entering={FadeInDown.duration(600).delay(300)}>
            <View style={styles.searchCard}>
              <TextInput
                style={styles.searchInput}
                placeholder="Where do you want to go?"
                placeholderTextColor={colors.textMuted}
                value={destination}
                onChangeText={setDestination}
              />
              <Pressable style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Search Destinations</Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Trip Dashboard */}
          <Animated.View entering={FadeInDown.duration(600).delay(400)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Current Trip</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Flight Status</Text>
                <Text style={styles.statValue}>{tripDashboard.flightStatus}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Weather</Text>
                <Text style={styles.statValue}>{tripDashboard.weather}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Temperature</Text>
                <Text style={styles.statValue}>{tripDashboard.temperature}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Local Time</Text>
                <Text style={styles.statValue}>{tripDashboard.localTime}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Detected Travel Intents */}
          <Animated.View entering={FadeInDown.duration(600).delay(500)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Detected Travel Plans</Text>
            </View>
            <View style={styles.card}>
              {travelIntents.map((intent, index) => (
                <View
                  key={intent.id}
                  style={[
                    styles.intentItem,
                    index === travelIntents.length - 1 && styles.intentItemLast,
                  ]}
                >
                  <View style={styles.intentHeader}>
                    <Text style={styles.intentDestination}>{intent.destination}</Text>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: getStatusColor(intent.status) + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          { color: getStatusColor(intent.status) },
                        ]}
                      >
                        {intent.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.intentDetails}>
                    {intent.purpose} • {intent.date}
                  </Text>
                  <View style={styles.intentMeta}>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: getUrgencyColor(intent.urgency) + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          { color: getUrgencyColor(intent.urgency) },
                        ]}
                      >
                        {intent.urgency}
                      </Text>
                    </View>
                    <Text style={styles.metaText}>From {intent.detectedFrom}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Travel Options */}
          <Animated.View entering={FadeInDown.duration(600).delay(600)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended Options</Text>
            </View>
            {travelOptions.map((option) => (
              <View key={option.id} style={styles.optionCard}>
                <View style={styles.optionHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <IconSymbol
                      name={getTypeIcon(option.type)}
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.optionProvider}>{option.provider}</Text>
                  </View>
                  <Text style={styles.optionPrice}>
                    ${option.price} {option.currency}
                  </Text>
                </View>
                <View style={styles.optionDetails}>
                  {option.departureTime && (
                    <View style={styles.optionDetailRow}>
                      <IconSymbol name="clock" size={14} color={colors.textSecondary} />
                      <Text style={styles.optionDetailText}>
                        {option.departureTime} - {option.arrivalTime}
                      </Text>
                    </View>
                  )}
                  {option.duration && (
                    <View style={styles.optionDetailRow}>
                      <IconSymbol name="timer" size={14} color={colors.textSecondary} />
                      <Text style={styles.optionDetailText}>{option.duration}</Text>
                    </View>
                  )}
                  {option.rating && (
                    <View style={styles.optionDetailRow}>
                      <IconSymbol name="star.fill" size={14} color={colors.textSecondary} />
                      <Text style={styles.optionDetailText}>{option.rating} rating</Text>
                    </View>
                  )}
                  {option.sustainability && (
                    <View style={styles.optionDetailRow}>
                      <IconSymbol name="leaf.fill" size={14} color={getSustainabilityColor()} />
                      <Text style={[styles.optionDetailText, { color: getSustainabilityColor() }]}>
                        {option.sustainability} sustainability
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </Animated.View>
        </ScrollView>
      </View>
    </>
  );
}
