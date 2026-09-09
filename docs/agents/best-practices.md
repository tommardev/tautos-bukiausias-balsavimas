# Best Practices

## Precedence

Host project standard (`repo:`) wins on taste, architecture, and anything already encoded in code/linters/tokens. Golden defaults fill silence. Safety/a11y floors are not overridden by local habit.

---

## Client Architecture & DOM

### Canonical
- Direct DOM queries using `document.getElementById` and `document.querySelector` (`app.js`).
- Full UI re-render through centralized, idempotent `renderAll()` after state changes (`app.js:357-364`):
```javascript
function renderAll() {
  renderContestants();
  renderPodium();
  renderLeaderboard();
  renderLog();
  updateSummaryStats();
}
```
- HTML Living Standard: Keep DOM updates idempotent, escape dynamic text strings before rendering (`escapeHtml()`).
- Event delegation for dynamically created lists (`contestantsGrid`).

### Excluded
- Single Page App frameworks (React, Vue, Angular) — this project is deliberately vanilla HTML/JS/CSS.
- CSS utility frameworks (Tailwind, Bootstrap) — styles belong in `style.css`.
- Virtual DOM abstractions — unnecessary overhead for this project scale.

### Language
- Modern JavaScript (ES2022+ features: `async/await`, template literals, arrow functions, `Set`, optional chaining).

---

## State Management & Sync

### Canonical
- Single state object `appState` holding contestants, selected candidates (max 3), filter category, and audit log.
- Cloud sync via RESTful API with local fallback:
```javascript
const response = await fetch(CLOUD_SYNC_URL, { cache: "no-store" });
const data = await response.json();
```
- Dual persistence with graceful conflict resolution and offline `localStorage` fallback.

### Excluded
- Complex state management libraries (Redux, MobX, Pinia) — plain object mutation + `renderAll()` is the project standard.

---

## Effects & Audio (Anti-Slop Discipline)

### Canonical
- **Canvas Confetti:** Triggered only upon successful vote submission as a subtle victory burst. Never loop continuously. Always honor `prefers-reduced-motion`.
```javascript
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
}
```
- **Sound Effects:** In modern web apps, automatic audio oscillator bleeps on click are a dated, annoying gimmick. Keep audio completely silent by default. If audio is enabled by the user, keep sounds minimal and unobtrusive.

### Excluded
- Unsolicited procedural Web Audio oscillator noise (sine/sawtooth bleeps on hover or selection).
- Annoying autoplay audio or continuous background sound.

---

## Simplicity & Feature Pruning (Karpathy Standard)

1. **Every feature must earn its place:** If a widget does not directly help the user choose candidates, submit a vote, or view results, do not build or retain it.
2. **Remove novelty gimmicks:**
   - No marquee news tickers.
   - No random nickname dice generators (a clean, accessible input is faster and more respectful).
   - No duplicate visualization modes (e.g. 3D gradient columns vs list toggles). A single, responsive leaderboard is cleaner and superior.
3. **Keep code surgical:** Do not add speculative options, configurable themes, or unused helper functions.
