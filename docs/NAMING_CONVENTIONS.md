# PolyTalk Naming Conventions

This document outlines the strict naming conventions for the PolyTalk application. Consistent naming is critical for maintainability and discoverability across a large React Native codebase.

## 1. Folders
- **Convention:** Lowercase, descriptive names. Use `kebab-case` for multiword directories.
- **Correct:** `src/components/ui`, `src/features/roleplay`, `src/features/speech-recognition`
- **Incorrect:** `src/Components/UI`, `src/features/rolePlay`, `src/features/SpeechRecognition`

## 2. React Components (Screens and UI)
- **Convention:** `PascalCase.tsx`
- **Correct:** `PrimaryButton.tsx`, `ConversationScreen.tsx`, `OnboardingLayout.tsx`
- **Incorrect:** `primary-button.tsx`, `ConversationScreen.ts`, `button.jsx`

## 3. React Hooks
- **Convention:** Filenames beginning with `use` in `camelCase.ts` (or `camelCase.tsx` if returning JSX, though rare).
- **Correct:** `useConversation.ts`, `useAuthSession.ts`, `usePronunciationScore.ts`
- **Incorrect:** `ConversationHook.ts`, `use_conversation.ts`, `Hooks.ts`

## 4. Utilities and Helper Functions
- **Convention:** Descriptive `camelCase.ts` names reflecting the function's action.
- **Correct:** `formatDuration.ts`, `calculateScore.ts`, `audioPermissions.ts`
- **Incorrect:** `utils.ts`, `helpers.ts`, `FormatDuration.ts`, `misc.ts`

## 5. Types and Interfaces
- **Convention:** Descriptive names. Files in `camelCase.ts` or `kebab-case.ts`. Interfaces and Types themselves MUST be `PascalCase`.
- **Correct:** `export interface UserProfile {}`, `export type ConversationMessage = {}` (in `userProfile.ts` or `types.ts`).
- **Incorrect:** `export interface userProfile {}`, `export interface IUserProfile {}` (avoid `I` prefixes unless strictly required by a specific external lib, though generally discouraged).

## 6. Constants
- **Convention:** Filenames in `camelCase.ts` or `kebab-case.ts`. Variables must be `UPPER_SNAKE_CASE` for true shared constants.
- **Correct:** `export const MAX_RECORDING_DURATION = 60000;`
- **Incorrect:** `export const maxRecordingDuration = 60000;`, `export const MaxRecordingDuration = 60000;`

## 7. Services (External API Adapters)
- **Convention:** Clear provider or domain names in `camelCase.ts`. Only create the file when the service is actually implemented.
- **Correct:** `puterAiService.ts`, `translationService.ts`, `supabaseAuthService.ts`
- **Incorrect:** `api.ts`, `fetcher.ts`, `Service.ts`

## 8. Repositories (Data Access)
- **Convention:** Descriptive domain names in `camelCase.ts`. Only create when implemented.
- **Correct:** `conversationRepository.ts`, `userProgressRepository.ts`
- **Incorrect:** `database.ts`, `queries.ts`, `ConversationRepository.ts`

## 9. Validation Schemas
- **Convention:** Descriptive schema names in `camelCase.ts`.
- **Correct:** `signInSchema.ts`, `messageValidation.ts`
- **Incorrect:** `schemas.ts`, `validation.ts`, `SignInSchema.ts`

## 10. Expo Router Routes
- **Convention:** Follow Expo Router's file-based routing conventions strictly. Routes represent URLs, so they should be lowercase and URL-safe.
- **Correct:** `app/(auth)/sign-in.tsx`, `app/dashboard.tsx`, `app/_layout.tsx`
- **Incorrect:** `app/SignIn.tsx`, `app/_Layout.tsx`, `app/DashboardScreen.tsx` (the URL would look like `/DashboardScreen`).

## 11. Tests
- **Convention:** Consistent `*.test.ts` or `*.test.tsx` alongside the file being tested or within a `__tests__` or `test/` directory.
- **Correct:** `formatDuration.test.ts`, `PrimaryButton.test.tsx`
- **Incorrect:** `formatDuration.spec.ts` (if mixed with `.test.ts`), `testFormatDuration.ts`

## 12. Exports
- **Convention:** Use **named exports** for utilities, hooks, constants, types, services, and reusable components to ensure better refactoring and intellisense.
- **Exception (Default Exports):** **Expo Router routes** (`app/**/*.tsx`) MUST use default exports as required by the framework. React components wrapped in `React.memo` or `forwardRef` may also use default exports if necessary, but named exports are preferred where possible.

## 13. Boolean Values (Variables and Props)
- **Convention:** Use meaningful prefix names indicating a true/false state.
- **Correct:** `isRecording`, `hasPermission`, `canSubmit`, `shouldAnimate`
- **Incorrect:** `recording`, `permission`, `submitState`, `animating`

## 14. Event Handlers
- **Convention:** Local handler functions inside components should use `handle[Action]`. Props passed to components should use `on[Action]`.
- **Correct:** `const handleSubmit = () => {}`, `<PrimaryButton onPress={handleSubmit} />`
- **Incorrect:** `const submit = () => {}`, `<PrimaryButton click={handleSubmit} />`

## 15. Avoid Vague Naming
- **Strictly Prohibited:** `data1`, `temp2`, `helper`, `common`, `misc`, `stuff`, `manager`.
- **Reasoning:** Names must describe the content or purpose. If a file is named `misc.ts`, its boundaries are undefined, leading to a dumping ground for unrelated code.
