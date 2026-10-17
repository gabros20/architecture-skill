# Data architecture

Purpose: Decide how data flows through a system — the operational-vs-analytical split,
consistency guarantees, and store/schema choices — as budget-bounded decisions, not a menu of
every pattern that exists.

Read when:
- The request asks to design data flow, choose a consistency model, decide CQRS/Event Sourcing,
  plan a data-mesh/analytics split, or pick an identifier scheme.
- A service boundary from [decomposition.md](decomposition.md) needs to decide how its data
  crosses into another service's data.

Skip when:
- The boundary itself isn't settled — use [decomposition.md](decomposition.md) first.
- The ask is DDL authoring, index tuning, or query optimization — route to `backend`; this
  reference decides the pattern, not the SQL.
- The ask is a dbt pipeline, warehouse ELT, or a data-governance program — route to `data`; this
  reference stops at the operational/analytical boundary and the principles that shape it.
- The ask is the numeric SLO/latency budget for a query — use [nfr-budgets.md](nfr-budgets.md).

Inputs:
- The read:write ratio and consistency requirement per data flow — state explicitly when
  unmeasured, do not assume.
- Whether the data feeds analytics/reporting, and who owns that.
- Existing store(s) in use — state explicitly when starting greenfield.

Produces:
- A consistency-model decision (linearizable vs eventual, per data flow) with its tradeoff named.
- A CQRS/Event-Sourcing go/no-go, scored against §3.
- An outbox/dual-write decision wherever a write must cross a service boundary.
- A store-selection decision (polyglot-persistence rule), the system of record per entity, an
  identifier scheme, and the state-field shape.

## Contents

- The operational-vs-analytical split
- Consistency: CAP/PACELC
- CQRS + Event Sourcing — scored, not defaulted
- The dual-writes problem → Transactional Outbox
- Polyglot persistence and the system of record
- Schema decisions: identifiers and state fields

## Procedure

### 1. The operational-vs-analytical split
Keep the operational store (serves the app: low-latency, current-state) and the analytical store
(serves reporting/ML: latency-tolerant, historical) separate from the start — conflating them is
the root cause of "the report query took down prod." **Data Mesh** (Zhamak Dehghani,
https://www.datamesh-architecture.com/) reframes the analytical side around **4 principles**:
domain ownership (domains own their analytical data, not a central team), data-as-a-product
(discoverable, addressable, trustworthy, with an SLA), self-serve data platform (infra as a
platform, not bespoke pipelines), federated computational governance (interoperability standards
enforced by tooling, not a review board). Contrast with a **lakehouse**, which centralizes storage
while keeping table-format openness: choose data mesh when domain ownership is the bottleneck,
lakehouse when fragmented storage/format is. Pipeline implementation and governance tooling →
`data`.

### 2. Consistency: CAP/PACELC
**CAP** (Gilbert & Lynch): under a network partition, choose Consistency or Availability — not
both. **PACELC** (Daniel Abadi) extends it to the normal case: *if Partition, choose A or C; Else,
choose Latency or Consistency* — most systems spend most of their life in the "Else" branch, so
this tradeoff matters even when nothing is broken. Spectrum: **linearizable → sequential → causal
→ eventual**, with quorum reads/writes as the dial between them. This is a hard-to-reverse choice
tied directly to store selection (CP: Postgres / majority-write Mongo; AP: Cassandra/DynamoDB) and
to the SLO owned by [nfr-budgets.md](nfr-budgets.md) — decide it per data flow, not once for the
whole system; a shopping cart and a view counter don't need the same guarantee.

### 3. CQRS + Event Sourcing — scored, not defaulted
Don't reach for CQRS/ES because it's interesting; score it (vasilyu1983/ai-agents-public
`data-architecture-patterns.md`, MIT, github.com/vasilyu1983/ai-agents-public):

| Signal | CQRS indicator |
|---|---|
| Read:write ratio | **>10:1** is a strong signal for a separate read model |
| Query shape | Diverges from write shape; multiple denormalized views needed per consumer |
| Audit/temporal need | Must reconstruct state at any past point → Event Sourcing, not just CQRS |
| Team scale | Read and write sides are owned/scaled independently |

Event Sourcing scores separately on top: audit need (+3), temporal-query need (+2), replay-for-
debugging value, against the cost of upcasting old event schemas as the model evolves. If the
score doesn't clear the bar, a read replica or materialized view solves the read-side problem
without ES's operational cost (schema versioning, snapshotting, no ad-hoc queries against the
event store). CQRS read views are **eventually consistent** by construction (microservices.io,
Chris Richardson, https://microservices.io/patterns/data/cqrs.html) — state that lag explicitly.

### 4. The dual-writes problem → Transactional Outbox
Writing to your own DB and publishing an event are two operations — if the process crashes
between them, or the publish fails, they go out of sync. "Just retry the publish" doesn't fix
this. **Transactional Outbox**: write the event to an `outbox` table in the *same* local
transaction as the state change; a separate relay (log-tailing/CDC, e.g. Debezium, or a polling
publisher) publishes it after — atomicity comes from the local transaction, not from coordinating
two systems (microservices.io Transactional Outbox; paraphrased from Sairyss/system-design-
patterns, no license on file). For cross-service transactions more broadly, triage by **Saga vs
2PC vs Process Manager**: Saga (local transactions + compensating actions; choreography = events,
no coordinator, or orchestration = central coordinator) for long-running processes that can
tolerate temporary inconsistency; 2PC only when you control every participant and need atomicity
now (rare in microservices — the coordinator is a single point of failure); Process Manager when
the orchestration has enough branching logic to need its own explicit state machine, not just a
saga script. Compensation must be an operation the upstream defines and the caller is authorized to
run — otherwise a multi-step external action (upload, then publish) is not transactional: checkpoint
each step's receipt so a retry reuses a still-valid one.

For a process that outlives any one run (multi-day human gates, a timed outreach sequence), pick a
shape: a **durable-execution workflow engine**, or a **Process Manager** (Hohpe & Woolf, *Enterprise
Integration Patterns* — holds the sequence state and picks the next step) whose state lives in the
system of record, advanced by short scheduled sweeps that query for due actions. Prefer the sweep on
an intermittent host (a laptop, a single cron box) — it catches up after downtime, and the entity
record, not a run, is the checkpoint. Gate either with a **durability acceptance test**: a pending
approval survives an orchestrator restart, and a retried send never double-fires. Paged ingestion
follows the same order — commit the records, then advance the cursor.

### 5. Polyglot persistence and the system of record
**Start with one Postgres. Add a specialized store only when Postgres demonstrably can't meet a
pattern** (vasilyu1983 `data-architecture-patterns.md`) — not because a NoSQL/graph/search store
is trendier. Justify each addition against a named failure: full-text search at scale (→ a
dedicated search index), graph-traversal queries (→ a graph store), write-heavy time-series (→ a
column/time-series store). Every added store is an added consistency boundary (back to §4) and an
added operational surface — the tradeoff is real, not hypothetical.

**One system of record per entity, per phase.** Every other copy — search index, cache, embeddings,
a CRM view — is derived data (Kleppmann's systems-of-record vs derived-data split) and must be
rebuildable from the system of record; a derived store that can't be rebuilt is a bug, and a two-way
"mirror" between peers is two systems of record with no conflict rule. Moving the system of record
is a tested one-way migration ([migration.md](migration.md)), not a sync. Concurrent writers need
one authoritative writer per scope, transactions plus leases, or optimistic concurrency (a version
checked on every write — Kleppmann's compare-and-set remedy for lost updates); atomic file
replacement makes a write atomic, not a read-modify-write. The trigger to leave a single-writer
store is often the *second writer* (a second operator or process), well before any volume threshold.

### 6. Schema decisions: identifiers and state fields
Pick the identifier scheme for its actual failure mode, not habit (Sairyss/system-design-patterns;
wshobson/agents `postgresql`, MIT):

| Scheme | Sortable | Opaque (no enumeration) | Notes |
|---|---|---|---|
| **UUIDv4** | No | Yes | Random — poor B-tree locality at scale (index bloat); safe default for opacity |
| **UUIDv7** | Yes (timestamp-prefixed) | Partial (timestamp leaks) | Fixes v4's index-locality problem, still globally unique without coordination |
| **ULID** | Yes | Partial | Same timestamp-prefix tradeoff as v7, more compact string form |
| **Snowflake** | Yes | No (timestamp+shard+sequence) | Needs a coordinated ID-generation service; best when shard locality matters |
| **BIGINT identity** | Yes | No | Best index locality, smallest footprint; unusable across services without a central sequence |

Default: `BIGINT GENERATED ALWAYS AS IDENTITY` for a single-writer table; UUIDv7 when IDs must be
generated client-side or across services without coordination and index locality still matters;
UUIDv4 only when opacity (no enumeration, no leaked creation-order) is a real requirement.

Model independent lifecycles as separate state fields (disposition, build, delivery, …), not one
linear status enum — the orthogonal-region idea from Harel statecharts (statecharts.dev: four
independent switches need 8 states as parallel regions vs 16 states and 64 transitions flattened).
Conversely, states that differ only in *why* (blocked, failed, awaiting approval) collapse into one
state plus a reason field.

## Validation
- The operational/analytical split is named explicitly, even if the answer is "not needed yet."
- Every consistency choice is per-data-flow, not one system-wide declaration.
- CQRS/ES is backed by the §3 score, not asserted.
- Any cross-service write names its outbox/dual-write handling.
- Store additions beyond the single Postgres are each justified against a named failure mode.
- Each entity names one system of record; every other store is marked derived and rebuildable.

## Failure modes and handoff
- **CQRS/ES proposed with no read:write imbalance or audit need** — score it (§3); if it doesn't
  clear the bar, recommend a read replica or materialized view instead.
- **A cross-service write with no outbox/idempotency plan** — flag the dual-writes risk before it
  ships (§4).
- **Store sprawl with no named failure driving each addition** — apply the polyglot-persistence
  rule (§5) and consolidate.
- **A "mirror" or "sync" between two stores of the same entity** — name the one system of record;
  the other is derived or migrated one-way (§5).
- **The real ask is pipeline/dbt/governance work** — hand off to `data`.
- **The real ask is DDL/index/query tuning** — hand off to `backend`.
