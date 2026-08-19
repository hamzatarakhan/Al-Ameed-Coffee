import React from 'react';
import { View, ViewProps } from 'react-native';
import { useLang } from '@/lib/i18n';

// RTL-aware flex row — flips direction based on active language instead of
// relying on I18nManager (see lib/i18n.tsx for why).
export function Row({ style, ...rest }: ViewProps) {
  const { isRTL } = useLang();
  return <View {...rest} style={[{ flexDirection: isRTL ? 'row-reverse' : 'row' }, style]} />;
}
