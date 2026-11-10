# Frontend

## Structure

- All frontend code lives in `/frontend`, with npm workspaces in `packages/`.
- `components`: white-label React components and their hooks. No business logic, domain logic, or API calls.
- `design-tokens`: typed tokens, shared enums, and CSS generated at build time.
- `utils`: shared functions and `useAccessibility`.
- `config-*`: TypeScript, ESLint, Vite, Prettier, Jest, and Playwright configurations. Import and reuse them.
- Base components must not depend on compositions such as `Form`, or their hooks, types, or styles. Dependencies must point from compositions to base components.
- Keep components small and abstractions few. Compositions such as `Form.Button` reuse the base component.

## Code and style

- Sizes and variants have explicit APIs: `LabelSize.SMALL`, `ButtonVariant.PRIMARY`.
- Derive options from the `Size` and `Variant` enums in `design-tokens`, using subsets of `typeof` when needed.
- Declare props explicitly. Do not expose the entire DOM contract through `ComponentProps*` or `HTMLAttributes`.
- Separate rendering from prop resolution through hooks such as `useButton` and `useLabel`.
- Use `cx` from `utils` for conditional classes.
- Place exports at the end of the file, separate from declarations. Never export inline.
- Always add **blank lines** between logical blocks of code: imports, declarations, execution steps, test actions and assertions, exports, and sibling JSX elements.
- Omit a blank line only when keeping a cohesive group makes sense, such as object properties or JSX element attributes. **When in doubt, add a blank line!**
- Apply this rule to components, hooks, fixtures, and stories as well. Prettier does not replace this readability review.

## Accessibility

- WCAG 2.2 AA by default: native semantics, keyboard support, visible focus, contrast, and associations between labels and fields.
- Centralize shared behavior in `useAccessibility`, in `utils`.
- Components control roles, focus order, and disabled state. Do not shift this responsibility to consumers.

## Tests

- Tests and fixtures live beside the corresponding source code. Test components and hooks.
- Functions: Jest with `config-jest`, in `.test.ts` files.
- Components and hooks: Playwright with `config-playwright`, in `.test.tsx` files.
- Use `render(<Button>Save</Button>)` directly and its return value in assertions. Tests do not depend on Storybook.
- Keep tests small and direct, with one behavior per case. Combine behaviors only when necessary.
- Never use loops or `test.describe` in tests.
- Verify public behavior and accessible names. Do not couple tests to implementation, CSS, classes, or geometry.
- No dedicated type tests or visual tests in this suite.
- Accessibility: `await expect(page).noAccessibilityViolations()`, using the axe-core matcher from `config-playwright`.
- Preserve Playwright's direct JSX support, currently pinned to 1.62.
- Storybook is for component documentation and review.

## Tooling

- Each package has `lint`, `lint:fix`, `format`, and `format:fix`. `lint` and `format` check; the `:fix` variants apply fixes.
- Do not create redundant aliases, such as `format:check` duplicating `format`.
- Each `.prettierrc.json` references `@openarchive/config-prettier`.
- Ignore rules live in `config-prettier/.prettierignore`; other locations use symlinks.
- Run the checks relevant to the change from `/frontend`: `npm run test`, `npm run lint`, `npm run format --workspaces`, `npm run build`, and `npm run build:storybook`.
