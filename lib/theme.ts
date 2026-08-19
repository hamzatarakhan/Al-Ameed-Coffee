export const colors = {
  bg: '#FAF6F0',
  surface: '#FFFFFF',
  surface2: '#F1E7DA',
  border: '#E4D5C3',
  text: '#2B1B14',
  textMuted: '#6B5647',
  brand: '#C21F2E',
  brandInk: '#7A1420',
  gold: '#A9762F',
  good: '#3F7D4A',
  warn: '#B4790F',
  critical: '#BB4B23',
  goodBg: '#E7F1E6',
  warnBg: '#FBF0DA',
  criticalBg: '#FBE7DD',
  white: '#FFFFFF',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

export const radius = { sm: 8, md: 10, lg: 14, pill: 999 } as const;

// ponytail: fonts are loaded in app/_layout.tsx via @expo-google-fonts/*;
// these family names must match the keys passed to useFonts() there.
export const fonts = {
  displayEn: 'Fraunces_600SemiBold',
  displayEnBold: 'Fraunces_700Bold',
  displayAr: 'MarkaziText_700Bold',
  bodyEn: 'IBMPlexSans_400Regular',
  bodyEnMedium: 'IBMPlexSans_500Medium',
  bodyEnSemiBold: 'IBMPlexSans_600SemiBold',
  bodyAr: 'IBMPlexSansArabic_400Regular',
  bodyArMedium: 'IBMPlexSansArabic_500Medium',
  bodyArSemiBold: 'IBMPlexSansArabic_600SemiBold',
  mono: 'IBMPlexMono_500Medium',
} as const;

export const shadow = {
  card: {
    shadowColor: '#2B1B14',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
} as const;
