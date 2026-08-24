import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Card } from '@/components/Card';
import { StatTile } from '@/components/StatTile';
import { ProgressBar } from '@/components/ProgressBar';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, shadow, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useOrderCart } from '@/lib/order-cart';
import { useOrderSheet } from '@/lib/order-sheet';
import { shareInvite } from '@/lib/invite';
import { usePoints } from '@/lib/points-store';
import { getNextReward } from '@/lib/mock-data';

export default function MyPointsScreen() {
  const { t, lang, isRTL } = useLang();
  const router = useRouter();
  const { pastOrders } = useOrderCart();
  const { openSheet } = useOrderSheet();
  const { userPoints, transactions, redemptions } = usePoints();
  const cheapest = getNextReward(userPoints);
  // Real transaction ids are Supabase UUIDs (no stable prefix to match on),
  // so this counts by the check-in label instead — always 'تسجيل حضور',
  // set by points-store.tsx's checkin().
  const checkinCount = transactions.filter((tx) => tx.labelAr.startsWith('تسجيل حضور')).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('points.title')} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl }}>
        <Pressable onPress={() => router.push(`/rewards/${cheapest.id}`)} style={{ marginBottom: space.lg }}>
          <LinearGradient
            colors={[colors.brand, colors.hero]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: radius.xl, padding: space.lg, overflow: 'hidden', ...shadow.card }}>
            <Ionicons
              name="sparkles"
              size={130}
              color="rgba(255,255,255,0.08)"
              style={{ position: 'absolute', top: -20, [isRTL ? 'left' : 'right']: -20 }}
            />
            <AppText variant="muted" color="rgba(255,255,255,0.8)">
              {t('points.balance')}
            </AppText>
            <AppText variant="display" color={colors.white} style={{ fontSize: 40, lineHeight: 54, marginBottom: space.sm }}>
              {userPoints}
            </AppText>
            <ProgressBar value={userPoints} max={cheapest.cost} />
            <AppText variant="label" color="rgba(255,255,255,0.8)" style={{ marginTop: space.xs }}>
              {t('rewards.pointsToGo', { n: Math.max(0, cheapest.cost - userPoints) })}
            </AppText>
            <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: space.sm }}>
              <AppText variant="muted" color="rgba(255,255,255,0.8)" style={{ flex: 1 }}>
                {t('points.nextReward', { name: lang === 'ar' ? cheapest.nameAr : cheapest.nameEn })}
              </AppText>
              <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color="rgba(255,255,255,0.8)" />
            </Row>
          </LinearGradient>
        </Pressable>

        <Card style={{ marginBottom: space.lg }}>
          <Row>
            <StatTile icon="gift-outline" value={redemptions.length} label={t('points.redeemedStat')} onPress={() => router.push('/redeemed-rewards')} />
            <StatTile icon="bag-handle-outline" value={pastOrders.length} label={t('orders.title')} onPress={() => router.push('/order')} />
            <StatTile icon="qr-code-outline" value={checkinCount} label={t('points.visitsStat')} onPress={() => router.push('/checkin')} />
          </Row>
        </Card>

        <Card style={{ marginBottom: space.lg, gap: space.xs }}>
          <AppText variant="bodySemiBold" style={{ marginBottom: space.xs }}>
            {t('points.howToEarn')}
          </AppText>
          <EarnRow icon="qr-code-outline" label={t('points.earnCheckin')} onPress={() => router.push('/checkin')} isRTL={isRTL} />
          <EarnRow icon="bag-handle-outline" label={t('points.earnOrder')} onPress={openSheet} isRTL={isRTL} />
          <EarnRow icon="person-add-outline" label={t('points.earnInvite')} onPress={() => shareInvite(lang)} isRTL={isRTL} />
        </Card>

        <AppText variant="bodySemiBold" style={{ marginBottom: space.sm }}>
          {t('points.history')}
        </AppText>
        {transactions.length === 0 ? (
          <EmptyState icon="time-outline" title={t('points.emptyHistory')} />
        ) : (
          <View style={{ gap: space.sm }}>
            {transactions.map((tx) => (
              <Card key={tx.id} style={{ paddingVertical: space.md }}>
                <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <AppText variant="bodyMedium">{lang === 'ar' ? tx.labelAr : tx.labelEn}</AppText>
                    <AppText variant="muted">{tx.date}</AppText>
                  </View>
                  <AppText variant="mono" color={tx.points < 0 ? colors.critical : colors.good}>
                    {tx.points > 0 ? '+' : ''}
                    {tx.points}
                  </AppText>
                </Row>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function EarnRow({ icon, label, onPress, isRTL }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; isRTL: boolean }) {
  return (
    <Pressable onPress={onPress}>
      <Row style={{ alignItems: 'center', gap: space.md, paddingVertical: space.sm }}>
        <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={16} color={colors.brandInk} />
        </View>
        <AppText variant="muted" style={{ flex: 1 }}>
          {label}
        </AppText>
        <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={14} color={colors.textMuted} />
      </Row>
    </Pressable>
  );
}
