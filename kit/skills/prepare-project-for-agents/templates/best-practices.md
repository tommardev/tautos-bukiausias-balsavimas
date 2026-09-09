# Best practices

One topic per section. Include a topic only when the host has evidence for it **or** a golden default from `references/golden-rules.md` applies and is not overridden.

Canonical = the way agents must copy. Excluded = rejected here. Language = only rules true in this stack.

Mark every bullet: `repo:` path · `golden:` standard name · `overridden:` standard the project rejected.

## Precedence

Host project standard (`repo:`) wins on taste, architecture, and anything already encoded in code/linters/tokens — including when it is **stricter or more specific** than a golden default. Golden defaults fill silence. Safety/a11y floors are not overridden by local habit (see `references/golden-rules.md`).

## <Topic>

### Canonical

- `repo:` Chosen way — example: `path/to/file`
- Short snippet from the repo (not invented).
- `golden:` Gap-fill only if the host is silent on this topic (name the standard).

### Excluded

- Pattern this repo rejects — why in half a sentence, or "not used here".
- `overridden:` Popular golden rule this repo deliberately does not follow — why.

### Language

- `repo:` or `golden:` Language/framework-specific rule that actually applies here.
