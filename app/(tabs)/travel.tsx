
import Animated, { FadeInDown } from "react-native-reanimated";
import { Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Image } from "react-native";
import React, { useState } from "react";
import {
  PlusCircle,
  Plane,
  Star,
  Clock,
  Timer,
  Leaf,
  Building2,
  TramFront,
  Car,
  MapPin,
  Search,
  DollarSign,
  LucideIcon,
} from "lucide-react-native";
import { FloatingCard } from "@/components/v2/FloatingCard";
import { StatCard } from "@/components/v2/StatCard";
import { DetailCard } from "@/components/v2/DetailCard";
import { GradientBadge } from "@/components/v2/GradientBadge";

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
    marginBottom: 24,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.cardSecondary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
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
    overflow: 'hidden',
    marginBottom: 16,
    padding: 0,
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
    marginBottom: 16,
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
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCardItem: {
    flex: 1,
    minWidth: '47%',
  },
});

export default function TravelScreen() {
  const theme = useTheme();
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

  const getTypeIcon = (type: string): LucideIcon => {
    switch (type) {
      case 'flight':
        return Plane;
      case 'hotel':
        return Building2;
      case 'train':
        return TramFront;
      case 'car':
        return Car;
      default:
        return MapPin;
    }
  };

  const handleSearch = () => {
    console.log('Searching for travel options to:', destination);
  };

  const handleBookItinerary = () => {
    console.log('Booking itinerary');
  };

  const renderHeaderRight = () => (
    <Pressable style={{ marginRight: 16 }}>
      <PlusCircle size={26} strokeWidth={1.75} color={colors.primary} />
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
      <View style={[styles.container, { backgroundColor: theme.dark ? colors.surfaceMutedDark : colors.surfaceMuted }]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.header}>
            <Text style={[styles.title, { color: theme.dark ? colors.textDark : colors.text }]}>Travel Assistant</Text>
            <Text style={[styles.subtitle, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              Intelligent travel planning powered by AI. We detect your travel needs and find the best options.
            </Text>
          </Animated.View>

          {/* Featured Destination */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)}>
            <FloatingCard radius="xl" style={styles.featuredCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' }}
                style={styles.featuredImage}
                resizeMode="cover"
              />
              <View style={styles.featuredContent}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>Trending</Text>
                </View>
                <Text style={[styles.featuredTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Takin&apos; it back.</Text>
                <Text style={[styles.featuredDescription, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                  We are always happy to share with you. Now is the time for the gift.
                </Text>
                <View style={styles.featuredMeta}>
                  <View style={styles.metaItem}>
                    <Plane size={13} strokeWidth={1.75} color={colors.textMuted} />
                    <Text style={styles.metaText}>3h 30m</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Star size={13} strokeWidth={1.75} color={colors.textMuted} />
                    <Text style={styles.metaText}>4.8</Text>
                  </View>
                </View>
              </View>
            </FloatingCard>
          </Animated.View>

          {/* Search */}
          <Animated.View entering={FadeInDown.duration(600).delay(300)}>
            <FloatingCard radius="xl" style={styles.searchCard}>
              <View style={styles.searchRow}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Where do you want to go?"
                  placeholderTextColor={colors.textMuted}
                  value={destination}
                  onChangeText={setDestination}
                />
                <GradientBadge
                  icon={<Search size={20} color={colors.primaryForeground} strokeWidth={2} />}
                  size={48}
                  onPress={handleSearch}
                />
              </View>
            </FloatingCard>
          </Animated.View>

          {/* Trip Dashboard */}
          <Animated.View entering={FadeInDown.duration(600).delay(400)}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Current Trip</Text>
            </View>
            <View style={styles.statsGrid}>
              <StatCard value={tripDashboard.flightStatus} label="Flight status" style={styles.statCardItem} />
              <StatCard value={tripDashboard.weather} label="Weather" style={styles.statCardItem} />
              <StatCard value={tripDashboard.temperature} label="Temperature" style={styles.statCardItem} />
              <StatCard value={tripDashboard.localTime} label="Local time" style={styles.statCardItem} />
            </View>
          </Animated.View>

          {/* Detected Travel Intents */}
          <Animated.View entering={FadeInDown.duration(600).delay(500)}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Detected Travel Plans</Text>
            </View>
            <FloatingCard radius="lg" style={styles.card}>
              {travelIntents.map((intent, index) => (
                <View
                  key={intent.id}
                  style={[
                    styles.intentItem,
                    index === travelIntents.length - 1 && styles.intentItemLast,
                  ]}
                >
                  <View style={styles.intentHeader}>
                    <Text style={[styles.intentDestination, { color: theme.dark ? colors.textDark : colors.text }]}>{intent.destination}</Text>
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
            </FloatingCard>
          </Animated.View>

          {/* Travel Options */}
          <Animated.View entering={FadeInDown.duration(600).delay(600)}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>Recommended Options</Text>
            </View>
            {travelOptions.map((option) => {
              const stats: { key: string; icon: LucideIcon; label: string }[] = [
                { key: 'type', icon: getTypeIcon(option.type), label: option.type },
                { key: 'price', icon: DollarSign, label: `${option.price} ${option.currency}` },
              ];
              if (option.departureTime) {
                stats.push({ key: 'time', icon: Clock, label: `${option.departureTime} - ${option.arrivalTime}` });
              }
              if (option.duration) {
                stats.push({ key: 'duration', icon: Timer, label: option.duration });
              }
              if (option.rating) {
                stats.push({ key: 'rating', icon: Star, label: `${option.rating} rating` });
              }
              if (option.sustainability) {
                stats.push({ key: 'sustainability', icon: Leaf, label: `${option.sustainability} sustainability` });
              }
              return (
                <DetailCard
                  key={option.id}
                  title={option.provider}
                  subtitle={option.name}
                  stats={stats}
                  style={styles.optionCard}
                />
              );
            })}
          </Animated.View>
        </ScrollView>
      </View>
    </>
  );
}
