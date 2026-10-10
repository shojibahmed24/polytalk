/**
 * PolyTalk Semantic Color Tokens
 * 
 * Visual Direction:
 * - Primary Background: Dark Navy
 * - Primary Accent: Cyan
 * - Secondary Accent: Purple
 */

import { useColorScheme } from 'react-native';

export const darkColors = {
  background: '#080D1A',
  surface: '#111A2E',
  surfaceElevated: '#17243B',
  primary: '#06B6D4',
  primaryBright: '#22D3EE',
  secondary: '#8B5CF6',
  secondarySoft: '#A78BFA',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textInverse: '#020617',
  border: '#26364F',
  divider: '#26364F',
  disabled: '#475569',
  disabledText: '#94A3B8',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#FB7185',
  info: '#3B82F6',
} as const;

export const lightColors = {
  background: '#F5F8FF',
  surface: '#FFFFFF',
  surfaceElevated: '#EEF4FF',
  primary: '#06B6D4',
  primaryBright: '#22D3EE',
  secondary: '#8B5CF6',
  secondarySoft: '#A78BFA',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textInverse: '#FFFFFF', 
  border: '#D8E2F0',
  divider: '#D8E2F0',
  disabled: '#E2E8F0',
  disabledText: '#94A3B8',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#FB7185',
  info: '#3B82F6',
} as const;

export const colors = darkColors as Record<keyof typeof darkColors, string>; // Backward compatibility for static usages

export type Colors = Record<keyof typeof darkColors, string>;



import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export type ThemeContextType = {
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  isDark: boolean;
};

export const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  setThemeMode: () => {},
  isDark: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');

  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppColors(): Colors {
  const { isDark } = useContext(ThemeContext);
  return (isDark ? darkColors : lightColors) as Colors;
}
