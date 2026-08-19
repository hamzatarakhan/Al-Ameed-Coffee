import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { CircleButton } from '@/components/CircleButton';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useTabBarInset } from '@/lib/useTabBarInset';
import { rewards, userPoints } from '@/lib/mock-data';

type Sort = 'affordable' | 'cost';

export default function RewardsGalleryScreen() {
  const { t, lang, isRTL } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const [sort, setSort] = useState<Sort>('affordable');

  const sorted = useMemo(() => {
    const list = [...rewards];
    if (sort === 'cost') return list.sort((a, b) => a.cost - b.cost);
    return list.sort((a, b) => {
      const aAfford = a.cost <= userPoints ? 0 : 1;
      const bAfford = b.cost <= userPoints ? 0 : 1;
      return aAfford - bAfford || a.cost - b.cost;
    });
  }, [sort]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingTop: insets.top + space.lg, paddingHorizontal: space.lg, paddingBottom: space.xxxl + tabBarInset }}>
      <AppText variant="display" style={{ marginBottom: space.md }}>
        {t('rewards.title')}
      </AppText>

      <Row style={{ gap: space.sm, marginBottom: space.lg }}>
        <SortChip active={sort === 'affordable'} label={t('rewards.sortAffordable')} onPress={() => setSort('affordable')} />
        <SortChip active={sort === 'cost'} label={t('rewards.sortCost')} onPress={() => setSort('cost')} />
      </Row>

      <View style={{ gap: space.md }}>
        {sorted.map((r) => {
          const locked = r.cost > userPoints;
          return (
            <Pressable
              key={r.id}
              onPress={() => router.push(`/rewards/${r.id}`)}
              style={{
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: colors.border,
                padding: space.sm,
                opacity: locked ? 0.75 : 1,
              }}>
              <Row style={{ alignItems: 'center', gap: space.md }}>
                <View style={{ width: 68, height: 68, borderRadius: radius.md, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  <AppText style={{ fontSize: 30 }}>{r.emoji}</AppText>
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="bodySemiBold">{lang === 'ar' ? r.nameAr : r.nameEn}</AppText>
                  <AppText variant="muted" numberOfLines={1} style={{ fontSize: 12.5, marginBottom: 3 }}>
                    {lang === 'ar' ? r.descAr : r.descEn}
                  </AppText>
                  <AppText variant="mono" color={locked ? colors.warn : colors.brandInk} style={{ fontSize: 12.5 }}>
                    {locked ? t('rewards.pointsToGo', { n: r.cost - userPoints }) : `${r.cost} ${t('common.points')}`}
                  </AppText>
                </View>
                <CircleButton
                  icon={locked ? 'lock-closed' : isRTL ? 'chevron-back' : 'chevron-forward'}
                  size={38}
                  tone={locked ? 'light' : 'brand'}
                  onPress={() => router.push(`/rewards/${r.id}`)}
                />
              </Row>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function SortChip({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: space.md,
        paddingVertical: space.xs + 2,
        borderRadius: radius.pill,
        backgroundColor: active ? colors.brand : colors.surface2,
      }}>
      <AppText variant="label" color={active ? colors.white : colors.textMuted}>
        {label}
      </AppText>
    </Pressable>
  );
}
