# AI layer ready

Use **Join** when this host was already prepared. Use the rest for first-time.

---

# Join — this machine (do not rewrite team files)

This clone already has the committed workflow (`AGENTS.md`, `skills-lock.json`, `AI_CODING_README.md`). Step 2 was skipped.

## Do these now (human)

- Missing `/add-plugin` (skip any already installed on this machine):
  - `/add-plugin cursor-team-kit`
  - `/add-plugin context7-plugin`
  - `/add-plugin sonatype-cursor-plugin`
  - `/add-plugin modern-web-guidance`
- Then reload the window.
- Plugin keys to connect in Customize (do not commit): Context7, Sonatype
- Read `AI_CODING_README.md` (workflow, skill cmds). Intros: `AI_CODING_LEARN.md`.

## This machine

- `npx skills experimental_install --yes`: ran / failed / skipped (why)
- Plugins already installed / missing
- Kit-owned harness file copied because it was absent (path) / none

## Left untouched

- `AGENTS.md`, helpers, host README, shims, committed harness files

## Copied kit folder

- Fetched from GitHub in this run? yes / no (join should be no)
- If yes: **recommend deleting** that folder. Ask before deleting.

---

# First-time

## Do these now (human)

- Missing `/add-plugin` (skip any already installed on this machine):
  - `/add-plugin cursor-team-kit`
  - `/add-plugin context7-plugin`
  - `/add-plugin sonatype-cursor-plugin`
  - `/add-plugin modern-web-guidance`
- Then reload the window.
- Plugin keys to connect in Customize (do not commit): Context7, Sonatype

## Harness (step 1)

- Files created / merged (settings.json extras kept):
- `AI_CODING_README.md`: created
- `AI_CODING_LEARN.md`: created
- `npx skills experimental_install --yes`: ran / failed / skipped (why)

## Created / updated (step 2)

- Host README: created / gap-filled / structure kept (`overridden:`) / skipped (why)
- `path` — why

## Always-on (AGENTS.md)

- 3–6 bullets of what earned a slot

## On-demand

- helper → when to load (AGENTS.md Pointers row)

## Golden fills vs repo

- `golden:` rules written (standard + why the host was silent)
- `overridden:` golden rules the host rejected (why the project is more correct)
- safety/a11y floors kept despite a local habit (Gotchas)

## Compatibility shims

- `CLAUDE.md` / Copilot / nested `AGENTS.md` / Aider or Gemini config (only if that tool is already in the host)
- Globbed project `.cursor/rules/*.mdc`: none written (step 1 native-rules only)

## Copied kit folder

- Kit root:
- Fetched from GitHub in this run? yes / no
- If yes: **recommend deleting** that folder now. It is the installer. Keep `.cursor/` (harness: native-rules + settings), `skills-lock.json`, `AI_CODING_README.md`, `AI_CODING_LEARN.md`, `AGENTS.md`, host `README.md`, helpers, shims for tools that cannot read `AGENTS.md`. Ask before deleting.

## Conflicts / guesses

- anything that could not be proved from the repo
- working principles: elicited vs default

## Suggested first agent task

- one small task that will prove the layer works
