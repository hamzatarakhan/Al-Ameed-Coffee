import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Input } from '@/components/Input';
import { ScreenHeader } from '@/components/ScreenHeader';
import { BranchRow } from '@/components/BranchRow';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { branches, branchCityById, type Branch } from '@/lib/mock-data';
import { useBranchDistances } from '@/lib/useBranchDistances';

export default function BranchesListScreen() {
  const { t, lang } = useLang();
  const router = useRouter();
  const { status, distanceTo, request } = useBranchDistances();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return branches;
    return branches.filter(
      (b) =>
        b.nameAr.includes(query.trim()) ||
        b.nameEn.toLowerCase().includes(q) ||
        b.addressAr.includes(query.trim()) ||
        b.addressEn.toLowerCase().includes(q)
    );
  }, [query]);

  const sortedByDistance = useMemo(() => {
    if (status !== 'granted') return null;
    return [...filtered].sort((a, b) => (distanceTo(a.id) ?? Infinity) - (distanceTo(b.id) ?? Infinity));
  }, [filtered, status, distanceTo]);

  // Grouped by city so a 31-branch list is actually scannable instead of
  // one long undifferentiated column — Amman first since it has the vast
  // majority of branches, the rest in branch-count order. Only used when
  // real distance sorting isn't active (location not enabled / search on).
  const groups = useMemo(() => {
    if (sortedByDistance) return null;
    const byCity = new Map<string, { nameAr: string; nameEn: string; items: Branch[] }>();
    for (const b of filtered) {
      const city = branchCityById[b.id] ?? { ar: b.addressAr, en: b.addressEn };
      const key = city.en;
      if (!byCity.has(key)) byCity.set(key, { nameAr: city.ar, nameEn: city.en, items: [] });
      byCity.get(key)!.items.push(b);
    }
    return Array.from(byCity.values()).sort((a, b) => (a.nameEn === 'Amman' ? -1 : b.nameEn === 'Amman' ? 1 : b.items.length - a.items.length));
  }, [filtered, sortedByDistance]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('branches.title')} right={<AppText variant="label" color={colors.textMuted}>{branches.length}</AppText>} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl }}>
        <View style={{ marginBottom: space.md }}>
          <Input placeholder={t('branches.search')} value={query} onChangeText={setQuery} />
        </View>

        {status === 'granted' ? (
          <Row style={{ alignItems: 'center', gap: space.xs, marginBottom: space.lg }}>
            <Ionicons name="checkmark-circle" size={14} color={colors.good} />
            <AppText variant="muted">{t('branches.locationEnabled')}</AppText>
          </Row>
        ) : (
          <Pressable onPress={request} disabled={status === 'loading'}>
            <Row style={{ alignItems: 'center', gap: space.xs, marginBottom: space.lg }}>
              <Ionicons name="location-outline" size={14} color={colors.brandInk} />
              <AppText variant="muted" color={colors.brandInk}>
                {t('branches.distanceUnknown')}
              </AppText>
            </Row>
          </Pressable>
        )}

        {filtered.length === 0 ? (
          <AppText variant="muted" align="center" style={{ marginTop: space.xl }}>
            {t('branches.noResults')}
          </AppText>
        ) : sortedByDistance ? (
          <View style={{ gap: space.md }}>
            {sortedByDistance.map((b) => (
              <BranchRow key={b.id} branch={b} distanceKm={distanceTo(b.id)} onPress={() => router.push(`/branches/${b.id}`)} />
            ))}
          </View>
        ) : (
          groups!.map((group) => (
            <View key={group.nameEn} style={{ marginBottom: space.xl }}>
              <Row style={{ alignItems: 'center', gap: space.xs, marginBottom: space.md }}>
                <AppText variant="h3">{lang === 'ar' ? group.nameAr : group.nameEn}</AppText>
                <AppText variant="label" color={colors.textMuted}>
                  {group.items.length}
                </AppText>
              </Row>
              <View style={{ gap: space.md }}>
                {group.items.map((b) => (
                  <BranchRow key={b.id} branch={b} onPress={() => router.push(`/branches/${b.id}`)} />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
