# Integration Plan & Boundaries

This document defines the integration strategy for PolyTalk's external dependencies. It strictly distinguishes between verified integrations and unverified assumptions to prevent blocked development down the line. 

*No fake adapters or simulated success states will be committed.*

## 1. Supabase (Backend as a Service)
- **Scope:** Authentication, PostgreSQL database, Storage, Authorization, and Row Level Security (RLS).
- **Strategy:** Use `@supabase/supabase-js`. 
- **Status (Unverified Assumption):** While generally compatible with React Native (requiring `react-native-url-polyfill`), we have not yet verified the exact Expo setup or OAuth flow on Android.
- **Action Plan:** Implement a minimal auth client and test JWT issuance and RLS enforcement before building UI screens.

## 2. Puter.js (AI Integration)
- **Scope:** Core AI processing for conversation, grammar correction, translation assistance, and learning summaries.
- **Status (Unverified Assumption):** It is assumed Puter.js provides a JS SDK. However, many JS SDKs for AI providers rely on browser-only APIs (like `window` or `fetch` streams). 
- **Action Plan (Critical):** Must build a React Native compatibility proof-of-concept (POC). If the Puter.js SDK is incompatible with React Native's JS engine (Hermes), we will need to either wrap it in a lightweight webview, build custom native modules, or hit their REST API directly.

## 3. Speech Recognition & Text-to-Speech (TTS)
- **Scope:** Real-time speech input and AI voice generation.
- **Status (Unverified Assumption):** Expo Go does not natively support advanced speech recognition beyond basic OS limits.
- **Action Plan:** Must migrate to an **Expo Development Build**. For TTS, `expo-speech` can be evaluated. For Speech-to-Text, `@react-native-voice/voice` is the likely candidate. Both require native compilation and physical Android device testing to verify permissions and latency.

## 4. Pronunciation Evaluation
- **Scope:** Real-time scoring of user speech against native baselines.
- **Status (Unverified Assumption):** Requires a specialized external API (e.g., Azure Speech SDK or a dedicated Puter.js endpoint). 
- **Action Plan:** Determine if the provider's SDK works on mobile or if raw audio must be streamed via WebSockets/REST. 

## 5. Real-Time Translated Voice Calls
- **Scope:** Peer-to-peer or server-relayed live voice communication.
- **Status (Unverified Assumption):** Complex. React Native WebRTC (`react-native-webrtc`) or an SDK like Agora is necessary. 
- **Action Plan:** Cannot be done in Expo Go. Requires Development Builds, strict camera/microphone permission handling, and background audio execution testing on Android.

## 6. Subscription and AI Usage Tracking
- **Scope:** Monetization and token/quota tracking to prevent abuse.
- **Strategy:** Track AI tokens used per user via Supabase Edge Functions or Postgres triggers. Integration with RevenueCat or native billing.
- **Status (Unverified Assumption):** Requires Native modules for billing. 

## 7. Offline Handling, Retries, & Rate Limits
- **Scope:** Resilient user experience under poor network conditions.
- **Strategy:** Implement a robust retry mechanism (e.g., React Query / SWR) and SQLite (e.g., `expo-sqlite`) or MMKV for local caching. Service outages must fail gracefully with explicit user messaging.

## 8. Privacy, Permissions, & Security
- **Scope:** Secure data handling, microphone permissions, and credential safety.
- **Strategy:**
  - Microphone/Camera permissions requested *only* precisely when needed with clear UI explanations.
  - **No secrets in client:** All service-role keys must reside on a secure backend (e.g., Supabase Edge Functions). Only Anon/Public keys are permitted in the client `.env`.
