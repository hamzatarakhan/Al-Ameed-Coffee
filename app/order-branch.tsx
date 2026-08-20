import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Pill } from '@/components/Pill';
import { Input } from '@/components/Input';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useOrderCart } from '@/lib/order-cart';
import { branches, type Branch } from '@/lib/mock-data';

export default function OrderBranchScreen() {
  const { t, lang } = useLang();
  const router = useRouter();
  const { totalPrice, setBranchId } = useOrderCart();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? branches.filter((b) => b.nameAr.includes(query.trim()) || b.nameEn.toLowerCase().includes(q) || b.addressAr.includes(query.trim()) || b.addressEn.toLowerCase().includes(q))
      : branches;
    return [...list].sort((a, b) => Number(b.openNow) - Number(a.openNow));
  }, [query]);

  const selectBranch = (branch: Branch) => {
    setBranchId(branch.id);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('orderBranch.title')} right={<AppText variant="label" color={colors.textMuted}>{t('menu.price', { price: totalPrice.toFixed(2) })}</AppText>} />

      <View style={{ paddingHorizontal: space.lg, paddingTop: space.md }}>
        <Input placeholder={t('branches.search')} value={query} onChangeText={setQuery} />
      </View>

      <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.md }}>
        {filtered.map((b) => (
          <Pressable
            key={b.id}
            onPress={() => b.openNow && selectBranch(b)}
            disabled={!b.openNow}
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radius.lg,
              padding: space.lg,
              opacity: b.openNow ? 1 : 0.5,
            }}>
            <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: space.xs }}>
              <AppText variant="bodySemiBold">{lang === 'ar' ? b.nameAr : b.nameEn}</AppText>
              <Pill tone={b.openNow ? 'good' : 'neutral'} label={b.openNow ? t('branches.openNow') : t('branches.closed')} />
            </Row>
            <AppText variant="muted">{lang === 'ar' ? b.addressAr : b.addressEn}</AppText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
