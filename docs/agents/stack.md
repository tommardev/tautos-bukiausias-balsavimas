# Stack

## Precedence
Manifests and config files (`firebase.json`, `index.html`) are this project's standard (`repo:`).

## Core Architecture
- `repo:` **Client Runtime:** Modern Evergreen Web Browsers (ES2022+, HTML5, CSS3).
- `repo:` **Markup & Templates:** Vanilla HTML5 (`index.html`).
- `repo:` **Styling:** Custom CSS3 design system with CSS custom properties (`style.css`).
- `repo:` **Client Logic:** Vanilla JavaScript (`app.js`), no runtime bundler or compiler.
- `repo:` **Audio Synthesis:** Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`, `app.js:180-252`).
- `repo:` **External CDN Libraries:** Canvas Confetti v1.9.3 (`cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js`).
- `repo:` **Fonts:** Google Fonts (`Outfit` weights 400-900, `Space Grotesk` weights 500/700).

## Persistence & Cloud Synchronization
- `repo:` **Shared Cloud Object:** RESTful API Dev object store via `fetch` (`https://api.restful-api.dev/objects/ff808181a067127101a08072620147f6`).
- `repo:` **Client Persistence:** Browser `localStorage` key `tautos_bukiausias_v3_state` (`app.js:8`).

## Hosting & Deployment
- `repo:` **Hosting Provider:** Firebase Hosting (`firebase.json`, `.firebaserc`, Project: `balsavimas-vaciukai`).
- `repo:` **Domains:** `https://balsavimas-vaciukai.web.app`, `https://balsavimas-vaciukai.firebaseapp.com`.
- `repo:` **Deployment Tool:** `firebase-tools` CLI (`npx -y firebase-tools@latest deploy --only hosting`) / PowerShell script (`deploy-firebase.ps1`).
