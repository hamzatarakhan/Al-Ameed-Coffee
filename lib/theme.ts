// Palette + type pulled directly from alameedcoffee.com: brand red #E51937,
// black/white, warm greys, Avenir-led typography (see fonts below for the
// free substitutes — Avenir LT Std itself isn't available on Google Fonts).
export type Colors = typeof lightColors;

const lightColors = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  surface2: '#F5F3F2',
  border: '#E6E2E1',
  text: '#212529',
  textMuted: '#5C5555',
  brand: '#E51937',
  brandInk: '#B3122B',
  brandTint: '#FBE7EA',
  hero: '#000000',
  gold: '#8A7F6A',
  good: '#3F8A5B',
  warn: '#B8860B',
  critical: '#D6544A',
  goodBg: '#E7F2EA',
  warnBg: '#FBF0DA',
  criticalBg: '#FBE7E4',
  white: '#FFFFFF',
};

const darkColors: Colors = {
  bg: '#121012',
  surface: '#1C1A1C',
  surface2: '#262326',
  border: '#38343A',
  text: '#F2EDEE',
  textMuted: '#A79FA3',
  brand: '#FF3B57',
  brandInk: '#FF7A8C',
  brandTint: '#3A1620',
  hero: '#000000',
  gold: '#B5A78F',
  good: '#5FBE82',
  warn: '#E0A83A',
  critical: '#E2704A',
  goodBg: '#1D3324',
  warnBg: '#3A2C10',
  criticalBg: '#3A2019',
  white: '#FFFFFF',
};

// A single mutable object (not a reassigned export) so every file's
// `import { colors }` keeps pointing at live values — toggling dark mode
// (see lib/theme-mode.tsx) mutates these properties in place, and any
// component re-rendered afterward picks up the new colors automatically.
export const colors: Colors = { ...lightColors };

export function applyColorScheme(dark: boolean) {
  Object.assign(colors, dark ? darkColors : lightColors);
}

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

// The real site runs almost entirely square (0px radius) CTAs and blocks —
// mirrored here but softened slightly (8-14px) for touch-sized mobile controls
// instead of copying literal 0px, which reads as unfinished on a phone.
export const radius = { sm: 6, md: 10, lg: 14, xl: 18, pill: 999 } as const;

// ponytail: fonts are loaded in app/_layout.tsx via @expo-google-fonts/*;
// these family names must match the keys passed to useFonts() there.
export const fonts = {
  displayEn: 'Jost_600SemiBold',
  displayEnBold: 'Jost_700Bold',
  displayAr: 'Cairo_700Bold',
  bodyEn: 'Mulish_400Regular',
  bodyEnMedium: 'Mulish_500Medium',
  bodyEnSemiBold: 'Mulish_700Bold',
  bodyAr: 'Cairo_400Regular',
  bodyArMedium: 'Cairo_500Medium',
  bodyArSemiBold: 'Cairo_600SemiBold',
  mono: 'IBMPlexMono_500Medium',
} as const;

export const shadow = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  floating: {
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
} as const;
