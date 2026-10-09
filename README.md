# PolyTalk

Android-first React Native application using Expo, TypeScript, and Expo Router.

## Project Architecture & Guidelines

### Feature-Based Structure
The project follows a maintainable feature-based structure separating concerns:
- `app/` - Expo Router routes
- `src/screens/` - Screen layouts and compositions (Target: < 150 lines)
- `src/components/` - Reusable UI elements (Target: 30–120 lines)
- `src/hooks/` - Custom React hooks
- `src/services/` - External APIs, business logic, and integrations
- `src/types/` - TypeScript interface and type definitions
- `src/utils/` - Helper functions and utilities
- `src/tests/` - Test suites
- `src/config/` - App configuration and environment variables

*Code Quality Note: Any file exceeding 200 lines requires immediate review for extraction.*

### Premium Design System
- **Base Theme**: Premium Dark Navy
- **Accent Colors**: Cyan and Purple

## S001–S110 Screen Registry

| ID | Screen Name | Implementation Status | UI Status | Integration Status | Test Status |
|----|-------------|-----------------------|-----------|--------------------|-------------|
| S001 | Splash / Loading | Pending | Pending | Pending | Pending |
| S002 | Onboarding | Pending | Pending | Pending | Pending |
| S003 | Authentication (Login/Register) | Pending | Pending | Pending | Pending |
| S004 | Home Dashboard | Pending | Pending | Pending | Pending |
| S005 | Language Selection | Pending | Pending | Pending | Pending |
| S006 | Lesson Interface | Pending | Pending | Pending | Pending |
| S007 | Speech Practice | Pending | Pending | Pending | Pending |
| S008 | Pronunciation Feedback | Pending | Pending | Pending | Pending |
| S009 | Live Call / Peer Connect | Pending | Pending | Pending | Pending |
| S010 | Profile & Settings | Pending | Pending | Pending | Pending |
| *S011-S110* | *Reserved for future features* | - | - | - | - |

## Testing & Environment Strategy

### Expo Go vs. Development Builds
- **Expo Go**: Will be used for rapid initial UI prototyping and layout building.
- **Development Builds**: Mandatory for testing native modules (Speech Recognition, TTS, Live Calls). Expo Go will not support these hardware/native level integrations.

### Android Testing
- **Android Studio (Emulator)**: Used for general layout verification across different screen sizes.
- **Physical Device Testing**: Crucial for testing microphone inputs (speech recognition), audio outputs (TTS), and camera/audio (live calls).

## Compatibility Boundaries

- **Puter.js**: Needs verification for React Native compatibility (often relies on browser `window` object). May need a webview fallback or specific RN polyfills.
- **Supabase**: Fully compatible with React Native using `@supabase/supabase-js` and `react-native-url-polyfill`.
- **Speech Recognition**: Requires native modules (e.g., `@react-native-voice/voice` or `expo-speech`). Development build mandatory.
- **Text-to-Speech (TTS)**: Can use `expo-speech` which works across platforms.
- **Pronunciation Assessment**: Dependent on the external API (e.g., Azure Speech SDK). The JS SDK may require browser APIs, potentially necessitating a custom native module or webview.
- **Live Calls**: Requires WebRTC (e.g., `react-native-webrtc`) or a service like Agora. Development build mandatory; permissions handling (camera/mic) is critical.
