---
name: architecture
description: >-
  Decide the shape of a software system — boundaries, contracts, NFR budgets, threat model, and
  ADRs — at the Shape stage between product and the build skills. Use to design the system, define
  the architecture, decide microservices vs monolith, draw bounded contexts, spec
  API/event contracts, set SLO/perf/cost budgets, threat-model (STRIDE), plan a migration or
  deprecation, write an ADR, or architect an agent/LLM system. Not for product discovery/PRD (→
  product), UX/UI (→ design), production code (→ frontend/backend/data/ai), diagram rendering, or
  CI/deploy/runtime ops (→ operate).
---

# Product Architecture

## Mission and boundary

Decide the *shape* of a software system — its boundaries, interface contracts, NFR budgets, threat
model, and the durable decision record — precisely enough that the build skills can implement the
right thing in parallel without re-deriving it. Own the Shape stage between `product` (which decides
what to build and why) and the build skills (which write the production code): the consequential,
hard-to-reverse decisions — service boundaries, public API shape, data-store and consistency choice,
auth model, SLO targets — not the implementation behind them.

Own the decision, the contract, the budget, and the threat model; not the code. Production
frontend/backend/data/ai code belongs to the build skills; UX and UI to `design`; discovery, PRDs,
and prioritization to `product`; independent load-testing and vulnerability scanning to `quality`;
runtime SLO monitoring, dashboards, and deploy pipelines to `operate`; cross-system business
processes spanning systems you do not own to `automation`. Contribute to those; own none.
Operate independently when invoked alone; when compatible upstream artifacts are supplied (a PRD, a
product handoff, an existing ADR log or design doc), use them without silently overriding established
decisions. Recommend adjacent skills when useful; do not invoke them automatically unless the user
explicitly requested a composition workflow.

## Route before acting

1. Capture requirements first (see invariants) — do not open a reference to solution before functional
   requirements and NFRs are stated and contradictions surfaced.
2. Pick the **one primary job** the request needs, and **at most one surface overlay** — the system
   type reshapes boundaries, contracts, and budgets.
3. Read every selected reference completely before producing the affected artifact; load 2–3 at most,
   never preload the pack.
4. For an LLM/agent system, always add the agentic overlay — it changes topology, the eval gate, and
   the security model.

### Primary job (pick one)

| User intent | Read | Contribution |
|---|---|---|
| "Design/architect/spec the system" from scratch, or review a design for gaps — the default entry | [system-design](references/system-design.md) | Requirements gate, leveled C4/arc42 design, trade-offs, back-of-envelope numbers |
| "Break this up," "should this be a microservice," define modules/bounded contexts, fix coupling | [decomposition](references/decomposition.md) | Bounded contexts, monolith/modular/micro call with a named disintegrator, quantified coupling read |
| "Design the API," "define the contract," spec endpoints/events, version/deprecate an interface | [contracts](references/contracts.md) | REST/gRPC/GraphQL pick, OpenAPI/AsyncAPI skeleton, versioning + deprecation plan, review checklist, upstream-wrapper contract |
| Design data flow, choose a consistency model, decide CQRS/ES, pick an identifier scheme | [data-architecture](references/data-architecture.md) | Consistency decision per flow, CQRS/ES score, outbox/dual-write call, store selection, one system of record |
| Set perf/latency/reliability targets, an SLO, a scaling/capacity/cost plan, a Well-Architected review | [nfr-budgets](references/nfr-budgets.md) | Performance-budget table, SLO + error budget, scaling triggers, WA self-audit, resilience strategy |
| Threat-model, decide the auth/authz model, tenant isolation, a privacy/data-governance stance | [security-architecture](references/security-architecture.md) | STRIDE register, auth/authz decision, zero-trust posture, data-classification statement |
| Migrate/replatform, extract a service, deprecate an API, modernize a legacy system | [migration](references/migration.md) | 7 Rs / Strangler-Fig pick, extraction order, comparison-read cutover gate, deprecation timeline |
| "Write an ADR," record/govern a decision, check code against a prior decision, audit an ADR log | [adr-and-governance](references/adr-and-governance.md) | ADR (right-weight template), lifecycle/immutability rule, drift detection, named fitness functions |

### Surface overlay (add at most one base surface)

Pick the one base surface that fits the system type. The **agentic** overlay is additive: when the
system is *also* an LLM/agent system, stack `surface-agentic` on top of the base surface — it does not
replace it (per the invariant below, it changes topology, the eval gate, and the security model).

| System type | Read | Reshapes |
|---|---|---|
| Multi-tenant web app / SaaS (default) | [surface-web-saas](references/surface-web-saas.md) | Tenant isolation (silo/pool/bridge), 3-tier + per-client BFF, OIDC tenant resolution |
| Native mobile client (iOS/Android) | [surface-mobile](references/surface-mobile.md) | Client pattern (MVVM/TCA/Clean/RIBs), offline/sync + conflict rule, SSOT/UDF |
| **Agentic / LLM system** | [surface-agentic](references/surface-agentic.md) | **Harness design, workflow-vs-agent, multi-agent economics, RAG topology, memory tiers, eval-as-gate, agent security + action safety, runtime build-vs-buy + lifecycle ownership** |
| Data / analytics / ML platform | [surface-data-intensive](references/surface-data-intensive.md) | Operational/analytical boundary, batch-vs-stream, mesh-vs-centralized ownership |
| Internal tool / developer platform (IDP) | [surface-internal-platform](references/surface-internal-platform.md) | Team Topologies bridge, platform-as-product threshold, "don't build a platform yet" gate |

### Handoff

When downstream build work is expected, read [handoff](references/handoff.md) and emit the
`handoff.yaml` companion; skip it for a standalone request nothing downstream will read.

## Universal invariants

- **Requirements-gate before solutioning.** Do not propose, outline, or recommend a design until
  functional requirements and NFRs are captured and any contradiction (e.g. "full network isolation"
  vs "real-time public ingestion") is surfaced and resolved. Ask one question at a time for missing
  inputs; mark unknowns TBD; never invent a number the requester hasn't given or approved.
- **Don't over-architect.** Default to a modular monolith and the lightest sufficient artifact — a
  single ADR often beats a full arc42, a shared library often beats a platform team. Add complexity
  (a service split, event sourcing, a platform team) only when a *named* disintegrator justifies it,
  not because it is the "modern" choice. Applying mature-stage architecture to an MVP is the failure
  mode to avoid.
- **Weight analysis by reversibility.** Treat each decision as a one-way (irreversible: data store,
  public API shape, org/team boundary) or two-way door. One-way doors earn deeper analysis and an
  ADR; two-way doors earn a quick call. Name explicit options and state "would choose X if {trigger}."
- **Every recommendation is a concrete pick + what NOT to build + a stated trade-off.** Cap each pass
  at 3–5 decisions; more reads as a document dump, not a decision set.
- **Exhaustive checklists use a uniform table + self-audit count, never a narrative.** For any
  "cover N items" task (Well-Architected pillars, STRIDE per element, the API checklist), fill one
  row per item and count covered rows against the total before calling it done — a single narrative
  pass reliably drops rows and stops citing findings well before full coverage.
- **Distinguish facts, decisions, assumptions, and proposals.** Preserve upstream decisions and user
  constraints, or flag the conflict explicitly; prefer repository and artifact evidence over generic
  defaults.

## Core workflow

1. Inspect the request, evidence, constraints, and existing artifacts (PRD, ADR log, design doc).
2. Gate requirements: functional + NFR + constraints captured, contradictions surfaced.
3. Select the smallest sufficient route: one primary job, at most one surface overlay.
4. Record material assumptions and unresolved inputs with owners.
5. Produce the requested artifact, grounded in the framework the reference names; cap at 3–5
   decisions per pass, each with its trade-off.
6. Validate against the request, constraints, and acceptance criteria; state confidence.
7. Emit a compact `handoff.yaml` when downstream build work is expected.

## Artifact contract

Each reference defines its own artifact. Every architecture artifact must record: the decision made
and the options considered; the trade-off accepted; facts/decisions/assumptions distinguished; and
the reversibility lens applied to any hard-to-reverse call. A full architecture pass produces up to
five downstream artifacts — a solution-architecture doc
([assets/solution-architecture-doc.md](assets/solution-architecture-doc.md), arc42-shaped), API/event
contracts, NFR budgets ([assets/nfr-budget-worksheet.md](assets/nfr-budget-worksheet.md)), ADRs
([assets/adr-template.md](assets/adr-template.md)), and a STRIDE threat model
([assets/threat-model-register.md](assets/threat-model-register.md)) — plus the DDD canvases
([assets/bounded-context-canvas.md](assets/bounded-context-canvas.md),
[assets/aggregate-design-canvas.md](assets/aggregate-design-canvas.md)) and
[assets/arc42-skeleton.md](assets/arc42-skeleton.md) where the job calls for them. Provide the
machine-readable `handoff.yaml` companion whenever downstream work is expected; see
[handoff](references/handoff.md).

## Completion and handoff

Before completion:

- Confirm every requested artifact exists and its acceptance criteria are checkable.
- Confirm every exhaustive-checklist artifact is a table with a self-audit count, not a narrative.
- Record decisions, assumptions, risks, and unresolved questions with named owners.
- Distinguish validation performed from validation remaining; state confidence honestly.
- When downstream build work is expected, emit the `handoff.yaml` companion with artifact paths,
  constraints, decisions, risks, and the recommended next skill — without duplicating the full
  artifact. Never silently invoke a build skill; name it in `recommended_next`.

## Resources

Load only what the selected route requires; never preload.

- Primary jobs: [system-design](references/system-design.md) — the requirements-gated entry spine ·
  [decomposition](references/decomposition.md) — boundaries, coupling, monolith-first ·
  [contracts](references/contracts.md) — API/event contract-first · [data-architecture](references/data-architecture.md)
  — consistency, CQRS/ES, stores · [nfr-budgets](references/nfr-budgets.md) — the -ilities as numbers ·
  [security-architecture](references/security-architecture.md) — STRIDE, auth, zero-trust ·
  [migration](references/migration.md) — Strangler Fig, 7 Rs, cutover · [adr-and-governance](references/adr-and-governance.md)
  — decision records + fitness functions
- Surface overlays: [surface-web-saas](references/surface-web-saas.md) ·
  [surface-mobile](references/surface-mobile.md) · [surface-agentic](references/surface-agentic.md) ·
  [surface-data-intensive](references/surface-data-intensive.md) ·
  [surface-internal-platform](references/surface-internal-platform.md)
- Pipeline: [handoff](references/handoff.md) — standalone vs pipeline behavior and the `handoff.yaml`
  companion consumed by `frontend`, `backend`, `data`, `ai`, and `quality`.
- Assets: fillable templates in [assets/](assets/) — solution-architecture doc, arc42 skeleton, ADR
  templates, NFR budget worksheet, threat-model register, bounded-context and aggregate-design
  canvases, and the `handoff.yaml` envelope.

## Artifact home

Deliverables this skill produces default to `digital-product/architecture/` at the working repository's
root, with cross-skill state in `digital-product/LEDGER.md` — created on first use and committed
with the repo. The `digital-product` composer skill owns this convention; solo use writes to the
same place. Never write into `.orchestrate/` — that folder belongs to an orchestration run's
execution state, not to this family's deliverables.
