import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ChoiceChips } from '@/components/ChoiceChips';
import { Input } from '@/components/Input';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-store';
import { useProfile } from '@/lib/profile-store';
import { jordanCities, type Gender, type MaritalStatus } from '@/lib/mock-data';

const LOGO = require('../../assets/images/logo.png');

export default function CompleteProfileScreen() {
  const { t } = useLang();
  const insets = useSafeAreaInsets();
  const auth = useAuth();
  const { profile, updateProfile } = useProfile();

  const initialParts = (auth.pendingName ?? '').trim().split(/\s+/);

  const [firstName, setFirstName] = useState(initialParts[0] ?? '');
  const [lastName, setLastName] = useState(initialParts.slice(1).join(' '));
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender>('');
  const [marital, setMarital] = useState<MaritalStatus>('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [error, setError] = useState<string | undefined>();

  const save = () => {
    if (firstName.trim().length < 1 || lastName.trim().length < 1) {
      setError(t('auth.nameRequired'));
      return;
    }
    setError(undefined);
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    updateProfile({
      nameAr: fullName,
      nameEn: fullName,
      phone: auth.pendingPhone ? `+962 ${auth.pendingPhone.replace(/^0/, '')}` : profile.phone,
      dateOfBirth: dob,
      gender,
      maritalStatus: marital,
      city,
      area,
    });
    auth.completeProfile();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: insets.top + space.xl, paddingBottom: space.xxl }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: space.xl }}>
          <Image source={LOGO} style={{ width: 84, height: 47 }} resizeMode="contain" />
          <AppText variant="h2" align="center" style={{ marginTop: space.md }}>
            {t('auth.completeProfileTitle')}
          </AppText>
        </View>

        <View style={{ gap: space.md }}>
          <Input label={t('auth.firstName')} value={firstName} onChangeText={setFirstName} error={error} />
          <Input label={t('auth.lastName')} value={lastName} onChangeText={setLastName} />
          <Input label={t('auth.dateOfBirth')} placeholder={t('auth.dobPlaceholder')} value={dob} onChangeText={setDob} keyboardType="numbers-and-punctuation" />

          <View style={{ gap: space.xs }}>
            <AppText variant="label" color={colors.textMuted}>
              {t('auth.gender')}
            </AppText>
            <ChoiceChips<Gender>
              value={gender}
              onChange={setGender}
              options={[
                { value: 'male', label: t('auth.genderMale') },
                { value: 'female', label: t('auth.genderFemale') },
              ]}
            />
          </View>

          <View style={{ gap: space.xs }}>
            <AppText variant="label" color={colors.textMuted}>
              {t('auth.maritalStatus')}
            </AppText>
            <ChoiceChips<MaritalStatus>
              value={marital}
              onChange={setMarital}
              options={[
                { value: 'single', label: t('auth.maritalSingle') },
                { value: 'married', label: t('auth.maritalMarried') },
              ]}
            />
          </View>

          <View style={{ gap: space.xs }}>
            <AppText variant="label" color={colors.textMuted}>
              {t('auth.city')}
            </AppText>
            <ChoiceChips<string> value={city} onChange={setCity} options={jordanCities.map((c) => ({ value: c, label: c }))} />
          </View>

          <Input label={t('auth.area')} placeholder={t('auth.areaPlaceholder')} value={area} onChangeText={setArea} />

          <Button label={t('auth.saveContinue')} onPress={save} style={{ marginTop: space.sm }} />

          <Pressable onPress={() => auth.completeProfile()} hitSlop={8} style={{ alignSelf: 'center', marginTop: space.sm }}>
            <AppText variant="bodySemiBold" color={colors.textMuted}>
              {t('auth.skipForNow')}
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
