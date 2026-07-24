# Security architecture

Purpose: Produce a threat model, an auth/authz decision, and a privacy/data-governance stance for
the system being shaped — the security *design*, not its verification or its code.

Read when:
- A new system, service, or trust boundary is being designed and no threat model exists yet.
- The request touches authn/authz model choice, multi-tenancy isolation, or a new external
  integration / third-party data flow.
- A feature adds a data store, changes an auth flow, or crosses a new trust boundary — re-run
  triggers below.

Skip when:
- The ask is a vulnerability scan, dependency audit, or penetration test — route to `quality`;
  this reference produces the model the scan checks against, not the scan itself.
- The ask is implementing the control (rate limiter code, secret-manager wiring, WAF rule) —
  route to `backend`; this reference owns the decision and the requirement, not the implementation.
- The ask is runtime incident response or access-log monitoring — route to `operate`.

Inputs:
- The system's data-flow shape from [system-design.md](system-design.md) or
  [decomposition.md](decomposition.md) — state explicitly when absent; do not invent boundaries.
- Data classification (PII, credentials, payment data) and any compliance constraint (GDPR, PCI-DSS)
  — ask if unstated, do not assume "no sensitive data."

Produces:
- A data-flow diagram with labeled trust boundaries.
- A completed threat register (use [threat-model-register.md](../assets/threat-model-register.md)).
- An auth/authz model decision (as an ADR via [adr-and-governance.md](adr-and-governance.md)).
- A privacy/data-governance statement scoped to the design.

## Contents
- STRIDE threat-modeling method
- Threat catalog by category
- Auth/authz model
- Zero-trust and defense-in-depth
- Threat Modeling Manifesto — values
- Privacy and data governance as a design input
- Validation
- Failure modes and handoff

## Procedure

### 1. STRIDE threat-modeling method

Grounding bobmatnyc/claude-mpm-skills `threat-modeling` (MIT) —
https://github.com/bobmatnyc/claude-mpm-skills/blob/main/universal/security/threat-modeling/SKILL.md.
Six steps, in order — do not start mitigating before step 4 scores the threats:
1. **Scope** — system boundary, the assets that matter (PII, credentials, payment data), and any
   stated SLO/SLA.
2. **Data-flow diagram** — actors, entry points, data stores, external dependencies; mark trust
   boundaries explicitly (public internet → edge → internal → database → third-party).
3. **STRIDE per element** — every element in the diagram gets all 6 categories checked, forced via
   the table in step 3 below. STRIDE maps each letter to the security property it violates
   (OWASP Threat Modeling Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html):

| Letter | Category | Property violated | Example |
|---|---|---|---|
| S | Spoofing | Authentication | Stolen token used to impersonate a user |
| T | Tampering | Integrity | Unauthorized modification of data/database |
| R | Repudiation | Non-repudiation | Logs altered to hide attacker actions |
| I | Information Disclosure | Confidentiality | Unauthorized data extraction |
| D | Denial of Service | Availability | Account lockout via repeated failed logins |
| E | Elevation of Privilege | Authorization | Token manipulated to escalate role |

4. **Risk score** — Impact × Likelihood, each Low/Med/High. Prioritize High-impact threats and any
   Med/High-likelihood availability/DoS threat on a critical path.
5. **Mitigate** — convert each prioritized threat into an engineering task, a verification
   task (test/alert), or an operational control (runbook/access review).
6. **Tickets and tests** — every mitigation must land as a backlog ticket or a test case, not a
   paragraph in a doc that nobody re-reads.

**The exhaustive-checklist rule applies here**: STRIDE-per-element is an N-item coverage task.
Use the uniform table in [threat-model-register.md](../assets/threat-model-register.md), not a
narrative summary — narrative coverage of a checklist this size silently drops rows. Self-audit:
count DFD elements, count register rows per element, confirm every element has ≥1 STRIDE entry
before calling the model complete.

**Re-run triggers**: new data store or trust boundary, auth-flow changes, new third-party
integration, major scaling change. Don't treat a threat model as a one-time artifact.

### 2. Threat catalog by category

Grounding bobmatnyc `references/common-threats-and-mitigations.md` (MIT, same repo as above).
Use as the seed list when populating the register's Threat/Mitigation columns — don't start from
a blank page per element:

| Category | Representative threats | Representative mitigations |
|---|---|---|
| Authentication & sessions | Credential stuffing, token replay, session fixation | Rate limiting, short-lived rotating tokens, `HttpOnly`/`Secure`/`SameSite` cookies, MFA |
| Authorization / IDOR | Object-reference tampering, privilege escalation | Centralized authz policy layer, tenant isolation via row-level security, audit privileged-endpoint access |
| Injection | SQL/NoSQL/command injection | Parameterized queries, schema validation, no dynamic eval on untrusted input |
| XSS / CSRF / SSRF | Stored/reflected script injection, forged requests, internal-service probing | CSP + output encoding, CSRF tokens + `SameSite`, egress allowlists + metadata-service protection |
| Secrets / key management | Leaked credentials, stale keys | CI secret scanning, secret-manager rotation, least-privilege IAM |
| Supply chain | Compromised dependency or build step | Pinned deps + lockfiles, SBOM/SLSA provenance, restricted and signed CI |
| Availability / DoS | Resource exhaustion, retry storms | Rate limits/quotas, timeouts + backoff, circuit breakers, bulkheads |
| Logging / repudiation | Log tampering, missing audit trail | Append-only audit logs, centralized access-controlled storage, request-ID + actor-identity on every audit event |

Border: the circuit-breaker/bulkhead/rate-limiter *implementation* is `backend`; this reference
owns naming them as required mitigations, not their code.

### 3. Auth/authz model

Name the model as an explicit decision, not a default: **OAuth 2.0 + OIDC** for user-facing
authentication (delegated identity, standard token flows), **mTLS** for service-to-service
authentication inside the trust boundary, session/token strategy (short-lived + rotation per the
catalog above). For multi-tenant systems, the tenant-isolation decision is architecture-owned:
row-level security (RLS) at the database layer is the default for shared-schema multi-tenancy;
schema-per-tenant or database-per-tenant are the stronger-isolation, higher-cost alternatives —
state which one and why, and what would trigger moving to the next tier (e.g., a compliance
requirement for physical data separation). Record the choice as an ADR
([adr-and-governance.md](adr-and-governance.md)) — auth/authz model is exactly the kind of
hard-to-reverse decision that belongs in the decision record, not just this reference.

### 4. Zero-trust and defense-in-depth

**Zero-trust** — Google Cloud's Well-Architected Framework security pillar (grounding
docs.cloud.google.com/architecture/framework — skills-corpus google-cloud-waf-security):
"never trust, always verify" as a named principle alongside security-by-design, shift-left
security, and meeting regulatory/privacy needs. Treat every request as untrusted regardless of
network origin — no implicit trust from being "inside the perimeter."

**5-layer defense-in-depth** (grounding harperaa/secure-claude-skills, MIT —
https://github.com/harperaa/secure-claude-skills) — a reusable request-pipeline framing: an
attacker must defeat every layer, not just one, to succeed.

```
User request
 → Layer 0: Middleware (security headers — CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
 → Layer 1: Rate limiting
 → Layer 2: CSRF protection
 → Layer 3: Input validation (schema-based, reject before business logic runs)
 → Layer 4: Business logic (only validated/sanitized data reaches this layer)
 → Layer 5: Secure error handling (generic in prod, detailed in dev, no info leakage)
```

Two principles from the same source generalize past this specific pipeline: **fail-secure** (deny
by default on any error, never fail open) and **security is implemented, not assumed** — bake
controls into shared utilities/middleware so they can't be skipped by a developer who forgets,
rather than relying on discipline at each call site.

### 5. Threat Modeling Manifesto — values

Grounding https://www.threatmodelingmanifesto.org/ — apply these as working values, not just
process theater:
- A culture of finding and fixing design issues over checkbox compliance.
- People and collaboration over process/tooling alone.
- A journey of understanding over a one-time security snapshot.
- Doing threat modeling over talking about it.
- Continuous refinement over a single delivery — pairs directly with the re-run triggers in §1.

Anti-patterns to avoid: the "hero threat modeler" (one person owns it, nobody else engages),
admiration for the problem (endless discussion, no mitigation), overfocus on one threat category,
and chasing a "perfect" diagram instead of a useful one.

### 6. Privacy and data governance as a design input

Treat data classification (what's PII, what's regulated, what has a retention requirement) as a
design input captured at Scope (§1 step 1), not a compliance afterthought bolted on before ship.
State explicitly which data categories exist and which regulatory regime applies (GDPR, PCI-DSS,
etc.) — if unstated by the requester, ask; do not assume "no sensitive data" as a default.
Retention, deletion, and cross-border transfer constraints belong in the same design pass as the
threat model, since they shape the data-store and trust-boundary decisions in step 2.

## Validation

- Every DFD element has ≥1 STRIDE register row (self-audit count, not eyeballing).
- Every High-impact threat has an assigned owner and mitigation.
- Every mitigation maps to a ticket or test — no register row terminates in prose alone.
- The auth/authz model is a stated decision (ADR), not an implicit default.
- Data classification and applicable regulatory regime are stated explicitly, even if "none."

## Failure modes and handoff

- **Threat model treated as one-time** — re-run on any trigger in §1; a stale model on a changed
  system is worse than none, since it creates false confidence.
- **Narrative STRIDE summary instead of the register table** — recall silently collapses on
  larger systems; always use [threat-model-register.md](../assets/threat-model-register.md).
- **Request is really "scan our code" or "run a pentest"** — hand off to `quality`; this reference
  produces the model the scan validates against, not the scan itself.
- **Request is really "implement the rate limiter / secret rotation"** — hand off to `backend`
  with the mitigation named as a requirement.
- **Auth/authz decision made informally in a chat, never recorded** — capture it as an ADR via
  [adr-and-governance.md](adr-and-governance.md) before implementation starts.
