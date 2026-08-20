import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from './AppText';
import { Row } from './Row';
import { colors, radius, space } from '@/lib/theme';
import { useTabBarInset } from '@/lib/useTabBarInset';

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
  const tabBarInset = useTabBarInset();
  if (!visible) return null;

  return (
    <Pressable style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)' }]} onPress={onClose}>
      <Pressable
        onPress={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: tabBarInset,
          backgroundColor: colors.surface,
          padding: space.lg,
          // No insets.bottom here — unlike a full-screen Modal, this sheet
          // stops above the tab bar (see `bottom: tabBarInset` above), and
          // on iOS that tab bar already extends through the home-indicator
          // safe area, so adding it again just left a big empty gap.
          paddingBottom: space.md,
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
          gap: space.xs,
        }}>
        <AppText variant="bodySemiBold" style={{ marginBottom: space.sm }}>
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
      </Pressable>
    </Pressable>
  );
}
