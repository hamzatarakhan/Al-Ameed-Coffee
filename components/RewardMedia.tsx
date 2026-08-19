import React from 'react';
import { ImageSourcePropType, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { AppText } from './AppText';
import { colors } from '@/lib/theme';

interface Props {
  image?: ImageSourcePropType;
  emoji: string;
  emojiSize?: number;
  style?: ViewStyle;
}

// Shared image-or-emoji fallback for reward art (list thumbnails, detail
// hero) — same pattern as PromoCarousel.image, see the comment on
// Reward.image in lib/mock-data.ts for how to swap in a real photo.
export function RewardMedia({ image, emoji, emojiSize = 30, style }: Props) {
  return (
    <View style={[{ backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, style]}>
      {image ? (
        <Image source={image} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={150} />
      ) : (
        <AppText style={{ fontSize: emojiSize, lineHeight: emojiSize * 1.15 }}>{emoji}</AppText>
      )}
    </View>
  );
}
