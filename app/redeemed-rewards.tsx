import React from 'react';
import { ScrollView, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';

// The old app showed a literal "NO PHOTO" stock image here. Seeded empty so
// the EmptyState (the actual fix) renders — flip to a mock redeemed list to
// see the populated card layout instead.
const redemptions: { id: string; nameAr: string; nameEn: string; ref: string; date: string }[] = [];

export default function RedeemedRewardsScreen() {
  const { t, lang } = useLang();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('redeemed.title')} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl }}>
        {redemptions.length === 0 ? (
          <EmptyState icon="gift-outline" title={t('redeemed.empty')} body={t('redeemed.emptyBody')} />
        ) : (
          <View style={{ gap: space.sm }}>
            {redemptions.map((r) => (
              <Card key={r.id}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <View>
                    <AppText variant="bodyMedium">{lang === 'ar' ? r.nameAr : r.nameEn}</AppText>
                    <AppText variant="muted" style={{ fontSize: 12 }}>
                      {t('redeemed.ref')} {r.ref} · {r.date}
                    </AppText>
                  </View>
                </Row>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
