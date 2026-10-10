/**
 * PolyTalk Semantic Color Tokens
 * 
 * Visual Direction:
 * - Primary Background: Dark Navy
 * - Primary Accent: Cyan
 * - Secondary Accent: Purple
 */

export const colors = {
  // Backgrounds
  background: '#080D1A',
  surface: '#111A2E',
  surfaceElevated: '#17243B',

  // Accents
  primary: '#06B6D4',
  secondary: '#8B5CF6',

  // Text
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textInverse: '#020617', // Kept for contrast on primary

  // Borders & Dividers
  border: '#26364F',
  divider: '#26364F',

  // States
  disabled: '#475569',
  disabledText: '#94A3B8',

  // Feedback & Status
  success: '#34D399',
  warning: '#FBBF24',
  error: '#FB7185',
  info: '#3B82F6',
} as const;

export type Colors = typeof colors;
