import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { rewards, userPoints } from '@/lib/mock-data';

const cheapest = [...rewards].sort((a, b) => a.cost - b.cost)[0];
const toNext = Math.max(0, cheapest.cost - userPoints);

export default function HomeScreen() {
  const { t, lang, toggle } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const quickActions = [
    { icon: 'bag-handle' as const, label: t('home.quickOrder'), onPress: () => router.push('/order') },
    { icon: 'sparkles' as const, label: t('home.quickPoints'), onPress: () => router.push('/my-points') },
    { icon: 'ribbon' as const, label: t('home.quickRedeemed'), onPress: () => router.push('/redeemed-rewards') },
    { icon: 'gift' as const, label: t('home.quickRewards'), onPress: () => router.push('/rewards') },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: space.xxxl }}>
      <Row
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: insets.top + space.sm,
          paddingHorizontal: space.lg,
          paddingBottom: space.md,
        }}>
        <Row style={{ alignItems: 'center', gap: space.sm }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand }} />
          <AppText variant="bodySemiBold">{lang === 'ar' ? 'بن العميد' : 'Al Ameed'}</AppText>
        </Row>
        <Row style={{ gap: space.sm }}>
          <Pressable
            onPress={() => router.push('/notifications')}
            hitSlop={8}
            style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="notifications-outline" size={18} color={colors.text} />
          </Pressable>
          <Pressable
            onPress={toggle}
            hitSlop={8}
            style={{
              paddingHorizontal: 12,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.surface2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText variant="label" color={colors.textMuted}>
              {lang === 'ar' ? 'EN' : 'عربي'}
            </AppText>
          </Pressable>
        </Row>
      </Row>

      <View style={{ paddingHorizontal: space.lg }}>
        <AppText variant="muted">{t('home.welcome')}</AppText>
        <AppText variant="display" style={{ marginBottom: space.lg }}>
          {lang === 'ar' ? 'حمزة' : 'Hamza'}
        </AppText>

        <View
          style={{
            backgroundColor: colors.text,
            borderRadius: radius.lg,
            padding: space.lg,
            marginBottom: space.xl,
            overflow: 'hidden',
          }}>
          <Pill />
          <AppText variant="h2" color={colors.white} style={{ marginTop: space.sm }}>
            {t('home.promoTitle')}
          </AppText>
        </View>

        <Card style={{ marginBottom: space.xl }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: space.sm }}>
            <View>
              <AppText variant="muted">{t('home.yourPoints')}</AppText>
              <AppText variant="mono" style={{ fontSize: 26 }}>
                {userPoints}
              </AppText>
            </View>
            <AppText variant="muted">{t('home.toNextReward', { n: toNext })}</AppText>
          </Row>
          <ProgressBar value={userPoints} max={cheapest.cost} />
        </Card>

        <Row style={{ flexWrap: 'wrap', gap: space.md }}>
          {quickActions.map((a) => (
            <Pressable
              key={a.label}
              onPress={a.onPress}
              style={{
                width: '47%',
                aspectRatio: 1.3,
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: colors.border,
                padding: space.lg,
                justifyContent: 'space-between',
              }}>
              <Ionicons name={a.icon} size={22} color={colors.brandInk} />
              <AppText variant="bodySemiBold">{a.label}</AppText>
            </Pressable>
          ))}
        </Row>
      </View>
    </ScrollView>
  );
}

function Pill() {
  const { t } = useLang();
  return (
    <View style={{ alignSelf: 'flex-start', backgroundColor: colors.brand, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 }}>
      <AppText variant="label" color={colors.white}>
        {t('home.promoBadge')}
      </AppText>
    </View>
  );
}
