
import { Stack } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import React, { useState } from "react";
import { IconSymbol } from "@/components/IconSymbol";

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  category: 'important' | 'informational' | 'spam';
  time: string;
  read: boolean;
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
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.2,
  },
  filterButtonTextActive: {
    color: colors.primaryForeground,
  },
  emailCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 1,
  },
  emailCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  emailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  emailSender: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    letterSpacing: -0.3,
  },
  emailTime: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
    marginLeft: 8,
    letterSpacing: -0.2,
  },
  emailSubject: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  emailPreview: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  emailFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 1,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.7,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
});

export default function EmailScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'important' | 'informational' | 'spam'>('all');
  
  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      sender: 'Sarah Johnson',
      subject: 'Q4 Budget Review Meeting',
      preview: 'Hi team, I wanted to schedule a meeting to review the Q4 budget allocations...',
      category: 'important',
      time: '9:30 AM',
      read: false,
    },
    {
      id: '2',
      sender: 'Marketing Team',
      subject: 'Weekly Newsletter - Product Updates',
      preview: 'Check out the latest product updates and feature releases from this week...',
      category: 'informational',
      time: '8:15 AM',
      read: true,
    },
    {
      id: '3',
      sender: 'unknown@spam.com',
      subject: 'You won a prize!',
      preview: 'Congratulations! Click here to claim your prize...',
      category: 'spam',
      time: '7:45 AM',
      read: false,
    },
    {
      id: '4',
      sender: 'John Smith',
      subject: 'Project Timeline Update',
      preview: 'The project timeline has been updated. Please review the new deadlines...',
      category: 'important',
      time: 'Yesterday',
      read: true,
    },
    {
      id: '5',
      sender: 'HR Department',
      subject: 'Company Policy Updates',
      preview: 'Please review the updated company policies regarding remote work...',
      category: 'informational',
      time: 'Yesterday',
      read: false,
    },
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'important':
        return colors.error;
      case 'informational':
        return colors.info;
      case 'spam':
        return colors.textMuted;
      default:
        return colors.textMuted;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'important':
        return 'exclamationmark.circle.fill';
      case 'informational':
        return 'info.circle.fill';
      case 'spam':
        return 'trash.fill';
      default:
        return 'envelope.fill';
    }
  };

  const handleCategoryChange = (emailId: string, newCategory: 'important' | 'informational' | 'spam') => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, category: newCategory } : email
    ));
  };

  const filteredEmails = selectedFilter === 'all' 
    ? emails 
    : emails.filter(email => email.category === selectedFilter);

  const stats = {
    important: emails.filter(e => e.category === 'important').length,
    informational: emails.filter(e => e.category === 'informational').length,
    spam: emails.filter(e => e.category === 'spam').length,
    unread: emails.filter(e => !e.read).length,
  };

  const renderHeaderRight = () => (
    <Pressable style={{ marginRight: 16 }}>
      <IconSymbol name="line.3.horizontal.decrease.circle" size={24} color={colors.text} />
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
            <Text style={styles.title}>Email Triage</Text>
            <Text style={styles.subtitle}>
              AI-powered email categorization to help you focus on what matters.
            </Text>
          </Animated.View>

          {/* Stats */}
          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Email Summary</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.error }]}>{stats.important}</Text>
                  <Text style={styles.statLabel}>Important</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.info }]}>{stats.informational}</Text>
                  <Text style={styles.statLabel}>Info</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.textMuted }]}>{stats.spam}</Text>
                  <Text style={styles.statLabel}>Spam</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>{stats.unread}</Text>
                  <Text style={styles.statLabel}>Unread</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Filters */}
          <Animated.View entering={FadeInDown.duration(500).delay(300)}>
            <View style={styles.filterContainer}>
              <Pressable
                style={[
                  styles.filterButton,
                  selectedFilter === 'all' && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedFilter('all')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedFilter === 'all' && styles.filterButtonTextActive,
                  ]}
                >
                  All
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.filterButton,
                  selectedFilter === 'important' && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedFilter('important')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedFilter === 'important' && styles.filterButtonTextActive,
                  ]}
                >
                  Important
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.filterButton,
                  selectedFilter === 'informational' && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedFilter('informational')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedFilter === 'informational' && styles.filterButtonTextActive,
                  ]}
                >
                  Info
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.filterButton,
                  selectedFilter === 'spam' && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedFilter('spam')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedFilter === 'spam' && styles.filterButtonTextActive,
                  ]}
                >
                  Spam
                </Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Email List */}
          {filteredEmails.map((email, index) => (
            <Animated.View
              key={email.id}
              entering={FadeInDown.duration(500).delay(400 + index * 50)}
            >
              <Pressable
                style={[
                  styles.emailCard,
                  !email.read && styles.emailCardUnread,
                ]}
              >
                <View style={styles.emailHeader}>
                  <Text style={styles.emailSender}>{email.sender}</Text>
                  <Text style={styles.emailTime}>{email.time}</Text>
                </View>
                <Text style={styles.emailSubject}>{email.subject}</Text>
                <Text style={styles.emailPreview} numberOfLines={2}>
                  {email.preview}
                </Text>
                <View style={styles.emailFooter}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: `${getCategoryColor(email.category)}15` },
                    ]}
                  >
                    <IconSymbol
                      name={getCategoryIcon(email.category)}
                      size={14}
                      color={getCategoryColor(email.category)}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        { color: getCategoryColor(email.category) },
                      ]}
                    >
                      {email.category}
                    </Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <Pressable style={styles.actionButton}>
                      <IconSymbol name="archivebox" size={16} color={colors.text} />
                    </Pressable>
                    <Pressable style={styles.actionButton}>
                      <IconSymbol name="trash" size={16} color={colors.error} />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}
