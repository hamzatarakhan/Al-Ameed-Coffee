import React from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';
import { colors, radius } from '@/lib/theme';

type Tone = 'brand' | 'good' | 'warn' | 'critical' | 'neutral';

const tones: Record<Tone, { bg: string; fg: string }> = {
  brand: { bg: colors.brand, fg: colors.white },
  good: { bg: colors.goodBg, fg: colors.good },
  warn: { bg: colors.warnBg, fg: colors.warn },
  critical: { bg: colors.criticalBg, fg: colors.critical },
  neutral: { bg: colors.surface2, fg: colors.textMuted },
};

export function Pill({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const t = tones[tone];
  return (
    <View style={{ backgroundColor: t.bg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' }}>
      <AppText variant="label" color={t.fg}>
        {label}
      </AppText>
    </View>
  );
}
