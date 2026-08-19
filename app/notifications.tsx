import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { notifications } from '@/lib/mock-data';

export default function NotificationsScreen() {
  const { t, lang } = useLang();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={t('notifications.title')}
        right={
          notifications.length > 0 ? (
            <Pressable hitSlop={8}>
              <AppText variant="label" color={colors.brandInk}>
                {t('notifications.readAll')}
              </AppText>
            </Pressable>
          ) : undefined
        }
      />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl }}>
        {notifications.length === 0 ? (
          <EmptyState icon="notifications-outline" title={t('notifications.empty')} body={t('notifications.emptyBody')} />
        ) : (
          <View style={{ gap: space.sm }}>
            {notifications.map((n) => (
              <Row
                key={n.id}
                style={{
                  gap: space.md,
                  padding: space.md,
                  borderRadius: 10,
                  backgroundColor: n.read ? 'transparent' : colors.surface2,
                }}>
                {!n.read ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand, marginTop: 6 }} /> : null}
                <View style={{ flex: 1 }}>
                  <AppText variant={n.read ? 'body' : 'bodySemiBold'}>{lang === 'ar' ? n.titleAr : n.titleEn}</AppText>
                  <AppText variant="muted" style={{ fontSize: 12.5 }}>
                    {lang === 'ar' ? n.bodyAr : n.bodyEn}
                  </AppText>
                  <AppText variant="label" color={colors.textMuted} style={{ marginTop: 4 }}>
                    {n.date}
                  </AppText>
                </View>
              </Row>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
