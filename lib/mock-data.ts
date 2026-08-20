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
    image: require('../assets/images/slide-3.jpg'),
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
    image: require('../assets/images/slide-1.jpg'),
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
    image: require('../assets/images/slide-2.jpg'),
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
    image: require('../assets/images/reward-mug.jpg'),
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
    image: require('../assets/images/reward-beans.jpg'),
  },
];

export type MenuCategory = { id: string; nameAr: string; nameEn: string };

export type MenuItem = {
  id: string;
  category: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  price: number; // JOD
  image?: ImageSourcePropType;
};

export const menuCategories: MenuCategory[] = [
  { id: 'hot', nameAr: 'مشروبات ساخنة', nameEn: 'Hot Drinks' },
  { id: 'cold', nameAr: 'مشروبات باردة', nameEn: 'Cold Drinks' },
  { id: 'food', nameAr: 'مأكولات', nameEn: 'Food' },
  { id: 'beans', nameAr: 'بن وحبوب', nameEn: 'Beans & Grounds' },
];

const menuPhotos = [require('../assets/images/slide-1.jpg'), require('../assets/images/slide-2.jpg'), require('../assets/images/slide-3.jpg')];

export const menuItems: MenuItem[] = [
  {
    id: 'turkish-coffee',
    category: 'hot',
    nameAr: 'قهوة تركية',
    nameEn: 'Turkish Coffee',
    descAr: 'قهوة تركية أصيلة محضّرة على الطريقة التقليدية.',
    descEn: 'Traditionally prepared authentic Turkish coffee.',
    price: 1.5,
    image: menuPhotos[0],
  },
  {
    id: 'cappuccino',
    category: 'hot',
    nameAr: 'كابتشينو العميد',
    nameEn: 'Al Ameed Cappuccino',
    descAr: 'إسبريسو غني مع رغوة حليب كريمية، وصفتنا المميزة.',
    descEn: 'Rich espresso with creamy milk foam, our signature recipe.',
    price: 2.5,
    image: menuPhotos[1],
  },
  {
    id: 'espresso',
    category: 'hot',
    nameAr: 'إسبريسو',
    nameEn: 'Espresso',
    descAr: 'جرعة إسبريسو مركّزة من حبوب عربيكا 100%.',
    descEn: 'A concentrated shot from 100% Arabica beans.',
    price: 2.0,
    image: menuPhotos[2],
  },
  {
    id: 'latte',
    category: 'hot',
    nameAr: 'لاتيه',
    nameEn: 'Latte',
    descAr: 'إسبريسو مع حليب مبخّر ورغوة خفيفة.',
    descEn: 'Espresso with steamed milk and a light foam top.',
    price: 2.75,
    image: menuPhotos[0],
  },
  {
    id: 'iced-latte',
    category: 'cold',
    nameAr: 'آيس لاتيه',
    nameEn: 'Iced Latte',
    descAr: 'لاتيه بارد منعش مع مكعبات ثلج.',
    descEn: 'A refreshing cold latte served over ice.',
    price: 3.0,
    image: menuPhotos[1],
  },
  {
    id: 'cold-brew',
    category: 'cold',
    nameAr: 'كولد برو',
    nameEn: 'Cold Brew',
    descAr: 'قهوة منقوعة ببرودة لساعات طويلة، نكهة ناعمة وقليلة الحموضة.',
    descEn: 'Slow-steeped cold coffee, smooth and low in acidity.',
    price: 3.25,
    image: menuPhotos[2],
  },
  {
    id: 'iced-americano',
    category: 'cold',
    nameAr: 'أيس أمريكانو',
    nameEn: 'Iced Americano',
    descAr: 'إسبريسو مع ماء بارد وثلج.',
    descEn: 'Espresso with cold water over ice.',
    price: 2.5,
    image: menuPhotos[0],
  },
  {
    id: 'croissant',
    category: 'food',
    nameAr: 'كرواسون بالزبدة',
    nameEn: 'Butter Croissant',
    descAr: 'كرواسون فرنسي طازج مقرمش من الخارج وطري من الداخل.',
    descEn: 'Fresh French croissant, crisp outside and soft inside.',
    price: 1.75,
    image: menuPhotos[1],
  },
  {
    id: 'chocolate-cake',
    category: 'food',
    nameAr: 'كيكة الشوكولاتة',
    nameEn: 'Chocolate Cake',
    descAr: 'قطعة كيكة شوكولاتة غنية بطبقة كريمة.',
    descEn: 'A rich slice of chocolate cake with a cream layer.',
    price: 2.5,
    image: menuPhotos[2],
  },
  {
    id: 'ground-coffee-250',
    category: 'beans',
    nameAr: 'بن عربيكا مطحون 250غ',
    nameEn: 'Ground Arabica 250g',
    descAr: 'كيس بن عربيكا 100% مطحون طازج، وزن 250 غرام.',
    descEn: '100% Arabica, freshly ground, 250g bag.',
    price: 4.5,
    image: require('../assets/images/reward-beans.jpg'),
  },
  {
    id: 'roasted-beans-500',
    category: 'beans',
    nameAr: 'حبوب بن محمّص 500غ',
    nameEn: 'Roasted Beans 500g',
    descAr: 'حبوب بن كاملة محمّصة طازجة، وزن 500 غرام.',
    descEn: 'Whole freshly roasted beans, 500g bag.',
    price: 8.0,
    image: require('../assets/images/reward-beans.jpg'),
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
  image?: ImageSourcePropType;
};

// A handful of real Al Ameed-branded photos, cycled across branches — we
// don't have a distinct storefront photo per location, so this is
// representative imagery rather than a claim about that specific branch.
const branchPhotos = [require('../assets/images/slide-1.jpg'), require('../assets/images/slide-2.jpg'), require('../assets/images/slide-3.jpg')];

// Real branches, cities, and phone numbers — sourced from Al Ameed Coffee's
// own branch listing (alameedcoffee.com/branches) and contact page. Street-
// level addresses aren't published there, so the address is the branch's
// own neighborhood/area name (which is how the source itself identifies
// each location) rather than an invented street number.
export const branches: Branch[] = [
  {
    id: 'shmaisani',
    nameAr: 'الشميساني',
    nameEn: 'Shmeisani',
    addressAr: 'الشميساني، عمّان',
    addressEn: 'Shmeisani, Amman',
    hoursWeekdaysAr: 'يوميًا 7:00 ص – 11:30 م',
    hoursWeekdaysEn: 'Daily 7:00 AM – 11:30 PM',
    hoursWeekendAr: 'الجمعة 7:00 ص – 12:00 ص',
    hoursWeekendEn: 'Fri 7:00 AM – 12:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[0],
  },
  {
    id: 'alameed-experience',
    nameAr: 'تجربة العميد',
    nameEn: 'Al Ameed Experience',
    addressAr: 'عمّان',
    addressEn: 'Amman',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 1:00 ص',
    hoursWeekdaysEn: 'Daily 8:00 AM – 1:00 AM',
    hoursWeekendAr: 'يوميًا 8:00 ص – 1:00 ص',
    hoursWeekendEn: 'Daily 8:00 AM – 1:00 AM',
    phone: '+962 6 579 9575',
    openNow: true,
    image: branchPhotos[1],
  },
  {
    id: 'hujra-village',
    nameAr: 'قرية الحجرة',
    nameEn: 'Al Hajra Village',
    addressAr: 'الحجرة، عمّان',
    addressEn: 'Al Hajra, Amman',
    hoursWeekdaysAr: 'يوميًا 7:00 ص – 12:00 ص',
    hoursWeekdaysEn: 'Daily 7:00 AM – 12:00 AM',
    hoursWeekendAr: 'يوميًا 7:00 ص – 12:00 ص',
    hoursWeekendEn: 'Daily 7:00 AM – 12:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[2],
  },
  {
    id: 'khilda',
    nameAr: 'خلدا',
    nameEn: 'Khilda',
    addressAr: 'خلدا، عمّان',
    addressEn: 'Khilda, Amman',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 11:00 م',
    hoursWeekdaysEn: 'Daily 8:00 AM – 11:00 PM',
    hoursWeekendAr: 'الجمعة 9:00 ص – 11:00 م',
    hoursWeekendEn: 'Fri 9:00 AM – 11:00 PM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[0],
  },
  {
    id: 'city-mall',
    nameAr: 'سيتي مول',
    nameEn: 'City Mall',
    addressAr: 'سيتي مول، عمّان',
    addressEn: 'City Mall, Amman',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekdaysEn: 'Daily 8:00 AM – 12:00 AM',
    hoursWeekendAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekendEn: 'Daily 8:00 AM – 12:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[1],
  },
  {
    id: 'zarqa',
    nameAr: 'الزرقاء',
    nameEn: 'Al Zarqa',
    addressAr: 'الزرقاء',
    addressEn: 'Zarqa',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 11:00 م',
    hoursWeekdaysEn: 'Daily 8:00 AM – 11:00 PM',
    hoursWeekendAr: 'الخميس–الجمعة درايف ثرو 8:00 ص – 12:00 ص',
    hoursWeekendEn: 'Thu–Fri drive-thru 8:00 AM – 12:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[2],
  },
  {
    id: 'irbid',
    nameAr: 'إربد',
    nameEn: 'Irbid',
    addressAr: 'إربد',
    addressEn: 'Irbid',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 11:00 م',
    hoursWeekdaysEn: 'Daily 8:00 AM – 11:00 PM',
    hoursWeekendAr: 'الخميس–الجمعة 8:00 ص – 12:00 ص',
    hoursWeekendEn: 'Thu–Fri 8:00 AM – 12:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[0],
  },
  {
    id: 'aqaba',
    nameAr: 'العقبة',
    nameEn: 'Aqaba',
    addressAr: 'العقبة',
    addressEn: 'Aqaba',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekdaysEn: 'Daily 8:00 AM – 12:00 AM',
    hoursWeekendAr: 'الخميس–الجمعة 8:00 ص – 1:00 ص',
    hoursWeekendEn: 'Thu–Fri 8:00 AM – 1:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[1],
  },
  {
    id: 'madaba',
    nameAr: 'مادبا',
    nameEn: 'Madaba',
    addressAr: 'مادبا',
    addressEn: 'Madaba',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 11:00 م',
    hoursWeekdaysEn: 'Daily 8:00 AM – 11:00 PM',
    hoursWeekendAr: 'يوميًا 8:00 ص – 11:00 م',
    hoursWeekendEn: 'Daily 8:00 AM – 11:00 PM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[2],
  },
  {
    id: 'airport',
    nameAr: 'مطار الملكة علياء الدولي',
    nameEn: 'Queen Alia International Airport',
    addressAr: 'الزيزياء',
    addressEn: 'Zizya',
    hoursWeekdaysAr: 'مفتوح ٢٤ ساعة',
    hoursWeekdaysEn: 'Open 24 hours',
    hoursWeekendAr: 'مفتوح ٢٤ ساعة',
    hoursWeekendEn: 'Open 24 hours',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[0],
  },
  {
    id: 'gardens',
    nameAr: 'الجاردنز',
    nameEn: 'Gardens',
    addressAr: 'الجاردنز، عمّان',
    addressEn: 'Gardens St, Amman',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 11:00 م',
    hoursWeekdaysEn: 'Daily 8:00 AM – 11:00 PM',
    hoursWeekendAr: 'الجمعة 9:00 ص – 11:00 م',
    hoursWeekendEn: 'Fri 9:00 AM – 11:00 PM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[1],
  },
  {
    id: 'swefieh',
    nameAr: 'الصويفية',
    nameEn: 'Swefieh',
    addressAr: 'الصويفية، عمّان',
    addressEn: 'Swefieh, Amman',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 11:00 م',
    hoursWeekdaysEn: 'Daily 8:00 AM – 11:00 PM',
    hoursWeekendAr: 'يوميًا 8:00 ص – 11:00 م',
    hoursWeekendEn: 'Daily 8:00 AM – 11:00 PM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[2],
  },
  {
    id: 'ithaa',
    nameAr: 'شارع الإذاعة',
    nameEn: "Ithaa' St.",
    addressAr: 'شارع الإذاعة، عمّان',
    addressEn: "Ithaa' St, Amman",
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 11:00 م',
    hoursWeekdaysEn: 'Daily 8:00 AM – 11:00 PM',
    hoursWeekendAr: 'الجمعة 9:00 ص – 11:00 م',
    hoursWeekendEn: 'Fri 9:00 AM – 11:00 PM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[0],
  },
  {
    id: 'marka',
    nameAr: 'ماركا',
    nameEn: 'Marka',
    addressAr: 'ماركا، عمّان',
    addressEn: 'Marka, Amman',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 11:00 م',
    hoursWeekdaysEn: 'Daily 8:00 AM – 11:00 PM',
    hoursWeekendAr: 'الخميس–الجمعة درايف ثرو 8:00 ص – 12:00 ص',
    hoursWeekendEn: 'Thu–Fri drive-thru 8:00 AM – 12:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[1],
  },
  {
    id: 'jubeiha',
    nameAr: 'الجبيهة',
    nameEn: 'Jubeiha',
    addressAr: 'الجبيهة، عمّان',
    addressEn: 'Jubeiha, Amman',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 11:00 م',
    hoursWeekdaysEn: 'Daily 8:00 AM – 11:00 PM',
    hoursWeekendAr: 'يوميًا 8:00 ص – 11:00 م',
    hoursWeekendEn: 'Daily 8:00 AM – 11:00 PM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[2],
  },
  {
    id: 'sameh-airport-road',
    nameAr: 'سامح مول - طريق المطار',
    nameEn: 'Sameh Mall Airport Road',
    addressAr: 'طريق المطار، عمّان',
    addressEn: 'Airport Road, Amman',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekdaysEn: 'Daily 8:00 AM – 12:00 AM',
    hoursWeekendAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekendEn: 'Daily 8:00 AM – 12:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[0],
  },
  {
    id: 'sameh-tabarbour',
    nameAr: 'سامح مول - طبربور',
    nameEn: 'Sameh Mall Tabarbour',
    addressAr: 'طبربور، عمّان',
    addressEn: 'Tabarbour, Amman',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekdaysEn: 'Daily 8:00 AM – 12:00 AM',
    hoursWeekendAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekendEn: 'Daily 8:00 AM – 12:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[1],
  },
  {
    id: 'ctown-abdali',
    nameAr: 'سي تاون - العبدلي مول',
    nameEn: 'C Town Abdali Mall',
    addressAr: 'العبدلي مول، عمّان',
    addressEn: 'Abdali Mall, Amman',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekdaysEn: 'Daily 8:00 AM – 12:00 AM',
    hoursWeekendAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekendEn: 'Daily 8:00 AM – 12:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[2],
  },
  {
    id: 'souk-bab-madina-zarqa',
    nameAr: 'سوق باب المدينة - الزرقاء',
    nameEn: 'Souk Bab Al Madina, Zarqa',
    addressAr: 'سوق باب المدينة، الزرقاء',
    addressEn: 'Souk Bab Al Madina, Zarqa',
    hoursWeekdaysAr: 'يوميًا 9:00 ص – 11:00 م',
    hoursWeekdaysEn: 'Daily 9:00 AM – 11:00 PM',
    hoursWeekendAr: 'يوميًا 9:00 ص – 11:00 م',
    hoursWeekendEn: 'Daily 9:00 AM – 11:00 PM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[0],
  },
  {
    id: 'madina-munawara',
    nameAr: 'شارع المدينة المنورة',
    nameEn: 'Al Madina Al Munawara St.',
    addressAr: 'شارع المدينة المنورة، عمّان',
    addressEn: 'Al Madina Al Munawara St, Amman',
    hoursWeekdaysAr: 'يوميًا 7:00 ص – 12:00 ص',
    hoursWeekdaysEn: 'Daily 7:00 AM – 12:00 AM',
    hoursWeekendAr: 'الخميس–الجمعة 7:00 ص – 1:00 ص',
    hoursWeekendEn: 'Thu–Fri 7:00 AM – 1:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[1],
  },
  {
    id: 'cozmo-7th-circle',
    nameAr: 'كوزمو - الدوار السابع',
    nameEn: 'Cozmo, 7th Circle',
    addressAr: 'الدوار السابع، عمّان',
    addressEn: '7th Circle, Amman',
    hoursWeekdaysAr: 'يوميًا 7:45 ص – 12:00 ص',
    hoursWeekdaysEn: 'Daily 7:45 AM – 12:00 AM',
    hoursWeekendAr: 'يوميًا 7:45 ص – 12:00 ص',
    hoursWeekendEn: 'Daily 7:45 AM – 12:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[2],
  },
  {
    id: 'ctown-jabal-hussein',
    nameAr: 'سي تاون - جبل الحسين',
    nameEn: 'C Town Jabal Al Hussein',
    addressAr: 'جبل الحسين، عمّان',
    addressEn: 'Jabal Al Hussein, Amman',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekdaysEn: 'Daily 8:00 AM – 12:00 AM',
    hoursWeekendAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekendEn: 'Daily 8:00 AM – 12:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[0],
  },
  {
    id: 'middle-east-university',
    nameAr: 'جامعة الشرق الأوسط',
    nameEn: 'Middle East University',
    addressAr: 'جامعة الشرق الأوسط، عمّان',
    addressEn: 'Middle East University, Amman',
    hoursWeekdaysAr: 'الأحد–الخميس 7:30 ص – 3:30 م',
    hoursWeekdaysEn: 'Sun–Thu 7:30 AM – 3:30 PM',
    hoursWeekendAr: 'مغلق الجمعة والسبت',
    hoursWeekendEn: 'Closed Fri–Sat',
    phone: '+962 6 581 4300',
    openNow: false,
    image: branchPhotos[1],
  },
  {
    id: 'weibdeh',
    nameAr: 'اللويبدة',
    nameEn: 'Weibdeh',
    addressAr: 'اللويبدة، عمّان',
    addressEn: 'Weibdeh, Amman',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekdaysEn: 'Daily 8:00 AM – 12:00 AM',
    hoursWeekendAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekendEn: 'Daily 8:00 AM – 12:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[2],
  },
  {
    id: 'sameh-jabal-shamali',
    nameAr: 'سامح مول - الجبل الشمالي',
    nameEn: 'Sameh Mall, Al Jabal Al Shamali',
    addressAr: 'الجبل الشمالي، إربد',
    addressEn: 'Al Jabal Al Shamali, Irbid',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekdaysEn: 'Daily 8:00 AM – 12:00 AM',
    hoursWeekendAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekendEn: 'Daily 8:00 AM – 12:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[0],
  },
  {
    id: 'sameh-shafa-badran',
    nameAr: 'سامح مول - شفا بدران',
    nameEn: 'Sameh Mall, Shafa Badran',
    addressAr: 'شفا بدران، عمّان',
    addressEn: 'Shafa Badran, Amman',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekdaysEn: 'Daily 8:00 AM – 12:00 AM',
    hoursWeekendAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekendEn: 'Daily 8:00 AM – 12:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[1],
  },
  {
    id: 'irbid-community-garden',
    nameAr: 'حديقة إربد المجتمعية',
    nameEn: 'Irbid Community Garden',
    addressAr: 'إربد',
    addressEn: 'Irbid',
    hoursWeekdaysAr: 'يوميًا 9:00 ص – 10:00 م',
    hoursWeekdaysEn: 'Daily 9:00 AM – 10:00 PM',
    hoursWeekendAr: 'يوميًا 9:00 ص – 10:00 م',
    hoursWeekendEn: 'Daily 9:00 AM – 10:00 PM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[2],
  },
  {
    id: 'seventy-three',
    nameAr: '٧٣ باي بن العميد',
    nameEn: 'Seventy Three by Al Ameed',
    addressAr: 'عمّان',
    addressEn: 'Amman',
    hoursWeekdaysAr: 'يوميًا 8:30 ص – 11:00 م',
    hoursWeekdaysEn: 'Daily 8:30 AM – 11:00 PM',
    hoursWeekendAr: 'يوميًا 8:30 ص – 11:00 م',
    hoursWeekendEn: 'Daily 8:30 AM – 11:00 PM',
    phone: '+962 77 738 9941',
    openNow: true,
    image: branchPhotos[0],
  },
  {
    id: 'mecca-mall',
    nameAr: 'مكة مول',
    nameEn: 'Mecca Mall',
    addressAr: 'مكة مول، عمّان',
    addressEn: 'Mecca Mall, Amman',
    hoursWeekdaysAr: 'السبت–الخميس 10:00 ص – 12:00 ص',
    hoursWeekdaysEn: 'Sat–Thu 10:00 AM – 12:00 AM',
    hoursWeekendAr: 'الجمعة 2:00 م – 12:00 ص',
    hoursWeekendEn: 'Fri 2:00 PM – 12:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[1],
  },
  {
    id: 'madina-munawara-2',
    nameAr: 'شارع المدينة المنورة ٢',
    nameEn: 'Al Madina Al Munawara St. 2',
    addressAr: 'شارع المدينة المنورة، عمّان',
    addressEn: 'Al Madina Al Munawara St, Amman',
    hoursWeekdaysAr: 'يوميًا 7:00 ص – 12:00 م',
    hoursWeekdaysEn: 'Daily 7:00 AM – Noon',
    hoursWeekendAr: 'الجمعة 7:00 ص – 1:00 ص',
    hoursWeekendEn: 'Fri 7:00 AM – 1:00 AM',
    phone: '+962 6 581 4300',
    openNow: true,
    image: branchPhotos[2],
  },
  {
    id: 'irbid-city-center',
    nameAr: 'إربد سيتي سنتر',
    nameEn: 'Irbid City Center',
    addressAr: 'إربد',
    addressEn: 'Irbid',
    hoursWeekdaysAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekdaysEn: 'Daily 8:00 AM – 12:00 AM',
    hoursWeekendAr: 'يوميًا 8:00 ص – 12:00 ص',
    hoursWeekendEn: 'Daily 8:00 AM – 12:00 AM',
    phone: '+962 6 581 4300',
    openNow: false,
    image: branchPhotos[0],
  },
];

// Branch names/addresses are specific ("Souk Bab Al Madina, Zarqa"), not a
// clean parseable "city, area" format, so grouping the 31-branch list by
// city for display uses this lookup instead of string-splitting addresses.
export const branchCityById: Record<string, { ar: string; en: string }> = {
  shmaisani: { ar: 'عمّان', en: 'Amman' },
  'alameed-experience': { ar: 'عمّان', en: 'Amman' },
  'hujra-village': { ar: 'عمّان', en: 'Amman' },
  khilda: { ar: 'عمّان', en: 'Amman' },
  'city-mall': { ar: 'عمّان', en: 'Amman' },
  zarqa: { ar: 'الزرقاء', en: 'Zarqa' },
  irbid: { ar: 'إربد', en: 'Irbid' },
  aqaba: { ar: 'العقبة', en: 'Aqaba' },
  madaba: { ar: 'مادبا', en: 'Madaba' },
  airport: { ar: 'الزيزياء', en: 'Zizya' },
  gardens: { ar: 'عمّان', en: 'Amman' },
  swefieh: { ar: 'عمّان', en: 'Amman' },
  ithaa: { ar: 'عمّان', en: 'Amman' },
  marka: { ar: 'عمّان', en: 'Amman' },
  jubeiha: { ar: 'عمّان', en: 'Amman' },
  'sameh-airport-road': { ar: 'عمّان', en: 'Amman' },
  'sameh-tabarbour': { ar: 'عمّان', en: 'Amman' },
  'ctown-abdali': { ar: 'عمّان', en: 'Amman' },
  'souk-bab-madina-zarqa': { ar: 'الزرقاء', en: 'Zarqa' },
  'madina-munawara': { ar: 'عمّان', en: 'Amman' },
  'cozmo-7th-circle': { ar: 'عمّان', en: 'Amman' },
  'ctown-jabal-hussein': { ar: 'عمّان', en: 'Amman' },
  'middle-east-university': { ar: 'عمّان', en: 'Amman' },
  weibdeh: { ar: 'عمّان', en: 'Amman' },
  'sameh-jabal-shamali': { ar: 'إربد', en: 'Irbid' },
  'sameh-shafa-badran': { ar: 'عمّان', en: 'Amman' },
  'irbid-community-garden': { ar: 'إربد', en: 'Irbid' },
  'seventy-three': { ar: 'عمّان', en: 'Amman' },
  'mecca-mall': { ar: 'عمّان', en: 'Amman' },
  'madina-munawara-2': { ar: 'عمّان', en: 'Amman' },
  'irbid-city-center': { ar: 'إربد', en: 'Irbid' },
};

// City-center coordinates, not per-branch — there's no real backend/geocoder
// yet to place each of the 31 branches precisely, but city-level distance is
// close enough to sort/label a "nearest branch" from the user's GPS position.
export const cityCoords: Record<string, { lat: number; lng: number }> = {
  Amman: { lat: 31.9539, lng: 35.9106 },
  Irbid: { lat: 32.5556, lng: 35.85 },
  Zarqa: { lat: 32.0728, lng: 36.0876 },
  Aqaba: { lat: 29.5321, lng: 35.0063 },
  Madaba: { lat: 31.7197, lng: 35.7942 },
  Zizya: { lat: 31.7226, lng: 35.9932 },
};

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

export type Gender = 'male' | 'female' | '';
export type MaritalStatus = 'single' | 'married' | '';

export const profile = {
  nameAr: 'حمزة طرقان',
  nameEn: 'Hamza Tarkan',
  phone: '+962 79 000 0000',
  email: 'hamza@example.com',
  memberSince: '2026-07-13',
  referralCode: 'AMEED-HZ20',
  dateOfBirth: '',
  gender: '' as Gender,
  maritalStatus: '' as MaritalStatus,
  city: '',
  area: '',
};

export const jordanCities = ['عمّان', 'إربد', 'الزرقاء', 'الكرك', 'العقبة', 'مادبا', 'السلط', 'المفرق'];
