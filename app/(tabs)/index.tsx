import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { CircleButton } from '@/components/CircleButton';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { rewards, branches, userPoints } from '@/lib/mock-data';

const cheapest = [...rewards].sort((a, b) => a.cost - b.cost);
const nearestBranch = branches[0];

export default function HomeScreen() {
  const { t, lang, toggle, isRTL } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const categories = [
    { icon: 'bag-handle' as const, label: t('home.quickOrder'), onPress: () => router.push('/order') },
    { icon: 'sparkles' as const, label: t('home.quickPoints'), onPress: () => router.push('/my-points') },
    { icon: 'gift' as const, label: t('home.quickRewards'), onPress: () => router.push('/rewards') },
    { icon: 'ribbon' as const, label: t('home.quickRedeemed'), onPress: () => router.push('/redeemed-rewards') },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: space.xxxl }}>
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
          <CircleButton icon="notifications-outline" onPress={() => router.push('/notifications')} tone="light" />
          <CircleButton icon="person" onPress={() => router.push('/account')} tone="brand" />
        </Row>
      </Row>

      <View style={{ paddingHorizontal: space.lg }}>
        <Pressable
          onPress={() => router.push('/rewards')}
          style={{
            backgroundColor: colors.brand,
            borderRadius: radius.xl,
            padding: space.xl,
            marginBottom: space.xl,
            overflow: 'hidden',
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
          }}>
          <View style={{ flex: 1, gap: space.md }}>
            <View style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 }}>
              <AppText variant="label" color={colors.white}>
                {t('home.promoBadge')}
              </AppText>
            </View>
            <AppText variant="h2" color={colors.white}>
              {t('home.promoTitle')}
            </AppText>
            <View style={{ alignSelf: 'flex-start', backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: space.lg, paddingVertical: space.sm }}>
              <AppText variant="bodySemiBold" color={colors.brand}>
                {t('home.promoCta')}
              </AppText>
            </View>
          </View>
          <AppText style={{ fontSize: 56, opacity: 0.9 }}>☕</AppText>
        </Pressable>

        <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: space.md }}>
          <AppText variant="muted">{t('home.yourPoints')}</AppText>
          <AppText variant="mono" color={colors.brandInk}>
            {userPoints} {t('common.points')}
          </AppText>
        </Row>

        <Row style={{ gap: space.md, marginBottom: space.xl }}>
          {categories.map((c, i) => (
            <Pressable
              key={c.label}
              onPress={c.onPress}
              style={{
                flex: 1,
                alignItems: 'center',
                gap: space.xs,
                backgroundColor: i === 0 ? colors.brand : colors.surface,
                borderRadius: radius.lg,
                borderWidth: i === 0 ? 0 : 1,
                borderColor: colors.border,
                paddingVertical: space.md,
              }}>
              <Ionicons name={c.icon} size={20} color={i === 0 ? colors.white : colors.brandInk} />
              <AppText variant="label" color={i === 0 ? colors.white : colors.textMuted} style={{ fontSize: 10 }}>
                {c.label}
              </AppText>
            </Pressable>
          ))}
        </Row>

        <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: space.md }}>
          <AppText variant="h3">{t('home.popular')}</AppText>
          <Pressable onPress={() => router.push('/rewards')}>
            <AppText variant="bodyMedium" color={colors.brand} style={{ fontSize: 13 }}>
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
                <View style={{ width: 64, height: 64, borderRadius: radius.md, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  <AppText style={{ fontSize: 28 }}>{r.emoji}</AppText>
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="bodySemiBold">{lang === 'ar' ? r.nameAr : r.nameEn}</AppText>
                  <AppText variant="muted" style={{ fontSize: 12 }} numberOfLines={1}>
                    {lang === 'ar' ? r.descAr : r.descEn}
                  </AppText>
                  <AppText variant="mono" color={colors.brandInk} style={{ fontSize: 12, marginTop: 2 }}>
                    {r.cost} {t('common.points')}
                  </AppText>
                </View>
                <CircleButton icon={isRTL ? 'chevron-back' : 'chevron-forward'} size={34} tone="brand" onPress={() => router.push(`/rewards/${r.id}`)} />
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
  );
}
