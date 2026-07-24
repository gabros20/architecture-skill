# Decomposition

Purpose: Decide where the boundaries go — bounded contexts, module/service splits, and the
internal paradigm inside each — using quantified rules (coupling math, team-size×complexity) instead
of taste, so a split is made only when a named force justifies it.

Read when:
- The request asks to "break this up," "should this be a microservice," "define our modules/
  bounded contexts," or reviews an existing decomposition for coupling problems.
- A monolith is being planned or a service is being proposed and no boundary rationale has been
  stated yet.

Skip when:
- The high-level design and requirements aren't gated yet — do that in
  [System design](system-design.md) first; boundaries drawn before requirements are locked get
  redrawn.
- The ask is the interface/contract at an already-agreed boundary — use [Contracts](contracts.md).
- The ask is data consistency/CQRS/event-sourcing mechanics inside an agreed boundary — use
  [Data architecture](data-architecture.md).
- The ask is agentic-system decomposition (agent vs tool vs sub-agent boundaries) — use
  [surface-agentic.md](surface-agentic.md); the coupling and paradigm-selection logic here still
  applies but the unit of decomposition differs.

Inputs:
- The domain description, team topology (sizes, ownership), and current pain (if any) — state
  explicitly when a team-size or domain-complexity input is missing; do not assume a default.
- Any existing bounded-context or service map — treat as the current state to evolve, not to
  discard.

Produces:
- A named set of bounded contexts with their relationships (context map).
- A monolith/modular-monolith/microservice decision with the disintegrator that justifies it.
- A coupling assessment for any boundary in question (strength × distance × volatility).
- An internal paradigm choice (layered / hexagonal / clean / functional-core) per context.

## Contents
- Bounded contexts and the language test
- Context mapping — 9 patterns
- Monolith-first and the microservice premium
- Balancing coupling — the quantified split/merge test
- Paradigm selection by team size and complexity
- Aggregate boundaries — design from invariants
- Modular-monolith wiring rule
- The Project Paradox — sequencing

## Procedure

### 1. Bounded contexts and the language test

Eric Evans' Domain-Driven Design (2003) and Fowler's bliki (martinfowler.com/bliki/
BoundedContext.html, martinfowler.com/bliki/DomainDrivenDesign.html — `[core]`): "total unification
of the domain model for a large system will not be feasible" — a **bounded context** is where a
**ubiquitous language** stays internally consistent. The boundary signal is a **polyseme**: the
same word meaning different things in different parts of the domain ("Customer" in Billing vs
"Customer" in Support) — that's a split signal, not a naming bug. citypaul/.dotfiles (MIT —
github.com/citypaul/.dotfiles) states it as a hard rule: **"deployment model is independent of
context boundary — a monolith can have well-defined contexts, microservices can have muddled
ones."** Draw contexts before deciding deployment topology, not after. Classify each context as
**Core** (the differentiating logic, highest investment), **Supporting**, or **Generic** (solved
problems — auth, billing, logging — buy or use a library) — this classification also drives the
volatility input in §4.

### 2. Context mapping — 9 patterns

ddd-crew/context-mapping (CC-BY-SA-4.0, attribute — github.com/ddd-crew/context-mapping):
3 team relationships — **Mutually Dependent**, **Upstream/Downstream**, **Free** — and 9 patterns
for how two contexts talk:

| Pattern | Use when |
|---|---|
| Open-Host Service | Upstream publishes a stable protocol for many downstreams |
| Conformist | Downstream accepts upstream's model wholesale (no leverage to negotiate) |
| Anticorruption Layer (ACL) | Downstream must isolate/translate a messy or foreign upstream model |
| Shared Kernel | A small, explicitly-shared model subset both teams jointly own |
| Partnership | Two teams coordinate as mutual equals toward a shared goal |
| Customer/Supplier | Upstream is formally accountable to downstream's needs |
| Published Language | A shared, documented interchange format (e.g. iCalendar) |
| Separate Ways | Deliberately don't integrate — cheaper than a bad integration |
| Big Ball of Mud | Fence off legacy mess; don't extend it, don't pretend it's clean |

Prefer several small, question-specific maps over one enterprise-wide map. Use [Bounded Context
Canvas](../assets/bounded-context-canvas.md) to fill each context's strategic classification,
communication patterns, and open questions.

### 3. Monolith-first and the microservice premium

Fowler (martinfowler.com/bliki/MonolithFirst.html, martinfowler.com/bliki/
MicroservicePremium.html — `[core]`): almost every successful microservice system started as a
monolith that grew and was later decomposed; almost every greenfield microservices system hits
serious trouble. Three reasons: (1) the **microservice premium** — automated deploy, distributed
monitoring, network failure handling, eventual consistency are real, non-optional overhead;
(2) YAGNI — a monolith lets you validate the domain faster, before you know where the real seams
are; (3) boundaries decided early are the most expensive to move once they've hardened into
network and data seams. Default posture: **modular monolith first**; extract a service only when
a genuine disintegrator (below) appears, not because microservices are the "modern" choice.

### 4. Balancing coupling — the quantified split/merge test

Vlad Khononov's *Balancing Coupling in Software Design*, via tech-leads-club/agent-skills
`modular-decomposition` (MIT — github.com/tech-leads-club/agent-skills): a 3-dimensional model
replaces "is this too coupled" with a measurable question.

- **Strength** (integration type, strongest→weakest): Intrusive (reading another service's
  DB/internals — any internal change breaks the downstream silently) → Functional (duplicated
  business logic kept manually in sync) → Model (upstream's domain model leaks into the public
  interface — graded by connascence) → **Contract** (dedicated DTOs, versionable, ACL/Published-
  Language — the target state).
- **Distance** — nearest-common-ancestor in the encapsulation hierarchy (same method → minimal …
  different systems/orgs → maximal); different-team ownership bumps distance one level (Conway's
  Law as a distance multiplier, not just a folklore observation).
- **Volatility** — how often the integration point changes; Core subdomains (from §1) are
  high-volatility, Generic subdomains are low.

Two formulas: **`BALANCE = (STRENGTH XOR DISTANCE) OR NOT VOLATILITY`** — tightly-coupled things
should sit close together; distant things should be loosely coupled; stable things tolerate
stronger coupling than volatile ones. **`MAINTENANCE_EFFORT = STRENGTH × DISTANCE × VOLATILITY`** —
a zero in any one dimension keeps effort low. Read the extremes directly: High-strength /
High-distance / High-volatility → 🔴 critical, refactor toward Contract strength before anything
else; High-strength / Low-distance / High-volatility → 🟢 fine — that's just a cohesive module, not
a coupling problem; Low-strength / High-distance (any volatility) → 🟢 fine — that's the loose
coupling you want at a distance. Use this to decide *whether* a proposed split (or merge) actually
reduces effort — don't split on instinct; compute the three dimensions for the boundary in
question first.

### 5. Paradigm selection by team size and complexity

athola/claude-night-market (MIT — github.com/athola/claude-night-market): a system-context table
for the *internal* paradigm inside a boundary —

| Team size | Simple domain | Moderate | Complex | Highly complex |
|---|---|---|---|---|
| <5 | Layered / functional-core | Layered | Hexagonal / modular-monolith | — |
| 5–15 | Modular monolith | Modular monolith | Hexagonal / modular-monolith | Functional-core / CQRS |
| 15–50 | Microservices | Microservices | Functional-core / CQRS | Microservices / EDA |
| 50+ | Microservices | Microservices | Microservices / EDA | Microservices / space-based |

Key distinction: **"DDD is not like the other paradigms — it answers 'what are the concepts and
what do we call them,' the rest answer 'where does the code go.' DDD composes with a structural
paradigm rather than competing with it."** Pick a structural paradigm from the table, then apply
DDD's bounded-context/ubiquitous-language work inside it regardless of which cell was chosen.

### 6. Aggregate boundaries — design from invariants

citypaul/.dotfiles `aggregate-design.md` (MIT): **"design from invariants, not relationships."**
Ask, in order: (1) what commands change state? (2) what must remain true *immediately* after each
command? (3) what data enforces that invariant? If the answer to (2) is only structural ("an order
has a customer"), that needs a foreign key, not an aggregate boundary — a common tell of a
relationship-driven aggregate is that its methods only add/remove/attach and nothing ever fails
validation. One aggregate per transaction; load only what you need to enforce the invariant, not
"everything related." Use [Aggregate Design Canvas](../assets/aggregate-design-canvas.md) to work a
single aggregate's boundary from its invariants. For Clean/Hexagonal/Onion as the surrounding
structural choice: all three
share Cockburn's asymmetry (alistair.cockburn.us/hexagonal-architecture) — inside vs outside, not
top vs bottom — and Uncle Bob's Dependency Rule (blog.cleancoder.com): source dependencies point
only inward, outer layers know nothing of inner. citypaul's naming rule for ports: name by
capability (`ForPlacingOrders`, `PaymentGateway`), never by implementation (`PlaceOrderUseCase`,
`StripeClient`) — **"if moving Stripe→PayPal forces a port rename, the port name leaked
infrastructure."**

### 7. Modular-monolith wiring rule

kgrzybek/modular-monolith-with-ddd (MIT — github.com/kgrzybek/modular-monolith-with-ddd): the
sharpest concrete rule for a modular monolith's internal boundary — modules depend **only** on
other modules' published `IntegrationEvents`, never on their Domain/Application/Infrastructure
layers, and communicate only asynchronously via an events bus; direct cross-module method calls
are not allowed. Give each module its own DB schema. Use Outbox/Inbox for at-least-once delivery
across the module boundary. This is the concrete mechanism that makes "modular monolith" more than
a folder-naming convention — it's what makes a later extraction to a real service a boundary move,
not a rewrite.

### 8. The Project Paradox — sequencing

evolutionary-architecture-by-example (MIT — github.com/evolutionary-architecture/
evolutionary-architecture-by-example): names the core tension — **the biggest architectural
decisions are needed when domain understanding is at its lowest.** The answer is sequencing, not
more upfront design: (1) start as one project, vertical slices by capability; (2) separate into
modules once each module's actual complexity (not guessed complexity) is known; (3) extract a
microservice only at a genuine **disintegrator** — team scaling, deploy-cadence conflict, tech
mismatch, load — adding a queue at the seam; (4) apply tactical DDD (value objects, aggregates,
domain events) *after* boundaries exist, not before. Applying step 4's rigor at step 1 is the most
common over-architecture failure this reference guards against.

## Validation

- Every context boundary traces to a language-consistency signal (§1), not a team-org chart alone.
- Any proposed split/merge has a computed Strength×Distance×Volatility read, not a gut call (§4).
- The monolith-vs-microservice decision names its disintegrator explicitly, or defaults to
  modular-monolith-first.
- Aggregate boundaries trace to an invariant (§6), not a foreign-key relationship.

## Failure modes and handoff

- **A split is proposed with no disintegrator named** — push back to §3; "microservices because
  it's more scalable" without a load number is not a justification.
- **Coupling is asserted without the three dimensions** — return to §4 before recommending a
  refactor; a "tightly coupled" claim with no strength/distance/volatility read is an opinion.
- **The request wants the actual API/event schema at a chosen boundary** — hand off to
  [Contracts](contracts.md).
- **The request wants consistency mechanics (CQRS/event-sourcing/sagas) inside a boundary** — hand
  off to [Data architecture](data-architecture.md).
- **The domain needs full aggregate/tactical-DDD depth** (value objects, domain events, specs) —
  this reference stops at the boundary-drawing decision; deeper tactical patterns live in
  citypaul's source material, cite it but don't duplicate a full DDD tactical course here.
