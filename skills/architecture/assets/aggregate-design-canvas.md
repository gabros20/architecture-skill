# Aggregate Design Canvas

Fillable template. Source: ddd-crew/aggregate-design-canvas (CC-BY-SA-4.0 —
github.com/ddd-crew/aggregate-design-canvas). Used from [Decomposition](../references/decomposition.md)
§6 to design one aggregate's boundary. Start from invariants, not relationships — see
Decomposition §6 before filling this in; if every field below only describes structural
attach/detach relationships, the aggregate is likely mis-scoped.

---

## 1. Name

<the aggregate's identifier; may include a lifecycle indicator (e.g. `Order (active)`)>

## 2. Description

<responsibilities, purpose, and design rationale — why this cluster of state is one consistency
boundary>

## 3. State Transitions

<explicit states and the transitions between them — hints at process boundaries the aggregate
must enforce>

## 4. Enforced Invariants

<the business rules this aggregate must always protect, immediately and consistently — the
answer to Decomposition §6's question 2 ("what must remain true immediately after each command?")>

## 5. Corrective Policies

<logic that corrects inconsistencies where a boundary was deliberately relaxed (eventual
consistency instead of a bigger aggregate) — name the compensating process, not just "eventually
fixed">

## 6. Handled Commands

<operations this aggregate processes>

| Command | Precondition | Invariant(s) checked |
|---|---|---|
| | | |

## 7. Created Events

<outcomes emitted from command handling — what downstream contexts learn happened>

| Event | Emitted on | Consumed by (if known) |
|---|---|---|
| | | |

## 8. Throughput

<concurrency-conflict likelihood: command rate × concurrent-client count for this aggregate
instance — high throughput on a single instance is a signal to reconsider the boundary or add
optimistic-locking retry, not to ignore>

## 9. Size

<event-accumulation profile: growth rate and instance lifetime — an aggregate that grows without
bound (e.g. "all orders ever placed by a customer") is a size-boundary error, not a modeling
detail>

---

**Central trade-off:** more enforced invariants inside the aggregate → less complexity elsewhere,
but a larger aggregate and more contention. More corrective policies (smaller aggregate) → less
contention, but added eventual-consistency handling at every consumer. Pick deliberately per
aggregate; don't default to either extreme.
