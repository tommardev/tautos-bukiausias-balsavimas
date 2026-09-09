# AI coding notes

Short notes for people working in this repo after it was prepared for agentic coding. **Agents read `AGENTS.md`.** This file is for you.

**Start here (mandatory):** intros and tutorials are in `AI_CODING_LEARN.md`. Watch/read that before you treat the agent as a process you already know.

> A skill you haven't read is just a longer prompt you don't control. Read them anyway.

House workflow skills: [github.com/coleam00/skills](https://github.com/coleam00/skills). Installed copies: `.agents/skills/<name>/SKILL.md`.

## Why Cole and Addy

Two catalogs, two jobs. They sit side by side — not as a second process.

**Cole** ([coleam00/skills](https://github.com/coleam00/skills)) is the operating system. It decides **when** work happens and **in what order**: product intent (`plan-create-prd`), approach (`plan-architecture`), tickets (`plan-create-stories`), then the PIV loop (prime → plan → implement → validate → review → commit → PR).

**Addy** ([addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)) is the senior-engineer handbook. It decides **how well** a slice is done in a specialty — UI, API, security, performance, simplification, source-of-truth docs, browser verification, shipping, and the rest of the selected pack. Load the matching `SKILL.md` while implementing.

Cole’s PRD skill even defers engineering choices (library and version, data model, security boundaries, testing architecture, project structure) to an “Osmani list” that belongs in architecture/spec, not in the PRD. That is the intended split: Cole sequences the work; Addy raises the bar inside each step.

The workflow section below is a working default. Tighten it later if the team wants a different process.

## Joining this prepared repo (new machine / new teammate)

Committed files (`AGENTS.md`, helpers, `skills-lock.json`, native rules, this cheat sheet) are the team’s workflow. Do not regenerate them. This machine still needs:

1. Restore skills (they are gitignored; `skills-lock.json` is committed):

```bash
npx skills experimental_install --yes
```

Needs network. From the repo root.

2. Open the project in Cursor. Install any missing marketplace plugins (`/add-plugin …` below), reload, and connect Context7 / Sonatype keys in Customize. Never commit keys.

3. Read this file and `AI_CODING_LEARN.md` before treating the agent as a process you already know.

Same outcome if you paste the kit’s GitHub README prompt: the agent must classify **join** and stop after this machine’s harness. Do not fetch `kit/` only to join.

## Workflow

**prime → plan → implement → validate → review → commit → PR**

Around that loop sit the pieces that feed it (PRD, architecture, epic slicing), the pieces that run it in parallel (worktrees), and the meta-skills that let you build more of your own AI Layer (rules, hooks, skills, opportunity scans).

**Simple** — typo, rename, obvious one-file fix:

chat spec → implement → verify (test / lint / typecheck; browser if UI)

**Full** — feature, ticket, non-trivial change:

spec → tasks → implement → verify

That maps to coleam00 skills (do not invent a parallel process). Names only — open each `SKILL.md` ([coleam00/skills](https://github.com/coleam00/skills) or `.agents/skills/<name>/SKILL.md`) before you rely on it:

| Kind              | Skills                                                                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Product intent    | `plan-create-prd`                                                                                                                              |
| Approach / stack  | `plan-architecture`                                                                                                                            |
| Tickets           | `plan-create-stories`                                                                                                                          |
| Feature / ticket  | `prime-codebase` (or `prime-frontend` / `prime-backend`) → `piv-plan-implementation` → `piv-implement` → `piv-validate` → `piv-review-changes` |
| Bug with an issue | `piv-investigate-issue` → `piv-implement-issue`                                                                                                |
| Commit / PR       | `piv-commit` / `piv-create-pr` only inside that loop, or when you ask                                                                          |

Skip the PIV loop for tiny/mechanical work. During implement: surgical diffs (`karpathy-guidelines`) and the matching Addy skill when the slice is UI, API, security, performance, or ship. Project commands (dev, test, lint, build) live in `AGENTS.md`.

## Skills

Run from the **repo root**. Installs land in `.agents/skills/` (gitignored). Commit `skills-lock.json` after add/update.

| What                                                         | Command                                 |
| ------------------------------------------------------------ | --------------------------------------- |
| Restore from the lockfile (clone, new machine, wiped folder) | `npx skills experimental_install --yes` |
| See whether installed skills have updates                    | `npx skills check`                      |
| Apply updates                                                | `npx skills update --yes`               |
| List what is installed                                       | `npx skills list`                       |

**Default sources** (already in `skills-lock.json`). Day-to-day restore is the lockfile. Use `add` when those GitHub repos gained skills this lock does not have yet:

```bash
npx skills add coleam00/skills --yes
npx skills add forrestchang/andrej-karpathy-skills --yes
npx skills add emilkowalski/skills --yes
npx skills add mattpocock/skills --skill improve-codebase-architecture research codebase-design --yes
npx skills add addyosmani/agent-skills --yes \
  -s frontend-ui-engineering \
  -s api-and-interface-design \
  -s security-and-hardening \
  -s performance-optimization \
  -s code-simplification \
  -s source-driven-development \
  -s browser-testing-with-devtools \
  -s debugging-and-error-recovery \
  -s observability-and-instrumentation \
  -s ci-cd-and-automation \
  -s documentation-and-adrs \
  -s shipping-and-launch \
  -s constraint-driven-development \
  -s deprecation-and-migration
npx skills add addyosmani/agent-skills --yes \
  -s idea-refine \
  -s code-review-and-quality
```

Matt Pocock: **only those three** skills, not the whole catalog. Then commit the updated `skills-lock.json`.

Browse more: [skills.sh](https://skills.sh/). Search: `npx skills find [query]`.

## Cursor plugins (once per machine)

Default MCPs / marketplace plugins. No install CLI. If a plugin is missing, paste in Cursor chat and reload:

```
/add-plugin cursor-team-kit
/add-plugin context7-plugin
/add-plugin sonatype-cursor-plugin
/add-plugin modern-web-guidance
```

- Cursor Team Kit — `cursor-team-kit`
- Context7 — `context7-plugin`
- Sonatype — `sonatype-cursor-plugin`
- Modern Web Guidance — `modern-web-guidance`

Connect Context7 and Sonatype in Customize. `"key": true` in settings means “connect in the UI,” not “put the secret in git.”

## Tools the agent should use

- Library / API docs: Context7 MCP (not training memory or generic web search)
- New or upgraded packages: Sonatype MCP before pinning
- GitHub: `gh` CLI only (no GitHub MCP)

## Do not commit

- Plugin API keys, `.env`, credentials
- `.agents/skills/` — restore with `npx skills experimental_install --yes`

## Map

| Path                                       | Role                                                          |
| ------------------------------------------ | ------------------------------------------------------------- |
| `AGENTS.md`                                | Always-on spine for agents; Pointers say when to Read helpers |
| `docs/agents/`                             | On-demand depth (stack, conventions, UI, tests)               |
| `skills-lock.json`                         | Pinned skill sources — commit this                            |
| `.cursor/rules/ai-coding-native-rules.mdc` | Cursor house workflow + tools, every chat (not project globs) |
| `AI_CODING_LEARN.md`                       | Mandatory intros and tutorials                                |
| This file                                  | Human cheat sheet                                             |
