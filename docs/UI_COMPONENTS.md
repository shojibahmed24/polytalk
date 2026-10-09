# PolyTalk UI Components

This document details the reusable native components designed to enforce PolyTalk's design system and ensure accessibility, performance, and maintainability.

## 1. Typography

### `Text`
Located in: `src/components/ui/Text.tsx`

A strongly typed wrapper over React Native's `Text` that consumes typography and color tokens directly.

**Props:**
- `variant` (`'display' | 'heading' | 'title' | 'body' | 'bodySmall' | 'label' | 'caption'`): Determines font size, weight, and line height. Defaults to `'body'`.
- `color` (`keyof typeof theme.colors`): Maps strictly to semantic theme colors. Defaults to `'textPrimary'`.
- `align` (`'auto' | 'left' | 'right' | 'center' | 'justify'`): Text alignment.
- `weight` (`keyof typeof theme.typography.weights`): Override the variant's default weight.
- Supports all native `TextProps` (e.g. `numberOfLines`, `ellipsizeMode`, accessibility labels).

**Example:**
```tsx
import { Text } from '@/components/ui';

<Text variant="heading" color="primary" align="center">
  Welcome to PolyTalk
</Text>
```

## 2. Layout Primitives

### `Box`
Located in: `src/components/layout/Box.tsx`

A predictable Flexbox container wrapping `View` that translates theme tokens into layout styles, avoiding inline arbitrary styles.

**Props:**
- Layout: `flex`, `direction`, `align`, `justify`.
- Spacing: `gap`, `padding`, `margin`, `paddingHorizontal`, `marginVertical`, etc. (maps to `theme.spacing`).
- Visuals: `bg`, `borderColor` (maps to `theme.colors`), `radius` (maps to `theme.radii`), `borderWidth`.
- Supports all native `ViewProps`.

**Example:**
```tsx
import { Box } from '@/components/layout';

<Box bg="surface" padding="md" radius="lg" direction="row" align="center" gap="sm">
  <Text>Content</Text>
</Box>
```

### `Stack` and `Row`
Located in: `src/components/layout/`

Semantic wrappers around `Box` for immediate vertical (`Stack`) and horizontal (`Row`) composition.

**Example:**
```tsx
import { Stack, Row } from '@/components/layout';

<Stack gap="md">
  <Row justify="space-between">
    <Text>Left</Text>
    <Text>Right</Text>
  </Row>
</Stack>
```

## 3. Screens

### `Screen`
Located in: `src/components/layout/Screen.tsx`

The foundation layout for all application screens, enforcing safe areas, background colors, and padding.

**Props:**
- `scrollable` (`boolean`): If true, wraps content in a `ScrollView`. If false, uses a `View`.
- `edges` (`Edge[]`): SafeArea edges to apply. Defaults to `['bottom', 'left', 'right']`.
- `bg` (`keyof typeof theme.colors`): Screen background. Defaults to `'background'`.
- `padded` (`boolean`): Applies standard `theme.layout.screenPadding`. Defaults to `true`.
- `centerContent` (`boolean`): Centers children securely.
- `scrollViewProps` (`ScrollViewProps`): Optional props when scrollable is true.

**Example:**
```tsx
import { Screen } from '@/components/layout';

<Screen scrollable bg="background" padded>
  <Text variant="heading">Settings</Text>
</Screen>
```

## When to use these
- Use `Text` for all typography. Never use native `Text` directly.
- Use `Box`, `Stack`, and `Row` to build component internals instead of heavy `StyleSheet.create` for simple margin/padding layout.
- Use `Screen` at the root of every Expo Router route file (`app/**/*.tsx`).
