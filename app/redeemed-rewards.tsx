import React from 'react';
import { ScrollView, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { redemptions } from '@/lib/mock-data';

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
                <Row style={{ alignItems: 'center', gap: space.md }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
                    <AppText style={{ fontSize: 22, lineHeight: 26 }}>{r.emoji}</AppText>
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText variant="bodyMedium">{lang === 'ar' ? r.nameAr : r.nameEn}</AppText>
                    <AppText variant="muted">
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
