import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from './AppText';
import { colors } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { useOrderCart } from '@/lib/order-cart';

// So the count is visible while still picking items, without leaving the
// menu — tapping jumps straight to the cart review.
export function CartButton({ color = colors.text }: { color?: string }) {
  const router = useRouter();
  const { isRTL } = useLang();
  const { totalCount } = useOrderCart();

  return (
    <Pressable onPress={() => router.push('/order-cart')} hitSlop={10}>
      <View>
        <Ionicons name="cart-outline" size={24} color={color} />
        {totalCount > 0 ? (
          <View
            style={{
              position: 'absolute',
              top: -6,
              [isRTL ? 'left' : 'right']: -6,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              paddingHorizontal: 3,
              backgroundColor: colors.brand,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: colors.surface,
            }}>
            <AppText variant="label" color={colors.white} style={{ fontSize: 9, lineHeight: 11, letterSpacing: 0 }}>
              {totalCount}
            </AppText>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
