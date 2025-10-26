
import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/styles/commonStyles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  containerStyle,
  leftIcon,
  rightIcon,
  style,
  ...props
}: InputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(theme.dark ? colors.borderDark : colors.border);

  const handleFocus = () => {
    setIsFocused(true);
    borderColor.value = withTiming(colors.primary, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderColor.value = withTiming(
      error ? colors.error : theme.dark ? colors.borderDark : colors.border,
      { duration: 200 }
    );
  };

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  const inputContainerStyles = [
    styles.inputContainer,
    {
      backgroundColor: theme.dark ? colors.cardDark : colors.card,
      borderColor: error ? colors.error : theme.dark ? colors.borderDark : colors.border,
    },
    isFocused && styles.inputContainerFocused,
    error && styles.inputContainerError,
    animatedBorderStyle,
  ];

  const inputStyles = [
    styles.input,
    {
      color: theme.dark ? colors.textDark : colors.text,
    },
    leftIcon && styles.inputWithLeftIcon,
    rightIcon && styles.inputWithRightIcon,
    style,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: theme.dark ? colors.textDark : colors.text },
            error && { color: colors.error },
          ]}
        >
          {label}
        </Text>
      )}
      <Animated.View style={inputContainerStyles}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <TextInput
          {...props}
          style={inputStyles}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={theme.dark ? colors.textMutedDark : colors.textMuted}
        />
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </Animated.View>
      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            { color: error ? colors.error : theme.dark ? colors.textMutedDark : colors.textMuted },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  inputContainerFocused: {
    boxShadow: `0px 0px 0px 3px ${colors.primary}20`,
  },
  inputContainerError: {
    borderColor: colors.error,
    boxShadow: `0px 0px 0px 3px ${colors.error}20`,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    letterSpacing: -0.2,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIconContainer: {
    paddingLeft: 12,
  },
  rightIconContainer: {
    paddingRight: 12,
  },
  helperText: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});
