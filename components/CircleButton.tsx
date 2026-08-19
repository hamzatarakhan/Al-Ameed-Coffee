import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/lib/theme';
import { useThemeMode } from '@/lib/theme-mode';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;
  tone?: 'light' | 'brand' | 'dark';
  style?: ViewStyle;
}

export function CircleButton({ icon, onPress, size = 40, tone = 'light', style }: Props) {
  const { isDark } = useThemeMode();

  // "light" sits on plain page backgrounds (notification bell, list-row
  // chevrons) as often as it sits over hero photography, so unlike
  // brand/dark it needs to stay visible against both a white page (soft
  // grey fill + border, not invisible white-on-white) and a dark page
  // (a slightly muted off-white, not glaring stark white).
  const tones = {
    light: { bg: isDark ? '#EDE9E7' : colors.surface2, fg: '#1A1A1A', border: colors.border },
    brand: { bg: colors.brand, fg: '#FFFFFF', border: 'transparent' },
    dark: { bg: 'rgba(255,255,255,0.2)', fg: '#FFFFFF', border: 'transparent' },
  };
  const t = tones[tone];
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: t.bg,
          borderWidth: tone === 'light' ? 1 : 0,
          borderColor: t.border,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      <Ionicons name={icon} size={size * 0.45} color={t.fg} />
    </Pressable>
  );
}
