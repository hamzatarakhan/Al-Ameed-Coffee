import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-store';
import { toWesternDigits } from '@/lib/digits';

const BRANCH_PHONE = '+962 6 581 4300';
const RESEND_SECONDS = 59;

export default function OtpScreen() {
  const { t } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const auth = useAuth();

  // A single real TextInput captures every keystroke; the 4 boxes below are
  // pure display driven off `code`. Four separate maxLength=1 inputs with
  // manual focus-jumping between them is the classic OTP pattern, but it's
  // fragile on real iOS devices — predictive text / the one-time-code
  // QuickType bar can interfere with the focus handoff between boxes in
  // ways that never show up in a browser/simulator. Routing all typing
  // through one input sidesteps that whole class of bug.
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [focused, setFocused] = useState(false);
  const hiddenInput = useRef<TextInput>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const verify = (value: string) => {
    if (auth.verifyOtp(value)) {
      setError(undefined);
      // No explicit navigation needed — AppShell swaps stacks the moment
      // auth.status changes.
      return;
    }
    setError(t('auth.otpInvalid'));
  };

  const onChangeCode = (value: string) => {
    const clean = toWesternDigits(value).replace(/\D/g, '').slice(0, 4);
    setCode(clean);
    if (clean.length === 4) verify(clean);
  };

  const resend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('auth.otpTitle')} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: insets.bottom + space.xxl }} keyboardShouldPersistTaps="handled">
          <AppText variant="body" style={{ marginBottom: space.lg }}>
            {t('auth.otpBody', { phone: `+962${(auth.pendingPhone ?? '').replace(/^0/, '')}` })}
          </AppText>

          <View style={{ backgroundColor: colors.brandTint, borderRadius: radius.md, padding: space.md, marginBottom: space.lg }}>
            <AppText variant="label" color={colors.brandInk}>
              {t('auth.otpDemoHint')}
            </AppText>
          </View>

          <Pressable onPress={() => hiddenInput.current?.focus()}>
            {/* Explicit flexDirection: 'row' (not the app's RTL-mirroring
                Row component) — like the phone number field, a 4-digit code
                is a fixed left-to-right sequence regardless of app
                language; mirroring it made digits appear to fill from the
                right, backwards from where they were actually typed. */}
            <View style={{ flexDirection: 'row', gap: space.sm, justifyContent: 'center' }}>
              {[0, 1, 2, 3].map((i) => {
                const isActive = focused && i === code.length;
                return (
                  <View
                    key={i}
                    style={{
                      width: 60,
                      height: 64,
                      borderRadius: radius.md,
                      borderWidth: isActive ? 2 : 1.5,
                      borderColor: error ? colors.critical : isActive ? colors.brand : colors.border,
                      backgroundColor: colors.surface2,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AppText
                      variant="display"
                      // The "display" scale's 34px line-height (sized for
                      // multi-line text elsewhere) sits noticeably above
                      // center inside a single-glyph 64px box, especially on
                      // Android where extra font padding stacks on top of
                      // it. Tightening the line-height and killing that
                      // padding centers it for real instead of just via the
                      // parent's justifyContent.
                      style={{ lineHeight: 28, includeFontPadding: false, textAlignVertical: 'center' }}>
                      {code[i] ?? ''}
                    </AppText>
                  </View>
                );
              })}
            </View>
          </Pressable>
          <TextInput
            ref={hiddenInput}
            value={code}
            onChangeText={onChangeCode}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            keyboardType="number-pad"
            maxLength={4}
            autoFocus
            // Visually hidden but still a real, focusable, typeable input —
            // 0 size + opacity is the standard way to keep a TextInput
            // functional while the 4 boxes above do the actual display.
            style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
          />
          {error ? (
            <AppText variant="label" color={colors.critical} align="center" style={{ marginTop: space.sm }}>
              {error}
            </AppText>
          ) : null}

          <Button label={t('auth.verify')} onPress={() => verify(code)} style={{ marginTop: space.lg }} />

          <View style={{ alignItems: 'center', marginTop: space.lg, gap: space.xs }}>
            {secondsLeft > 0 ? (
              <AppText variant="mono" color={colors.textMuted}>
                {mm}:{ss}
              </AppText>
            ) : null}
            <Pressable onPress={resend} hitSlop={8} disabled={secondsLeft > 0}>
              <AppText variant="bodySemiBold" color={secondsLeft > 0 ? colors.textMuted : colors.brandInk}>
                {t('auth.resend')}
              </AppText>
            </Pressable>
          </View>

          <View style={{ alignItems: 'center', marginTop: space.xxl, gap: space.sm }}>
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <AppText variant="muted">{t('auth.wrongNumber')}</AppText>
            </Pressable>
            <Pressable onPress={() => Linking.openURL(`tel:${BRANCH_PHONE}`)} hitSlop={8}>
              <AppText variant="muted">{t('auth.needHelp')}</AppText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
