import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import { applyColorScheme } from './theme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeModeValue {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  sheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
}

const ThemeModeContext = createContext<ThemeModeValue | null>(null);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [sheetOpen, setSheetOpen] = useState(false);
  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  // Mutating during render (not in an effect) so `colors` is already
  // up to date by the time descendants — including _layout.tsx's Stack,
  // which keys off isDark and remounts the whole tree — render in this
  // same pass. An effect would apply one render too late, leaving the
  // freshly remounted tree reading the previous (stale) colors.
  const appliedRef = useRef<boolean | null>(null);
  if (appliedRef.current !== isDark) {
    applyColorScheme(isDark);
    appliedRef.current = isDark;
  }

  const setMode = useCallback((next: ThemeMode) => setModeState(next), []);
  const openSheet = useCallback(() => setSheetOpen(true), []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  return (
    <ThemeModeContext.Provider value={{ mode, isDark, setMode, sheetOpen, openSheet, closeSheet }}>{children}</ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
}
