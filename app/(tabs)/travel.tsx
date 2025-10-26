
/**
 * Intelligent Travel Assistant
 * 
 * FEATURES:
 * - Auto-detect travel intent from emails, messages, and calendar
 * - Search best travel options (flights, trains, hotels, car rentals)
 * - Compare and rank by cost, time, sustainability, and preferences
 * - Propose complete itinerary with buffer time
 * - Auto-book after user confirmation (optional)
 * - Update calendar and send confirmations
 * - Smart return planning based on next tasks
 * - Real-time trip dashboard (flight status, weather, exchange rate, map)
 * 
 * INTEGRATION POINTS:
 * - Travel APIs: Amadeus, Skyscanner, Booking.com, Google Flights
 * - Calendar: Auto-update with travel plans
 * - Email: Send confirmations and itinerary
 * - Maps: Show meeting locations and directions
 * - Weather: Real-time weather at destination
 * - Currency: Live exchange rates
 * 
 * WORKFLOW:
 * 1. System detects travel need from email/calendar/message
 * 2. Extracts: destination, date, purpose, urgency
 * 3. Searches travel options from multiple providers
 * 4. Ranks options by user preferences and constraints
 * 5. Generates optimal itinerary with buffer time
 * 6. User reviews and confirms booking
 * 7. System books travel and updates calendar
 * 8. Provides real-time dashboard during trip
 * 9. Suggests optimal return time based on schedule
 * 
 * AUTONOMY LEVELS:
 * - Manual: User reviews all options and books manually
 * - Semi-autonomous: System suggests, user confirms
 * - Fully-autonomous: Auto-book within predefined rules
 * 
 * FUTURE ENHANCEMENTS:
 * - Integration with corporate travel policies
 * - Expense tracking and reporting
 * - Travel insurance recommendations
 * - Visa and documentation reminders
 * - Carbon footprint tracking
 * - Team travel coordination
 */

import { colors } from "@/styles/commonStyles";
import React, { useState } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { IconSymbol } from "@/components/IconSymbol";
import { Stack } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, TextInput } from "react-native";

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

export default function TravelScreen() {
  const [activeTab, setActiveTab] = useState<'intents' | 'options' | 'itinerary' | 'dashboard'>('intents');
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const [travelIntents] = useState<TravelIntent[]>([
    {
      id: '1',
      destination: 'Munich, Germany',
      purpose: 'Investor meeting',
      date: 'Tomorrow, 9:00 AM',
      detectedFrom: 'email',
      status: 'searching',
      urgency: 'urgent',
    },
    {
      id: '2',
      destination: 'Berlin, Germany',
      purpose: 'Client demo',
      date: 'Next Monday, 2:00 PM',
      detectedFrom: 'calendar',
      status: 'pending',
      urgency: 'normal',
    },
    {
      id: '3',
      destination: 'Paris, France',
      purpose: 'Conference',
      date: 'March 15-17',
      detectedFrom: 'email',
      status: 'pending',
      urgency: 'flexible',
    },
  ]);

  const [travelOptions] = useState<TravelOption[]>([
    {
      id: '1',
      type: 'flight',
      provider: 'Lufthansa',
      name: 'LH203',
      departureTime: '06:00',
      arrivalTime: '07:10',
      duration: '1h 10m',
      price: 120,
      currency: '€',
      sustainability: 'medium',
    },
    {
      id: '2',
      type: 'flight',
      provider: 'Air France',
      name: 'AF1234',
      departureTime: '07:30',
      arrivalTime: '08:45',
      duration: '1h 15m',
      price: 95,
      currency: '€',
      sustainability: 'high',
    },
    {
      id: '3',
      type: 'train',
      provider: 'Deutsche Bahn',
      name: 'ICE 123',
      departureTime: '05:45',
      arrivalTime: '09:30',
      duration: '3h 45m',
      price: 65,
      currency: '€',
      sustainability: 'high',
    },
    {
      id: '4',
      type: 'hotel',
      provider: 'Hilton',
      name: 'Hilton Munich City',
      checkIn: 'Tomorrow, 14:00',
      checkOut: 'Tomorrow, 11:00',
      price: 150,
      currency: '€',
      rating: 4.5,
      distance: '2 min walk from meeting',
    },
    {
      id: '5',
      type: 'car',
      provider: 'Sixt',
      name: 'Economy Car',
      duration: '1 day',
      price: 45,
      currency: '€',
      rating: 4.2,
    },
  ]);

  const [itinerary] = useState<Itinerary>({
    id: '1',
    destination: 'Munich, Germany',
    date: 'Tomorrow',
    flights: [
      {
        id: '1',
        type: 'flight',
        provider: 'Lufthansa',
        name: 'LH203',
        departureTime: '06:00',
        arrivalTime: '07:10',
        duration: '1h 10m',
        price: 120,
        currency: '€',
      },
      {
        id: '6',
        type: 'flight',
        provider: 'Lufthansa',
        name: 'LH208',
        departureTime: '17:30',
        arrivalTime: '18:45',
        duration: '1h 15m',
        price: 100,
        currency: '€',
      },
    ],
    hotel: {
      id: '4',
      type: 'hotel',
      provider: 'Hilton',
      name: 'Hilton Munich City',
      checkIn: 'Tomorrow, 14:00',
      checkOut: 'Tomorrow, 11:00',
      price: 150,
      currency: '€',
      rating: 4.5,
      distance: '2 min walk from meeting',
    },
    totalCost: 370,
    travelTime: '5h 25m',
    bufferTime: '1h 50m before meeting',
    returnDate: 'Tomorrow, 17:30',
  });

  const [dashboard] = useState<TripDashboard>({
    flightStatus: 'On time',
    weather: 'Partly cloudy',
    temperature: '12°C',
    exchangeRate: '1 EUR = 1.09 USD',
    localTime: '08:45 AM',
    meetingLocation: 'Maximilianstraße 35, Munich',
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return colors.error;
      case 'normal': return colors.warning;
      case 'flexible': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return colors.textSecondary;
      case 'searching': return colors.warning;
      case 'booked': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return 'airplane';
      case 'train': return 'tram.fill';
      case 'hotel': return 'bed.double.fill';
      case 'car': return 'car.fill';
      default: return 'mappin.circle.fill';
    }
  };

  const getSustainabilityColor = (sustainability?: string) => {
    switch (sustainability) {
      case 'high': return colors.success;
      case 'medium': return colors.warning;
      case 'low': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    console.log('Searching travel options for:', searchQuery);
    
    setTimeout(() => {
      setSearching(false);
      setSearchQuery('');
      console.log('Search complete');
    }, 2000);
  };

  const handleBookItinerary = () => {
    console.log('Booking itinerary:', itinerary.destination);
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log('Open travel settings')}
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
            title: "Travel Assistant",
            headerRight: renderHeaderRight,
          }}
        />
      )}
      <View style={styles.container}>
        {/* Header for Android/Web */}
        {Platform.OS !== 'ios' && (
          <View style={styles.headerContainer}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>Travel Assistant</Text>
              <Pressable
                onPress={() => console.log('Open travel settings')}
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
            style={[styles.tab, activeTab === 'intents' && styles.activeTab]}
            onPress={() => setActiveTab('intents')}
          >
            <IconSymbol 
              name="airplane.departure" 
              size={20} 
              color={activeTab === 'intents' ? colors.primary : colors.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'intents' && styles.activeTabText]}>
              Trips
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'options' && styles.activeTab]}
            onPress={() => setActiveTab('options')}
          >
            <IconSymbol 
              name="list.bullet" 
              size={20} 
              color={activeTab === 'options' ? colors.primary : colors.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'options' && styles.activeTabText]}>
              Options
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'itinerary' && styles.activeTab]}
            onPress={() => setActiveTab('itinerary')}
          >
            <IconSymbol 
              name="map.fill" 
              size={20} 
              color={activeTab === 'itinerary' ? colors.primary : colors.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'itinerary' && styles.activeTabText]}>
              Plan
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
            onPress={() => setActiveTab('dashboard')}
          >
            <IconSymbol 
              name="chart.bar.fill" 
              size={20} 
              color={activeTab === 'dashboard' ? colors.primary : colors.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>
              Live
            </Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Section */}
          {activeTab === 'intents' && (
            <Animated.View entering={FadeInDown.delay(100)} style={styles.searchSection}>
              <View style={styles.searchHeader}>
                <IconSymbol name="magnifyingglass" color={colors.secondary} size={24} />
                <Text style={styles.searchTitle}>Search Travel</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 'Meeting in Berlin tomorrow'"
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Pressable
                style={[styles.searchButton, searching && styles.searchingButton]}
                onPress={handleSearch}
                disabled={searching || !searchQuery.trim()}
              >
                {searching ? (
                  <>
                    <IconSymbol name="arrow.triangle.2.circlepath" size={20} color={colors.card} />
                    <Text style={styles.searchButtonText}>Searching...</Text>
                  </>
                ) : (
                  <>
                    <IconSymbol name="airplane.departure" size={20} color={colors.card} />
                    <Text style={styles.searchButtonText}>Find Options</Text>
                  </>
                )}
              </Pressable>
            </Animated.View>
          )}

          {/* Travel Intents Tab */}
          {activeTab === 'intents' && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Detected Travel Needs</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{travelIntents.filter(t => t.status === 'pending').length}</Text>
                </View>
              </View>

              {travelIntents.map((intent, index) => (
                <Animated.View
                  key={intent.id}
                  entering={FadeInDown.delay(200 + index * 100)}
                >
                  <Pressable
                    style={styles.card}
                    onPress={() => console.log('Intent pressed:', intent.destination)}
                  >
                    <View style={styles.intentHeader}>
                      <View style={styles.intentTitleRow}>
                        <IconSymbol name="airplane.departure" size={24} color={colors.primary} />
                        <Text style={styles.intentDestination}>{intent.destination}</Text>
                      </View>
                      <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(intent.urgency) + '20' }]}>
                        <Text style={[styles.urgencyText, { color: getUrgencyColor(intent.urgency) }]}>
                          {intent.urgency}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.intentPurpose}>{intent.purpose}</Text>

                    <View style={styles.intentFooter}>
                      <View style={styles.dateContainer}>
                        <IconSymbol name="calendar" color={colors.textSecondary} size={14} />
                        <Text style={styles.dateText}>{intent.date}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(intent.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(intent.status) }]}>
                          {intent.status}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detectedFromContainer}>
                      <IconSymbol name="info.circle" color={colors.info} size={14} />
                      <Text style={styles.detectedFromText}>
                        Detected from {intent.detectedFrom}
                      </Text>
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
            </>
          )}

          {/* Travel Options Tab */}
          {activeTab === 'options' && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Available Options</Text>
              </View>

              <Animated.View entering={FadeInDown.delay(100)} style={styles.filterInfo}>
                <IconSymbol name="slider.horizontal.3" size={20} color={colors.primary} />
                <Text style={styles.filterText}>Sorted by: Cost, Time, Sustainability</Text>
              </Animated.View>

              {travelOptions.map((option, index) => (
                <Animated.View
                  key={option.id}
                  entering={FadeInDown.delay(200 + index * 100)}
                >
                  <Pressable
                    style={styles.optionCard}
                    onPress={() => console.log('Option selected:', option.name)}
                  >
                    <View style={styles.optionHeader}>
                      <View style={[styles.typeIcon, { backgroundColor: colors.primary + '20' }]}>
                        <IconSymbol name={getTypeIcon(option.type)} size={24} color={colors.primary} />
                      </View>
                      <View style={styles.optionInfo}>
                        <Text style={styles.optionProvider}>{option.provider}</Text>
                        <Text style={styles.optionName}>{option.name}</Text>
                      </View>
                      <View style={styles.priceContainer}>
                        <Text style={styles.priceAmount}>{option.currency}{option.price}</Text>
                        <Text style={styles.priceLabel}>total</Text>
                      </View>
                    </View>

                    {(option.departureTime || option.checkIn) && (
                      <View style={styles.optionDetails}>
                        {option.departureTime && (
                          <View style={styles.timeRow}>
                            <View style={styles.timeItem}>
                              <Text style={styles.timeLabel}>Departure</Text>
                              <Text style={styles.timeValue}>{option.departureTime}</Text>
                            </View>
                            <IconSymbol name="arrow.right" size={16} color={colors.textSecondary} />
                            <View style={styles.timeItem}>
                              <Text style={styles.timeLabel}>Arrival</Text>
                              <Text style={styles.timeValue}>{option.arrivalTime}</Text>
                            </View>
                            <View style={styles.durationBadge}>
                              <Text style={styles.durationText}>{option.duration}</Text>
                            </View>
                          </View>
                        )}
                        {option.checkIn && (
                          <View style={styles.hotelDetails}>
                            <View style={styles.hotelInfo}>
                              <Text style={styles.hotelLabel}>Check-in: {option.checkIn}</Text>
                              <Text style={styles.hotelLabel}>Check-out: {option.checkOut}</Text>
                            </View>
                            {option.distance && (
                              <Text style={styles.distanceText}>{option.distance}</Text>
                            )}
                          </View>
                        )}
                      </View>
                    )}

                    <View style={styles.optionFooter}>
                      {option.sustainability && (
                        <View style={styles.sustainabilityContainer}>
                          <IconSymbol name="leaf.fill" size={14} color={getSustainabilityColor(option.sustainability)} />
                          <Text style={[styles.sustainabilityText, { color: getSustainabilityColor(option.sustainability) }]}>
                            {option.sustainability} carbon
                          </Text>
                        </View>
                      )}
                      {option.rating && (
                        <View style={styles.ratingContainer}>
                          <IconSymbol name="star.fill" size={14} color={colors.warning} />
                          <Text style={styles.ratingText}>{option.rating}</Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
            </>
          )}

          {/* Itinerary Tab */}
          {activeTab === 'itinerary' && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Proposed Itinerary</Text>
              </View>

              <Animated.View entering={FadeInDown.delay(100)} style={styles.itineraryCard}>
                <View style={styles.itineraryHeader}>
                  <View>
                    <Text style={styles.itineraryDestination}>{itinerary.destination}</Text>
                    <Text style={styles.itineraryDate}>{itinerary.date}</Text>
                  </View>
                  <View style={styles.totalCostContainer}>
                    <Text style={styles.totalCostLabel}>Total</Text>
                    <Text style={styles.totalCostAmount}>€{itinerary.totalCost}</Text>
                  </View>
                </View>

                <View style={styles.itinerarySection}>
                  <View style={styles.itinerarySectionHeader}>
                    <IconSymbol name="airplane" size={20} color={colors.primary} />
                    <Text style={styles.itinerarySectionTitle}>Flights</Text>
                  </View>
                  {itinerary.flights.map((flight, idx) => (
                    <View key={flight.id} style={styles.itineraryItem}>
                      <View style={styles.itineraryItemHeader}>
                        <Text style={styles.itineraryItemTitle}>
                          {idx === 0 ? 'Outbound' : 'Return'} - {flight.name}
                        </Text>
                        <Text style={styles.itineraryItemPrice}>{flight.currency}{flight.price}</Text>
                      </View>
                      <Text style={styles.itineraryItemDetails}>
                        {flight.departureTime} → {flight.arrivalTime} ({flight.duration})
                      </Text>
                    </View>
                  ))}
                </View>

                {itinerary.hotel && (
                  <View style={styles.itinerarySection}>
                    <View style={styles.itinerarySectionHeader}>
                      <IconSymbol name="bed.double.fill" size={20} color={colors.secondary} />
                      <Text style={styles.itinerarySectionTitle}>Accommodation</Text>
                    </View>
                    <View style={styles.itineraryItem}>
                      <View style={styles.itineraryItemHeader}>
                        <Text style={styles.itineraryItemTitle}>{itinerary.hotel.name}</Text>
                        <Text style={styles.itineraryItemPrice}>{itinerary.hotel.currency}{itinerary.hotel.price}</Text>
                      </View>
                      <Text style={styles.itineraryItemDetails}>{itinerary.hotel.distance}</Text>
                    </View>
                  </View>
                )}

                <View style={styles.itinerarySummary}>
                  <View style={styles.summaryItem}>
                    <IconSymbol name="clock.fill" size={16} color={colors.info} />
                    <Text style={styles.summaryText}>Travel time: {itinerary.travelTime}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <IconSymbol name="timer" size={16} color={colors.success} />
                    <Text style={styles.summaryText}>Buffer: {itinerary.bufferTime}</Text>
                  </View>
                </View>

                <Pressable style={styles.bookButton} onPress={handleBookItinerary}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.card} />
                  <Text style={styles.bookButtonText}>Book & Update Calendar</Text>
                </Pressable>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(300)} style={styles.returnPlanningCard}>
                <View style={styles.returnHeader}>
                  <IconSymbol name="arrow.uturn.backward.circle.fill" size={24} color={colors.accent} />
                  <Text style={styles.returnTitle}>Smart Return Planning</Text>
                </View>
                <Text style={styles.returnDescription}>
                  Based on your next scheduled tasks, the optimal return time is {itinerary.returnDate}.
                </Text>
                <Pressable style={styles.adjustButton}>
                  <Text style={styles.adjustButtonText}>Adjust Return Time</Text>
                </Pressable>
              </Animated.View>
            </>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Real-Time Trip Dashboard</Text>
              </View>

              <Animated.View entering={FadeInDown.delay(100)} style={styles.dashboardCard}>
                <View style={styles.dashboardHeader}>
                  <IconSymbol name="airplane.departure" size={28} color={colors.primary} />
                  <Text style={styles.dashboardTitle}>Munich Trip</Text>
                </View>

                <View style={styles.dashboardGrid}>
                  <View style={styles.dashboardItem}>
                    <IconSymbol name="airplane.circle.fill" size={32} color={colors.success} />
                    <Text style={styles.dashboardLabel}>Flight Status</Text>
                    <Text style={styles.dashboardValue}>{dashboard.flightStatus}</Text>
                  </View>
                  <View style={styles.dashboardItem}>
                    <IconSymbol name="cloud.sun.fill" size={32} color={colors.warning} />
                    <Text style={styles.dashboardLabel}>Weather</Text>
                    <Text style={styles.dashboardValue}>{dashboard.weather}</Text>
                    <Text style={styles.dashboardSubvalue}>{dashboard.temperature}</Text>
                  </View>
                  <View style={styles.dashboardItem}>
                    <IconSymbol name="dollarsign.circle.fill" size={32} color={colors.accent} />
                    <Text style={styles.dashboardLabel}>Exchange Rate</Text>
                    <Text style={styles.dashboardValue}>{dashboard.exchangeRate}</Text>
                  </View>
                  <View style={styles.dashboardItem}>
                    <IconSymbol name="clock.fill" size={32} color={colors.info} />
                    <Text style={styles.dashboardLabel}>Local Time</Text>
                    <Text style={styles.dashboardValue}>{dashboard.localTime}</Text>
                  </View>
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(200)} style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <IconSymbol name="mappin.circle.fill" size={24} color={colors.error} />
                  <Text style={styles.locationTitle}>Meeting Location</Text>
                </View>
                <Text style={styles.locationAddress}>{dashboard.meetingLocation}</Text>
                <Pressable style={styles.mapButton}>
                  <IconSymbol name="map.fill" size={18} color={colors.primary} />
                  <Text style={styles.mapButtonText}>Open in Maps</Text>
                </Pressable>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(300)} style={styles.notificationCard}>
                <IconSymbol name="bell.badge.fill" size={24} color={colors.warning} />
                <Text style={styles.notificationText}>
                  You&apos;ll receive real-time updates about flight delays, gate changes, and traffic conditions.
                </Text>
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
  searchSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  searchTitle: {
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
    marginBottom: 12,
  },
  searchButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  searchingButton: {
    opacity: 0.7,
  },
  searchButtonText: {
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
  intentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  intentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  intentDestination: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  intentPurpose: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 12,
  },
  intentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 13,
    color: colors.textSecondary,
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
  detectedFromContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detectedFromText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  filterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  filterText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  optionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionProvider: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  priceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  optionDetails: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeItem: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  durationBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  hotelDetails: {
    gap: 8,
  },
  hotelInfo: {
    gap: 4,
  },
  hotelLabel: {
    fontSize: 13,
    color: colors.text,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
  optionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sustainabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sustainabilityText: {
    fontSize: 13,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  itineraryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  itineraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itineraryDestination: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  itineraryDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  totalCostContainer: {
    alignItems: 'flex-end',
  },
  totalCostLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  totalCostAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  itinerarySection: {
    marginBottom: 16,
  },
  itinerarySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  itinerarySectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  itineraryItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itineraryItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itineraryItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  itineraryItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  itineraryItemDetails: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  itinerarySummary: {
    backgroundColor: colors.highlight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryText: {
    fontSize: 14,
    color: colors.text,
  },
  bookButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
  returnPlanningCard: {
    backgroundColor: colors.accent + '15',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  returnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  returnTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  returnDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  adjustButton: {
    backgroundColor: colors.card,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  adjustButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  dashboardCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dashboardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dashboardItem: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  dashboardLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  dashboardValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  dashboardSubvalue: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  locationCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  locationAddress: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 12,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary + '15',
    paddingVertical: 10,
    borderRadius: 8,
  },
  mapButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  notificationCard: {
    backgroundColor: colors.warning + '15',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});
