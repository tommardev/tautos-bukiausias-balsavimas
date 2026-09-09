# UI / UX

Load before creating or modifying user-facing interface elements, components, or styles.

## Precedence

This project's design system tokens (`style.css`), anti-slop standards, and Emil Kowalski design engineering principles win on taste and composition. **WCAG 2.2 AA** is the mandatory accessibility floor (`golden:`).

---

## The Anti-Slop Manifesto

Sterilize all stereotypical AI-generated web tropes:

| AI Slop Anti-Pattern | Why It Breaks Craft | Production Standard |
| --- | --- | --- |
| **Blur Glow Spheres** (`filter: blur(120px)`) | Visual noise, mud on mobile GPUs, screams "2023 AI demo" | Clean, deep slate background with subtle contrast layers |
| **Rainbow Neon Soup** (pink + cyan + purple + gold) | Chaotic visual hierarchy, looks like a cheap casino | Single primary brand accent (refined amber/gold `#F59E0B`) + semantic tokens |
| **Heavy Glassmorphism** | Illegible text contrast, performance penalty on low-end devices | Crisp solid/semi-solid surfaces with subtle 1px border (`rgba(255,255,255,0.08)`) |
| **Emoji Spam** (✍️, 🎲, 🗳️, 📊, 📋, ➕, 🤡, 👑 everywhere) | Childish, amateurish clutter, degrades screen-reader usability | Clean typography and purposeful SVG icons only when strictly needed |
| **Novelty Gimmick Widgets** (Marquee ticker, synth audio) | Distracts users, triggers browser autoplay blocks | Clean, static or subtly animated live status indicator |
| **Duplicate View Modes** (3D columns vs list toggles) | Feature bloat, unnecessary cognitive load | Single, beautifully responsive horizontal bar leaderboard |

---

## Modern Component Architecture

### 1. Contestant Card (`.contestant-card`)
- **Default:** Clean dark card (`--bg-surface`), subtle 1px border (`--border-subtle`), rounded (`--radius-md`).
- **Hover:** Gentle lift (`transform: translateY(-2px)`), border shifts to `--border-subtle-hover`. Only on `@media (hover: hover)`.
- **Selected:** Refined amber border highlight (`--color-gold`), subtle inner accent tint (`--bg-surface-selected`).
- **Active / Press:** Tactile feedback: `transform: scale(0.97)`.
- **Disabled (when 3 picked):** Reduced opacity (`0.45`), `cursor: not-allowed`, no hover transforms.

### 2. Voting Action Dock (`.voting-control-panel`)
- Clean, focused action bar.
- Name input: Accessible `<label>`, clear placeholder, autofocus or clean focus ring. No gimmicky dice generator.
- Selection counter: High-contrast fraction (e.g. `1 / 3 pasirinkta`), clear helper text.
- Submit button: Primary amber accent button, disabled state until 1–3 chosen and name filled. Snappy `:active` press state.

### 3. Leaderboard & Results
- Single unified view: horizontal progress bars showing vote count and percentage.
- Real-time animated bar width using CSS transitions on `width` (250ms ease-out).
- Top 3 candidates highlighted with clean rank badges (1st, 2nd, 3rd) rather than bulky gimmicky podiums with toilet icons.

### 4. Audit Log ("Kas už ką balsavo")
- Clean, high-density data table or list.
- Formatted timestamp, voter name, and chosen candidate tags.

---

## Motion & Micro-interactions (Emil Kowalski Standard)

1. **Duration:** UI micro-interactions must stay between **150ms and 220ms**. Never exceed 300ms for UI actions.
2. **Easing:** Always use strong custom ease-out:
   ```css
   --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
   ```
   Never use `ease-in` for interactive UI elements.
3. **Property Targeting:** Never use `transition: all`. Always specify exact properties:
   ```css
   /* Good */
   transition: transform 160ms var(--ease-out), opacity 160ms var(--ease-out);
   
   /* Banned */
   transition: all 0.22s;
   ```
4. **Natural Entry:** Never animate from `scale(0)`. Start from `scale(0.95)` with `opacity: 0`.
5. **Press Feedback:** Every pressable button and card must have `:active { transform: scale(0.97); }`.
6. **Accessibility:** Enforce `@media (prefers-reduced-motion: reduce)`:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

---

## Emil Kowalski Review Checklist

When building or reviewing UI changes, verify against this standard:

| Before (AI Slop) | After (Production Craft) | Why |
| --- | --- | --- |
| `filter: blur(120px)` floating color spheres | Removed entirely; deep clean slate background | Eliminates visual mud and GPU rendering waste |
| `transition: all 0.22s` | `transition: transform 160ms ease-out, border-color 160ms ease-out` | Avoids thrashing unintended CSS properties |
| No `:active` state on buttons | `transform: scale(0.97)` on `:active` | Provides immediate tactile physical response |
| `transform: scale(0)` on modal/toast | `transform: scale(0.95); opacity: 0` | Nothing in the real world pops into existence from zero |
| Neon pink/cyan/purple border glows | Subtle 1px `rgba(255, 255, 255, 0.08)` border | Restores visual hierarchy and professional restraint |
| Procedural audio synth beeping on click | Silent by default; optional user toggle for sound | Prevents annoying unprompted noise and browser autoplay blocks |
| Marquee ticker scrolling text | Clean, static live status badge | Marquees are distracting, dated, and unreadable on mobile |
