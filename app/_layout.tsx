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
      <LanguageProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="my-points" options={{ presentation: 'card' }} />
          <Stack.Screen name="redeemed-rewards" options={{ presentation: 'card' }} />
          <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
          <Stack.Screen name="branches/index" options={{ presentation: 'card' }} />
          <Stack.Screen name="branches/[id]" options={{ presentation: 'card' }} />
        </Stack>
        <StatusBar style="dark" />
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
