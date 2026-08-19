import React, { useState } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { AppText } from './AppText';
import { colors, fonts, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, onFocus, onBlur, ...rest }: Props) {
  const { isRTL } = useLang();
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <AppText variant="label" color={colors.textMuted}>
          {label}
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
            fontSize: 15,
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
