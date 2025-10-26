
import Animated, { FadeInDown } from "react-native-reanimated";
import { Stack } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform } from "react-native";
import React, { useState } from "react";
import { IconSymbol } from "@/components/IconSymbol";

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  attendees: string[];
  location: string;
  type: 'scheduled' | 'suggested';
  conflictScore?: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
  score: number;
}

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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
    letterSpacing: -0.5,
  },
  meetingCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 1,
  },
  suggestedCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  meetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  meetingTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    letterSpacing: -0.3,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 8,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  meetingDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailIcon: {
    width: 20,
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    flex: 1,
    letterSpacing: -0.2,
  },
  attendeesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  attendeeChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  attendeeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    letterSpacing: -0.2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    boxShadow: `0px 2px 8px ${colors.shadowMedium}`,
    elevation: 2,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryForeground,
    letterSpacing: -0.2,
  },
  declineButton: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.2,
  },
  conflictWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${colors.warning}15`,
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: `${colors.warning}30`,
  },
  conflictText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.warning,
    flex: 1,
    letterSpacing: -0.2,
  },
  timeSlotsCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 1,
  },
  timeSlotsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  timeSlotsList: {
    gap: 8,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeSlotAvailable: {
    backgroundColor: `${colors.success}10`,
    borderColor: `${colors.success}30`,
  },
  timeSlotTime: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.3,
  },
  timeSlotScore: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  timeSlotScoreHigh: {
    color: colors.success,
  },
});

export default function MeetingsScreen() {
  const [meetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Team Standup',
      date: 'Today',
      time: '10:00 AM',
      duration: '15 min',
      attendees: ['John', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'Tom', 'Anna'],
      location: 'Zoom',
      type: 'scheduled',
    },
    {
      id: '2',
      title: 'Product Review',
      date: 'Today',
      time: '2:00 PM',
      duration: '1 hour',
      attendees: ['Sarah', 'Mike', 'Emily', 'David', 'Lisa'],
      location: 'Conference Room A',
      type: 'scheduled',
    },
    {
      id: '3',
      title: 'Budget Discussion with Finance',
      date: 'Tomorrow',
      time: '11:00 AM',
      duration: '45 min',
      attendees: ['Finance Team', 'You'],
      location: 'Google Meet',
      type: 'suggested',
      conflictScore: 15,
    },
  ]);

  const [optimalTimeSlots] = useState<TimeSlot[]>([
    { time: '9:00 AM - 9:30 AM', available: true, score: 95 },
    { time: '11:30 AM - 12:00 PM', available: true, score: 88 },
    { time: '3:00 PM - 3:30 PM', available: true, score: 82 },
    { time: '4:30 PM - 5:00 PM', available: false, score: 45 },
  ]);

  const handleAcceptSuggestion = (meetingId: string) => {
    console.log('Accepted meeting:', meetingId);
  };

  const handleDeclineSuggestion = (meetingId: string) => {
    console.log('Declined meeting:', meetingId);
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
          <Animated.View 
            entering={FadeInDown.duration(500).delay(100)}
            style={styles.header}
          >
            <Text style={styles.title}>Meetings</Text>
            <Text style={styles.subtitle}>
              AI-powered scheduling to find the best times for everyone.
            </Text>
          </Animated.View>

          {/* Optimal Time Slots */}
          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <Text style={styles.sectionTitle}>Optimal Time Slots</Text>
            <View style={styles.timeSlotsCard}>
              <Text style={styles.timeSlotsTitle}>Best times for scheduling</Text>
              <View style={styles.timeSlotsList}>
                {optimalTimeSlots.map((slot, index) => (
                  <Pressable
                    key={index}
                    style={[
                      styles.timeSlot,
                      slot.available && styles.timeSlotAvailable,
                    ]}
                  >
                    <Text style={styles.timeSlotTime}>{slot.time}</Text>
                    <Text
                      style={[
                        styles.timeSlotScore,
                        slot.score > 80 && styles.timeSlotScoreHigh,
                      ]}
                    >
                      {slot.score}% optimal
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Animated.View>

          {/* Meetings List */}
          <Animated.View entering={FadeInDown.duration(500).delay(300)}>
            <Text style={styles.sectionTitle}>Upcoming Meetings</Text>
            {meetings.map((meeting, index) => (
              <Animated.View
                key={meeting.id}
                entering={FadeInDown.duration(500).delay(400 + index * 50)}
              >
                <View
                  style={[
                    styles.meetingCard,
                    meeting.type === 'suggested' && styles.suggestedCard,
                  ]}
                >
                  <View style={styles.meetingHeader}>
                    <Text style={styles.meetingTitle}>{meeting.title}</Text>
                    <View
                      style={[
                        styles.typeBadge,
                        {
                          backgroundColor:
                            meeting.type === 'suggested'
                              ? `${colors.primary}15`
                              : `${colors.success}15`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.typeBadgeText,
                          {
                            color:
                              meeting.type === 'suggested'
                                ? colors.primary
                                : colors.success,
                          },
                        ]}
                      >
                        {meeting.type}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.meetingDetails}>
                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        <IconSymbol name="calendar" size={16} color={colors.textSecondary} />
                      </View>
                      <Text style={styles.detailText}>
                        {meeting.date} at {meeting.time}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        <IconSymbol name="clock" size={16} color={colors.textSecondary} />
                      </View>
                      <Text style={styles.detailText}>{meeting.duration}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        <IconSymbol name="location" size={16} color={colors.textSecondary} />
                      </View>
                      <Text style={styles.detailText}>{meeting.location}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        <IconSymbol name="person.2" size={16} color={colors.textSecondary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.detailText}>
                          {meeting.attendees.length} attendees
                        </Text>
                        <View style={styles.attendeesList}>
                          {meeting.attendees.slice(0, 4).map((attendee, i) => (
                            <View key={i} style={styles.attendeeChip}>
                              <Text style={styles.attendeeText}>{attendee}</Text>
                            </View>
                          ))}
                          {meeting.attendees.length > 4 && (
                            <View style={styles.attendeeChip}>
                              <Text style={styles.attendeeText}>
                                +{meeting.attendees.length - 4}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>

                  {meeting.conflictScore && meeting.conflictScore > 0 && (
                    <View style={styles.conflictWarning}>
                      <IconSymbol
                        name="exclamationmark.triangle.fill"
                        size={16}
                        color={colors.warning}
                      />
                      <Text style={styles.conflictText}>
                        {meeting.conflictScore}% chance of scheduling conflict
                      </Text>
                    </View>
                  )}

                  {meeting.type === 'suggested' && (
                    <View style={styles.actionButtons}>
                      <Pressable
                        style={styles.acceptButton}
                        onPress={() => handleAcceptSuggestion(meeting.id)}
                      >
                        <Text style={styles.acceptButtonText}>Accept</Text>
                      </Pressable>
                      <Pressable
                        style={styles.declineButton}
                        onPress={() => handleDeclineSuggestion(meeting.id)}
                      >
                        <Text style={styles.declineButtonText}>Decline</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </Animated.View>
            ))}
          </Animated.View>
        </ScrollView>
      </View>
    </>
  );
}
