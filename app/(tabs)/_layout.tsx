import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/haptic-tab';
import { colors, fonts } from '@/lib/theme';
import { useLang } from '@/lib/i18n';

export default function TabLayout() {
  const { t } = useLang();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fonts.mono, fontSize: 10 },
        // single source of truth for tab order — flipping it per-language
        // would fight the OS's own RTL layout mirroring, so tab order stays fixed.
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: t('tabs.home'), tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="order"
        options={{ title: t('tabs.order'), tabBarIcon: ({ color, size }) => <Ionicons name="bag-handle" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="checkin"
        options={{ title: t('tabs.checkin'), tabBarIcon: ({ color, size }) => <Ionicons name="qr-code" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="rewards"
        options={{ title: t('tabs.rewards'), tabBarIcon: ({ color, size }) => <Ionicons name="gift" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="account"
        options={{ title: t('tabs.account'), tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" size={size} color={color} /> }}
      />
    </Tabs>
  );
}
