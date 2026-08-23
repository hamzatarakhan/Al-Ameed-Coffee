import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { CircleButton } from '@/components/CircleButton';
import { CheckinPopup } from '@/components/CheckinPopup';
import { BranchRow } from '@/components/BranchRow';
import { PromoCarousel } from '@/components/PromoCarousel';
import { ProgressBar } from '@/components/ProgressBar';
import { colors, radius, shadow, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useTabBarInset } from '@/lib/useTabBarInset';
import { useNotifications } from '@/lib/notifications-store';
import { useBranchDistances } from '@/lib/useBranchDistances';
import { useOrderSheet } from '@/lib/order-sheet';
import { useOrderCart } from '@/lib/order-cart';
import { usePoints } from '@/lib/points-store';
import { branches, promos, getNextReward } from '@/lib/mock-data';

export default function HomeScreen() {
  const { t, lang, isRTL } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const { notifications } = useNotifications();
  const hasUnreadNotifications = notifications.some((n) => !n.read);
  const [showCheckin, setShowCheckin] = useState(true);
  const { openSheet: openOrderSheet } = useOrderSheet();
  const { totalCount: cartCount } = useOrderCart();
  const { nearest, sortedByDistance, distanceTo, request } = useBranchDistances();
  const nearbyBranches = sortedByDistance ?? branches;
  const { userPoints } = usePoints();
  const nextReward = getNextReward(userPoints);

  // Attempt silently on load — if the user already granted location
  // (e.g. from the branches screen) this resolves instantly; if not yet
  // granted/denied it just falls back to the "choose your branch" label
  // below instead of claiming a fake nearest branch.
  useEffect(() => {
    request();
  }, [request]);

  const categories = [
    { icon: 'bag-handle' as const, label: t('home.quickOrder'), onPress: openOrderSheet },
    { icon: 'sparkles' as const, label: t('home.quickPoints'), onPress: () => router.push('/my-points') },
    { icon: 'gift' as const, label: t('home.quickRewards'), onPress: () => router.push('/rewards') },
    { icon: 'ribbon' as const, label: t('home.quickRedeemed'), onPress: () => router.push('/redeemed-rewards') },
  ];

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: space.xxxl + tabBarInset }}>
      <Row
        style={{
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingTop: insets.top + space.md,
          paddingHorizontal: space.lg,
          paddingBottom: space.lg,
        }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Pressable onPress={() => router.push('/branches')}>
            <Row style={{ alignItems: 'center', gap: 4 }}>
              <Ionicons name="location-sharp" size={14} color={colors.brand} />
              <AppText variant="bodySemiBold" color={colors.brand}>
                {nearest ? (lang === 'ar' ? nearest.nameAr : nearest.nameEn) : t('home.browseBranches')}
              </AppText>
            </Row>
          </Pressable>
          <AppText variant="h2">{t('home.question')}</AppText>
        </View>
        <Row style={{ gap: space.sm }}>
          <View>
            <CircleButton icon="notifications-outline" onPress={() => router.push('/notifications')} tone="light" />
            {hasUnreadNotifications ? (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  [isRTL ? 'left' : 'right']: 0,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: colors.brand,
                  borderWidth: 1.5,
                  borderColor: colors.bg,
                }}
              />
            ) : null}
          </View>
          <View>
            <CircleButton icon="bag-handle-outline" onPress={() => router.push('/order-cart')} tone="light" />
            {cartCount > 0 ? (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  [isRTL ? 'left' : 'right']: 0,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  paddingHorizontal: 3,
                  backgroundColor: colors.brand,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1.5,
                  borderColor: colors.bg,
                }}>
                <AppText variant="label" color={colors.white} style={{ fontSize: 9, lineHeight: 11, letterSpacing: 0 }}>
                  {cartCount}
                </AppText>
              </View>
            ) : null}
          </View>
        </Row>
      </Row>

      <PromoCarousel slides={promos} />

      <View style={{ paddingHorizontal: space.lg }}>
        <LinearGradient
          // brandInk lightens in dark mode (it's tuned for text-on-dark
          // legibility, not backgrounds), which made the white text on this
          // card nearly unreadable there — hero is a fixed black in both
          // themes, so the far end of the gradient always stays dark enough
          // for white text regardless of theme.
          colors={[colors.brand, colors.hero]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: radius.xl, padding: space.lg, marginBottom: space.xl, overflow: 'hidden', ...shadow.card }}>
          {/* Faint oversized cup watermark for texture — purely decorative,
              clipped by the gradient's own overflow:hidden. */}
          <Ionicons
            name="cafe"
            size={150}
            color="rgba(255,255,255,0.08)"
            style={{ position: 'absolute', top: -30, [isRTL ? 'left' : 'right']: -30 }}
          />

          <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: space.sm }}>
            <View>
              <AppText variant="muted" color="rgba(255,255,255,0.8)">
                {t('home.yourPoints')}
              </AppText>
              <AppText variant="display" color={colors.white} style={{ fontSize: 42, lineHeight: 56 }}>
                {userPoints}
              </AppText>
            </View>
            <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="sparkles" size={21} color={colors.white} />
            </View>
          </Row>

          <View style={{ marginBottom: space.lg, gap: space.xs }}>
            <ProgressBar value={userPoints} max={nextReward.cost} />
            <AppText variant="label" color="rgba(255,255,255,0.8)">
              {t('rewards.pointsToGo', { n: Math.max(0, nextReward.cost - userPoints) })} · {t('points.nextReward', { name: lang === 'ar' ? nextReward.nameAr : nextReward.nameEn })}
            </AppText>
          </View>

          <Row style={{ gap: space.sm }}>
            {categories.map((c) => (
              <Pressable
                key={c.label}
                onPress={c.onPress}
                android_ripple={{ color: 'rgba(255,255,255,0.25)' }}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    alignItems: 'center',
                    gap: space.xs,
                    backgroundColor: 'rgba(255,255,255,0.14)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderRadius: radius.md,
                    paddingVertical: space.sm,
                  },
                  pressed && { opacity: 0.8 },
                ]}>
                <Ionicons name={c.icon} size={19} color={colors.white} />
                <AppText
                  variant="label"
                  color={colors.white}
                  align="center"
                  style={!isRTL ? { fontSize: 9.5, lineHeight: 12, letterSpacing: 0.3 } : undefined}>
                  {c.label}
                </AppText>
              </Pressable>
            ))}
          </Row>
        </LinearGradient>

        <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <View>
            <AppText variant="h3">{t('branches.title')}</AppText>
            <AppText variant="label" color={sortedByDistance ? colors.good : colors.textMuted}>
              {sortedByDistance ? t('branches.locationEnabled') : t('branches.distanceUnknown')}
            </AppText>
          </View>
          <Pressable onPress={() => router.push('/branches')}>
            <AppText variant="bodyMedium" color={colors.brand}>
              {t('common.seeAll')}
            </AppText>
          </Pressable>
        </Row>

        <View style={{ gap: space.md, marginTop: space.md }}>
          {nearbyBranches.slice(0, 2).map((b, i) => (
            <BranchRow
              key={b.id}
              branch={b}
              distanceKm={distanceTo(b.id)}
              badge={sortedByDistance && i === 0 ? t('branches.nearest') : undefined}
              onPress={() => router.push(`/branches/${b.id}`)}
            />
          ))}
        </View>
      </View>

      </ScrollView>

      <CheckinPopup visible={showCheckin} onClose={() => setShowCheckin(false)} />
    </>
  );
}
