# Bounded Context Canvas

Fillable template. Source: ddd-crew/bounded-context-canvas (CC-BY-SA-4.0 —
github.com/ddd-crew/bounded-context-canvas). Used from [Decomposition](../references/decomposition.md)
§1–2 to record one bounded context's strategic classification and communication surface. Leave a
field `TBD — <question>` rather than inventing an answer; carry unresolved fields into §9/§11.

Fill order: top-to-bottom for a quick start. Alternative flows: **outside-in** (start at
Inbound Communication when the integration surface is best understood first) or **inside-out**
(start at Business Decisions when the domain rules are the clearest starting point).

---

## 1. Name

<the context's name — establishes team alignment on what's being designed>

## 2. Purpose

<a few sentences describing the why and what of the context, in business language — no
technical detail>

## 3. Strategic Classification

- **Domain role:** core / supporting / generic
- **Business model:** revenue generator / engagement creator / compliance enforcer
- **Evolution stage** (Wardley): genesis / custom-built / product / commodity

## 4. Domain Roles

<the context's behavior-pattern archetype — e.g. analysis context, execution context — prevents
responsibility coupling by naming what kind of work this context does>

## 5. Inbound Communication

<incoming collaborations from other systems, frontends, or users — commands / queries / events,
with source and pattern (see [Decomposition](../references/decomposition.md) §2's 9 context-map
patterns)>

| From | Message type (command/query/event) | Pattern |
|---|---|---|
| | | |

## 6. Outbound Communication

<outgoing collaborations, same taxonomy>

| To | Message type (command/query/event) | Pattern |
|---|---|---|
| | | |

## 7. Ubiquitous Language

<the key domain terms that exist within this context, and what they mean here specifically —
flag any term that means something different in another context (a polyseme; see
[Decomposition](../references/decomposition.md) §1)>

| Term | Meaning in this context |
|---|---|
| | |

## 8. Business Decisions

<the key business rules and policies enforced within this context>

## 9. Assumptions

<design assumptions made where domain knowledge is incomplete — mark each `TBD` until confirmed>

## 10. Verification Metrics

<metrics that would validate this boundary is right — CI/CD signal, ticket/backlog patterns,
live-system data (e.g. cross-context call volume, change-coupling rate)>

## 11. Open Questions

<unresolved design uncertainty — carry into the handoff's `unresolved` list, don't silently drop>
