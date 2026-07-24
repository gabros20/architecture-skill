# Usage reference

## Activation

`architecture` should trigger on requests to decide **the shape of a software system** — its
boundaries, contracts, budgets, and durable decisions. Realistic triggers: "design/architect the
system," "should this be microservices or a monolith," "define the API/event contracts," "set our
SLO/perf budgets," "threat-model this," "plan a migration/deprecation," "write an ADR," "architect
our RAG/agent system."

It should **not** trigger on: "what should we build and why" (`product`), "design the onboarding
screens" (`design`), "implement the checkout in React" (`frontend`/`backend`), "render this as a
diagram" (not a diagram renderer — reference C4/arc42 notation instead), "run a load test" or "set
up CI/CD monitoring" (`quality`/`operate`).

Use `/architecture` as documentation shorthand only. Codex explicit invocation is `$architecture`;
other clients use an `@` mention, a skill tool, or natural-language activation.

## Mission and boundary

`architecture` owns the Shape stage — the *decision*, the *contract*, the *budget*, and the *threat
model*, not the implementation behind them. It sits between `product` (what to build and why) and
the build skills (`frontend`, `backend`, `data`, `ai`) that write the production code. It produces
solution-architecture docs, contracts, NFR budgets, threat models, and ADRs, then hands a
`handoff.yaml` companion downstream. It recommends its sibling skills for work it does not own and
never silently invokes them.

## Workflow

1. Capture functional requirements and NFRs first; surface any contradiction before opening a
   reference to solution.
2. Pick **one primary job** and **at most one surface overlay**; read only those references (2–3
   at most — never preload the pack).
3. Record material assumptions and unresolved inputs with owners; mark unknowns TBD.
4. Produce the requested artifact, grounded in the framework the reference names; cap each pass at
   3–5 decisions, each with a stated trade-off and what NOT to build.
5. Validate against the request and acceptance criteria; state confidence.
6. Emit a compact `handoff.yaml` when downstream build work is expected.

## Route by job

| User intent | Reference | Expected contribution |
|---|---|---|
| Design/architect the system, or review one for gaps — the default entry | `references/system-design.md` | Requirements gate, leveled C4/arc42 design, trade-offs, back-of-envelope numbers |
| "Should this be a microservice," define bounded contexts, fix coupling | `references/decomposition.md` | Bounded contexts, monolith/modular/micro call with a named disintegrator, coupling read |
| Design the API/events, version or deprecate an interface | `references/contracts.md` | REST/gRPC/GraphQL pick, OpenAPI/AsyncAPI skeleton, versioning + deprecation plan |
| Design data flow, choose a consistency model, decide CQRS/ES | `references/data-architecture.md` | Consistency decision per flow, CQRS/ES score, outbox/dual-write call, store selection |
| Set perf/latency/reliability targets, an SLO, a capacity/cost plan | `references/nfr-budgets.md` | Performance-budget table, SLO + error budget, scaling triggers, WA self-audit |
| Threat-model, decide the auth/authz model, tenant isolation | `references/security-architecture.md` | STRIDE register, auth/authz decision, zero-trust posture, data-classification statement |
| Migrate/replatform, extract a service, deprecate an API | `references/migration.md` | 7 Rs / Strangler-Fig pick, extraction order, cutover gate, deprecation timeline |
| Write an ADR, audit an ADR log, enforce a prior decision | `references/adr-and-governance.md` | ADR (right-weight template), lifecycle rule, drift detection, named fitness functions |

Surface overlays (`surface-web-saas`, `surface-mobile`, `surface-agentic`,
`surface-data-intensive`, `surface-internal-platform`) reshape the primary job for that system
type. Always add `surface-agentic` for an LLM/agent system — it changes topology, the eval gate,
and the security model.

## Outputs and completion

| Output | Complete when |
|---|---|
| Solution-architecture doc | Decisions, options considered, and trade-offs distinguished from facts/assumptions |
| API/event contracts | Endpoints/events specified with versioning + deprecation plan |
| NFR budget worksheet | Perf/SLO/capacity/cost targets stated as numbers with an error budget |
| ADR | Right-weight template filled; supersede/link, never duplicate, a prior decision |
| Threat-model register | Every STRIDE category audited as a table row, self-audit count shown |

When downstream work is expected, provide the `handoff.yaml` companion with artifact paths,
decisions, constraints, risks, unresolved questions, and the recommended next skill — never a
duplicate of the full artifact.
