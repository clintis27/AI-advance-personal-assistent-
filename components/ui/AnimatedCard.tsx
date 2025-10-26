
import React from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  ZoomIn,
  SlideInDown,
  SlideInUp,
  SlideInLeft,
  SlideInRight,
} from 'react-native-reanimated';
import { Card } from './Card';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'compact' | 'small' | 'elevated';
  interactive?: boolean;
  onPress?: () => void;
  animation?: 'fadeInDown' | 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'zoomIn' | 'slideInDown' | 'slideInUp' | 'slideInLeft' | 'slideInRight';
  delay?: number;
  duration?: number;
}

export function AnimatedCard({
  children,
  style,
  variant = 'default',
  interactive = false,
  onPress,
  animation = 'fadeInDown',
  delay = 0,
  duration = 400,
}: AnimatedCardProps) {
  const getAnimation = () => {
    const config = { duration, delay };
    
    switch (animation) {
      case 'fadeInDown':
        return FadeInDown.duration(config.duration).delay(config.delay);
      case 'fadeInUp':
        return FadeInUp.duration(config.duration).delay(config.delay);
      case 'fadeInLeft':
        return FadeInLeft.duration(config.duration).delay(config.delay);
      case 'fadeInRight':
        return FadeInRight.duration(config.duration).delay(config.delay);
      case 'zoomIn':
        return ZoomIn.duration(config.duration).delay(config.delay);
      case 'slideInDown':
        return SlideInDown.duration(config.duration).delay(config.delay);
      case 'slideInUp':
        return SlideInUp.duration(config.duration).delay(config.delay);
      case 'slideInLeft':
        return SlideInLeft.duration(config.duration).delay(config.delay);
      case 'slideInRight':
        return SlideInRight.duration(config.duration).delay(config.delay);
      default:
        return FadeInDown.duration(config.duration).delay(config.delay);
    }
  };

  return (
    <Animated.View entering={getAnimation()}>
      <Card
        style={style}
        variant={variant}
        interactive={interactive}
        onPress={onPress}
        animated={false}
      >
        {children}
      </Card>
    </Animated.View>
  );
}
