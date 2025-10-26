
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}: BadgeProps) {
  const theme = useTheme();

  const badgeStyles = [
    styles.base,
    size === 'sm' && styles.sm,
    size === 'lg' && styles.lg,
    variant === 'default' && {
      backgroundColor: theme.dark ? colors.secondaryDark : colors.secondary,
      borderColor: theme.dark ? colors.borderDark : colors.border,
    },
    variant === 'primary' && styles.primary,
    variant === 'success' && styles.success,
    variant === 'warning' && styles.warning,
    variant === 'error' && styles.error,
    variant === 'info' && styles.info,
    variant === 'outline' && {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: theme.dark ? colors.borderDark : colors.border,
    },
    style,
  ];

  const getTextColor = () => {
    if (variant === 'outline') return theme.dark ? colors.textDark : colors.text;
    if (variant === 'default') return theme.dark ? colors.secondaryForegroundDark : colors.secondaryForeground;
    return colors.primaryForeground;
  };

  const textStyles = [
    styles.text,
    size === 'sm' && styles.textSm,
    size === 'lg' && styles.textLg,
    { color: getTextColor() },
    textStyle,
  ];

  return (
    <View style={badgeStyles}>
      {typeof children === 'string' ? (
        <Text style={textStyles}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lg: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  success: {
    backgroundColor: colors.success,
  },
  warning: {
    backgroundColor: colors.warning,
  },
  error: {
    backgroundColor: colors.error,
  },
  info: {
    backgroundColor: colors.info,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textSm: {
    fontSize: 10,
    fontWeight: '600',
  },
  textLg: {
    fontSize: 14,
    fontWeight: '600',
  },
});
