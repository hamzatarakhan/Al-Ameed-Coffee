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
    done: { ar: 'تم', en: 'Done' },
  },
  tabs: {
    home: { ar: 'الهوم', en: 'Home' },
    order: { ar: 'طلباتي', en: 'Orders' },
    checkin: { ar: 'Check In', en: 'Check In' },
    rewards: { ar: 'الهدايا', en: 'Rewards' },
    account: { ar: 'حسابي', en: 'Account' },
  },
  home: {
    question: { ar: 'شو حابب تطلب اليوم؟', en: 'What would you like today?' },
    chooseBranch: { ar: 'اختر فرعك', en: 'Choose your branch' },
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
    locationEnabled: { ar: 'الموقع مفعّل، مرتبة حسب الأقرب', en: 'Location enabled, sorted by distance' },
    search: { ar: 'دوّر عن فرع...', en: 'Search branches...' },
    noResults: { ar: 'ما في نتائج', en: 'No branches found' },
    km: { ar: 'كم', en: 'km' },
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
    noCallConfirm: { ar: 'لا تتصل بي لتأكيد الطلب', en: "Don't call me to confirm the order" },
  },
  menu: {
    title: { ar: 'القائمة', en: 'Menu' },
    continue: { ar: 'متابعة', en: 'Continue' },
    emptyCart: { ar: 'اختر أغراضك عشان تكمّل', en: 'Choose your items to continue' },
    price: { ar: '{price} د.أ', en: 'JD {price}' },
    addToCart: { ar: 'إضافة الى السلة', en: 'Add to cart' },
  },
  orderBranch: {
    title: { ar: 'اختر فرع الاستلام', en: 'Choose a pickup branch' },
    confirm: { ar: 'تأكيد الطلب', en: 'Confirm order' },
    successTitle: { ar: 'تم إرسال طلبك', en: 'Order sent' },
    successBody: { ar: 'استلمه من {branch} خلال 15-20 دقيقة', en: 'Pick it up from {branch} in 15-20 minutes' },
    done: { ar: 'تم', en: 'Done' },
  },
  orderDelivery: {
    title: { ar: 'اختر موقع التسليم', en: 'Choose delivery location' },
    addNew: { ar: 'أضف عنوان جديد', en: 'Add new address' },
    saved: { ar: 'العناوين المحفوظة', en: 'Saved addresses' },
    empty: { ar: 'لا يوجد أماكن محفوظة', en: 'No saved places' },
    chooseAddress: { ar: 'اختر عنوانك', en: 'Choose your address' },
    successBody: { ar: 'رح توصلك عالعنوان: {address} خلال 30-45 دقيقة', en: "It'll arrive at {address} in 30-45 minutes" },
  },
  orderAddress: {
    title: { ar: 'أضف عنوان جديد', en: 'Add new address' },
    home: { ar: 'المنزل', en: 'Home' },
    work: { ar: 'العمل', en: 'Work' },
    other: { ar: 'أخرى', en: 'Other' },
    addressLine: { ar: 'العنوان', en: 'Address' },
    addressLinePlaceholder: { ar: 'مثال: عمّان، شارع وصفي التل', en: 'e.g. Amman, Wasfi Al-Tall Street' },
    city: { ar: 'المدينة', en: 'City' },
    area: { ar: 'المنطقة', en: 'Area' },
    areaPlaceholder: { ar: 'اسم المنطقة أو الحي', en: 'Area or neighborhood name' },
    building: { ar: 'رقم البناية', en: 'Building number' },
    buildingPlaceholder: { ar: 'مثال: 12أ، 96ب، إلخ', en: 'e.g. 12A, 96B, etc.' },
    floor: { ar: 'رقم الطابق', en: 'Floor number' },
    save: { ar: 'حفظ', en: 'Save' },
  },
  orderCart: {
    title: { ar: 'سلة المشتريات', en: 'Cart' },
    emptyTitle: { ar: 'سلتك فاضية', en: 'Your cart is empty' },
    browseMenu: { ar: 'تصفح القائمة', en: 'Browse menu' },
    cartContents: { ar: 'محتويات السلة', en: 'Cart contents' },
    itemTotal: { ar: '{price} د.أ الإجمالي', en: 'JD {price} total' },
    paymentMethod: { ar: 'طريقة الدفع', en: 'Payment method' },
    cash: { ar: 'كاش', en: 'Cash' },
    card: { ar: 'بطاقة ائتمانية', en: 'Credit card' },
    orderMethod: { ar: 'طريقة الطلب', en: 'Order method' },
    branchPickup: { ar: 'استلام من الفرع', en: 'Branch pickup' },
    orderSummary: { ar: 'ملخص الطلب', en: 'Order summary' },
    subtotal: { ar: 'المجموع الفرعي', en: 'Subtotal' },
    thanks: { ar: 'نشكر تسوقكم معنا.', en: 'Thanks for shopping with us.' },
    total: { ar: 'المبلغ النهائي', en: 'Total' },
    placeOrder: { ar: 'أطلب الآن', en: 'Place order' },
  },
  checkin: {
    title: { ar: 'Check In', en: 'Check In' },
    instruction: { ar: 'وريّ الكود للكاشير لتجمع نقاطك', en: 'Show this code to the cashier to collect points' },
    scanned: { ar: 'تم!', en: 'Done!' },
    earned: { ar: 'كسبت {n} نقطة', en: 'You earned {n} points' },
    simulate: { ar: 'محاكاة المسح (تجريبي)', en: 'Simulate scan (demo)' },
    reset: { ar: 'إعادة', en: 'Reset' },
    openFull: { ar: 'فتح الشاشة كاملة', en: 'Open full screen' },
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
    themeLight: { ar: 'فاتح', en: 'Light' },
    themeDark: { ar: 'داكن', en: 'Dark' },
    themeSystem: { ar: 'تلقائي', en: 'System' },
    notifications: { ar: 'الإشعارات', en: 'Notifications' },
    notifDenied: {
      ar: 'الإشعارات موقوفة من إعدادات الجهاز. لتفعيلها، افتح إعدادات النظام وفعّلها لتطبيق بن العميد.',
      en: 'Notifications are off at the device level. To enable them, open system settings and turn them on for Al Ameed Coffee.',
    },
    sectionSupport: { ar: 'الدعم', en: 'Support' },
    contactUs: { ar: 'تواصل معنا', en: 'Contact Us' },
    connectWithUs: { ar: 'تابعنا', en: 'Connect With Us' },
    rateApp: { ar: 'قيّم التطبيق', en: 'Rate Our App' },
    sectionLegal: { ar: 'قانوني', en: 'Legal' },
    terms: { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
    privacy: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
    sectionSession: { ar: 'الجلسة', en: 'Session' },
    signOut: { ar: 'تسجيل الخروج', en: 'Sign Out' },
    signOutConfirm: { ar: 'رح تحتاج تسجّل دخول تاني عشان تستخدم التطبيق.', en: "You'll need to sign in again to use the app." },
    deleteAccount: { ar: 'حذف الحساب', en: 'Delete Account' },
    devInfo: { ar: 'الإصدار 1.0.0 · Al Ameed Coffee', en: 'Version 1.0.0 · Al Ameed Coffee' },
  },
  profile: {
    title: { ar: 'ملفي الشخصي', en: 'My Profile' },
    memberSince: { ar: 'عضو منذ {date}', en: 'Member since {date}' },
    name: { ar: 'الاسم', en: 'Name' },
    phone: { ar: 'رقم الهاتف', en: 'Phone number' },
    email: { ar: 'البريد الإلكتروني', en: 'Email' },
    referralCode: { ar: 'كود الدعوة', en: 'Referral code' },
    edit: { ar: 'تعديل', en: 'Edit' },
    save: { ar: 'حفظ', en: 'Save' },
    saved: { ar: 'تم حفظ التعديلات', en: 'Your changes were saved' },
    notSet: { ar: 'غير محدد', en: 'Not set' },
  },
  deleteAccount: {
    title: { ar: 'حذف الحساب', en: 'Delete Account' },
    warningTitle: { ar: 'هاد الإجراء نهائي', en: 'This action is permanent' },
    warningBody: {
      ar: 'حذف حسابك رح يمسح رصيد نقاطك، سجل طلباتك، والهدايا المستبدلة نهائيًا — ومش رح تقدر تسترجعها.',
      en: "Deleting your account permanently erases your points balance, order history, and redeemed rewards — this can't be undone.",
    },
    confirmLabel: { ar: 'اكتب "حذف" للتأكيد', en: 'Type "DELETE" to confirm' },
    confirmWord: { ar: 'حذف', en: 'DELETE' },
    confirmButton: { ar: 'احذف حسابي نهائيًا', en: 'Permanently delete my account' },
    cancel: { ar: 'تراجع', en: 'Cancel' },
  },
  legal: {
    lastUpdated: { ar: 'آخر تحديث: {date}', en: 'Last updated: {date}' },
  },
  deleteData: {
    title: { ar: 'حذف بياناتك', en: 'Delete Your Data' },
    intro: {
      ar: 'تقدر تطلب حذف حسابك وكل بياناتك من بن العميد بأي وقت، سواء كان عندك التطبيق أو لأ.',
      en: 'You can request deletion of your account and all your data from Al Ameed Coffee at any time, whether or not you still have the app.',
    },
    whatWeStoreTitle: { ar: 'شو البيانات اللي نخزّنها', en: 'What data we store' },
    whatWeStoreBody: {
      ar: 'الاسم، رقم الهاتف، البريد الإلكتروني، تاريخ الميلاد، الجنس، الحالة الاجتماعية، المدينة والمنطقة، رصيد نقاطك، وسجل طلباتك وزياراتك.',
      en: 'Name, phone number, email, date of birth, gender, marital status, city and area, your points balance, and your order/visit history.',
    },
    inAppTitle: { ar: 'إذا كان عندك التطبيق', en: "If you still have the app" },
    inAppBody: {
      ar: 'سجّل دخولك وروح لـ حسابي ← حذف الحساب. الحذف فوري ونهائي.',
      en: 'Sign in and go to Account → Delete Account. Deletion is immediate and permanent.',
    },
    contactTitle: { ar: 'إذا ما قدرت تسجّل دخول', en: "If you can't sign in" },
    contactBody: {
      ar: 'راسلنا من بريدك المسجّل أو اتصل فينا وحدد رقم هاتفك المسجّل بالتطبيق، ورح نحذف بياناتك يدويًا.',
      en: "Email us from your registered address or call us with the phone number you signed up with, and we'll delete your data manually.",
    },
    emailSubject: { ar: 'طلب حذف بياناتي - بن العميد', en: 'Data deletion request - Al Ameed Coffee' },
    timeline: { ar: 'بنعالج طلبات الحذف اليدوية خلال ٧ أيام عمل كحد أقصى.', en: 'Manual deletion requests are processed within 7 business days.' },
  },
  orders: {
    title: { ar: 'طلباتي', en: 'My Orders' },
    empty: { ar: 'لسا ما طلبت شي', en: "You haven't ordered yet" },
    emptyBody: { ar: 'أول طلب إلك رح يبان هون', en: 'Your first order will show up here' },
    itemsCount: { ar: '{n} أصناف', en: '{n} items' },
    newOrder: { ar: 'اطلب الآن', en: 'Order now' },
    reorder: { ar: 'اطلب نفس الطلب', en: 'Order again' },
    completed: { ar: 'تم التسليم', en: 'Completed' },
    pickupFrom: { ar: 'استلام من {branch}', en: 'Pickup from {branch}' },
    deliverTo: { ar: 'توصيل لـ {address}', en: 'Delivery to {address}' },
  },
  auth: {
    welcomeTitle: { ar: 'أهلًا فيك ببن العميد', en: 'Welcome to Al Ameed Coffee' },
    welcomeBody: { ar: 'سجّل دخولك تجمع نقاط وتفتح هدايا كل ما تطلب أو تزورنا', en: 'Sign in to start earning points and unlocking rewards' },
    phoneLabel: { ar: 'رقم الهاتف', en: 'Phone number' },
    phonePlaceholder: { ar: '7X XXX XXXX', en: '7X XXX XXXX' },
    nameLabel: { ar: 'الاسم الكامل', en: 'Full name' },
    namePlaceholder: { ar: 'مثال: حمزة طرقان', en: 'e.g. Hamza Tarkan' },
    continue: { ar: 'متابعة', en: 'Continue' },
    or: { ar: 'أو', en: 'or' },
    appleSignIn: { ar: 'تسجيل الدخول عبر Apple', en: 'Sign in with Apple' },
    noAccount: { ar: 'ماعندك حساب؟', en: "Don't have an account?" },
    createAccount: { ar: 'إنشاء حساب', en: 'Create account' },
    haveAccount: { ar: 'عندك حساب؟', en: 'Already have an account?' },
    signIn: { ar: 'تسجيل الدخول', en: 'Sign in' },
    phoneRequired: { ar: 'أدخل رقم أردني صحيح (07XXXXXXXX)', en: 'Enter a valid Jordanian number (07XXXXXXXX)' },
    phoneDigitsRemaining: { ar: 'أدخل {n} أرقام إضافية', en: 'Enter {n} more digits' },
    phoneMustStartWith7: { ar: 'الرقم لازم يبلش بـ 7 (بعد الصفر لو كتبته)', en: 'The number must start with 7 (after the 0, if you typed one)' },
    nameRequired: { ar: 'أدخل اسمك الكامل', en: 'Enter your full name' },
    otpTitle: { ar: 'تفعيل الحساب', en: 'Activate account' },
    otpBody: { ar: 'لقد قمنا بإرسال رمز التفعيل لرقم هاتفك ({phone})', en: 'We sent an activation code to your number ({phone})' },
    otpDemoHint: { ar: 'وضع تجريبي — أي ٤ أرقام تشتغل', en: 'Demo mode — any 4 digits work' },
    otpInvalid: { ar: 'أدخل ٤ أرقام', en: 'Enter 4 digits' },
    verify: { ar: 'تفعيل', en: 'Activate' },
    resend: { ar: 'إعادة ارسال (SMS)', en: 'Resend (SMS)' },
    resendSent: { ar: 'تم إرسال رمز جديد', en: 'A new code was sent' },
    wrongNumber: { ar: 'رقم الهاتف غير صحيح؟', en: 'Wrong phone number?' },
    needHelp: { ar: 'تحتاج مساعدة؟ يرجى الاتصال بنا.', en: 'Need help? Please contact us.' },
    agreePrefix: { ar: 'بالتسجيل، فإنك توافق على', en: 'By signing up, you agree to the' },
    agreeTerms: { ar: 'شروط وأحكام بن العميد', en: "Al Ameed Coffee Terms & Conditions" },
    termsRequired: { ar: 'لازم توافق على الشروط والأحكام أول', en: 'You must agree to the Terms & Conditions first' },
    completeProfileTitle: { ar: 'قم بإكمال بياناتك', en: 'Complete your profile' },
    firstName: { ar: 'الاسم الأول', en: 'First name' },
    lastName: { ar: 'الاسم الأخير', en: 'Last name' },
    dateOfBirth: { ar: 'تاريخ الميلاد', en: 'Date of birth' },
    dobPlaceholder: { ar: 'يوم/شهر/سنة', en: 'DD/MM/YYYY' },
    gender: { ar: 'الجنس', en: 'Gender' },
    genderMale: { ar: 'ذكر', en: 'Male' },
    genderFemale: { ar: 'أنثى', en: 'Female' },
    maritalStatus: { ar: 'الحالة الإجتماعية', en: 'Marital status' },
    maritalSingle: { ar: 'أعزب', en: 'Single' },
    maritalMarried: { ar: 'متزوج', en: 'Married' },
    city: { ar: 'المدينة', en: 'City' },
    area: { ar: 'المنطقة', en: 'Area' },
    areaPlaceholder: { ar: 'مثال: الشميساني', en: 'e.g. Shmaisani' },
    saveContinue: { ar: 'حفظ', en: 'Save' },
    skipForNow: { ar: 'تخطّى', en: 'Skip' },
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
