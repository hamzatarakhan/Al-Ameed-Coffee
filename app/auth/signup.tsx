import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { PhoneInput } from '@/components/PhoneInput';
import { Row } from '@/components/Row';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-store';
import { isValidJordanPhone } from '@/lib/phone';

export default function SignupScreen() {
  const { t } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const auth = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const submit = () => {
    const nextErrors: typeof errors = {};
    if (name.trim().length < 2) nextErrors.name = t('auth.nameRequired');
    if (!isValidJordanPhone(phone)) nextErrors.phone = t('auth.phoneRequired');
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    auth.startAuth(phone, true);
    router.push('/auth/otp');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('auth.createAccount')} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: insets.bottom + space.xxl }} keyboardShouldPersistTaps="handled">
          <View style={{ gap: space.md }}>
            <Input label={t('auth.nameLabel')} placeholder={t('auth.namePlaceholder')} value={name} onChangeText={setName} error={errors.name} />
            <PhoneInput label={t('auth.phoneLabel')} value={phone} onChangeText={setPhone} error={errors.phone} />
            <Button label={t('auth.continue')} onPress={submit} style={{ marginTop: space.sm }} />
          </View>

          <Row style={{ justifyContent: 'center', gap: space.xs, marginTop: space.xl }}>
            <AppText variant="muted">{t('auth.haveAccount')}</AppText>
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <AppText variant="bodySemiBold" color={colors.brandInk}>
                {t('auth.signIn')}
              </AppText>
            </Pressable>
          </Row>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
