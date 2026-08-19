import React, { useState } from 'react';
import { Pressable, ScrollView, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';

export default function AccountScreen() {
  const { t, lang, toggle, isRTL } = useLang();
  const insets = useSafeAreaInsets();
  // ponytail: visual-only for now — a real dark theme needs a second token
  // set threaded through every component; add when the design system grows one.
  const [nightMode, setNightMode] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingTop: insets.top + space.lg, paddingHorizontal: space.lg, paddingBottom: space.xxxl }}>
      <AppText variant="display" style={{ marginBottom: space.xl }}>
        {t('account.title')}
      </AppText>

      <Section title={t('account.sectionAccount')}>
        <Item icon="person-outline" label={t('account.profile')} />
        <Item icon="receipt-outline" label={t('account.myOrders')} />
        <Item icon="person-add-outline" label={t('account.inviteFriends')} />
      </Section>

      <Section title={t('account.sectionPrefs')}>
        <Item icon="language-outline" label={t('account.language')} onPress={toggle} value={lang === 'ar' ? 'العربية' : 'English'} />
        <Row style={{ alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.md }}>
          <Row style={{ alignItems: 'center', gap: space.md }}>
            <Ionicons name="moon-outline" size={18} color={colors.textMuted} />
            <AppText variant="body">{t('account.nightMode')}</AppText>
          </Row>
          <Switch value={nightMode} onValueChange={setNightMode} trackColor={{ true: colors.brand, false: colors.border }} />
        </Row>
      </Section>

      <Section title={t('account.sectionSupport')}>
        <Item icon="call-outline" label={t('account.contactUs')} />
        <Item icon="link-outline" label={t('account.connectWithUs')} />
        <Item icon="heart-outline" label={t('account.rateApp')} />
      </Section>

      <AppText variant="label" color={colors.textMuted} align="center" style={{ marginTop: space.xl }}>
        {t('account.devInfo')}
      </AppText>
    </ScrollView>
  );

  function Item({ icon, label, onPress, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void; value?: string }) {
    return (
      <Pressable onPress={onPress}>
        <Row style={{ alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.md }}>
          <Row style={{ alignItems: 'center', gap: space.md }}>
            <Ionicons name={icon} size={18} color={colors.textMuted} />
            <AppText variant="body">{label}</AppText>
          </Row>
          <Row style={{ alignItems: 'center', gap: space.xs }}>
            {value ? (
              <AppText variant="muted" style={{ fontSize: 13 }}>
                {value}
              </AppText>
            ) : null}
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={colors.textMuted} />
          </Row>
        </Row>
      </Pressable>
    );
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: space.xl }}>
      <AppText variant="label" color={colors.gold} style={{ marginBottom: space.sm }}>
        {title}
      </AppText>
      <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: space.lg }}>
        {React.Children.map(children, (child, i) => (
          <View style={{ borderBottomWidth: i < React.Children.count(children) - 1 ? 1 : 0, borderBottomColor: colors.border }}>{child}</View>
        ))}
      </View>
    </View>
  );
}
