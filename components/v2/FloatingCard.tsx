
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors, radii } from '@/styles/commonStyles';

interface FloatingCardProps {
  children: React.ReactNode;
  radius?: keyof typeof radii;
  style?: StyleProp<ViewStyle>;
}

/**
 * Opaque, fully-readable card with a large radius and a soft layered shadow.
 * Use for primary content that needs to stay legible over any backdrop
 * (detail cards, hero panels). For translucent accents, use GlassCard.
 */
export function FloatingCard({ children, radius = 'xl', style }: FloatingCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.dark ? colors.cardDark : colors.card,
          borderRadius: radii[radius],
          borderWidth: theme.dark ? 1 : 0,
          borderColor: colors.glassBorderDark,
          shadowColor: '#000',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
});
