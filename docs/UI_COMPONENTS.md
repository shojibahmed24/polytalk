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

## 4. Forms and Inputs

### `Button`
Located in: `src/components/ui/Button.tsx`

A highly reusable native button managing its own loading, disabled, and semantic color states.

**Props:**
- `label` (`string`): Text content for the button.
- `variant` (`'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'`): Determines the visual semantic style. Defaults to `'primary'`.
- `size` (`'sm' | 'md' | 'lg'`): Controls the height and typography scaling. Defaults to `'md'`.
- `loading` (`boolean`): Renders an activity indicator and disables interaction.
- `disabled` (`boolean`): Lowers opacity and disables interaction.
- Inherits all `TouchableOpacityProps` (e.g. `onPress`).

**Example:**
```tsx
import { Button } from '@/components/ui';

<Button 
  label="Submit Application" 
  variant="primary" 
  loading={isSubmitting} 
  onPress={handleSubmit} 
/>
```

### `TextInput`
Located in: `src/components/ui/TextInput.tsx`

A controlled text input primitive that strictly manages its own labels, error states, and helper text accessible wrappers without needing an extra `FormField` container for standard cases.

**Props:**
- `label` (`string`): The accessible label rendered above the input.
- `error` (`string`): Validation error message. When present, the input border turns red and the error text is rendered below.
- `helperText` (`string`): Subtle informational text rendered below the input (hidden if `error` is present).
- Inherits all native `TextInputProps` (`value`, `onChangeText`, `secureTextEntry`, `keyboardType`, etc).

**Example:**
```tsx
import { TextInput } from '@/components/ui';

<TextInput 
  label="Email Address"
  placeholder="you@example.com"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  autoCapitalize="none"
/>
```

## 5. Cards & Surfaces

### `Card`
Located in: `src/components/ui/Card.tsx`

Provides foundational surface elevation and visual chunking natively, using Flexbox layout automatically.

**Props:**
- `variant` (`'default' | 'elevated' | 'outlined'`): Semantic representation (default is flat `surface`, elevated adds `surfaceElevated`, outlined uses border).
- `padding` (`keyof typeof theme.spacing`): Standardizes interior padding bounds. Defaults to `'lg'`.
- `onPress` (`() => void`): If provided, automatically wraps the Card in a `TouchableOpacity` with proper accessibility roles.

**Example:**
```tsx
import { Card } from '@/components/ui';

<Card variant="elevated" onPress={() => console.log('Card tapped!')}>
  <Text>Interactive Content Here</Text>
</Card>
```

### `Divider`
Located in: `src/components/layout/Divider.tsx`

Provides a simple, theme-aware separator line (horizontal or vertical).

**Props:**
- `orientation` (`'horizontal' | 'vertical'`)
- `thickness` (`number`): Defaults to `1`.
- `color` (`keyof typeof theme.colors`): Defaults to `'border'`.


## 6. Feedback & Modals

### `Dialog`
Located in: `src/components/feedback/Dialog.tsx`

A React Native `Modal`-based dialog for presenting critical decisions to the user without breaking Z-indexing or using third-party modal libraries.

**Props:**
- `visible` (`boolean`)
- `title` and `message`
- `primaryActionLabel`, `secondaryActionLabel`, `destructiveActionLabel`
- Callback triggers and loading state.

### `BottomSheet`
Located in: `src/components/feedback/BottomSheet.tsx`

A bottom-anchored modal sheet utilizing React Native's `Modal` and `animationType="slide"` to avoid heavy React Native Gesture Handler dependencies before they are strictly needed. Includes safe area handling and scroll options.

### `AlertBanner`
Located in: `src/components/feedback/AlertBanner.tsx`

An inline alert for forms or screens. Supports `success`, `error`, `warning`, and `info` color backgrounds natively mapped from the theme.

### `EmptyState` & `LoadingState`
Located in: `src/components/feedback/EmptyState.tsx`

Consistent inline views for loading sequences or empty data fetch results natively utilizing the `ActivityIndicator` and primary layout bindings.

### `Badge`
Located in: `src/components/ui/Badge.tsx`

Small informational pills or status dots binding to semantic theme colors.

**Props:**
- `label` (`string`): The text to display inside the pill.
- `variant` (`'default' | 'success' | 'warning' | 'error' | 'info'`): Controls the semantic background.
- `dotOnly` (`boolean`): If true, renders a fixed-size colored dot instead of a text label, useful for unread indicators.

**Example:**
```tsx
import { Badge } from '@/components/ui';

<Badge label="New" variant="success" />
<Badge dotOnly variant="error" />
```

## 7. Keyboard and Safe Areas

### `keyboardAware` in `Screen`
Located in: `src/components/layout/Screen.tsx`

To gracefully handle keyboard overlaps globally:
- Pass `keyboardAware={true}` to `Screen`.
- It wraps the children inside a `KeyboardAvoidingView` natively optimized per platform (uses `behavior="padding"` for iOS, leaving Android to fall back to `windowSoftInputMode="adjustResize"` internally).
- Setting this ensures input forms at the bottom of views remain in focus appropriately without manual nested height hacking.
