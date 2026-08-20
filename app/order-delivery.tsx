import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useOrderCart, type Address } from '@/lib/order-cart';

const typeIcon: Record<Address['type'], keyof typeof Ionicons.glyphMap> = {
  home: 'home',
  work: 'briefcase',
  other: 'location',
};

export default function OrderDeliveryScreen() {
  const { t } = useLang();
  const router = useRouter();
  const { addresses, addressId, setAddressId } = useOrderCart();

  const selectAddress = (id: string) => {
    setAddressId(id);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('orderDelivery.title')} />
      <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.xl }}>
        <Pressable
          onPress={() => router.push('/order-address-new')}
          style={{ borderWidth: 1.5, borderColor: colors.brand, borderRadius: radius.lg, padding: space.lg }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <AppText variant="bodySemiBold" color={colors.brand}>
              {t('orderDelivery.addNew')}
            </AppText>
            <Ionicons name="add-circle" size={22} color={colors.brand} />
          </Row>
        </Pressable>

        <View style={{ gap: space.md }}>
          <AppText variant="h3">{t('orderDelivery.saved')}</AppText>
          {addresses.length === 0 ? (
            <View style={{ alignItems: 'center', gap: space.sm, paddingVertical: space.xxl }}>
              <Ionicons name="ban-outline" size={48} color={colors.textMuted} />
              <AppText variant="muted">{t('orderDelivery.empty')}</AppText>
            </View>
          ) : (
            addresses.map((a) => {
              const selected = a.id === addressId;
              return (
                <Pressable
                  key={a.id}
                  onPress={() => selectAddress(a.id)}
                  style={{
                    backgroundColor: selected ? colors.brandTint : colors.surface,
                    borderWidth: selected ? 1.5 : 1,
                    borderColor: selected ? colors.brand : colors.border,
                    borderRadius: radius.lg,
                    padding: space.lg,
                  }}>
                  <Row style={{ justifyContent: 'space-between', alignItems: 'center', gap: space.md }}>
                    <AppText variant="bodySemiBold" style={{ flex: 1 }} color={selected ? colors.brandInk : colors.text}>
                      {a.line}, {a.building}
                    </AppText>
                    <Ionicons name={typeIcon[a.type]} size={20} color={selected ? colors.brand : colors.textMuted} />
                  </Row>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
