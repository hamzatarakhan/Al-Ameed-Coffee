import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/lib/theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;
  tone?: 'light' | 'brand' | 'dark';
  style?: ViewStyle;
}

export function CircleButton({ icon, onPress, size = 40, tone = 'light', style }: Props) {
  // Computed per render (not at module load) so it picks up live theme
  // changes — and "light"/"dark" tones stay fixed white-on-dark-icon /
  // dark-on-white-icon regardless of app theme, since they're circles drawn
  // over photography, not surfaces that should follow light/dark mode.
  const tones = {
    light: { bg: '#FFFFFF', fg: '#1A1A1A' },
    brand: { bg: colors.brand, fg: '#FFFFFF' },
    dark: { bg: 'rgba(255,255,255,0.2)', fg: '#FFFFFF' },
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
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      <Ionicons name={icon} size={size * 0.45} color={t.fg} />
    </Pressable>
  );
}
