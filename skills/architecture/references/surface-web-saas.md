# Surface: Web / SaaS

Purpose: Apply the multi-tenant-web-app overlay to the primary architecture jobs — the one decision
this surface adds that a generic system doesn't have is tenant isolation; everything else routes to
the primary references.

Read when:
- The system is a multi-tenant web app or SaaS product — the default surface when no other overlay
  (mobile client, data-intensive platform, internal tool, agentic system) applies.
- The request asks "should tenants share infrastructure," "how do we isolate tenant data," or "what's
  our BFF/gateway shape."

Skip when:
- The client is a native mobile app — use [surface-mobile.md](surface-mobile.md) for the client-side
  overlay; this reference still governs the backend's tenancy model.
- The system is primarily an analytics/ML platform — use
  [surface-data-intensive.md](surface-data-intensive.md).
- The ask is generic decomposition, contracts, or NFR work with no multi-tenancy angle — this overlay
  adds nothing; go straight to [decomposition.md](decomposition.md), [contracts.md](contracts.md), or
  [nfr-budgets.md](nfr-budgets.md).

Inputs:
- Tenant count and growth horizon, and any compliance/data-residency commitment per tenant — state
  explicitly when unknown; do not assume "pooled" or "enterprise" without it.
- Client surfaces the backend serves (web, mobile, partner API) — drives the BFF decision in §2.

Produces:
- A tenancy-isolation decision (silo / pool / bridge) with its named trigger.
- A reference topology (3-tier + BFF per client surface).
- An auth-model pick (OIDC/session) with tenant-resolution timing stated.
- A starting-decomposition call (modular monolith by default) with the disintegrator that would
  change it.

## Procedure

### 1. Tenant isolation — the decision this surface exists for
Ground: Azure Architecture Center, *Tenancy models for multitenant solutions* —
learn.microsoft.com/azure/architecture/guide/multitenant/considerations/tenancy-models. Three models:

| Model | Shape | Choose when |
|---|---|---|
| Silo | Dedicated infra/DB per tenant | Compliance or data-residency requires provable separation; enterprise tier justifies the cost |
| Pool | Shared infra, `tenant_id` discriminator + row-level security (RLS) | Cost-sensitive, high tenant count, no per-tenant compliance carve-out |
| Bridge | Shared control plane, siloed data plane for some tenants | Mixed customer base — self-serve tier pooled, enterprise tier siloed, same codebase |

Default to **pool** for a new SaaS unless a named compliance/residency requirement forces silo for a
subset — that subset is the bridge case, not a reason to silo everyone. Pooled isolation is enforced
at the data layer (RLS or an authz middleware filter on every query) — the mechanics of that
enforcement, and IDOR as the threat it defends against, are owned by
[security-architecture.md](security-architecture.md); don't re-derive the threat model here. Pooled
isolation's chief operational risk is **Noisy Neighbor** (Azure's 10-item anti-pattern taxonomy,
owned by [nfr-budgets.md](nfr-budgets.md)) — mitigate with per-tenant quotas/throttling, not by
silently over-provisioning.

When a tenant's growth or compliance need outgrows pooled RLS, the graduation path is Azure's
**Deployment Stamps** pattern — replicate the full stack per stamp, route tenants to a stamp by
region/tier — rather than a one-off bespoke deploy for that tenant. Treat this as a two-way door:
name the trigger explicitly ("tenant requires an EU-only data plane") before stamping.

### 2. Reference topology: 3-tier + Backend-for-Frontend
Ground: microservices.io (Chris Richardson), API Gateway / BFF pattern —
microservices.io/patterns/apigateway.html; Azure Architecture Center, Backends-for-Frontends pattern.
Give each distinct client surface (web app, mobile app, partner API) its **own BFF** rather than one
shared general-purpose gateway — a shared gateway couples unrelated clients to the same
release/versioning cadence and invites a lowest-common-denominator contract. The BFF aggregates and
tailors calls to backend services for its one client; it owns no business logic. The interface each
BFF exposes, and the events crossing it, are [contracts.md](contracts.md)'s job — this overlay only
names the shape (one BFF per client surface), not the schema.

### 3. Auth model default
Federated identity via OIDC (Azure Federated Identity pattern; standard IdP — Entra/Auth0/Cognito).
Server-rendered surfaces use session cookies; API/BFF-split surfaces use short-lived tokens. In a
multi-tenant system, **resolve the tenant before the OIDC redirect** (subdomain, path, or header) and
pick one resolution strategy — mixing subdomain-based and header-based tenant resolution across
surfaces is a recurring source of cross-tenant auth bugs.

### 4. Starting decomposition: modular monolith by default
A new SaaS earns microservices only when a named disintegrator appears (a bounded context needs
independent scaling, or compliance forces physical data isolation between contexts) — the
monolith-first rule and its triggers are owned by [decomposition.md](decomposition.md); this overlay
just states that multi-tenancy alone is not such a trigger. Pool-model tenant isolation is achievable
inside a modular monolith; don't let "multi-tenant" be mistaken for "must be microservices."

## Validation
- The tenancy model is named (silo/pool/bridge) with its trigger, not assumed.
- Each client surface has its own BFF, not a shared general gateway.
- Tenant-resolution timing (before OIDC redirect) is stated once and applied consistently.
- The decomposition default is modular monolith unless a named disintegrator is stated.

## Failure modes and handoff
- **"Multi-tenant" used to justify microservices with no other disintegrator** — return to §4; route
  to [decomposition.md](decomposition.md) for the actual test.
- **Pooled isolation with no RLS/authz-filter mechanism named** — incomplete; the isolation claim
  needs an enforcement mechanism, not just a `tenant_id` column.
- **The ask is the API/event schema itself** — hand off to [contracts.md](contracts.md).
- **The ask is numeric perf/capacity targets or the Noisy Neighbor mitigation detail** — hand off to
  [nfr-budgets.md](nfr-budgets.md).
- **The ask is the threat model for cross-tenant access** — hand off to
  [security-architecture.md](security-architecture.md).
