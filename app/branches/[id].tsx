import React from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { branches } from '@/lib/mock-data';

export default function BranchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang } = useLang();
  const branch = branches.find((b) => b.id === id) ?? branches[0];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={lang === 'ar' ? branch.nameAr : branch.nameEn} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.xl }}>
        <View
          style={{
            aspectRatio: 16 / 9,
            borderRadius: radius.lg,
            backgroundColor: colors.surface2,
            alignItems: 'center',
            justifyContent: 'center',
            gap: space.xs,
          }}>
          <Ionicons name="map-outline" size={28} color={colors.gold} />
          <AppText variant="muted" style={{ fontSize: 12.5 }}>
            {t('branchDetail.mapPreview')}
          </AppText>
        </View>

        <View style={{ gap: space.xs }}>
          <AppText variant="label" color={colors.gold}>
            {t('branchDetail.address')}
          </AppText>
          <AppText variant="body">{lang === 'ar' ? branch.addressAr : branch.addressEn}</AppText>
        </View>

        <View style={{ gap: space.xs }}>
          <AppText variant="label" color={colors.gold}>
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
      </ScrollView>
    </View>
  );
}
