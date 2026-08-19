import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { CircleButton } from '@/components/CircleButton';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useTabBarInset } from '@/lib/useTabBarInset';
import { rewards, userPoints } from '@/lib/mock-data';

export default function RewardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang, isRTL } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const [qty, setQty] = useState(1);
  const [success, setSuccess] = useState(false);

  const reward = rewards.find((r) => r.id === id) ?? rewards[0];
  const locked = reward.cost * qty > userPoints;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 150 }}>
        <View style={{ height: 320, backgroundColor: colors.hero, alignItems: 'center', justifyContent: 'center' }}>
          <AppText style={{ fontSize: 120, lineHeight: 132 }}>{reward.emoji}</AppText>
          <Row
            style={{
              position: 'absolute',
              top: insets.top + space.sm,
              left: space.lg,
              right: space.lg,
              justifyContent: 'space-between',
            }}>
            <CircleButton icon={isRTL ? 'chevron-forward' : 'chevron-back'} onPress={() => router.back()} tone="light" />
            <CircleButton icon={locked ? 'lock-closed' : 'checkmark'} tone="dark" />
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
          onPress={() => setSuccess(true)}
        />
      </View>

      <Modal visible={success} transparent animationType="fade" onRequestClose={() => setSuccess(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(23,19,16,0.5)', alignItems: 'center', justifyContent: 'center', padding: space.xl }}>
          <View style={{ backgroundColor: colors.surface, borderRadius: radius.xl, padding: space.xl, alignItems: 'center', gap: space.sm, width: '100%' }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.goodBg, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="checkmark" size={28} color={colors.good} />
            </View>
            <AppText variant="h2">{t('rewardDetail.successTitle')}</AppText>
            <AppText variant="muted" align="center">
              {t('rewardDetail.successBody')}
            </AppText>
            <Button label={t('rewardDetail.done')} onPress={() => setSuccess(false)} style={{ width: '100%', marginTop: space.sm }} />
          </View>
        </View>
      </Modal>
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
