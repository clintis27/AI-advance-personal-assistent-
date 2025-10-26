
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function ProfileScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header for Android/Web */}
        {Platform.OS !== 'ios' && (
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        )}

        {/* Profile Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
        </Animated.View>

        {/* Contact Information */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <IconSymbol name="phone.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>+1 (555) 123-4567</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <IconSymbol name="location.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>San Francisco, CA</Text>
            </View>
          </View>
        </Animated.View>

        {/* AI Preferences */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>AI Preferences</Text>
          <View style={styles.card}>
            <Pressable style={styles.preferenceRow} onPress={() => console.log('Task prediction toggled')}>
              <View style={styles.preferenceInfo}>
                <IconSymbol name="sparkles" size={20} color={colors.primary} />
                <Text style={styles.preferenceText}>Task Prediction</Text>
              </View>
              <View style={[styles.toggle, styles.toggleActive]}>
                <View style={styles.toggleThumb} />
              </View>
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.preferenceRow} onPress={() => console.log('Email triage toggled')}>
              <View style={styles.preferenceInfo}>
                <IconSymbol name="envelope.fill" size={20} color={colors.accent} />
                <Text style={styles.preferenceText}>Email Triage</Text>
              </View>
              <View style={[styles.toggle, styles.toggleActive]}>
                <View style={styles.toggleThumb} />
              </View>
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.preferenceRow} onPress={() => console.log('Meeting suggestions toggled')}>
              <View style={styles.preferenceInfo}>
                <IconSymbol name="calendar" size={20} color={colors.secondary} />
                <Text style={styles.preferenceText}>Meeting Suggestions</Text>
              </View>
              <View style={[styles.toggle, styles.toggleActive]}>
                <View style={styles.toggleThumb} />
              </View>
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.preferenceRow} onPress={() => console.log('Mood detection toggled')}>
              <View style={styles.preferenceInfo}>
                <IconSymbol name="brain" size={20} color={colors.warning} />
                <Text style={styles.preferenceText}>Mood Detection</Text>
              </View>
              <View style={[styles.toggle, styles.toggleActive]}>
                <View style={styles.toggleThumb} />
              </View>
            </Pressable>
          </View>
        </Animated.View>

        {/* Statistics */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>AI Learning Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <IconSymbol name="checkmark.circle.fill" size={32} color={colors.accent} />
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Tasks Predicted</Text>
            </View>
            <View style={styles.statCard}>
              <IconSymbol name="envelope.badge.fill" size={32} color={colors.primary} />
              <Text style={styles.statValue}>892</Text>
              <Text style={styles.statLabel}>Emails Sorted</Text>
            </View>
            <View style={styles.statCard}>
              <IconSymbol name="calendar.badge.clock" size={32} color={colors.secondary} />
              <Text style={styles.statValue}>43</Text>
              <Text style={styles.statLabel}>Meetings Optimized</Text>
            </View>
            <View style={styles.statCard}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={32} color={colors.warning} />
              <Text style={styles.statValue}>94%</Text>
              <Text style={styles.statLabel}>Accuracy Rate</Text>
            </View>
          </View>
        </Animated.View>

        {/* Settings */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/agent')}>
              <IconSymbol name="person.crop.circle.badge.checkmark" size={20} color={colors.textSecondary} />
              <Text style={styles.settingText}>Autonomous Agent</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/routine')}>
              <IconSymbol name="calendar.badge.clock" size={20} color={colors.textSecondary} />
              <Text style={styles.settingText}>Daily Routine</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/privacy')}>
              <IconSymbol name="lock.shield.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.settingText}>Privacy & Security</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.settingRow} onPress={() => console.log('Notifications pressed')}>
              <IconSymbol name="bell.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.settingText}>Notifications</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.settingRow} onPress={() => console.log('Help pressed')}>
              <IconSymbol name="questionmark.circle.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.settingText}>Help & Support</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
            </Pressable>
          </View>
        </Animated.View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : 0,
  },
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 32,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  preferenceText: {
    fontSize: 16,
    color: colors.text,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: colors.accent,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignSelf: 'flex-end',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  bottomPadding: {
    height: 100,
  },
});
