import React from 'react';
import { View } from 'react-native';
import { colors, radius } from '@/lib/theme';
import { useLang } from '@/lib/i18n';

// Points balance vs. next reward — the direct fix for the old app's
// "20 points with a 425-point reward and no sense of progress" gap.
export function ProgressBar({ value, max }: { value: number; max: number }) {
  const { isRTL } = useLang();
  const pct = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  return (
    <View style={{ height: 8, borderRadius: radius.pill, backgroundColor: colors.surface2, overflow: 'hidden' }}>
      <View
        style={{
          height: '100%',
          width: `${pct * 100}%`,
          borderRadius: radius.pill,
          backgroundColor: colors.brand,
          [isRTL ? 'right' : 'left']: 0,
          position: 'absolute',
        }}
      />
    </View>
  );
}
