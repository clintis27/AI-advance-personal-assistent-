
import React from 'react';
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { LucideIcon, Heart, Share2 } from 'lucide-react-native';
import { colors } from '@/styles/commonStyles';
import { FloatingCard } from './FloatingCard';

interface StatPair {
  key: string;
  icon: LucideIcon;
  label: string;
}

interface DetailCardProps {
  title: string;
  subtitle: string;
  stats: StatPair[];
  onSave?: () => void;
  onShare?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Item detail card: title, subtitle/context line, a row of small
 * icon+stat pairs, and small circular action icons bottom-right.
 * This app's translation of the reference's listing card — used for a
 * meeting, a task, an email summary, anything with a title + quick facts.
 */
export function DetailCard({ title, subtitle, stats, onSave, onShare, style }: DetailCardProps) {
  const theme = useTheme();
  const muted = theme.dark ? colors.textMutedDark : colors.textMuted;

  return (
    <FloatingCard radius="lg" style={style}>
      <Text style={[styles.title, { color: theme.dark ? colors.textDark : colors.text }]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={[styles.subtitle, { color: muted }]} numberOfLines={1}>
        {subtitle}
      </Text>

      <View style={styles.statsRow}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <View key={stat.key} style={styles.statPair}>
              <Icon size={14} color={muted} strokeWidth={1.75} />
              <Text style={[styles.statLabel, { color: muted }]}>{stat.label}</Text>
            </View>
          );
        })}

        <View style={styles.actions}>
          <Pressable
            onPress={onSave}
            style={[styles.actionIcon, { backgroundColor: theme.dark ? colors.cardSecondaryDark : colors.cardSecondary }]}
          >
            <Heart size={14} color={muted} strokeWidth={1.75} />
          </Pressable>
          <Pressable
            onPress={onShare}
            style={[styles.actionIcon, { backgroundColor: theme.dark ? colors.cardSecondaryDark : colors.cardSecondary }]}
          >
            <Share2 size={14} color={muted} strokeWidth={1.75} />
          </Pressable>
        </View>
      </View>
    </FloatingCard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 14,
  },
  statPair: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 'auto',
  },
  actionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
