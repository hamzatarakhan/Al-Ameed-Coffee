import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { QrGlyph } from '@/components/QrGlyph';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useTabBarInset } from '@/lib/useTabBarInset';
import { usePoints, CHECKIN_POINTS } from '@/lib/points-store';

export default function CheckinScreen() {
  const { t } = useLang();
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const { checkin } = usePoints();
  const [scanned, setScanned] = useState(false);

  const toggle = () => {
    if (!scanned) checkin();
    setScanned((s) => !s);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + space.lg, paddingHorizontal: space.lg, paddingBottom: tabBarInset, alignItems: 'center' }}>
      <AppText variant="display" style={{ marginBottom: space.sm }}>
        {t('checkin.title')}
      </AppText>
      <AppText variant="muted" align="center" style={{ marginBottom: space.xxl, maxWidth: 280 }}>
        {t('checkin.instruction')}
      </AppText>

      <View
        style={{
          width: 220,
          height: 220,
          borderRadius: radius.lg,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: space.xxl,
        }}>
        {scanned ? (
          <Animated.View entering={ZoomIn.springify().damping(12)} style={{ alignItems: 'center', gap: space.sm }}>
            <Ionicons name="checkmark-circle" size={56} color={colors.good} />
            <AppText variant="h2">{t('checkin.scanned')}</AppText>
            <AppText variant="muted">{t('checkin.earned', { n: CHECKIN_POINTS })}</AppText>
          </Animated.View>
        ) : (
          <QrGlyph />
        )}
      </View>

      <Button
        label={scanned ? t('checkin.reset') : t('checkin.simulate')}
        variant={scanned ? 'secondary' : 'primary'}
        onPress={toggle}
        style={{ width: '100%' }}
      />
    </View>
  );
}
