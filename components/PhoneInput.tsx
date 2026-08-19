import React from 'react';
import { TextInput, View } from 'react-native';
import { AppText } from './AppText';
import { colors, fonts, radius, space } from '@/lib/theme';

interface Props {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
}

// Phone numbers stay left-to-right even in the Arabic UI (same convention
// every regional site/app uses) — the +962 badge and digits are never
// mirrored for RTL, unlike the rest of the app.
export function PhoneInput({ label, value, onChangeText, error }: Props) {
  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <AppText variant="label" color={colors.textMuted}>
          {label}
        </AppText>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'stretch',
          backgroundColor: colors.surface2,
          borderWidth: 1,
          borderColor: error ? colors.critical : colors.border,
          borderRadius: radius.md,
          overflow: 'hidden',
        }}>
        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: space.md,
            backgroundColor: colors.surface,
            borderRightWidth: 1,
            borderRightColor: colors.border,
          }}>
          <AppText variant="bodyMedium" color={colors.textMuted} style={{ fontFamily: fonts.mono }}>
            +962
          </AppText>
        </View>
        <TextInput
          value={value}
          onChangeText={(t) => onChangeText(t.replace(/\D/g, '').slice(0, 10))}
          placeholder="07X XXX XXXX"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          maxLength={10}
          style={{
            flex: 1,
            paddingHorizontal: space.md,
            paddingVertical: 13,
            fontSize: 15,
            fontFamily: fonts.mono,
            color: colors.text,
            textAlign: 'left',
            writingDirection: 'ltr',
          }}
        />
      </View>
      {error ? (
        <AppText variant="label" color={colors.critical}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
