
import React from 'react';
import { Text, Pressable, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, animationPresets } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  haptic?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  haptic = true,
}: ButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.96, animationPresets.springSmooth);
      opacity.value = withTiming(0.8, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(1, animationPresets.spring);
      opacity.value = withTiming(1, { duration: 100 });
    }
  };

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      if (haptic) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const buttonStyles = [
    styles.base,
    size === 'sm' && styles.sm,
    size === 'lg' && styles.lg,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'outline' && styles.outline,
    variant === 'ghost' && styles.ghost,
    variant === 'destructive' && styles.destructive,
    variant === 'link' && styles.link,
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const getTextColor = () => {
    if (disabled || loading) return colors.textMuted;
    if (variant === 'primary' || variant === 'destructive') return colors.primaryForeground;
    if (variant === 'secondary') return theme.dark ? colors.secondaryForegroundDark : colors.secondaryForeground;
    if (variant === 'outline' || variant === 'ghost') return theme.dark ? colors.textDark : colors.text;
    if (variant === 'link') return colors.primary;
    return theme.dark ? colors.textDark : colors.text;
  };

  const textStyles = [
    styles.text,
    size === 'sm' && styles.textSm,
    size === 'lg' && styles.textLg,
    { color: getTextColor() },
    textStyle,
  ];

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[buttonStyles, animatedStyle]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : typeof children === 'string' ? (
        <Text style={textStyles}>{children}</Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  sm: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  primary: {
    backgroundColor: colors.primary,
    boxShadow: `0px 2px 8px ${colors.shadowMedium}`,
    elevation: 2,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: colors.error,
    boxShadow: `0px 2px 8px ${colors.shadowMedium}`,
    elevation: 2,
  },
  link: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  textSm: {
    fontSize: 13,
    fontWeight: '600',
  },
  textLg: {
    fontSize: 17,
    fontWeight: '600',
  },
});
