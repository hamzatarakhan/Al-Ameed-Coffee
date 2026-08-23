import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { RewardMedia } from '@/components/RewardMedia';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SuccessModal } from '@/components/SuccessModal';
import { BottomSheet } from '@/components/BottomSheet';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useOrderCart } from '@/lib/order-cart';
import { branches, menuItems } from '@/lib/mock-data';

export default function OrderCartScreen() {
  const { t, lang } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { quantities, setQty, totalPrice, paymentMethod, setPaymentMethod, fulfillment, branchId, addresses, addressId, placeOrder, clear } =
    useOrderCart();
  const [noCallConfirm, setNoCallConfirm] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  // Captured at the moment of placing — placeOrder() resets the selection
  // right away, so the success modal needs its own copy to still show the
  // right branch/address after that reset.
  const [placedSummary, setPlacedSummary] = useState<{ fulfillment: string; location: string } | null>(null);

  const items = Object.entries(quantities)
    .map(([id, qty]) => ({ item: menuItems.find((m) => m.id === id), qty }))
    .filter((x): x is { item: (typeof menuItems)[number]; qty: number } => !!x.item);
  const branch = branches.find((b) => b.id === branchId);
  const address = addresses.find((a) => a.id === addressId);
  const canOrder = items.length > 0 && (fulfillment === 'pickup' ? !!branch : !!address);

  const submitOrder = () => {
    setConfirmVisible(false);
    setPlacedSummary({
      fulfillment,
      location: fulfillment === 'pickup' ? (branch ? (lang === 'ar' ? branch.nameAr : branch.nameEn) : '') : address ? address.line : '',
    });
    setPlacedOrderId(placeOrder());
    setSuccess(true);
  };

  const finish = () => {
    setSuccess(false);
    router.dismissAll();
    if (placedOrderId) router.push(`/order-status/${placedOrderId}` as Href);
  };

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title={t('orderCart.title')} />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState
            icon="bag-handle-outline"
            title={t('orderCart.emptyTitle')}
            body={t('menu.emptyCart')}
            actionLabel={t('orderCart.browseMenu')}
            onAction={() => router.push('/order-menu')}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('orderCart.title')} />

      <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.xl, paddingBottom: 150 }}>
        <View style={{ gap: space.md }}>
          <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <AppText variant="h3">{t('orderCart.cartContents')}</AppText>
            <AppText variant="muted">{t('menu.price', { price: totalPrice.toFixed(2) })}</AppText>
          </Row>
          {items.map(({ item, qty }) => (
            <Card key={item.id} style={{ flexDirection: 'row', gap: space.md, padding: space.md }}>
              <RewardMedia image={item.image} emoji="☕" style={{ width: 64, height: 64, borderRadius: radius.md }} />
              <View style={{ flex: 1, gap: 4 }}>
                <AppText variant="bodySemiBold">{lang === 'ar' ? item.nameAr : item.nameEn}</AppText>
                <AppText variant="mono" color={colors.brandInk}>
                  {t('orderCart.itemTotal', { price: (item.price * qty).toFixed(2) })}
                </AppText>
                <Row
                  style={{
                    alignItems: 'center',
                    alignSelf: 'flex-start',
                    backgroundColor: colors.surface2,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: radius.md,
                    marginTop: 4,
                  }}>
                  <QtyButton icon="remove" onPress={() => setQty(item.id, qty - 1)} />
                  <AppText variant="mono" style={{ width: 28, textAlign: 'center' }}>
                    {qty}
                  </AppText>
                  <QtyButton icon="add" onPress={() => setQty(item.id, qty + 1)} />
                </Row>
              </View>
            </Card>
          ))}
        </View>

        <View style={{ gap: space.sm }}>
          <SectionTitle icon="wallet-outline" title={t('orderCart.paymentMethod')} />
          <Row style={{ gap: space.sm }}>
            <PaymentOption icon="cash-outline" label={t('orderCart.cash')} selected={paymentMethod === 'cash'} onPress={() => setPaymentMethod('cash')} />
            <PaymentOption icon="card-outline" label={t('orderCart.card')} selected={paymentMethod === 'card'} onPress={() => setPaymentMethod('card')} />
          </Row>
        </View>

        <View style={{ gap: space.sm }}>
          <SectionTitle icon="navigate-outline" title={t('orderCart.orderMethod')} />
          {fulfillment === 'pickup' ? (
            <Pressable
              onPress={() => router.push('/order-branch')}
              style={({ pressed }) => [
                { backgroundColor: colors.hero, borderRadius: radius.lg, padding: space.lg },
                pressed && { opacity: 0.9 },
              ]}>
              <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <AppText variant="label" color="rgba(255,255,255,0.6)">
                    {t('orderCart.branchPickup')}
                  </AppText>
                  <AppText variant="bodySemiBold" color={colors.white} style={{ marginTop: 4 }}>
                    {branch ? (lang === 'ar' ? branch.nameAr : branch.nameEn) : t('home.chooseBranch')}
                  </AppText>
                </View>
                <Ionicons name={lang === 'ar' ? 'chevron-back' : 'chevron-forward'} size={18} color="rgba(255,255,255,0.6)" />
              </Row>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push('/order-delivery')}
              style={({ pressed }) => [
                { backgroundColor: colors.hero, borderRadius: radius.lg, padding: space.lg },
                pressed && { opacity: 0.9 },
              ]}>
              <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <AppText variant="label" color="rgba(255,255,255,0.6)">
                    {t('order.delivery')}
                  </AppText>
                  <AppText variant="bodySemiBold" color={colors.white} style={{ marginTop: 4 }} numberOfLines={1}>
                    {address ? `${address.line}, ${address.building}` : t('orderDelivery.chooseAddress')}
                  </AppText>
                </View>
                <Ionicons name={lang === 'ar' ? 'chevron-back' : 'chevron-forward'} size={18} color="rgba(255,255,255,0.6)" />
              </Row>
            </Pressable>
          )}
        </View>

        <View style={{ gap: space.sm }}>
          <SectionTitle icon="call-outline" title={t('orderCart.preferences')} />
          <Pressable onPress={() => setNoCallConfirm((v) => !v)}>
            <Row
              style={{
                alignItems: 'center',
                gap: space.md,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radius.lg,
                padding: space.md,
              }}>
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  borderWidth: 1.5,
                  borderColor: noCallConfirm ? colors.brand : colors.border,
                  backgroundColor: noCallConfirm ? colors.brand : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {noCallConfirm ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
              </View>
              <AppText variant="body" style={{ flex: 1 }}>
                {t('order.noCallConfirm')}
              </AppText>
            </Row>
          </Pressable>
        </View>

        <View style={{ gap: space.sm }}>
          <SectionTitle icon="receipt-outline" title={t('orderCart.orderSummary')} />
          <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: space.lg, gap: space.md }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <AppText variant="body">{t('orderCart.subtotal')}</AppText>
              <AppText variant="mono">{t('menu.price', { price: totalPrice.toFixed(2) })}</AppText>
            </Row>
            <View style={{ height: 1, backgroundColor: colors.border }} />
            <Row
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: colors.brandTint,
                borderRadius: radius.md,
                paddingHorizontal: space.md,
                paddingVertical: space.sm,
              }}>
              <AppText variant="bodySemiBold" color={colors.brandInk}>
                {t('orderCart.total')}
              </AppText>
              <AppText variant="mono" color={colors.brandInk} style={{ fontSize: 17, lineHeight: 22 }}>
                {t('menu.price', { price: totalPrice.toFixed(2) })}
              </AppText>
            </Row>
          </View>
          <AppText variant="muted" color={colors.brandInk} align="center">
            {t('orderCart.thanks')}
          </AppText>
        </View>
      </ScrollView>

      <Row
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          gap: space.sm,
          padding: space.lg,
          paddingBottom: insets.bottom + space.md,
          backgroundColor: colors.bg,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}>
        <Button
          label={t('orderCart.placeOrder')}
          trailing={t('menu.price', { price: totalPrice.toFixed(2) })}
          onPress={() => setConfirmVisible(true)}
          disabled={!canOrder}
          style={{ flex: 1 }}
        />
        <Pressable
          onPress={clear}
          style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="trash-outline" size={20} color={colors.critical} />
        </Pressable>
      </Row>

      <BottomSheet visible={confirmVisible} onClose={() => setConfirmVisible(false)}>
        <View
          style={{
            backgroundColor: colors.surface,
            padding: space.lg,
            paddingBottom: insets.bottom + space.md,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
            gap: space.md,
          }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center' }} />
          <AppText variant="h2">{t('orderCart.confirmTitle')}</AppText>

          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <AppText variant="muted">{t('orderCart.paymentMethod')}</AppText>
            <Row style={{ alignItems: 'center', gap: space.xs }}>
              <Ionicons name={paymentMethod === 'cash' ? 'cash-outline' : 'card-outline'} size={16} color={colors.brandInk} />
              <AppText variant="bodySemiBold">{paymentMethod === 'cash' ? t('orderCart.cash') : t('orderCart.card')}</AppText>
            </Row>
          </Row>

          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <AppText variant="muted">{fulfillment === 'pickup' ? t('orderCart.branchPickup') : t('order.delivery')}</AppText>
            <AppText variant="bodySemiBold" numberOfLines={1} style={{ maxWidth: '60%' }}>
              {fulfillment === 'pickup' ? (branch ? (lang === 'ar' ? branch.nameAr : branch.nameEn) : '') : address ? address.line : ''}
            </AppText>
          </Row>

          <View style={{ height: 1, backgroundColor: colors.border }} />

          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <AppText variant="bodySemiBold">{t('orderCart.total')}</AppText>
            <AppText variant="mono" color={colors.brandInk} style={{ fontSize: 20, lineHeight: 26 }}>
              {t('menu.price', { price: totalPrice.toFixed(2) })}
            </AppText>
          </Row>

          <Button
            label={t('orderCart.confirmPay', { price: totalPrice.toFixed(2) })}
            onPress={submitOrder}
            style={{ marginTop: space.sm }}
          />
          <Button label={t('common.cancel')} variant="ghost" onPress={() => setConfirmVisible(false)} />
        </View>
      </BottomSheet>

      <SuccessModal
        visible={success}
        title={t('orderBranch.successTitle')}
        body={
          placedSummary
            ? placedSummary.fulfillment === 'pickup'
              ? t('orderBranch.successBody', { branch: placedSummary.location })
              : t('orderDelivery.successBody', { address: placedSummary.location })
            : ''
        }
        doneLabel={t('orderStatus.viewOrder')}
        onDone={finish}
      />
    </View>
  );
}

function SectionTitle({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
  return (
    <Row style={{ alignItems: 'center', gap: space.xs }}>
      <Ionicons name={icon} size={16} color={colors.brandInk} />
      <AppText variant="h3">{title}</AppText>
    </Row>
  );
}

function PaymentOption({ icon, label, selected, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; selected: boolean; onPress: () => void }) {
  const { isRTL } = useLang();
  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <View
        style={{
          alignItems: 'center',
          gap: space.xs,
          backgroundColor: selected ? colors.brandTint : colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.lg,
          paddingVertical: space.md,
        }}>
        {selected ? (
          <View
            style={{
              position: 'absolute',
              top: space.xs,
              [isRTL ? 'left' : 'right']: space.xs,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: colors.brand,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="checkmark" size={11} color={colors.white} />
          </View>
        ) : null}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: selected ? colors.white : colors.surface2,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name={icon} size={18} color={selected ? colors.brandInk : colors.textMuted} />
        </View>
        <AppText variant="bodyMedium" color={selected ? colors.brandInk : colors.text}>
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

function QtyButton({ icon, onPress }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={icon} size={15} color={colors.text} />
    </Pressable>
  );
}
