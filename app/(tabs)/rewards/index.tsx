import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { CircleButton } from '@/components/CircleButton';
import { RewardMedia } from '@/components/RewardMedia';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useTabBarInset } from '@/lib/useTabBarInset';
import { rewards, userPoints } from '@/lib/mock-data';

type Sort = 'affordable' | 'cost';

export default function RewardsGalleryScreen() {
  const { t, lang, isRTL } = useLang();
  const router = useRouter();
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
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Reached via a push from Home's "Rewards" quick action, not just by
          tapping the tab — router.back() there would exit the tabs group
          instead of returning to Home, since the tab switch itself never
          pushed a stack entry. So this back explicitly targets Home. */}
      <ScreenHeader title={t('rewards.title')} onBack={() => router.push('/')} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: space.lg, paddingHorizontal: space.lg, paddingBottom: space.xxxl + tabBarInset }}>
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
                <RewardMedia image={r.image} emoji={r.emoji} emojiSize={30} style={{ width: 68, height: 68, borderRadius: radius.md }} />
                <View style={{ flex: 1 }}>
                  <AppText variant="bodySemiBold">{lang === 'ar' ? r.nameAr : r.nameEn}</AppText>
                  <AppText variant="muted" numberOfLines={1} style={{ marginBottom: 3 }}>
                    {lang === 'ar' ? r.descAr : r.descEn}
                  </AppText>
                  <AppText variant="mono" color={locked ? colors.warn : colors.brandInk}>
                    {locked ? t('rewards.pointsToGo', { n: r.cost - userPoints }) : `${r.cost} ${t('common.points')}`}
                  </AppText>
                </View>
                <CircleButton
                  icon={locked ? 'lock-closed' : isRTL ? 'chevron-back' : 'chevron-forward'}
                  size={38}
                  tone="light"
                  onPress={() => router.push(`/rewards/${r.id}`)}
                />
              </Row>
            </Pressable>
          );
        })}
      </View>
      </ScrollView>
    </View>
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
