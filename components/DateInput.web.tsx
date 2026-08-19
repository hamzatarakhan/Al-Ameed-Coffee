import React from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, space } from '@/lib/theme';

interface Props {
  label?: string;
  value: string; // ISO 'YYYY-MM-DD', or '' for unset
  onChange: (isoDate: string) => void;
  placeholder?: string;
}

// @react-native-community/datetimepicker has no web implementation — the
// browser's own native <input type="date"> is the closest equivalent here.
// Metro/Expo picks this file over DateInput.tsx automatically on web.
export function DateInput({ label, value, onChange }: Props) {
  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <AppText variant="label" color={colors.textMuted}>
          {label}
        </AppText>
      ) : null}
      <input
        type="date"
        value={value}
        max={new Date().toISOString().slice(0, 10)}
        onChange={(e) => onChange(e.target.value)}
        style={{
          backgroundColor: colors.surface2,
          border: `1px solid ${colors.border}`,
          borderRadius: radius.md,
          padding: `13px ${space.md}px`,
          fontSize: 15,
          color: colors.text,
          width: '100%',
          boxSizing: 'border-box',
          direction: 'ltr',
        }}
      />
    </View>
  );
}
