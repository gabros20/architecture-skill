# Changelog

All notable changes to **architecture** are documented here.

The release procedure synchronizes `.codex-plugin/plugin.json`, this changelog, git tag
`v<version>`, and the matching GitHub Release. Runtime `SKILL.md` contains no version metadata.

## [Unreleased]

### Added
- **surface-agentic** gains §10 *Runtime ownership*: buying the agent harness as a data-contract
  check (residency/regions, retention and ZDR eligibility, session and file deletion, state export,
  beta status; dated managed-runtime examples to re-verify), product records and integration
  permissions kept outside provider sessions, EU database hosting ≠ EU processing for the whole flow;
  thin clients over one versioned API and event contract with the server owning truth; run engine,
  conversation/event store, sandbox, and object storage as independent lifecycles (implementation
  pointed to `backend`). Validation gains the build-vs-buy check and a component-coverage line
  (each agentic component states its decision or "N/A because …"). Router row, SOURCES, and an
  output + traversal eval case (`agentic-runtime-build-vs-buy`) follow.

## [0.2.0] — 2026-10-17

### Added
- Practitioner know-how folded into the existing references, each rule grounded in a cited source
  (SOURCES.md): **contracts** gains §5 *Contracts over an upstream you don't control*
  (contract / recipe / validation record / binding split, layer-by-layer versioning, semantic
  validation with negative cases, effect class independent of HTTP method, multi-route fallback,
  capability lifecycle) and checklist rows for completeness, string identifiers, dual human/agent
  representations, and outcome-unknown idempotency; **data-architecture** gains one system of record
  per entity per phase, rebuildable derived stores, single-writer / lease / optimistic-concurrency
  options with the second-writer trigger, durable-execution vs Process-Manager-plus-sweep with a
  durability acceptance test, and orthogonal state fields; **migration** gains the capability
  inventory, mechanism-not-policy consolidation, variance-axis slices, and one authority for shared
  allowances during coexistence; **nfr-budgets** gains equal-work benchmarking, whole-cost pricing,
  and third-party quota as a per-identity budget; **security-architecture** gains capability URLs,
  resolved-IP SSRF validation, secret references, stage × jurisdiction residency, export
  boundaries, and native-TTL retention; **system-design** gains pinned-revision current state,
  verified dependency access, cache-key completeness, and package/daemon restraint;
  **adr-and-governance** gains a pack-rules review bullet (evidence pinning, exit, guard), in-repo
  ADR logs, and two fitness-function shapes; **surface-agentic** gains the deterministic-core rule
  and §9 action safety (execution-layer enforcement of the gate `product`'s brief sets per effect
  class, implemented by `ai`; payload-bound approvals; no routing around refusals). Router
  contribution cells updated; 3 traversal, 3 output, and 2 near-miss activation eval cases added.

## [0.1.2] — 2026-07-27

### Fixed
- SKILL.md Mission and boundary: named `automation` alongside the other sibling routes — cross-system
  business processes spanning systems you do not own now route there, closing the one sibling this
  skill omitted.

## [0.1.1] — 2026-07-24

### Changed
- SKILL.md router: clarified that the `agentic` surface overlay is additive — it stacks on top of a
  base surface overlay (web-saas / mobile / data-intensive / internal-platform) rather than replacing
  it, resolving the "at most one overlay" vs "always add the agentic overlay" ambiguity for systems
  that are both a base surface and an LLM/agent system. (Surfaced by the installed smoke test.)

## [0.1.0] — 2026-07-24

### Added
- Initial release of the `architecture` skill — the Shape stage of the Digital Product Skills family.
  A faceted router over 8 primary jobs (system-design, decomposition, contracts, data-architecture,
  nfr-budgets, security-architecture, migration, adr-and-governance) and 5 system-type surface
  overlays (web-saas, mobile, agentic, data-intensive, internal-platform), with the agentic/LLM-system
  overlay — thin-model/thick-harness, multi-agent economics, RAG topology, eval-as-acceptance-criteria
  — as the differentiator. 15 references, 8 fillable assets (ADR/arc42/threat-register/DDD canvases/
  NFR worksheet/solution-architecture doc), a `handoff.yaml` contract into `frontend`/`backend`/`data`/
  `ai`/`quality`, and activation/traversal/output/compression evals. Requirements-gated, decision-first,
  monolith-first by default.

[0.2.0]: https://github.com/gabros20/architecture-skill/releases/tag/v0.2.0
[0.1.2]: https://github.com/gabros20/architecture-skill/releases/tag/v0.1.2
[0.1.1]: https://github.com/gabros20/architecture-skill/releases/tag/v0.1.1
[0.1.0]: https://github.com/gabros20/architecture-skill/releases/tag/v0.1.0
