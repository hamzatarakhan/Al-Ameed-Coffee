import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { colors, fonts } from '@/lib/theme';
import { useLang } from '@/lib/i18n';

export type TextVariant = 'display' | 'h2' | 'h3' | 'body' | 'bodyMedium' | 'bodySemiBold' | 'muted' | 'mono' | 'label';

const sizes: Record<TextVariant, number> = {
  display: 26,
  h2: 19,
  h3: 15.5,
  body: 15,
  bodyMedium: 15,
  bodySemiBold: 15,
  muted: 13.5,
  mono: 12,
  label: 11,
};

interface Props extends TextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'start' | 'center' | 'end';
}

export function AppText({ variant = 'body', color, align, style, ...rest }: Props) {
  const { isRTL } = useLang();

  const family = (() => {
    switch (variant) {
      case 'display':
        return isRTL ? fonts.displayAr : fonts.displayEn;
      case 'h2':
      case 'h3':
        return isRTL ? fonts.bodyArSemiBold : fonts.bodyEnSemiBold;
      case 'bodySemiBold':
        return isRTL ? fonts.bodyArSemiBold : fonts.bodyEnSemiBold;
      case 'bodyMedium':
        return isRTL ? fonts.bodyArMedium : fonts.bodyEnMedium;
      case 'mono':
      case 'label':
        return fonts.mono;
      default:
        return isRTL ? fonts.bodyAr : fonts.bodyEn;
    }
  })();

  const resolvedAlign: TextStyle['textAlign'] =
    align === 'center' ? 'center' : align === 'end' ? (isRTL ? 'left' : 'right') : isRTL ? 'right' : 'left';

  const letterSpacing = variant === 'label' ? 0.6 : variant === 'mono' ? 0.2 : undefined;

  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: family,
          fontSize: sizes[variant],
          color: color ?? colors.text,
          textAlign: resolvedAlign,
          writingDirection: isRTL ? 'rtl' : 'ltr',
          letterSpacing,
          textTransform: variant === 'label' ? 'uppercase' : undefined,
        },
        variant === 'display' && { lineHeight: sizes.display * 1.2 },
        variant === 'muted' && { color: colors.textMuted },
        style,
      ]}
    />
  );
}
