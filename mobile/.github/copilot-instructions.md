# Copilot Instructions for This Codebase

## Overview
This is a React Native app bootstrapped with Expo and using the `expo-router` for file-based navigation. The project is TypeScript-first and follows Expo's conventions, but includes some custom structure and scripts.

## Key Architecture & Patterns
- **File-based Routing:**
  - All screens and navigation are defined by the folder/file structure under `app/`.
  - The main layout is in `app/_layout.tsx`, which sets up navigation and theming.
  - Tabs are defined in `app/(tabs)/` with their own `_layout.tsx` and screen files.
- **Theming:**
  - Theme logic is in `constants/theme.ts` and `hooks/use-color-scheme.ts`.
  - Uses `@react-navigation/native` themes and a custom hook for color scheme.
- **Components:**
  - Shared UI components are in `components/` and `components/ui/`.
  - Use these for consistent look and feel.
- **Assets:**
  - Images and icons are in `assets/images/`.
  - App icons and splash screens are configured in `app.json`.
- **TypeScript Paths:**
  - The alias `@/` maps to the project root (see `tsconfig.json`).
  - Example: `import { useColorScheme } from '@/hooks/use-color-scheme'`.

## Developer Workflows
- **Install dependencies:**
  - `npm install`
- **Start development server:**
  - `npx expo start` (or use `npm run android`, `npm run ios`, `npm run web`)
- **Linting:**
  - `npm run lint` (uses Expo's ESLint config)
- **Reset project to blank state:**
  - `npm run reset-project` (moves current code to `app-example/` and creates a fresh `app/`)
- **Routing:**
  - Add new screens by creating files in `app/` or `app/(tabs)/`.
  - Use `[param].tsx` for dynamic routes.

## Conventions & Tips
- **Use file-based routing for navigation.**
- **Prefer functional components and hooks.**
- **Use the `@/` alias for imports from project root.**
- **Keep shared logic in `hooks/` and `components/`.**
- **Do not edit files in `app-example/` unless resetting.**
- **Follow Expo/React Native best practices for assets and configuration.**

## External Integrations
- **Expo Plugins:**
  - See `app.json` for plugins like `expo-router` and `expo-splash-screen`.
- **React Navigation:**
  - Navigation is handled via `@react-navigation/native` and `expo-router`.

## References
- `README.md` — Getting started, reset instructions
- `scripts/reset-project.js` — Project reset logic
- `app.json` — Expo configuration
- `tsconfig.json` — TypeScript paths and strictness
- `components/`, `hooks/`, `constants/` — Shared logic and UI

---

For more details, see Expo docs: https://docs.expo.dev/
