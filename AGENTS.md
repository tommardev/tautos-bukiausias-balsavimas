# AGENTS.md

> README is for humans. This file is for coding agents.

## Project

Interactive single-page voting web application for the Lithuanian TV3 comedy parody "Tautos bukiausias" (2026). Features real-time contestant voting (up to 3 choices), live leaderboard ranking, top-3 podium, voter audit log, and cloud synchronization with offline local fallback. Built with modern design engineering standards (Apple/Linear-grade restraint, zero AI slop, no speculative gimmicks).

**Stack:** Vanilla HTML5, Vanilla JavaScript (ES2022+), Vanilla CSS3 (`:root` design tokens), Canvas Confetti (CDN, subtle victory trigger), RESTful API Dev cloud sync, Firebase Hosting (`balsavimas-vaciukai`).

## Precedence

1. User chat
2. This repo's code, linters, tokens, and helpers (`repo:`) - including when they are **stricter or more specific** than a common default
3. Golden defaults in helpers (`golden:`) - only where this repo is silent and the rule applies to this stack
4. Safety / a11y floors in **Boundaries** - not overridden by local habit

Do not invent a second style guide. Do not average conflicting rules.

## Design Principles & Anti-Slop Standard

- **Zero AI Slop:** Strictly eliminate stereotypical AI-generated clutter:
  - **No blur glow spheres:** Do not use `filter: blur(120px)` floating color blobs.
  - **No rainbow neon soup:** Avoid mixing multiple competing neon colors (pink + cyan + purple + gold + orange + red). Use a cohesive, deep slate canvas with a single refined brand accent (warm amber/gold `--color-gold`) and semantic status tokens.
  - **No heavy glassmorphism:** Replace blurry, layered frosted glass with crisp, opaque or semi-crisp surfaces with subtle 1px borders (`rgba(255, 255, 255, 0.08)`).
  - **No emoji spam:** Remove emojis from buttons, headings, and labels. Use clean typography and optional subtle SVG icons.
  - **No novelty widgets:** Do not add marquee news tickers, synthesizer oscillator beeps, or dice buttons.
- **Emil Kowalski Design Engineering:**
  - Fast, intentional motion: Transitions strictly under 150–220ms with custom ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`).
  - Tactile feedback: Buttons and pressable cards must use `:active { transform: scale(0.97); }`.
  - No `transition: all`: Explicitly target `transform`, `opacity`, or `background-color`.
  - Never enter from `scale(0)`: Use `scale(0.95)` with opacity for natural entry.
  - Accessibility: Always honor `@media (prefers-reduced-motion: reduce)`.
- **Karpathy Simplicity (Rule #2):**
  - Minimum code that solves the user's problem. Nothing speculative.
  - Lithuanian TV comedy resides in the sharp, witty copy and character bios — not in visual circus noise.

## Layout

```
README.md                               Human project README (GitHub-visible)
AI_CODING_README.md                     Human cheat sheet (workflow, skill cmds)
AI_CODING_LEARN.md                      Mandatory intros and tutorials
index.html                              Single-page app markup & layout
style.css                               Design tokens, animations, responsive layout
app.js                                  Client state, cloud sync, DOM renderers
firebase.json                           Firebase Hosting configuration & rewrites
deploy-firebase.ps1                     PowerShell script for Firebase Hosting deployment
docs/agents/                            On-demand documentation helpers for agents
.agents/rules/                          Antigravity workspace rules (trigger: always_on)
GEMINI.md                               Antigravity native instructions pointer
```

**Seams** (where new work plugs in):
- Contestant roster: `DEFAULT_CONTESTANTS` array in `app.js`
- State & Data models: `appState` structure in `app.js`
- Markup & Components: Semantic containers in `index.html`
- Styles & Tokens: CSS custom properties in `style.css` `:root`
- Cloud Sync: `fetchCloudState` / `pushCloudState` in `app.js`

## Commands

- Dev / Local Preview: `npx -y serve .` (or open `index.html` in browser)
- Deploy: `.\deploy-firebase.ps1` (or `npx -y firebase-tools@latest deploy --only hosting`)
- Restore agent skills: `npx skills experimental_install --yes`

## Tools

- Docs/APIs: Context7 MCP - prefer over client web search and training memory for Web Audio, Canvas Confetti, and Firebase Hosting docs.
- Web Search & Research: Exa MCP (`https://mcp.exa.ai`) - use `web_search_exa`, `web_search_advanced_exa`, `web_fetch_exa`, and `agent_run` for neural web search, page fetching, and deep research.
- Dependencies: Sonatype MCP - prefer for version selection and security before adding any npm packages.
- GitHub: `gh` CLI only (no GitHub MCP).

## Conventions

- Vanilla ES2022+ JavaScript without a build step or bundler (`repo:` `app.js`).
- Centralized `renderAll()` pass after modifying `appState` (`repo:` `app.js:357`).
- All styling driven by `:root` custom properties in `style.css` (`repo:` `style.css:8-37`).
- Lithuanian UI text and show-specific humor preserved in copy and character text (`repo:` `index.html`).

## Boundaries

- **Always:** Use semantic tokens from `style.css` `:root`; keep DOM updates idempotent; test voting and sync in browser before deploying.
- **Ask first:** Adding a JS build step or bundler (e.g. Vite), altering `CLOUD_SYNC_URL` schema, changing Firebase Hosting rewrites or public dir.
- **Never:** Introduce AI slop (blur glow spheres, neon soup, unsolicited audio synthesis, emoji spam, or unneeded speculative widgets); commit API keys or credentials; swallow network errors without updating UI sync status; replace vanilla JS with heavy frameworks without approval.

## Testing

No automated runner. Verification is manual browser testing:
1. Load `index.html` via local static server (`npx -y serve .`).
2. Test candidate selection (max 3), vote submission, and subtle celebration trigger.
3. Verify top 3 podium, horizontal leaderboard bars, and audit table update.
4. Verify manual cloud sync ("Atnaujinti") and offline `localStorage` fallback.

## Git / PRs

Follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).

## Pointers

This file is the index. Helpers are not always-on. Before you edit an area, **Read** the matching helper. Do not skip this because a vendor glob or path-scoped rule is missing. Wrap paths in backticks (do not `@import` helpers - that would load them every session).

| When you are editing                                                 | Read first                      |
| -------------------------------------------------------------------- | ------------------------------- |
| Stack / runtime / cloud sync / hosting                               | `docs/agents/stack.md`          |
| Code style, state management, audio, DOM rendering                   | `docs/agents/best-practices.md` |
| Naming, error handling, file layout, seams                           | `docs/agents/conventions.md`    |
| HTML layout, component cards, modals, responsiveness (`index.html`)   | `docs/agents/ui-ux.md`          |
| CSS styles, colors, typography, variables (`style.css`)              | `docs/agents/theming.md`        |
| Manual verification, voting flows, regression testing                | `docs/agents/testing.md`        |
| Form inputs, XSS prevention, cloud data safety                       | `docs/agents/security.md`       |

## Gotchas

- Shared cloud sync endpoint: `CLOUD_SYNC_URL` points to `api.restful-api.dev`. Any user can read/write shared state; validate incoming payloads before merging.
- Firebase deployment path: `firebase.json` specifies `"public": "."` so all non-dot non-ignored root files are published.
- Accessibility: Respect `prefers-reduced-motion` for all transitions and confetti celebrations.
