# System design

Purpose: Turn a request for "design the system" into a requirements-gated, leveled design — the
canonical entry point that produces a scoped component decomposition, C4-notated diagrams, and an
arc42-shaped document, so every deeper reference (contracts, data, NFR, security) has a shared skeleton
to attach to instead of an ad-hoc one.

Read when:
- The request asks to "design," "architect," or "spec out" a system, service, or feature from
  scratch, or to review an existing design for gaps.
- No requirements or NFR targets have been captured yet — this is the mandatory first stop, before
  any other architecture reference.

Skip when:
- Requirements are already gated and the ask is a specific facet — boundaries/coupling → route to
  [Decomposition](decomposition.md); API/event interfaces → [Contracts](contracts.md); data flow/
  consistency → [Data architecture](data-architecture.md); perf/scale/cost targets →
  [NFR budgets](nfr-budgets.md); threat model → [Security architecture](security-architecture.md).
- The system is agentic/LLM-based — read this for the method, then load
  [surface-agentic.md](surface-agentic.md) before finalizing component boundaries; agent
  orchestration patterns live there, not here.

Inputs:
- The problem statement, scale/latency/cost targets, team size, and timeline — state explicitly
  when absent; do not invent numbers to fill a template.
- Any existing architecture doc, ADR log, or constraints — treat as decisions to preserve, not
  defaults to override.

Produces:
- A locked requirements set (functional + NFR + constraints) with contradictions surfaced.
- A leveled design: system context → containers → components (C4), each with an explicit
  technology.
- An arc42-shaped design document (or the sections of it relevant to the request's size).
- A named set of trade-offs and an explicit "what we would revisit and when" list.

## Contents
- The requirements gate
- The design method (five steps)
- C4 — the diagram levels
- arc42 — the document skeleton
- Back-of-envelope numbers
- Reversibility and over-architecture

## Procedure

### 1. The requirements gate (Google's discipline)

Google's `google-cloud-solution-architecture` skill (Apache-2.0 — github.com/google/skills) enforces
a hard rule: **do not propose, outline, or recommend any design until functional and non-functional
requirements are captured and locked.** Proposing solutions early anchors on products/technologies
prematurely and creates confirmation bias in every step that follows. Capture, in order: (1)
functional requirements, (2) NFRs — scale, latency, availability, cost, security/compliance, DR —
and *why each one matters for this system*, (3) current state and dependencies — read from code at a
pinned revision, not READMEs or comments, and verify (don't recall) each dependency's API access and
entitlement before scheduling work on it, (4) constraints (team size, timeline, existing stack).
Then run an explicit **contradiction check** — e.g. "complete network isolation" vs "real-time
ingestion from public APIs" — surface the conflict, name the trade-off, and force a decision before
any component is named. Ask one question at a time for missing inputs; mark unknowns TBD rather than
inventing them.

### 2. The design method (five steps)

Anthropic's `@system-design` skill (Apache-2.0 — github.com/anthropics/knowledge-work-plugins)
gives the minimal spine — treat it as the default sequence, extended where the deeper corpora add
detail:
1. **Requirements** — functional; NFR (scale, latency, availability, cost); constraints (team,
   timeline, stack). Gate per §1.
2. **High-level design** — component diagram, data flow, API contracts, storage choices.
3. **Deep dive** — data model, API design (REST/GraphQL/gRPC), caching, queue/event design, error
   handling and retry.
4. **Scale and reliability** — load estimation, horizontal vs vertical, failover/redundancy,
   monitoring/alerting targets (targets are owned here; runtime monitoring → `operate`).
5. **Trade-off analysis** — every decision states complexity, cost, team familiarity,
   time-to-market, and maintainability cost explicitly; never leave a pick unjustified.

karanpratapsingh's course (CC-BY-NC-ND — cite/link only, github.com/karanpratapsingh/system-design)
splits steps 2–3 more finely (estimation & constraints → data-model design → API design →
high-level component design → detailed design → bottleneck resolution) and adds **PACELC** (CAP
extended to the no-partition case — defined in [Data architecture](data-architecture.md) §2). State
which consistency/latency quadrant a data store's SLA implies before picking it; hand the
consistency-model decision itself to [Data architecture](data-architecture.md). donnemartin's `system-design-primer`
(CC-BY-4.0 — github.com/donnemartin/system-design-primer) compresses this to four steps (use
cases/constraints/assumptions → high-level design → core components → scale) and is the source for
§5's numbers.

Cap every pass at **3–5 decisions** (vasilyu1983/ai-agents-public, MIT —
github.com/vasilyu1983/ai-agents-public): more than that stops reading as a decision set and starts
reading as a document dump. Each decision = concrete pick + what NOT to build + the trade-off.

### 3. C4 — the diagram levels

Simon Brown's C4 model (CC-BY-4.0 — c4model.com) is the canonical notation for step 2's diagrams.
Hierarchy: **Person → Software System → Container → Component → Code.**

| Level | Scope | Shows | Recommended? |
|---|---|---|---|
| System Context | one system | the system as a box + its users/external systems | Yes — always |
| Container | one system | apps/data stores inside it, tech choices, comms | Yes — always |
| Component | one container | components inside it + responsibilities | Only if it adds value |
| Code | one component | classes/tables (UML) | No — prefer IDE-generated |
| System Landscape | a portfolio | a context diagram with no single focus system | Yes, for portfolios |
| Deployment | one environment | systems/containers mapped onto infrastructure | Yes |

Every diagram needs a title (type + scope) and a key; every element states its type, technology, and
build/buy/reuse call; every relationship line is labeled with direction and protocol/intent — never
a bare "Uses." Component and Code diagrams are optional depth, not required deliverables — stop at
Container unless the request specifically needs finer resolution.

### 4. arc42 — the document skeleton

arc42 (docs.arc42.org) is the canonical shape for the written architecture document — use its 12
sections as the table of contents for any design doc heavier than a single ADR: (1) Introduction
and Goals, (2) Constraints, (3) Context and Scope, (4) Solution Strategy, (5) Building Block View,
(6) Runtime View, (7) Deployment View, (8) Crosscutting Concepts, (9) Architecture Decisions —
link to [ADR and governance](adr-and-governance.md)'s ADR log, don't duplicate its content —
(10) Quality Requirements — link to [NFR budgets](nfr-budgets.md) — (11) Risks and Technical Debt,
(12) Glossary. Fill only the sections the request's size warrants; a single feature rarely needs
all 12. Use [solution-architecture-doc.md](../assets/solution-architecture-doc.md) as the fillable
spine when the deliverable is a standalone document rather than an in-conversation answer.

### 5. Back-of-envelope numbers

From donnemartin's `system-design-primer` (CC-BY-4.0): use these to ground step 4's scale claims,
not to replace a real load test.

- **Availability in nines** — 99% ≈ 3.65 days/yr downtime · 99.9% ≈ 8.7 hr/yr · 99.99% ≈ 52 min/yr
  · 99.999% ≈ 5 min/yr. Series-connected components multiply availability down; parallel
  (redundant) components raise it — never quote a system's availability higher than its weakest
  serial dependency.
- **Cache strategies** — cache-aside (app checks cache, falls back to DB on miss, writes DB then
  cache — most common, tolerates cache failure), write-through (write cache+DB together — extra
  write latency, data never stale), write-behind/write-back (write cache, async-flush to DB —
  fastest writes, risk of loss on cache failure), refresh-ahead (predictively refresh before
  expiry — wasted work if the prediction is wrong). Pick by write-latency tolerance vs
  staleness/loss tolerance, not by default. Key every
  cache by everything that changes the answer — operation, input, projection, locale, parser
  version, and the account for private data (HTTP's `Vary` and `private`, RFC 9111 §4.1/§5.2.2.7);
  account-scoped data never lands in a shared entry, and a signed, expiring URL is not a content
  identity.
- **Latency orders of magnitude** — L1 cache ~1 ns · main memory read ~100 ns · SSD random read
  ~16 μs · round trip in same datacenter ~500 μs · disk seek ~4 ms · round trip CA↔Netherlands
  ~150 ms. Use these to sanity-check whether a proposed design's critical path is memory-bound,
  disk-bound, or network-bound before optimizing the wrong layer.

### 6. Reversibility and over-architecture

Treat every decision through Amazon's one-way/two-way door lens: reversible (two-way) decisions
need a quick call, not a design doc; irreversible (one-way) decisions — data-store choice, public
API shape, org/team boundary — earn deeper analysis and an ADR (route to
[ADR and governance](adr-and-governance.md)). Don't over-architect: a well-modularized monolith or
a single ADR is often the correct answer for an MVP or a small team; add microservices,
event-sourcing, or a service mesh only when a named disintegrator (team scaling, deploy-cadence
conflict, load, tech mismatch) justifies it — see
[Decomposition](decomposition.md) for the monolith-first rule and the coupling model that
quantifies when a split is warranted.

The same restraint holds below the service level: start with a few workspace packages and plain
folders, and split a package only when it needs its own dependency set or release lifecycle — no
empty packages for the roadmap. Expose the core as an importable library that CLI/MCP/HTTP adapters
wrap; add a resident server or broker only when persistent connections, pooling, or concurrent
clients demand it, since a daemon adds lifecycle and authorization work. A manual procedure or CSV
import is a legitimate first adapter behind the same port — automate it once it has repeated — and
each deferred item is recorded with its trigger.

## Validation

- Requirements + NFRs are captured and any contradiction is named with a chosen resolution — not
  silently dropped.
- The design names an explicit level (context/container/component) and doesn't mix them on one
  diagram without saying so.
- Every non-trivial pick states complexity/cost/familiarity/maintainability trade-offs, not just
  the choice.
- Scale claims are grounded in §5's numbers or a stated real benchmark, not an unfounded assertion.

## Failure modes and handoff

- **Solutioning starts before requirements are locked** — stop, return to §1; anchoring on a
  product/technology early is the single most common failure this reference exists to prevent.
- **The request is really about boundaries/coupling, not the overall method** — hand off to
  [Decomposition](decomposition.md) once the high-level design exists.
- **The request wants the interfaces themselves (API/event schemas)** — hand off to
  [Contracts](contracts.md); this reference stops at "storage choices" and "API design" as a
  step name, not the contract artifact itself.
- **The system is agentic** — the five-step method still applies, but component boundaries and
  the workflow-vs-agent decision belong in [surface-agentic.md](surface-agentic.md); read it before
  finalizing step 2's high-level design.
- **The ask is a full written deliverable** — use
  [solution-architecture-doc.md](../assets/solution-architecture-doc.md) as the artifact spine and
  hand off per [handoff.md](handoff.md) once the design is locked.
