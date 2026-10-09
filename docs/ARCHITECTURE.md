# PolyTalk Application Architecture

## Target Structure
The PolyTalk application employs a feature-oriented architecture optimized for a large, maintainable Android-first React Native (Expo) application:

```text
app/                 # Expo Router route files and navigation layouts
src/
 ├── components/
 │    ├── ui/        # Reusable, accessible UI primitives (buttons, inputs, modals)
 │    └── layout/    # App shell, headers, navigation and layout components
 ├── features/       # Feature-specific screens, components, hooks, schemas and logic
 │   ├── onboarding/ # Initial user setup and configuration
 │   ├── auth/       # Authentication, login, and registration logic
 │   ├── dashboard/  # Main home screen and navigation center
 │   ├── tutor/      # General AI tutor interactions
 │   ├── speaking/   # Voice recording and interaction
 │   ├── roleplay/   # Scenario-based AI conversations
 │   ├── vocabulary/ # Flashcards and word learning
 │   ├── grammar/    # Grammar lessons and corrections
 │   ├── translator/ # Real-time translation tools
 │   ├── calls/      # Live WebRTC voice communication
 │   ├── progress/   # Learning analytics and metrics
 │   ├── profile/    # User settings and subscriptions
 │   └── settings/   # App configuration and preferences
 ├── services/       # External service adapters (Supabase, Puter.js, Speech, Calls)
 ├── repositories/   # Typed data-access operations (Supabase DB interactors)
 ├── lib/            # Initialized clients and shared infrastructure (e.g. Supabase client)
 ├── hooks/          # Genuinely shared React hooks across multiple features
 ├── types/          # Shared domain and API TypeScript definitions
 ├── utils/          # Small, pure helper functions
 ├── constants/      # Application-wide constants
 ├── theme/          # Design tokens and theme configuration (dark navy, cyan/purple)
 ├── validation/     # Reusable input and API validation schemas (e.g. Zod schemas)
 └── test/           # Test utilities and global test configurations
docs/                # Architecture, integrations, testing and release documentation
```

**Rule:** Every created directory or file must serve a distinct purpose. No empty structures are permitted. Expo Router (`app/`) files must remain thin, delegating state and UI complexity to modules within `src/`.

## Module Responsibilities

1. **Screens (`src/features/*/screens/`):** Coordinate presentation, pull data from hooks/repositories, and manage user interactions.
2. **UI Components (`src/components/ui/`):** Handle reusable presentation, styling, and strict accessibility.
3. **Hooks (`src/hooks/` or `src/features/*/hooks/`):** Encapsulate reusable React state, side-effects, and business logic tied to the React lifecycle.
4. **Services (`src/services/`):** Solely responsible for communicating with external providers and APIs. They isolate the rest of the application from third-party SDK quirks.
5. **Repositories (`src/repositories/`):** Abstract data persistence and querying operations (e.g., encapsulating Supabase queries to return domain models).
6. **Domain Types (`src/types/`):** Define standard application entities and DTOs.
7. **Validation Schemas (`src/validation/`):** Ensure user input and external data conform to expected formats before processing.
8. **Tests:** Ensure business logic, service boundaries, and critical user flows remain intact during refactoring.

**Anti-patterns strictly prohibited:**
- Mixing database queries, AI-provider calls, and massive UI trees in a single file.
- Circular dependencies.
- Suppressing TypeScript or ESLint errors without explicit documentation and justification.

## File-Size and Quality Guidelines

These targets serve as review thresholds to encourage modularity, not as arbitrary fragmentation rules:
- **Reusable components:** 30–120 lines.
- **Screen composition:** Preferably under 150 lines.
- **Max File Limit:** Any file exceeding 200 lines requires immediate review for extraction of responsibilities.
- **Domain Logic:** Must be split by specific responsibility (e.g., auth, progress, media).

Do not fragment logically cohesive code merely to pass line-count metrics if it harms readability.
