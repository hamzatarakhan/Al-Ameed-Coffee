import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { RewardMedia } from '@/components/RewardMedia';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useOrderCart } from '@/lib/order-cart';
import { menuCategories, menuItems } from '@/lib/mock-data';

export default function OrderMenuScreen() {
  const { t, lang, isRTL } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { quantities, setQty, totalCount, totalPrice } = useOrderCart();
  const [category, setCategory] = useState(menuCategories[0].id);

  const items = useMemo(() => menuItems.filter((m) => m.category === category), [category]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('menu.title')} />

      <View style={{ paddingVertical: space.sm }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: isRTL ? 'row-reverse' : 'row', paddingHorizontal: space.lg, gap: space.xs }}>
          {menuCategories.map((cat) => {
            const selected = cat.id === category;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                style={{
                  backgroundColor: selected ? colors.brand : colors.surface2,
                  borderRadius: radius.pill,
                  borderWidth: 1,
                  borderColor: selected ? colors.brand : colors.border,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                }}>
                <AppText variant="bodyMedium" color={selected ? colors.white : colors.text}>
                  {lang === 'ar' ? cat.nameAr : cat.nameEn}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: space.sm, gap: space.md, paddingBottom: 140 }}>
        {items.map((item) => {
          const qty = quantities[item.id] ?? 0;
          return (
            <Pressable
              key={item.id}
              onPress={() => router.push(`/order-item/${item.id}`)}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radius.lg,
                overflow: 'hidden',
              }}>
              <Row style={{ gap: space.md, backgroundColor: colors.surface, padding: space.md }}>
                <RewardMedia image={item.image} emoji="☕" style={{ width: 72, height: 72, borderRadius: radius.md }} />
                <View style={{ flex: 1, gap: 2 }}>
                  <AppText variant="bodySemiBold">{lang === 'ar' ? item.nameAr : item.nameEn}</AppText>
                  <AppText variant="muted" numberOfLines={2}>
                    {lang === 'ar' ? item.descAr : item.descEn}
                  </AppText>
                  <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: space.xs }}>
                    <AppText variant="mono" color={colors.brandInk}>
                      {t('menu.price', { price: item.price.toFixed(2) })}
                    </AppText>
                    <Row
                      style={{
                        alignItems: 'center',
                        backgroundColor: colors.surface2,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: radius.md,
                      }}>
                      <QtyButton icon="remove" onPress={() => setQty(item.id, qty - 1)} disabled={qty === 0} />
                      <AppText variant="mono" style={{ width: 28, textAlign: 'center' }}>
                        {qty}
                      </AppText>
                      <QtyButton icon="add" onPress={() => setQty(item.id, qty + 1)} />
                    </Row>
                  </Row>
                </View>
              </Row>
            </Pressable>
          );
        })}
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
        {totalCount > 0 ? (
          <Button label={t('menu.continue')} trailing={t('menu.price', { price: totalPrice.toFixed(2) })} onPress={() => router.push('/order-cart')} />
        ) : (
          <AppText variant="muted" align="center">
            {t('menu.emptyCart')}
          </AppText>
        )}
      </View>
    </View>
  );
}

function QtyButton({ icon, onPress, disabled }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={disabled ? undefined : onPress} hitSlop={8} style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.35 : 1 }}>
      <Ionicons name={icon} size={15} color={colors.text} />
    </Pressable>
  );
}
