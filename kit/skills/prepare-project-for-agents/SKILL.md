---
name: prepare-project-for-agents
description: Prepares a repository for AI agentic coding. Classify first — if the host is already prepared (committed AGENTS.md + skills-lock.json + AI_CODING_README.md), only restore this machine's harness (skills install, missing Cursor plugins, plugin keys) and do not rewrite team rules. Otherwise two steps — (1) harness first (IDE/CLI defaults, Cursor plugins/MCPs, skills-lock + npx skills experimental_install from GitHub sources, always-on native rules), then (2) a lean AGENTS.md spine with when-to-load Pointers, on-demand helpers, thin shims only for tools that cannot read AGENTS.md, and a gap-fill of the host README (create if missing; keep existing structure when it already covers the jobs). Defaults to globally accepted golden rules only where the host is silent; project standards win when they are more correct or specific. Use when the user wants to prepare a project for AI agents, join an already-prepared repo, add AGENTS.md, bootstrap agent context, set up the agent harness, follow START_HERE.html, fetch the kit from GitHub onto another project, or invokes /prepare-project-for-agents.
argument-hint: "[target-git-root] [--brownfield|--greenfield] [--harness-only|--instructions-only]"
disable-model-invocation: true
---

# Prepare project for AI agents

Write a portable AI instruction layer for the **host project**, and put the **harness** in place first so agents have plugins, skills, and always-on tool routing before they rely on `AGENTS.md`. Also gap-fill the host’s human `README.md` (create if missing) without fighting a more correct existing structure. When-to-load for helpers is **Pointers** in `AGENTS.md` (works in any AGENTS.md-compatible harness). Do not write globbed project Cursor `.mdc` rules.

If this host was **already prepared** by this kit and those files are in git, a new developer only needs this **machine’s** harness (restore gitignored skills, install missing marketplace plugins, connect keys). Do not regenerate the team’s `AGENTS.md`, helpers, or committed harness files.

Do not invent a stack or a design system the code does not use. Fill silence with named golden defaults (`references/golden-rules.md`). Project standards win when they are more correct or specific. Do not commit unless asked.

## Port the kit (if missing)

Host git root = `git rev-parse --show-toplevel` (or the workspace git toplevel). **Join** if that root already has `AGENTS.md`, `skills-lock.json`, and `AI_CODING_README.md`. Skip this section on join. Do not fetch `kit/` only to restore a teammate’s machine.

The copyable unit is the **`kit/` folder**. Source: https://github.com/tm-modulasoft/AI_Coding_project_prepare (`kit/` on the default branch).

If this workspace has no `kit/skills/prepare-project-for-agents/SKILL.md` (or no `START_HERE.html` next to `skills/prepare-project-for-agents/`):

1. Shallow-clone the GitHub repo into a **temp** directory on the host:
   - Prefer `gh repo clone tm-modulasoft/AI_Coding_project_prepare .ai-coding-kit-src -- --depth 1`
   - Else `git clone --depth 1 https://github.com/tm-modulasoft/AI_Coding_project_prepare.git .ai-coding-kit-src`
2. Copy **only** `.ai-coding-kit-src/kit` → host `kit/`. Do not copy the clone's `README.md`, `AGENTS.md`, or `.git`.
3. Delete `.ai-coding-kit-src`. Remember that you fetched the kit in this run.

Then continue.

## Resolve paths

1. **Kit root** — directory that contains `START_HERE.html` and `skills/prepare-project-for-agents/` (walk up from this file).
2. **Host project** — git toplevel of the workspace being prepared.
   - Kit root is the git root → host is this repo.
   - Kit root is a subdirectory → host is the parent git root. Write agent files into the host, not into the kit.
3. **Classify** (before fetching `kit/` or writing files). **Join** if the host git root already has all of: `AGENTS.md`, `skills-lock.json`, `AI_CODING_README.md`. Those are the team’s committed workflow. **First-time** otherwise. User override: “regenerate / refresh `AGENTS.md`” → first-time step 2 even when those files exist; “just set up my machine” → join even if the set is incomplete.

## Mandatory reads

Before scanning the host, read `references/discovery.md` (starts with Classify).
If **join:** read only `references/harness.md` → Join. Do not read `instruction-prompt.md`, `writing-rules.md`, or `golden-rules.md`.
If **first-time:** before writing **harness** files, read `references/harness.md`. Before writing **instruction** files, read `references/instruction-prompt.md`, `references/writing-rules.md`, and `references/golden-rules.md`.
When producing output, follow the matching file under `templates/` (and kit `harness-defaults/` for skills lock, native-rules body, IDE plugin settings, CLI permissions).

## Workflow

**Join** (already prepared): machine-local harness only. Skip step 2. Do not overwrite committed prepare files. Details: `references/harness.md` → Join.

**First-time:** two steps. Write kit-owned files from kit defaults. Gap-fill an existing host README (keep structure when it already covers the golden jobs; see `golden-rules.md` → README). Merge extras in `.cursor/settings.json` and keep a richer `skills-lock.json` if present. Do not skip the harness unless the user passed `--instructions-only`. Stop after the harness if they passed `--harness-only`. On a join host, `--harness-only` is already the path; `--instructions-only` still skips unless the user asked to regenerate the instruction layer.

### Join — already prepared (this machine only)

Committed files are the team’s source of truth (`AGENTS.md`, helpers, README, lockfile, native rules, `AI_CODING_*`, `.cursor/` harness). A clone does not include gitignored `.agents/skills/` or this person’s Cursor marketplace plugins and keys.

1. Do **not** fetch `kit/` (if you already did this run, do not copy defaults onto the host; ask to delete the fetched folder).
2. From the host git root, run `npx skills experimental_install --yes`.
3. Detect plugins on this machine; put missing `/add-plugin …` lines at the top of your next message.
4. Remind: connect Context7 and Sonatype keys in Customize; read `AI_CODING_README.md` and `AI_CODING_LEARN.md`.
5. If `kit/` is on disk and a kit-owned harness file is **missing**, copy that file only. Never overwrite an existing one.
6. Report with `templates/report.md` (join section). Stop. Do not commit. Do not run step 2.

### 1. Harness first (first-time only)

IDE/CLI defaults, plugin enablement, `skills-lock.json`, `.agents/skills/` gitignore, `AI_CODING_README.md` + `AI_CODING_LEARN.md`, always-on native rules.

**You** run `npx skills experimental_install --yes` from the host git root (needs network). That restores skills from **GitHub** sources listed in `skills-lock.json`. Do not leave it for the human.

Marketplace plugins have **no CLI**. After merging `.cursor/settings.json`, check whether the default plugins are already installed on this machine. If any are missing, put the `/add-plugin …` block at the top of your next message (human, in Cursor chat). Details: `references/harness.md`.

### 2. Project instruction layer (first-time only)

1. Classify **brownfield** (derive _what is_ from the codebase) vs **greenfield** (derive _what should be_ from an architecture spec; ask if none).
2. Discover stack, commands, seams, UI/theming, tests, git conventions, secrets/generated dirs, and the GitHub-visible README. Cite paths. Surface conflicts; do not silently pick docs over code.
3. Merge with golden rules: for each applicable domain, keep the project standard if it is more correct or specific; gap-fill silence with `golden:`; keep safety/a11y floors out of Canonical-from-habit. Skip domains the stack cannot hit (no UI → no theming).
4. Draft the file tree. Skip helpers with no evidence **and** no applicable golden default.
5. Write on-demand helpers first (`docs/agents/` unless the host already uses `.agents/` or `.claude/references/`), then compress into root `AGENTS.md` (including a when-to-load **Pointers** table), then thin shims only for tools that cannot read `AGENTS.md`, then gap-fill or create the host README (`templates/README.md` only when missing). Do **not** write globbed project Cursor `.mdc` rules.
6. Prune every line that would not cause a mistake if removed. Drop inapplicable golden rules.
7. Run the quality checklist in `references/writing-rules.md`. Smoke-check that listed commands exist in scripts/CI.
8. Report using `templates/report.md`. Do not commit.

### After both steps — copied kit folder

The kit is an **installer**, not runtime. Durable host files: `.cursor/` (harness only — native rules + settings, not globbed project rules), `skills-lock.json`, `.gitignore` skills block, `AI_CODING_README.md`, `AI_CODING_LEARN.md`, `AGENTS.md`, host `README.md`, helpers, shims for tools that cannot read `AGENTS.md`.

If you **fetched** `kit/` from GitHub in this run:

- Ask before deleting that folder. **Recommend yes.**
- Do not delete unless the user agrees.

Do **not** offer to delete `kit/` if this git remote is `tm-modulasoft/AI_Coding_project_prepare` (this product repo).

## Gotchas

- Root `AGENTS.md` is always-on context. Aim <250 lines, hard cap ~400.
- Filename is exactly `AGENTS.md` (uppercase, plural). Plain Markdown. No required headings.
- `AI_CODING_README.md` is the human cheat sheet (copied from `harness-defaults/`). `AI_CODING_LEARN.md` is intros and tutorials. Do not fork either into `AGENTS.md`.
- Host `README.md` is for humans (what / why / how to run). Gap-fill golden jobs; do not force Standard Readme titles onto a file that already covers them. Do not copy this kit repo’s paste-prompt README onto a host.
- Closest nested `AGENTS.md` wins; do not copy the root stack into every package. Nested files are for real monorepo packages, not for language/glob scoping.
- When-to-load lives in `AGENTS.md` **Pointers** (when-editing → helper path). Do not write globbed project `.cursor/rules/*.mdc` or Claude `.claude/rules/` path-scoped copies of helpers. Exception: step 1 `.cursor/rules/ai-coding-native-rules.mdc` (`alwaysApply: true`).
- Do not `@import` helpers from `AGENTS.md` (Claude inlines `@path` at launch). Point with backtick paths and tell the agent to Read.
- `CLAUDE.md` is `@AGENTS.md`, not a fork. Copilot gets a thin pointer. Skip other vendor files unless that tool is already in the host.
- Working principles cannot be derived from code — ask once, or mark `elicited: default`.
- Agents must Read skill files from disk. Opening `START_HERE.html` via `file://` cannot fetch sibling markdown.
- Do not copy `golden-rules.md` into the host. Do not fight Prettier/gofmt/token files with a golden taste rule.
- Never commit plugin API keys. `"key": true` in settings means “connect in the UI.”
- Classify before writes. Join = do not rewrite the committed instruction layer. First-time = this host has never been prepared by this kit; do not add leftover-migration steps (globbed project `.mdc`, renamed native-rules, `*.bak` merge of kit files).

## Resources

- `references/harness.md` — step 1 runbook (mandatory before harness writes; includes Join)
- `references/discovery.md` — classify join vs first-time, then what to inspect
- `references/instruction-prompt.md` — step 2 runbook (mandatory before instruction writes; skip on join)
- `references/writing-rules.md` — lean vs on-demand split and quality bar (skip on join)
- `references/golden-rules.md` — globally accepted defaults and precedence (mandatory before writing; skip on join)
- `templates/AGENTS.md` — suggested spine
- `templates/README.md` — host README scaffold when none exists (gap-fill uses jobs, not this file’s headings)
- `templates/CLAUDE.md` — Claude Code shim
- `templates/copilot-instructions.md` — Copilot shim
- `templates/best-practices.md` — Excluded / Canonical / Language shape
- `templates/conventions.md` — naming, imports, errors, seams
- `templates/ui-ux.md` — kit, states, WCAG floor
- `templates/theming.md` — tokens, layers, no one-off values
- `templates/report.md` — end-of-run report
- Kit `harness-defaults/` — skills lock, `AI_CODING_README.md`, `AI_CODING_LEARN.md`, `ai-coding-native-rules.md`, `cursor-settings.json`, `cli.json`
