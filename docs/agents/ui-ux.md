# UI / UX

Load before changing user-facing UI.

## Precedence
This project's UI kit, Lithuanian show styling, and breakpoints (`repo:`) win on taste and composition. **WCAG 2.2 AA** is the default accessibility floor (`golden:`).

## Kit
- `repo:` Custom dark-themed TV studio aesthetic with neon glow spheres (`style.css:8-84`).
- `repo:` Glassmorphic card styling with border hover glows (`.contestant-card`, `style.css:380-450`):
  - Inactive card: `var(--bg-card)`
  - Selected card: `var(--bg-card-selected)` with gold border and scale transform
  - Disabled card: opacity `0.45` when maximum 3 candidates selected (`app.js:386`)
- `repo:` Sticky voter control panel (`.voting-control-panel`, `style.css:262-310`).

## States (screens, inputs, and actions)
- **Loading:** Pulsing live dot (`.live-dot.pulse`, `style.css:122-138`) and marquee ticker text.
- **Empty:** "Nerasta kandidatų pagal paiešką" message when search filter has 0 results.
- **Error (recoverable):** Red sync indicator dot and toast message with offline local mode fallback.
- **Disabled / Pending:** Vote submit button disabled (`disabled` attribute) until voter name is filled and 1-3 candidates chosen.

## Accessibility (floor)
- `golden:` WCAG 2.2 AA — native HTML controls (`button`, `input`, `dialog`); visible focus rings; programmatic `<label>` associations; text contrast >= 4.5:1; honor `prefers-reduced-motion`.
- `repo:` Lithuanian language localization (`<html lang="lt">` in `index.html:2`).

## Interaction & Responsive
- `repo:` Breakpoint `@media (max-width: 860px)` switches sticky control bar from grid to single-column flex layout (`style.css:1478-1495`).
- `repo:` Motion uses `var(--transition): all 0.22s cubic-bezier(0.16, 1, 0.3, 1)` (`style.css:36`).

## Anti-slop
- Follow the playful Lithuanian game-show theme ("Tautos bukiausias" TV3 show aesthetic: gold/pink/cyan neon, dunce cap icons, playful nicknames).
- Do not introduce generic corporate AI palettes.
