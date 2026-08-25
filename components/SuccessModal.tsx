import React, { useEffect } from 'react';
import { Modal, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from './AppText';
import { Button } from './Button';
import { CoffeeBeanBurst } from './CoffeeBeanBurst';
import { colors, radius, space } from '@/lib/theme';
import { playSuccess } from '@/lib/sound';

// Shared by every "you just did the rewarding thing" moment (redeem a
// reward, place an order). A plain, single fade — no spring/scale — was
// the deliberate choice after the first pass (a springy zoom on the card
// plus a delayed zoom on the icon) read as overdone for how often this
// fires. `celebrate` opts a specific caller into the extra falling-beans
// flourish — order placement wants it, everything else stays plain so the
// effect doesn't wear out from overuse.
export function SuccessModal({
  visible,
  title,
  body,
  doneLabel,
  onDone,
  celebrate,
}: {
  visible: boolean;
  title: string;
  body: string;
  doneLabel: string;
  onDone: () => void;
  celebrate?: boolean;
}) {
  useEffect(() => {
    if (visible) playSuccess();
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDone}>
      <View style={{ flex: 1, backgroundColor: 'rgba(23,19,16,0.5)', alignItems: 'center', justifyContent: 'center', padding: space.xl }}>
        {celebrate && visible ? <CoffeeBeanBurst /> : null}
        <Animated.View
          entering={FadeIn.duration(180)}
          style={{ backgroundColor: colors.surface, borderRadius: radius.xl, padding: space.xl, alignItems: 'center', gap: space.sm, width: '100%' }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.goodBg, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="checkmark" size={28} color={colors.good} />
          </View>
          <AppText variant="h2">{title}</AppText>
          <AppText variant="muted" align="center">
            {body}
          </AppText>
          <Button label={doneLabel} onPress={onDone} style={{ width: '100%', marginTop: space.sm }} />
        </Animated.View>
      </View>
    </Modal>
  );
}
