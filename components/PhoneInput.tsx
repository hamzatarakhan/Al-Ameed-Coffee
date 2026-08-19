import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { AppText } from './AppText';
import { colors, fonts, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { normalizeJordanPhone } from '@/lib/phone';

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
  const { t } = useLang();
  const [focused, setFocused] = useState(false);

  const normalized = normalizeJordanPhone(value);
  let hint: string | undefined;
  if (!error && value) {
    if (normalized.length < 9) hint = t('auth.phoneDigitsRemaining', { n: 9 - normalized.length });
    else if (!normalized.startsWith('7')) hint = t('auth.phoneMustStartWith7');
  }

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
          borderWidth: focused ? 1.5 : 1,
          borderColor: error ? colors.critical : focused ? colors.brand : colors.border,
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
          onChangeText={(t2) => onChangeText(t2.replace(/\D/g, '').slice(0, 10))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="07X XXX XXXX"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          maxLength={10}
          style={{
            flex: 1,
            paddingHorizontal: space.md,
            paddingVertical: focused ? 12.5 : 13,
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
      ) : hint ? (
        <AppText variant="label" color={colors.textMuted}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}
