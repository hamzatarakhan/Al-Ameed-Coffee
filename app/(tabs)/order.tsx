import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Pill } from '@/components/Pill';
import { EmptyState } from '@/components/EmptyState';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useTabBarInset } from '@/lib/useTabBarInset';
import { useOrderCart, type PlacedOrder } from '@/lib/order-cart';
import { useOrderSheet } from '@/lib/order-sheet';

export default function OrdersScreen() {
  const { t, lang } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const { pastOrders, reorder } = useOrderCart();
  const { openSheet } = useOrderSheet();

  const orderAgain = (order: PlacedOrder) => {
    reorder(order);
    router.push('/order-cart');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: insets.top + space.lg, paddingBottom: space.xxxl + tabBarInset }}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: space.xl }}>
          <AppText variant="display">{t('orders.title')}</AppText>
          <Pressable
            onPress={openSheet}
            hitSlop={8}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="add" size={22} color={colors.white} />
          </Pressable>
        </Row>

        {pastOrders.length === 0 ? (
          <EmptyState icon="receipt-outline" title={t('orders.empty')} body={t('orders.emptyBody')} actionLabel={t('orders.newOrder')} onAction={openSheet} />
        ) : (
          <View style={{ gap: space.md }}>
            {pastOrders.map((o) => (
              <Card key={o.id}>
                <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: space.xs }}>
                  <AppText variant="bodySemiBold" style={{ flex: 1 }}>
                    {lang === 'ar' ? o.itemsAr : o.itemsEn}
                  </AppText>
                  <Pill tone="good" label={t('orders.completed')} />
                </Row>
                <AppText variant="muted">
                  {o.fulfillment === 'pickup' ? t('orders.pickupFrom', { branch: o.locationAr }) : t('orders.deliverTo', { address: o.locationAr })}
                  {' · '}
                  {t('orders.itemsCount', { n: o.itemCount })}
                </AppText>
                <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: space.sm }}>
                  <AppText variant="muted">{o.date}</AppText>
                  <AppText variant="mono" color={colors.brandInk}>
                    {t('menu.price', { price: o.total.toFixed(2) })}
                  </AppText>
                </Row>
                <Button label={t('orders.reorder')} variant="secondary" onPress={() => orderAgain(o)} style={{ marginTop: space.md }} />
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
