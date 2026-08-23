import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from './AppText';
import { Button } from './Button';
import { QrScannerCard } from './QrScannerCard';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';

// Shown once, automatically, right after landing in the signed-in app —
// check-in is the app's most-used action, so it gets first billing instead
// of waiting for someone to find the Check In tab.
export function CheckinPopup({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t, isRTL } = useLang();
  const router = useRouter();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', padding: space.lg }}>
        {/* Swallow the tap so it doesn't bubble to the backdrop Pressable and close the card when tapping inside it. */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 340, backgroundColor: colors.surface, borderRadius: radius.xl, padding: space.xl, alignItems: 'center' }}>
          <Pressable onPress={onClose} hitSlop={10} style={{ position: 'absolute', top: space.md, [isRTL ? 'left' : 'right']: space.md, zIndex: 1 }}>
            <Ionicons name="close" size={22} color={colors.textMuted} />
          </Pressable>

          <AppText variant="h2" align="center" style={{ marginBottom: space.xs }}>
            {t('checkin.title')}
          </AppText>
          <AppText variant="muted" align="center" style={{ marginBottom: space.xl, maxWidth: 260 }}>
            {t('checkin.instruction')}
          </AppText>

          <View style={{ marginBottom: space.lg }}>
            <QrScannerCard size={180} />
          </View>

          <Button
            label={t('checkin.openFull')}
            variant="secondary"
            onPress={() => {
              onClose();
              router.push('/checkin');
            }}
            style={{ width: '100%' }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
