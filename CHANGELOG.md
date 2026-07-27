# Changelog

All notable changes to **architecture** are documented here.

The release procedure synchronizes `.codex-plugin/plugin.json`, this changelog, git tag
`v<version>`, and the matching GitHub Release. Runtime `SKILL.md` contains no version metadata.

## [Unreleased]

### Added
- Queue unreleased changes here.

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

[0.1.2]: https://github.com/gabros20/architecture-skill/releases/tag/v0.1.2
[0.1.1]: https://github.com/gabros20/architecture-skill/releases/tag/v0.1.1
[0.1.0]: https://github.com/gabros20/architecture-skill/releases/tag/v0.1.0
