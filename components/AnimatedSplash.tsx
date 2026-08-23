import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { fonts } from '@/lib/theme';
import { brand } from '@/lib/brand';

const VISIBLE_MS = 2000;
const EXIT_MS = 480;

// A ring that pings outward from behind the logo and fades — classic "radar"
// splash flourish. Each instance just runs the same loop on its own delay.
function Ring({ delay }: { delay: number }) {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withRepeat(withTiming(1.9, { duration: 1900, easing: Easing.out(Easing.ease) }), -1, false));
    opacity.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(0.55, { duration: 200 }), withTiming(0, { duration: 1700, easing: Easing.out(Easing.ease) })), -1, false),
    );
  }, [delay, opacity, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }));

  return <Animated.View pointerEvents="none" style={[styles.ring, style]} />;
}

// A soft blurred wisp that drifts up and sways, like steam off a fresh cup —
// purely decorative, positioned loosely around the logo's cup silhouette.
function Steam({ delay, left }: { delay: number; left: number }) {
  const translateY = useSharedValue(14);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(delay, withRepeat(withTiming(-64, { duration: 2600, easing: Easing.out(Easing.ease) }), -1, false));
    translateX.value = withDelay(delay, withRepeat(withSequence(withTiming(6, { duration: 1300 }), withTiming(-6, { duration: 1300 })), -1, true));
    opacity.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(0.5, { duration: 500 }), withTiming(0, { duration: 2100 })), -1, false),
    );
  }, [delay, opacity, translateX, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  return <Animated.View pointerEvents="none" style={[styles.steam, { left }, style]} />;
}

export function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const insets = useSafeAreaInsets();

  const logoOpacity = useSharedValue(0);
  const glow = useSharedValue(0.35);
  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(10);
  const dotsOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    glow.value = withDelay(200, withRepeat(withSequence(withTiming(0.7, { duration: 1100 }), withTiming(0.35, { duration: 1100 })), -1, true));

    textOpacity.value = withDelay(420, withTiming(1, { duration: 450 }));
    textY.value = withDelay(420, withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) }));
    dotsOpacity.value = withDelay(750, withTiming(1, { duration: 300 }));

    const exitTimer = setTimeout(() => {
      containerOpacity.value = withTiming(0, { duration: EXIT_MS, easing: Easing.in(Easing.cubic) });
      containerScale.value = withTiming(1.08, { duration: EXIT_MS, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(onFinish)();
      });
    }, VISIBLE_MS);

    return () => clearTimeout(exitTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));
  const logoStyle = useAnimatedStyle(() => ({ opacity: logoOpacity.value }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value, transform: [{ translateY: textY.value }] }));
  const dotsStyle = useAnimatedStyle(() => ({ opacity: dotsOpacity.value }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.container, containerStyle]}>
      <LinearGradient colors={['#0B0304', '#20060B', '#3D0A15']} locations={[0, 0.55, 1]} style={StyleSheet.absoluteFill} />

      <View style={styles.center}>
        <Ring delay={0} />
        <Ring delay={650} />
        <Ring delay={1300} />

        <Steam delay={0} left={-26} />
        <Steam delay={550} left={-6} />
        <Steam delay={1100} left={16} />
        <Steam delay={1650} left={32} />

        <Animated.View pointerEvents="none" style={[styles.glow, glowStyle]} />
        <Animated.Image source={brand.logo} style={[styles.logo, logoStyle]} resizeMode="contain" />

        <Animated.View style={textStyle}>
          <Animated.Text style={styles.titleAr}>{brand.nameAr}</Animated.Text>
          <Animated.Text style={styles.titleEn}>{brand.nameEnUpper}</Animated.Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.dots, { bottom: insets.bottom + 40 }, dotsStyle]}>
        <Dot delay={0} />
        <Dot delay={180} />
        <Dot delay={360} />
      </Animated.View>
    </Animated.View>
  );
}

function Dot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.25);

  useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: 420 }), withTiming(0.25, { duration: 420 })), -1, false));
  }, [delay, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  center: { alignItems: 'center', justifyContent: 'center' },
  // The source mark is a wide oval (~1.8:1), not a square — sizing the box
  // to that ratio keeps `contain` from adding its own top/bottom letterbox
  // padding on top of the logo's own margin, which is what created the big
  // gap before the crop.
  logo: { width: 210, height: 117 },
  glow: {
    position: 'absolute',
    // `center`'s own width is auto (shrink-to-content), and RN/Yoga can't
    // reliably resolve percentage insets against an auto-sized parent — a
    // `left: '50%'` attempt here landed the circle way off to one side.
    // Horizontal centering instead comes for free from the parent's
    // `alignItems: 'center'` (which only needs this view's own definite
    // width, not a percentage), so only a fixed-pixel `top` is needed to
    // pull the circle's center down from the logo's top (its default,
    // unset-top position) to the true middle of the logo+text group.
    top: -54,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#E51937',
    // Cheap radial-glow stand-in: a blurred-looking soft circle via low
    // opacity + shadow blur (works on iOS/Android/web without a blur view).
    shadowColor: '#E51937',
    shadowOpacity: 0.75,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  ring: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  steam: {
    position: 'absolute',
    top: -14,
    width: 8,
    height: 26,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  titleAr: {
    marginTop: 6,
    fontFamily: fonts.displayAr,
    fontSize: 26,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  titleEn: {
    marginTop: 4,
    fontFamily: fonts.bodyEnMedium,
    fontSize: 11,
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  dots: { position: 'absolute', flexDirection: 'row', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },
});
