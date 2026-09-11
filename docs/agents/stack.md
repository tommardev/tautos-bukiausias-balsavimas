# Stack

## Precedence

Manifests and config files (`firebase.json`, `index.html`) are this project's standard (`repo:`).

---

## Core Architecture

- **Client Runtime:** Modern Evergreen Web Browsers (ES2022+, HTML5, CSS3).
- **Markup & Templates:** Vanilla HTML5 (`index.html`).
- **Styling:** Custom CSS3 design system with CSS custom properties (`styles/tokens.css`, `styles/components/`), imported in `style.css`, no build step.
- **Client Logic:** Vanilla JavaScript Native ES Modules (`src/main.js`, `src/state/`, `src/services/`, `src/ui/`), modular and zero-bundler.
- **Celebration Effects:** Canvas Confetti v1.9.3 (`cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js`), loaded via pinned CDN script.
- **Fonts:** Google Fonts (`Outfit` weights 400–700, `Space Grotesk` weights 500/700).

---

## Persistence & Cloud Synchronization

- **Shared Cloud State:** Firebase Cloud Firestore live listener (`onSnapshot` on document `/voting/state`) for real-time bi-directional sync without polling.
- **Client Persistence:** Browser `localStorage` key `tautos_bukiausias_v3_state` (`src/config/constants.js`) with dynamic SDK import fallback.

---

## Hosting & Deployment

- **Hosting Provider:** Firebase Hosting (`firebase.json`, `.firebaserc`, Project: `balsavimas-vaciukai`).
- **Domains:** `https://balsavimas-vaciukai.web.app`, `https://balsavimas-vaciukai.firebaseapp.com`.
- **Deployment Tool:** `firebase-tools` CLI (`npx -y firebase-tools@latest deploy --only hosting`) / PowerShell script (`deploy-firebase.ps1`).
