import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { PhoneInput } from '@/components/PhoneInput';
import { Row } from '@/components/Row';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, space } from '@/lib/theme';
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
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; agreed?: string }>({});

  const submit = () => {
    const nextErrors: typeof errors = {};
    if (name.trim().length < 2) nextErrors.name = t('auth.nameRequired');
    if (!isValidJordanPhone(phone)) nextErrors.phone = t('auth.phoneRequired');
    if (!agreed) nextErrors.agreed = t('auth.termsRequired');
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    auth.startAuth(phone, true, name);
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

            <Pressable onPress={() => setAgreed((a) => !a)}>
              <Row style={{ alignItems: 'center', gap: space.sm }}>
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: radius.sm,
                    borderWidth: 1.5,
                    borderColor: agreed ? colors.brand : colors.border,
                    backgroundColor: agreed ? colors.brand : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {agreed ? <Ionicons name="checkmark" size={15} color={colors.white} /> : null}
                </View>
                <AppText variant="muted" style={{ flex: 1 }}>
                  {t('auth.agreePrefix')}{' '}
                  <AppText variant="label" color={colors.brandInk} onPress={() => router.push('/legal/terms')}>
                    {t('auth.agreeTerms')}
                  </AppText>
                </AppText>
              </Row>
            </Pressable>
            {errors.agreed ? (
              <AppText variant="label" color={colors.critical}>
                {errors.agreed}
              </AppText>
            ) : null}

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
