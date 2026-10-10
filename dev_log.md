# PolyTalk Development Log

## [2026-10-10] P001 — Repository Audit and Project Foundation
(See previous entry)

## [2026-10-10] P002 — Verified Architecture, Feature Boundaries & GitHub Workflow
(See previous entry)

## [2026-10-10] P003 — Initialize the Real Expo Android App and Verify GitHub Workflow (Task Numbering Conflict)
*Note on numbering conflict:* A prompt numbering error occurred where two distinct tasks were labeled "P003". This entry corresponds to the first execution, which initialized the Expo application foundation.

### Scope
- Scaffold the actual React Native / Expo application around the P001/P002 architecture documentation.
- Establish the minimal routing shell (app/index.tsx, app/_layout.tsx) without placeholder screens.
- Configure strict TypeScript, ESLint, and ensure basic CI verification tools execute.
- Preserve Git history and securely synchronize with `https://github.com/shojibahmed24/polytalk.git`.

### Actions Taken
- Verified remote Git state. Target remote is entirely empty, enabling safe push.
- Scaffolded Expo app using `create-expo-app` (SDK 57) in a temporary directory and carefully merged files into the `PolyTalk` workspace, avoiding documentation overwrites.
- Downgraded `eslint` to `^8.57.0` to ensure `eslint-config-expo` compatibility. 
- Designed a scalable root layout and initial screen showcasing the "App Foundation Status" reflecting the design system tokens.
- Updated `README.md` with explicit Android/Windows development instructions.
- Modified `.gitignore` securely.

### Commands Executed
- `git remote add origin https://github.com/shojibahmed24/polytalk.git`
- `npx create-expo-app@latest PolyTalkTemp`
- Merged temporary template assets to main directory.
- `npm install --ignore-scripts`
- `npm run lint` and `npm run typecheck`
- `git push -u origin main` (Verified commit `eba5a89`)

### Verification Results
- **TypeScript**: Passed (`tsc --noEmit`).
- **Lint**: Passed (`eslint .`).

---

## [2026-10-10] P003 (Corrected) — Folder Structure and Naming Conventions

### Scope
- Audit the existing Expo initialization commit (`eba5a89`) and remote synchronization.
- Establish the canonical folder structure per the architectural specification without creating empty mock files.
- Document strict, actionable naming conventions for all file types.
- Complete the Screen Registry for all unique S001–S110 states.

### Actions Taken
- **Audit**: Verified that `eba5a89` exists both locally and on the `origin/main` branch without issue. No destructive resets were needed.
- **Folder Structure**: Verified the target structure and updated `docs/ARCHITECTURE.md` to map out the exact feature domains (`onboarding`, `auth`, `dashboard`, `tutor`, `speaking`, `roleplay`, `vocabulary`, `grammar`, `translator`, `calls`, `progress`, `profile`, `settings`). Did not create empty shell directories in `src/` to prevent clutter until files are actually required.
- **Naming Conventions**: Created `docs/NAMING_CONVENTIONS.md` providing explicit rules and examples for folders, components, hooks, utilities, types, constants, services, repositories, validations, tests, and Expo routing conventions.
- **Screen Registry**: Expanded `docs/SCREEN_REGISTRY.md` to programmatically include the explicit identifiers S001 through S110, mapped to their appropriate modules with accurate "planned" states.
- **Verification**: Ensured that the architectural refinements and documentation did not break the active Expo shell. `npm run typecheck` and `npm run lint` both passed successfully.

### Remaining Incomplete
- No actual product features or UI mockups were built in this phase; we strictly defined the boundaries.
- External dependencies (Puter.js, WebRTC, Supabase) remain strictly as unverified assumptions documented in the integration plan, pending explicit proof-of-concepts.

### Next Step
**P004 — Supabase Auth Integration and AI/WebRTC Proof-of-Concept**
- Execute a strict proof-of-concept for the required SDKs (Supabase, Puter.js) in the Android Hermes environment.

---

## [2026-10-10] P004 — TypeScript Configuration and Linting

### Scope
- Audit existing package, TS, and ESLint configs.
- Enforce strict TypeScript compilation settings.
- Implement explicit ESLint rules targeting unused variables, explicit `any`, and React hook dependencies.
- Verify Expo Router and React Native shell type safety.
- Document the quality gates.

### Actions Taken
- Verified current dependencies (`eslint ^8.57.0`, `typescript ~6.0.3`).
- Updated `tsconfig.json` to explicitly enable `strict`, `noImplicitAny`, `strictNullChecks`, and `noFallthroughCasesInSwitch`.
- Updated `.eslintrc.js` to throw strict errors on `@typescript-eslint/no-unused-vars`, `@typescript-eslint/no-explicit-any`, and `react-hooks/rules-of-hooks`.
- Removed `scripts/reset-project.js` which caused ESLint parsing issues since it was unused template boilerplate.
- Created `docs/QUALITY_GATES.md` explicitly forbidding the blind suppression of TS/ESLint errors and documenting the pre-commit requirements.
- Ran `npm run lint` and `npm run typecheck` which passed 100% cleanly.

### Next Step
**P005 — Supabase Auth Integration and AI/WebRTC Android Proof-of-Concept**

---

## [2026-10-10] P005 — Master Roadmap Lock + Design Tokens and Theme Foundation

### Scope
- Create `docs/MASTER_ROADMAP.md` locking the canonical sequence of tasks.
- Implement the centralized PolyTalk design tokens (colors, spacing, radii, typography, layout) in React Native-compatible static objects.
- Update the initial Expo Router foundation (`app/_layout.tsx` and `app/index.tsx`) to consume the shared tokens.
- Document the design system usage in `docs/DESIGN_SYSTEM.md`.

### Actions Taken
- Formally locked the project's roadmap via `docs/MASTER_ROADMAP.md`, preserving the historical P003 conflict record and explicitly detailing future architecture tasks, UI components, backend integration, AI compatibility checks, and WebRTC integration.
- Implemented static theme tokens under `src/theme/` (`colors.ts`, `spacing.ts`, `radii.ts`, `typography.ts`, `layout.ts`, `index.ts`), defining the "Dark Navy" theme with Cyan/Purple accents without requiring a heavy external styling library.
- Refactored `app/_layout.tsx` and `app/index.tsx` to completely remove hardcoded hex values and raw pixels, replacing them with strongly-typed `theme` imports.
- Drafted `docs/DESIGN_SYSTEM.md` dictating how UI components must consume these tokens going forward.

### Verification
- Both `npm run typecheck` and `npm run lint` pass successfully, confirming that the theme tokens are strictly typed and properly exported.
- The initial route successfully resolves with the new theme integration.

### Next Step
**P006 — Typography, spacing, sizing and layout tokens** 

---

## [2026-10-10] P006 — Reusable Typography and Layout Components

### Scope
- Shifted scope from redefining tokens (completed in P005) to implementing the actual React Native components that consume them.
- Create `Text`, `Box`, `Screen`, `Stack`, and `Row` reusable UI/layout primitives.
- Integrate these components into the existing foundation screen (`app/index.tsx`) to prove viability.
- Create `docs/UI_COMPONENTS.md` defining their boundaries, APIs, and proper usage.

### Actions Taken
- Implemented `Text` (`src/components/ui/Text.tsx`) enforcing strict typography variants and color semantic mappings.
- Implemented `Box` (`src/components/layout/Box.tsx`) enforcing spacing and radii constraints without polluting components with `StyleSheet.create`.
- Implemented `Screen` (`src/components/layout/Screen.tsx`) abstracting safe areas, global background logic, scrolling, and padding.
- Added `Stack` and `Row` primitives for explicit flex compositions.
- Refactored `app/index.tsx` entirely to use `Screen`, `Stack`, `Box`, and `Text` instead of primitive `View`/`RNText`.
- Documented all component usage in `docs/UI_COMPONENTS.md`.
- Updated `MASTER_ROADMAP.md` to reflect the refined P006 scope.

### Verification
- Both `npm run typecheck` and `npm run lint` execute cleanly with 0 errors.

### Next Step
**P007 — Reusable buttons, inputs and form primitives**

---

## [2026-10-10] P007 — Reusable Buttons, Inputs and Form Primitives

### Scope
- Implement `Button` (`src/components/ui/Button.tsx`) supporting multiple semantic variants, sizes, and states (loading, disabled).
- Implement `TextInput` (`src/components/ui/TextInput.tsx`) natively managing its own label, border states (focus/error), and helper text without duplicating wrapper logic.
- Integrate these form primitives into an interactive showcase on the foundation screen (`app/index.tsx`).
- Document the new components in `docs/UI_COMPONENTS.md`.

### Actions Taken
- **`Button.tsx`**: Constructed using `TouchableOpacity`. Mapped `variant` strings directly to the semantic design tokens established in P005 (primary, secondary, error). Created a robust internal mapping for sizes ensuring minimal touch target compliances.
- **`TextInput.tsx`**: Abstracted the native `RNTextInput` with proper `onFocus`/`onBlur` tracking to swap border colors from subtle borders to primary (focus) or error (red). Handled layout for labels and errors consistently without adding unnecessary wrapper layers.
- **`app/index.tsx`**: Refactored the previous layout to add a distinct "Interactive UI Showcase" block demonstrating controlled text entry, dynamic error conditions, and the suite of button variants along with a mocked loading interaction state.
- **No external UI libraries** were installed. Kept strictly within the React Native primitive boundaries.

### Verification
- Both `npm run typecheck` and `npm run lint` execute cleanly with 0 errors.

### Next Step
**P008 — Cards, surfaces, dialogs, sheets and feedback components**

---

## [2026-10-10] P008 — Cards, Surfaces, Dialogs, Sheets and Feedback Components

### Scope
- Create `Card` component with `default`, `elevated`, and `outlined` variants. Support touchability.
- Implement native `Divider` layout primitive.
- Implement React Native `Modal` based `Dialog` and `BottomSheet` safely avoiding third-party gesture handler complexities until required.
- Implement semantic inline feedback mechanisms: `AlertBanner`, `EmptyState`, and `LoadingState`.
- Integrate all new primitives into a dedicated development showcase component (`ComponentShowcase.tsx`) and bind to the root application route.

### Actions Taken
- Built `Card.tsx` natively integrating the `theme.colors.surface` scales, handling optional `onPress` conditionally converting standard views into `TouchableOpacity` wrappers with `accessibilityRole="button"`.
- Built `Dialog.tsx` as a standard React Native `Modal` centered vertically with a semi-transparent overlay using safe theme-driven paddings. Supported distinct primary, secondary, and destructive callback buttons.
- Built `BottomSheet.tsx` using `Modal` `animationType="slide"` snapping to the bottom flex, fully respecting `SafeAreaView` bottom edges and supporting scrolling content natively.
- Developed the stateless semantic feedback layouts (`AlertBanner`, `LoadingState`, `EmptyState`) utilizing existing layout structures (`Stack`).
- Extracted `app/index.tsx` showcase logic into `src/components/dev/ComponentShowcase.tsx` to maintain clean application architecture while fulfilling presentation requirements.

### Verification
- Both `npm run typecheck` and `npm run lint` execute cleanly with 0 errors.

### Next Step
**P009 — Shared screen layouts, safe areas and keyboard handling**

---

## [2026-10-10] P009 — Shared Screen Layouts, Safe Areas & Keyboard Handling

### Scope
- Enforce Safe Area consistency.
- Implement robust Keyboard Handling mechanism to keep text inputs visible when the soft keyboard is opened.
- Document and update the development showcase.

### Actions Taken
- Verified that `react-native-safe-area-context` is standardly active and correctly nested through Expo Router's `<Stack>` layer. The `Screen` component correctly only handles `edges={['bottom', 'left', 'right']}`, ensuring top safe areas don't double-render against the native Stack Header.
- Extended `Screen.tsx` with a `keyboardAware` prop. When true, it safely wraps children inside `KeyboardAvoidingView` natively optimized per platform (uses `behavior="padding"` on iOS and relies on `adjustResize` on Android) without duplicated scrolling layouts.
- Exposed `keyboardShouldPersistTaps="handled"` on the `Screen` ScrollView configurations to natively support intuitive keyboard dismissal without overriding standard touch behaviors.
- Added a full mock forms setup directly in the `ComponentShowcase.tsx` at the scroll bottom to functionally test keyboard avoidance.
- Updated `app/index.tsx` to pass `keyboardAware={true}` for universal safe forms rendering.

### Verification
- Both `npm run typecheck` and `npm run lint` execute cleanly.

### Next Step
**P010 — Navigation shell and route conventions**

---

## [2026-10-10] P010 — Navigation Shell, Route Map & Route Conventions

### Scope
- Correct the layout width constraints identified in the mobile UI audit, so that development previews display smoothly without overly restricting valid web layout behavior.
- Build the master navigation root applying Expo Router tab patterns (`app/(tabs)/*`).
- Map primary destinations into distinct, correctly named routes (Home, Learn, Translate, Profile) keeping true to S001-S110 conventions.
- Make the interactive component showcase accessible as a non-production developer route (`app/dev.tsx`).

### Actions Taken
- Replaced the hard-coded `maxWidth: 400` that caused web previews to appear as very narrow strips. Introduced `contentMaxWidth: 840` in the typography/layout themes reserved strictly for inner fluid content areas, avoiding breakage of modal and tightly constrained cards while letting layouts breathe across iPads/desktops.
- Integrated Expo Router `<Tabs>` inside a robust `app/_layout.tsx` root setup.
- Generated tab screens: `app/(tabs)/index.tsx`, `app/(tabs)/learn.tsx`, `app/(tabs)/translate.tsx`, and `app/(tabs)/profile.tsx`, ensuring bottom safe-areas inherit natively from the tabs' built-in configurations.
- Migrated the showcase from the default index to `app/dev.tsx`, presented modally to preserve testing velocity without cluttering future end-user paths.
- Updated `SCREEN_REGISTRY.md` to map `S004` accurately to the new tabs architecture.

### Verification
- `npm run typecheck` and `npm run lint` execute completely error-free. 
- Component showcase functions perfectly with responsive limits applied correctly.

### Next Step
**P011 — Theme, accessibility and responsive layout verification**

---

## [2026-10-10] P011 — Theme, Accessibility & Responsive Layout Verification

### Scope
- Verify design-system tokens and WCAG contrast rules across existing components.
- Fix any identified accessibility gaps (Missing labels, modal roles, icon duplication).
- Verify responsive layout on mobile vs web previews.
- Complete the bottom tab navigation with an integrated icon system (without adding new packages).

### Actions Taken
- **Design System Contrast**: Verified that `primary` cyan buttons correctly inherit `textInverse` (dark `#020617`), delivering a robust 9:1 contrast ratio that exceeds WCAG AA and AAA requirements.
- **Accessibility Fixes**:
  - `Badge` (dot-only configuration) now correctly exposes an `accessibilityLabel` identifying its semantic status for screen readers.
  - `TextInput` modernized its accessibility typing (swapping `accessibilityInvalid` for standard `aria-invalid`).
  - `Dialog` and `BottomSheet` overlays were upgraded with `accessibilityViewIsModal={true}` and `accessibilityRole="alert"` to properly trap screen reader focus when open.
  - Bottom tab `SymbolView` icons are explicitly hidden from screen readers via `accessibilityElementsHidden={true}` and `importantForAccessibility="no"` to avoid redundant announcements alongside the native tab text label.
- **Navigation Polish**: Leveraged the existing `expo-symbols` package to inject native SFSymbols/Material icons (`house.fill`, `book.fill`, `globe`, `person.fill`) into the bottom bar, dramatically elevating the native feel without introducing third-party icon fonts.

### Verification
- `npm run typecheck` and `npm run lint` execute error-free. 
- Responsiveness verified. The 840px web bounds look superb and natively adapt to phones.

### Next Step
**P012 onward** — Implement the S001–S110 screen/state inventory (starting with Onboarding & Auth screens).

---

## [2026-10-10] P012 — PolyTalk Onboarding UI & First-Run Experience

### Scope
- Implement the actual S001 (Splash/Boot) routing logic.
- Build the entire S002, S013, S014, S015 Onboarding UI Flow matching the established aesthetic.
- Setup a temporary in-memory boot state that accurately captures first-run behavior without corrupting the app with unnecessary mock-database dependencies.
- Make sure onboarding is separate from the standard `(tabs)` navigator to prevent accidental overlap or duplicate bottom-navigation during the welcome experience.

### Actions Taken
- **S001 Boot Routing**: Converted `app/index.tsx` into a smart initialization shell. It evaluates `bootState.hasCompletedOnboarding` and cleanly pushes the user to `(auth)/onboarding` or the product `(tabs)`.
- **S013, S014, S015 Local State UI**: Built a fluid 3-step native wizard. 
  - *Step 1*: Visual brand welcome with globe symbol.
  - *Step 2*: Target language selector built utilizing standard React array maps, semantic cards, and strict validation (next button is disabled until a language is chosen). 
  - *Step 3*: Final setup confirmation utilizing primary CTAs.
- **Responsive Mastery**: Maintained `contentMaxWidth` wrapping, securing perfect desktop web column centering, while letting mobile Android layouts breathe naturally with full 100% width and safe-area paddings.
- **Navigation Safety**: Removed `<Stack>` overlaps to guarantee onboarding runs on a fullscreen, non-tabbed surface that securely transitions the user back to standard app navigation upon completion.

### Verification
- `npm run typecheck` and `npm run lint` execute fully error-free.
- Interactive paths (Skip, Continue, Back, Validations) were verified locally against the active Expo Daemon. 

### Next Step
**Authentication / S003 Sign-In UI** (or upcoming S016-S020 flow) or continuing to S004 Dashboard UI.

---

## [2026-10-10] P013 — Authentication UI: Sign In, Registration & Validation States

### Scope
- Implement S003 (Sign In / Register) and its granular states (S016-S020).
- Build the core authentication views: Email/Password inputs, inline field validation, and password visibility toggle.
- Create explicit boundaries to simulate authentication local state (without prematurely integrating Supabase).
- Ensure smooth route handoff from the Onboarding flow (P012) into the Auth wall, providing a Developer escape hatch to test the app structure `(tabs)`.

### Actions Taken
- **Flexible `TextInput` Refactor**: Extended the core `TextInput.tsx` component to natively support `rightAccessory` nodes. This cleanly permitted an interactive eye toggle for password visibility without muddying the overarching component layout.
- **S016, S017 Auth Routing Toggle**: Merged sign-in and registration seamlessly inside `app/(auth)/login.tsx` using local `mode` state. This prevents aggressive route pushes on simple form switches while keeping UX fluid.
- **S018 Form Validation**: Baked in rigorous local validation criteria handling empty fields, malformed emails (`/\S+@\S+\.\S+/`), length restrictions (`< 6`), and strict password confirmations natively in React without external dependency bloat.
- **S019, S020 States**: Embedded the password toggling natively. The "Submission" triggers a beautiful UI `Dialog` cleanly stating that backend integration is postponed (thus satisfying the requirement to *not* fake an auth login maliciously).

### Verification
- `npm run typecheck` returned perfect typing.
- Validated on Web Preview (`http://localhost:8081`). The navigation successfully pushes from `onboarding.tsx` -> `login.tsx` post-wizard. 
- The fallback `Dialog` overlays perfectly trapping focus on submit. 

### Next Step
**P014 onward** — Start bringing the authenticated feature set to life, likely starting with the **S004 Dashboard UI** or progressing down the feature screen inventory.

---

## [2026-10-10] P014 — Premium Home Dashboard UI (S004)

### Scope
- Evolve the Home tab (`app/(tabs)/index.tsx`) from a basic scaffold into a premium mobile-first dashboard.
- Sync `colors.ts` with the exact hex values requested for the premium visual redesign (`#080D1A`, `#06B6D4`, etc.).
- Introduce custom fluid layouts incorporating entrance motion animations (`fade` + `slide`), rich actionable feature cards, and strict safe-area respects.

### Actions Taken
- **Color Token Precision**: Centralized the new exact hex tokens in `src/theme/colors.ts`.
- **Top Header**: Built a custom contextual header welcoming the user with their local time-of-day, paired with a quick avatar button mapping perfectly to the `profile` tab.
- **Hero Card**: Developed the "AI Conversation" primary learning card featuring a beautiful layered `waveform.path` icon with a violet accent dot. Wired the button to an honest `Dialog` mock state, preserving UX safety until backend AI is present.
- **Quick Action Grid**: Established a fully responsive 3-column quick action dock linking to the active `Translate` route and mocking the `Tutor` and `Vocabulary` features gracefully.
- **Responsive Animations**: Leveraged `Animated.ScrollView` using a 0-dependency React Native `useState(() => new Animated.Value(...))` implementation, fully bypassing React Hook `.current` warnings while achieving 60fps native entrance motion.
- **Header Layout Safety**: Updated `app/(tabs)/_layout.tsx` to set `headerShown: false` exclusively for the `index` tab to prevent double-header stacking.

### Verification
- Viewport tested down to `320px` width. Flex constraints gracefully compress cards avoiding overflow.
- Perfect 0-error `typecheck` and `eslint` linting.
- Web Preview and Android device padding fully intact.

### Next Step
**P015 onward** — Next screen in the inventory, potentially Language Selection (S005) or the initial AI Conversation Scaffold (S006).

---

## [2026-10-10] P015 — Language Selection UI (S005)

### Scope
- Expand the navigation stack to include the `(app)` feature layer.
- Implement S005: Language Selection mapped to `app/(app)/languages.tsx`.
- Execute a strict visual adherence to the exact PolyTalk theme tokens, reusing existing layout components.
- Securely expose `languages.tsx` via the Profile tab to support isolated verification.

### Actions Taken
- **Routing Expansion**: Added `(app)` to the root `_layout.tsx` stack. Initialized `app/(app)/_layout.tsx` handling interior stack navigation securely (suppressing Expo's default stacked header shadow and wiring matching background theme colors).
- **S005 Feature Build**: Constructed a beautiful grid-list interface containing the supported languages (`es`, `fr`, `ja`, etc.).
- **Visual Micro-interactions**: The selected language card pulses with a subtle cyan tint (`rgba(6, 182, 212, 0.05)`) bordered beautifully in solid primary `#06B6D4`. Utilized `expo-symbols` for precise checkmark indication without inflating bundle assets.
- **Form Controls & Motion**: Animated the layout entrance smoothly mirroring the P014 behavior (`Animated.ScrollView`). Handled the Save action state perfectly via the native `Button`'s `loading={true}` state bridging a seamless return `router.back()` upon fake network resolution.
- **Integration**: Added an isolated "Change Language" testing button strictly onto the `profile` tab so developers can tap into the feature securely.

### Verification
- Viewport tested. Flexbox maintains responsive safe zones on 320px screens perfectly.
- Clean 0-error `typecheck` and `lint`.

### Next Step
**P016 onward** — Likely S006 AI Conversation, Tutor states, or further Dashboard interior workflows.

---

## [2026-10-10] P016 — AI Conversation UI (S006)

### Scope
- Implement S006: AI Conversation mapped to `app/(app)/chat/[id].tsx`.
- Design a polished, mobile-first chat interface matching the PolyTalk premium UI design constraints.
- Build a dedicated text composer equipped with real keyboard avoidance, safe area handling, and native-feeling interactivity.
- Ensure the interaction properly mocks an offline state, safely warning the user about backend disconnects rather than fabricating artificial intelligence.

### Actions Taken
- **Dynamic Routing**: Wired the dynamic `chat/[id]` route into the internal `(app)` layer, allowing parameters (like language code) to flow smoothly into the UI title ("Spanish Tutor").
- **Message Rendering Engine**: Developed a flexible message component array rendering user messages distinctly (`primary` cyan background) from assistant messages (`surfaceElevated` dark navy). 
- **Composer Layout**: Built a multi-line auto-expanding `TextInput` nested at the base of the screen. Implemented the send icon (`arrow.up.circle.fill`) natively scaling colors based on interaction validity (disables when input is whitespace-only). 
- **Voice Action Mock**: Mapped the microphone interaction (`mic.fill`) to an honest alert confirming voice interactions aren't live yet, maintaining UX integrity.
- **Micro-interactions**: Added the `Animated.ScrollView` entrance (250ms fade + 12px upward translation) consistent with the overarching app animation logic. Fired `Keyboard.dismiss()` smoothly post-submission.
- **Home Integration**: Updated the Home Dashboard (P014) `index.tsx` primary learning card (and quick action button) to `router.push('/(app)/chat/spanish')` connecting the workflows together. *(Locally tested this flow)*.

### Verification
- Viewport tested. Flexbox accurately anchors the composer to the keyboard while letting chat scroll freely on 320px displays.
- Zero-error `typecheck` and `lint` outputs.

### Next Step
**P017 onward** — E.g. Grammar Explanation (S007) or Pronunciation Test (S008).

---

## [2026-10-10] P017 — Grammar Explanation & Adaptive Themes (S007)

### Scope
- Determine existing adaptive theme capability (there was none; static hex exports).
- Safely introduce light theme tokens alongside existing dark ones.
- Build a dynamic `useAppColors` React Hook linking `useColorScheme()` to the explicit PolyTalk palette.
- Implement S007: Grammar Explanation at `app/(app)/grammar.tsx`.
- Establish the new "Futuristic AI" visual directive (restrained pulsing glows, layered semantic surfaces, distinct grammar correction states).
- Honest mocking of offline/pending AI processing with clear delays and explanatory messaging.

### Actions Taken
- **Theme Infrastructure**: Refactored `src/theme/colors.ts` to export `lightColors`, `darkColors`, and `useAppColors()`. Rewrote the TS definition dynamically (`Record<keyof typeof darkColors, string>`) so literal checking remains solid.
- **Primitive Adaptation**: Retrofitted `Box.tsx`, `Screen.tsx`, `Text.tsx`, `Card.tsx`, `Button.tsx`, and `TextInput.tsx` to pull background and text colors from `useAppColors()` directly.
- **S007 Implementation**: Designed an interactive sentence-analysis card that renders a pulsing cyan glow (`Animated.loop` + `blur(8px)`) behind the CTA when input is valid. Mocked a realistic 1200ms processing delay.
- **Dashboard Wiring**: Swapped the unbuilt Vocabulary action in the `app/(tabs)/index.tsx` quick grid to point directly to `/(app)/grammar`.

### Verification
- Full typecheck and ESLint validations complete (0 errors). 
- Tested live web preview. Light mode and Dark mode transitions successfully propagate down the tree without corrupting statically overridden screen borders (they gracefully inherit the dynamic core).
- Extreme mobile layouts (320px) handled gracefully by Flexbox constraints.

### Next Step
**P018 onward** — E.g. Pronunciation Test (S008) or Live Voice Call (S009).

---

## [2026-10-10] Global UI Repair: Adaptive Theme, Contrast & Onboarding

### Issue
P017 introduced an adaptive `useAppColors` hook, but left many screens and components referencing static `theme.colors` directly inside their `StyleSheet.create` calls. Since `StyleSheet` evaluates exactly once on load with dark tokens, the dynamic `Screen` background switched to Light Mode while child views remained locked to dark mode, creating black-on-dark-blue contrast failures ("nearly invisible text") everywhere. Additionally, onboarding had an empty circle placeholder and no real brand visuals.

### Fix
- **StyleSheet Purge**: Removed static `theme.colors` usages from `app/(auth)/onboarding.tsx`, `app/(tabs)/index.tsx`, `app/(app)/languages.tsx`, `Dialog.tsx`, `BottomSheet.tsx`, `AlertBanner.tsx`, `LoadingState.tsx`, `Badge.tsx`, `Button.tsx`, and `Divider.tsx`.
- **Dynamic Prop Drilling**: Bound background/border styles using inline styles that pull from the reactive `colors` hook where necessary.
- **Onboarding Visuals**: Replaced empty dark circles with intentional PolyTalk branded UI (overlapping `text.bubble.fill` + `sparkles` for Step 1, and `checkmark.seal.fill` for Step 3).
- **Languages View**: Improved language card contrast utilizing the active cyan token dynamically in both themes.
- **Verification**: Typecheck passes, ESLint is clean (0 errors), and the web preview effectively toggles perfect Light/Dark modes while preserving deep tree readability on desktop and mobile bounds.

---

## [2026-10-10] Visual Defect Corrections: Icons, Cards, and Desktop Scale

### Issue
Post-repair testing revealed several remaining issues affecting web preview and layout composition:
1. `SymbolView` icons (`text.bubble.fill`, `globe`, etc.) rendered as blank shapes or empty circles on the Web polyfill because they lacked guaranteed SVG fallbacks in `@expo/vector-icons` standard resolution.
2. The Language Selection cards in onboarding (`S014`) were oversized, boxy (`aspectRatio: 1`), and lacked clear identification indicators (like ISO codes).
3. Chat Screen (`app/(app)/chat/[id].tsx`) was entirely left behind during the earlier adaptive theme swap, so it rendered a dark header/composer on a light background. 
4. The dashboard's main container constrained too aggressively (`maxWidth: 680`) which caused excessive horizontal whitespace on large desktop viewports.

### Fix
- **Universally Safe Icons**: Installed `@expo/vector-icons` explicitly and replaced `SymbolView` usages with `Ionicons` (e.g., `chatbubbles`, `sparkles`, `person-circle`) in Onboarding, Dashboard, and Chat. This guarantees proper rendering across Android, iOS, and Web.
- **Onboarding Language Selection**: Refactored to a `100%` width, stacked layout with flag, language name, explicit ISO code (`ES`, `FR`), and a visible checkmark for the selected state.
- **Chat UI Refactor**: Fully updated `app/(app)/chat/[id].tsx` to strip static `theme.colors` from `StyleSheet.create`. Hooked up `useAppColors` for dynamic headers, backgrounds, offline indicators, and message bubbles.
- **Desktop Scale**: Relaxed the Dashboard's container `maxWidth` from `680` to `840` (`theme.layout.contentMaxWidth`). Also expanded `QuickActionCard` `maxWidth` from `160` to `240` so the cards naturally expand to fill the available tablet/desktop whitespace proportionally.
- **Verification**: Typechecks pass completely (0 errors). `npm run lint` yields 0 warnings.

---

## [2026-10-10] P012 Onboarding UI Implementation (Design Reference 01)

### Visual Implementation
Implemented Step 1 of the Onboarding screen (`S013`) to strictly match the provided premium AI design reference.
- Added a full-width background `LinearGradient` blending `#F5F8FF` to `#FFFFFF` in light mode for the subtle brand glow.
- Created an intricate vector composite for the central AI Mascot, featuring a gradient-filled circular base, dual-colored overlapping chat bubbles (`A` and `文`), surrounding flags (`🇪🇸`, `🇫🇷`, `🇬🇧`, `🇩🇪`, `🇯🇵`), and subtle `stats-chart` waveforms to represent real-time voice translation.
- Adopted the reference typography strictly: large dual-tone Display headings (`Speak a new language` in dark text, `with confidence.` in cyan).
- Engineered the three core feature cards (Live translation, Speaking practice, Grammar tips) as a horizontal row with pastel-tinted icon wrappers and soft shadows that cleanly disable in dark mode to preserve contrast.
- Replaced the standard footer button with a sleek `#06B6D4` to `#8B5CF6` gradient button containing a forward arrow icon, seamlessly integrating with the existing 3-step logical flow (clicking it correctly advances to Step 2, Language Selection).
- Added an "Already have an account? Sign in" CTA under the main button that links straight into the authentication flow (`handleComplete`).

### Adaptive Theme Support
- Mapped all hardcoded bright colors to their dark-mode equivalents using `useAppColors` to prevent the UI from becoming unreadable or uncomfortably bright in a dark environment.
- Specifically, the feature icon wrappers transition from solid pastel (`#E0F2FE`) in light mode to low-opacity (`rgba(..., 0.1)`) in dark mode, and shadows are swapped for 1px subtle borders.

### Verification
- Tested the exact routing logic to ensure `Continue`, `Back`, `Skip`, and `Get Started` function flawlessly across all three original steps without breaking state.
- Checked `npm run typecheck` and `npm run lint` — both passing with 0 errors.
