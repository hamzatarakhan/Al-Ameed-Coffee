import React, { useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { useRouter, Href } from 'expo-router';

import { AppText } from './AppText';
import { colors, radius, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import type { Promo } from '@/lib/mock-data';

const AUTO_ADVANCE_MS = 4500;
const SIDE_PADDING = space.lg;

// ponytail: scroll mechanics stay LTR-order regardless of app language —
// mirroring drag direction + index math for RTL is a real rabbit hole for a
// promo strip that carries no directional text meaning. Everything else in
// the app still mirrors; this one component doesn't.
export function PromoCarousel({ slides }: { slides: Promo[] }) {
  const { width } = useWindowDimensions();
  const slideWidth = width - SIDE_PADDING * 2;
  const { lang } = useLang();
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
              backgroundColor: colors.brand,
              borderRadius: radius.xl,
              padding: space.xl,
              overflow: 'hidden',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{ flex: 1, gap: space.md }}>
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  borderRadius: radius.pill,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}>
                <AppText variant="label" color={colors.white}>
                  {lang === 'ar' ? promo.badgeAr : promo.badgeEn}
                </AppText>
              </View>
              <AppText variant="h2" color={colors.white}>
                {lang === 'ar' ? promo.titleAr : promo.titleEn}
              </AppText>
              <View style={{ alignSelf: 'flex-start', backgroundColor: colors.white, borderRadius: radius.sm, paddingHorizontal: space.lg, paddingVertical: space.sm }}>
                <AppText variant="bodySemiBold" color={colors.brand}>
                  {lang === 'ar' ? promo.ctaAr : promo.ctaEn}
                </AppText>
              </View>
            </View>
            <AppText style={{ fontSize: 56, lineHeight: 64, opacity: 0.9 }}>{promo.emoji}</AppText>
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
