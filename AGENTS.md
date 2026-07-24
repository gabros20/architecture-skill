# Agent guide — architecture-skill

This repository is the released `architecture` skill: the Shape stage of the Digital Product
Skills family. The runtime skill lives under `skills/architecture/`; repository and plugin names
use the `-skill` suffix. Version metadata lives in `.codex-plugin/plugin.json`, `CHANGELOG.md`, and
tags — never in `SKILL.md`.

## What this skill owns

The *shape* of a software system: service boundaries and coupling, API/event contracts, data
architecture and consistency, NFR budgets (perf/SLO/capacity/cost), threat modeling and the
auth/authz model, migration/deprecation strategy, and ADR governance — across web/SaaS, mobile,
agentic/LLM systems, data platforms, and internal tools. It sits between `product` (which decides
what to build and why) and the build skills (which write the production code). It owns the
decision, the contract, the budget, and the threat model — not the implementation. It recommends
siblings (`design`, `frontend`, `backend`, `data`, `ai`, `quality`, `operate`) for work it does not
own and never silently invokes them.

## Maintainer rules

1. Run `scripts/check-sync` before any release; it validates packaging, routes, references,
   metadata, and eval fixtures. Run `scripts/lint-skill` and `scripts/count-skill-tokens` too.
2. `SKILL.md` is the direct router: a faceted table of one primary job × at most one surface
   overlay. References are flat under `references/`, directly linked, self-describing, and loaded
   only when their observable condition applies. No required second-hop navigation.
3. Requirements-gate before solutioning is load-bearing, not a nit: never propose a design before
   functional requirements and NFRs are captured and contradictions surfaced.
4. Every method must be grounded in its named framework with a source in `SOURCES.md`. Fix a wrong
   formula, a misattribution, or a license-posture error as a correctness bug, not a nit.
5. Keep the boundary discipline: reference sibling territory by backtick name and recommend it;
   never absorb design/frontend/backend/data/ai/quality/operate work.
6. Keep the eval contract current: `evals/{activation,traversal,output,compression-ablation}` must
   reflect the router. Add near-miss activation cases when a new sibling overlap appears.
7. Treat README as the primary storefront. The `site/` and `remotion/` profiles follow the
   `site/README.md` design brief — designed for this skill's faceted-router model inside the shared
   family chrome and its own accent, never a filled-in skeleton.
8. Release through matching plugin version + changelog entry + `v<version>` tag + GitHub Release,
   and keep the GitHub About area configured (family-style description, canonical site alias as
   homepage, base + domain topics).

Do not mark a change complete merely because lint passes. Activation, traversal, and output
evaluations must show the skill still changes agent behavior usefully.
