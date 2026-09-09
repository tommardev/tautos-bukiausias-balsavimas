# Theming

Load before adding color, typography, spacing, radius, shadow, or motion values.

## Precedence
The token variables in `style.css` `:root` are this project's standard (`repo:`). DTCG layering is the golden default.

## Token source of truth
- File: `style.css` (`:root` selector, lines 8–37).
- How components consume tokens: `var(--token-name)`.

## Layers
- **Color tokens (`repo:` `style.css:9-25`):**
  - Backgrounds: `--bg-main: #0c0a17`, `--bg-card: rgba(23, 19, 43, 0.75)`, `--bg-card-hover: rgba(35, 29, 66, 0.85)`, `--bg-card-selected: rgba(45, 26, 85, 0.9)`.
  - Borders: `--border-color: rgba(255, 255, 255, 0.1)`, `--border-glow: rgba(255, 230, 0, 0.4)`.
  - Neon Accents: `--color-gold: #FFE600`, `--color-pink: #FF2A85`, `--color-cyan: #00F5D4`, `--color-purple: #9D4EDD`, `--color-orange: #FF7B00`, `--color-red: #FF3366`.
  - Text: `--text-primary: #FFFFFF`, `--text-secondary: #B4B0D0`, `--text-muted: #7E78A8`.
- **Typography tokens (`repo:` `style.css:27-28`):**
  - `--font-main: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif`
  - `--font-mono: 'Space Grotesk', monospace, sans-serif`
- **Shadow tokens (`repo:` `style.css:30-32`):**
  - `--shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.3)`
  - `--shadow-lg: 0 12px 36px rgba(0, 0, 0, 0.5)`
  - `--shadow-neon: 0 0 24px rgba(255, 42, 133, 0.35)`
- **Border Radii (`repo:` `style.css:34-37`):**
  - `--radius-sm: 8px`, `--radius-md: 14px`, `--radius-lg: 20px`, `--radius-pill: 9999px`.
- **Transition (`repo:` `style.css:39`):**
  - `--transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1)`

## Rules
- `golden:` Never hardcode raw hex colors, font strings, or arbitrary pixel margins in component CSS. Extend `:root` in `style.css` if a new token is required.
- `repo:` Single dark TV-studio aesthetic. Do not invent a light mode unless explicitly asked.
