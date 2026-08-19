import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Pill } from '@/components/Pill';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { branches } from '@/lib/mock-data';

export default function BranchesListScreen() {
  const { t, lang, isRTL } = useLang();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('branches.title')} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl }}>
        <Row style={{ alignItems: 'center', gap: space.xs, marginBottom: space.lg }}>
          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
          <AppText variant="muted">{t('branches.distanceUnknown')}</AppText>
        </Row>

        <View style={{ gap: space.md }}>
          {branches.map((b) => (
            <Pressable
              key={b.id}
              onPress={() => router.push(`/branches/${b.id}`)}
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radius.lg,
                padding: space.lg,
              }}>
              <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: space.xs }}>
                <AppText variant="bodySemiBold">{lang === 'ar' ? b.nameAr : b.nameEn}</AppText>
                <Pill tone={b.openNow ? 'good' : 'neutral'} label={b.openNow ? t('branches.openNow') : t('branches.closed')} />
              </Row>
              <AppText variant="muted">{lang === 'ar' ? b.addressAr : b.addressEn}</AppText>
              <Row style={{ alignItems: 'center', gap: 4, marginTop: space.sm }}>
                <AppText variant="label" color={colors.brandInk}>
                  {t('common.seeAll')}
                </AppText>
                <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={12} color={colors.brandInk} />
              </Row>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
