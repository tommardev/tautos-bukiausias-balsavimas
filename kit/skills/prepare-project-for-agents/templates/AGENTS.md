# AGENTS.md

> README is for humans. This file is for coding agents.

## Project

<!-- One paragraph: what it is, who it serves. One line stack with versions. -->

**Stack:** <!-- e.g. React 18, TypeScript 5, Vite, Tailwind CSS 4 -->

## Precedence

1. User chat
2. This repo's code, linters, tokens, and helpers (`repo:`) — including when they are **stricter or more specific** than a common default
3. Golden defaults in helpers (`golden:`) — only where this repo is silent and the rule applies to this stack
4. Safety / a11y floors in **Boundaries** — not overridden by local habit

Do not invent a second style guide. Do not average conflicting rules.

## Layout

<!-- Tree of dirs that matter. One line each: what it is + why it lives there. Include seams. -->

```
README.md                               Human project README (GitHub-visible)
AI_CODING_README.md                     Human cheat sheet (workflow, skill cmds)
AI_CODING_LEARN.md                      Mandatory intros and tutorials
src/
  <!-- … -->
```

**Seams** (where new work plugs in):

- Features →
- Routes →
- UI kit →
- Tests →

## Commands

<!-- Exact copy-paste CLIs. Prefer what CI runs. -->

- Install: ``
- Dev: ``
- Test: ``
- Typecheck: ``
- Lint: ``
- Build: ``
- Restore agent skills: `npx skills experimental_install --yes`

## Tools

- Docs/APIs: Context7 MCP — prefer over client web search and training memory for library and framework docs.
- Dependencies: Sonatype MCP — prefer for version selection and security before adding or upgrading packages.
- GitHub: `gh` CLI only (no GitHub MCP).

## Conventions

<!-- Only project-specific choices. Pointers to helpers for depth. One canonical example or path. -->

## Boundaries

- **Always:**
- **Ask first:** schema changes, new dependencies, CI, public API, secrets-adjacent config
- **Never:** commit secrets, edit vendor/generated output, skip hooks, delete failing tests to go green

## Testing

<!-- Where tests live, what to write, the command that must pass. -->

## Git / PRs

<!-- Repo convention if present. If fully silent: one-line Conventional Commits as golden default. -->

## Pointers

This file is the index. Helpers are not always-on. Before you edit an area, **Read** the matching helper. Do not skip this because a vendor glob or path-scoped rule is missing. Wrap paths in backticks (do not `@import` helpers — that would load them every session).

| When you are editing                                              | Read first                      |
| ----------------------------------------------------------------- | ------------------------------- |
| Stack / versions / toolchain                                      | `docs/agents/stack.md`          |
| Naming, seams, errors, where new code goes                        | `docs/agents/conventions.md`    |
| Excluded / Canonical / Language                                   | `docs/agents/best-practices.md` |
| UI files (replace with host paths, e.g. `src/**/*.{tsx,html}`)    | `docs/agents/ui-ux.md`          |
| Style files (replace with host paths, e.g. `src/**/*.{scss,css}`) | `docs/agents/theming.md`        |
| Tests (replace with host test globs)                              | `docs/agents/testing.md`        |
| Authz, secrets, PII                                               | `docs/agents/security.md`       |

Drop rows whose helpers were not written. Fill the when-column with this repo's real paths.

## Gotchas

<!-- Footguns tied to a path. Include golden-vs-repo conflicts (habit vs floor). -->
