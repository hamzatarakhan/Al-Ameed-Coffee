import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { CircleButton } from '@/components/CircleButton';
import { CheckinPopup } from '@/components/CheckinPopup';
import { PromoCarousel } from '@/components/PromoCarousel';
import { RewardMedia } from '@/components/RewardMedia';
import { colors, radius, shadow, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useTabBarInset } from '@/lib/useTabBarInset';
import { useNotifications } from '@/lib/notifications-store';
import { rewards, branches, promos, userPoints } from '@/lib/mock-data';

const cheapest = [...rewards].sort((a, b) => a.cost - b.cost);
const nearestBranch = branches[0];

export default function HomeScreen() {
  const { t, lang, toggle, isRTL } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const { notifications } = useNotifications();
  const hasUnreadNotifications = notifications.some((n) => !n.read);
  const [showCheckin, setShowCheckin] = useState(true);

  const categories = [
    { icon: 'bag-handle' as const, label: t('home.quickOrder'), onPress: () => router.push('/order') },
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
          <Row style={{ alignItems: 'center', gap: 4 }}>
            <Ionicons name="location-sharp" size={14} color={colors.brand} />
            <AppText variant="bodySemiBold" color={colors.brand}>
              {lang === 'ar' ? nearestBranch.nameAr : nearestBranch.nameEn}
            </AppText>
          </Row>
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
          <CircleButton icon="person" onPress={() => router.push('/account')} tone="brand" />
        </Row>
      </Row>

      <PromoCarousel slides={promos} />

      <View style={{ paddingHorizontal: space.lg }}>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.border,
            padding: space.lg,
            marginBottom: space.xl,
            ...shadow.card,
          }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: space.lg }}>
            <View>
              <AppText variant="muted">{t('home.yourPoints')}</AppText>
              <AppText variant="display" color={colors.brandInk}>
                {userPoints}
              </AppText>
            </View>
            <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.brandTint, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="sparkles" size={21} color={colors.brand} />
            </View>
          </Row>

          <Row style={{ gap: space.sm }}>
            {categories.map((c, i) => (
              <Pressable
                key={c.label}
                onPress={c.onPress}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  gap: space.xs,
                  backgroundColor: i === 0 ? colors.brand : colors.surface2,
                  borderRadius: radius.md,
                  paddingVertical: space.sm,
                }}>
                <Ionicons name={c.icon} size={19} color={i === 0 ? colors.white : colors.brandInk} />
                <AppText
                  variant="label"
                  color={i === 0 ? colors.white : colors.textMuted}
                  align="center"
                  style={!isRTL ? { fontSize: 9.5, lineHeight: 12, letterSpacing: 0.3 } : undefined}>
                  {c.label}
                </AppText>
              </Pressable>
            ))}
          </Row>
        </View>

        <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: space.md }}>
          <AppText variant="h3">{t('home.popular')}</AppText>
          <Pressable onPress={() => router.push('/rewards')}>
            <AppText variant="bodyMedium" color={colors.brand}>
              {t('common.seeAll')}
            </AppText>
          </Pressable>
        </Row>

        <View style={{ gap: space.md }}>
          {cheapest.slice(0, 2).map((r) => (
            <Pressable
              key={r.id}
              onPress={() => router.push(`/rewards/${r.id}`)}
              style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: space.sm }}>
              <Row style={{ alignItems: 'center', gap: space.md }}>
                <RewardMedia image={r.image} emoji={r.emoji} emojiSize={28} style={{ width: 64, height: 64, borderRadius: radius.md }} />
                <View style={{ flex: 1 }}>
                  <AppText variant="bodySemiBold">{lang === 'ar' ? r.nameAr : r.nameEn}</AppText>
                  <AppText variant="muted" numberOfLines={1}>
                    {lang === 'ar' ? r.descAr : r.descEn}
                  </AppText>
                  <AppText variant="mono" color={colors.brandInk} style={{ marginTop: 2 }}>
                    {r.cost} {t('common.points')}
                  </AppText>
                </View>
                <CircleButton icon={isRTL ? 'chevron-back' : 'chevron-forward'} size={34} tone="light" onPress={() => router.push(`/rewards/${r.id}`)} />
              </Row>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable onPress={toggle} style={{ alignSelf: 'center', marginTop: space.xl }}>
        <AppText variant="label" color={colors.textMuted}>
          {lang === 'ar' ? 'EN' : 'عربي'}
        </AppText>
      </Pressable>
      </ScrollView>

      <CheckinPopup visible={showCheckin} onClose={() => setShowCheckin(false)} />
    </>
  );
}
