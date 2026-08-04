# architecture — Product Architecture

**Family hub:** [digital-product-skill.vercel.app](https://digital-product-skill.vercel.app) — the 15-skill Digital Product family and its composer.

Decide **the shape of a software system** — boundaries, contracts, NFR budgets, threat model, and
ADRs — precisely enough that `frontend`, `backend`, `data`, and `ai` can build the right thing in
parallel without re-deriving it. `architecture` is the Shape stage of the
[Digital Product Skills](https://github.com/gabros20) family: an agent skill for system design,
decomposition, API/event contracts, data architecture, NFR budgets, security architecture,
migration, ADR governance, and agentic/LLM-system architecture.

It sits between `product` (which decides what to build and why) and the build skills (which write
the production code). It owns the **decision, the contract, the budget, and the threat model** —
not the implementation behind them. It is a **decision/shape router, not a diagram renderer, and
not TOGAF-weight enterprise governance.**

## What it does

A **faceted router**: pick one primary job × at most one surface overlay.

**Primary jobs** — system design · decomposition (boundaries & coupling) · API/event contracts ·
data architecture · NFR budgets · security architecture (threat modeling) · migration ·
ADR & governance.

**Surface overlays** — web/SaaS · mobile · **agentic/LLM system** · data-intensive · internal
platform (IDP). The overlay reshapes topology, tenancy, and the security model for that system
type.

**The differentiator:** first-class **agentic/LLM-system architecture** — thin-model/thick-harness
design, workflow-vs-agent selection, multi-agent economics (when the token multiplier is worth it),
RAG topology, agent-memory tiers, eval-in-the-loop as the acceptance gate, and agent security. Plus
NFR-as-budgets with real numbers (not vague "-ilities"), quantified decomposition (coupling, not
vibes), and a reversibility lens that keeps hard-to-reverse calls from being made casually.

Every method is grounded in its named framework: C4 and arc42, Domain-Driven Design and Khononov's
coupling model, Fowler's MonolithFirst/StranglerFig, the microservices.io pattern catalog,
AWS/Azure/GCP Well-Architected, Google SRE error budgets, OpenAPI/AsyncAPI, STRIDE and the Threat
Modeling Manifesto, MADR/Nygard ADRs, fitness-function governance, and Anthropic's agent-building
and multi-agent-economics research. Full attribution in [SOURCES.md](SOURCES.md).

## Install

```bash
npx skills add gabros20/architecture-skill -g -y
```

Or use it in Codex with `$architecture`.

## Examples

```text
$architecture design the system for this SaaS PRD — boundaries, data flow, NFR budgets

$architecture should this be a monolith or microservices, and where are the seams

$architecture architect our RAG/agent system — topology, memory, eval gate, agent security

$architecture write an ADR for our auth model and threat-model the tenant-isolation design
```

## Route by job

| User intent | Reads | Contribution |
|---|---|---|
| Design/architect/spec the system from scratch, or review one for gaps — the default entry | [system-design](skills/architecture/references/system-design.md) | Requirements gate, leveled C4/arc42 design, trade-offs, back-of-envelope numbers |
| "Should this be a microservice," define bounded contexts, fix coupling | [decomposition](skills/architecture/references/decomposition.md) | Bounded contexts, monolith/modular/micro call with a named disintegrator, quantified coupling read |
| Design the API/events, version or deprecate an interface | [contracts](skills/architecture/references/contracts.md) | REST/gRPC/GraphQL pick, OpenAPI/AsyncAPI skeleton, versioning + deprecation plan |
| Design data flow, choose a consistency model, decide CQRS/ES | [data-architecture](skills/architecture/references/data-architecture.md) | Consistency decision per flow, CQRS/ES score, outbox/dual-write call, store selection |
| Set perf/latency/reliability targets, an SLO, a capacity/cost plan | [nfr-budgets](skills/architecture/references/nfr-budgets.md) | Performance-budget table, SLO + error budget, scaling triggers, WA self-audit |
| Threat-model, decide the auth/authz model, tenant isolation | [security-architecture](skills/architecture/references/security-architecture.md) | STRIDE register, auth/authz decision, zero-trust posture, data-classification statement |
| Migrate/replatform, extract a service, deprecate an API | [migration](skills/architecture/references/migration.md) | 7 Rs / Strangler-Fig pick, extraction order, cutover gate, deprecation timeline |
| Write an ADR, audit an ADR log, enforce a prior decision | [adr-and-governance](skills/architecture/references/adr-and-governance.md) | ADR (right-weight template), lifecycle rule, drift detection, named fitness functions |

**Surface overlay (add at most one):**

| System type | Reads | Reshapes |
|---|---|---|
| Multi-tenant web app / SaaS (default) | [surface-web-saas](skills/architecture/references/surface-web-saas.md) | Tenant isolation (silo/pool/bridge), 3-tier + per-client BFF, OIDC tenant resolution |
| Native mobile client (iOS/Android) | [surface-mobile](skills/architecture/references/surface-mobile.md) | Client pattern (MVVM/TCA/Clean/RIBs), offline/sync + conflict rule, SSOT/UDF |
| **Agentic / LLM system** | [surface-agentic](skills/architecture/references/surface-agentic.md) | **Harness design, workflow-vs-agent, multi-agent economics, RAG topology, memory tiers, eval-as-gate, agent security** |
| Data / analytics / ML platform | [surface-data-intensive](skills/architecture/references/surface-data-intensive.md) | Operational/analytical boundary, batch-vs-stream, mesh-vs-centralized ownership |
| Internal tool / developer platform (IDP) | [surface-internal-platform](skills/architecture/references/surface-internal-platform.md) | Team Topologies bridge, platform-as-product threshold, "don't build a platform yet" gate |

Plus [handoff](skills/architecture/references/handoff.md) — the `handoff.yaml` contract into
`frontend`/`backend`/`data`/`ai`/`quality` when downstream build work is expected.

## Outputs

A solution-architecture doc (arc42-shaped), API/event contracts, an NFR budget worksheet, ADRs, a
STRIDE threat-model register, DDD bounded-context and aggregate-design canvases, an arc42 skeleton,
and a `handoff.yaml` companion that feeds the build skills downstream — grounded in the framework
each artifact names, never a generic template dump.

## Reference and asset library

14 references under `skills/architecture/references/` (8 primary jobs, 5 surface overlays,
1 handoff contract) and 8 fillable assets under `skills/architecture/assets/`:

- **Assets:** `adr-template.md` · `arc42-skeleton.md` · `bounded-context-canvas.md` ·
  `aggregate-design-canvas.md` · `solution-architecture-doc.md` · `nfr-budget-worksheet.md` ·
  `threat-model-register.md` · `handoff.yaml`

## Digital Product lifecycle

`architecture` is the **Shape** stage: it consumes `product`'s PRD/handoff upstream, and its own
`handoff.yaml` (contracts, NFR budgets, ADRs, threat model, recommended next skill) feeds
`frontend`, `backend`, `data`, and `ai` downstream for implementation, with `quality` and `operate`
consuming its budgets and threat model independently. It works standalone with no upstream artifact
required, and never silently invokes a sibling skill.

## Repository layout

```text
skills/architecture/    runtime skill (SKILL.md + 14 references + 8 assets + agents/openai.yaml)
evals/                  activation · traversal · output · compression-ablation fixtures
docs/                   installation and usage
.codex-plugin/          plugin manifest
```

## Documentation & releases

- [docs/installation.md](docs/installation.md) · [docs/usage.md](docs/usage.md) ·
  [docs/recipes.md](docs/recipes.md)
- [CHANGELOG.md](CHANGELOG.md) — release history (current: v0.1.0)
- [SOURCES.md](SOURCES.md) — framework attribution and license posture
- [CONTRIBUTING.md](CONTRIBUTING.md) — local validation (`scripts/lint-skill`, `scripts/check-sync`)

## License

MIT — see [LICENSE](LICENSE).
