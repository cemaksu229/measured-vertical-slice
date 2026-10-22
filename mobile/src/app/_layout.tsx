import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAppStore } from '@/store/useAppStore';
import { fontAssets } from '@/theme/tokens';

// Expo Go warns when expo-notifications is imported; keep that out of the demo UI.
LogBox.ignoreLogs(['expo-notifications', '[expo-notifications]']);

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const ready = hasHydrated && (fontsLoaded || fontError !== null);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{ headerShown: false, animation: 'slide_from_right', gestureEnabled: true }}
      />
    </GestureHandlerRootView>
  );
}
