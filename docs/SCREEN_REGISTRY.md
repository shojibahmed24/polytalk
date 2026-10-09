# PolyTalk Screen Registry

This registry tracks the status of all planned screens and major UI states (S001–S110).

## Status Definitions
- `planned`: Acknowledged requirement, no work started.
- `in_progress`: Actively being developed.
- `implemented`: UI and basic logic complete, pending full integration.
- `integrated`: Connected to real backend services.
- `verified`: Tested and approved.
- `blocked`: Cannot proceed due to missing dependencies or external blockers.

## Registry

| ID | Screen / State Name | Route / Module | Implementation | Integration | Test | Dependencies / Blockers |
|----|---------------------|----------------|----------------|-------------|------|--------------------------|
| S001 | Splash / Boot | `app/index.tsx` | planned | planned | planned | Initialization logic |
| S002 | Onboarding Flow | `app/(auth)/onboarding.tsx` | planned | planned | planned | Design assets |
| S003 | Sign In / Register | `app/(auth)/login.tsx` | planned | planned | planned | Supabase Auth Integration |
| S004 | Home / Dashboard | `app/(app)/index.tsx` | planned | planned | planned | User profile data |
| S005 | Language Selection | `app/(app)/languages.tsx` | planned | planned | planned | Supported language data |
| S006 | AI Conversation | `app/(app)/chat/[id].tsx` | planned | planned | planned | Puter.js, Speech-to-Text |
| S007 | Grammar Explanation | `src/features/chat/` | planned | planned | planned | Puter.js NLP endpoint |
| S008 | Pronunciation Test | `app/(app)/pronunciation.tsx`| planned | planned | planned | Native Audio APIs, Evaluation SDK |
| S009 | Live Voice Call | `app/(app)/call/[id].tsx` | planned | planned | planned | WebRTC / Agora integration |
| S010 | Learning Summary | `app/(app)/summary/[id].tsx` | planned | planned | planned | Usage tracking metrics |
| S011 | User Profile | `app/(app)/profile.tsx` | planned | planned | planned | User details, Subscriptions |
| S012 | Settings | `app/(app)/settings.tsx` | planned | planned | planned | Local storage / MMKV |
| S013-S110 | *Reserved* | TBD | planned | planned | planned | Further feature definitions |

*(Note: Additional screens will be added and detailed as the application scopes refine.)*
