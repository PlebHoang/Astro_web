## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Architecture & Maintainability Rules

1. **File Size Limits (Anti-Blob Discipline)**:
   - Target line count: Under 250 lines per file.
   - Hard cap: 400 lines. If a file exceeds 400 lines, it must be split into focused helper modules.
2. **Separation of Concerns**:
   - `src/data/`: Static catalogs, data tables, coordinates, and configuration. Zero DOM/canvas logic.
   - `src/lib/`: Pure math, algorithms, canvas rendering pipelines, and state stores.
   - `src/components/`: Markup, styling, and event binding only.
3. **High-Teeth Automated Testing**:
   - All interactive UI flows (clicks, keybinds, state transitions) must be verified via `test.mjs` (using Chrome CDP / interactive assertions).
   - Never rely solely on static HTML string matching (`includes()`) for dynamic user interactions.
4. **Surgical Changes**:
   - Clean up dead code and abandoned prototypes once a design decision is finalized.
   - No speculative abstractions for single-use features.

