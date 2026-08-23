import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { QrScannerCard } from '@/components/QrScannerCard';
import { colors, space } from '@/lib/theme';
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

      <View style={{ marginBottom: space.xxl }}>
        <QrScannerCard
          size={220}
          scanned={scanned}
          scannedContent={
            <Animated.View entering={FadeIn.duration(180)} style={{ alignItems: 'center', gap: space.sm }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="checkmark" size={28} color={colors.good} />
              </View>
              <AppText variant="h2" color={colors.white}>
                {t('checkin.scanned')}
              </AppText>
              <AppText variant="muted" color="rgba(255,255,255,0.8)">
                {t('checkin.earned', { n: CHECKIN_POINTS })}
              </AppText>
            </Animated.View>
          }
        />
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
