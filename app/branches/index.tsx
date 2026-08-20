import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Pill } from '@/components/Pill';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { branches, branchCityById, type Branch } from '@/lib/mock-data';

export default function BranchesListScreen() {
  const { t, lang, isRTL } = useLang();
  const router = useRouter();
  const [locationGranted, setLocationGranted] = useState(false);

  // No real branch coordinates yet (needs the real backend's geodata), so
  // this only wires the actual permission prompt — distance sorting comes
  // later once branches carry real lat/lng.
  const enableLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationGranted(status === 'granted');
  };

  // Grouped by city so a 31-branch list is actually scannable instead of
  // one long undifferentiated column — Amman first since it has the vast
  // majority of branches, the rest in branch-count order.
  const groups = useMemo(() => {
    const byCity = new Map<string, { nameAr: string; nameEn: string; items: Branch[] }>();
    for (const b of branches) {
      const city = branchCityById[b.id] ?? { ar: b.addressAr, en: b.addressEn };
      const key = city.en;
      if (!byCity.has(key)) byCity.set(key, { nameAr: city.ar, nameEn: city.en, items: [] });
      byCity.get(key)!.items.push(b);
    }
    return Array.from(byCity.values()).sort((a, b) => (a.nameEn === 'Amman' ? -1 : b.nameEn === 'Amman' ? 1 : b.items.length - a.items.length));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('branches.title')} right={<AppText variant="label" color={colors.textMuted}>{branches.length}</AppText>} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl }}>
        {locationGranted ? (
          <Row style={{ alignItems: 'center', gap: space.xs, marginBottom: space.lg }}>
            <Ionicons name="checkmark-circle" size={14} color={colors.good} />
            <AppText variant="muted">{t('branches.locationEnabled')}</AppText>
          </Row>
        ) : (
          <Pressable onPress={enableLocation}>
            <Row style={{ alignItems: 'center', gap: space.xs, marginBottom: space.lg }}>
              <Ionicons name="location-outline" size={14} color={colors.brandInk} />
              <AppText variant="muted" color={colors.brandInk}>
                {t('branches.distanceUnknown')}
              </AppText>
            </Row>
          </Pressable>
        )}

        {groups.map((group) => (
          <View key={group.nameEn} style={{ marginBottom: space.xl }}>
            <Row style={{ alignItems: 'center', gap: space.xs, marginBottom: space.md }}>
              <AppText variant="h3">{lang === 'ar' ? group.nameAr : group.nameEn}</AppText>
              <AppText variant="label" color={colors.textMuted}>
                {group.items.length}
              </AppText>
            </Row>

            <View style={{ gap: space.md }}>
              {group.items.map((b) => (
                <Pressable
                  key={b.id}
                  onPress={() => router.push(`/branches/${b.id}`)}
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: radius.lg,
                    overflow: 'hidden',
                  }}>
                  <Row style={{ alignItems: 'center' }}>
                    {b.image ? <Image source={b.image} style={{ width: 80, height: 80 }} resizeMode="cover" /> : null}
                    <View style={{ flex: 1, padding: space.md }}>
                      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <AppText variant="bodySemiBold" style={{ flex: 1 }} numberOfLines={1}>
                          {lang === 'ar' ? b.nameAr : b.nameEn}
                        </AppText>
                        <Pill tone={b.openNow ? 'good' : 'neutral'} label={b.openNow ? t('branches.openNow') : t('branches.closed')} />
                      </Row>
                      <AppText variant="muted" numberOfLines={1}>
                        {lang === 'ar' ? b.addressAr : b.addressEn}
                      </AppText>
                      <Row style={{ alignItems: 'center', gap: 4, marginTop: space.xs }}>
                        <AppText variant="label" color={colors.brandInk}>
                          {t('common.seeAll')}
                        </AppText>
                        <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={12} color={colors.brandInk} />
                      </Row>
                    </View>
                  </Row>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
