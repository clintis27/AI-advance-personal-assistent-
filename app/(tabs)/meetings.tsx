
import React, { useState } from "react";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform } from "react-native";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import Animated, { FadeInUp } from "react-native-reanimated";

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

export default function MeetingsScreen() {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Team Standup',
      date: 'Today',
      time: '10:00 AM',
      duration: '30 min',
      attendees: ['Sarah', 'John', 'Mike', 'Emma', 'Lisa', 'Tom', 'Kate', 'Alex'],
      location: 'Conference Room A',
      type: 'scheduled',
    },
    {
      id: '2',
      title: 'Client Presentation',
      date: 'Today',
      time: '2:30 PM',
      duration: '1 hour',
      attendees: ['Client Team', 'Sarah', 'John', 'You'],
      location: 'Virtual - Zoom',
      type: 'scheduled',
    },
    {
      id: '3',
      title: 'Project Review with Marketing',
      date: 'Tomorrow',
      time: '11:00 AM',
      duration: '45 min',
      attendees: ['Marketing Team', 'You'],
      location: 'Conference Room B',
      type: 'suggested',
      conflictScore: 85,
    },
    {
      id: '4',
      title: 'One-on-One with Manager',
      date: 'Tomorrow',
      time: '3:00 PM',
      duration: '30 min',
      attendees: ['Manager', 'You'],
      location: 'Manager Office',
      type: 'suggested',
      conflictScore: 92,
    },
  ]);

  const [suggestedSlots] = useState<TimeSlot[]>([
    { time: '9:00 AM', available: true, score: 88 },
    { time: '11:30 AM', available: true, score: 95 },
    { time: '1:00 PM', available: false, score: 45 },
    { time: '3:30 PM', available: true, score: 78 },
    { time: '4:30 PM', available: true, score: 82 },
  ]);

  const handleAcceptSuggestion = (meetingId: string) => {
    setMeetings(meetings.map(meeting => 
      meeting.id === meetingId ? { ...meeting, type: 'scheduled' as const } : meeting
    ));
    console.log('Meeting accepted:', meetingId);
  };

  const handleDeclineSuggestion = (meetingId: string) => {
    setMeetings(meetings.filter(meeting => meeting.id !== meetingId));
    console.log('Meeting declined:', meetingId);
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log('Add new meeting')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="plus" color={colors.primary} size={24} />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Meetings",
          headerShown: Platform.OS === 'ios',
          headerRight: renderHeaderRight,
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* AI Suggested Time Slots */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="sparkles" color={colors.secondary} size={24} />
              <Text style={styles.sectionTitle}>AI Suggested Time Slots</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardSubtitle}>
                Based on your productivity patterns and calendar
              </Text>
              <View style={styles.slotsContainer}>
                {suggestedSlots.map((slot, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.timeSlot,
                      !slot.available && styles.unavailableSlot
                    ]}
                  >
                    <View style={styles.slotInfo}>
                      <Text style={[
                        styles.slotTime,
                        !slot.available && styles.unavailableText
                      ]}>
                        {slot.time}
                      </Text>
                      {slot.available && (
                        <View style={styles.scoreContainer}>
                          <View style={styles.scoreBar}>
                            <View 
                              style={[
                                styles.scoreFill,
                                { width: `${slot.score}%` }
                              ]} 
                            />
                          </View>
                          <Text style={styles.scoreText}>{slot.score}%</Text>
                        </View>
                      )}
                    </View>
                    {slot.available ? (
                      <IconSymbol name="checkmark.circle.fill" color={colors.accent} size={20} />
                    ) : (
                      <IconSymbol name="xmark.circle.fill" color={colors.textSecondary} size={20} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>

          {/* Scheduled Meetings */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="calendar" color={colors.primary} size={24} />
              <Text style={styles.sectionTitle}>Your Schedule</Text>
            </View>
            {meetings.filter(m => m.type === 'scheduled').map((meeting, index) => (
              <Pressable 
                key={meeting.id} 
                style={styles.meetingCard}
                onPress={() => console.log('Meeting pressed:', meeting.title)}
              >
                <View style={styles.meetingHeader}>
                  <View style={styles.meetingTitleRow}>
                    <View style={[styles.meetingDot, { backgroundColor: colors.primary }]} />
                    <Text style={styles.meetingTitle}>{meeting.title}</Text>
                  </View>
                </View>

                <View style={styles.meetingDetails}>
                  <View style={styles.detailRow}>
                    <IconSymbol name="clock.fill" color={colors.textSecondary} size={16} />
                    <Text style={styles.detailText}>
                      {meeting.date} at {meeting.time} ({meeting.duration})
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <IconSymbol name="location.fill" color={colors.textSecondary} size={16} />
                    <Text style={styles.detailText}>{meeting.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <IconSymbol name="person.2.fill" color={colors.textSecondary} size={16} />
                    <Text style={styles.detailText}>
                      {meeting.attendees.length} attendees
                    </Text>
                  </View>
                </View>

                <View style={styles.attendeesPreview}>
                  {meeting.attendees.slice(0, 3).map((attendee, idx) => (
                    <View 
                      key={idx} 
                      style={[
                        styles.attendeeAvatar,
                        { marginLeft: idx > 0 ? -8 : 0 }
                      ]}
                    >
                      <Text style={styles.attendeeInitial}>
                        {attendee.charAt(0)}
                      </Text>
                    </View>
                  ))}
                  {meeting.attendees.length > 3 && (
                    <View style={[styles.attendeeAvatar, { marginLeft: -8 }]}>
                      <Text style={styles.attendeeInitial}>
                        +{meeting.attendees.length - 3}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </Animated.View>

          {/* AI Suggested Meetings */}
          {meetings.filter(m => m.type === 'suggested').length > 0 && (
            <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconSymbol name="wand.and.stars" color={colors.accent} size={24} />
                <Text style={styles.sectionTitle}>AI Suggestions</Text>
              </View>
              {meetings.filter(m => m.type === 'suggested').map((meeting) => (
                <View key={meeting.id} style={[styles.meetingCard, styles.suggestedCard]}>
                  <View style={styles.suggestionBadge}>
                    <IconSymbol name="sparkles" color={colors.card} size={12} />
                    <Text style={styles.suggestionBadgeText}>
                      {meeting.conflictScore}% optimal
                    </Text>
                  </View>

                  <View style={styles.meetingHeader}>
                    <View style={styles.meetingTitleRow}>
                      <View style={[styles.meetingDot, { backgroundColor: colors.accent }]} />
                      <Text style={styles.meetingTitle}>{meeting.title}</Text>
                    </View>
                  </View>

                  <View style={styles.meetingDetails}>
                    <View style={styles.detailRow}>
                      <IconSymbol name="clock.fill" color={colors.textSecondary} size={16} />
                      <Text style={styles.detailText}>
                        {meeting.date} at {meeting.time} ({meeting.duration})
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <IconSymbol name="location.fill" color={colors.textSecondary} size={16} />
                      <Text style={styles.detailText}>{meeting.location}</Text>
                    </View>
                  </View>

                  <View style={styles.suggestionActions}>
                    <Pressable 
                      style={[styles.actionButton, styles.declineButton]}
                      onPress={() => handleDeclineSuggestion(meeting.id)}
                    >
                      <IconSymbol name="xmark" color={colors.error} size={16} />
                      <Text style={[styles.actionButtonText, { color: colors.error }]}>
                        Decline
                      </Text>
                    </Pressable>
                    <Pressable 
                      style={[styles.actionButton, styles.acceptButton]}
                      onPress={() => handleAcceptSuggestion(meeting.id)}
                    >
                      <IconSymbol name="checkmark" color={colors.card} size={16} />
                      <Text style={[styles.actionButtonText, { color: colors.card }]}>
                        Accept
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </Animated.View>
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
  headerButtonContainer: {
    padding: 8,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  slotsContainer: {
    gap: 8,
  },
  timeSlot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  unavailableSlot: {
    opacity: 0.5,
  },
  slotInfo: {
    flex: 1,
  },
  slotTime: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  unavailableText: {
    color: colors.textSecondary,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    minWidth: 35,
  },
  meetingCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  suggestedCard: {
    borderWidth: 2,
    borderColor: colors.accent,
    position: 'relative',
  },
  suggestionBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  suggestionBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.card,
  },
  meetingHeader: {
    marginBottom: 12,
  },
  meetingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meetingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  meetingTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  meetingDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  attendeesPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  attendeeAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  attendeeInitial: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
  },
  suggestionActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  declineButton: {
    backgroundColor: colors.background,
  },
  acceptButton: {
    backgroundColor: colors.accent,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
});
