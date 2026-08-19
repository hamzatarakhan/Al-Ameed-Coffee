import React from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { profile } from '@/lib/mock-data';

export default function ProfileScreen() {
  const { t, lang } = useLang();
  const name = lang === 'ar' ? profile.nameAr : profile.nameEn;
  const initial = name.trim().charAt(0);

  const rows: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }[] = [
    { icon: 'person-outline', label: t('profile.name'), value: name },
    { icon: 'call-outline', label: t('profile.phone'), value: profile.phone },
    { icon: 'mail-outline', label: t('profile.email'), value: profile.email },
    { icon: 'gift-outline', label: t('profile.referralCode'), value: profile.referralCode },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('profile.title')} />
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

        <Card>
          {rows.map((r, i) => (
            <View key={r.label} style={{ borderBottomWidth: i < rows.length - 1 ? 1 : 0, borderBottomColor: colors.border, paddingVertical: space.md }}>
              <Row style={{ alignItems: 'center', gap: space.md }}>
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={r.icon} size={16} color={colors.brandInk} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="label" color={colors.textMuted}>
                    {r.label}
                  </AppText>
                  <AppText variant="body">{r.value}</AppText>
                </View>
              </Row>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}
