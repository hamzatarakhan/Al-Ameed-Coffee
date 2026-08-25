import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from './AppText';
import { Button } from './Button';
import { QrScannerCard } from './QrScannerCard';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';

// Shown once, automatically, right after landing in the signed-in app —
// check-in is the app's most-used action, so it gets first billing instead
// of waiting for someone to find the Check In tab. `visible` defaults to
// true on Home, so (like BottomSheet.tsx/QrScannerCard.tsx) this stays on
// plain RN Animated, not reanimated — this can mount during expo-router's
// Node-based static export, which is exactly the mount-time worklet crash
// those files' comments describe.
export function CheckinPopup({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t, isRTL } = useLang();
  const router = useRouter();
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: visible ? 280 : 160,
      easing: visible ? Easing.out(Easing.back(1.1)) : Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible, progress]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.35)', opacity: progress }]} />
      <Pressable onPress={onClose} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.lg }}>
        <Animated.View
          style={{
            opacity: progress,
            transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
            width: '100%',
            maxWidth: 340,
          }}>
          {/* Swallow the tap so it doesn't bubble to the backdrop Pressable and close the card when tapping inside it. */}
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{ backgroundColor: colors.surface, borderRadius: radius.xl, padding: space.xl, alignItems: 'center' }}>
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
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
