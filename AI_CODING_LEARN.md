# Base ideas and workflow

**Mandatory training** for anyone using this prepared AI-coding setup. Watch and read these intros first. Day-to-day commands, skill install, and plugins live in `AI_CODING_README.md`.

> A skill you haven't read is just a longer prompt you don't control. Read them anyway.

House workflow skills: [github.com/coleam00/skills](https://github.com/coleam00/skills) — read that README, then the `SKILL.md` of each skill you actually run (local copies: `.agents/skills/<name>/SKILL.md`). These videos are orientation, not a second process.

Selected [Addy Osmani](https://github.com/addyosmani/agent-skills) skills are the **how-well** handbook used inside that loop (UI, API, security, perf, ship). Why both catalogs: `AI_CODING_README.md` → Why Cole and Addy.

## Base tutorials — intros / concepts

Start here. Software fundamentals first, then agent habits.

### Software fundamentals

- **[Software Fundamentals Matter More Than Ever](https://youtu.be/v4F1gFy-hqg)** — Matt Pocock. Agents amplify whatever engineering you already have (or lack).
  - Catalog: [github.com/mattpocock/skills](https://github.com/mattpocock/skills) · [aihero.dev/learn](https://www.aihero.dev/learn#get-the-most-out) · [aihero.dev/skills](https://www.aihero.dev/skills)

This kit uses **only three** skills from that catalog (`improve-codebase-architecture`, `research`, `codebase-design`) — not the full set:

```bash
npx skills add mattpocock/skills --skill improve-codebase-architecture research codebase-design --yes
```

### Agent habits

- **[My Real AI Coding Workflow (build anything)](https://youtu.be/gpOfsGW1xRk)** — end-to-end personal workflow, no fluff.
- **[11 Tiny Coding Agent Fixes With A Stupid Amount Of Payoff](https://youtu.be/UbylWXukvR8)** — small harness/process fixes that compound.

## Workflows to use

After the intros. Same house loop as `AI_CODING_README.md` (Cole / PIV). Watch these; do not invent a parallel process.

- **Skills:** [Every Claude Code Skill I Use to Drive My Entire Development Process](https://youtu.be/MbiMwgbGdxw)
  - [github.com/coleam00/skills](https://github.com/coleam00/skills) — read the intro there for the full skill list.

```bash
npx skills add coleam00/skills --yes
```

(This prepare kit already restores that set via `skills-lock.json`. Use `add` when the upstream repo gained _new_ skills you do not have yet. Other default sources: `AI_CODING_README.md`.)

- **[My COMPLETE Agentic Coding Workflow to Build Anything](https://youtu.be/goOZSXmrYQ4)**
  - Walkthrough repo: [github.com/coleam00/link-in-bio-page-builder](https://github.com/coleam00/link-in-bio-page-builder)
  - Course: [dynamous.ai — Agentic Coding](https://dynamous.ai/#/agentic-coding-course)

- **TODO — harness:** [Harness Engineering: What Separates Top Agentic Engineers Right Now](https://youtu.be/ulNsa0sD8N0)
  - Demo: [github.com/coleam00/harness-engineering-demo](https://github.com/coleam00/harness-engineering-demo)
  - Course: [dynamous.ai — Agentic Coding](https://dynamous.ai/#/agentic-coding-course)

- **Optional — more tickets-based:** [FULL Guide to Becoming a Principled Agentic Engineer](https://youtu.be/luBkbzjo-TA)
  - Workshop: [github.com/coleam00/ai-transformation-workshop](https://github.com/coleam00/ai-transformation-workshop)

- **Advanced:** [The Ultimate Guide to Making Your Entire Development Cycle AI Native](https://youtu.be/Tliio-33w4g)
  - Pack: [github.com/coleam00/ai-native-starter-pack](https://github.com/coleam00/ai-native-starter-pack) — a second opinion, not a second copy of skills on this repo.

- **TODO — hooks:** [Watch This If Your Coding Agent is Ignoring Your Rules](https://youtu.be/msfMqW92Y8Q)
