import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';

const OPEN_DURATION = 320;
const CLOSE_DURATION = 200;
// A gentle overshoot (not a full spring/bounce — that read as too much
// elsewhere, see SuccessModal) so the sheet settles into place instead of
// just stopping dead. Closing skips it: a snappier plain ease-in reads as
// more responsive for "get out of the way."
const OPEN_EASING = Easing.out(Easing.back(1.15));
const CLOSE_EASING = Easing.in(Easing.cubic);

// Shared open/close animation for every bottom sheet in the app (theme
// picker, order type, ...) — slides up + fades in on open, reverses on
// close, and only unmounts once the close animation actually finishes
// (not the instant it's told to close) so it never just pops away.
//
// Plain Animated (not react-native-reanimated) on purpose: reanimated's
// worklets blew up expo-router's static web export with an out-of-memory
// crash the moment a screen rendering this sheet got statically rendered
// at build time — Animated has no such build-time/SSR entanglement.
export function BottomSheet({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(progress, { toValue: 1, duration: OPEN_DURATION, easing: OPEN_EASING, useNativeDriver: true }).start();
    } else {
      Animated.timing(progress, { toValue: 0, duration: CLOSE_DURATION, easing: CLOSE_EASING, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, progress]);

  if (!mounted) return null;

  return (
    <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)', opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1], extrapolate: 'clamp' }) }]}
      />
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1], extrapolate: 'clamp' }),
          transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [90, 0] }) }],
        }}>
        <Pressable onPress={(e) => e.stopPropagation()}>{children}</Pressable>
      </Animated.View>
    </Pressable>
  );
}
