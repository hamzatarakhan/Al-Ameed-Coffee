import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, space } from '@/lib/theme';

export function ChoiceChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.xs }}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              backgroundColor: selected ? colors.brand : colors.surface2,
              borderRadius: radius.pill,
              borderWidth: 1,
              borderColor: selected ? colors.brand : colors.border,
              paddingHorizontal: 14,
              paddingVertical: 8,
            }}>
            <AppText variant="bodyMedium" color={selected ? colors.white : colors.text}>
              {opt.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
