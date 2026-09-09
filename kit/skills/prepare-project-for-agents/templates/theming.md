# Theming

Load before adding color, type, space, radius, shadow, or motion values. Skip this file if the host has no UI.

## Precedence

The token file below is this project's standard. DTCG layering (primitive → semantic/alias → component) is the golden default when the host already has tokens but no documented layering. Do not invent a design system if none exists. Do not invent dark mode if the host has one theme.

## Token source of truth

- File: `path/to/tokens` <!-- CSS variables, DTCG JSON, Tailwind theme, etc. -->
- How a component consumes a token: <!-- `var(--color-text)` / `theme.colors.text` / … -->

## Layers

- Primitive / base (`repo:` or `golden:` DTCG):
- Semantic / alias:
- Component (only if the host already has them):

## Rules

- `golden:` Never hardcode hex, font names, or spacing in components when tokens exist. Add the token first.
- `golden:` Themes (light/dark/…) are token-set swaps, not per-component overrides.
- `golden:` Contrast is verified on semantic color tokens (WCAG 2.2 AA: 4.5:1 text, 3:1 UI).
- `repo:` How to add a token in *this* repo (file, naming, codegen).

## Light / dark

- `repo:` Provider, class, or `prefers-color-scheme` — whichever exists.
- If none: do not add a second theme in agent rules.
