import React from 'react';
import { View, ViewProps } from 'react-native';
import { colors, radius, shadow, space } from '@/lib/theme';

export function Card({ style, ...rest }: ViewProps) {
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          padding: space.lg,
          ...shadow.card,
        },
        style,
      ]}
    />
  );
}
