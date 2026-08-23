import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { QrGlyph } from './QrGlyph';
import { colors, radius, shadow } from '@/lib/theme';

// Shared "scanner" chrome for both the home check-in popup and the full
// Check In tab — a gradient card with viewfinder corner brackets and a
// slow scan-line sweep instead of a plain bordered box with a QR pattern
// dropped in the middle.
//
// Plain RN Animated, not react-native-reanimated: this card can mount as
// part of Home's initial render (CheckinPopup defaults to visible), which
// is statically rendered at web export time — see BottomSheet.tsx for the
// reanimated-worklet crash that pattern caused there.
export function QrScannerCard({ size = 200, scanned, scannedContent }: { size?: number; scanned?: boolean; scannedContent?: React.ReactNode }) {
  const scan = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (scanned) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scan, { toValue: 1, duration: 1900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(scan, { toValue: 0, duration: 1900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scan, scanned]);

  const inset = size * 0.12;
  const bracket = size * 0.16;
  const translateY = scan.interpolate({ inputRange: [0, 1], outputRange: [inset, size - inset - bracket * 0.3] });

  return (
    <LinearGradient
      colors={[colors.brand, colors.hero]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: size, height: size, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...shadow.card }}>
      {scanned ? (
        scannedContent
      ) : (
        <>
          <QrGlyph size={size * 0.5} color="rgba(255,255,255,0.9)" />
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: inset,
              right: inset,
              height: 2,
              borderRadius: 1,
              backgroundColor: 'rgba(255,255,255,0.85)',
              transform: [{ translateY }],
            }}
          />
        </>
      )}
      <Corner style={{ top: inset - bracket * 0.5, left: inset - bracket * 0.5 }} size={bracket} sides={['top', 'left']} />
      <Corner style={{ top: inset - bracket * 0.5, right: inset - bracket * 0.5 }} size={bracket} sides={['top', 'right']} />
      <Corner style={{ bottom: inset - bracket * 0.5, left: inset - bracket * 0.5 }} size={bracket} sides={['bottom', 'left']} />
      <Corner style={{ bottom: inset - bracket * 0.5, right: inset - bracket * 0.5 }} size={bracket} sides={['bottom', 'right']} />
    </LinearGradient>
  );
}

function Corner({ style, size, sides }: { style: object; size: number; sides: ('top' | 'bottom' | 'left' | 'right')[] }) {
  const thickness = 2.5;
  return (
    <View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size }, style]}>
      {sides.includes('top') ? (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: thickness, backgroundColor: colors.white, borderRadius: 2 }} />
      ) : null}
      {sides.includes('bottom') ? (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: thickness, backgroundColor: colors.white, borderRadius: 2 }} />
      ) : null}
      {sides.includes('left') ? (
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: thickness, backgroundColor: colors.white, borderRadius: 2 }} />
      ) : null}
      {sides.includes('right') ? (
        <View style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: thickness, backgroundColor: colors.white, borderRadius: 2 }} />
      ) : null}
    </View>
  );
}
