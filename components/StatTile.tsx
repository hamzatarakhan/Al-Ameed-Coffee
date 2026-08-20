import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { colors } from '@/lib/theme';

interface Props {
  value: string | number;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

export function StatTile({ value, label, icon, onPress }: Props) {
  const content = (
    <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
      {icon ? <Ionicons name={icon} size={16} color={colors.brandInk} /> : null}
      <AppText variant="mono" color={colors.text} style={{ fontSize: 16, lineHeight: 22 }}>
        {value}
      </AppText>
      <AppText variant="label" color={colors.textMuted}>
        {label}
      </AppText>
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ flex: 1 }, pressed && { opacity: 0.6 }]}>
      {content}
    </Pressable>
  );
}
