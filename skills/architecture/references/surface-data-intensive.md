# Surface: Data-Intensive

Purpose: Apply the data/analytics/ML-platform overlay — name the operational/analytical boundary,
pick batch vs stream, and decide mesh vs centralized ownership, using reliability/scalability/
maintainability as the shaping lens instead of vague "-ilities."

Read when:
- The system is primarily a data, analytics, or ML platform and the request asks "batch or
  streaming," "data mesh vs lakehouse," or "how should the operational and analytical sides split."
- A generic system has grown an analytical side large enough to need its own architecture pass.

Skip when:
- The mechanism itself (CQRS, event sourcing, consistency model) is the actual question — use
  [data-architecture.md](data-architecture.md); this overlay only says a boundary must be named
  before that mechanism is picked.
- The ask is pipeline implementation, orchestration code, or data governance tooling — hand off to
  `data`.
- The ask is model training/serving architecture — hand off to `ai`.
- Numeric NFR targets (throughput, latency, SLO) are the ask — use [nfr-budgets.md](nfr-budgets.md).

Inputs:
- Where operational (OLTP) data currently lives and how analytical (OLAP) consumers currently read
  it — state explicitly when there's no existing pipeline; do not assume one.
- Freshness requirement per consumer (real-time decision vs nightly report) — this drives §2.
- Number of domain teams producing data vs a single central data team's capacity — drives §3.

Produces:
- A named operational/analytical boundary and crossing mechanism (CDC, ETL/ELT, event stream).
- A batch-vs-stream (or both) decision per data flow.
- A mesh-vs-centralized ownership call with its trigger.
- The platform assessed against reliability/scalability/maintainability, not generic "-ilities."

## Procedure

### 1. Name the operational/analytical boundary first
Ground: Kleppmann, *Designing Data-Intensive Applications* (concept index only — copyrighted book,
no verbatim reproduction). OLTP (operational): low-latency point queries, current state, optimized
for writes and single-record reads. OLAP (analytical): aggregate scans over history, optimized for
reads across many records, tolerant of staleness. Before picking CQRS, event sourcing, or any
mechanism to move data between them — owned by [data-architecture.md](data-architecture.md) — state
explicitly **where the boundary sits and how data crosses it** (change-data-capture off the
operational store, an ETL/ELT batch job, or a live event stream). A platform with no stated boundary
answer typically has analytical queries silently hitting the operational store, which is itself a
Noisy-Neighbor failure mode (owned by [nfr-budgets.md](nfr-budgets.md)).

### 2. Batch vs stream
Ground: DDIA Part III (Ch10 Batch, Ch11 Stream — concept index only). Batch: bounded input,
deterministic, reprocessable from scratch, higher latency, favors correctness (full recompute fixes a
bug in a derived dataset). Stream: unbounded, continuous, low-latency, harder to safely reprocess.
Decision driver: does a consumer need "as of right now" freshness, or is a nightly-batch-derived
answer acceptable? Most non-trivial platforms need both (a lambda- or kappa-style split by
consumer) — don't force one mechanism to serve every freshness requirement; name which flows are
batch and which are stream per consumer, not for the platform as a whole.

### 3. Data mesh vs centralized lake/warehouse
Ground: Zhamak Dehghani, Data Mesh — four principles: **domain ownership** (each domain owns its
analytical data), **data as a product** (discoverable, addressable, self-describing, with an SLA),
**self-serve data platform** (infra-as-a-platform lowers the barrier to publishing/consuming), and
**federated computational governance** (interoperability standards enforced computationally, not by
a central review board). Choose mesh when the actual pain is **organizational** — many domain teams
blocked waiting on one central data team — not a technology preference. Choose a centralized
lake/warehouse/lakehouse when a single team can serve every consumer without becoming that bottleneck;
adopting mesh below that threshold trades a solvable technology problem for a harder org-design
problem the four principles don't solve by themselves.

### 4. Reliability / scalability / maintainability as the shaping lens
Ground: DDIA Ch1 (concept index only). Apply these three explicitly instead of a vague "make it
robust/scalable" mandate:
- **Reliability** — name what partial failure the platform must tolerate (node loss, late/duplicate
  events) and the replication/partitioning tradeoff that covers it.
- **Scalability** — name the load parameter that actually matters (ingest rate, query fan-out, data
  volume growth) — "scalable" with no named parameter is not a requirement.
- **Maintainability** — favor an architecture a new engineer can extend without the original author;
  operability and evolvability are architecture properties, not afterthoughts.

Quantified targets from this triad (throughput numbers, latency SLOs, capacity headroom) hand off to
[nfr-budgets.md](nfr-budgets.md); this overlay names which dimension matters, that reference sets the
number.

### 5. Operational posture
Ground: dastergon/awesome-sre (no-license, catalog only — cite, don't copy) — capacity planning and
SLO/SLA are named as targets here; running them (dashboards, on-call, alerting) is `operate`'s border.

## Validation
- The operational/analytical crossing mechanism is named, not implicit.
- Each data flow is labeled batch, stream, or both — not left as an undifferentiated "the pipeline."
- The mesh-vs-centralized call states its trigger (org bottleneck vs technology preference).
- Reliability/scalability/maintainability are each addressed with a named parameter, not adjectives.

## Failure modes and handoff
- **Analytical queries hitting the operational store with no stated boundary** — return to §1.
- **"We need streaming" with no freshness requirement named** — return to §2 before committing to the
  added operational complexity of a stream mechanism.
- **Data mesh proposed as a technology upgrade, not an org-scaling fix** — challenge before adopting;
  return to §3.
- **The ask is really CQRS/event-sourcing/consistency-model mechanics** — hand off to
  [data-architecture.md](data-architecture.md).
- **The ask is pipeline code, governance tooling, or model serving** — hand off to `data` or `ai`.
