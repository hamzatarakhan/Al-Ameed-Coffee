import React, { createContext, useCallback, useContext, useState } from 'react';
import { applyColorScheme } from './theme';

interface ThemeModeValue {
  isDark: boolean;
  toggle: () => void;
}

const ThemeModeContext = createContext<ThemeModeValue | null>(null);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      applyColorScheme(next);
      return next;
    });
  }, []);

  // isDark in the value (not just the colors mutation) is what makes this
  // provider re-render — and since nothing here is memoized, that re-render
  // cascades to every descendant screen, which is what actually repaints
  // them with the colors object's freshly-mutated values.
  return <ThemeModeContext.Provider value={{ isDark, toggle }}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
}
