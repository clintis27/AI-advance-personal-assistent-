
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { colors, radii } from '@/styles/commonStyles';

interface GlassCardProps {
  children: React.ReactNode;
  radius?: keyof typeof radii;
  style?: StyleProp<ViewStyle>;
}

/**
 * Frosted-glass card: blurred, semi-transparent background with a thin
 * light border, so whatever sits behind it (backdrop, hero image) shows
 * through softly. Reserve for secondary/floating accents, not primary
 * content that needs guaranteed contrast — use FloatingCard for that.
 */
export function GlassCard({ children, radius = 'lg', style }: GlassCardProps) {
  const theme = useTheme();
  const borderRadius = radii[radius];

  return (
    <View style={[styles.shadowWrapper, { borderRadius, shadowColor: '#000' }, style]}>
      <View style={[styles.clipWrapper, { borderRadius }]}>
        <BlurView
          intensity={40}
          tint={theme.dark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFillObject}
        />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: theme.dark ? colors.glassTintDark : colors.glassTint,
              borderRadius,
              borderWidth: 1,
              borderColor: theme.dark ? colors.glassBorderDark : colors.glassBorder,
            },
          ]}
        />
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  },
  clipWrapper: {
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
});
