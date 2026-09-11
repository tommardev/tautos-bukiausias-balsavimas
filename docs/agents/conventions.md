# Conventions

How new code should look, where it goes, and the quality bar it must meet. Load this before adding features, modifying the DOM structure, or adjusting styling.

## Precedence

`repo:` paths below are this project's standard. `golden:` items apply only where the project is silent.

---

## Naming and Layout

- **Modular project layout:** Root entry files: `index.html`, `style.css`, `firebase.json`, `deploy-firebase.ps1`; Modular directories: `src/` (ES2022+ modules: `config/`, `state/`, `services/`, `ui/`, `utils/`) and `styles/` (`tokens.css`, `base.css`, `components/`, `responsive.css`).
- **Constants:** `SCREAMING_SNAKE_CASE` (`FIREBASE_CONFIG`, `LOCAL_STORAGE_KEY`, `DEFAULT_CONTESTANTS`).
- **Functions:** `camelCase` (`pushCloudState`, `initRealtimeCloudSync`, `renderLeaderboard`, `showToast`).
- **DOM IDs:** `camelCase` (`voterNameInput`, `submitVoteBtn`, `contestantsGrid`).
- **CSS classes:** `kebab-case` (`contestant-card`, `btn-submit-vote`, `leaderboard-row`).

---

## Anti-Slop Quality Gate

Before submitting any code change, verify it passes these quality checks:

| Check | Requirement |
| --- | --- |
| **Visual Restraint** | No floating blur glow spheres, no rainbow neon palette, no emoji clutter on buttons/labels. |
| **Feature Simplicity** | No speculative features or novelty widgets (no marquees, no audio synth beeps, no dice generators). |
| **Motion Polish** | Snappy transitions under 220ms, custom ease-out, button `:active { transform: scale(0.97); }`, no `transition: all`. |
| **Accessibility (WCAG 2.2 AA)** | Native semantic elements (`button`, `input`, `dialog`), visible focus rings, labels for all controls, reduced-motion queries. |
| **Security** | All user inputs (voter names, candidate aliases) sanitized with `escapeHTML()` before DOM insertion. |

---

## Imports and External Resources

- Standard Native ES Modules (`<script type="module" src="./src/main.js">`) without a bundler or build step.
- External libraries loaded in `index.html` via CDN. Always pin explicit versions on external scripts (`canvas-confetti@1.9.3`).
- Do not add random third-party CDN libraries without explicit approval.

---

## Errors and Logging

- Network operations wrapped in `try...catch` blocks (`src/services/api.js`).
- User-visible error notifications via `showToast(msg, "toast-error")`.
- Graceful offline fallback to `localStorage` (`src/services/storage.js`).
- Never log personal voter data or sensitive payloads.

---

## Where New Code Goes

- **HTML UI elements:** Added to `index.html` in semantic, accessible containers.
- **Styling & CSS variables:** `styles/tokens.css` (tokens at `:root`) and component sheets in `styles/components/`.
- **Client logic & state:** `src/state/store.js` (store mutations), `src/ui/` (rendering components), `src/services/` (API/storage).
- **Deployment & hosting:** `firebase.json` and `deploy-firebase.ps1`.

---

## Public Surfaces

- Single-page application served via Firebase Hosting at `https://balsavimas-vaciukai.web.app`.
