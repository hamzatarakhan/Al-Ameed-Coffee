import React from 'react';
import { Modal, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from './AppText';
import { Button } from './Button';
import { colors, radius, space } from '@/lib/theme';

// Shared by every "you just did the rewarding thing" moment (redeem a
// reward, place an order). A plain, single fade — no spring/scale — was
// the deliberate choice after the first pass (a springy zoom on the card
// plus a delayed zoom on the icon) read as overdone for how often this
// fires.
export function SuccessModal({
  visible,
  title,
  body,
  doneLabel,
  onDone,
}: {
  visible: boolean;
  title: string;
  body: string;
  doneLabel: string;
  onDone: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDone}>
      <View style={{ flex: 1, backgroundColor: 'rgba(23,19,16,0.5)', alignItems: 'center', justifyContent: 'center', padding: space.xl }}>
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
