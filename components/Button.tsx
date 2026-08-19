import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, space } from '@/lib/theme';

type Variant = 'primary' | 'secondary' | 'ghost';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', loading, disabled, style }: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      onPress={isDisabled ? undefined : onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && { backgroundColor: colors.brand },
        variant === 'secondary' && { backgroundColor: colors.surface2 },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        isDisabled && { opacity: 0.5 },
        pressed && !isDisabled && { opacity: 0.85 },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.brandInk} />
      ) : (
        <AppText
          variant="bodySemiBold"
          align="center"
          color={variant === 'primary' ? colors.white : colors.brandInk}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
});
