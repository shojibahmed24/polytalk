# PolyTalk Master Roadmap

This document serves as the canonical sequence of tasks for the PolyTalk project. Future agents must not independently choose the next feature or change task numbers.

## Phase 1: Foundation and Architecture
- **P001** — Repository audit and initial foundation
- **P002** — Architecture and integration boundaries
- **P003** — Folder structure and naming conventions, including the already completed Expo initialization work
  *(Note: A historical numbering conflict occurred where Expo initialization was executed under the original P003 number before the corrected P003 structural task. Both are complete).*
- **P004** — TypeScript configuration and linting
- **P005** — Master roadmap lock and design tokens/theme foundation

## Phase 2: Core UI Components
- **P006** — Reusable Typography and Layout Components (Refined scope as typography/spacing tokens were completed in P005)
- **P007** — Reusable buttons, inputs and form primitives
- **P008** — Cards, surfaces, dialogs, sheets and feedback components
- **P009** — Shared screen layouts, safe areas and keyboard handling
- **P010** — Navigation shell and route conventions
- **P011** — Theme, accessibility and responsive layout verification (Completed)

## Phase 3: Screen Inventory (S001–S110)
- **P012** — Onboarding UI & First-Run Experience (Completed)
- **P013** — Authentication UI: Sign In, Registration & Validation States (Completed)
- **P014** — Premium Home Dashboard UI (S004) (Completed)
- **P015** — Language Selection UI (S005) (Completed)
- **P016** — AI Conversation UI (S006) (Completed)
- **P017 onward** — Implement the remaining S001–S110 screen/state inventory in small, feature-based increments.
  - Implement onboarding and authentication UI before integrating backend authentication.
  - Implement dashboard, AI tutor, speaking, pronunciation, roleplay, vocabulary, grammar, translator, calls, progress, profile, settings and error states in documented subphases.
  - Build functional local UI behavior where appropriate, but never represent local-only behavior as server-persisted or AI-powered.
  - Do not generate all screens in one prompt.

## Phase 4: Backend & Database (Supabase)
1. Verify the Supabase project, environment configuration and SDK compatibility.
2. Design and review the PostgreSQL schema, migrations, indexes and relationships.
3. Design Row Level Security policies and verify authorization boundaries.
4. Configure the Supabase client and secure session persistence for React Native.
5. Implement authentication and account lifecycle.
6. Implement typed repositories for profiles, conversations, learning history, vocabulary and progress.
7. Implement secure storage and account data operations.
8. Test persistence, permissions, session recovery and failure handling.
*(These will be divided into separate P-tasks.)*

## Phase 5: AI Integration (Puter.js)
1. Investigate Puter.js compatibility with React Native and Android Hermes.
2. Build a minimal compatibility proof-of-concept before choosing the final integration.
3. Verify supported models, authentication requirements, quotas and pricing.
4. Define a typed AI provider interface.
5. Implement and test text-based AI tutoring and correction.
6. Implement speech-to-text and text-to-speech using compatible native modules or services.
7. Implement pronunciation feedback only when the selected technology provides sufficient evidence for the claimed analysis.
8. Implement translation, audio playback and conversation transcripts.
9. Add retries, timeouts, cancellation, usage accounting and provider-failure handling.

## Phase 6: Real-Time Communication
1. Evaluate and select a suitable real-time communication provider or WebRTC architecture.
2. Verify Android native compatibility and required Development Build configuration.
3. Implement microphone permissions, audio lifecycle and connection management.
4. Implement the real-time call flow.
5. Integrate translation and speech playback into the call only after the underlying call flow is verified.
6. Test interruption, reconnection, network changes, call termination and privacy.
7. Document any required paid service or server-side infrastructure.
*(A mock call screen must never be described as a working voice call.)*

## Phase 7: Polish & Release
1. Implement remaining settings, help, usage and subscription functionality according to the actual requirements.
2. Audit all S001–S110 states.
3. Run unit, integration and end-to-end tests.
4. Perform security, privacy, performance and accessibility reviews.
5. Test on an actual Android device.
6. Build and verify the release artifact.
7. Document deployment, operational requirements and known limitations.
