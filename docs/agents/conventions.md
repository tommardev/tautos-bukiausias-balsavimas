# Conventions

How new code should look, where it goes, and the quality bar it must meet. Load this before adding features, modifying the DOM structure, or adjusting styling.

## Precedence

`repo:` paths below are this project's standard. `golden:` items apply only where the project is silent.

---

## Naming and Layout

- **Flat project layout:** Root-level files: `index.html`, `style.css`, `app.js`, `firebase.json`, `deploy-firebase.ps1`.
- **Constants:** `SCREAMING_SNAKE_CASE` (`CLOUD_SYNC_URL`, `LOCAL_STORAGE_KEY`, `DEFAULT_CONTESTANTS`).
- **Functions:** `camelCase` (`fetchCloudState`, `renderPodium`, `showToast`).
- **DOM IDs:** `camelCase` (`syncStatusText`, `votingControlPanel`, `contestantsGrid`).
- **CSS classes:** `kebab-case` (`contestant-card`, `btn-primary`, `leaderboard-bar`).

---

## Anti-Slop Quality Gate

Before submitting any code change, verify it passes these quality checks:

| Check | Requirement |
| --- | --- |
| **Visual Restraint** | No floating blur glow spheres, no rainbow neon palette, no emoji clutter on buttons/labels. |
| **Feature Simplicity** | No speculative features or novelty widgets (no marquees, no audio synth beeps, no dice generators). |
| **Motion Polish** | Snappy transitions under 220ms, custom ease-out, button `:active { transform: scale(0.97); }`, no `transition: all`. |
| **Accessibility (WCAG 2.2 AA)** | Native semantic elements (`button`, `input`, `dialog`), visible focus rings, labels for all controls, reduced-motion queries. |
| **Security** | All user inputs (voter names, candidate aliases) sanitized with `escapeHtml()` before DOM insertion. |

---

## Imports and External Resources

- No JS modules or build step; external libraries loaded in `index.html` via CDN.
- Always pin explicit versions on external scripts (`canvas-confetti@1.9.3`).
- Do not add random third-party CDN libraries without explicit approval.

---

## Errors and Logging

- Network operations wrapped in `try...catch` blocks (`app.js`).
- User-visible error notifications via `setSyncStatus(msg, "error")` and `showToast(msg, "error")`.
- Graceful offline fallback to `localStorage`.
- Never log personal voter data or sensitive payloads.

---

## Where New Code Goes

- **HTML UI elements:** Added to `index.html` in semantic, accessible containers.
- **Styling & CSS variables:** `style.css` (tokens at `:root`).
- **Client logic & state:** `app.js` (data structures in `DEFAULT_CONTESTANTS`, UI rendering in `renderAll`).
- **Deployment & hosting:** `firebase.json` and `deploy-firebase.ps1`.

---

## Public Surfaces

- Single-page application served via Firebase Hosting at `https://balsavimas-vaciukai.web.app`.
