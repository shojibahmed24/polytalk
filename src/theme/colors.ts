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
  background: '#0F172A', // Dark Navy (Slate 900)
  surface: '#1E293B',    // Elevated Surface (Slate 800)
  surfaceElevated: '#334155', // Higher Elevation (Slate 700)

  // Accents
  primary: '#06B6D4',    // Cyan (Cyan 500)
  secondary: '#A855F7',  // Purple (Purple 500)

  // Text
  textPrimary: '#F8FAFC',   // High-contrast white (Slate 50)
  textSecondary: '#94A3B8', // Muted text (Slate 400)
  textInverse: '#020617',   // Dark text for light backgrounds (Slate 950)

  // Borders & Dividers
  border: '#334155',     // Subtle border (Slate 700)
  divider: '#1E293B',    // Separator line (Slate 800)

  // States
  disabled: '#475569',   // Disabled state (Slate 600)
  disabledText: '#94A3B8', // Text on disabled controls

  // Feedback & Status
  success: '#22C55E',    // Green 500
  warning: '#F59E0B',    // Amber 500
  error: '#EF4444',      // Red 500
  info: '#3B82F6',       // Blue 500
} as const;

export type Colors = typeof colors;
