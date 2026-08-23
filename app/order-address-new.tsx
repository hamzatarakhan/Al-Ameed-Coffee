import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ChoiceChips } from '@/components/ChoiceChips';
import { Input } from '@/components/Input';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useOrderCart, type AddressType } from '@/lib/order-cart';
import { jordanCities } from '@/lib/mock-data';

export default function OrderAddressNewScreen() {
  const { t } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addAddress } = useOrderCart();

  const [type, setType] = useState<AddressType>('home');
  const [line, setLine] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');

  const canSave = line.trim() && city && area.trim() && building.trim();

  const save = () => {
    addAddress({ type, line: line.trim(), city, area: area.trim(), building: building.trim(), floor: floor.trim() || undefined });
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('orderAddress.title')} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.lg }} keyboardShouldPersistTaps="handled">
          <ChoiceChips<AddressType>
            value={type}
            onChange={setType}
            options={[
              { value: 'home', label: t('orderAddress.home') },
              { value: 'work', label: t('orderAddress.work') },
              { value: 'other', label: t('orderAddress.other') },
            ]}
          />
          <Input label={t('orderAddress.addressLine')} value={line} onChangeText={setLine} placeholder={t('orderAddress.addressLinePlaceholder')} />
          <View style={{ gap: 6 }}>
            <AppText variant="label" color={colors.textMuted}>
              {t('orderAddress.city')}
            </AppText>
            <ChoiceChips value={city} onChange={setCity} options={jordanCities.map((c) => ({ value: c, label: c }))} />
          </View>
          <Input label={t('orderAddress.area')} value={area} onChangeText={setArea} placeholder={t('orderAddress.areaPlaceholder')} />
          <Input label={t('orderAddress.building')} value={building} onChangeText={setBuilding} placeholder={t('orderAddress.buildingPlaceholder')} />
          <Input label={t('orderAddress.floor')} value={floor} onChangeText={setFloor} keyboardType="number-pad" />
        </ScrollView>
        <View
          style={{
            padding: space.lg,
            paddingBottom: insets.bottom + space.md,
            backgroundColor: colors.bg,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}>
          <Button label={t('orderAddress.save')} onPress={save} disabled={!canSave} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
