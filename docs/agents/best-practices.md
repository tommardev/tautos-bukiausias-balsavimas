# Best practices

## Precedence
Host project standard (`repo:`) wins on taste, architecture, and anything already encoded in code/linters/tokens. Golden defaults fill silence. Safety/a11y floors are not overridden by local habit.

## Client Architecture & DOM

### Canonical
- `repo:` Direct DOM queries using `document.getElementById` and `document.querySelector` (`app.js:345-346, 367`).
- `repo:` Full UI re-render through centralized `renderAll()` after state changes (`app.js:357-364`):
```javascript
function renderAll() {
  renderContestants();
  renderPodium();
  renderCharts();
  renderLog();
  updateTicker();
  updateSummaryStats();
}
```
- `golden:` HTML Living Standard: Keep DOM updates idempotent, escape dynamic text strings before rendering.

### Excluded
- Single Page App frameworks (React, Vue, Angular) — this project is deliberately vanilla HTML/JS/CSS.
- CSS utility frameworks (Tailwind, Bootstrap) — styles belong in `style.css`.

### Language
- `repo:` Modern JavaScript (ES2022+ features: `async/await`, template literals, arrow functions, `Set`).

## State Management & Sync

### Canonical
- `repo:` Single state object `appState` holding contestants, selected candidates, filters, and audit history (`app.js:148-176`).
- `repo:` Cloud sync via RESTful API with local fallback:
```javascript
const response = await fetch(CLOUD_SYNC_URL, { cache: "no-store" });
const data = await response.json();
```
- `golden:` Dual persistence with background conflict resolution and offline capability.

### Excluded
- Complex state management libraries (Redux, MobX, Pinia) — plain object mutation + `renderAll()` is standard here.

### Language
- `repo:` Auto-polling cloud sync via `setInterval(fetchCloudState, 6000)` (`app.js:774`).

## Audio & Effects

### Canonical
- `repo:` Pure procedural Web Audio synthesis using standard oscillators (`app.js:180-252`):
```javascript
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = "sine";
osc.connect(gain);
```
- `repo:` Confetti trigger via global `confetti()` from CDN bundle (`app.js:636-646`).

### Excluded
- Static sound asset files (`.mp3`, `.wav`) — all sound effects are synthesized dynamically.

### Language
- `repo:` AudioContext initialization on first user interaction gesture to comply with browser autoplay policies (`app.js:181-190`).
