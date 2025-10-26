
import "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, Alert, AppState, AppStateStatus } from "react-native";
import { useNetworkState } from "expo-network";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Button } from "@/components/button";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { authService } from "@/services/authService";
import { syncService } from "@/services/syncService";
import { notificationService } from "@/services/notificationService";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const networkState = useNetworkState();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [appReady, setAppReady] = useState(false);
  const [shouldShowStartupSummary, setShouldShowStartupSummary] = useState(false);

  // Initialize app on startup
  useEffect(() => {
    if (loaded) {
      initializeApp();
    }
  }, [loaded]);

  // Monitor app state changes (foreground/background)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  // Handle network connectivity changes
  useEffect(() => {
    if (
      !networkState.isConnected &&
      networkState.isInternetReachable === false
    ) {
      Alert.alert(
        "🔌 You are offline",
        "You can keep using the app! Your changes will be saved locally and synced when you are back online."
      );
    } else if (networkState.isConnected && appReady) {
      // Back online - sync data
      console.log('Back online, syncing data...');
      syncService.syncNow();
    }
  }, [networkState.isConnected, networkState.isInternetReachable, appReady]);

  /**
   * Initialize app on startup
   */
  const initializeApp = async () => {
    try {
      console.log('🚀 Initializing PVA+ app...');

      // Step 1: Check if user is authenticated
      const isAuthenticated = authService.isAuthenticated();
      console.log('Authentication status:', isAuthenticated);

      if (isAuthenticated) {
        // Step 2: Check for missed updates
        const shouldShowSummary = await checkForMissedUpdates();
        setShouldShowStartupSummary(shouldShowSummary);

        // Step 3: Sync data in background
        console.log('Starting background sync...');
        syncService.syncNow().catch(error => {
          console.error('Background sync error:', error);
        });

        // Step 4: Initialize notification service
        console.log('Initializing notifications...');
        await notificationService.requestPermissions();

        // Step 5: Navigate to startup summary if needed
        if (shouldShowSummary) {
          console.log('Navigating to startup summary...');
          setTimeout(() => {
            router.replace('/startup-summary');
          }, 500);
        }
      }

      setAppReady(true);
      await SplashScreen.hideAsync();
      console.log('✅ App initialization complete');
    } catch (error) {
      console.error('Error initializing app:', error);
      setAppReady(true);
      await SplashScreen.hideAsync();
    }
  };

  /**
   * Check for missed updates since last app use
   */
  const checkForMissedUpdates = async (): Promise<boolean> => {
    try {
      console.log('Checking for missed updates...');

      // Get last app use time
      const lastAppUse = await getLastAppUseTime();
      const now = new Date();
      const timeSinceLastUse = now.getTime() - new Date(lastAppUse).getTime();
      const hoursSinceLastUse = timeSinceLastUse / (1000 * 60 * 60);

      console.log('Hours since last use:', hoursSinceLastUse.toFixed(2));

      // Save current time as last app use
      await saveLastAppUseTime(now.toISOString());

      // Show startup summary if:
      // 1. More than 4 hours since last use
      // 2. Or if there are unread notifications
      const unreadNotifications = notificationService.getUnreadNotifications();
      const hasUnreadNotifications = unreadNotifications.length > 0;

      console.log('Unread notifications:', unreadNotifications.length);

      return hoursSinceLastUse > 4 || hasUnreadNotifications;
    } catch (error) {
      console.error('Error checking for missed updates:', error);
      return false;
    }
  };

  /**
   * Handle app state changes (foreground/background)
   */
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    console.log('App state changed to:', nextAppState);

    if (nextAppState === 'active') {
      // App came to foreground
      console.log('App came to foreground');

      if (appReady && authService.isAuthenticated()) {
        // Check for missed updates
        const shouldShowSummary = await checkForMissedUpdates();
        
        if (shouldShowSummary) {
          console.log('Showing startup summary after returning to foreground');
          router.push('/startup-summary');
        } else {
          // Just sync data in background
          syncService.syncNow().catch(error => {
            console.error('Background sync error:', error);
          });
        }
      }
    } else if (nextAppState === 'background') {
      // App went to background
      console.log('App went to background');
      await saveLastAppUseTime(new Date().toISOString());
    }
  };

  /**
   * Get last app use time from storage
   */
  const getLastAppUseTime = async (): Promise<string> => {
    try {
      const { SecureStorage } = await import('@/utils/secureStorage');
      const lastUse = await SecureStorage.getItem('last_app_use');
      return lastUse || new Date().toISOString();
    } catch (error) {
      console.error('Error getting last app use time:', error);
      return new Date().toISOString();
    }
  };

  /**
   * Save last app use time to storage
   */
  const saveLastAppUseTime = async (timestamp: string): Promise<void> => {
    try {
      const { SecureStorage } = await import('@/utils/secureStorage');
      await SecureStorage.setItem('last_app_use', timestamp);
      console.log('Saved last app use time:', timestamp);
    } catch (error) {
      console.error('Error saving last app use time:', error);
    }
  };

  if (!loaded || !appReady) {
    return null;
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "rgb(0, 122, 255)", // System Blue
      background: "rgb(242, 242, 247)", // Light mode background
      card: "rgb(255, 255, 255)", // White cards/surfaces
      text: "rgb(0, 0, 0)", // Black text for light mode
      border: "rgb(216, 216, 220)", // Light gray for separators/borders
      notification: "rgb(255, 59, 48)", // System Red
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "rgb(10, 132, 255)", // System Blue (Dark Mode)
      background: "rgb(1, 1, 1)", // True black background for OLED displays
      card: "rgb(28, 28, 30)", // Dark card/surface color
      text: "rgb(255, 255, 255)", // White text for dark mode
      border: "rgb(44, 44, 46)", // Dark gray for separators/borders
      notification: "rgb(255, 69, 58)", // System Red (Dark Mode)
    },
  };

  return (
    <>
      <StatusBar style="auto" animated />
      <ThemeProvider
        value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
      >
        <WidgetProvider>
          <GestureHandlerRootView>
            <Stack>
              {/* Main app with tabs */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              {/* Modal Demo Screens */}
              <Stack.Screen
                name="modal"
                options={{
                  presentation: "modal",
                  title: "Standard Modal",
                }}
              />
              <Stack.Screen
                name="formsheet"
                options={{
                  presentation: "formSheet",
                  title: "Form Sheet Modal",
                  sheetGrabberVisible: true,
                  sheetAllowedDetents: [0.5, 0.8, 1.0],
                  sheetCornerRadius: 20,
                }}
              />
              <Stack.Screen
                name="transparent-modal"
                options={{
                  presentation: "transparentModal",
                  headerShown: false,
                }}
              />
            </Stack>
            <SystemBars style={"auto"} />
          </GestureHandlerRootView>
        </WidgetProvider>
      </ThemeProvider>
    </>
  );
}
