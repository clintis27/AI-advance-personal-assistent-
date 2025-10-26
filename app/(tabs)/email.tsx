
import React, { useState } from "react";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform } from "react-native";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import Animated, { FadeInRight } from "react-native-reanimated";

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  category: 'important' | 'informational' | 'spam';
  time: string;
  read: boolean;
}

export default function EmailScreen() {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      sender: 'Sarah Johnson',
      subject: 'Q4 Budget Review - Action Required',
      preview: 'Hi, I need your approval on the Q4 budget allocation by end of day...',
      category: 'important',
      time: '9:30 AM',
      read: false,
    },
    {
      id: '2',
      sender: 'Marketing Team',
      subject: 'Weekly Newsletter - Product Updates',
      preview: 'Check out our latest product features and upcoming releases...',
      category: 'informational',
      time: '8:45 AM',
      read: false,
    },
    {
      id: '3',
      sender: 'John Smith',
      subject: 'Meeting Notes from Yesterday',
      preview: 'Here are the notes from our strategy meeting. Please review...',
      category: 'important',
      time: 'Yesterday',
      read: true,
    },
    {
      id: '4',
      sender: 'Special Offer',
      subject: 'You won a prize! Click here now!!!',
      preview: 'Congratulations! You have been selected as a winner...',
      category: 'spam',
      time: '2 days ago',
      read: false,
    },
    {
      id: '5',
      sender: 'HR Department',
      subject: 'Company Policy Update',
      preview: 'Please review the updated company policies in the employee handbook...',
      category: 'informational',
      time: '3 days ago',
      read: true,
    },
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'important':
        return colors.error;
      case 'informational':
        return colors.primary;
      case 'spam':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
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
    console.log(`Email ${emailId} category changed to ${newCategory}`);
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log('Refresh emails')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="arrow.clockwise" color={colors.primary} size={24} />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Email Triage",
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
          <View style={styles.header}>
            <Text style={styles.headerTitle}>AI-Sorted Emails</Text>
            <Text style={styles.headerSubtitle}>
              Tap a category to reclassify emails and help the AI learn
            </Text>
          </View>

          {emails.map((email, index) => (
            <Animated.View 
              key={email.id} 
              entering={FadeInRight.delay(index * 100)}
            >
              <Pressable 
                style={[
                  styles.emailCard,
                  !email.read && styles.unreadCard
                ]}
                onPress={() => console.log('Open email:', email.subject)}
              >
                <View style={styles.emailHeader}>
                  <View style={styles.senderRow}>
                    <View style={[
                      styles.avatarCircle,
                      { backgroundColor: getCategoryColor(email.category) + '20' }
                    ]}>
                      <Text style={[
                        styles.avatarText,
                        { color: getCategoryColor(email.category) }
                      ]}>
                        {email.sender.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.senderInfo}>
                      <Text style={[
                        styles.senderName,
                        !email.read && styles.unreadText
                      ]}>
                        {email.sender}
                      </Text>
                      <Text style={styles.emailTime}>{email.time}</Text>
                    </View>
                  </View>
                  {!email.read && <View style={styles.unreadDot} />}
                </View>

                <Text style={[
                  styles.emailSubject,
                  !email.read && styles.unreadText
                ]}>
                  {email.subject}
                </Text>
                <Text style={styles.emailPreview} numberOfLines={2}>
                  {email.preview}
                </Text>

                <View style={styles.categorySection}>
                  <View style={styles.currentCategory}>
                    <IconSymbol 
                      name={getCategoryIcon(email.category)} 
                      color={getCategoryColor(email.category)} 
                      size={16} 
                    />
                    <Text style={[
                      styles.categoryText,
                      { color: getCategoryColor(email.category) }
                    ]}>
                      {email.category.charAt(0).toUpperCase() + email.category.slice(1)}
                    </Text>
                  </View>

                  <View style={styles.categoryButtons}>
                    <Pressable
                      style={[
                        styles.categoryButton,
                        email.category === 'important' && styles.activeCategoryButton
                      ]}
                      onPress={() => handleCategoryChange(email.id, 'important')}
                    >
                      <IconSymbol 
                        name="exclamationmark.circle" 
                        color={email.category === 'important' ? colors.card : colors.error} 
                        size={18} 
                      />
                    </Pressable>
                    <Pressable
                      style={[
                        styles.categoryButton,
                        email.category === 'informational' && styles.activeCategoryButton
                      ]}
                      onPress={() => handleCategoryChange(email.id, 'informational')}
                    >
                      <IconSymbol 
                        name="info.circle" 
                        color={email.category === 'informational' ? colors.card : colors.primary} 
                        size={18} 
                      />
                    </Pressable>
                    <Pressable
                      style={[
                        styles.categoryButton,
                        email.category === 'spam' && styles.activeCategoryButton
                      ]}
                      onPress={() => handleCategoryChange(email.id, 'spam')}
                    >
                      <IconSymbol 
                        name="trash" 
                        color={email.category === 'spam' ? colors.card : colors.textSecondary} 
                        size={18} 
                      />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))}

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
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  headerButtonContainer: {
    padding: 8,
  },
  emailCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  emailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
  },
  senderInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  emailTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  unreadText: {
    fontWeight: '600',
  },
  emailSubject: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  emailPreview: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  categorySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  currentCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  activeCategoryButton: {
    backgroundColor: colors.primary,
  },
  bottomPadding: {
    height: 100,
  },
});
