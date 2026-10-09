# PolyTalk Design System & Tokens

This document formally defines the design tokens that power PolyTalk's Android-first UI. All UI components and screens must consume these tokens from `@/theme` rather than using hardcoded values.

## Import Path
```typescript
import { theme } from '@/theme';
```

## Colors (`theme.colors`)
The application uses a dark navy core with cyan and purple accents.

### Backgrounds & Surfaces
- `background` (`#0F172A`): The absolute lowest layer (Dark Navy). Used for screen backgrounds.
- `surface` (`#1E293B`): Elevated cards and modular containers.
- `surfaceElevated` (`#334155`): For floating elements, dialogs, or active states.

### Accents
- `primary` (`#06B6D4`): Cyan. Used for primary buttons, active tabs, and highlights.
- `secondary` (`#A855F7`): Purple. Used for secondary actions and complementary emphasis.

### Text
- `textPrimary` (`#F8FAFC`): High-contrast white. For primary reading content.
- `textSecondary` (`#94A3B8`): Muted slate. For subtitles and hints.
- `textInverse` (`#020617`): Dark text used strictly over bright accent backgrounds.

### Feedback
- `success` (`#22C55E`): Correct answers, success toasts.
- `warning` (`#F59E0B`): Pending states, soft warnings.
- `error` (`#EF4444`): Validation errors, destructive actions.
- `info` (`#3B82F6`): Neutral informational badges.

## Typography (`theme.typography`)
- **Sizes**: `xs` (12), `sm` (14), `md` (16), `lg` (18), `xl` (20), `xxl` (24), `xxxl` (32), `display` (42).
- **Weights**: `regular` (400), `medium` (500), `semibold` (600), `bold` (700).

## Spacing (`theme.spacing`)
Based on an 8px grid with a 4px half-step.
- `xs` (4), `sm` (8), `md` (16), `lg` (24), `xl` (32), `xxl` (48), `xxxl` (64).

## Border Radii (`theme.radii`)
- `sm` (4), `md` (8), `lg` (12), `xl` (16), `full` (9999).

## Layout (`theme.layout`)
- `screenPadding` (24): Universal horizontal padding for screen edges.
- `touchTargetMinHeight` (48): Minimum height for buttons/inputs per accessibility standards.
- `maxWidth` (400): Maximum content width to prevent tablet stretching.

## Strict Enforcement
- Do not use `StyleSheet.create` with raw hex codes.
- Do not create secondary theme files; update `src/theme/` if new tokens are universally needed.
