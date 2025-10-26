
import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface BehaviorInsightCardProps {
  title: string;
  subtitle: string;
  metric?: string;
  icon: string;
  color: string;
  imageUrl?: string;
  onPress?: () => void;
  delay?: number;
  featured?: boolean;
}

export default function BehaviorInsightCard({
  title,
  subtitle,
  metric,
  icon,
  color,
  imageUrl,
  onPress,
  delay = 0,
  featured = false,
}: BehaviorInsightCardProps) {
  const cardWidth = featured ? width - 32 : (width - 44) / 2;

  return (
    <Animated.View
      entering={FadeInDown.delay(delay)}
      style={[
        styles.container,
        { width: cardWidth },
        featured && styles.featuredContainer,
      ]}
    >
      <Pressable
        style={[
          styles.card,
          { backgroundColor: color + '10' },
          featured && styles.featuredCard,
        ]}
        onPress={onPress}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <IconSymbol name={icon} size={featured ? 32 : 24} color={color} />
          </View>
          {metric && (
            <View style={styles.metricBadge}>
              <Text style={[styles.metricText, { color }]}>{metric}</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, featured && styles.featuredTitle]}>
            {title}
          </Text>
          <Text style={[styles.subtitle, featured && styles.featuredSubtitle]}>
            {subtitle}
          </Text>
        </View>

        {/* Image (if provided) */}
        {imageUrl && featured && (
          <View style={styles.imageContainer}>
            <View style={styles.imagePlaceholder}>
              <IconSymbol name="photo" size={40} color={colors.textSecondary} />
            </View>
          </View>
        )}

        {/* Footer */}
        {featured && (
          <View style={styles.footer}>
            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  featuredContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
    elevation: 4,
    minHeight: 180,
  },
  featuredCard: {
    minHeight: 280,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  metricText: {
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 26,
  },
  featuredTitle: {
    fontSize: 24,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  featuredSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  imageContainer: {
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 12,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
});
