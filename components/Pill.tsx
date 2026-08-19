import React from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';
import { colors, radius } from '@/lib/theme';

type Tone = 'brand' | 'good' | 'warn' | 'critical' | 'neutral';

export function Pill({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  // Computed per render (not at module load) so it tracks live theme changes.
  const tones: Record<Tone, { bg: string; fg: string }> = {
    brand: { bg: colors.brand, fg: colors.white },
    good: { bg: colors.goodBg, fg: colors.good },
    warn: { bg: colors.warnBg, fg: colors.warn },
    critical: { bg: colors.criticalBg, fg: colors.critical },
    neutral: { bg: colors.surface2, fg: colors.textMuted },
  };
  const t = tones[tone];
  return (
    <View style={{ backgroundColor: t.bg, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start' }}>
      <AppText variant="label" color={t.fg}>
        {label}
      </AppText>
    </View>
  );
}
