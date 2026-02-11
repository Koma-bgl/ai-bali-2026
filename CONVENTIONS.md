# Project Conventions

All agents (coder, test writer, reviewer) MUST follow these rules on every ticket.

---

## Component Architecture

- **Self-contained components.** Each component lives in its own folder: `src/components/{ComponentName}/index.tsx` + `schema.ts`.
- **Never modify shared registration files.** Do NOT edit `src/catalog.ts` or `src/registry.tsx`. Wiring components into the catalog/registry is a separate, sequential ticket.
- **Default exports only.** Components use `export default function ComponentName(...)`, never named exports for the component itself.
- **Schema co-location.** Each component exports its own Zod schema and inferred type from `schema.ts`. This allows the registry wiring ticket to import them later.

## json-render Component Signature

json-render wraps props in a `{ props, children, emit }` object. Follow this exact pattern:

```typescript
// schema.ts
import { z } from "zod";
export const MyComponentSchema = z.object({ /* ... */ });
export type MyComponentProps = z.infer<typeof MyComponentSchema>;

// index.tsx
import type { MyComponentProps } from "./schema";
export default function MyComponent({ props }: { props: MyComponentProps }) {
  // ...
}
```

**Do NOT:**
- Use `React.FC<Props>` — it doesn't match json-render's `ComponentFn` type
- Destructure props directly like `function MyComponent({ title, body }: Props)` — json-render wraps them in `{ props }`
- Use named exports for the component (default only)
- Import `{ BetCardProps }` — use `import type { BetCardProps }` from the local `schema.ts`

## Test Writer Rules

- **Only test files created by this ticket.** Do NOT write or modify tests for components that already exist or belong to other tickets.
- **Do NOT re-run pre-existing tests** that import components outside the scope of the current ticket.
- **Test file naming:** `tests/{componentname}.test.tsx` (lowercase, matching the component folder).
- **Scope check:** Before writing any test, verify the import target was actually created in this ticket's worktree by the coder. If a file wasn't created by the coder, don't test it.

## Coder Rules

- **Stay in scope.** Only create or modify files directly related to the current ticket. Do not refactor unrelated code.
- **Read before write.** Always `read_file` existing files before modifying them to understand current state.
- **No orphan imports.** Do not add imports in shared files that reference components being built in parallel worktrees — they won't exist.

## Styling

- Use Tailwind utility classes for all styling.
- No inline style objects unless Tailwind can't express it (e.g., dynamic values).
- No CSS files or CSS modules.

## TypeScript

- Strict mode: `tsc --noEmit` must pass with no errors.
- No `any` types.
- All props must have explicit types derived from Zod schemas.
