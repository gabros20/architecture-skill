# ADR and governance

Purpose: Record a consequential architecture decision so it survives the person who made it, and
make the decision's compliance checkable over time instead of trusting memory.

Read when:
- A decision from another reference (decomposition, contracts, nfr-budgets, security-architecture,
  migration) needs to be committed to a durable record.
- The request asks to "write an ADR," "document this decision," or "why did we choose X" for
  something already decided.
- Code or a PR needs to be checked against a prior decision, or an existing ADR log needs a health
  check (drift, dangling supersede links, stale status).

Skip when:
- The decision is trivial, self-contained, temporary, or already covered by an existing ADR — see
  the write-vs-skip table below; don't create governance overhead for a non-decision.
- The ask is the decision analysis itself (options, trade-offs, the actual architectural call) —
  make that decision using the relevant reference first ([decomposition.md](decomposition.md),
  [nfr-budgets.md](nfr-budgets.md), [security-architecture.md](security-architecture.md), etc.);
  this reference only records and governs it.
- The ask is CI pipeline wiring for a fitness-function check — the *rule* is architecture-owned
  (below), the pipeline plumbing is `backend`/`operate`.

Inputs:
- The decision, its context, and the options actually considered — state explicitly when the
  requester hasn't articulated alternatives; don't invent options to fill the template.
- The existing ADR log, if any — read it before creating a new ADR; a related or superseding
  decision should link, not duplicate.

Produces:
- A committed ADR using the appropriate template (see [adr-template.md](../assets/adr-template.md)).
- An updated ADR index and lifecycle status.
- Named fitness functions for decisions where compliance should be automatable.

## Contents
- When to write an ADR vs. skip it
- ADR lifecycle
- Template variants
- Review checklist
- Immutability rule
- ADR as a queryable graph — drift detection
- Governance: fitness functions
- Validation
- Failure modes and handoff

## Procedure

### 1. When to write an ADR vs. skip it

Grounding wshobson/agents `architecture-decision-records` (MIT) —
https://github.com/wshobson/agents/blob/main/plugins/documentation-generation/skills/architecture-decision-records/SKILL.md.
Don't reach for governance on every change:

| Write an ADR | Skip an ADR |
|---|---|
| New framework/technology adoption | Minor version upgrades |
| Database technology choice | Bug fixes |
| API design pattern | Implementation detail |
| Security architecture (auth model, tenant isolation) | Routine maintenance |
| Integration pattern with a third party | Configuration change |

This pairs with joelparkerhenderson's governance question set (see §7) and the oocx arc42
hard-rule (github.com/oocx/tfplan2md, MIT): **don't create heavyweight architecture docs for
trivial features** — a well-modularized change plus a single lightweight ADR is often the right
weight, not a full document.

### 2. ADR lifecycle

`Proposed → Accepted → Deprecated → Superseded`, with a `Rejected` branch off `Proposed` (wshobson,
same source). A rejected decision is still worth keeping — it records that the option was
considered and why it lost, so it isn't re-litigated from scratch next quarter.

### 3. Template variants

Full fillable versions live in [adr-template.md](../assets/adr-template.md). Pick by weight, not
habit — a one-line Y-Statement for a small, fast decision costs less than forcing MADR's full
structure on it:
- **MADR** (Markdown Any/Architectural Decision Records) — the default, MCDA-style template with
  Context, Decision Drivers, Considered Options, Decision Outcome, Consequences, and a
  **Confirmation** section that names the fitness function verifying compliance (adr/madr,
  dual-licensed MIT/CC0-1.0 — https://github.com/adr/madr). Use this as the default for anything
  that clears the write-vs-skip bar above.
- **Nygard 5-field** (Title/Status/Context/Decision/Consequences) — the original, lightest format
  (Michael Nygard, "Documenting Architecture Decisions," re-expressed here — canonical template
  distributed via npryce/adr-tools, unclear license, don't copy its file verbatim). Use for a
  decision light enough that MADR's option-analysis structure is overhead.
- **Y-Statement** — one sentence: *"In the context of {use case}, facing {concern}, we decided
  for {option} to achieve {quality}, accepting {downside}."* (Olaf Zimmermann's format, catalogued
  by joelparkerhenderson/architecture-decision-record). Use for a fast, reversible call that still
  deserves a record.
- **Deprecation-with-migration** — supersedes an earlier ADR; adds a 4-phase migration plan
  (dual-write → backfill → cutover → decommission) and a Lessons Learned section (wshobson).
  Use whenever an ADR is superseded by a change that requires a live cutover, not just a doc edit.

### 4. Review checklist

Grounding wshobson's ADR Review Checklist (verbatim substance, re-expressed) — apply across three
phases:
- **Before submission**: options were genuinely considered, not just the chosen one written up
  after the fact; security implications considered; reversibility assessed (Bezos one-way/two-way
  doors lens — is this decision cheap or expensive to undo?).
- **During review**: at least 2 senior engineers reviewed; consequences (positive and negative)
  are both stated, not just the upside.
- **After acceptance**: index updated; any related/superseded ADR linked both ways.

### 5. Immutability rule

**Don't edit an accepted ADR.** Write a new one that supersedes it and link both directions
(joelparkerhenderson: "Immutable" is a defining property of a good ADR, alongside Rationale,
Specific — one decision per ADR — and Timestamped). Editing history in place destroys the record
of what was actually decided and when; teams that need to track evolving understanding should use
the Deprecation-with-migration variant instead of silent edits.

### 6. ADR as a queryable graph — drift detection

Grounding ruvnet/ruflo's ADR toolkit (`adr-create`/`adr-index`/`adr-review`) — treats ADRs as a
**queryable graph**, not just files on disk. Relationship vocabulary: `supersedes` (older moves to
Superseded), `amends` (adjusts without superseding — older stays Accepted), `depends-on`
(correctness depends on another ADR's decision holding).

**Code-ADR drift-detection recipe** (directly runnable by an agent): grep source comments for
`ADR-\d+` references → `git blame` each match → compare the code-change date against the ADR's
acceptance date → flag when code changed after acceptance with no amending ADR. Named drift
patterns: code references a *superseded* ADR; code violates an explicitly forbidden pattern in an
active ADR; the ADR's wording no longer matches the code's actual shape.

**Compliance-report format** (ruflo `adr-review`, re-expressed):
```
## ADR compliance report
- [ ] <file>:<line> — violates ADR-NNN: <reason>
- [!] <file> references superseded ADR-NNN (replaced by ADR-MMM)
- [x] <file> — consistent with ADR-NNN
- [?] <file> — no ADR coverage (consider creating one)
```
Run this whenever reviewing a PR that touches a file with an existing ADR reference, or as a
periodic health check on the whole log.

### 7. Governance: fitness functions

**Fitness functions** — Neal Ford, Rebecca Parsons, Patrick Kua, *Building Evolutionary
Architectures* (concept popularized further by ThoughtWorks Insights,
https://www.thoughtworks.com/insights/articles/fitness-function-driven-development): an objective,
automatable measure of how close an architecture is to a stated aim — distinct from feature-level
TDD, which validates behavior, not architectural shape. A fitness function is an "automated
gatekeeper" embedded in the delivery pipeline; a change that fails one is blocked from promotion.
MADR's own **Confirmation** section is the explicit bridge between an ADR and its fitness
function — every ADR heavy enough to need MADR should state how compliance is checked, and a
fitness function is the strongest answer ("a design/code review or a test with a library such as
ArchUnit can help validate this").

**ArchUnit-family tools enforce this as code**, one per language ecosystem: ArchUnit (Java),
ArchUnitTS (TypeScript/JS via Jest/Vitest), ArchUnitNET (C#), Konsist (Kotlin), arch-go (Go),
phparkitect/arkitest (PHP), tach (Python), Shopify/packwerk (Ruby), dependency-cruiser (JS/TS) —
catalogued by QDenka/awesome-software-design (CC0-1.0). Starter rule shapes, worked in Java by
JonasTebben/archunit-examples (MIT) and directly portable to any ArchUnit-family tool:

```java
// layering: adapters may depend on application; application on domain; never the reverse
layeredArchitecture()
  .layer(DOMAIN).definedBy(DOMAIN_PACKAGES)
  .layer(APPLICATION).definedBy(APPLICATION_PACKAGES)
  .layer(ADAPTERS).definedBy(ADAPTERS_PACKAGES)
  .whereLayer(DOMAIN).mayOnlyBeAccessedByLayers(APPLICATION)
  .whereLayer(APPLICATION).mayOnlyBeAccessedByLayers(ADAPTERS);

// cycle detection across module slices
slices().matching("com.company.app.(*)..").should().beFreeOfCycles();
```

Border: this reference owns *naming* the fitness function as part of the decision (which rule,
what it enforces, which ADR it confirms); wiring the ArchUnit-family test into the build and
running it on every PR is `backend`/`operate`'s implementation, not this reference's.

## Validation

- Every ADR states a Status from the lifecycle in §2 — no undated, unstatused decisions.
- No accepted ADR was edited in place; supersessions link both directions.
- A decision heavy enough for MADR names its Confirmation / fitness function.
- The write-vs-skip table was actually applied — a trivial change didn't get a full ADR, and a
  consequential one didn't get skipped.

## Failure modes and handoff

- **ADR written after the fact, options invented to justify a done decision** — flag it; an ADR
  that doesn't reflect the actual decision process is documentation theater, not a record.
- **An accepted ADR was edited instead of superseded** — revert to the last accepted text, write
  a new superseding ADR for the change.
- **Request is really the decision analysis itself** — return to the owning reference
  ([decomposition.md](decomposition.md), [nfr-budgets.md](nfr-budgets.md),
  [security-architecture.md](security-architecture.md), [migration.md](migration.md)) and make the
  call before writing the record.
- **Request wants the fitness-function CI wiring, not the rule** — hand off to `backend`/`operate`
  with the rule stated; this reference doesn't own pipeline configuration.
