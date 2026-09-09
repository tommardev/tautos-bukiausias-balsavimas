# Conventions

How new code should look and where it goes. Load this before adding features, modifying the DOM structure, or adjusting styling.

## Precedence
`repo:` paths below are this project's standard. `golden:` items apply only where the project is silent.

## Naming and layout
- `repo:` Root-level flat layout: `index.html`, `style.css`, `app.js`, `firebase.json`, `deploy-firebase.ps1`.
- `repo:` Constants in `SCREAMING_SNAKE_CASE` (`CLOUD_SYNC_URL`, `LOCAL_STORAGE_KEY`, `DEFAULT_CONTESTANTS`, `app.js:7-11`).
- `repo:` Functions in `camelCase` (`fetchCloudState`, `renderPodium`, `showToast`, `app.js:254, 461, 649`).
- `repo:` DOM IDs in `camelCase` (`syncStatusText`, `votingControlPanel`, `contestantsGrid`, `index.html`).
- `repo:` CSS classes in `kebab-case` (`live-badge-wrapper`, `btn-pill`, `contestant-card`, `style.css`).

## Imports and External Resources
- `repo:` No JS modules or build step; global libraries loaded in `index.html` `<head>` via CDN (`index.html:15`).
- `golden:` Always pin explicit versions on external scripts (`canvas-confetti@1.9.3`).

## Errors and logging
- `repo:` Network operations wrapped in `try...catch` blocks (`app.js:256-269, 273-298`).
- `repo:` User-visible error notifications via `setSyncStatus(msg, "error")` and `showToast(msg, "error")` (`app.js:344, 649`).
- `golden:` Do not swallow network errors silently; fall back gracefully to `localStorage`. Never log personal voter data or sensitive payloads.

## Where new code goes
- **HTML UI elements:** Added to `index.html` in appropriate semantic containers.
- **Styling & CSS variables:** `style.css` (tokens at `:root`).
- **Client logic & state:** `app.js` (data structures in `DEFAULT_CONTESTANTS`, UI rendering in `renderAll`).
- **Deployment & hosting:** `firebase.json` and `deploy-firebase.ps1`.

## Public surfaces
- Single-page application served via Firebase Hosting at `https://balsavimas-vaciukai.web.app`.
