import React from 'react';
import { Alert, Linking, Pressable, ScrollView, Share, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useThemeMode } from '@/lib/theme-mode';
import { useTabBarInset } from '@/lib/useTabBarInset';
import { useAuth } from '@/lib/auth-store';
import { confirmAction } from '@/lib/confirm';

const BRANCH_PHONE = '+962 6 560 0000';
const WEBSITE = 'https://alameedcoffee.com';

export default function AccountScreen() {
  const { t, lang, toggle, isRTL } = useLang();
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const router = useRouter();
  const { isDark, toggle: toggleDark } = useThemeMode();
  const auth = useAuth();

  const signOut = () => {
    confirmAction(t('account.signOut'), t('account.signOutConfirm'), t('account.signOut'), () => auth.signOut(), lang === 'ar' ? 'إغلاق' : 'Cancel', true);
  };

  const invite = () => {
    Share.share({
      message:
        lang === 'ar'
          ? 'حمّل تطبيق بن العميد واستخدم كودي عشان تكسب نقاط: AMEED-HZ20'
          : 'Download the Al Ameed Coffee app and use my code to earn points: AMEED-HZ20',
    }).catch(() => {});
  };

  const contactUs = () => {
    confirmAction(t('account.contactUs'), BRANCH_PHONE, t('branchDetail.call'), () => Linking.openURL(`tel:${BRANCH_PHONE}`), lang === 'ar' ? 'إغلاق' : 'Close');
  };

  const rateApp = () => {
    Alert.alert(t('account.rateApp'), lang === 'ar' ? 'شكرًا إلك! 🧡' : 'Thank you! 🧡');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingTop: insets.top + space.lg, paddingHorizontal: space.lg, paddingBottom: space.xxxl + tabBarInset }}>
      <AppText variant="display" style={{ marginBottom: space.xl }}>
        {t('account.title')}
      </AppText>

      <Section title={t('account.sectionAccount')}>
        <Item icon="person-outline" label={t('account.profile')} onPress={() => router.push('/profile')} />
        <Item icon="location-outline" label={t('account.branches')} onPress={() => router.push('/branches')} />
        <Item icon="receipt-outline" label={t('account.myOrders')} onPress={() => router.push('/orders')} />
        <Item icon="person-add-outline" label={t('account.inviteFriends')} onPress={invite} />
      </Section>

      <Section title={t('account.sectionPrefs')}>
        <Item icon="language-outline" label={t('account.language')} onPress={toggle} value={lang === 'ar' ? 'العربية' : 'English'} />
        <Row style={{ alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.md }}>
          <Row style={{ alignItems: 'center', gap: space.md }}>
            <Ionicons name="moon-outline" size={18} color={colors.textMuted} />
            <AppText variant="body">{t('account.nightMode')}</AppText>
          </Row>
          <Switch value={isDark} onValueChange={toggleDark} trackColor={{ true: colors.brand, false: colors.border }} />
        </Row>
      </Section>

      <Section title={t('account.sectionSupport')}>
        <Item icon="call-outline" label={t('account.contactUs')} onPress={contactUs} />
        <Item icon="link-outline" label={t('account.connectWithUs')} onPress={() => Linking.openURL(WEBSITE)} />
        <Item icon="heart-outline" label={t('account.rateApp')} onPress={rateApp} />
      </Section>

      <Section title={t('account.sectionLegal')}>
        <Item icon="document-text-outline" label={t('account.terms')} onPress={() => router.push('/legal/terms')} />
        <Item icon="shield-checkmark-outline" label={t('account.privacy')} onPress={() => router.push('/legal/privacy')} />
      </Section>

      <Section title={t('account.sectionSession')}>
        <Item icon="log-out-outline" label={t('account.signOut')} onPress={signOut} />
        <Pressable onPress={() => router.push('/account/delete')}>
          <Row style={{ alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.md }}>
            <Row style={{ alignItems: 'center', gap: space.md }}>
              <Ionicons name="trash-outline" size={18} color={colors.critical} />
              <AppText variant="body" color={colors.critical}>
                {t('account.deleteAccount')}
              </AppText>
            </Row>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={colors.critical} />
          </Row>
        </Pressable>
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
            {value ? <AppText variant="muted">{value}</AppText> : null}
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
