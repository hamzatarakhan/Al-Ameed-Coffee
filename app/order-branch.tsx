import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Input } from '@/components/Input';
import { ScreenHeader } from '@/components/ScreenHeader';
import { BranchRow } from '@/components/BranchRow';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useOrderCart } from '@/lib/order-cart';
import { branches, type Branch } from '@/lib/mock-data';

export default function OrderBranchScreen() {
  const { t } = useLang();
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
          <BranchRow key={b.id} branch={b} onPress={() => selectBranch(b)} disabled={!b.openNow} showImage={false} showLink={false} />
        ))}
      </ScrollView>
    </View>
  );
}
