# Repository Guidelines

## Project Structure & Module Organization

This directory contains the OpenArchive React and TypeScript frontend. Application code lives in `src/`: domain components in `components/`, shared hooks in `hooks/`, API and utility functions in `lib/`, domain types in `types/`, and global CSS in `styles/`. Component styles and assets live beside their components. Tests and fixtures also stay beside the code they exercise. `playwright/` contains the browser test harness.

Consume shared UI components and utilities from `@lemuel-manske/components` and `@lemuel-manske/utils`. Keep application-specific API calls and domain logic in this frontend.

## Build, Test, and Development Commands

Run commands from `frontend/`:

- `npm ci`: install locked dependencies.
- `npm run dev`: start the Vite development server.
- `npm run build`: compile TypeScript projects and build production assets.
- `npm run test`: type-check test tooling, then run Jest and Playwright.
- `npm run lint`: check ESLint rules; `npm run lint:fix` applies fixes.
- `npm run format`: check Prettier formatting; `npm run format:fix` applies formatting.

Reuse the installed `@lemuel-manske/config-*` packages for tooling configuration.

## Coding Style & Naming Conventions

Use TypeScript, functional React components, two-space indentation, and the shared Prettier configuration. Name components in PascalCase and hooks with a `use` prefix. Use kebab-case component directories and `*.module.css` for component styles.

Declare props explicitly, separate rendering from prop resolution through hooks, and use `cx` from the shared utilities for conditional classes. Place exports at the end of files. Add blank lines between logical blocks and sibling JSX elements. Preserve native semantics, keyboard access, visible focus, and label associations.

## Testing Guidelines

Use Jest for functions in `*.test.ts` and Playwright for components and hooks in `*.test.tsx`. Name fixtures `*.test-fixture.tsx` or `*.test-fixture.ts`. Render JSX directly and assert public behavior and accessible names. Keep one behavior per case; avoid loops, `test.describe`, CSS assertions, and geometry assertions. Use the shared axe matcher, `await expect(page).noAccessibilityViolations()`. Preserve Playwright's pinned 1.62 JSX support.

## Commit & Pull Request Guidelines

Follow the existing Conventional Commits style, such as `feat(frontend): add capture timeline` or `fix(frontend): correct replay handling`. Keep changes focused. Describe the problem, resulting behavior, and validation in pull requests; link related issues and include screenshots when UI changes benefit from visual review. Run relevant test, lint, format, and build checks before requesting review.
