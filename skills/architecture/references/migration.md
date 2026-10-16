# Migration

Purpose: Decide how a system moves — legacy to cloud, monolith to services, old contract to new —
safely and incrementally, with a stated cutover gate, instead of a big-bang rewrite.

Read when:
- The request asks to migrate, replatform, extract a service, deprecate an API/contract, or
  modernize a legacy system.
- A decomposition decision ([decomposition.md](decomposition.md)) has been made and now needs an
  extraction order and a safe cutover path.
- An API/contract change ([contracts.md](contracts.md)) needs a deprecation timeline.

Skip when:
- The ask is which boundaries to extract, not how to move them — use
  [decomposition.md](decomposition.md) first; migration strategy assumes the target shape is already
  decided.
- The ask is the new contract's shape — use [contracts.md](contracts.md); this reference handles the
  transition between old and new, not the new contract's design.
- The ask is a pure cloud lift-and-shift with no application change — the 7 Rs table in §2 still
  applies; skip straight to it.

Inputs:
- The current system's shape and the target shape (from [decomposition.md](decomposition.md) or a
  stated brief).
- Any hard deadlines, compliance/licensing blockers, or systems that cannot be touched — state
  explicitly when unknown.

Produces:
- A migration strategy pick (one of the 7 Rs, or a Strangler Fig extraction) with a stated reason.
- An extraction order, low-risk to high-risk.
- A cutover gate (go/no-go thresholds) for each extraction.
- A deprecation timeline for any retired contract.

## Contents
- Strangler Fig
- The 7 Rs
- Database decomposition
- Comparison-read cutover
- Extraction order
- Deprecation
- Anti-patterns
- Validation
- Failure modes and handoff

## Procedure

### 1. Strangler Fig — the default incremental path
Ground: Martin Fowler, *StranglerFigApplication* —
https://martinfowler.com/bliki/StranglerFigApplication.html. Replace a legacy system piece-by-piece
behind a routing façade: old and new run concurrently, traffic shifts incrementally, and the façade
retires once nothing routes to the old system. Fowler's explicit argument for this over a rewrite: a
big-bang rewrite "goes down in flames" — a long parallel build drifts from a moving target and ships
nothing until the very end, while Strangler Fig ships value continuously and can be stopped or
reversed at any point. Treat the façade and any dual-running components as a **deliberately temporary
transitional architecture** — name it as temporary in the ADR so it isn't mistaken for the final shape.
While both run, keep **one authority for shared stateful allowances** — rate-limit budgets, cooldowns,
quotas, counters: either the legacy path calls the new runtime, or old and new never execute
concurrently until that state has migrated. Copying the state file and running both doubles the
allowance.

### 2. The 7 Rs — pick the migration strategy per component
Ground: AWS `migration-readiness` (MIT-0, aws-samples/sample-well-architected-skills-and-steering).

| Strategy | When to use | Code indicators |
|---|---|---|
| Rehost | fast migration, minimal change | standard OS, containerizable, no OS-specific deps |
| Replatform | small optimization during the move | self-managed DB→managed DB, self-managed cache→managed cache |
| Refactor | need cloud-native benefits | monolith to decompose, stateful→stateless |
| Repurchase | replace with SaaS | commercial software with a SaaS equivalent |
| Retire | no longer needed | unused code, deprecated services |
| Retain | not ready to move | hard dependencies, compliance blockers |
| Relocate | virtualized workloads move as-is | VMware-specific configs |

Flag **BLOCKERs** before committing to a strategy: OS-specific dependencies with no cloud equivalent,
proprietary licensing, hardware dependencies (FPGA, dongles), hardcoded IPs, local-filesystem
dependencies. Flag **HIGH-RISK** dependencies separately: tight coupling requiring co-migration,
latency-sensitive hybrid integrations, and — called out explicitly as the single most common
migration-ordering pain — **a shared database across services**, which blocks independent extraction
until resolved (§3).

### 3. Database decomposition
Ground: vasilyu1983/ai-agents-public `migration-modernization-guide.md` (MIT). A shared DB is the most
common blocker to Strangler-Fig extraction — resolve it before extracting the service that touches it,
not after. Three strategies, increasing isolation: **view-layer** (a DB view fronts the shared tables —
cheapest, least isolation), **schema-per-service** (separate schemas, same instance), **DB-per-service**
(full isolation, the target state for an extracted service). Keep data in sync during the transition
via **dual-writes** (app writes both — simplest, riskiest; writes can silently diverge), **CDC**
(Debezium-style change-data-capture streams changes to the new store, no duplicated write logic in the
app), or a batch **ETL** job (simplest to build, highest replication lag). Prefer CDC over dual-writes
once correctness matters more than build speed.

### 4. Comparison-read cutover — the go/no-go gate
Ground: vasilyu1983 `migration-modernization-guide.md`. Before switching reads to the new path, run
both: read old and new in parallel, serve the old result, **log every mismatch** without acting on it.
This surfaces correctness bugs at zero user-facing risk. Gate the actual cutover on stated thresholds,
not a demo or a deadline:

| Signal | Go | No-go |
|---|---|---|
| Error rate | within baseline | above baseline |
| p95 latency | within budget ([nfr-budgets.md](nfr-budgets.md)) | above budget |
| Data mismatch rate | zero / accepted-and-explained | unexplained mismatches present |
| Business metric | unaffected | regressed |

Roll back on any no-go signal — the rollback path must exist and be tested before cutover, not
designed after a failure.

### 5. Extraction order — low risk to high risk
Ground: vasilyu1983 `migration-modernization-guide.md` case-study order. Extract in ascending blast
radius, not by convenience or team availability: **Notifications → Search → Inventory → Orders →
Payments → Auth**. A notification failure degrades UX; an auth failure takes down everything
downstream — sequence so early mistakes are cheap and late extractions inherit a validated cutover
process. Weight the actual order by the real dependency graph and business criticality; the ordering
*principle* (lowest blast radius first) transfers, not the literal service list.

**Inventory before ordering.** Baseline current capability from code at a pinned revision — commands,
payload shapes, effects, state/cache formats, runtime dependencies, authorization settings — not from
READMEs, comments, or an older installed build; mark retired contracts so they don't become
requirements by accident. Acceptance: every existing capability has an owner and an explicit keep/drop
decision — nothing dropped implicitly, nothing carried by default (Cartwright, Horn & Lewis,
*Patterns of Legacy Displacement* — Feature Parity is a pattern they generally advise against, since
blanket replication rebuilds unused features). Approval/authorization configuration migrates
explicitly, never reset to a default.

**Consolidating N similar systems into one core.** Extract the byte-identical helpers first, behind
compatibility adapters that preserve legacy output, and **share mechanism, not policy** (Brinch
Hansen's separation of mechanism and policy): the core owns scheduling, bounded I/O, and
cancellation; each source keeps whether a retry is permitted and what its errors mean — a shared
auto-retry middleware erases deliberate per-source behavior. Then migrate one operation per
variance axis (each protocol/engine type, plus one existing write path with its approval behavior)
before generalizing, and accept on matching semantic output *and coverage* — compare network calls,
not just elapsed time.

### 6. Deprecation — retiring an old contract or API version
Ground: patricio0312rev/skills `api-versioning-deprecation-planner` (MIT). Use standard deprecation
response headers instead of silent breakage: `Deprecation: true`, `Sunset: <date>`, `Link:
<new-url>; rel="alternate"`. Default 6-month timeline: month 1 announce → months 2–4 run both versions
in parallel and track old-version usage → month 5 final warning to remaining callers → month 6 sunset
(`410 Gone`). Contract/versioning-scheme ownership lives in [contracts.md](contracts.md); this
reference owns the retirement timeline and header contract, not the versioning scheme itself.

## Anti-patterns
- **Big Bang Rewrite** — ships nothing until full parity; the default failure mode Strangler Fig
  exists to avoid.
- **Premature Decomposition** — extracting before the shared-DB and dependency questions (§2–3) are
  resolved.
- **No Rollback** — cutting over without a tested rollback path; every gate in §4 must have one.
- **Dual allowance** — legacy and new paths both live on copied quota/cooldown state (§1).

## Validation
- The strategy pick names one of the 7 Rs (or a Strangler Fig extraction) and states why — not just
  "we're migrating."
- Every extraction lists its dependency risk, with shared-DB dependencies called out explicitly.
- Every existing capability has an owner and a keep/drop decision before cutover (§5).
- A cutover gate exists with named go/no-go thresholds before any traffic-shift is proposed.
- Any retired contract has a stated deprecation timeline and header contract.

## Failure modes and handoff
- **The request wants the new target shape, not how to get there** — hand off to
  [decomposition.md](decomposition.md).
- **The request wants the new contract's design** — hand off to [contracts.md](contracts.md); return
  here for the transition plan.
- **No rollback path exists** — stop; do not approve a cutover gate without one (§4, Anti-patterns).
- **A shared DB blocks the extraction order in §5** — resolve via §3 before proposing the order.
- **The system is agentic and the "migration" is a model/vendor swap, not a service extraction** —
  read [surface-agentic.md](surface-agentic.md); model migrations carry different risk (eval
  regression, not just latency/error-rate).
