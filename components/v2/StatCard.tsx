
import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { LucideIcon } from 'lucide-react-native';
import { colors } from '@/styles/commonStyles';
import { FloatingCard } from './FloatingCard';

interface ClusterIcon {
  key: string;
  icon: LucideIcon;
  color: string;
}

interface StatCardProps {
  value: string;
  label: string;
  cluster?: ClusterIcon[];
  style?: StyleProp<ViewStyle>;
}

/**
 * Bold stat callout — a big number, a small muted label, and an optional
 * cluster of small overlapping service icons underneath (this app's
 * translation of the reference's overlapping avatar cluster).
 */
export function StatCard({ value, label, cluster, style }: StatCardProps) {
  const theme = useTheme();

  return (
    <FloatingCard radius="lg" style={[styles.card, style]}>
      <Text style={[styles.value, { color: theme.dark ? colors.textDark : colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
        {label}
      </Text>

      {cluster && cluster.length > 0 ? (
        <View style={styles.cluster}>
          {cluster.map((item, index) => {
            const Icon = item.icon;
            return (
              <View
                key={item.key}
                style={[
                  styles.clusterIcon,
                  {
                    backgroundColor: item.color,
                    marginLeft: index === 0 ? 0 : -10,
                    borderColor: theme.dark ? colors.cardDark : colors.card,
                    zIndex: cluster.length - index,
                  },
                ]}
              >
                <Icon size={13} color={colors.primaryForeground} strokeWidth={2} />
              </View>
            );
          })}
        </View>
      ) : null}
    </FloatingCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
  },
  value: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -1,
  },
  label: {
    fontSize: 13,
    marginTop: 2,
  },
  cluster: {
    flexDirection: 'row',
    marginTop: 12,
  },
  clusterIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
