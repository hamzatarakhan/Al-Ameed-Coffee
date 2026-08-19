import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { colors, fonts } from '@/lib/theme';
import { useLang } from '@/lib/i18n';

export type TextVariant = 'display' | 'h2' | 'h3' | 'body' | 'bodyMedium' | 'bodySemiBold' | 'muted' | 'mono' | 'label';

// Every variant carries its own lineHeight — Arabic (Cairo) diacritics and
// descenders sit outside the Latin font metrics RN falls back to, so without
// an explicit, generous lineHeight they visually clip at the top/bottom.
const scale: Record<TextVariant, { size: number; line: number }> = {
  display: { size: 27, line: 34 },
  h2: { size: 20, line: 27 },
  h3: { size: 16, line: 22 },
  body: { size: 15, line: 22 },
  bodyMedium: { size: 15, line: 22 },
  bodySemiBold: { size: 15, line: 22 },
  muted: { size: 14, line: 20 },
  mono: { size: 13, line: 18 },
  label: { size: 12, line: 17 },
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
      case 'bodySemiBold':
        return isRTL ? fonts.bodyArSemiBold : fonts.bodyEnSemiBold;
      case 'bodyMedium':
        return isRTL ? fonts.bodyArMedium : fonts.bodyEnMedium;
      // IBM Plex Mono has no Arabic glyphs — on RTL, chips/tags/prices fall
      // back to Cairo instead, or the OS silently substitutes its own font
      // per-glyph, which is what was reading as "broken/cut off" text.
      case 'mono':
        return isRTL ? fonts.bodyArMedium : fonts.mono;
      case 'label':
        return isRTL ? fonts.bodyArSemiBold : fonts.mono;
      default:
        return isRTL ? fonts.bodyAr : fonts.bodyEn;
    }
  })();

  const resolvedAlign: TextStyle['textAlign'] =
    align === 'center' ? 'center' : align === 'end' ? (isRTL ? 'left' : 'right') : isRTL ? 'right' : 'left';

  const letterSpacing = variant === 'label' ? 0.6 : variant === 'mono' ? 0.2 : undefined;
  const { size, line } = scale[variant];

  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: family,
          fontSize: size,
          lineHeight: line,
          color: color ?? colors.text,
          textAlign: resolvedAlign,
          writingDirection: isRTL ? 'rtl' : 'ltr',
          letterSpacing,
          textTransform: variant === 'label' ? 'uppercase' : undefined,
          // Android stacks its own extra padding on top of lineHeight, which
          // clips large/tightly-set glyphs against their box (seen on the
          // OTP boxes and the points-balance number) — this is app-wide
          // since it's a platform quirk, not a per-screen sizing mistake.
          includeFontPadding: false,
        },
        variant === 'muted' && { color: colors.textMuted },
        style,
      ]}
    />
  );
}
