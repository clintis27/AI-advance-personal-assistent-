
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  style?: ViewStyle;
}

export function Separator({ orientation = 'horizontal', style }: SeparatorProps) {
  const theme = useTheme();

  const separatorStyles = [
    orientation === 'horizontal' ? styles.horizontal : styles.vertical,
    {
      backgroundColor: theme.dark ? colors.dividerDark : colors.divider,
    },
    style,
  ];

  return <View style={separatorStyles} />;
}

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
  vertical: {
    width: 1,
    height: '100%',
    marginHorizontal: 16,
  },
});
