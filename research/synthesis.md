# `architecture` skill — synthesis & build gate

**Status:** synthesis complete; awaiting sign-off before Phase 3 (composition).
**Date:** 2026-07-24
**Inputs:** 4-channel research corpus (`skills-corpus.md` 315L, `web-canon-corpus.md` 173L, `github-corpus.md` 234L, `x-corpus.md` 267L) + `corpus.json` (2,477 repos) + 11 worker deep-read reports. Webdesign self-checked → **0 architecture content** (all "architecture" hits were information-architecture / trust-architecture / architect-as-vertical). No lift from webdesign.

---

## 1. The wedge — why this skill, and how it differs

**The niche is open.** Across every channel: the existing "architecture" agent-skills are **diagram generators** (archify, Cocoon-AI, drawio-skill), an **EA-governance suite** (arc-kit / TOGAF), or **tutorial+template collections** (study8677's `architecture-copilot`). The one direct functional analog — **anthropics/knowledge-work-plugins `@architecture` + `@system-design`** (Apache-2.0, 4.9K) — is *deliberately minimal*: a thin ADR template + a bare 5-step system-design checklist, no references. **No broad architecture-*decision* skill exists.**

So our position: a **decision/shape router** that sits at the Shape stage between `product` and the build skills — a clear **superset** of the anthropics spine, adding everything it omits:
- **Contract-first artifacts** (the API/event interfaces that let `frontend` + `backend` build in parallel)
- **NFR-as-budgets with real numbers** (perf budgets, SLO targets, capacity/cost) — not vague "-ilities"
- **Agentic-system architecture, first-class** — the flagship differentiator (see §4)
- **Quantified decomposition** (Khononov coupling model, monolith-first rule)
- **Migration/deprecation** strategy · **threat modeling** · **ADR-as-durable-record** · **fitness-function governance**

**Do NOT compete on diagram rendering** (crowded) or **enterprise-TOGAF governance** (different weight class). Reference C4/arc42/Mermaid as notation; don't build a renderer.

---

## 2. Framework canon to WRAP (not reinvent), with grounding

| Concern | Canon (cite these) |
|---|---|
| Diagramming / doc structure | **C4 model** (CC BY 4.0), **arc42** 12 sections, 4+1 views |
| Decision records | **ADR** (Nygard 5-field), **MADR**, Y-Statement, `adr-tools`, ruflo ADR-as-graph |
| Decomposition / boundaries | **DDD** (Evans; bounded contexts; 9 context-map patterns), ddd-crew canvases, **modular-monolith-first** (Fowler MonolithFirst / MicroservicePremium), Khononov **Balancing Coupling** (STRENGTH×DISTANCE×VOLATILITY), Team Topologies (inverse Conway) |
| Design paradigms | Clean / Hexagonal (ports & adapters) / Onion, "design from invariants" |
| Distributed patterns | **microservices.io** catalog (Saga/CQRS/ES/Outbox/BFF/Strangler), EIP (65 msg patterns), CAP/**PACELC**, DDIA concept map |
| Cloud NFR | **Well-Architected** AWS 6 / Azure 5 (+45 patterns, 10 anti-patterns) / GCP 6 pillars; 12-factor; CNCF cloud-native |
| Reliability | Google **SRE** (SLO / error-budget = 1−SLO as an architecture input), Circuit Breaker / Bulkhead (Nygard *Release It!*) |
| Contracts | **OpenAPI** + **AsyncAPI** (contract-first), REST/gRPC/GraphQL-federation tradeoffs, versioning/deprecation, zalando/microsoft API rulebooks |
| Security | **STRIDE** + Threat Modeling Manifesto, zero-trust, OWASP |
| Migration | **Strangler Fig** (Fowler), AWS **7 Rs**, extraction-order (low→high risk) |
| Governance | **Fitness functions** / Evolutionary Architecture (Ford/Parsons/Kua), ArchUnit-family CI gates |
| **Agentic (flagship)** | Anthropic **Building Effective Agents** (5 workflow patterns + ACI) · **Multi-Agent** economics (4×/15× tokens, 90.2%, "45% error" threshold) · **Context Engineering** (context rot, compaction, JIT) · **12-Factor Agents** (stateless reducer) · Google Cloud **12 agentic-pattern selection matrix** · **agent-harness** thesis (thin model / thick harness — 2026 primary material, unique to the X archive) · RAG topology + RAGAS eval · agent memory (episodic/semantic/procedural) · Palantir agent-security 5 dimensions |

---

## 3. Skill shape — faceted router (mirrors `frontend` / `product`)

**One primary job × ≤1 surface overlay.** SKILL.md is a thin router; depth lives in on-demand references ("load at most 2–3 per question"). Behavioral spine borrowed from the research:
- **Google's discipline** (hard rule): *do not propose a solution before functional + non-functional requirements are captured and contradictions surfaced.* Requirements-gate first.
- **oocx arc42 hard-rules**: don't fabricate requirements (ask one question at a time), mark unknowns TBD, **link ADRs don't duplicate**, **don't over-architect trivial features** (a well-modularized monolith / a single ADR is often the right answer).
- **Reversibility lens** (Bezos one-way/two-way doors): irreversible decisions deserve more analysis; name explicit options + "would choose X if {trigger}".
- **Every recommendation = concrete tech pick + what NOT to build + a stated tradeoff.** ≤3–5 decisions per pass (vasilyu1983).

### Primary jobs (8)
| Ref | Owns | Primary source-feeds |
|---|---|---|
| `system-design.md` | the entry spine: requirements→high-level→deep-dive→scale→tradeoffs method; C4/arc42; component decomposition | anthropics @system-design (5-step), karanpratapsingh 7-step, system-design-primer 4-step, C4/arc42, vasilyu1983 |
| `decomposition.md` | boundaries: DDD bounded contexts, monolith-vs-modular-vs-micro, **monolith-first**, coupling analysis, paradigm selection | ddd-crew canvases, citypaul DDD/hex, kgrzybek, Khononov coupling, athola paradigm router, Fowler, evolutionary-arch |
| `contracts.md` | the interfaces FE/BE build to in parallel: API + event contract-first, versioning/deprecation | OpenAPI/AsyncAPI, REST/gRPC/GraphQL tradeoffs, wshobson api-design (80-item checklist), patricio versioning, zalando/MS |
| `data-architecture.md` | data-flow, operational-vs-analytical split, consistency (CAP/PACELC), CQRS/ES, data mesh, schema decisions | DDIA concept map, microservices.io data patterns, vasilyu1983 data-arch (scored questionnaires), Data Mesh, wshobson postgresql |
| `nfr-budgets.md` | the -ilities **as budgets/targets**: perf budgets, SLO/error-budget, scalability strategy, capacity+cost, resilience patterns (circuit breaker/bulkhead/saga — as *strategy*, impl → backend) | Well-Architected triad, SRE error-budget, patricio numeric budgets, vasilyu1983 scalability, awesome-scalability stability patterns |
| `security-architecture.md` | threat modeling (STRIDE), auth/authz model, zero-trust, privacy/data-governance design | bobmatnyc STRIDE (register row + catalog), Threat Modeling Manifesto, harperaa 5-layer, wshobson security-req-extraction |
| `migration.md` | migration/compat/deprecation: strangler fig, 7 Rs, extraction order, comparison-read cutover | AWS 7Rs + migration-readiness, Fowler strangler, vasilyu1983 migration (case-study order), patricio deprecation headers |
| `adr-and-governance.md` | recording + enforcing decisions: ADR templates/lifecycle/review/drift, fitness functions, arch-verification CI | wshobson ADR (5 variants), MADR/Nygard, ruflo ADR-graph+drift, oocx arc42 governance, QDenka fitness-functions (ArchUnit family) |

### Surface overlays (5)
| Ref | Overlay | Source-feeds |
|---|---|---|
| `surface-web-saas.md` | multi-tenant web app / SaaS (default): 3-tier, BFF, tenant isolation | eShop refs, BFF, azure patterns |
| `surface-mobile.md` | native mobile client arch: MVVM / TCA / Clean / RIBs, offline-sync, SSOT/UDF | Android arch guide, uber/RIBs, TCA, new-silvermoon |
| **`surface-agentic.md`** ⭐ | **FLAGSHIP** — LLM/agent systems: thin-model/thick-harness, workflow-vs-agent patterns, RAG topology, multi-agent orchestration + economics, context engineering, agent memory tiers, eval-in-the-loop, non-determinism as a design constraint, agent security | Anthropic trio, 12-factor-agents, Google 12-pattern matrix, harness articles (D1-D12), omer-metin llm-architect sharp-edges, RAG survey+RAGAS, Palantir security, SwirlAI memory |
| `surface-data-intensive.md` | data/analytics/ML platforms: pipelines, operational↔analytical, data mesh, lakehouse | DDIA, Data Mesh, awesome-sre, ml-pipeline refs |
| `surface-internal-platform.md` | internal tools / platform engineering / IDP: Team Topologies, self-service, backstage | Team Topologies, backstage, platform-eng skills |

Plus **`handoff.md`** + **`handoff.yaml`** — the contract into `frontend`/`backend`/`data`/`ai` (contracts + NFR budgets + ADRs + threat model) and downstream to `quality`/`operate`; boundary sentence names `product` upstream and all build siblings downstream.

### Assets (reusable templates lifted from the corpus)
`adr-template.md` (MADR + Y-Statement + deprecation variants) · `arc42-skeleton.md` · `bounded-context-canvas.md` + `aggregate-design-canvas.md` (ddd-crew, CC BY-SA — attribute) · `solution-architecture-doc.md` (Google output-template × tech-leads-club TDD spine: "documents decisions & contracts, not implementation; survives a framework change") · `nfr-budget-worksheet.md` (patricio numbers) · `threat-model-register.md` (bobmatnyc row).

**Total: SKILL.md + 14 references + ~7 assets + handoff.yaml** — consistent with `product` (15 refs) and `frontend`.

---

## 4. `surface-agentic` is the flagship (heavier, like product's agentic overlay)

Same strategic bet as `product-skill`: generic system-design is well-covered, but **agentic-system architecture is the open, fast-moving frontier** and our research owns unique 2026 primary material (the X bookmark archive's agent-harness articles — thin-model/thick-harness, per-company harness breakdowns, filesystem-as-memory, Palantir agent-security — that no textbook has). This reference is allowed to exceed the 2,500-token soft ceiling (product's `surface-agentic` shipped at ~2,588). It must carry: workflow-vs-agent decision, the 5 workflow + 12 selection patterns, **when multi-agent is worth it** (the 4×/15×-token + 45%-error-threshold decision data), context-as-finite-budget, agent memory tiers, **eval-in-the-loop as acceptance criteria**, non-determinism/HITL as design constraints, and agent security.

---

## 5. Policy rulings (settle once, so nothing is re-litigated)

1. **License discipline.** CC-BY-NC-ND (ByteByteGo 101, karanpratapsingh) = **cite/link only, never re-express into shipped text**. CC-BY-SA (ddd-crew canvases, 12-factor-agents prose) = attribute + share-alike-aware. No-LICENSE (Sairyss, langchain-skills, AgenticRAG-Survey) = **paraphrase facts, never copy**. Vonng/ddia = copyrighted book translation → concept index only. Default posture: **re-express + cite the standard**, verbatim only from MIT/Apache/CC0/CC-BY with attribution in `SOURCES.md`.
2. **Single-home every fact.** Canonical framework definitions live in ONE reference; others point to it. C4/arc42 → `system-design.md`; DDD/coupling → `decomposition.md`; SLO/error-budget → `nfr-budgets.md`; ADR → `adr-and-governance.md`; agent patterns → `surface-agentic.md`.
3. **Border discipline.** Circuit-breaker/retry *impl* → backend; SLO *runtime* → operate; independent load-test → quality; production feature code → build skills; UX → design; PRD/discovery → product. Architecture owns the *decision, contract, budget, and threat model* — name the border in-line, don't collect deeply past it.
4. **The exhaustive-checklist lesson (AWS coverage-recall).** For any "cover N items" list (WA pillars, STRIDE per element, API checklist), the skill instructs a **uniform table + self-audit count**, never a narrative summary — narrative collapses recall ~1.0→0.3. This shapes both the skill's method and its eval contract.
5. **Requirements-gate before solutioning** (Google discipline) is a load-bearing behavioral rule in SKILL.md, not just a reference note.
6. **Don't over-architect.** Explicit anti-pattern: applying mature-stage architecture to an MVP. Monolith-first; a single ADR often beats a full arc42; add complexity only when a named disintegrator justifies it.

---

## 6. Structural patterns to adopt (skill-authoring meta)
- Short SKILL.md faceted router + on-demand `references/*.md`, "load 2–3 per question, never preload" (vasilyu1983, drawio-skill).
- **Patterns / Sharp-Edges / Validations** 3-part shape inside dense references (omer-metin) — esp. `surface-agentic.md`.
- Fillable-template assets + hard-rules governance (oocx arc42).
- Primacy headers (Purpose / Read-when / Skip-when / Inputs / Produces) per the family authoring standard; Contents block if >100 lines.
- Eval contract as acceptance criteria (product-on-purpose / AWS self-audit) — CI-enforced.

---

## 7. Open gaps (accept or crop before build)
Catalogued-not-deep-read: C4/Structurizr diagramming skills, dedicated iOS TCA/VIPER, official LangChain orchestration/HITL/eval siblings, data-mesh primary essays, 12-factor-app "successor" framings, AsyncAPI/GraphQL-federation primary specs. **Assessment:** the canon for each is already captured at wrap-depth from other channels; these are marginal. Recommend **build now, no follow-up crop** — flag any true gap during authoring.

---

## 8. Proposed composition crew (Phase 3) — for sign-off
- **6 Sonnet writers** on disjoint reference sets + **1 Opus integrator** (SKILL.md router, plugin.json, openai.yaml, SOURCES.md, cross-checks). Writer partition: W1 system-design+decomposition · W2 contracts+data-architecture · W3 nfr-budgets+migration · W4 security+adr-and-governance · W5 **surface-agentic (flagship, solo-heavy)** +handoff · W6 the 4 lighter surfaces+assets.
- Then Phase 4: **1 Opus review + 1 Sonnet eval** (I apply fixes myself). Release: **1 docs + 1 site/hero**.
- **~10 agents post-research**, mostly Sonnet. Rough cost **$25–45**. Gated: I pause before Phase 3 fan-out and again before release.
