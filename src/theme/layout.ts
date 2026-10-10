/**
 * PolyTalk Shared Layout Dimensions
 */

export const layout = {
  screenPadding: 24, // Standard padding for most screens
  touchTargetMinHeight: 48, // Minimum accessible touch target size
  maxWidth: 400, // Maximum width for constrained center layouts (e.g. dialogs)
  contentMaxWidth: 840, // Maximum width for main fluid content areas
} as const;

export type Layout = typeof layout;
