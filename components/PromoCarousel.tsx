import React, { useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

import { AppText } from './AppText';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import type { Promo } from '@/lib/mock-data';

const AUTO_ADVANCE_MS = 4500;
const SIDE_PADDING = space.lg;
const SLIDE_HEIGHT = 210;

// ponytail: scroll mechanics stay LTR-order regardless of app language —
// mirroring drag direction + index math for RTL is a real rabbit hole for a
// promo strip that carries no directional text meaning. Everything else in
// the app still mirrors; this one component doesn't.
export function PromoCarousel({ slides }: { slides: Promo[] }) {
  const { width } = useWindowDimensions();
  const slideWidth = width - SIDE_PADDING * 2;
  const { lang, isRTL } = useLang();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % slides.length;
      scrollRef.current?.scrollTo({ x: next * (slideWidth + space.sm), animated: true });
      indexRef.current = next;
      setIndex(next);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slideWidth, slides.length]);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / (slideWidth + space.sm));
    indexRef.current = next;
    setIndex(next);
  };

  return (
    <View style={{ marginBottom: space.xl }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={slideWidth + space.sm}
        contentContainerStyle={{ paddingHorizontal: SIDE_PADDING, gap: space.sm }}
        onMomentumScrollEnd={onMomentumEnd}>
        {slides.map((promo) => (
          <Pressable
            key={promo.id}
            onPress={() => router.push(promo.href as Href)}
            style={{
              width: slideWidth,
              height: SLIDE_HEIGHT,
              borderRadius: radius.xl,
              overflow: 'hidden',
              backgroundColor: colors.brand,
            }}>
            {promo.image ? (
              <Image source={promo.image} style={{ position: 'absolute', inset: 0 }} contentFit="cover" transition={150} />
            ) : null}
            {/* Dark scrim so white text stays legible over any photo — heavier at the
                bottom where the title/CTA sit, present even without a photo yet so the
                badge/title read the same once one is dropped in. */}
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.75)']}
              locations={[0, 0.45, 1]}
              style={{ position: 'absolute', inset: 0 }}
            />
            <View style={{ flex: 1, padding: space.lg, justifyContent: 'space-between' }}>
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'rgba(255,255,255,0.22)',
                  borderRadius: radius.pill,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}>
                <AppText variant="label" color={colors.white}>
                  {lang === 'ar' ? promo.badgeAr : promo.badgeEn}
                </AppText>
              </View>

              <View style={{ gap: 10 }}>
                <AppText variant="h2" color={colors.white} style={{ maxWidth: '85%' }}>
                  {lang === 'ar' ? promo.titleAr : promo.titleEn}
                </AppText>
                <View
                  style={{
                    alignSelf: 'flex-start',
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: 'rgba(255,255,255,0.16)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.4)',
                    borderRadius: radius.pill,
                    paddingVertical: 7,
                    paddingHorizontal: 14,
                  }}>
                  <AppText variant="bodySemiBold" color={colors.white} style={{ fontSize: 13 }}>
                    {lang === 'ar' ? promo.ctaAr : promo.ctaEn}
                  </AppText>
                  <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={13} color={colors.white} />
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: space.md }}>
        {slides.map((s, i) => (
          <View
            key={s.id}
            style={{
              width: i === index ? 18 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: i === index ? colors.brand : colors.border,
            }}
          />
        ))}
      </View>
    </View>
  );
}
