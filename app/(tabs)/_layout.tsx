
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  // Define the tabs configuration
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'house.fill',
      label: 'Home',
    },
    {
      name: 'agent',
      route: '/(tabs)/agent',
      icon: 'person.crop.circle.badge.checkmark',
      label: 'Agent',
    },
    {
      name: 'routine',
      route: '/(tabs)/routine',
      icon: 'calendar.badge.clock',
      label: 'Routine',
    },
    {
      name: 'privacy',
      route: '/(tabs)/privacy',
      icon: 'lock.shield.fill',
      label: 'Privacy',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person.fill',
      label: 'Profile',
    },
  ];

  // Use NativeTabs for iOS, custom FloatingTabBar for Android and Web
  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="house.fill" drawable="ic_home" />
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="agent">
          <Icon sf="person.crop.circle.badge.checkmark" drawable="ic_agent" />
          <Label>Agent</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="routine">
          <Icon sf="calendar.badge.clock" drawable="ic_routine" />
          <Label>Routine</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="privacy">
          <Icon sf="lock.shield.fill" drawable="ic_privacy" />
          <Label>Privacy</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf="person.fill" drawable="ic_profile" />
          <Label>Profile</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="email" />
        <Stack.Screen name="meetings" />
        <Stack.Screen name="agent" />
        <Stack.Screen name="routine" />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
