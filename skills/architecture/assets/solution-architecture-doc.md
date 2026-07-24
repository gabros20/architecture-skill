# Solution Architecture Document

Fillable spine. Structure: google/skills `google-cloud-solution-architecture`'s 8-section
`output-template` (Apache-2.0 — github.com/google/skills), re-expressed as a cloud-agnostic
deliverable. Governing principle: tech-leads-club/agent-skills's Technical Design Doc rule (MIT —
github.com/tech-leads-club/agent-skills): **"documents decisions and contracts, NOT
implementation — if we changed frameworks, would this detail still apply? A TDD should survive
implementation changes."**

Before filling section 4 or 5, confirm requirements are locked per
[System design](../references/system-design.md) §1 — this document records decisions made after
that gate, it doesn't substitute for it.

**Include vs avoid** (apply throughout): API contracts, schemas, decisions, and diagrams belong
here. CLI commands, code snippets, framework-specific config, and file paths do not — those belong
in the implementing skill's (`frontend`/`backend`/`data`/`ai`) own artifacts, linked by reference.

Scale sections to project size: small (<1 week) needs 1, 2, 4, 7; medium (1–4 weeks) adds 3, 5, 6;
large (>1 month) fills all 8.

---

## 1. Executive summary and workload overview

<one paragraph: what this system does, for whom, and the single biggest architectural bet it
makes>

## 2. Requirements and current state

### 2.1 Functional requirements

<what the system must do — link to the product brief if one exists, don't restate it in full>

### 2.2 Non-functional requirements

<scale, latency, availability, cost, security/compliance targets — as numbers, not adjectives; see
[NFR budgets](../references/nfr-budgets.md) for the budget format>

### 2.3 Current state

<what exists today, if anything — state `none` explicitly rather than leaving this blank>

### 2.4 Dependencies

<upstream/downstream systems, teams, and contracts this design depends on>

## 3. Technical decomposition

<the bounded contexts / modules / services and their relationships — see
[Decomposition](../references/decomposition.md); link the context map, don't re-derive it here>

## 4. Solution architecture

### 4.1 Component mapping

| Component | Recommended choice | Justification (cite the source) | Alternatives considered | Pros / cons |
|---|---|---|---|---|
| | | | | |

### 4.2 Diagram

<a C4 container (or component, if it adds value) diagram per
[System design](../references/system-design.md) §3 — Mermaid or described ASCII, with a title and
key>

### 4.3 Data and control flow

<how a request or event moves through the components above — prose or a domain-message-flow
diagram, not a restatement of the component table>

## 5. Design recommendations

<one row per relevant quality attribute — reliability, security, performance, cost,
operability — each recommendation as a concrete pick + what NOT to build + the trade-off accepted;
link [NFR budgets](../references/nfr-budgets.md) and
[Security architecture](../references/security-architecture.md) rather than duplicating their
content>

## 6. Deployment guidance

<environments, rollout sequencing, and any migration path; link
[Migration](../references/migration.md) if this is a change to an existing system rather than a
greenfield build>

## 7. Validation plan

<what will be checked before and after this ships — load test targets, security review,
architecture-fitness-function gates; link [ADR and governance](../references/adr-and-governance.md)
for fitness-function CI gates>

## 8. References

<every framework, standard, or prior decision cited above, with source — do not leave a
recommendation in §4/§5 uncited>
