import React from 'react';
import { LegalPage, type LegalSection } from '@/components/LegalPage';
import { useLang } from '@/lib/i18n';

const sections: LegalSection[] = [
  {
    titleAr: '١. المعلومات اللي بنجمعها',
    titleEn: '1. Information We Collect',
    bodyAr:
      'بنجمع اسمك، رقم هاتفك، وبريدك الإلكتروني عند إنشاء الحساب. بنجمع كمان بيانات استخدامك للتطبيق (الطلبات، النقاط، الفروع اللي بتزورها)، وموقعك الجغرافي فقط إذا سمحت فيه عشان نعرض أقرب فرع إلك.',
    bodyEn:
      'We collect your name, phone number, and email when you create an account. We also collect app usage data (orders, points, branches you visit), and your location only if you grant permission, so we can show the nearest branch.',
  },
  {
    titleAr: '٢. كيف بنستخدم بياناتك',
    titleEn: '2. How We Use Your Data',
    bodyAr:
      'بنستخدم بياناتك عشان نشغّل حساب النقاط تبعك، نعالج طلباتك، نبعثلك إشعارات مرتبطة بحسابك (نقاط، عروض، تحديثات)، ونحسّن خدماتنا. ما بنبيع بياناتك لأي جهة خارجية.',
    bodyEn:
      "We use your data to run your points account, process your orders, send you account-related notifications (points, offers, updates), and improve our services. We don't sell your data to third parties.",
  },
  {
    titleAr: '٣. مشاركة البيانات',
    titleEn: '3. Data Sharing',
    bodyAr:
      'ممكن نشارك بيانات محدودة مع مزودي خدمات موثوقين (زي بوابات الدفع أو خدمات التوصيل) فقط عشان ننفذ طلبك، وبموجب اتفاقيات تحفظ خصوصيتك.',
    bodyEn:
      'We may share limited data with trusted service providers (such as payment gateways or delivery services) only to fulfill your order, and under agreements that protect your privacy.',
  },
  {
    titleAr: '٤. الاحتفاظ بالبيانات وحذفها',
    titleEn: '4. Data Retention & Deletion',
    bodyAr:
      'بنحتفظ ببياناتك طول ما حسابك فعّال. تقدر تطلب حذف حسابك وبياناتك بشكل نهائي في أي وقت من صفحة "حذف الحساب" داخل التطبيق — العملية فورية ومش قابلة للتراجع.',
    bodyEn:
      'We retain your data for as long as your account is active. You can permanently delete your account and data at any time from the "Delete Account" page in the app — the action is immediate and cannot be undone.',
  },
  {
    titleAr: '٥. حقوقك',
    titleEn: '5. Your Rights',
    bodyAr: 'إلك الحق بالوصول لبياناتك، تعديلها من صفحة الملف الشخصي، أو طلب حذفها بالكامل، بأي وقت.',
    bodyEn: 'You have the right to access your data, edit it from your profile page, or request its complete deletion, at any time.',
  },
  {
    titleAr: '٦. الموقع والإشعارات',
    titleEn: '6. Location & Notifications',
    bodyAr:
      'صلاحية الموقع اختيارية وبتستخدم بس لعرض أقرب فرع. صلاحية الإشعارات اختيارية وبتستخدم لتنبيهك بنقاطك وعروضنا — تقدر توقفها بأي وقت من إعدادات جهازك.',
    bodyEn:
      "Location permission is optional and used only to show the nearest branch. Notification permission is optional and used to alert you about your points and offers — you can turn it off anytime from your device settings.",
  },
  {
    titleAr: '٧. خصوصية الأطفال',
    titleEn: '7. Children\'s Privacy',
    bodyAr: 'التطبيق مش موجّه للأطفال تحت ١٣ سنة، وما بنجمع بيانات مقصودة منهم.',
    bodyEn: "The app is not directed at children under 13, and we don't knowingly collect data from them.",
  },
  {
    titleAr: '٨. التعديلات على هالسياسة',
    titleEn: '8. Changes to This Policy',
    bodyAr: 'ممكن نحدّث سياسة الخصوصية من وقت لآخر، وأي تعديل جوهري رح نعلمك فيه داخل التطبيق.',
    bodyEn: "We may update this privacy policy from time to time, and we'll notify you in-app of any material change.",
  },
  {
    titleAr: '٩. تواصل معنا',
    titleEn: '9. Contact Us',
    bodyAr: 'لأي استفسار حول خصوصيتك، تواصل معنا من صفحة "تواصل معنا" داخل التطبيق.',
    bodyEn: 'For any privacy questions, reach out to us via the "Contact Us" page inside the app.',
  },
];

export default function PrivacyScreen() {
  const { t } = useLang();
  return <LegalPage title={t('account.privacy')} updatedDate="2026-08-19" sections={sections} />;
}
