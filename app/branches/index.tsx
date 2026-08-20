import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Pill } from '@/components/Pill';
import { Input } from '@/components/Input';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { branches, branchCityById, type Branch } from '@/lib/mock-data';
import { useBranchDistances } from '@/lib/useBranchDistances';

function BranchCard({ branch, distanceKm }: { branch: Branch; distanceKm?: number | null }) {
  const { t, lang, isRTL } = useLang();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/branches/${branch.id}`)}
      style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: space.md }}>
      <Row style={{ alignItems: 'center', gap: space.md }}>
        {branch.image ? <Image source={branch.image} style={{ width: 64, height: 64, borderRadius: radius.md }} resizeMode="cover" /> : null}
        <View style={{ flex: 1 }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <AppText variant="bodySemiBold" style={{ flex: 1 }} numberOfLines={1}>
              {lang === 'ar' ? branch.nameAr : branch.nameEn}
            </AppText>
            <Pill tone={branch.openNow ? 'good' : 'neutral'} label={branch.openNow ? t('branches.openNow') : t('branches.closed')} />
          </Row>
          <AppText variant="muted" numberOfLines={1}>
            {lang === 'ar' ? branch.addressAr : branch.addressEn}
            {distanceKm != null ? ` · ${distanceKm.toFixed(1)} ${t('branches.km')}` : ''}
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
  );
}

export default function BranchesListScreen() {
  const { t, lang } = useLang();
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
              <BranchCard key={b.id} branch={b} distanceKm={distanceTo(b.id)} />
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
                  <BranchCard key={b.id} branch={b} />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
