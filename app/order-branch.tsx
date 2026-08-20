import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
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
  const { totalPrice, clear } = useOrderCart();
  const [query, setQuery] = useState('');
  const [confirmed, setConfirmed] = useState<Branch | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? branches.filter((b) => b.nameAr.includes(query.trim()) || b.nameEn.toLowerCase().includes(q) || b.addressAr.includes(query.trim()) || b.addressEn.toLowerCase().includes(q))
      : branches;
    return [...list].sort((a, b) => Number(b.openNow) - Number(a.openNow));
  }, [query]);

  const confirmOrder = (branch: Branch) => {
    setConfirmed(branch);
  };

  const finish = () => {
    clear();
    setConfirmed(null);
    router.dismissAll();
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
            onPress={() => b.openNow && confirmOrder(b)}
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

      <Modal visible={!!confirmed} transparent animationType="fade" onRequestClose={() => setConfirmed(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(23,19,16,0.5)', alignItems: 'center', justifyContent: 'center', padding: space.xl }}>
          <View style={{ backgroundColor: colors.surface, borderRadius: radius.xl, padding: space.xl, alignItems: 'center', gap: space.sm, width: '100%' }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.goodBg, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="checkmark" size={28} color={colors.good} />
            </View>
            <AppText variant="h2">{t('orderBranch.successTitle')}</AppText>
            <AppText variant="muted" align="center">
              {confirmed ? t('orderBranch.successBody', { branch: lang === 'ar' ? confirmed.nameAr : confirmed.nameEn }) : ''}
            </AppText>
            <Button label={t('orderBranch.done')} onPress={finish} style={{ width: '100%', marginTop: space.sm }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
