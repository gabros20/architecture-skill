# ADR templates

Fillable templates for [adr-and-governance.md](../references/adr-and-governance.md). Pick by
weight — see that reference's §3 for when to use each. MADR structure re-expressed from
adr/madr (dual-licensed MIT/CC0-1.0, https://github.com/adr/madr); Y-Statement form after Olaf
Zimmermann; deprecation variant after wshobson/agents (MIT).

## MADR (default)

```markdown
---
status: proposed | accepted | rejected | deprecated | superseded by ADR-NNNN
date: YYYY-MM-DD
decision-makers:
consulted:
informed:
---

# {short title naming the decision, not the topic}

## Context and problem statement
{The forces at play and the scope of the decision — name the components/connectors affected.}

## Decision drivers
- {quality attribute, constraint, or concern this decision must satisfy}

## Considered options
- {option 1}
- {option 2}
- {option 3}

## Decision outcome
Chosen option: "{option}", because {the deciding reason — only option meeting a k.o. criterion,
resolves {driver}, or wins on the comparison below}.

### Consequences
- Good, because {positive consequence}
- Bad, because {negative consequence}

### Confirmation
{How compliance is/will be checked — a fitness function, ArchUnit-family test, or review gate.
See adr-and-governance.md §7.}

## Pros and cons of the options
### {option 1}
- Good, because {argument}
- Bad, because {argument}

## More information
{Re-visit trigger, links to related/superseded ADRs, team agreement notes.}
```

## Y-Statement (fast, reversible decisions)

```
In the context of {use case / component},
facing {the concern or constraint},
we decided for {chosen option}
and against {the alternative(s)}
to achieve {the quality or goal},
accepting {the downside}.
```

One sentence, no filler. Use when MADR's full structure is heavier than the decision warrants —
still record it; don't skip the ADR just because it's small enough to fit one line.

## Deprecation-with-migration (supersedes a prior ADR)

```markdown
# ADR-NNNN: Deprecate ADR-XXXX — {what's replacing it}

**Status:** Superseded by ADR-NNNN (this ADR)
**Supersedes:** ADR-XXXX
**Date:**

## Context
{Why the original decision no longer holds — new constraint, scale change, vendor change.}

## Decision
{The replacement decision.}

## Migration plan
1. **Dual-write** — {both old and new paths active}
2. **Backfill** — {historical data migrated}
3. **Cutover** — {reads move to the new path}
4. **Decommission** — {old path removed}

## Lessons learned
{What the original decision got right/wrong — feeds future decision-making, don't skip this even
when it's uncomfortable.}
```

## Filing convention

- Directory: `docs/adr/`, files `NNNN-title-in-kebab-case.md`, index at `docs/adr/README.md`
  (table: ADR | Title | Status | Date).
- Relationship vocabulary when linking ADRs: `supersedes`, `amends`, `depends-on` (ruvnet/ruflo).
- Never renumber or delete an accepted ADR's file — supersede it (adr-and-governance.md §5).
