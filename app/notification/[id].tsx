import React from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/AppText';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useNotifications } from '@/lib/notifications-store';

export default function NotificationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang } = useLang();
  const { notifications } = useNotifications();
  const notification = notifications.find((n) => n.id === id);

  if (!notification) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title={t('notifications.title')} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('notifications.title')} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl }}>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: colors.brandTint,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: space.lg,
          }}>
          <Ionicons name="notifications" size={24} color={colors.brand} />
        </View>

        <AppText variant="h2" style={{ marginBottom: space.xs }}>
          {lang === 'ar' ? notification.titleAr : notification.titleEn}
        </AppText>
        <AppText variant="label" color={colors.textMuted} style={{ marginBottom: space.lg }}>
          {notification.date}
        </AppText>

        <AppText variant="body">{lang === 'ar' ? notification.bodyAr : notification.bodyEn}</AppText>
      </ScrollView>
    </View>
  );
}
