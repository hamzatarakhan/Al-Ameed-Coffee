import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Button } from './Button';
import { colors, space } from '@/lib/theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
}

// The designed replacement for the old app's literal "NO PHOTO" placeholder
// image and the large unstyled blank space below single list items.
export function EmptyState({ icon, title, body, actionLabel, onAction }: Props) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: space.xxxl, paddingHorizontal: space.xl, gap: space.sm }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.surface2,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: space.xs,
        }}>
        <Ionicons name={icon} size={26} color={colors.gold} />
      </View>
      <AppText variant="h3" align="center">
        {title}
      </AppText>
      {body ? (
        <AppText variant="muted" align="center" style={{ maxWidth: 260 }}>
          {body}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} variant="secondary" onPress={onAction} style={{ marginTop: space.sm, paddingHorizontal: space.xl }} />
      ) : null}
    </View>
  );
}
