# PolyTalk Screen Registry

This registry tracks the status of all planned screens and major UI states (S001–S110).

## Status Definitions
- planned: Acknowledged requirement, no work started.
- in_progress: Actively being developed.
- implemented: UI and basic logic complete, pending full integration.
- integrated: Connected to real backend services.
- erified: Tested and approved.
- locked: Cannot proceed due to missing dependencies or external blockers.

## Registry

| ID | Screen / State Name | Intended Feature Module | Route / Owning Module | Implementation | Integration | Test | Dependencies / Blockers |
|----|---------------------|-------------------------|-----------------------|----------------|-------------|------|--------------------------|
| S001 | Splash / Boot | app | app/index.tsx | planned | planned | planned | Initialization logic |
| S002 | Onboarding Flow | onboarding | app/(auth)/onboarding.tsx | planned | planned | planned | Design assets |
| S003 | Sign In / Register | auth | app/(auth)/login.tsx | planned | planned | planned | Supabase Auth |
| S004 | Home / Dashboard | dashboard | app/(tabs)/index.tsx | implemented (scaffold) | planned | planned | User profile data |
| S005 | Language Selection | settings | app/(app)/languages.tsx | planned | planned | planned | Supported language data |
| S006 | AI Conversation | tutor | app/(app)/chat/[id].tsx | planned | planned | planned | Puter.js, Speech-to-Text |
| S007 | Grammar Explanation | grammar | src/features/grammar | planned | planned | planned | Puter.js NLP |
| S008 | Pronunciation Test | pronunciation | app/(app)/pronunciation.tsx | planned | planned | planned | Native Audio APIs |
| S009 | Live Voice Call | calls | app/(app)/call/[id].tsx | planned | planned | planned | WebRTC / Agora |
| S010 | Learning Summary | progress | app/(app)/summary/[id].tsx | planned | planned | planned | Usage tracking metrics |
| S011 | User Profile | profile | app/(app)/profile.tsx | planned | planned | planned | User details |
| S012 | Settings | settings | app/(app)/settings.tsx | planned | planned | planned | Local storage / MMKV |
| S013 | Onboarding Step 1 | onboarding | TBD | planned | planned | planned | TBD |
| S014 | Onboarding Step 2 | onboarding | TBD | planned | planned | planned | TBD |
| S015 | Onboarding Step 3 | onboarding | TBD | planned | planned | planned | TBD |
| S016 | Auth State 1 | auth | TBD | planned | planned | planned | TBD |
| S017 | Auth State 2 | auth | TBD | planned | planned | planned | TBD |
| S018 | Auth State 3 | auth | TBD | planned | planned | planned | TBD |
| S019 | Auth State 4 | auth | TBD | planned | planned | planned | TBD |
| S020 | Auth State 5 | auth | TBD | planned | planned | planned | TBD |
| S021 | Dashboard View 1 | dashboard | TBD | planned | planned | planned | TBD |
| S022 | Dashboard View 2 | dashboard | TBD | planned | planned | planned | TBD |
| S023 | Dashboard View 3 | dashboard | TBD | planned | planned | planned | TBD |
| S024 | Dashboard View 4 | dashboard | TBD | planned | planned | planned | TBD |
| S025 | Dashboard View 5 | dashboard | TBD | planned | planned | planned | TBD |
| S026 | AI Tutor Feature 1 | tutor | TBD | planned | planned | planned | TBD |
| S027 | AI Tutor Feature 2 | tutor | TBD | planned | planned | planned | TBD |
| S028 | AI Tutor Feature 3 | tutor | TBD | planned | planned | planned | TBD |
| S029 | AI Tutor Feature 4 | tutor | TBD | planned | planned | planned | TBD |
| S030 | AI Tutor Feature 5 | tutor | TBD | planned | planned | planned | TBD |
| S031 | AI Tutor Feature 6 | tutor | TBD | planned | planned | planned | TBD |
| S032 | AI Tutor Feature 7 | tutor | TBD | planned | planned | planned | TBD |
| S033 | AI Tutor Feature 8 | tutor | TBD | planned | planned | planned | TBD |
| S034 | AI Tutor Feature 9 | tutor | TBD | planned | planned | planned | TBD |
| S035 | AI Tutor Feature 10 | tutor | TBD | planned | planned | planned | TBD |
| S036 | Speaking Practice 1 | speaking | TBD | planned | planned | planned | TBD |
| S037 | Speaking Practice 2 | speaking | TBD | planned | planned | planned | TBD |
| S038 | Speaking Practice 3 | speaking | TBD | planned | planned | planned | TBD |
| S039 | Speaking Practice 4 | speaking | TBD | planned | planned | planned | TBD |
| S040 | Speaking Practice 5 | speaking | TBD | planned | planned | planned | TBD |
| S041 | Speaking Practice 6 | speaking | TBD | planned | planned | planned | TBD |
| S042 | Speaking Practice 7 | speaking | TBD | planned | planned | planned | TBD |
| S043 | Speaking Practice 8 | speaking | TBD | planned | planned | planned | TBD |
| S044 | Speaking Practice 9 | speaking | TBD | planned | planned | planned | TBD |
| S045 | Speaking Practice 10 | speaking | TBD | planned | planned | planned | TBD |
| S046 | Pronunciation Tool 1 | pronunciation | TBD | planned | planned | planned | TBD |
| S047 | Pronunciation Tool 2 | pronunciation | TBD | planned | planned | planned | TBD |
| S048 | Pronunciation Tool 3 | pronunciation | TBD | planned | planned | planned | TBD |
| S049 | Pronunciation Tool 4 | pronunciation | TBD | planned | planned | planned | TBD |
| S050 | Pronunciation Tool 5 | pronunciation | TBD | planned | planned | planned | TBD |
| S051 | Roleplay Scenario 1 | roleplay | TBD | planned | planned | planned | TBD |
| S052 | Roleplay Scenario 2 | roleplay | TBD | planned | planned | planned | TBD |
| S053 | Roleplay Scenario 3 | roleplay | TBD | planned | planned | planned | TBD |
| S054 | Roleplay Scenario 4 | roleplay | TBD | planned | planned | planned | TBD |
| S055 | Roleplay Scenario 5 | roleplay | TBD | planned | planned | planned | TBD |
| S056 | Roleplay Scenario 6 | roleplay | TBD | planned | planned | planned | TBD |
| S057 | Roleplay Scenario 7 | roleplay | TBD | planned | planned | planned | TBD |
| S058 | Roleplay Scenario 8 | roleplay | TBD | planned | planned | planned | TBD |
| S059 | Roleplay Scenario 9 | roleplay | TBD | planned | planned | planned | TBD |
| S060 | Roleplay Scenario 10 | roleplay | TBD | planned | planned | planned | TBD |
| S061 | Vocabulary Builder 1 | vocabulary | TBD | planned | planned | planned | TBD |
| S062 | Vocabulary Builder 2 | vocabulary | TBD | planned | planned | planned | TBD |
| S063 | Vocabulary Builder 3 | vocabulary | TBD | planned | planned | planned | TBD |
| S064 | Vocabulary Builder 4 | vocabulary | TBD | planned | planned | planned | TBD |
| S065 | Vocabulary Builder 5 | vocabulary | TBD | planned | planned | planned | TBD |
| S066 | Vocabulary Builder 6 | vocabulary | TBD | planned | planned | planned | TBD |
| S067 | Vocabulary Builder 7 | vocabulary | TBD | planned | planned | planned | TBD |
| S068 | Vocabulary Builder 8 | vocabulary | TBD | planned | planned | planned | TBD |
| S069 | Vocabulary Builder 9 | vocabulary | TBD | planned | planned | planned | TBD |
| S070 | Vocabulary Builder 10 | vocabulary | TBD | planned | planned | planned | TBD |
| S071 | Grammar Lesson 1 | grammar | TBD | planned | planned | planned | TBD |
| S072 | Grammar Lesson 2 | grammar | TBD | planned | planned | planned | TBD |
| S073 | Grammar Lesson 3 | grammar | TBD | planned | planned | planned | TBD |
| S074 | Grammar Lesson 4 | grammar | TBD | planned | planned | planned | TBD |
| S075 | Grammar Lesson 5 | grammar | TBD | planned | planned | planned | TBD |
| S076 | Grammar Lesson 6 | grammar | TBD | planned | planned | planned | TBD |
| S077 | Grammar Lesson 7 | grammar | TBD | planned | planned | planned | TBD |
| S078 | Grammar Lesson 8 | grammar | TBD | planned | planned | planned | TBD |
| S079 | Grammar Lesson 9 | grammar | TBD | planned | planned | planned | TBD |
| S080 | Grammar Lesson 10 | grammar | TBD | planned | planned | planned | TBD |
| S081 | Live Translator 1 | translator | TBD | planned | planned | planned | TBD |
| S082 | Live Translator 2 | translator | TBD | planned | planned | planned | TBD |
| S083 | Live Translator 3 | translator | TBD | planned | planned | planned | TBD |
| S084 | Live Translator 4 | translator | TBD | planned | planned | planned | TBD |
| S085 | Live Translator 5 | translator | TBD | planned | planned | planned | TBD |
| S086 | Call Interface 1 | calls | TBD | planned | planned | planned | TBD |
| S087 | Call Interface 2 | calls | TBD | planned | planned | planned | TBD |
| S088 | Call Interface 3 | calls | TBD | planned | planned | planned | TBD |
| S089 | Call Interface 4 | calls | TBD | planned | planned | planned | TBD |
| S090 | Call Interface 5 | calls | TBD | planned | planned | planned | TBD |
| S091 | Progress Report 1 | progress | TBD | planned | planned | planned | TBD |
| S092 | Progress Report 2 | progress | TBD | planned | planned | planned | TBD |
| S093 | Progress Report 3 | progress | TBD | planned | planned | planned | TBD |
| S094 | Progress Report 4 | progress | TBD | planned | planned | planned | TBD |
| S095 | Progress Report 5 | progress | TBD | planned | planned | planned | TBD |
| S096 | Profile Section 1 | profile | TBD | planned | planned | planned | TBD |
| S097 | Profile Section 2 | profile | TBD | planned | planned | planned | TBD |
| S098 | Profile Section 3 | profile | TBD | planned | planned | planned | TBD |
| S099 | Setting Panel 1 | settings | TBD | planned | planned | planned | TBD |
| S100 | Setting Panel 2 | settings | TBD | planned | planned | planned | TBD |
| S101 | Setting Panel 3 | settings | TBD | planned | planned | planned | TBD |
| S102 | Setting Panel 4 | settings | TBD | planned | planned | planned | TBD |
| S103 | Setting Panel 5 | settings | TBD | planned | planned | planned | TBD |
| S104 | Service Status / Error Edge State 1 | system | TBD | planned | planned | planned | TBD |
| S105 | Service Status / Error Edge State 2 | system | TBD | planned | planned | planned | TBD |
| S106 | Service Status / Error Edge State 3 | system | TBD | planned | planned | planned | TBD |
| S107 | Service Status / Error Edge State 4 | system | TBD | planned | planned | planned | TBD |
| S108 | Service Status / Error Edge State 5 | system | TBD | planned | planned | planned | TBD |
| S109 | Service Status / Error Edge State 6 | system | TBD | planned | planned | planned | TBD |
| S110 | Service Status / Error Edge State 7 | system | TBD | planned | planned | planned | TBD |

