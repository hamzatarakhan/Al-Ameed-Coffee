import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { CircleButton } from '@/components/CircleButton';
import { RewardMedia } from '@/components/RewardMedia';
import { SuccessModal } from '@/components/SuccessModal';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useTabBarInset } from '@/lib/useTabBarInset';
import { usePoints } from '@/lib/points-store';
import { rewards } from '@/lib/mock-data';

export default function RewardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang, isRTL } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const { userPoints, redeem } = usePoints();
  const [qty, setQty] = useState(1);
  const [success, setSuccess] = useState(false);

  const reward = rewards.find((r) => r.id === id) ?? rewards[0];
  const locked = reward.cost * qty > userPoints;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 150 }}>
        <View style={{ height: 320, backgroundColor: colors.hero, alignItems: 'center', justifyContent: 'center' }}>
          <RewardMedia
            image={reward.image}
            emoji={reward.emoji}
            emojiSize={120}
            style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
          />
          <Row
            style={{
              position: 'absolute',
              top: insets.top + space.sm,
              left: space.lg,
              right: space.lg,
              justifyContent: 'space-between',
            }}>
            <CircleButton icon={isRTL ? 'chevron-forward' : 'chevron-back'} onPress={() => router.back()} tone="light" />
            {/* Static status badge, not a button — was a CircleButton (a
                Pressable) with no onPress, which silently absorbed taps
                users expected to do something. */}
            {locked ? (
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="lock-closed" size={18} color={colors.white} />
              </View>
            ) : (
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="checkmark" size={18} color={colors.white} />
              </View>
            )}
          </Row>
        </View>

        <View
          style={{
            backgroundColor: colors.bg,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
            marginTop: -24,
            padding: space.xl,
          }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: space.xs }}>
            <AppText variant="h2" style={{ flex: 1 }}>
              {lang === 'ar' ? reward.nameAr : reward.nameEn}
            </AppText>
            <AppText variant="mono" color={colors.brandInk} style={{ fontSize: 17, lineHeight: 22 }}>
              {reward.cost}
            </AppText>
          </Row>

          <Row style={{ alignItems: 'center', gap: space.md, marginBottom: space.lg }}>
            <Row style={{ alignItems: 'center', gap: 4 }}>
              <Ionicons name="pricetag-outline" size={14} color={colors.textMuted} />
              <AppText variant="muted">{lang === 'ar' ? reward.categoryAr : reward.categoryEn}</AppText>
            </Row>
            <Row style={{ alignItems: 'center', gap: 4 }}>
              <Ionicons name="time-outline" size={14} color={colors.textMuted} />
              <AppText variant="muted">{t('rewardDetail.fulfillment')}</AppText>
            </Row>
          </Row>

          <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: space.xl }}>
            <AppText variant="bodySemiBold">{t('rewardDetail.quantity')}</AppText>
            <Row
              style={{
                alignItems: 'center',
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radius.md,
              }}>
              <QtyButton icon="remove" onPress={() => setQty((q) => Math.max(1, q - 1))} />
              <AppText variant="mono" style={{ width: 36, textAlign: 'center' }}>
                {qty}
              </AppText>
              <QtyButton icon="add" onPress={() => setQty((q) => q + 1)} />
            </Row>
          </Row>

          <AppText variant="muted">{lang === 'ar' ? reward.descAr : reward.descEn}</AppText>
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: tabBarInset,
          padding: space.lg,
          paddingBottom: tabBarInset > 0 ? space.md : insets.bottom + space.md,
          backgroundColor: colors.bg,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}>
        <Button
          label={locked ? t('rewardDetail.locked') : t('rewardDetail.redeem')}
          trailing={locked ? undefined : `${reward.cost * qty} ${t('common.points')}`}
          disabled={locked}
          onPress={() => {
            redeem(reward, qty);
            setSuccess(true);
          }}
        />
      </View>

      <SuccessModal
        visible={success}
        title={t('rewardDetail.successTitle')}
        body={t('rewardDetail.successBody')}
        doneLabel={t('rewardDetail.done')}
        onDone={() => {
          setSuccess(false);
          router.back();
        }}
      />
    </View>
  );
}

function QtyButton({ icon, onPress }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={icon} size={16} color={colors.text} />
    </Pressable>
  );
}
