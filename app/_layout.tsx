import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts as useJostFonts, Jost_600SemiBold, Jost_700Bold } from '@expo-google-fonts/jost';
import { useFonts as useMulishFonts, Mulish_400Regular, Mulish_500Medium, Mulish_700Bold } from '@expo-google-fonts/mulish';
import { useFonts as useCairoFonts, Cairo_400Regular, Cairo_500Medium, Cairo_600SemiBold, Cairo_700Bold } from '@expo-google-fonts/cairo';
import { useFonts as usePlexMonoFonts, IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono';

import { LanguageProvider, useLang } from '@/lib/i18n';
import { ThemeModeProvider, useThemeMode, type ThemeMode } from '@/lib/theme-mode';
import { OrderSheetProvider, useOrderSheet } from '@/lib/order-sheet';
import { OrderCartProvider } from '@/lib/order-cart';
import { NotificationsProvider } from '@/lib/notifications-store';
import { AuthProvider, useAuth } from '@/lib/auth-store';
import { ProfileProvider } from '@/lib/profile-store';
import { AnimatedSplash } from '@/components/AnimatedSplash';
import { OptionSheet } from '@/components/OptionSheet';
import { OrderSheet } from '@/components/OrderSheet';
import { colors } from '@/lib/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [f1] = useJostFonts({ Jost_600SemiBold, Jost_700Bold });
  const [f2] = useMulishFonts({ Mulish_400Regular, Mulish_500Medium, Mulish_700Bold });
  const [f3] = useCairoFonts({ Cairo_400Regular, Cairo_500Medium, Cairo_600SemiBold, Cairo_700Bold });
  const [f4] = usePlexMonoFonts({ IBMPlexMono_500Medium });
  const [showSplash, setShowSplash] = useState(true);

  const fontsLoaded = f1 && f2 && f3 && f4;

  useEffect(() => {
    // Hand off from the static native splash to the animated JS one the
    // moment fonts are ready — AnimatedSplash renders on the very next
    // frame, so there's no bare-background flash in between.
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeModeProvider>
        <LanguageProvider>
          {/* Outside AppShell's keyed Stack on purpose — read/unread state,
              session, and profile edits shouldn't reset just because dark
              mode was toggled. */}
          <AuthProvider>
            <ProfileProvider>
              <NotificationsProvider>
                <OrderSheetProvider>
                  <OrderCartProvider>
                    <AppShell />
                    {showSplash ? <AnimatedSplash onFinish={() => setShowSplash(false)} /> : null}
                  </OrderCartProvider>
                </OrderSheetProvider>
              </NotificationsProvider>
            </ProfileProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeModeProvider>
    </SafeAreaProvider>
  );
}

function AppShell() {
  const { isDark, mode, setMode, sheetOpen, closeSheet } = useThemeMode();
  const { open: orderSheetOpen, closeSheet: closeOrderSheet } = useOrderSheet();
  const { status } = useAuth();
  const { t } = useLang();
  const themeOptions: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: t('account.themeLight') },
    { value: 'dark', label: t('account.themeDark') },
    { value: 'system', label: t('account.themeSystem') },
  ];

  // react-native-screens freezes/keeps-alive inactive tab screens for native
  // transition performance — they don't re-render just because an ancestor's
  // context value changed, so mutating `colors` and relying on cascade never
  // reaches Home/Order/Check-in while Account (the toggle's origin) is the
  // only one focused. A key on the whole navigator forces every screen to
  // unmount and remount fresh (reading the now-mutated colors) instead of
  // relying on a re-render reaching frozen siblings. Cost: toggling resets
  // navigation to the initial route — acceptable since the toggle only lives
  // on the Account screen to begin with.
  //
  // Auth gating, on the other hand, does NOT use that same swap-the-whole-
  // <Stack> trick: on web the current URL is resolved against whichever
  // screens are declared, and swapping to a Stack instance that doesn't
  // declare a screen for "/" made React Navigation fall back to matching
  // "/" against the full file-based route table anyway — landing on the
  // tabs even while auth was correctly signed out. `Stack.Protected` is the
  // API built for this: one Stack declares every screen (so URL matching
  // always has a real target), and each guard just hides/redirects within
  // it. Three states instead of a boolean: new accounts land in
  // needsProfile after OTP (see auth/complete-profile) before signedIn.
  return (
    <>
      <Stack key={isDark ? 'dark' : 'light'} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Protected guard={status === 'signedOut'}>
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/signup" />
          <Stack.Screen name="auth/otp" />
        </Stack.Protected>

        <Stack.Protected guard={status === 'needsProfile'}>
          <Stack.Screen name="auth/complete-profile" />
        </Stack.Protected>

        <Stack.Protected guard={status === 'signedIn'}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="order-menu" options={{ presentation: 'card' }} />
          <Stack.Screen name="order-item/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="order-cart" options={{ presentation: 'card' }} />
          <Stack.Screen name="order-branch" options={{ presentation: 'card' }} />
          <Stack.Screen name="my-points" options={{ presentation: 'card' }} />
          <Stack.Screen name="redeemed-rewards" options={{ presentation: 'card' }} />
          <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
          <Stack.Screen name="notification/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="branches/index" options={{ presentation: 'card' }} />
          <Stack.Screen name="branches/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="profile" options={{ presentation: 'card' }} />
          <Stack.Screen name="orders" options={{ presentation: 'card' }} />
          <Stack.Screen name="account/delete" options={{ presentation: 'card' }} />
        </Stack.Protected>

        {/* Always reachable regardless of auth state, unlike everything
            above — App Store/Play Store review expects the privacy policy
            and a data-deletion path to be reachable without being signed
            in (Play in particular wants deletion requestable even by
            someone who never installed the app). Declared last: React
            Navigation falls back to a Stack's first declared screen when
            the previously-active route becomes invalid (e.g. right after
            OTP success moves status out of the group /auth/otp belonged
            to) — first here previously meant login/signup landed on this
            block instead of the tabs or complete-profile. */}
        <Stack.Screen name="legal/terms" options={{ presentation: 'card' }} />
        <Stack.Screen name="legal/privacy" options={{ presentation: 'card' }} />
        <Stack.Screen name="legal/delete-data" options={{ presentation: 'card' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Rendered here, above the whole Stack (and thus above the tabs'
          floating iOS tab bar), instead of inside account.tsx where it used
          to live — a sheet mounted inside one tab screen can't visually
          cover a tab bar that floats above every screen's own content.
          Unlike the Stack, this sheet isn't inside the keyed-remount
          subtree (see OptionSheet.tsx for why it reads colors via
          useThemeMode() instead of the mutated `colors` singleton). */}
      <OptionSheet
        visible={sheetOpen}
        onClose={closeSheet}
        title={t('account.nightMode')}
        options={themeOptions}
        value={mode}
        onSelect={setMode}
      />

      {/* Same reasoning as OptionSheet above — Home's "Order Now" quick
          action used to open this sheet from inside its own screen, which
          couldn't cover the floating tab bar either. */}
      <OrderSheet visible={orderSheetOpen} onClose={closeOrderSheet} />
    </>
  );
}
