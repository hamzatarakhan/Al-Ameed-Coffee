import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Linking, NativeSyntheticEvent, Platform, Pressable, ScrollView, TextInput, TextInputKeyPressEventData, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Row } from '@/components/Row';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-store';

const BRANCH_PHONE = '+962 6 560 0000';
const RESEND_SECONDS = 59;

export default function OtpScreen() {
  const { t } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const auth = useAuth();

  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState<string | undefined>();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const verify = (code: string) => {
    if (auth.verifyOtp(code)) {
      setError(undefined);
      // No explicit navigation needed — AppShell swaps stacks the moment
      // auth.status changes.
      return;
    }
    setError(t('auth.otpInvalid'));
  };

  const setDigit = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);

    if (clean && index < 3) {
      // A same-tick .focus() call can race the native re-render that
      // actually mounts/updates the next box, especially right after
      // typing — deferring one tick makes the jump land reliably.
      setTimeout(() => inputs.current[index + 1]?.focus(), 0);
    }
    if (next.every((d) => d.length === 1)) {
      verify(next.join(''));
    }
  };

  const onKeyPress = (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
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

          <Row style={{ gap: space.sm, justifyContent: 'center' }}>
            {digits.map((d, i) => (
              <TextInput
                key={i}
                ref={(r) => {
                  inputs.current[i] = r;
                }}
                value={d}
                onChangeText={(v) => setDigit(i, v)}
                onKeyPress={(e) => onKeyPress(i, e)}
                keyboardType="number-pad"
                maxLength={1}
                style={{
                  width: 60,
                  height: 64,
                  borderRadius: radius.md,
                  borderWidth: 1.5,
                  borderColor: error ? colors.critical : colors.border,
                  backgroundColor: colors.surface2,
                  textAlign: 'center',
                  fontSize: 24,
                  color: colors.text,
                }}
              />
            ))}
          </Row>
          {error ? (
            <AppText variant="label" color={colors.critical} align="center" style={{ marginTop: space.sm }}>
              {error}
            </AppText>
          ) : null}

          <Button label={t('auth.verify')} onPress={() => verify(digits.join(''))} style={{ marginTop: space.lg }} />

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
