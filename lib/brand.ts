// Single source of truth for the coffee shop's identity — name, contact
// info, and logo. A rebrand (new client, new name/logo) should only ever
// require editing this file plus the asset files it points at and app.json
// (native app name/bundle id, which Expo can't read from JS at build time).
export const brand = {
  nameAr: 'بن العميد',
  nameEn: 'Al Ameed Coffee',
  nameEnUpper: 'AL AMEED COFFEE',
  website: 'https://alameedcoffee.com',
  supportPhone: '+962 6 581 4300',
  supportEmail: 'privacy@alameedcoffee.com',
  logo: require('../assets/images/logo.png'),
};
