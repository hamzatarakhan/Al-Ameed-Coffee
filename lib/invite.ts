import { Share } from 'react-native';
import { brand } from './brand';

export function shareInvite(lang: 'ar' | 'en') {
  return Share.share({
    message:
      lang === 'ar'
        ? `حمّل تطبيق ${brand.nameAr} واستخدم كودي عشان تكسب نقاط: AMEED-HZ20`
        : `Download the ${brand.nameEn} app and use my code to earn points: AMEED-HZ20`,
  }).catch(() => {});
}
