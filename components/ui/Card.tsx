
import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, animationPresets } from '@/styles/commonStyles';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'compact' | 'small' | 'elevated';
  interactive?: boolean;
  onPress?: () => void;
  animated?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({
  children,
  style,
  variant = 'default',
  interactive = false,
  onPress,
  animated = true,
}: CardProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    if (interactive || onPress) {
      scale.value = withSpring(0.98, animationPresets.springSmooth);
      opacity.value = withTiming(0.8, { duration: 150 });
    }
  };

  const handlePressOut = () => {
    if (interactive || onPress) {
      scale.value = withSpring(1, animationPresets.spring);
      opacity.value = withTiming(1, { duration: 150 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const cardStyles = [
    styles.base,
    variant === 'compact' && styles.compact,
    variant === 'small' && styles.small,
    variant === 'elevated' && styles.elevated,
    {
      backgroundColor: theme.dark ? colors.cardDark : colors.card,
      borderColor: theme.dark ? colors.borderDark : colors.border,
    },
    style,
  ];

  if (interactive || onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[cardStyles, animated && animatedStyle]}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    padding: 24,
    marginVertical: 12,
    width: '100%',
    borderWidth: 1,
    boxShadow: `0px 4px 16px ${colors.shadow}`,
    elevation: 2,
  },
  compact: {
    borderRadius: 14,
    padding: 20,
    marginVertical: 10,
    boxShadow: `0px 3px 12px ${colors.shadow}`,
    elevation: 1,
  },
  small: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 1,
  },
  elevated: {
    borderRadius: 16,
    padding: 24,
    marginVertical: 12,
    boxShadow: `0px 8px 24px ${colors.shadowLarge}`,
    elevation: 4,
  },
});
