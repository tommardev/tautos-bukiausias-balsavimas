# Writing rules

Always-on context is expensive. Split ruthlessly.

**Join:** do not write or rewrite host instruction files. Skip the quality checklist. Report with `templates/report.md` (join section).

## Precedence (host files)

When a golden default and a project standard disagree, **do not average**. See `references/golden-rules.md`.

| Winner                     | When                                                                                                                        |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| User chat                  | Always                                                                                                                      |
| Host project (`repo:`)     | Taste, architecture, stack, naming, formatting, tokens — including when **stricter or more specific** than a golden default |
| Golden default (`golden:`) | Host is silent **and** the rule applies to this stack                                                                       |
| Safety / a11y floor        | Never Canonical-ize a dangerous or inaccessible habit; list it under Gotchas                                                |

Golden rules are a **default floor**, not a ceiling and not a second style guide. Do not copy `golden-rules.md` into the host.

## Destinations

| Destination                | What belongs                                                                                                                                                         | Test                                                                                                                       |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Root `AGENTS.md`           | Map, stack one-liner, **Precedence**, exact commands, **Tools**, seams, three-tier boundaries, git/PR one-liners, **Pointers** (when-editing → helper)               | Would removing this line cause a mistake on _most_ tasks?                                                                  |
| Host `README.md`           | Human project README (GitHub-visible). Golden **jobs**, not forced heading names. Gap-fill or create; keep structure that already covers a job                       | Would a stranger miss what this is, how to run it, or where `AGENTS.md` lives?                                             |
| Root `AI_CODING_README.md` | Human cheat sheet: workflow, why Cole/Addy, skill restore/add/check cmds, plugins. Copy from kit `harness-defaults/AI_CODING_README.md`                              | Would a developer joining the prepared repo miss how to restore skills or which workflow to use?                           |
| Root `AI_CODING_LEARN.md`  | Mandatory intros and tutorials. Copy from kit `harness-defaults/AI_CODING_LEARN.md`                                                                                  | Would a developer miss the starting videos?                                                                                |
| Helper file                | Recurring but task-type-specific: language, UI/UX, theming, testing, security, Excluded/Canonical                                                                    | Recurs when that area is touched, not every task                                                                           |
| Nested `AGENTS.md`         | Package-specific commands, boundaries, seams                                                                                                                         | Root file would mislead work inside that package                                                                           |
| Compatibility shim         | One-line import / short pointer for a tool that **cannot** read `AGENTS.md` (`CLAUDE.md`, Copilot)                                                                   | That tool would otherwise miss the spine                                                                                   |
| Native rule                | House workflow + default tools from kit `harness-defaults/ai-coding-native-rules.md`                                                                                 | `.cursor/rules/ai-coding-native-rules.mdc` with `alwaysApply: true` — not a copy of `AGENTS.md`; not globbed project rules |
| Delete                     | Slogans, restated linter rules, aspirational "we should", duplicated README, inapplicable golden rules                                 | Would not change agent behavior on a non-Cursor harness                                                                    |

## Size

- Root `AGENTS.md`: aim <250 lines, hard cap ~400
- Host `README.md`: scannable human jobs; not an API dump or second `AGENTS.md`
- Root `AI_CODING_README.md`: keep short (cheat sheet, not a second spine)
- Root `AI_CODING_LEARN.md`: curated intros/tutorials; not a second cheat sheet or skill encyclopedia
- Each helper: aim <120 lines, one concern
- Native rule: kit body only in `.cursor/rules/ai-coding-native-rules.mdc` (`alwaysApply: true`). Do not dump that body into `AGENTS.md`. Do not add other `.mdc` files in step 2.

## Voice

- State the **choice**, not the virtue: `derive types with z.infer<>` not "type safety is critical"
- **Examples beat prose.** One real snippet from _this_ repo > three paragraphs
- Commands include **exact CLIs and flags**, near the top of `AGENTS.md`
- Boundaries: **Always / Ask first / Never**
- Brownfield **project** rules: every `repo:` bullet points at a proving path. If it cannot, omit it
- Brownfield **golden** gap-fills: point at the named standard (`golden: WCAG 2.2 AA`). Omit if the stack cannot hit that domain
- Do not narrate what ESLint/Prettier already forbids unless agents still violate it
- Token-driven UI: extend tokens; never one-off hex/font/space in components if tokens exist
- Mark sources: `repo:` / `golden:` / `overridden:`
- Pointers: host paths in the when-column; helper paths in **backticks**, never `@import`

## Official AGENTS.md facts

- Filename `AGENTS.md` (uppercase, plural)
- Plain Markdown; no required headings. Optional YAML `description` / `tags` for indexing only
- Closest `AGENTS.md` to the edited file wins; user chat overrides files
- README stays human-facing. Agent ops live in `AGENTS.md` + helpers. Gap-fill README **jobs**; do not fight a more correct existing structure
- Spec: https://agents.md (AAIF / Linux Foundation)

## Quality checklist

Skip on join.

- [ ] `AGENTS.md` at host root, uppercase plural
- [ ] Host README (GitHub-visible) created or gap-filled; structure kept when it already covers the jobs; commands match `AGENTS.md`; agent pointer lines present
- [ ] `AI_CODING_README.md` at host root (copied from kit `harness-defaults/`, not a second `AGENTS.md`)
- [ ] `AI_CODING_LEARN.md` at host root (intros and tutorials)
- [ ] Precedence section present (chat > repo > golden > floors)
- [ ] Commands are the real ones (script/CI; smoke-run test/lint if cheap)
- [ ] Every Always/Ask/Never item is specific and checkable
- [ ] Helpers linked from Pointers; no orphans. Each helper has a when-editing path (host globs as prose)
- [ ] Helper bullets tagged `repo:` / `golden:` / `overridden:`
- [ ] Golden fills do not contradict formatter, compiler, or token file
- [ ] Safety/a11y floors not encoded as Canonical-from-a-bad-habit
- [ ] No secrets copied into agent files
- [ ] UI/theming helpers exist **iff** a UI exists
- [ ] No globbed project `.cursor/rules/*.mdc` or `.claude/rules/` copies of helpers. Only harness `ai-coding-native-rules.mdc` (`alwaysApply: true`)
- [ ] Helper paths in `AGENTS.md` are backtick-quoted, not `@import`
- [ ] `AGENTS.md` has a short Tools stanza (Context7, Sonatype, `gh`) even if native-rules exist
- [ ] Host `.gitignore` ignores `.agents/skills/` and `skills-lock.json` is committed if present
- [ ] `CLAUDE.md` is an import, not a second bible
- [ ] Kit-owned files copied from defaults; host README gap-filled in place
