import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts as useFrauncesFonts, Fraunces_600SemiBold, Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import {
  useFonts as usePlexSansFonts,
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
} from '@expo-google-fonts/ibm-plex-sans';
import {
  useFonts as usePlexSansArFonts,
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import { useFonts as useMarkaziFonts, MarkaziText_700Bold } from '@expo-google-fonts/markazi-text';
import { useFonts as usePlexMonoFonts, IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono';

import { LanguageProvider } from '@/lib/i18n';
import { colors } from '@/lib/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [f1] = useFrauncesFonts({ Fraunces_600SemiBold, Fraunces_700Bold });
  const [f2] = usePlexSansFonts({ IBMPlexSans_400Regular, IBMPlexSans_500Medium, IBMPlexSans_600SemiBold });
  const [f3] = usePlexSansArFonts({ IBMPlexSansArabic_400Regular, IBMPlexSansArabic_500Medium, IBMPlexSansArabic_600SemiBold });
  const [f4] = useMarkaziFonts({ MarkaziText_700Bold });
  const [f5] = usePlexMonoFonts({ IBMPlexMono_500Medium });

  const fontsLoaded = f1 && f2 && f3 && f4 && f5;

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
