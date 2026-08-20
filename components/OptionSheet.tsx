import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from './AppText';
import { Row } from './Row';
import { BottomSheet } from './BottomSheet';
import { darkColors, lightColors, radius, space } from '@/lib/theme';
import { useThemeMode } from '@/lib/theme-mode';

export function OptionSheet<T extends string>({
  visible,
  onClose,
  title,
  options,
  value,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: { value: T; label: string }[];
  value: T;
  onSelect: (v: T) => void;
}) {
  const insets = useSafeAreaInsets();
  // Reads isDark straight from context instead of the mutated `colors`
  // singleton the rest of the app uses — this sheet lives outside the
  // Stack that normally force-remounts on theme change (see _layout.tsx),
  // so it needs a real reactive dependency to stay in sync. A `key` on
  // the sheet would also force a fresh render, but doing that here
  // crashed React Navigation ("Another navigator is already registered")
  // — changing this sheet's key in the same update as the Stack's own
  // key apparently isn't safe, so this reads colors reactively instead.
  const { isDark } = useThemeMode();
  const colors = isDark ? darkColors : lightColors;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View
        style={{
          backgroundColor: colors.surface,
          padding: space.lg,
          paddingBottom: insets.bottom + space.md,
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
          gap: space.xs,
        }}>
        <AppText variant="bodySemiBold" style={{ marginBottom: space.sm }} color={colors.text}>
          {title}
        </AppText>
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => {
                onSelect(opt.value);
                onClose();
              }}
              style={{
                borderRadius: radius.md,
                backgroundColor: selected ? colors.brandTint : 'transparent',
              }}>
              <Row
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: space.md,
                  paddingHorizontal: space.sm,
                }}>
                <AppText variant="body" color={selected ? colors.brandInk : colors.text}>
                  {opt.label}
                </AppText>
                {selected ? <Ionicons name="checkmark" size={18} color={colors.brandInk} /> : null}
              </Row>
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}
