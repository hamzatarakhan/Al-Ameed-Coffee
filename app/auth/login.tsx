import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { PhoneInput } from '@/components/PhoneInput';
import { Row } from '@/components/Row';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-store';
import { isValidJordanPhone } from '@/lib/phone';
import { brand } from '@/lib/brand';

export default function LoginScreen() {
  const { t } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const auth = useAuth();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      AppleAuthentication.isAvailableAsync().then(setAppleAvailable).catch(() => {});
    }
  }, []);

  const submit = () => {
    if (!isValidJordanPhone(phone)) {
      setError(t('auth.phoneRequired'));
      return;
    }
    setError(undefined);
    auth.startAuth(phone, false);
    router.push('/auth/otp');
  };

  const handleAppleSignIn = async () => {
    try {
      await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });
      auth.signInWithApple();
    } catch {
      // User cancelled, or unavailable in this environment (e.g. Expo Go on
      // a non-signed build) — nothing to recover from, just stay put.
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: space.lg, paddingTop: insets.top + space.xxl, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: space.xxl }}>
          <Image source={brand.logo} style={{ width: 96, height: 54 }} resizeMode="contain" />
          <AppText variant="display" align="center" style={{ marginTop: space.lg, marginBottom: space.xs }}>
            {t('auth.welcomeTitle')}
          </AppText>
          <AppText variant="muted" align="center">
            {t('auth.welcomeBody')}
          </AppText>
        </View>

        <View style={{ gap: space.md }}>
          <PhoneInput label={t('auth.phoneLabel')} value={phone} onChangeText={setPhone} error={error} />
          <Button label={t('auth.continue')} onPress={submit} />
        </View>

        {appleAvailable ? (
          <>
            <Row style={{ alignItems: 'center', gap: space.sm, marginVertical: space.lg }}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              <AppText variant="label" color={colors.textMuted}>
                {t('auth.or')}
              </AppText>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            </Row>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={10}
              style={{ height: 52 }}
              onPress={handleAppleSignIn}
            />
          </>
        ) : null}

        <Row style={{ justifyContent: 'center', gap: space.xs, marginTop: space.xl }}>
          <AppText variant="muted">{t('auth.noAccount')}</AppText>
          <Pressable onPress={() => router.push('/auth/signup')} hitSlop={8}>
            <AppText variant="bodySemiBold" color={colors.brandInk}>
              {t('auth.createAccount')}
            </AppText>
          </Pressable>
        </Row>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
