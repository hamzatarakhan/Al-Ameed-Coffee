import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { CircleButton } from '@/components/CircleButton';
import { RewardMedia } from '@/components/RewardMedia';
import { CartButton } from '@/components/CartButton';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useOrderCart } from '@/lib/order-cart';
import { menuItems } from '@/lib/mock-data';

export default function OrderItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang, isRTL } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { quantities, setQty } = useOrderCart();
  const [qty, setLocalQty] = useState(1);

  const item = menuItems.find((m) => m.id === id) ?? menuItems[0];

  const addToCart = () => {
    setQty(item.id, (quantities[item.id] ?? 0) + qty);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 150 }}>
        <View style={{ height: 320, backgroundColor: colors.hero, alignItems: 'center', justifyContent: 'center' }}>
          <RewardMedia image={item.image} emoji="☕" emojiSize={120} style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }} />
          <Row style={{ position: 'absolute', top: insets.top + space.sm, left: space.lg, right: space.lg, justifyContent: 'space-between' }}>
            <CircleButton icon={isRTL ? 'chevron-forward' : 'chevron-back'} onPress={() => router.back()} tone="light" />
            <CartButton color={colors.white} />
          </Row>
        </View>

        <View style={{ backgroundColor: colors.bg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, marginTop: -24, padding: space.xl }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: space.xs }}>
            <AppText variant="h2" style={{ flex: 1 }}>
              {lang === 'ar' ? item.nameAr : item.nameEn}
            </AppText>
            <AppText variant="mono" color={colors.brandInk} style={{ fontSize: 17, lineHeight: 22 }}>
              {t('menu.price', { price: item.price.toFixed(2) })}
            </AppText>
          </Row>

          <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginVertical: space.xl }}>
            <AppText variant="bodySemiBold">{t('rewardDetail.quantity')}</AppText>
            <Row style={{ alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md }}>
              <QtyButton icon="remove" onPress={() => setLocalQty((q) => Math.max(1, q - 1))} />
              <AppText variant="mono" style={{ width: 36, textAlign: 'center' }}>
                {qty}
              </AppText>
              <QtyButton icon="add" onPress={() => setLocalQty((q) => q + 1)} />
            </Row>
          </Row>

          <AppText variant="muted">{lang === 'ar' ? item.descAr : item.descEn}</AppText>
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: space.lg,
          paddingBottom: insets.bottom + space.md,
          backgroundColor: colors.bg,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}>
        <Button label={t('menu.addToCart')} trailing={t('menu.price', { price: (item.price * qty).toFixed(2) })} onPress={addToCart} />
      </View>
    </View>
  );
}

function QtyButton({ icon, onPress }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={icon} size={16} color={colors.text} />
    </Pressable>
  );
}
