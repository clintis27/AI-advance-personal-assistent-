
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, animationPresets } from '@/styles/commonStyles';

interface ProgressProps {
  value: number; // 0-100
  max?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  animated?: boolean;
}

export function Progress({
  value,
  max = 100,
  height = 8,
  color,
  backgroundColor,
  style,
  animated = true,
}: ProgressProps) {
  const theme = useTheme();
  const progress = useSharedValue(0);

  React.useEffect(() => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    if (animated) {
      progress.value = withSpring(percentage, animationPresets.spring);
    } else {
      progress.value = percentage;
    }
  }, [value, max, animated]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: backgroundColor || (theme.dark ? colors.borderDark : colors.divider),
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.progress,
          {
            backgroundColor: color || colors.primary,
          },
          progressStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 100,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 100,
  },
});
