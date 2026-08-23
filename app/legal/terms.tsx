import React from 'react';
import { LegalPage, type LegalSection } from '@/components/LegalPage';
import { useLang } from '@/lib/i18n';
import { brand } from '@/lib/brand';

const sections: LegalSection[] = [
  {
    titleAr: '١. القبول بالشروط',
    titleEn: '1. Acceptance of Terms',
    bodyAr: `باستخدامك تطبيق ${brand.nameAr}، إنت موافق على هالشروط والأحكام. إذا ما وافقت عليها، فضلًا لا تستخدم التطبيق.`,
    bodyEn: `By using the ${brand.nameEn} app, you agree to these terms. If you don't agree, please don't use the app.`,
  },
  {
    titleAr: '٢. برنامج الولاء والنقاط',
    titleEn: '2. Loyalty Program & Points',
    bodyAr: `تكسب نقاط عند تسجيل الحضور بأي فرع، الطلب عبر التطبيق، أو دعوة أصدقاء. النقاط ملك لحسابك الشخصي فقط، غير قابلة للتحويل أو الاستبدال بنقود، وممكن تنتهي صلاحيتها إذا ضل الحساب غير نشط لفترة طويلة. ${brand.nameAr} محتفظ بحق تعديل قيمة النقاط أو طريقة كسبها بإشعار مسبق.`,
    bodyEn: `You earn points by checking in at any branch, ordering through the app, or inviting friends. Points belong solely to your account, are non-transferable and cannot be exchanged for cash, and may expire if your account stays inactive for an extended period. ${brand.nameEn} reserves the right to change point values or earning rules with prior notice.`,
  },
  {
    titleAr: '٣. إنشاء الحساب',
    titleEn: '3. Account Registration',
    bodyAr:
      'إنت مسؤول عن دقة المعلومات اللي بتسجّلها وعن الحفاظ على أمان حسابك. أي نشاط بيصير من حسابك يعتبر مسؤوليتك، إلا إذا بلّغتنا بأي استخدام غير مصرح فيه.',
    bodyEn:
      "You're responsible for the accuracy of the information you provide and for keeping your account secure. Activity on your account is your responsibility unless you report unauthorized use to us.",
  },
  {
    titleAr: '٤. الطلبات والدفع',
    titleEn: '4. Orders & Payment',
    bodyAr: `الأسعار المعروضة بالتطبيق قابلة للتغيير بدون إشعار مسبق. الطلبات تخضع لتوفر المنتج بالفرع المختار، و${brand.nameAr} مش مسؤول عن التأخير الناتج عن ظروف خارجة عن إرادته.`,
    bodyEn: `Prices shown in the app may change without prior notice. Orders are subject to product availability at the selected branch, and ${brand.nameEn} is not liable for delays caused by circumstances beyond its control.`,
  },
  {
    titleAr: '٥. الاستخدام المقبول',
    titleEn: '5. Acceptable Use',
    bodyAr:
      'ممنوع استخدام التطبيق بأي طريقة غير قانونية، أو محاولة الوصول لحسابات تانية، أو استغلال ثغرات بالنظام لكسب نقاط بطريقة غير مشروعة.',
    bodyEn:
      "You may not use the app for any unlawful purpose, attempt to access other users' accounts, or exploit system vulnerabilities to earn points fraudulently.",
  },
  {
    titleAr: '٦. التعديلات على الشروط',
    titleEn: '6. Changes to These Terms',
    bodyAr: 'ممكن نحدّث هالشروط من وقت لآخر. الاستمرار باستخدام التطبيق بعد أي تعديل يعتبر موافقة على النسخة الجديدة.',
    bodyEn: 'We may update these terms from time to time. Continued use of the app after a change constitutes acceptance of the new version.',
  },
  {
    titleAr: '٧. تواصل معنا',
    titleEn: '7. Contact Us',
    bodyAr: 'لأي استفسار حول هالشروط، تواصل معنا من صفحة "تواصل معنا" داخل التطبيق.',
    bodyEn: 'For any questions about these terms, reach out to us via the "Contact Us" page inside the app.',
  },
];

export default function TermsScreen() {
  const { t } = useLang();
  return <LegalPage title={t('account.terms')} updatedDate="2026-08-19" sections={sections} />;
}
