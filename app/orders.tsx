import React from 'react';
import { ScrollView, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Card } from '@/components/Card';
import { Pill } from '@/components/Pill';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { orders } from '@/lib/mock-data';

export default function OrdersScreen() {
  const { t, lang } = useLang();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('orders.title')} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl }}>
        {orders.length === 0 ? (
          <EmptyState icon="receipt-outline" title={t('orders.empty')} body={t('orders.emptyBody')} />
        ) : (
          <View style={{ gap: space.sm }}>
            {orders.map((o) => (
              <Card key={o.id}>
                <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: space.xs }}>
                  <AppText variant="bodySemiBold" style={{ flex: 1 }}>
                    {lang === 'ar' ? o.itemsAr : o.itemsEn}
                  </AppText>
                  <Pill tone="good" label={lang === 'ar' ? o.statusAr : o.statusEn} />
                </Row>
                <AppText variant="muted">
                  {lang === 'ar' ? o.branchAr : o.branchEn} · {t('orders.itemsCount', { n: o.itemCount })}
                </AppText>
                <Row style={{ justifyContent: 'space-between', marginTop: space.sm }}>
                  <AppText variant="muted">{o.date}</AppText>
                  <AppText variant="mono" color={colors.brandInk}>
                    {o.price}
                  </AppText>
                </Row>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
