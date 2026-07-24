# Recipes

Use the invocation form supported by your client. The examples below use Codex's explicit
`$architecture` form.

## Architect a SaaS system from a PRD

Use when: `product` has handed off a validated PRD (or `handoff.yaml`) and you need the system
shape before `frontend`/`backend` start building.

```text
Use $architecture to design the system for this PRD [paste PRD or handoff.yaml]: multi-tenant
SaaS. Give me the boundaries, data flow, and NFR budgets, then a handoff for the build skills.
```

Route: primary job `system-design` (requirements gate → C4/arc42-leveled design → trade-offs) +
surface overlay `surface-web-saas` (tenant isolation model, 3-tier + per-client BFF, OIDC tenant
resolution). Closes with `handoff` — a `handoff.yaml` naming `frontend`/`backend`/`data` as the
recommended next skills, without duplicating the full solution-architecture doc.

## Decide microservices vs monolith

Use when: a team is debating a service split and needs a defensible call, not a vibe.

```text
Use $architecture to decide whether this system should stay a modular monolith or split into
microservices: [context — team size, current coupling pain, deployment friction]. Name the
disintegrator if there is one.
```

Route: primary job `decomposition` only (no surface overlay needed unless the system is agentic,
mobile, data-intensive, or an internal platform). Produces bounded contexts, a quantified coupling
read (Khononov's strength × distance × volatility), and a monolith/modular/micro call — defaulting
to monolith-first unless a *named* disintegrator justifies the split.

## Architect a RAG/agent system

Use when: the product's core behavior comes from an LLM and you need the harness, topology, and
eval gate designed, not just the model chosen.

```text
Use $architecture to architect our RAG/agent system for [use case]: workflow-vs-agent call, RAG
topology, memory tiers, the eval gate, and agent security.
```

Route: primary job `system-design` (or `decomposition`/`data-architecture` if the request is about
service boundaries or the retrieval store) + surface overlay `surface-agentic` — the flagship
reference: thin-model/thick-harness design, the workflow-vs-agent and multi-agent-economics
decision (is the token multiplier worth it), RAG topology, agent-memory tiers, eval-in-the-loop as
the acceptance gate, and agent security. Non-determinism, latency, and cost are treated as design
constraints, not afterthoughts.

## Write an ADR and threat-model a decision

Use when: a decision (auth model, tenant isolation, a data-store pick) needs to be recorded and its
security posture checked before it ships.

```text
Use $architecture to write an ADR for [decision] and threat-model it — STRIDE register, auth/authz
implications, and what we're explicitly not building.
```

Route: primary job `adr-and-governance` (right-weight ADR template, supersede/link discipline,
named fitness functions) + `security-architecture` (STRIDE register as a table with a self-audit
count, auth/authz decision, zero-trust posture) — run together when a decision has a security
dimension worth recording in the same pass.
