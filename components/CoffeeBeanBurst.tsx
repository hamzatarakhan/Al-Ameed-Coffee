import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming, Easing } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const BEAN_COUNT = 14;

function randomBean() {
  const startX = Math.random() * width;
  return {
    startX,
    endX: startX + (Math.random() - 0.5) * 80,
    delay: Math.random() * 300,
    duration: 1400 + Math.random() * 600,
    size: 16 + Math.random() * 10,
    rotateDeg: (Math.random() - 0.5) * 720,
  };
}

function Bean({ config }: { config: ReturnType<typeof randomBean> }) {
  const { startX, endX, delay, duration, size, rotateDeg } = config;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration, easing: Easing.in(Easing.quad) }));
  }, [delay, duration, progress]);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: startX + (endX - startX) * progress.value,
    top: -30 + progress.value * (height * 0.55),
    opacity: progress.value < 0.85 ? 1 : 1 - (progress.value - 0.85) / 0.15,
    transform: [{ rotate: `${rotateDeg * progress.value}deg` }],
  }));

  return (
    <Animated.Text style={[{ fontSize: size }, style]}>🫘</Animated.Text>
  );
}

// Celebratory falling-beans burst for the one moment in the app that
// deserves it — an order actually going through. Values are locked in via
// useState on mount, not recomputed every render, so an unrelated parent
// re-render mid-fall can't reset beans back to their start position.
export function CoffeeBeanBurst() {
  const [beans] = useState(() => Array.from({ length: BEAN_COUNT }, randomBean));

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      {beans.map((config, i) => (
        <Bean key={i} config={config} />
      ))}
    </View>
  );
}
