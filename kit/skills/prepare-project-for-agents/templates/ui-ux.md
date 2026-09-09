# UI / UX

Load before changing user-facing UI. Skip this file if the host has no UI.

## Precedence

This project's UI kit, breakpoints, and copy (`repo:`) win on taste and composition. **WCAG 2.2 AA** is the default accessibility floor (`golden:`) unless the project is stricter (keep stricter). Do not encode inaccessible habits as Canonical.

## Kit

- `repo:` Canonical component(s) to copy: `path`
- Anatomy / composition: <!-- how this kit actually composes -->

## States (every screen/component that fetches or submits)

- Loading:
- Empty:
- Error (recoverable):
- Disabled / pending:

`golden:` Visibility of status; users can recover from errors; destructive actions have a way out ([Nielsen heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)).

## Accessibility (floor)

- `golden:` WCAG 2.2 AA — native HTML first; no ARIA if a native control works; keyboard operable; visible focus (no bare `outline: none`); programmatic labels; text contrast 4.5:1 (3:1 large); meaning not by color alone; honor `prefers-reduced-motion`.
- `repo:` Any stricter or kit-specific a11y rules.

## Interaction

- Breakpoints (`repo:`):
- Motion (`repo:` or `golden:` reduced-motion):
- Pointer targets (`golden:` ≥ 24×24 CSS px unless the kit documents otherwise):

## Anti-slop

Do not introduce a generic AI look (default purple, oversized radius, gradient soup, stock card grids) unless `repo:` the design actually uses it.
