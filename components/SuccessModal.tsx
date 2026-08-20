import React from 'react';
import { Modal, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from './AppText';
import { Button } from './Button';
import { colors, radius, space } from '@/lib/theme';

// Shared by every "you just did the rewarding thing" moment (redeem a
// reward, place an order) — a spring-in checkmark instead of a static
// fade so the app's one payoff moment actually feels like one.
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
          entering={ZoomIn.springify().damping(14)}
          style={{ backgroundColor: colors.surface, borderRadius: radius.xl, padding: space.xl, alignItems: 'center', gap: space.sm, width: '100%' }}>
          <Animated.View
            entering={ZoomIn.delay(120).springify().damping(9)}
            style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.goodBg, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="checkmark" size={28} color={colors.good} />
          </Animated.View>
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
