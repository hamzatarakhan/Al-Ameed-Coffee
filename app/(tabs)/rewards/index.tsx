import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { RewardMedia } from '@/components/RewardMedia';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, shadow, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useTabBarInset } from '@/lib/useTabBarInset';
import { usePoints } from '@/lib/points-store';
import { rewards } from '@/lib/mock-data';

type Sort = 'affordable' | 'cost';
const GRID_GAP = space.md;

export default function RewardsGalleryScreen() {
  const { t, lang, isRTL } = useLang();
  const router = useRouter();
  const tabBarInset = useTabBarInset();
  const { userPoints } = usePoints();
  const { width } = useWindowDimensions();
  const [sort, setSort] = useState<Sort>('affordable');

  const cardWidth = (width - space.lg * 2 - GRID_GAP) / 2;

  const sorted = useMemo(() => {
    const list = [...rewards];
    if (sort === 'cost') return list.sort((a, b) => a.cost - b.cost);
    return list.sort((a, b) => {
      const aAfford = a.cost <= userPoints ? 0 : 1;
      const bAfford = b.cost <= userPoints ? 0 : 1;
      return aAfford - bAfford || a.cost - b.cost;
    });
  }, [sort, userPoints]);

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

        <Row style={{ flexWrap: 'wrap', gap: GRID_GAP }}>
          {sorted.map((r) => {
            const locked = r.cost > userPoints;
            return (
              <Pressable
                key={r.id}
                onPress={() => router.push(`/rewards/${r.id}`)}
                style={({ pressed }) => [{ width: cardWidth }, pressed && { opacity: 0.9 }]}>
                <View style={{ borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, ...shadow.card }}>
                  <View style={{ width: '100%', aspectRatio: 1 }}>
                    <RewardMedia image={r.image} emoji={r.emoji} emojiSize={54} style={{ width: '100%', height: '100%' }} />
                    <View
                      style={{
                        position: 'absolute',
                        top: space.xs,
                        [isRTL ? 'right' : 'left']: space.xs,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 3,
                        backgroundColor: 'rgba(0,0,0,0.55)',
                        borderRadius: radius.pill,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                      }}>
                      {locked ? <Ionicons name="lock-closed" size={10} color={colors.white} /> : <Ionicons name="sparkles" size={10} color={colors.white} />}
                      <AppText variant="label" color={colors.white} style={{ fontSize: 10, lineHeight: 12 }}>
                        {r.cost}
                      </AppText>
                    </View>
                    {locked ? (
                      <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="lock-closed" size={15} color={colors.text} />
                        </View>
                      </View>
                    ) : null}
                  </View>
                  <View style={{ padding: space.sm, gap: 2 }}>
                    <AppText variant="bodySemiBold" numberOfLines={1}>
                      {lang === 'ar' ? r.nameAr : r.nameEn}
                    </AppText>
                    <AppText variant="label" color={locked ? colors.warn : colors.brandInk} numberOfLines={1}>
                      {locked ? t('rewards.pointsToGo', { n: r.cost - userPoints }) : `${r.cost} ${t('common.points')}`}
                    </AppText>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </Row>
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
