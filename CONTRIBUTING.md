# Contributing to Tautos Bukiausias

Thank you for your interest in contributing to **Tautos Bukiausias**! This project is an open-source, real-time voting web application built for the Lithuanian TV3 comedy parody.

We welcome bug fixes, documentation improvements, UI polish, and performance optimizations.

---

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

---

## Getting Started

### Prerequisites

- A modern evergreen web browser (Chrome, Firefox, Safari, Edge).
- Node.js installed (optional, only needed for local static server `npx serve` or Firebase CLI deployment).

### Local Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/tautos-bukiausias-balsavimas.git
   cd tautos-bukiausias-balsavimas
   ```

2. **Run a local static preview server:**
   ```bash
   npx -y serve .
   ```
   Or open `index.html` directly in your browser.

3. Open `http://localhost:3000` to interact with the app.

---

## Architectural Principles

This repository follows a strict **zero-build, vanilla web standard**:
- **Native ES Modules (ES2022+):** Code is modularized under `src/` (`main.js`, `config/`, `state/`, `services/`, `ui/`, `utils/`) without bundlers (no Webpack, Vite, or Babel).
- **Design Tokens & Modular CSS:** Styling is structured under `styles/` (`tokens.css`, `base.css`, `components/`, `responsive.css`) using CSS custom properties (`:root`).
- **Single Source of Truth:** Centralized state in `src/state/store.js` with idempotent render passes via `src/ui/render.js`.

---

## Design Engineering & Anti-Slop Guidelines

We maintain high design engineering standards (Apple/Linear-grade restraint):

1. **Zero AI Slop:**
   - **No blur glow spheres:** Avoid `filter: blur(...)` blobs.
   - **No rainbow neon soup:** Use the cohesive slate canvas with a single warm amber accent (`var(--color-gold)`) and semantic status tokens.
   - **No emoji spam:** Avoid emojis in buttons, headings, and labels. Use clean typography and purposeful SVGs.
   - **No novelty widgets:** No marquees, unprompted audio synths, or gimmicky dice buttons.
2. **Emil Kowalski Motion Polish:**
   - Transitions strictly under **150ms–220ms** with custom ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`).
   - Tactile feedback: Pressable elements must have `:active { transform: scale(0.97); }`.
   - Never use `transition: all` — specify explicit properties (`transform`, `opacity`, `background-color`).
   - Honor `@media (prefers-reduced-motion: reduce)`.
3. **Humor & Tone:** Lithuanian TV comedy humor lives in sharp copy, puns, and contestant bios — not in visual circus noise.

---

## Submitting Changes

1. **Create a branch:**
   ```bash
   git checkout -b feat/my-improvement
   ```

2. **Follow Conventional Commits:**
   - `feat:` new feature or enhancement
   - `fix:` bug fix
   - `refactor:` code restructuring without behavioral change
   - `style:` visual polish, CSS token refinement
   - `docs:` documentation updates
   - `chore:` maintenance tasks

3. **Verify your changes locally:**
   - Test candidate selection (max 3) and vote submission.
   - Verify Chart.js bar chart and list view switching.
   - Verify cloud sync status and offline `localStorage` fallback.
   - Test responsive layout on both desktop and mobile viewports.

4. **Submit a Pull Request:**
   - Push your branch and open a PR against `main`.
   - Complete the PR template checklist.
