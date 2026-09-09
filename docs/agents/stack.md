# Stack

## Precedence

Manifests and config files (`firebase.json`, `index.html`) are this project's standard (`repo:`).

---

## Core Architecture

- **Client Runtime:** Modern Evergreen Web Browsers (ES2022+, HTML5, CSS3).
- **Markup & Templates:** Vanilla HTML5 (`index.html`).
- **Styling:** Custom CSS3 design system with CSS custom properties (`style.css`), no build step.
- **Client Logic:** Vanilla JavaScript (`app.js`), modular and zero-bundler.
- **Celebration Effects:** Canvas Confetti v1.9.3 (`cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js`), loaded via pinned CDN script.
- **Fonts:** Google Fonts (`Outfit` weights 400–700, `Space Grotesk` weights 500/700).

---

## Persistence & Cloud Synchronization

- **Shared Cloud Object:** RESTful API Dev object store via `fetch` (`https://api.restful-api.dev/objects/ff808181a067127101a08072620147f6`).
- **Client Persistence:** Browser `localStorage` key `tautos_bukiausias_v3_state` (`app.js:8`).

---

## Hosting & Deployment

- **Hosting Provider:** Firebase Hosting (`firebase.json`, `.firebaserc`, Project: `balsavimas-vaciukai`).
- **Domains:** `https://balsavimas-vaciukai.web.app`, `https://balsavimas-vaciukai.firebaseapp.com`.
- **Deployment Tool:** `firebase-tools` CLI (`npx -y firebase-tools@latest deploy --only hosting`) / PowerShell script (`deploy-firebase.ps1`).
