// Palette + shape rebased on a coffee-app reference: bold orange accent,
// near-black photography hero surfaces, clean white cards, pill controls.
export const colors = {
  bg: '#FAF8F5',
  surface: '#FFFFFF',
  surface2: '#F4F0EB',
  border: '#EBE4DB',
  text: '#1E1712',
  textMuted: '#8A8078',
  brand: '#E8792E',
  brandInk: '#B85A1B',
  brandTint: '#FBEADB',
  hero: '#171310',
  gold: '#D99A3D',
  good: '#3F8A5B',
  warn: '#C08A1E',
  critical: '#D6544A',
  goodBg: '#E7F2EA',
  warnBg: '#FBF0DA',
  criticalBg: '#FBE7E4',
  white: '#FFFFFF',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 } as const;

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
    shadowColor: '#1E1712',
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
