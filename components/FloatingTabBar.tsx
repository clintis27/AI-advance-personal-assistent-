
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  DimensionValue,
} from 'react-native';
import { useRouter, usePathname, Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol, IconSymbolName } from '@/components/IconSymbol';
import { BlurView } from 'expo-blur';
import { useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '@/styles/commonStyles';

const { width: screenWidth } = Dimensions.get('window');

export interface TabBarItem {
  name: string;
  route: string;
  icon: IconSymbolName;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = screenWidth - 40,
  borderRadius = 24,
  bottomMargin
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const animatedValue = useSharedValue(0);

  // Improved active tab detection with better path matching
  const activeTabIndex = React.useMemo(() => {
    // Find the best matching tab based on the current pathname
    let bestMatch = -1;
    let bestMatchScore = 0;

    tabs.forEach((tab, index) => {
      let score = 0;

      // Exact route match gets highest score
      if (pathname === tab.route) {
        score = 100;
      }
      // Check if pathname starts with tab route (for nested routes)
      else if (pathname.startsWith(tab.route)) {
        score = 80;
      }
      // Check if pathname contains the tab name
      else if (pathname.includes(tab.name)) {
        score = 60;
      }
      // Check for partial matches in the route
      else if (tab.route.includes('/(tabs)/') && pathname.includes(tab.route.split('/(tabs)/')[1])) {
        score = 40;
      }

      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatch = index;
      }
    });

    // Default to first tab if no match found
    return bestMatch >= 0 ? bestMatch : 0;
  }, [pathname, tabs]);

  React.useEffect(() => {
    if (activeTabIndex >= 0) {
      animatedValue.value = withSpring(activeTabIndex, {
        damping: 20,
        stiffness: 140,
        mass: 0.7,
      });
    }
  }, [activeTabIndex, animatedValue]);

  const handleTabPress = (route: string) => {
    router.push(route as Href);
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = (containerWidth - 16) / tabs.length;
    return {
      transform: [
        {
          translateX: interpolate(
            animatedValue.value,
            [0, tabs.length - 1],
            [0, tabWidth * (tabs.length - 1)]
          ),
        },
      ],
    };
  });

  // Dynamic styles based on theme
  const dynamicStyles = {
    blurContainer: {
      ...styles.blurContainer,
      ...Platform.select({
        ios: {
          backgroundColor: theme.dark
            ? 'rgba(26, 26, 26, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
        },
        android: {
          backgroundColor: theme.dark
            ? 'rgba(26, 26, 26, 0.98)'
            : 'rgba(255, 255, 255, 0.98)',
          elevation: 12,
        },
        web: {
          backgroundColor: theme.dark
            ? 'rgba(26, 26, 26, 0.98)'
            : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          boxShadow: theme.dark
            ? '0 -4px 24px rgba(0, 0, 0, 0.6)'
            : '0 -4px 24px rgba(0, 0, 0, 0.08)',
        },
      }),
    },
    background: {
      ...styles.background,
      backgroundColor: 'transparent',
    },
    indicator: {
      ...styles.indicator,
      backgroundColor: theme.dark
        ? colors.secondaryDark
        : colors.backgroundSecondary,
      width: `${(100 / tabs.length) - 4}%` as DimensionValue,
    },
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={[
        styles.container,
        {
          width: containerWidth,
          marginBottom: bottomMargin ?? (Platform.OS === 'ios' ? 12 : 16)
        }
      ]}>
        <BlurView
          intensity={Platform.OS === 'web' ? 0 : 90}
          style={[dynamicStyles.blurContainer, { borderRadius }]}
        >
          <View style={dynamicStyles.background} />
          <Animated.View style={[dynamicStyles.indicator, indicatorStyle]} />
          <View style={styles.tabsContainer}>
            {tabs.map((tab, index) => {
              const isActive = activeTabIndex === index;

              return (
                <TouchableOpacity
                  key={tab.name}
                  style={styles.tab}
                  onPress={() => handleTabPress(tab.route)}
                  activeOpacity={0.7}
                >
                  <View style={styles.tabContent}>
                    <IconSymbol
                      name={tab.icon}
                      size={24}
                      color={isActive ? colors.primary : (theme.dark ? colors.textMutedDark : colors.textMuted)}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        { color: theme.dark ? colors.textMutedDark : colors.textMuted },
                        isActive && { color: colors.primary, fontWeight: '700' },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
  },
  container: {
    marginHorizontal: 20,
    alignSelf: 'center',
  },
  blurContainer: {
    overflow: 'hidden',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  indicator: {
    position: 'absolute',
    top: 6,
    left: 8,
    bottom: 6,
    borderRadius: 18,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 68,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: -0.1,
  },
});
