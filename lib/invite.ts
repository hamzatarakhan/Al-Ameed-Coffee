import { Share } from 'react-native';

export function shareInvite(lang: 'ar' | 'en') {
  return Share.share({
    message:
      lang === 'ar'
        ? 'حمّل تطبيق بن العميد واستخدم كودي عشان تكسب نقاط: AMEED-HZ20'
        : 'Download the Al Ameed Coffee app and use my code to earn points: AMEED-HZ20',
  }).catch(() => {});
}
