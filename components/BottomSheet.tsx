import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

const DURATION = 220;

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
      Animated.timing(progress, { toValue: 1, duration: DURATION, useNativeDriver: true }).start();
    } else {
      Animated.timing(progress, { toValue: 0, duration: DURATION, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, progress]);

  if (!mounted) return null;

  return (
    <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)', opacity: progress }]}
      />
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          opacity: progress,
          transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [48, 0] }) }],
        }}>
        <Pressable onPress={(e) => e.stopPropagation()}>{children}</Pressable>
      </Animated.View>
    </Pressable>
  );
}
