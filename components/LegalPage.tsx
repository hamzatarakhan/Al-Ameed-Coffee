import React from 'react';
import { ScrollView, View } from 'react-native';
import { AppText } from './AppText';
import { ScreenHeader } from './ScreenHeader';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';

export type LegalSection = { titleAr: string; titleEn: string; bodyAr: string; bodyEn: string };

export function LegalPage({ title, updatedDate, sections }: { title: string; updatedDate: string; sections: LegalSection[] }) {
  const { lang, t } = useLang();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={title} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl }}>
        <AppText variant="muted" style={{ marginBottom: space.lg }}>
          {t('legal.lastUpdated', { date: updatedDate })}
        </AppText>
        <View style={{ gap: space.xl }}>
          {sections.map((s, i) => (
            <View key={i}>
              <AppText variant="h3" style={{ marginBottom: space.xs }}>
                {lang === 'ar' ? s.titleAr : s.titleEn}
              </AppText>
              <AppText variant="body" color={colors.textMuted}>
                {lang === 'ar' ? s.bodyAr : s.bodyEn}
              </AppText>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
