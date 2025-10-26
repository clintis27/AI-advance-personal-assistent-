
import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { colors, animationPresets } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Switch({
  value,
  onValueChange,
  disabled = false,
  style,
  size = 'md',
}: SwitchProps) {
  const theme = useTheme();
  const translateX = useSharedValue(value ? 1 : 0);
  const backgroundColor = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    translateX.value = withSpring(value ? 1 : 0, animationPresets.spring);
    backgroundColor.value = withTiming(value ? 1 : 0, { duration: 200 });
  }, [value]);

  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onValueChange(!value);
    }
  };

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return { width: 36, height: 20, thumbSize: 16, padding: 2 };
      case 'lg':
        return { width: 56, height: 32, thumbSize: 28, padding: 2 };
      default:
        return { width: 44, height: 24, thumbSize: 20, padding: 2 };
    }
  };

  const sizes = getSizes();

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      backgroundColor.value,
      [0, 1],
      [theme.dark ? colors.borderDark : colors.border, colors.primary]
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value * (sizes.width - sizes.thumbSize - sizes.padding * 2),
      },
    ],
  }));

  return (
    <AnimatedPressable
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.track,
        {
          width: sizes.width,
          height: sizes.height,
          padding: sizes.padding,
        },
        trackStyle,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            width: sizes.thumbSize,
            height: sizes.thumbSize,
          },
          thumbStyle,
        ]}
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: 100,
    justifyContent: 'center',
  },
  thumb: {
    backgroundColor: colors.primaryForeground,
    borderRadius: 100,
    boxShadow: `0px 2px 4px ${colors.shadowMedium}`,
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
