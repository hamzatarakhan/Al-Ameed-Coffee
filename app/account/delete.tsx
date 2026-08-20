import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Row } from '@/components/Row';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-store';
import { confirmAction } from '@/lib/confirm';

export default function DeleteAccountScreen() {
  const { t } = useLang();
  const auth = useAuth();
  const [confirmText, setConfirmText] = useState('');

  const expected = t('deleteAccount.confirmWord');
  const canDelete = confirmText.trim().toLocaleUpperCase() === expected.toLocaleUpperCase();

  const requestDelete = () => {
    confirmAction(
      t('deleteAccount.title'),
      t('deleteAccount.warningBody'),
      t('deleteAccount.confirmButton'),
      () => auth.deleteAccount(),
      t('deleteAccount.cancel'),
      true
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('deleteAccount.title')} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl }}>
        <View
          style={{
            backgroundColor: colors.criticalBg,
            borderRadius: radius.lg,
            padding: space.lg,
            marginBottom: space.xl,
          }}>
          <Row style={{ alignItems: 'center', gap: space.sm, marginBottom: space.xs }}>
            <Ionicons name="warning" size={18} color={colors.critical} />
            <AppText variant="bodySemiBold" color={colors.critical}>
              {t('deleteAccount.warningTitle')}
            </AppText>
          </Row>
          <AppText variant="body" color={colors.critical}>
            {t('deleteAccount.warningBody')}
          </AppText>
        </View>

        <Input
          label={t('deleteAccount.confirmLabel')}
          placeholder={expected}
          value={confirmText}
          onChangeText={setConfirmText}
          autoCapitalize="characters"
        />

        <Button
          label={t('deleteAccount.confirmButton')}
          onPress={requestDelete}
          disabled={!canDelete}
          style={{ marginTop: space.lg, backgroundColor: canDelete ? colors.critical : undefined }}
        />
      </ScrollView>
    </View>
  );
}
