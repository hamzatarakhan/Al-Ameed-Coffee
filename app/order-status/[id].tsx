import React from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useOrderCart, ORDER_STATUS_STEPS, type OrderStatus } from '@/lib/order-cart';

const STEP_ICONS: Record<OrderStatus, keyof typeof Ionicons.glyphMap> = {
  received: 'receipt-outline',
  preparing: 'cafe-outline',
  ready: 'bag-check-outline',
  completed: 'checkmark-done-outline',
};

export default function OrderStatusScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang } = useLang();
  const router = useRouter();
  const { pastOrders, advanceOrderStatus } = useOrderCart();
  const order = pastOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title={t('orderStatus.title')} onBack={() => router.push('/')} />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState icon="receipt-outline" title={t('orders.empty')} body={t('orders.emptyBody')} />
        </View>
      </View>
    );
  }

  const stepIndex = ORDER_STATUS_STEPS.indexOf(order.status);
  const isDelivery = order.fulfillment === 'delivery';
  const location = lang === 'ar' ? order.locationAr : order.locationEn;

  const stepLabel = (step: OrderStatus) => {
    if (step === 'received') return t('orderStatus.received');
    if (step === 'preparing') return t('orderStatus.preparing');
    if (step === 'ready') return isDelivery ? t('orderStatus.readyDelivery') : t('orderStatus.readyPickup');
    return isDelivery ? t('orderStatus.completedDelivery') : t('orderStatus.completedPickup');
  };
  const eta = isDelivery ? t('orderStatus.etaDelivery') : t('orderStatus.etaPickup');
  const placedBody = isDelivery
    ? t('orderDelivery.successBody', { address: location })
    : t('orderBranch.successBody', { branch: location });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('orderStatus.title')} onBack={() => router.push('/')} />
      <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.xl, paddingBottom: space.xxxl }}>
        <View style={{ alignItems: 'center', gap: space.xs }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.goodBg, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="checkmark" size={28} color={colors.good} />
          </View>
          <AppText variant="h2">{t('orderStatus.placedTitle')}</AppText>
          <AppText variant="muted" align="center">
            {placedBody}
          </AppText>
        </View>

        <Card style={{ gap: 0 }}>
          {ORDER_STATUS_STEPS.map((step, i) => {
            const reached = i <= stepIndex;
            const isPast = i < stepIndex;
            const isCurrent = i === stepIndex;
            const isLast = i === ORDER_STATUS_STEPS.length - 1;
            return (
              <Row key={step} style={{ alignItems: 'flex-start', gap: space.md }}>
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor: reached ? colors.brand : colors.surface2,
                      borderWidth: reached ? 0 : 1,
                      borderColor: colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons name={isPast ? 'checkmark' : STEP_ICONS[step]} size={16} color={reached ? colors.white : colors.textMuted} />
                  </View>
                  {!isLast ? <View style={{ width: 2, flex: 1, minHeight: 28, backgroundColor: isPast ? colors.brand : colors.border, marginVertical: 2 }} /> : null}
                </View>
                <View style={{ flex: 1, paddingBottom: isLast ? 0 : space.lg, paddingTop: space.xs }}>
                  <AppText variant={isCurrent ? 'bodySemiBold' : 'body'} color={reached ? colors.text : colors.textMuted}>
                    {stepLabel(step)}
                  </AppText>
                  {isCurrent && order.status !== 'completed' ? (
                    <AppText variant="muted" style={{ marginTop: 2 }}>
                      {eta}
                    </AppText>
                  ) : null}
                </View>
              </Row>
            );
          })}
        </Card>

        {order.status !== 'completed' ? (
          <Button
            label={t('orderStatus.advance')}
            variant="secondary"
            onPress={() => advanceOrderStatus(order.id)}
          />
        ) : null}

        <View style={{ gap: space.sm }}>
          <AppText variant="bodySemiBold">{t('orderCart.orderSummary')}</AppText>
          <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: space.lg, gap: space.sm }}>
            <AppText variant="body">{lang === 'ar' ? order.itemsAr : order.itemsEn}</AppText>
            <View style={{ height: 1, backgroundColor: colors.border }} />
            <Row style={{ justifyContent: 'space-between' }}>
              <AppText variant="muted">{isDelivery ? t('orders.deliverTo', { address: location }) : t('orders.pickupFrom', { branch: location })}</AppText>
              <AppText variant="mono" color={colors.brandInk}>
                {t('menu.price', { price: order.total.toFixed(2) })}
              </AppText>
            </Row>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
