import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { AppProvider } from '@/data/store';

/**
 * Native stack headers on iOS: translucent + system blur means the nav bar
 * picks up Liquid Glass on iOS 26 and falls back to a standard blurred bar
 * on older versions.
 */
const glassHeader =
  Platform.OS === 'ios'
    ? ({
        headerShown: true,
        headerTransparent: true,
        headerBlurEffect: 'systemChromeMaterial' as const,
        headerShadowVisible: false,
        headerTintColor: colors.maroon,
        headerLargeTitleShadowVisible: false,
        headerStyle: { backgroundColor: 'transparent' },
        headerTitleStyle: { color: colors.ink, fontSize: 17, fontWeight: '600' as const },
      })
    : { headerShown: false };

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <AppProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
            }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            <Stack.Screen name="room/[id]" options={{ headerShown: false }} />

            <Stack.Screen
              name="booking/dates"
              options={{
                ...glassHeader,
                presentation: 'modal',
                title: 'Dates & guests',
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen name="outlet/[id]" options={{ headerShown: false }} />
            <Stack.Screen
              name="booking/review"
              options={{ ...glassHeader, title: 'Review booking' }}
            />
            <Stack.Screen
              name="booking/confirmed"
              options={{ headerShown: false, gestureEnabled: false }}
            />

            <Stack.Screen
              name="dine/cart"
              options={{
                ...glassHeader,
                presentation: 'modal',
                title: 'Room Service',
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="digital-key"
              options={{
                presentation: 'modal',
                headerShown: false,
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="elite/join"
              options={{ ...glassHeader, presentation: 'modal', title: 'Elite Card' }}
            />
          </Stack>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
