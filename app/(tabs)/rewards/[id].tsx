import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Pill } from '@/components/Pill';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { rewards, userPoints } from '@/lib/mock-data';

export default function RewardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang } = useLang();
  const insets = useSafeAreaInsets();
  const [qty, setQty] = useState(1);
  const [success, setSuccess] = useState(false);

  const reward = rewards.find((r) => r.id === id) ?? rewards[0];
  const locked = reward.cost * qty > userPoints;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={lang === 'ar' ? reward.nameAr : reward.nameEn} />
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={{ aspectRatio: 4 / 3, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
          <AppText style={{ fontSize: 88 }}>{reward.emoji}</AppText>
        </View>

        <View style={{ padding: space.lg }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: space.sm }}>
            <AppText variant="h2">{lang === 'ar' ? reward.nameAr : reward.nameEn}</AppText>
            <Pill tone={locked ? 'warn' : 'good'} label={`${reward.cost} ${t('common.points')}`} />
          </Row>
          <AppText variant="muted" style={{ marginBottom: space.xl }}>
            {lang === 'ar' ? reward.descAr : reward.descEn}
          </AppText>

          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <AppText variant="bodySemiBold">{t('rewardDetail.quantity')}</AppText>
            <Row
              style={{
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radius.pill,
                overflow: 'hidden',
              }}>
              <QtyButton icon="remove" onPress={() => setQty((q) => Math.max(1, q - 1))} />
              <AppText variant="mono" style={{ width: 36, textAlign: 'center' }}>
                {qty}
              </AppText>
              <QtyButton icon="add" onPress={() => setQty((q) => q + 1)} />
            </Row>
          </Row>
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: space.lg,
          paddingBottom: insets.bottom + space.md,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}>
        <Button label={locked ? t('rewardDetail.locked') : t('rewardDetail.redeem')} disabled={locked} onPress={() => setSuccess(true)} />
      </View>

      <Modal visible={success} transparent animationType="fade" onRequestClose={() => setSuccess(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(20,12,8,0.45)', alignItems: 'center', justifyContent: 'center', padding: space.xl }}>
          <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.xl, alignItems: 'center', gap: space.sm, width: '100%' }}>
            <Ionicons name="checkmark-circle" size={48} color={colors.good} />
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
    <Pressable onPress={onPress} hitSlop={8} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={icon} size={16} color={colors.text} />
    </Pressable>
  );
}
