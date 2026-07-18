
import React from 'react';
import { View, Pressable, Image, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { LucideIcon } from 'lucide-react-native';
import { colors } from '@/styles/commonStyles';

export interface DockItem {
  key: string;
  icon: LucideIcon;
  onPress?: () => void;
}

interface IconDockProps {
  items: DockItem[];
  activeKey: string;
  avatarUri?: string;
  onAvatarPress?: () => void;
  direction?: 'vertical' | 'horizontal';
  style?: StyleProp<ViewStyle>;
}

const ICON_SIZE = 40;

/**
 * Slim pill-shaped icon dock replacing a heavy tab bar: circular icon
 * buttons, active screen shown as a filled dark circle, everything else
 * flat on transparent background. Optional avatar slot at the end.
 */
export function IconDock({
  items,
  activeKey,
  avatarUri,
  onAvatarPress,
  direction = 'vertical',
  style,
}: IconDockProps) {
  const theme = useTheme();
  const isVertical = direction === 'vertical';

  const handlePress = (item: DockItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    item.onPress?.();
  };

  return (
    <View
      style={[
        styles.dock,
        {
          flexDirection: isVertical ? 'column' : 'row',
          backgroundColor: theme.dark ? colors.cardDark : colors.card,
          borderRadius: ICON_SIZE,
        },
        style,
      ]}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;
        const Icon = item.icon;
        return (
          <Pressable
            key={item.key}
            onPress={() => handlePress(item)}
            style={[
              styles.iconButton,
              isActive && { backgroundColor: theme.dark ? colors.textDark : colors.secondary },
            ]}
          >
            <Icon
              size={19}
              color={
                isActive
                  ? theme.dark ? colors.secondary : colors.secondaryForeground
                  : theme.dark ? colors.textMutedDark : colors.textMuted
              }
              strokeWidth={1.75}
            />
          </Pressable>
        );
      })}

      {avatarUri ? (
        <Pressable onPress={onAvatarPress} style={styles.avatarButton}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    padding: 8,
    gap: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  iconButton: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButton: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});
