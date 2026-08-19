import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '@/lib/theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;
  tone?: 'light' | 'brand' | 'dark';
  style?: ViewStyle;
}

const tones = {
  light: { bg: colors.white, fg: colors.text },
  brand: { bg: colors.brand, fg: colors.white },
  dark: { bg: 'rgba(23,19,16,0.55)', fg: colors.white },
};

export function CircleButton({ icon, onPress, size = 40, tone = 'light', style }: Props) {
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
          ...shadow.floating,
        },
        style,
      ]}>
      <Ionicons name={icon} size={size * 0.45} color={t.fg} />
    </Pressable>
  );
}
