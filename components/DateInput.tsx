import React, { useState } from 'react';
import { Modal, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { AppText } from './AppText';
import { Button } from './Button';
import { colors, fonts, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useThemeMode } from '@/lib/theme-mode';
import { formatDateDisplay } from '@/lib/date';

interface Props {
  label?: string;
  value: string; // ISO 'YYYY-MM-DD', or '' for unset
  onChange: (isoDate: string) => void;
  placeholder?: string;
}

function toIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function DateInput({ label, value, onChange, placeholder }: Props) {
  const { t } = useLang();
  const { isDark } = useThemeMode();
  const insets = useSafeAreaInsets();
  const [showPicker, setShowPicker] = useState(false);
  const dateValue = value ? new Date(value) : new Date(2000, 0, 1);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (event.type === 'dismissed') return;
    if (selected) onChange(toIso(selected));
  };

  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <AppText variant="label" color={colors.textMuted}>
          {label}
        </AppText>
      ) : null}
      <Pressable
        onPress={() => setShowPicker(true)}
        style={{
          backgroundColor: colors.surface2,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.md,
          paddingHorizontal: space.md,
          paddingVertical: 13,
        }}>
        <AppText style={{ fontFamily: fonts.mono }} color={value ? colors.text : colors.textMuted}>
          {value ? formatDateDisplay(value) : placeholder}
        </AppText>
      </Pressable>

      {showPicker && Platform.OS === 'ios' ? (
        <Modal transparent animationType="slide" visible={showPicker} onRequestClose={() => setShowPicker(false)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' }} onPress={() => setShowPicker(false)}>
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{
                backgroundColor: colors.surface,
                padding: space.lg,
                paddingBottom: insets.bottom + space.lg,
                borderTopLeftRadius: radius.xl,
                borderTopRightRadius: radius.xl,
              }}>
              <DateTimePicker
                value={dateValue}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={handleChange}
                // Without this the spinner defaults to iOS's system
                // appearance, which mismatched our own dark mode toggle —
                // dark text on the surface's dark background rendered as a
                // blank-looking wheel.
                themeVariant={isDark ? 'dark' : 'light'}
                style={{ height: 200 }}
              />
              <Button label={t('common.done')} onPress={() => setShowPicker(false)} style={{ marginTop: space.md }} />
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}

      {showPicker && Platform.OS === 'android' ? (
        <DateTimePicker value={dateValue} mode="date" display="default" maximumDate={new Date()} onChange={handleChange} />
      ) : null}
    </View>
  );
}
