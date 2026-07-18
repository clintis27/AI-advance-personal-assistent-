
import React from 'react';
import { Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '@/styles/commonStyles';

interface GradientBadgeProps {
  icon: React.ReactNode;
  onPress?: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Circular gradient floating action button — the single most important
 * action on a screen (e.g. "Ask AI"). Uses the app's indigo accent, not
 * the reference image's purple, so it reads as this app's own mark.
 */
export function GradientBadge({ icon, onPress, size = 56, style }: GradientBadgeProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress} style={style}>
      <LinearGradient
        colors={[colors.accentLight, colors.accent, colors.accentDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.badge,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        {icon}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accentDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
});
