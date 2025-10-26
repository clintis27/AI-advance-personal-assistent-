
/**
 * AI Status Indicator Component
 * Shows the status of AI services
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useTheme } from '@react-navigation/native';
import { aiService } from '@/services/aiService';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface AIStatusIndicatorProps {
  onPress?: () => void;
}

export function AIStatusIndicator({ onPress }: AIStatusIndicatorProps) {
  const theme = useTheme();
  const [status, setStatus] = useState<'checking' | 'online' | 'offline' | 'partial'>('checking');
  const [serviceCount, setServiceCount] = useState({ online: 0, total: 5 });

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setStatus('checking');
    
    const serviceStatus = await aiService.getServiceStatus();
    const onlineServices = Object.values(serviceStatus).filter(Boolean).length;
    const totalServices = Object.keys(serviceStatus).length;
    
    setServiceCount({ online: onlineServices, total: totalServices });
    
    if (onlineServices === 0) {
      setStatus('offline');
    } else if (onlineServices === totalServices) {
      setStatus('online');
    } else {
      setStatus('partial');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return colors.success;
      case 'partial':
        return colors.warning;
      case 'offline':
        return colors.error;
      default:
        return colors.textMuted;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return 'checkmark.circle.fill';
      case 'partial':
        return 'exclamationmark.triangle.fill';
      case 'offline':
        return 'xmark.circle.fill';
      default:
        return 'clock.fill';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'All AI Services Online';
      case 'partial':
        return `${serviceCount.online}/${serviceCount.total} Services Online`;
      case 'offline':
        return 'AI Services Offline';
      default:
        return 'Checking...';
    }
  };

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <Pressable
        style={[
          styles.container,
          {
            backgroundColor: theme.dark ? colors.cardDark : colors.card,
            borderColor: theme.dark ? colors.borderDark : colors.border,
          },
        ]}
        onPress={onPress || checkStatus}
      >
        <View style={[styles.indicator, { backgroundColor: getStatusColor() }]} />
        <IconSymbol name={getStatusIcon()} size={16} color={getStatusColor()} />
        <Text
          style={[
            styles.text,
            { color: theme.dark ? colors.textDark : colors.text },
          ]}
        >
          {getStatusText()}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
