import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { notifications as seedNotifications } from '@/lib/mock-data';

export default function NotificationsScreen() {
  const { t, lang } = useLang();
  const [notifications, setNotifications] = useState(seedNotifications);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={t('notifications.title')}
        right={
          notifications.some((n) => !n.read) ? (
            <Pressable hitSlop={8} onPress={() => setNotifications((list) => list.map((n) => ({ ...n, read: true })))}>
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
              <Pressable
                key={n.id}
                onPress={() => setNotifications((list) => list.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}>
                <Row
                  style={{
                    gap: space.md,
                    padding: space.md,
                    borderRadius: 10,
                    backgroundColor: n.read ? 'transparent' : colors.surface2,
                  }}>
                  {!n.read ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand, marginTop: 8 }} /> : null}
                  <View style={{ flex: 1 }}>
                    <AppText variant={n.read ? 'body' : 'bodySemiBold'}>{lang === 'ar' ? n.titleAr : n.titleEn}</AppText>
                    <AppText variant="muted">{lang === 'ar' ? n.bodyAr : n.bodyEn}</AppText>
                    <AppText variant="label" color={colors.textMuted} style={{ marginTop: 4 }}>
                      {n.date}
                    </AppText>
                  </View>
                </Row>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
