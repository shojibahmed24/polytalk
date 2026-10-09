# Quality Gates

PolyTalk enforces strict code quality checks via TypeScript and ESLint. Code that fails these checks will not be merged into the `main` branch.

## 1. TypeScript Strict Mode

We use the official Expo TypeScript compiler configurations with added strictness.

- **Command:** `npm run typecheck` (executes `tsc --noEmit`)
- **Included Files:** All `.ts` and `.tsx` files in `app/` and `src/` (configured via `tsconfig.json`).
- **Interpretation:** If `tsc` outputs errors, there are type mismatches, missing properties, or potential runtime crash vectors in your code.
- **Resolution:** **Do not suppress errors**. Fix the underlying type issue. You must not use `@ts-nocheck` or `any` simply to silence the compiler. If a third-party library is untyped, write a declaration file (`.d.ts`) rather than casting everything to `any`.

## 2. ESLint

ESLint enforces code style, hooks correctness, and prevents common logic errors.

- **Command:** `npm run lint` (executes `eslint .`)
- **Included Files:** All project source files. Build artifacts (`dist/`) and Expo internals (`.expo/`) are ignored.
- **Interpretation:** Errors indicate a violation of core React/React Native rules (such as conditionally calling hooks) or strict typing rules (like unused variables or explicit `any` usage).
- **Resolution:** **Errors must be fixed.** The use of `// eslint-disable-next-line` is strictly prohibited unless there is a rare, documented, and justified exception (e.g., interacting with a legacy third-party dependency that forces an unsafe pattern).

## 3. Pre-Commit Checklist

Before committing any code to the repository, you **must** run and pass both checks:

1. `npm run lint`
2. `npm run typecheck`

If either command fails, the code is considered broken and must not be pushed to the repository.
