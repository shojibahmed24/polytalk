/**
 * PolyTalk Theme Exports
 */

import { colors } from './colors';
import { spacing } from './spacing';
import { radii } from './radii';
import { typography } from './typography';
import { layout } from './layout';

export const theme = {
  colors,
  spacing,
  radii,
  typography,
  layout,
} as const;

export type Theme = typeof theme;
