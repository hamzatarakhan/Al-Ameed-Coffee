import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Card } from '@/components/Card';
import { ChoiceChips } from '@/components/ChoiceChips';
import { Input } from '@/components/Input';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useProfile } from '@/lib/profile-store';
import { jordanCities, type Gender, type MaritalStatus } from '@/lib/mock-data';

export default function ProfileScreen() {
  const { t, lang } = useLang();
  const { profile, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  const name = lang === 'ar' ? profile.nameAr : profile.nameEn;
  const initial = name.trim().charAt(0);
  const notSet = t('profile.notSet');

  const startEditing = () => {
    setDraft(profile);
    setEditing(true);
  };

  const save = () => {
    updateProfile(draft);
    setEditing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={t('profile.title')}
        right={
          <Pressable hitSlop={8} onPress={editing ? save : startEditing}>
            <AppText variant="label" color={colors.brandInk}>
              {editing ? t('profile.save') : t('profile.edit')}
            </AppText>
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl }}>
        <View style={{ alignItems: 'center', marginBottom: space.xl }}>
          <View
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              backgroundColor: colors.brand,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: space.md,
            }}>
            <AppText variant="display" color={colors.white}>
              {initial}
            </AppText>
          </View>
          <AppText variant="h2">{name}</AppText>
          <AppText variant="muted">{t('profile.memberSince', { date: profile.memberSince })}</AppText>
        </View>

        {editing ? (
          <Card style={{ gap: space.md }}>
            <Input
              label={t('profile.name')}
              value={lang === 'ar' ? draft.nameAr : draft.nameEn}
              onChangeText={(v) => setDraft((d) => (lang === 'ar' ? { ...d, nameAr: v } : { ...d, nameEn: v }))}
            />
            <Input label={t('profile.phone')} value={draft.phone} onChangeText={(v) => setDraft((d) => ({ ...d, phone: v }))} keyboardType="phone-pad" />
            <Input
              label={t('profile.email')}
              value={draft.email}
              onChangeText={(v) => setDraft((d) => ({ ...d, email: v }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label={t('auth.dateOfBirth')}
              placeholder={t('auth.dobPlaceholder')}
              value={draft.dateOfBirth}
              onChangeText={(v) => setDraft((d) => ({ ...d, dateOfBirth: v }))}
              style={{ textAlign: 'left', writingDirection: 'ltr' }}
            />
            <View style={{ gap: space.xs }}>
              <AppText variant="label" color={colors.textMuted}>
                {t('auth.gender')}
              </AppText>
              <ChoiceChips<Gender>
                value={draft.gender}
                onChange={(v) => setDraft((d) => ({ ...d, gender: v }))}
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
                value={draft.maritalStatus}
                onChange={(v) => setDraft((d) => ({ ...d, maritalStatus: v }))}
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
              <ChoiceChips<string>
                value={draft.city}
                onChange={(v) => setDraft((d) => ({ ...d, city: v }))}
                options={jordanCities.map((c) => ({ value: c, label: c }))}
              />
            </View>
            <Input label={t('auth.area')} placeholder={t('auth.areaPlaceholder')} value={draft.area} onChangeText={(v) => setDraft((d) => ({ ...d, area: v }))} />
          </Card>
        ) : (
          <Card>
            {[
              { icon: 'person-outline' as const, label: t('profile.name'), value: name },
              { icon: 'call-outline' as const, label: t('profile.phone'), value: profile.phone },
              { icon: 'mail-outline' as const, label: t('profile.email'), value: profile.email },
              { icon: 'gift-outline' as const, label: t('profile.referralCode'), value: profile.referralCode },
              { icon: 'calendar-outline' as const, label: t('auth.dateOfBirth'), value: profile.dateOfBirth || notSet },
              {
                icon: 'male-female-outline' as const,
                label: t('auth.gender'),
                value: profile.gender === 'male' ? t('auth.genderMale') : profile.gender === 'female' ? t('auth.genderFemale') : notSet,
              },
              {
                icon: 'heart-outline' as const,
                label: t('auth.maritalStatus'),
                value: profile.maritalStatus === 'single' ? t('auth.maritalSingle') : profile.maritalStatus === 'married' ? t('auth.maritalMarried') : notSet,
              },
              { icon: 'business-outline' as const, label: t('auth.city'), value: profile.city || notSet },
              { icon: 'map-outline' as const, label: t('auth.area'), value: profile.area || notSet },
            ].map((r, i, arr) => (
              <View key={r.label} style={{ borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.border, paddingVertical: space.md }}>
                <Row style={{ alignItems: 'center', gap: space.md }}>
                  <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={r.icon} size={16} color={colors.brandInk} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText variant="label" color={colors.textMuted}>
                      {r.label}
                    </AppText>
                    <AppText variant="body" color={r.value === notSet ? colors.textMuted : undefined}>
                      {r.value}
                    </AppText>
                  </View>
                </Row>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </View>
  );
}
