import React, { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useTabBarInset } from '@/lib/useTabBarInset';
import { branches } from '@/lib/mock-data';

const nearest = branches[0];

export default function OrderScreen() {
  const { t, lang } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const [showError, setShowError] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + space.lg, paddingHorizontal: space.lg, paddingBottom: tabBarInset }}>
      <AppText variant="display" style={{ marginBottom: space.xl }}>
        {t('order.title')}
      </AppText>

      <Pressable onPress={() => setShowError(true)} style={{ marginBottom: space.lg }}>
        <OrderOption icon="storefront" label={t('order.pickup')} />
      </Pressable>
      <Pressable onPress={() => setShowError(true)}>
        <OrderOption icon="bicycle" label={t('order.delivery')} />
      </Pressable>

      <Modal visible={showError} transparent animationType="fade" onRequestClose={() => setShowError(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(20,12,8,0.45)', justifyContent: 'flex-end' }}>
          <Pressable style={{ flex: 1 }} onPress={() => setShowError(false)} />
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              padding: space.xl,
              paddingBottom: insets.bottom + space.xl,
              gap: space.sm,
            }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: space.sm }} />
            <AppText variant="h2">{t('order.errorTitle')}</AppText>
            <AppText variant="muted" style={{ marginBottom: space.md }}>
              {t('order.errorBody')} — {lang === 'ar' ? nearest.nameAr : nearest.nameEn}
            </AppText>
            <Button
              label={t('order.viewBranch')}
              onPress={() => {
                setShowError(false);
                router.push(`/branches/${nearest.id}`);
              }}
            />
            <Button
              label={t('order.seeAllBranches')}
              variant="secondary"
              onPress={() => {
                setShowError(false);
                router.push('/branches');
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function OrderOption({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const { isRTL } = useLang();
  return (
    <Row
      style={{
        alignItems: 'center',
        gap: space.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: space.lg,
      }}>
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={20} color={colors.brandInk} />
      </View>
      <AppText variant="bodySemiBold" style={{ flex: 1 }}>
        {label}
      </AppText>
      <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={colors.textMuted} />
    </Row>
  );
}
