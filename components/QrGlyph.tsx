import React from 'react';
import { View } from 'react-native';
import { colors } from '@/lib/theme';

// ponytail: a drawn placeholder pattern instead of a real QR-encoding
// library — this is a UX demo, not a functioning scanner integration.
// Swap in react-native-qrcode-svg (or similar) when there's a real payload to encode.
export function QrGlyph({ size = 140 }: { size?: number }) {
  const cells = Array.from({ length: 25 }, (_, i) => (i * 7) % 5 < 2);
  return (
    <View style={{ width: size, height: size, flexDirection: 'row', flexWrap: 'wrap' }}>
      {cells.map((filled, i) => (
        <View key={i} style={{ width: '20%', height: '20%', padding: 2 }}>
          <View style={{ flex: 1, backgroundColor: filled ? colors.text : 'transparent', borderRadius: 2 }} />
        </View>
      ))}
    </View>
  );
}
