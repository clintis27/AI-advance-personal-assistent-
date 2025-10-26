
import { colors } from "@/styles/commonStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { IconSymbol } from "@/components/IconSymbol";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable } from "react-native";

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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  menuChevron: {
    marginLeft: 8,
  },
  badge: {
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400)} style={styles.profileHeader}>
          <View style={styles.avatar}>
            <IconSymbol name="person.fill" size={50} color={colors.primary} />
          </View>
          <Text style={styles.name}>Your Name</Text>
          <Text style={styles.email}>your.email@example.com</Text>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push('/(tabs)/integrations')}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="link.circle.fill" size={22} color={colors.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>App Integrations</Text>
                <Text style={styles.menuSubtitle}>Connect your digital platforms</Text>
              </View>
              <IconSymbol
                name="chevron.right"
                size={20}
                color={colors.textSecondary}
                style={styles.menuChevron}
              />
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(150)}>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push('/(tabs)/ai-config')}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: colors.secondary + '20' }]}>
                <IconSymbol name="brain" size={22} color={colors.secondary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>AI Configuration</Text>
                <Text style={styles.menuSubtitle}>Manage AI features and autonomy</Text>
              </View>
              <IconSymbol
                name="chevron.right"
                size={20}
                color={colors.textSecondary}
                style={styles.menuChevron}
              />
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push('/(tabs)/voice')}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: colors.accent + '20' }]}>
                <IconSymbol name="waveform" size={22} color={colors.accent} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Voice & Communication</Text>
                <Text style={styles.menuSubtitle}>Configure voice features</Text>
              </View>
              <IconSymbol
                name="chevron.right"
                size={20}
                color={colors.textSecondary}
                style={styles.menuChevron}
              />
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(250)}>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push('/(tabs)/privacy')}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: colors.info + '20' }]}>
                <IconSymbol name="lock.shield.fill" size={22} color={colors.info} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Privacy & Security</Text>
                <Text style={styles.menuSubtitle}>Manage permissions and data</Text>
              </View>
              <IconSymbol
                name="chevron.right"
                size={20}
                color={colors.textSecondary}
                style={styles.menuChevron}
              />
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>

          <Animated.View entering={FadeInDown.duration(400).delay(300)}>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push('/(tabs)/problem-solver')}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: '#FF6B6B20' }]}>
                <IconSymbol name="lightbulb.fill" size={22} color="#FF6B6B" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>AI Problem Solver</Text>
                <Text style={styles.menuSubtitle}>Intelligent task analysis</Text>
              </View>
              <IconSymbol
                name="chevron.right"
                size={20}
                color={colors.textSecondary}
                style={styles.menuChevron}
              />
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(350)}>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push('/(tabs)/travel')}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: '#4ECDC420' }]}>
                <IconSymbol name="airplane.departure" size={22} color="#4ECDC4" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Travel Assistant</Text>
                <Text style={styles.menuSubtitle}>Smart travel planning</Text>
              </View>
              <IconSymbol
                name="chevron.right"
                size={20}
                color={colors.textSecondary}
                style={styles.menuChevron}
              />
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(400)}>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push('/(tabs)/routine')}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: '#95E1D320' }]}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={22} color="#95E1D3" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Digital Body Language</Text>
                <Text style={styles.menuSubtitle}>Behavior insights and patterns</Text>
              </View>
              <IconSymbol
                name="chevron.right"
                size={20}
                color={colors.textSecondary}
                style={styles.menuChevron}
              />
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <Animated.View entering={FadeInDown.duration(400).delay(450)}>
            <Pressable style={styles.menuItem}>
              <View style={[styles.menuIconContainer, { backgroundColor: colors.textSecondary + '20' }]}>
                <IconSymbol name="info.circle.fill" size={22} color={colors.textSecondary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Help & Support</Text>
                <Text style={styles.menuSubtitle}>Get help and documentation</Text>
              </View>
              <IconSymbol
                name="chevron.right"
                size={20}
                color={colors.textSecondary}
                style={styles.menuChevron}
              />
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(500)}>
            <Pressable style={styles.menuItem}>
              <View style={[styles.menuIconContainer, { backgroundColor: colors.textSecondary + '20' }]}>
                <IconSymbol name="doc.text.fill" size={22} color={colors.textSecondary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Terms & Privacy</Text>
                <Text style={styles.menuSubtitle}>Legal information</Text>
              </View>
              <IconSymbol
                name="chevron.right"
                size={20}
                color={colors.textSecondary}
                style={styles.menuChevron}
              />
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
