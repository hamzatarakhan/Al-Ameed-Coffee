import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { Row } from './Row';
import { colors, radius, space } from '@/lib/theme';

type Variant = 'primary' | 'secondary' | 'ghost';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  trailing?: string;
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', loading, disabled, trailing, style }: Props) {
  const isDisabled = disabled || loading;
  const fg = variant === 'primary' ? colors.white : colors.brandInk;
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
        <ActivityIndicator color={fg} />
      ) : trailing ? (
        <Row style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
          <AppText variant="bodySemiBold" color={fg}>
            {label}
          </AppText>
          <AppText variant="bodySemiBold" color={fg}>
            {trailing}
          </AppText>
        </Row>
      ) : (
        <AppText variant="bodySemiBold" align="center" color={fg}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xl,
  },
});
