# Handoff

Purpose: Package a completed architecture pass (solution-architecture doc, contracts, NFR budgets,
ADRs, threat model) so the build skills can implement inside the decided shape without re-deriving
it, plus a compact `handoff.yaml` companion for pipeline routing.

Read when:
- Finishing an architecture artifact set that `frontend`, `backend`, `data`, or `ai` is expected to
  build against.
- Deciding whether this run should emit a machine-readable companion at all.
- Writing or checking the `assets/handoff.yaml` template itself.

Skip when:
- The request is standalone with no downstream build in view — produce the human artifacts and
  stop; an unread `handoff.yaml` is clutter, not diligence.
- You need a specific artifact's own structure — that's [system-design.md](system-design.md) for the
  solution-architecture doc, [contracts.md](contracts.md), [nfr-budgets.md](nfr-budgets.md),
  [adr-and-governance.md](adr-and-governance.md), or [security-architecture.md](security-architecture.md)
  for the threat model. This reference covers what happens after those artifacts exist, not how to
  write them.

Inputs: the completed artifact set, the decisions/assumptions/risks recorded while producing them,
and — when architecture runs inside a pipeline — `product`'s own handoff naming the validated
problem, segment, and NFRs it surfaced.

Produces: a `handoff.yaml` companion beside the human artifacts, filled from
[assets/handoff.yaml](../assets/handoff.yaml) — never a duplicate of the artifacts' content.

## Contents
- Standalone vs pipeline
- What architecture hands downstream
- The handoff.yaml template
- Per-consumer needs
- The seam discipline
- Validation
- Failure modes

## Standalone vs pipeline

`architecture` runs in two modes, read from context, not a flag. **Standalone**: the request is
self-contained ("design the system for X") with no downstream build named — deliver the human
artifacts only. **Pipeline**: the request or an orchestrating controller names downstream build work
explicitly, or a multi-skill run is already in motion — emit the `handoff.yaml` companion. Default to
standalone; only emit the companion when a downstream consumer is actually expected to read it.

## What architecture hands downstream

Architecture sits at the Shape stage: it consumes `product`'s validated problem, segment, and NFRs
upstream (plus, for agentic surfaces, the capability/risk brief from `product`'s own
`surface-agentic.md`), and hands five artifact types downstream to the build skills and `quality`.
Name the consumer inline per artifact — don't make a downstream skill guess which artifact answers
its question.

| Artifact | Primary consumer(s) | What they take from it |
|---|---|---|
| Solution-architecture doc | `frontend`, `backend`, `data`, `ai` | the shape/boundaries to build inside — decisions and contracts, not implementation detail |
| API/event contracts | `frontend` + `backend` (parallel build) | the interface each side codes to independently, without waiting on the other |
| NFR budgets | every build skill; `operate` | perf/scale/reliability/cost targets to build to and later monitor against |
| ADRs | every build skill | the durable "why" behind a decision — cite it, don't re-litigate it |
| Threat model | `backend` (implements controls), `quality` (verifies independently) | what to defend against and what to test |

`quality` and `operate` are consumers, not co-authors: architecture states the budgets and threat
model; it does not run the load test or the SLO dashboard.

## The handoff.yaml template

`assets/handoff.yaml` is the fillable schema. Field meanings follow the same seam discipline as the
sibling `product` skill's handoff: only `objective` is required; every other field may be empty, and
a consumer must tolerate it absent rather than treat absence as a schema violation. `artifacts_created`
entries use `type` values matching the table above: `solution-architecture-doc`, `contracts`,
`nfr-budgets`, `adrs`, `threat-model`. `recommended_next` names the actual next skill(s) —
`frontend`, `backend`, `data`, `ai`, `quality` — never a vague "further work needed."

## Per-consumer needs

**`frontend` / `backend`** need the contracts and the NFR budgets that bound their build (latency,
scale, cost ceilings), plus any ADR that constrains a technology choice they'd otherwise make
themselves. **`data`** needs the data-flow and consistency decisions from
[data-architecture.md](data-architecture.md) plus the schema-relevant NFR budgets. **`ai`** needs the
agentic surface's harness decision, eval gate, and RAG topology from
[surface-agentic.md](surface-agentic.md) — architecture states the threshold and topology; `ai`
implements against it. **`quality`** needs the threat model and the NFR budgets as the acceptance
criteria it verifies independently, not as a checklist architecture has already ticked off.

## The seam discipline

The human artifacts — the solution-architecture doc, the contracts, the NFR-budget worksheet, the
ADR log, the threat-model register — are the real deliverable. `handoff.yaml` is a routing index into
them, never a copy. If a consumer needs more than the index gives, the human artifact is incomplete;
the yaml should not grow to compensate. Only `objective` is required; every downstream skill must
tolerate every other field absent.

## Validation

Before emitting: `objective` is one sentence and non-empty; every path in `artifacts_created`
resolves to a real artifact; `assumptions` and `risks` trace to entries recorded during the work, not
invented at handoff time; every `unresolved` item names an owner; `recommended_next` names an actual
sibling skill, not a vague call for more work.

## Failure modes

- **Duplicating the solution-architecture doc into handoff.yaml** — defeats its purpose as an index;
  keep it a pointer.
- **Emitting handoff.yaml in standalone mode** when nothing downstream will read it — skip it.
- **`status: complete` with a non-trivial `validation.remaining`** — use `partial` and say what's
  outstanding (e.g. "NFR budget stated but not load-tested").
- **The threat model's border line is missing** — backend doesn't know which controls are theirs to
  implement versus which `quality` verifies independently; name the border explicitly (see
  [security-architecture.md](security-architecture.md)).
- **Silently invoking a build skill** instead of naming it in `recommended_next` — the
  never-auto-invoke boundary rule from the main SKILL.md applies at the handoff seam too.
- **An `unresolved` item with no owner** — assign one or drop the item until it has one.

<!-- pattern mirrors the sibling product-skill's references/handoff.md (Tamás Gábor, MIT) — same
seam discipline, same handoff.yaml shape, adapted from product→design/architecture to
architecture→frontend/backend/data/ai/quality. -->
