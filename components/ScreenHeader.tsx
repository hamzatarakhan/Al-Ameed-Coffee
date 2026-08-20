import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from './AppText';
import { Row } from './Row';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';

export function ScreenHeader({ title, right, onBack }: { title: string; right?: React.ReactNode; onBack?: () => void }) {
  const router = useRouter();
  const { isRTL } = useLang();
  const insets = useSafeAreaInsets();

  return (
    <Row
      style={{
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: insets.top + space.sm,
        paddingBottom: space.md,
        paddingHorizontal: space.lg,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
      <Pressable onPress={onBack ?? (() => router.back())} hitSlop={12} style={{ width: 32 }}>
        <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={24} color={colors.text} />
      </Pressable>
      <AppText variant="h2" style={{ flex: 1 }} align="center">
        {title}
      </AppText>
      <View style={{ minWidth: 32, alignItems: 'flex-end' }}>{right}</View>
    </Row>
  );
}
