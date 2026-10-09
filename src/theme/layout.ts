/**
 * PolyTalk Shared Layout Dimensions
 */

export const layout = {
  screenPadding: 24, // Standard padding for most screens
  touchTargetMinHeight: 48, // Minimum accessible touch target size
  maxWidth: 400, // Maximum width for constrained center layouts
} as const;

export type Layout = typeof layout;
