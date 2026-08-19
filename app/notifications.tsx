import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useNotifications } from '@/lib/notifications-store';

export default function NotificationsScreen() {
  const { t, lang, isRTL } = useLang();
  const router = useRouter();
  const { notifications, markRead, markAllRead } = useNotifications();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={t('notifications.title')}
        right={
          notifications.some((n) => !n.read) ? (
            <Pressable hitSlop={8} onPress={markAllRead}>
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
                onPress={() => {
                  markRead(n.id);
                  router.push(`/notification/${n.id}` as Href);
                }}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: radius.lg,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: space.md,
                }}>
                <Row style={{ gap: space.md, alignItems: 'center' }}>
                  {!n.read ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand }} /> : null}
                  <View style={{ flex: 1 }}>
                    <AppText variant={n.read ? 'body' : 'bodySemiBold'}>{lang === 'ar' ? n.titleAr : n.titleEn}</AppText>
                    <AppText variant="muted" numberOfLines={1}>
                      {lang === 'ar' ? n.bodyAr : n.bodyEn}
                    </AppText>
                    <AppText variant="label" color={colors.textMuted} style={{ marginTop: 4 }}>
                      {n.date}
                    </AppText>
                  </View>
                  <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={colors.textMuted} />
                </Row>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
