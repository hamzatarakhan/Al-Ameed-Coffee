import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from './AppText';
import { Row } from './Row';
import { Button } from './Button';
import { BottomSheet } from './BottomSheet';
import { darkColors, lightColors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useThemeMode } from '@/lib/theme-mode';
import { branches } from '@/lib/mock-data';

const nearest = branches[0];

// Home's "Order Now" quick action — picking pickup or delivery right here
// avoids sending the user to a whole new page just to hit the same "no
// branch nearby" dead end the dedicated Order tab already shows (no real
// ordering backend yet), so both steps live in one sheet instead.
export function OrderSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t, lang, isRTL } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<'choose' | 'error'>('choose');
  // Reads isDark from context instead of the mutated `colors` singleton —
  // see OptionSheet.tsx for why (this sheet also lives outside the Stack
  // that force-remounts on theme change, so it needs a real reactive
  // dependency rather than a plain global read).
  const { isDark } = useThemeMode();
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    if (visible) setStep('choose');
  }, [visible]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
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

        {step === 'choose' ? (
          <>
            <AppText variant="h2" color={colors.text} style={{ marginBottom: space.xs }}>
              {t('order.title')}
            </AppText>
            <Pressable
              onPress={() => {
                onClose();
                router.push('/order-menu');
              }}
              style={{ marginBottom: space.sm }}>
              <OrderOption icon="storefront" label={t('order.pickup')} isRTL={isRTL} colors={colors} />
            </Pressable>
            <Pressable onPress={() => setStep('error')}>
              <OrderOption icon="bicycle" label={t('order.delivery')} isRTL={isRTL} colors={colors} />
            </Pressable>
          </>
        ) : (
          <>
            <AppText variant="h2" color={colors.text}>
              {t('order.errorTitle')}
            </AppText>
            <AppText variant="muted" color={colors.textMuted} style={{ marginBottom: space.md }}>
              {t('order.errorBody')} — {lang === 'ar' ? nearest.nameAr : nearest.nameEn}
            </AppText>
            <Button
              label={t('order.viewBranch')}
              onPress={() => {
                onClose();
                router.push(`/branches/${nearest.id}`);
              }}
            />
            <Button
              label={t('order.seeAllBranches')}
              variant="secondary"
              onPress={() => {
                onClose();
                router.push('/branches');
              }}
            />
          </>
        )}
      </View>
    </BottomSheet>
  );
}

function OrderOption({
  icon,
  label,
  isRTL,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  isRTL: boolean;
  colors: typeof lightColors;
}) {
  return (
    <Row
      style={{
        alignItems: 'center',
        gap: space.md,
        backgroundColor: colors.surface2,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: space.lg,
      }}>
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={20} color={colors.brandInk} />
      </View>
      <AppText variant="bodySemiBold" color={colors.text} style={{ flex: 1 }}>
        {label}
      </AppText>
      <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={colors.textMuted} />
    </Row>
  );
}
