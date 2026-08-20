import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { CircleButton } from '@/components/CircleButton';
import { CheckinPopup } from '@/components/CheckinPopup';
import { OrderSheet } from '@/components/OrderSheet';
import { Pill } from '@/components/Pill';
import { PromoCarousel } from '@/components/PromoCarousel';
import { colors, radius, shadow, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useTabBarInset } from '@/lib/useTabBarInset';
import { useNotifications } from '@/lib/notifications-store';
import { useBranchDistances } from '@/lib/useBranchDistances';
import { rewards, branches, promos, userPoints } from '@/lib/mock-data';

const cheapest = [...rewards].sort((a, b) => a.cost - b.cost);

export default function HomeScreen() {
  const { t, lang, toggle, isRTL } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const { notifications } = useNotifications();
  const hasUnreadNotifications = notifications.some((n) => !n.read);
  const [showCheckin, setShowCheckin] = useState(true);
  const [showOrderSheet, setShowOrderSheet] = useState(false);
  const { nearest, request } = useBranchDistances();

  // Attempt silently on load — if the user already granted location
  // (e.g. from the branches screen) this resolves instantly; if not yet
  // granted/denied it just falls back to the "choose your branch" label
  // below instead of claiming a fake nearest branch.
  useEffect(() => {
    request();
  }, [request]);

  const categories = [
    { icon: 'bag-handle' as const, label: t('home.quickOrder'), onPress: () => setShowOrderSheet(true) },
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
                {nearest ? (lang === 'ar' ? nearest.nameAr : nearest.nameEn) : t('home.chooseBranch')}
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
          <CircleButton icon="language-outline" onPress={toggle} tone="light" />
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

          <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: space.lg }}>
            <View>
              <AppText variant="muted" color="rgba(255,255,255,0.8)">
                {t('home.yourPoints')}
              </AppText>
              <AppText variant="display" color={colors.white} style={{ fontSize: 42, lineHeight: 56 }}>
                {userPoints}
              </AppText>
              {cheapest[0] ? (
                <AppText variant="label" color="rgba(255,255,255,0.8)" style={{ marginTop: 4 }}>
                  {t('points.nextReward', { name: lang === 'ar' ? cheapest[0].nameAr : cheapest[0].nameEn })}
                </AppText>
              ) : null}
            </View>
            <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="sparkles" size={21} color={colors.white} />
            </View>
          </Row>

          <Row style={{ gap: space.sm }}>
            {categories.map((c, i) => (
              <Pressable
                key={c.label}
                onPress={c.onPress}
                android_ripple={{ color: 'rgba(255,255,255,0.25)' }}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    alignItems: 'center',
                    gap: space.xs,
                    backgroundColor: i === 0 ? colors.white : 'rgba(255,255,255,0.14)',
                    borderWidth: i === 0 ? 0 : 1,
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderRadius: radius.md,
                    paddingVertical: space.sm,
                  },
                  pressed && { opacity: 0.8 },
                ]}>
                <Ionicons name={c.icon} size={19} color={i === 0 ? colors.brand : colors.white} />
                <AppText
                  variant="label"
                  color={i === 0 ? colors.brand : colors.white}
                  align="center"
                  style={!isRTL ? { fontSize: 9.5, lineHeight: 12, letterSpacing: 0.3 } : undefined}>
                  {c.label}
                </AppText>
              </Pressable>
            ))}
          </Row>
        </LinearGradient>

        <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: space.md }}>
          <AppText variant="h3">{t('branches.title')}</AppText>
          <Pressable onPress={() => router.push('/branches')}>
            <AppText variant="bodyMedium" color={colors.brand}>
              {t('common.seeAll')}
            </AppText>
          </Pressable>
        </Row>

        <View style={{ gap: space.md }}>
          {branches.slice(0, 2).map((b) => (
            <Pressable
              key={b.id}
              onPress={() => router.push(`/branches/${b.id}`)}
              style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: space.md }}>
              <Row style={{ alignItems: 'center', gap: space.md }}>
                {b.image ? <Image source={b.image} style={{ width: 64, height: 64, borderRadius: radius.md }} resizeMode="cover" /> : null}
                <View style={{ flex: 1 }}>
                  <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: space.xs }}>
                    <AppText variant="bodySemiBold">{lang === 'ar' ? b.nameAr : b.nameEn}</AppText>
                    <Pill tone={b.openNow ? 'good' : 'neutral'} label={b.openNow ? t('branches.openNow') : t('branches.closed')} />
                  </Row>
                  <AppText variant="muted">{lang === 'ar' ? b.addressAr : b.addressEn}</AppText>
                  <Row style={{ alignItems: 'center', gap: 4, marginTop: space.sm }}>
                    <AppText variant="label" color={colors.brandInk}>
                      {t('common.seeAll')}
                    </AppText>
                    <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={12} color={colors.brandInk} />
                  </Row>
                </View>
              </Row>
            </Pressable>
          ))}
        </View>
      </View>

      </ScrollView>

      <CheckinPopup visible={showCheckin} onClose={() => setShowCheckin(false)} />
      <OrderSheet visible={showOrderSheet} onClose={() => setShowOrderSheet(false)} />
    </>
  );
}
