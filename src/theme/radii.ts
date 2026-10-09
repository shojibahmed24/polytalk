/**
 * PolyTalk Border Radii
 */

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999, // For circular elements
} as const;

export type Radii = typeof radii;
