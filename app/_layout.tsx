import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts as useJostFonts, Jost_600SemiBold, Jost_700Bold } from '@expo-google-fonts/jost';
import { useFonts as useMulishFonts, Mulish_400Regular, Mulish_500Medium, Mulish_700Bold } from '@expo-google-fonts/mulish';
import { useFonts as useCairoFonts, Cairo_400Regular, Cairo_500Medium, Cairo_600SemiBold, Cairo_700Bold } from '@expo-google-fonts/cairo';
import { useFonts as usePlexMonoFonts, IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono';

import { LanguageProvider } from '@/lib/i18n';
import { ThemeModeProvider, useThemeMode } from '@/lib/theme-mode';
import { NotificationsProvider } from '@/lib/notifications-store';
import { colors } from '@/lib/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [f1] = useJostFonts({ Jost_600SemiBold, Jost_700Bold });
  const [f2] = useMulishFonts({ Mulish_400Regular, Mulish_500Medium, Mulish_700Bold });
  const [f3] = useCairoFonts({ Cairo_400Regular, Cairo_500Medium, Cairo_600SemiBold, Cairo_700Bold });
  const [f4] = usePlexMonoFonts({ IBMPlexMono_500Medium });

  const fontsLoaded = f1 && f2 && f3 && f4;

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeModeProvider>
        <LanguageProvider>
          {/* Outside AppShell's keyed Stack on purpose — read/unread state
              shouldn't reset just because dark mode was toggled. */}
          <NotificationsProvider>
            <AppShell />
          </NotificationsProvider>
        </LanguageProvider>
      </ThemeModeProvider>
    </SafeAreaProvider>
  );
}

function AppShell() {
  const { isDark } = useThemeMode();

  // react-native-screens freezes/keeps-alive inactive tab screens for native
  // transition performance — they don't re-render just because an ancestor's
  // context value changed, so mutating `colors` and relying on cascade never
  // reaches Home/Order/Check-in while Account (the toggle's origin) is the
  // only one focused. A key on the whole navigator forces every screen to
  // unmount and remount fresh (reading the now-mutated colors) instead of
  // relying on a re-render reaching frozen siblings. Cost: toggling resets
  // navigation to the initial route — acceptable since the toggle only lives
  // on the Account screen to begin with.
  return (
    <>
      <Stack key={isDark ? 'dark' : 'light'} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="my-points" options={{ presentation: 'card' }} />
        <Stack.Screen name="redeemed-rewards" options={{ presentation: 'card' }} />
        <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
        <Stack.Screen name="notification/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="branches/index" options={{ presentation: 'card' }} />
        <Stack.Screen name="branches/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="profile" options={{ presentation: 'card' }} />
        <Stack.Screen name="orders" options={{ presentation: 'card' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}
