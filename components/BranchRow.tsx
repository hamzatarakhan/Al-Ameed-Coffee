import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from './AppText';
import { Row } from './Row';
import { Pill } from './Pill';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import type { Branch } from '@/lib/mock-data';

// Shared by Home's branch preview, the full Branches list, and the
// pickup-branch picker — those three used to hand-roll nearly identical
// markup independently.
export function BranchRow({
  branch,
  distanceKm,
  onPress,
  disabled,
  showImage = true,
  showLink = true,
  badge,
}: {
  branch: Branch;
  distanceKm?: number | null;
  onPress: () => void;
  disabled?: boolean;
  showImage?: boolean;
  showLink?: boolean;
  badge?: string;
}) {
  const { t, lang, isRTL } = useLang();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: showImage ? space.md : space.lg,
        opacity: disabled ? 0.5 : 1,
      }}>
      <Row style={{ alignItems: 'center', gap: space.md }}>
        {showImage ? (
          branch.image ? (
            <View>
              <Image source={branch.image} style={{ width: 64, height: 64, borderRadius: radius.md }} resizeMode="cover" />
              {badge ? (
                <View
                  style={{
                    position: 'absolute',
                    top: -6,
                    [isRTL ? 'right' : 'left']: -6,
                    backgroundColor: colors.brand,
                    borderRadius: radius.pill,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                  }}>
                  <AppText variant="label" color={colors.white} style={{ fontSize: 9, lineHeight: 11 }}>
                    {badge}
                  </AppText>
                </View>
              ) : null}
            </View>
          ) : null
        ) : (
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="storefront-outline" size={20} color={colors.brandInk} />
          </View>
        )}
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
          {showLink ? (
            <Row style={{ alignItems: 'center', gap: 4, marginTop: space.xs }}>
              <AppText variant="label" color={colors.brandInk}>
                {t('common.seeAll')}
              </AppText>
              <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={12} color={colors.brandInk} />
            </Row>
          ) : null}
        </View>
        {!showLink && !disabled ? <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={colors.textMuted} /> : null}
      </Row>
    </Pressable>
  );
}
