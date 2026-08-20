import React from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Pill } from '@/components/Pill';
import { CircleButton } from '@/components/CircleButton';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { branches } from '@/lib/mock-data';

export default function BranchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang, isRTL } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const branch = branches.find((b) => b.id === id) ?? branches[0];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: space.xxxl }}>
        <View style={{ height: 220, backgroundColor: colors.hero, alignItems: 'center', justifyContent: 'center', gap: space.xs }}>
          <Ionicons name="map" size={28} color={colors.brand} />
          <AppText variant="muted" color="#C9BEB4">
            {t('branchDetail.mapPreview')}
          </AppText>
          <CircleButton
            icon={isRTL ? 'chevron-forward' : 'chevron-back'}
            onPress={() => router.back()}
            tone="light"
            style={{ position: 'absolute', top: insets.top + space.sm, [isRTL ? 'right' : 'left']: space.lg }}
          />
        </View>

        <View style={{ backgroundColor: colors.bg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, marginTop: -24, padding: space.xl, gap: space.lg }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <AppText variant="h2">{lang === 'ar' ? branch.nameAr : branch.nameEn}</AppText>
            <Pill tone={branch.openNow ? 'good' : 'neutral'} label={branch.openNow ? t('branches.openNow') : t('branches.closed')} />
          </Row>

          <View style={{ gap: space.xs }}>
            <AppText variant="label" color={colors.brand}>
              {t('branchDetail.address')}
            </AppText>
            <AppText variant="body">{lang === 'ar' ? branch.addressAr : branch.addressEn}</AppText>
          </View>

          <View style={{ gap: space.xs }}>
            <AppText variant="label" color={colors.brand}>
              {t('branchDetail.hours')}
            </AppText>
            <AppText variant="body">{lang === 'ar' ? branch.hoursWeekdaysAr : branch.hoursWeekdaysEn}</AppText>
            <AppText variant="body">{lang === 'ar' ? branch.hoursWeekendAr : branch.hoursWeekendEn}</AppText>
          </View>

          <Row style={{ gap: space.md }}>
            <Button
              label={t('branchDetail.location')}
              style={{ flex: 1 }}
              onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(lang === 'ar' ? branch.addressAr : branch.addressEn)}`)}
            />
            <Button label={t('branchDetail.call')} variant="secondary" style={{ flex: 1 }} onPress={() => Linking.openURL(`tel:${branch.phone}`)} />
          </Row>
        </View>
      </ScrollView>
    </View>
  );
}
