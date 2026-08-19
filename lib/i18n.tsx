import React, { createContext, useContext, useMemo, useState } from 'react';

export type Lang = 'ar' | 'en';

// ponytail: manual mirroring (isRTL flag read by components) instead of
// I18nManager.forceRTL + app reload. Real forceRTL is the correct approach for
// a shipped app (per the requirements doc), but it needs a native reload to
// take effect, which breaks live-toggling in a single running instance.
// Upgrade path: swap this flag for I18nManager.forceRTL + expo-updates reload
// when the language switch no longer needs to be instant/in-place.
const dict = {
  common: {
    back: { ar: 'رجوع', en: 'Back' },
    seeAll: { ar: 'عرض الكل', en: 'See all' },
    points: { ar: 'نقطة', en: 'points' },
  },
  tabs: {
    home: { ar: 'الهوم', en: 'Home' },
    order: { ar: 'اطلب', en: 'Order' },
    checkin: { ar: 'Check In', en: 'Check In' },
    rewards: { ar: 'الهدايا', en: 'Rewards' },
    account: { ar: 'حسابي', en: 'Account' },
  },
  home: {
    question: { ar: 'شو حابب تطلب اليوم؟', en: 'What would you like today?' },
    yourPoints: { ar: 'رصيد نقاطك', en: 'Your points' },
    quickOrder: { ar: 'اطلب الآن', en: 'Order Now' },
    quickPoints: { ar: 'نقاطي', en: 'My Points' },
    quickRedeemed: { ar: 'المستبدلة', en: 'Redeemed' },
    quickRewards: { ar: 'الهدايا', en: 'Rewards' },
    popular: { ar: 'أشهر الهدايا', en: 'Popular Rewards' },
  },
  rewards: {
    title: { ar: 'معرض الهدايا', en: 'Rewards Gallery' },
    sortAffordable: { ar: 'المتاح أولًا', en: 'Affordable first' },
    sortCost: { ar: 'حسب التكلفة', en: 'By cost' },
    pointsToGo: { ar: 'باقي {n} نقطة', en: '{n} points to go' },
    empty: { ar: 'ما في هدايا متاحة هلق', en: 'No rewards available right now' },
  },
  rewardDetail: {
    fulfillment: { ar: 'التسليم خلال 3–5 أيام', en: 'Delivered in 3–5 days' },
    quantity: { ar: 'الكمية', en: 'Quantity' },
    redeem: { ar: 'استبدال', en: 'Redeem' },
    locked: { ar: 'نقاط غير كافية', en: 'Not enough points' },
    successTitle: { ar: 'تم الاستبدال', en: 'Redeemed' },
    successBody: { ar: 'راجع "الهدايا المستبدلة" للتفاصيل', en: 'Check Redeemed Rewards for details' },
    done: { ar: 'تم', en: 'Done' },
  },
  redeemed: {
    title: { ar: 'الهدايا المستبدلة', en: 'Redeemed Rewards' },
    empty: { ar: 'لسا ما استبدلت شي', en: "You haven't redeemed anything yet" },
    emptyBody: { ar: 'تصفح معرض الهدايا وابدأ تجمع نقاط', en: 'Browse the rewards gallery and start earning' },
    ref: { ar: 'مرجع', en: 'Ref' },
  },
  points: {
    title: { ar: 'نقاطي', en: 'My Points' },
    balance: { ar: 'الرصيد الحالي', en: 'Current balance' },
    nextReward: { ar: 'أقرب هدية: {name}', en: 'Next reward: {name}' },
    howToEarn: { ar: 'كيف تكسب نقاط', en: 'How to earn points' },
    earnCheckin: { ar: 'سجّل حضورك بأي فرع', en: 'Check in at any branch' },
    earnOrder: { ar: 'اطلب من التطبيق', en: 'Order through the app' },
    earnInvite: { ar: 'ادعُ أصدقاءك', en: 'Invite friends' },
    redeemedStat: { ar: 'مستبدلة', en: 'Redeemed' },
    visitsStat: { ar: 'زيارات', en: 'Visits' },
    expiredStat: { ar: 'منتهية', en: 'Expired' },
    history: { ar: 'سجل المعاملات', en: 'Transaction history' },
    emptyHistory: { ar: 'ما في معاملات بعد', en: 'No transactions yet' },
  },
  branches: {
    title: { ar: 'الفروع', en: 'Branches' },
    openNow: { ar: 'مفتوح الآن', en: 'Open now' },
    closed: { ar: 'مغلق', en: 'Closed' },
    distanceUnknown: { ar: 'فعّل الموقع لترتيب الأقرب', en: 'Enable location to sort by distance' },
  },
  branchDetail: {
    address: { ar: 'العنوان', en: 'Address' },
    hours: { ar: 'ساعات العمل', en: 'Working hours' },
    mapPreview: { ar: 'معاينة الخريطة', en: 'Map preview' },
    location: { ar: 'الموقع', en: 'Location' },
    call: { ar: 'اتصل بنا', en: 'Call us' },
  },
  order: {
    title: { ar: 'اطلب الآن', en: 'Order Now' },
    pickup: { ar: 'استلام من الفرع', en: 'Pick Up' },
    delivery: { ar: 'توصيل', en: 'Delivery' },
    errorTitle: { ar: 'ما في فرع قريب', en: 'No branch nearby' },
    errorBody: { ar: 'أقرب فرع إلك هو الشميساني', en: 'Your nearest branch is Shmaisani' },
    viewBranch: { ar: 'عرض هالفرع', en: 'View this branch' },
    seeAllBranches: { ar: 'شوف كل الفروع', en: 'See all branches' },
  },
  checkin: {
    title: { ar: 'Check In', en: 'Check In' },
    instruction: { ar: 'وريّ الكود للكاشير لتجمع نقاطك', en: 'Show this code to the cashier to collect points' },
    scanned: { ar: 'تم!', en: 'Done!' },
    earned: { ar: 'كسبت {n} نقطة', en: 'You earned {n} points' },
    simulate: { ar: 'محاكاة المسح (تجريبي)', en: 'Simulate scan (demo)' },
    reset: { ar: 'إعادة', en: 'Reset' },
  },
  notifications: {
    title: { ar: 'الإشعارات', en: 'Notifications' },
    readAll: { ar: 'قراءة الكل', en: 'Read All' },
    empty: { ar: 'كلك مطلع على كل شي', en: "You're all caught up" },
    emptyBody: { ar: 'رح نعلمك هون لما يصير في شي جديد', en: "We'll let you know when something new happens" },
  },
  account: {
    title: { ar: 'حسابي', en: 'Account' },
    sectionAccount: { ar: 'الحساب', en: 'Account' },
    profile: { ar: 'ملفي الشخصي', en: 'My Profile' },
    branches: { ar: 'الفروع', en: 'Branches' },
    myOrders: { ar: 'طلباتي', en: 'My Orders' },
    inviteFriends: { ar: 'دعوة أصدقاء', en: 'Invite Friends' },
    sectionPrefs: { ar: 'الإعدادات', en: 'Preferences' },
    language: { ar: 'اللغة', en: 'Language' },
    nightMode: { ar: 'الوضع الليلي', en: 'Night Mode' },
    sectionSupport: { ar: 'الدعم', en: 'Support' },
    contactUs: { ar: 'تواصل معنا', en: 'Contact Us' },
    connectWithUs: { ar: 'تابعنا', en: 'Connect With Us' },
    rateApp: { ar: 'قيّم التطبيق', en: 'Rate Our App' },
    devInfo: { ar: 'الإصدار 1.0.0 · Al Ameed Coffee', en: 'Version 1.0.0 · Al Ameed Coffee' },
  },
  profile: {
    title: { ar: 'ملفي الشخصي', en: 'My Profile' },
    memberSince: { ar: 'عضو منذ {date}', en: 'Member since {date}' },
    name: { ar: 'الاسم', en: 'Name' },
    phone: { ar: 'رقم الهاتف', en: 'Phone number' },
    email: { ar: 'البريد الإلكتروني', en: 'Email' },
    referralCode: { ar: 'كود الدعوة', en: 'Referral code' },
  },
  orders: {
    title: { ar: 'طلباتي', en: 'My Orders' },
    empty: { ar: 'لسا ما طلبت شي', en: "You haven't ordered yet" },
    emptyBody: { ar: 'أول طلب إلك رح يبان هون', en: 'Your first order will show up here' },
    itemsCount: { ar: '{n} أصناف', en: '{n} items' },
  },
} as const;

type Dict = typeof dict;
type SectionKey = keyof Dict;
type Keypath = { [S in SectionKey]: `${S}.${Extract<keyof Dict[S], string>}` }[SectionKey];

interface LanguageContextValue {
  lang: Lang;
  isRTL: boolean;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: Keypath, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ar');

  const value = useMemo<LanguageContextValue>(() => {
    const t: LanguageContextValue['t'] = (key, vars) => {
      const [section, item] = key.split('.') as [SectionKey, string];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const entry = (dict[section] as any)[item] as { ar: string; en: string } | undefined;
      let str = entry ? entry[lang] : key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) str = str.replace(`{${k}}`, String(v));
      }
      return str;
    };
    return { lang, isRTL: lang === 'ar', setLang, toggle: () => setLang((l) => (l === 'ar' ? 'en' : 'ar')), t };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
