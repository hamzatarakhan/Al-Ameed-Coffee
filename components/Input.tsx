import React, { useState } from 'react';
import { Platform, TextInput, TextInputProps, View } from 'react-native';
import { AppText } from './AppText';
import { colors, fonts, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export function Input({ label, error, required, style, onFocus, onBlur, ...rest }: Props) {
  const { isRTL } = useLang();
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <AppText variant="label" color={colors.textMuted}>
          {label}
          {required ? <AppText variant="label" color={colors.critical}> *</AppText> : null}
        </AppText>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          {
            backgroundColor: colors.surface2,
            borderWidth: focused ? 1.5 : 1,
            borderColor: error ? colors.critical : focused ? colors.brand : colors.border,
            borderRadius: radius.md,
            paddingHorizontal: space.md,
            paddingVertical: focused ? 12.5 : 13,
            // iOS Safari auto-zooms the whole page in when a focused input's
            // font-size is under 16px, and never zooms back out on blur —
            // 16px on web sidesteps that trigger entirely.
            fontSize: Platform.OS === 'web' ? 16 : 15,
            fontFamily: isRTL ? fonts.bodyAr : fonts.bodyEn,
            color: colors.text,
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr',
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <AppText variant="label" color={colors.critical}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
