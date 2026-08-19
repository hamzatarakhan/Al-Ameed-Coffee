import type { ImageSourcePropType } from 'react-native';

export type Promo = {
  id: string;
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  ctaAr: string;
  ctaEn: string;
  emoji: string;
  href: string;
  // Local require()'d photo — optional so the app keeps building before the
  // asset exists. Add `image: require('../assets/images/promo-x.jpg')` once
  // the real photo is dropped in; every consumer already falls back cleanly
  // to the emoji/gradient look when this is undefined.
  image?: ImageSourcePropType;
};

export const promos: Promo[] = [
  {
    id: 'cappuccino',
    badgeAr: 'جديد',
    badgeEn: 'NEW',
    titleAr: 'كابتشينو العميد الجديد وصل',
    titleEn: 'New Al Ameed Cappuccino is here',
    ctaAr: 'جرّبه',
    ctaEn: 'Try it',
    emoji: '☕',
    href: '/rewards',
  },
  {
    id: 'checkin-bonus',
    badgeAr: 'هالأسبوع',
    badgeEn: 'THIS WEEK',
    titleAr: 'سجّل حضورك واكسب ضعف النقاط',
    titleEn: 'Check in this week for double points',
    ctaAr: 'سجّل الآن',
    ctaEn: 'Check in',
    emoji: '⭐',
    href: '/checkin',
  },
  {
    id: 'invite',
    badgeAr: 'هدية',
    badgeEn: 'GIFT',
    titleAr: 'ادعُ صديق واكسبوا 50 نقطة الاثنين',
    titleEn: 'Invite a friend, you both earn 50 points',
    ctaAr: 'ادعُ الآن',
    ctaEn: 'Invite now',
    emoji: '🎁',
    href: '/account',
  },
];

export type Reward = {
  id: string;
  nameAr: string;
  nameEn: string;
  cost: number;
  descAr: string;
  descEn: string;
  emoji: string;
  categoryAr: string;
  categoryEn: string;
  // Same optional-local-photo pattern as Promo.image — see that comment.
  image?: ImageSourcePropType;
};

export const rewards: Reward[] = [
  {
    id: 'coasters',
    nameAr: 'فرشات المشروبات',
    nameEn: 'Beverage Coasters',
    cost: 550,
    descAr: 'طقم 4 قطع فرشات مطاط بنقشة بن العميد، معبأة بعلبة أنيقة.',
    descEn: 'A set of 4 rubber coasters subtly branded with the Al Ameed Coffee pattern, boxed.',
    emoji: '☕',
    categoryAr: 'أدوات قهوة',
    categoryEn: 'Coffeeware',
  },
  {
    id: 'backpack',
    nameAr: 'حقيبة الظهر',
    nameEn: 'Drawstring Backpack',
    cost: 425,
    descAr: 'حقيبة ظهر رياضية خفيفة، قماش مقاوم للماء، مقاس واحد يناسب الجميع.',
    descEn: 'Lightweight sports backpack, water-resistant fabric, one size fits all.',
    emoji: '🎒',
    categoryAr: 'إكسسوارات',
    categoryEn: 'Accessories',
  },
  {
    id: 'mug',
    nameAr: 'كوب سيراميك',
    nameEn: 'Ceramic Mug',
    cost: 180,
    descAr: 'كوب سيراميك سعة 350 مل بلوجو بن العميد، آمن للفرن المايكروويف وغسالة الصحون.',
    descEn: '350ml ceramic mug with the Al Ameed logo, microwave and dishwasher safe.',
    emoji: '🍵',
    categoryAr: 'أدوات قهوة',
    categoryEn: 'Coffeeware',
  },
  {
    id: 'beans',
    nameAr: 'كيس بن مطحون 500غ',
    nameEn: 'Ground Coffee 500g',
    cost: 90,
    descAr: 'كيس بن عربيكا 100% مطحون طازج، وزن 500 غرام.',
    descEn: '100% Arabica, freshly ground, 500g bag.',
    categoryAr: 'بن',
    categoryEn: 'Coffee',
    emoji: '🫘',
  },
];

export type Branch = {
  id: string;
  nameAr: string;
  nameEn: string;
  addressAr: string;
  addressEn: string;
  hoursWeekdaysAr: string;
  hoursWeekdaysEn: string;
  hoursWeekendAr: string;
  hoursWeekendEn: string;
  phone: string;
  openNow: boolean;
};

export const branches: Branch[] = [
  {
    id: 'shmaisani',
    nameAr: 'الشميساني',
    nameEn: 'Shmaisani',
    addressAr: 'شارع الشريف عبد الحميد شرف، الشميساني، عمّان',
    addressEn: 'Al Sharif Abdul Hamid Sharaf St, Shmaisani, Amman',
    hoursWeekdaysAr: 'السبت–الأربعاء 7:00 ص – 12:00 ص',
    hoursWeekdaysEn: 'Sat–Wed 7:00 AM – 12:00 AM',
    hoursWeekendAr: 'الخميس–الجمعة 7:00 ص – 1:00 ص',
    hoursWeekendEn: 'Thu–Fri 7:00 AM – 1:00 AM',
    phone: '+962 6 560 0000',
    openNow: true,
  },
  {
    id: 'alameed-experience',
    nameAr: 'تجربة العميد',
    nameEn: 'AlAmeed Experience',
    addressAr: 'طريق المطار، أم السماق، عمّان',
    addressEn: 'Airport Rd, Um Uthaina, Amman',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 11:00 م',
    hoursWeekdaysEn: 'Daily 8:00 AM – 11:00 PM',
    hoursWeekendAr: 'يوميًا 8:00 ص – 11:00 م',
    hoursWeekendEn: 'Daily 8:00 AM – 11:00 PM',
    phone: '+962 6 560 0001',
    openNow: true,
  },
  {
    id: 'hujra-village',
    nameAr: 'قرية الحجرة',
    nameEn: 'Hujra Village',
    addressAr: 'شارع مكة، الحجرة، عمّان',
    addressEn: 'Mecca St, Hujra, Amman',
    hoursWeekdaysAr: 'يوميًا 7:00 ص – 12:00 ص',
    hoursWeekdaysEn: 'Daily 7:00 AM – 12:00 AM',
    hoursWeekendAr: 'يوميًا 7:00 ص – 1:00 ص',
    hoursWeekendEn: 'Daily 7:00 AM – 1:00 AM',
    phone: '+962 6 560 0002',
    openNow: false,
  },
];

export type Transaction = {
  id: string;
  labelAr: string;
  labelEn: string;
  points: number;
  date: string;
};

// ponytail: generous test data so every list/empty-state combo is easy to
// eyeball — set an array back to [] to see that screen's EmptyState instead.
export const transactions: Transaction[] = [
  { id: 'tx-checkin-5', labelAr: 'تسجيل حضور - فرع الشميساني', labelEn: 'Check-in - Shmaisani branch', points: 10, date: '2026-08-18' },
  { id: 'tx-order-4', labelAr: 'طلب عبر التطبيق', labelEn: 'Order via app', points: 25, date: '2026-08-15' },
  { id: 'tx-invite', labelAr: 'دعوة صديق - سارة أحمد', labelEn: 'Friend invite - Sara Ahmad', points: 50, date: '2026-08-10' },
  { id: 'tx-checkin-4', labelAr: 'تسجيل حضور - تجربة العميد', labelEn: 'Check-in - AlAmeed Experience', points: 10, date: '2026-08-06' },
  { id: 'tx-order-3', labelAr: 'طلب عبر التطبيق', labelEn: 'Order via app', points: 30, date: '2026-08-02' },
  { id: 'tx-redeem-1', labelAr: 'استبدال: كوب سيراميك', labelEn: 'Redeemed: Ceramic Mug', points: -180, date: '2026-07-29' },
  { id: 'tx-checkin-3', labelAr: 'تسجيل حضور - فرع الشميساني', labelEn: 'Check-in - Shmaisani branch', points: 10, date: '2026-07-25' },
  { id: 'tx-order-2', labelAr: 'طلب عبر التطبيق', labelEn: 'Order via app', points: 40, date: '2026-07-20' },
  { id: 'tx-checkin-2', labelAr: 'تسجيل حضور - قرية الحجرة', labelEn: 'Check-in - Hujra Village', points: 10, date: '2026-07-17' },
  { id: 'reg-gift', labelAr: 'هدية التسجيل', labelEn: 'Registration Gift', points: 20, date: '2026-07-13' },
];

export const userPoints = 265;

export type Notification = {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  date: string;
  read: boolean;
};

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    titleAr: 'كابتشينو العميد الجديد وصل',
    titleEn: 'New Al Ameed Cappuccino is here',
    bodyAr: 'جرّبه هلق بأي فرع واكسب نقاط إضافية أول أسبوع.',
    bodyEn: 'Try it now at any branch and earn bonus points this first week.',
    date: '2026-08-18',
    read: false,
  },
  {
    id: 'notif-2',
    titleAr: 'كسبت 10 نقاط',
    titleEn: 'You earned 10 points',
    bodyAr: 'من تسجيل حضورك بفرع الشميساني.',
    bodyEn: 'From checking in at the Shmaisani branch.',
    date: '2026-08-18',
    read: false,
  },
  {
    id: 'notif-3',
    titleAr: 'باقي القليل على هديتك',
    titleEn: 'Almost at your next reward',
    bodyAr: 'باقي 5 نقاط بس عشان تفتح "كيس بن مطحون 500غ".',
    bodyEn: 'Just 5 more points to unlock the 500g Ground Coffee.',
    date: '2026-08-16',
    read: true,
  },
  {
    id: 'notif-4',
    titleAr: 'فرع جديد: تجربة العميد',
    titleEn: 'New branch: AlAmeed Experience',
    bodyAr: 'افتتحنا فرع جديد بأم السماق — زورونا!',
    bodyEn: "We opened a new branch in Um Uthaina — come say hi!",
    date: '2026-08-10',
    read: true,
  },
  {
    id: 'notif-5',
    titleAr: 'هدية التسجيل',
    titleEn: 'Registration Gift',
    bodyAr: 'شكرًا لتحميلك تطبيق بن العميد، ضفنالك 20 نقطة مجانية.',
    bodyEn: 'Thanks for downloading the Al Ameed app — 20 free points added.',
    date: '2026-07-13',
    read: true,
  },
];

export type Redemption = {
  id: string;
  nameAr: string;
  nameEn: string;
  emoji: string;
  ref: string;
  date: string;
};

export const redemptions: Redemption[] = [
  { id: 'r1', nameAr: 'كوب سيراميك', nameEn: 'Ceramic Mug', emoji: '🍵', ref: 'RD-10482', date: '2026-07-29' },
  { id: 'r2', nameAr: 'هدية التسجيل', nameEn: 'Registration Gift', emoji: '🎁', ref: 'RD-10011', date: '2026-07-13' },
];

export type Order = {
  id: string;
  itemsAr: string;
  itemsEn: string;
  itemCount: number;
  branchAr: string;
  branchEn: string;
  price: string;
  date: string;
  statusAr: string;
  statusEn: string;
};

export const orders: Order[] = [
  {
    id: 'o1',
    itemsAr: 'كابتشينو، كرواسون',
    itemsEn: 'Cappuccino, Croissant',
    itemCount: 2,
    branchAr: 'الشميساني',
    branchEn: 'Shmaisani',
    price: '4.50 د.أ',
    date: '2026-08-15',
    statusAr: 'مكتمل',
    statusEn: 'Completed',
  },
  {
    id: 'o2',
    itemsAr: 'قهوة تركية × 2',
    itemsEn: 'Turkish Coffee × 2',
    itemCount: 2,
    branchAr: 'تجربة العميد',
    branchEn: 'AlAmeed Experience',
    price: '3.00 د.أ',
    date: '2026-08-06',
    statusAr: 'مكتمل',
    statusEn: 'Completed',
  },
  {
    id: 'o3',
    itemsAr: 'إسبريسو، مافن شوكولاتة',
    itemsEn: 'Espresso, Chocolate Muffin',
    itemCount: 2,
    branchAr: 'قرية الحجرة',
    branchEn: 'Hujra Village',
    price: '3.75 د.أ',
    date: '2026-07-20',
    statusAr: 'مكتمل',
    statusEn: 'Completed',
  },
];

export const profile = {
  nameAr: 'حمزة طرقان',
  nameEn: 'Hamza Tarkan',
  phone: '+962 79 000 0000',
  email: 'hamza@example.com',
  memberSince: '2026-07-13',
  referralCode: 'AMEED-HZ20',
};
