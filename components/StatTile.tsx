import React from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';
import { colors } from '@/lib/theme';

export function StatTile({ value, label }: { value: string | number; label: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
      <AppText variant="mono" color={colors.text} style={{ fontSize: 16, lineHeight: 22 }}>
        {value}
      </AppText>
      <AppText variant="label" color={colors.textMuted}>
        {label}
      </AppText>
    </View>
  );
}
