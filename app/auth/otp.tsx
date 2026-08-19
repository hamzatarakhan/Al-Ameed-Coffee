import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-store';

export default function OtpScreen() {
  const { t } = useLang();
  const insets = useSafeAreaInsets();
  const auth = useAuth();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [resent, setResent] = useState(false);

  const submit = () => {
    if (auth.verifyOtp(code)) {
      setError(undefined);
      // No explicit navigation needed — AppShell swaps to the tabs stack
      // the moment isAuthenticated flips true.
      return;
    }
    setError(t('auth.otpInvalid'));
  };

  const resend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 2500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('auth.otpTitle')} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: insets.bottom + space.xxl }} keyboardShouldPersistTaps="handled">
          <AppText variant="body" style={{ marginBottom: space.lg }}>
            {t('auth.otpBody', { phone: auth.pendingPhone ?? '' })}
          </AppText>

          <View
            style={{
              backgroundColor: colors.brandTint,
              borderRadius: radius.md,
              padding: space.md,
              marginBottom: space.lg,
            }}>
            <AppText variant="label" color={colors.brandInk}>
              {t('auth.otpDemoHint')}
            </AppText>
          </View>

          <Input
            placeholder="••••"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={4}
            error={error}
            style={{ textAlign: 'center', letterSpacing: 8, fontSize: 20 }}
          />

          <Button label={t('auth.verify')} onPress={submit} style={{ marginTop: space.lg }} />

          <Pressable onPress={resend} hitSlop={8} style={{ alignSelf: 'center', marginTop: space.xl }}>
            <AppText variant="bodySemiBold" color={colors.brandInk}>
              {resent ? t('auth.resendSent') : t('auth.resend')}
            </AppText>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
