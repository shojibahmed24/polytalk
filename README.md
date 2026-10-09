# PolyTalk

Android-first React Native application using Expo, TypeScript, and Expo Router.

## Project Architecture & Guidelines

### Feature-Based Structure
The project follows a maintainable feature-based structure separating concerns:
- `app/` - Expo Router routes
- `src/features/` - Screen layouts and core features
- `src/components/` - Reusable UI elements (Target: 30–120 lines)
- `src/hooks/` - Custom React hooks
- `src/services/` - External APIs, business logic, and integrations
- `src/types/` - TypeScript interface and type definitions
- `src/utils/` - Helper functions and utilities
- `src/test/` - Test suites
- `src/theme/` - App configuration and environment variables

*Code Quality Note: Any file exceeding 200 lines requires immediate review for extraction.*

## Developer Guide (Windows & Android Focus)

### Prerequisites on Windows
1. **Node.js**: v24+ recommended.
2. **Git**: Ensure Git is installed and configured in your PowerShell/terminal.
3. **Android Studio**: Required to run the Android Emulator. Ensure the Android SDK and standard environment variables (`ANDROID_HOME`) are configured.
4. **Physical Android Device** (Optional but highly recommended): Must have USB debugging enabled and connected via USB or Wi-Fi.

### Installation
1. Clone the repository: `git clone https://github.com/shojibahmed24/polytalk.git`
2. Run `npm install` (if using strict environments, you may need `npm install --ignore-scripts`).
3. Setup environment variables by copying `.env.example` to `.env`.

### Starting the Application
- **Start Expo Metro Bundler**: `npm run start`
- **Launch on Android Emulator / Device**: `npm run android`
- **Note**: This is an Android-first application. Testing on iOS is secondary and requires a macOS build environment.

### Verification & CI Checks
We enforce strict linting and TypeScript checks. Run these before committing:
- **Lint Code**: `npm run lint`
- **Type Check**: `npm run typecheck`

### Testing & Environment Strategy

**Expo Go vs. Development Builds**
- **Expo Go**: Currently supported for the UI shell. This is a pre-compiled Expo client used for rapid UI iteration.
- **Development Builds**: **Mandatory for later phases**. Once we add native audio (Speech Recognition, TTS, WebRTC), Expo Go will no longer suffice. We will require custom Development Builds using `npx expo run:android` which compiles the native code.

### Known Environment Limitations
- **No macOS Environment**: iOS testing cannot currently be verified beyond Expo Go.
- **Puter.js SDK Compatibility**: Many JS AI SDKs assume a web browser environment. We must ensure it's compatible with React Native's Hermes engine.

### GitHub Synchronization
The canonical remote is `origin -> https://github.com/shojibahmed24/polytalk.git`.
- **Branch Strategy**: Development targets the `main` branch.
- **Secrets**: Never commit `.env` files. Ensure they remain safely inside `.gitignore`.
