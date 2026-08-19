export type Reward = {
  id: string;
  nameAr: string;
  nameEn: string;
  cost: number;
  descAr: string;
  descEn: string;
  emoji: string;
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
  },
  {
    id: 'backpack',
    nameAr: 'حقيبة الظهر',
    nameEn: 'Drawstring Backpack',
    cost: 425,
    descAr: 'حقيبة ظهر رياضية خفيفة، قماش مقاوم للماء، مقاس واحد يناسب الجميع.',
    descEn: 'Lightweight sports backpack, water-resistant fabric, one size fits all.',
    emoji: '🎒',
  },
  {
    id: 'mug',
    nameAr: 'كوب سيراميك',
    nameEn: 'Ceramic Mug',
    cost: 180,
    descAr: 'كوب سيراميك سعة 350 مل بلوجو بن العميد، آمن للفرن المايكروويف وغسالة الصحون.',
    descEn: '350ml ceramic mug with the Al Ameed logo, microwave and dishwasher safe.',
    emoji: '🍵',
  },
  {
    id: 'beans',
    nameAr: 'كيس بن مطحون 500غ',
    nameEn: 'Ground Coffee 500g',
    cost: 90,
    descAr: 'كيس بن عربيكا 100% مطحون طازج، وزن 500 غرام.',
    descEn: '100% Arabica, freshly ground, 500g bag.',
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

export const transactions: Transaction[] = [
  { id: 'reg-gift', labelAr: 'هدية التسجيل', labelEn: 'Registration Gift', points: 20, date: '2026-07-13' },
];

export const userPoints = 20;

export type Notification = {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  date: string;
  read: boolean;
};

// Seeded empty on purpose — the audit's fix for the old "big blank void
// below one item" bug is a real EmptyState, so the demo shows that state.
export const notifications: Notification[] = [];
