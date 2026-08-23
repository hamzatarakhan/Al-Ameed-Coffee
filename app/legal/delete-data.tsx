import React from 'react';
import { Linking, ScrollView, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { brand } from '@/lib/brand';

// Reachable without being signed in (see app/_layout.tsx) — Google Play in
// particular requires a data-deletion path that works even for someone who
// never installed the app or can no longer sign in.
export default function DeleteDataScreen() {
  const { t, lang } = useLang();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('deleteData.title')} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        <AppText variant="body" color={colors.textMuted}>
          {t('deleteData.intro')}
        </AppText>

        <Card style={{ gap: space.sm }}>
          <AppText variant="h3">{t('deleteData.whatWeStoreTitle')}</AppText>
          <AppText variant="body" color={colors.textMuted}>
            {t('deleteData.whatWeStoreBody')}
          </AppText>
        </Card>

        <Card style={{ gap: space.sm }}>
          <AppText variant="h3">{t('deleteData.inAppTitle')}</AppText>
          <AppText variant="body" color={colors.textMuted}>
            {t('deleteData.inAppBody')}
          </AppText>
        </Card>

        <Card style={{ gap: space.md }}>
          <View style={{ gap: space.sm }}>
            <AppText variant="h3">{t('deleteData.contactTitle')}</AppText>
            <AppText variant="body" color={colors.textMuted}>
              {t('deleteData.contactBody')}
            </AppText>
          </View>
          <Button label={lang === 'ar' ? `راسلنا: ${brand.supportEmail}` : `Email us: ${brand.supportEmail}`} onPress={() => Linking.openURL(`mailto:${brand.supportEmail}?subject=${encodeURIComponent(t('deleteData.emailSubject'))}`)} />
          <Button
            label={t('branchDetail.call')}
            variant="secondary"
            onPress={() => Linking.openURL(`tel:${brand.supportPhone}`)}
          />
        </Card>

        <AppText variant="label" color={colors.textMuted}>
          {t('deleteData.timeline')}
        </AppText>
      </ScrollView>
    </View>
  );
}
