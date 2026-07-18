
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Home, Link2, Bot, Plane, User, Sparkles, Users, Clock } from 'lucide-react-native';
import { colors } from '@/styles/commonStyles';
import { FloatingCard } from '@/components/v2/FloatingCard';
import { GlassCard } from '@/components/v2/GlassCard';
import { GradientBadge } from '@/components/v2/GradientBadge';
import { IconDock, DockItem } from '@/components/v2/IconDock';
import { StatCard } from '@/components/v2/StatCard';
import { DetailCard } from '@/components/v2/DetailCard';

// Reference-image-inspired restyle preview, built from this app's own
// screens/content (real tabs, a real meeting, a real DBL state) — not
// wired into navigation yet, for direction approval before rollout.
export default function DesignPreviewScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');

  const dockItems: DockItem[] = [
    { key: 'home', icon: Home, onPress: () => setActiveTab('home') },
    { key: 'integrations', icon: Link2, onPress: () => setActiveTab('integrations') },
    { key: 'agent', icon: Bot, onPress: () => setActiveTab('agent') },
    { key: 'travel', icon: Plane, onPress: () => setActiveTab('travel') },
    { key: 'profile', icon: User, onPress: () => setActiveTab('profile') },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.surfaceMuted }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Text style={styles.eyebrow}>PVA+</Text>
          <Text style={styles.eyebrow}>DESIGN PREVIEW</Text>
        </View>

        <Animated.View entering={FadeInDown.duration(400)} style={styles.heroWrap}>
          <FloatingCard
            radius="xl"
            style={[
              styles.heroCard,
              {
                backgroundColor: theme.dark ? colors.secondaryDark : colors.secondary,
                borderWidth: theme.dark ? 1 : 0,
                borderColor: colors.glassBorderDark,
              },
            ]}
          >
            <Text style={[styles.heroTitle, { color: colors.textDark }]}>
              Your Day,{'\n'}Simplified
            </Text>
            <Text style={[styles.heroBody, { color: colors.textSecondaryDark }]}>
              PVA+ reads your digital body language and clears the noise before you
              have to ask.
            </Text>
          </FloatingCard>

          <View style={styles.stackRow}>
            <StatCard
              value="24"
              label="Tasks automated this week"
              cluster={[
                { key: 'voice', icon: Sparkles, color: colors.primary },
                { key: 'agent', icon: Bot, color: colors.accent },
                { key: 'travel', icon: Plane, color: colors.secondary },
              ]}
              style={styles.statCardOffset}
            />
            <GradientBadge
              icon={<Sparkles size={22} color={colors.primaryForeground} strokeWidth={2} />}
              onPress={() => {}}
              style={styles.badgeOffset}
            />
          </View>

          <DetailCard
            title="Team Standup"
            subtitle="9:00 AM · Daily sync"
            stats={[
              { key: 'attendees', icon: Users, label: '5 people' },
              { key: 'duration', icon: Clock, label: '30 min' },
            ]}
            style={styles.detailCardOffset}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <GlassCard radius="lg" style={styles.glassCard}>
            <Text style={styles.glassLabel}>Current state</Text>
            <Text style={styles.glassValue}>Focus-Deep</Text>
            <Text style={styles.glassMeta}>Typically lasts 60–120 min · notifications held</Text>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.dockSection}>
          <Text style={styles.sectionLabel}>Navigation dock</Text>
          <IconDock items={dockItems} activeKey={activeTab} direction="horizontal" style={styles.dock} />
        </Animated.View>

        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>&larr; Back</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 64,
    paddingBottom: 60,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.text,
    opacity: 0.55,
  },
  heroWrap: {
    marginBottom: 28,
  },
  heroCard: {
    backgroundColor: colors.secondary,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 36,
    marginBottom: 10,
  },
  heroBody: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 40,
  },
  stackRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  statCardOffset: {
    marginTop: -28,
    marginLeft: 16,
    flex: 1,
  },
  badgeOffset: {
    marginLeft: -22,
    marginBottom: 14,
    zIndex: 2,
  },
  detailCardOffset: {
    marginTop: -14,
    marginHorizontal: 16,
  },
  glassCard: {
    marginTop: 8,
    marginBottom: 28,
  },
  glassLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: colors.text,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  glassValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  glassMeta: {
    fontSize: 12.5,
    color: colors.text,
    opacity: 0.65,
    marginTop: 4,
  },
  dockSection: {
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: colors.text,
    opacity: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  dock: {
    alignSelf: 'center',
  },
  backLink: {
    marginTop: 36,
    alignSelf: 'center',
  },
  backLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    opacity: 0.6,
  },
});
