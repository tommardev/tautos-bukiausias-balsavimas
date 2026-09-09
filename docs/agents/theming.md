# Theming

Load before adding or modifying color, typography, spacing, radius, shadow, or motion values.

## Precedence

The token variables in `style.css` `:root` are this project's standard (`repo:`). DTCG layering is the golden default.

## Token Source of Truth

- File: `style.css` (`:root` selector).
- Consumption in components: `var(--token-name)`.

---

## Token Architecture

### 1. Surfaces & Backgrounds
Modern, dark slate foundation with subtle contrast steps:
- `--bg-canvas: #090a0f` — Base page background (replaces muddy purple with deep, premium slate).
- `--bg-surface: #12131c` — Standard card and panel surface.
- `--bg-surface-hover: #1a1c28` — Hover state for interactive cards.
- `--bg-surface-active: #222436` — Pressed / active state.
- `--bg-surface-selected: rgba(245, 158, 11, 0.08)` — Subtle tint when candidate is selected.

### 2. Borders & Dividers
Crisp, understated border hierarchy:
- `--border-subtle: rgba(255, 255, 255, 0.08)` — Standard card and container outline.
- `--border-subtle-hover: rgba(255, 255, 255, 0.16)` — Hover border on interactive items.
- `--border-selected: #F59E0B` — Crisp amber border highlighting selected candidate.

### 3. Text & Typography
High-contrast, accessible hierarchy (WCAG AA 4.5:1 floor):
- `--text-primary: #FFFFFF` — Primary headings and selected text.
- `--text-secondary: #94A3B8` — Descriptions, subtitles, and labels.
- `--text-muted: #64748B` — Timestamps, metadata, and hints.
- `--font-main: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif`
- `--font-mono: 'Space Grotesk', monospace, sans-serif`

### 4. Intentional Accent Colors
Single primary show brand color + semantic status tokens (No rainbow neon clutter):
- `--color-gold: #F59E0B` — Primary accent (amber/gold symbolizing the "Tautos Bukiausias" crown).
- `--color-gold-hover: #D97706` — Primary button hover.
- `--color-success: #10B981` — Live cloud sync, vote confirmed.
- `--color-danger: #EF4444` — Errors, offline notice, reset actions.

> [!WARNING]
> **Banned:** Multi-colored neon variables (`--color-pink: #FF2A85`, `--color-cyan: #00F5D4`, `--color-purple: #9D4EDD`) mixed across the UI are deprecated. Do not use rainbow palettes.

### 5. Elevation & Shadows
Soft, natural diffuse lighting (No harsh neon glow shadows):
- `--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3)`
- `--shadow-md: 0 4px 14px rgba(0, 0, 0, 0.4)`
- `--shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.55)`

> [!WARNING]
> **Banned:** `--shadow-neon: 0 0 24px rgba(...)` is strictly prohibited. Depth is achieved through surface contrast and subtle borders, not radioactive glows.

### 6. Radii
- `--radius-sm: 6px` — Chips, badges, small tags.
- `--radius-md: 12px` — Cards, form inputs, buttons.
- `--radius-lg: 18px` — Modals and primary floating panels.
- `--radius-pill: 9999px` — Avatars, status dots.

### 7. Motion & Easing (Emil Kowalski Standard)
- `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` — Responsive, natural deceleration.
- `--duration-fast: 160ms` — Press feedback, toggle states.
- `--duration-normal: 220ms` — Modals, drawer enter/exit, card hovers.

> [!WARNING]
> **Banned:** Generic `all 0.22s` transitions. Explicitly specify properties: `transition: transform var(--duration-fast) var(--ease-out), opacity var(--duration-fast) var(--ease-out);`
