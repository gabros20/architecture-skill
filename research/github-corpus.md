# GitHub Channel Corpus — `architecture` skill research

**Channel:** GitHub (via `ghrelay` github-relay CLI + WebSearch hydrate lane)
**Scope:** Repos, awesome-lists, ADR/C4 tooling, framework references, example architecture docs, and existing architecture agent-skills across the full charter keyword space.
**Date:** 2026-07-24

## Method (coverage-honest)

1. **Wide net (serial, one batch):** 66-shard query file across the keyword space → ONE `ghrelay batch` (rate-limit-safe, serialized 1.5 s pacing) → **2,470 deduped repos** into `corpus.json`.
2. **Curated hydrate lane:** WebSearched "best/awesome" threads per lane, then `ghrelay hydrate`-d ~55 human-curated owner/repo ids (not a rate-limited search) into the same corpus — catches flagship/niche repos keyword search misses (ddd-crew canvases, ADR tooling, structurizr, arc42, API guidelines, agentic refs, existing skills).
3. **Enrich + local filter:** enriched top-star + all curated finalists, then filtered the corpus locally by architecture keyword into ~90 relevant finalists across 11 lanes (free/offline/precise — raw popularity `rank` was noisy with unrelated framework/coding-agent repos, several star-inflated).
4. **Deep read:** **4 sonnet workers** on disjoint finalist clusters extracted SUBSTANCE (canvases, templates, taxonomies, principle lists) via README + key-doc reads (`ghrelay read`/`digest`/WebFetch — reads only, never rate-limited search). Their reports are folded in below (reports at `scratchpad/arch-research/reports/github-{1,2,4}.md`; github-3 = ADR/C4/API/governance still landing — that section carries metadata + web-confirmed substance and will deepen).

**Reached well:** system-design master-lists (deep pattern catalogs), DDD/Clean/CQRS (the ddd-crew canvas set fully extracted), agentic/LLM architecture (12-factor + harness-engineering taxonomy), existing architecture agent-skills (dedup — including a near-complete competitor).
**Thinner lanes (honest):** dedicated *security-architecture / threat-modeling design* material is mostly tools/checklists on GitHub (OWASP CheatSheetSeries, stride-gpt, threat-dragon) — the *design* substance for STRIDE/zero-trust should come from web/X channels. *Cost/capacity modeling & performance budgets* are near-absent as standalone repos (web-channel lane). *AsyncAPI / GraphQL-federation* under-collected. *iOS-specific* (TCA/VIPER) under-collected vs Android.

**Star-validity caveat:** several agentic/skills repos surfaced with implausible star counts (`affaan-m/ECC` 232k, `NousResearch/hermes-agent` 219k, `obra/superpowers` 260k, `addyosmani/agent-skills` 80k) — treat those counts skeptically (likely star-bursts); not weighted as quality here.

**License flags to carry forward (verbatim-vs-reexpress):**
- **CC0 / public-domain (freely reusable structure/checklists):** mehdihadeli/awesome-software-architecture, simskij/awesome-software-architecture, QDenka/awesome-software-design, madd86/awesome-system-design, mfornos/awesome-microservices, dastergon/awesome-sre, ai-boost/awesome-harness-engineering.
- **CC-BY-SA-4.0 (attribution + share-alike):** all ddd-crew canvases, humanlayer/12-factor-agents (prose).
- **CC-BY-4.0 (attribution):** donnemartin/system-design-primer, mhadidg/software-architecture-books, microsoft/api-guidelines, zalando/restful-api-guidelines.
- **CC-BY-NC-ND (cite/link ONLY — no derivatives, no commercial):** ByteByteGoHq/system-design-101, karanpratapsingh/system-design.
- **No LICENSE file (all-rights-reserved by default — paraphrase, don't copy):** Sairyss/system-design-patterns, theanalyst/awesome-distributed-systems, CodelyTV/typescript-ddd-example, asinghcsu/AgenticRAG-Survey, dastergon/awesome-sre(README-only).
- **GPL-3.0 (copyleft — re-express):** ashishps1/awesome-system-design-resources.
- **License-ambiguous / copyrighted source:** Vonng/ddia (translation of a fully-copyrighted O'Reilly book — use as concept index only, never as a citable/reusable source). NirDiamant/GenAI_Agents (custom non-commercial).

**Relevance tags:** `[core]` architecture-owned · `[border]` boundary with another skill (named) · `[agentic]` agentic-system arch · `[out]` out of scope.

---

## 1. System-design master-lists, pattern catalogs & references

The canon of *where architecture knowledge is catalogued* — most valuable as **taxonomy/structure sources** and pattern catalogs.

**[donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer)** — 359k★ · CC-BY-4.0 · `[core]`
The reference primer. Load-bearing substance: **4-step interview method** (use cases/constraints/assumptions → high-level → core components → scale), CAP CP-vs-AP decision rule, **availability-in-nines table** + series/parallel availability formulas, DB scaling (replication master-slave/master-master, federation, sharding, denormalization, SQL tuning; NoSQL KV/document/wide-column/graph + BASE; SQL-vs-NoSQL decision list), **cache update strategies** (cache-aside / write-through / write-behind / refresh-ahead, each with named disadvantages — the canonical version others paraphrase), async (message vs task queues, back-pressure), RPC-vs-REST comparison table, and the **Powers-of-two + "Latency Numbers Every Programmer Should Know" tables** (back-of-envelope reference).

**[karanpratapsingh/system-design](https://github.com/karanpratapsingh/system-design)** — 45k★ · CC-BY-**NC-ND** (cite/link only) · `[core]`
Largest structured course-book. Novel vs the rest: **PACELC theorem** (extends CAP — even absent a partition, trade Latency vs Consistency). Reusable **7-step design methodology**: Requirements (functional/non-functional/extended) → Estimation & constraints → Data-model design → API design → High-level component design → Detailed design → Identify & resolve bottlenecks. Covers SLA/SLO/SLI, circuit-breaker states, rate-limiting algorithms, service mesh, OAuth2/OIDC/SSO/SAML, mTLS.

**[Sairyss/system-design-patterns](https://github.com/Sairyss/system-design-patterns)** — 1.2k★ · no-license (paraphrase) · `[core]` — **highest pattern-density in the cluster.** Deep prose catalog: integration (sync RPC/gRPC vs async AMQP/Kafka, serialization tradeoffs, API-gateway routing/aggregation), scalability (indexing, replication, partitioning, **identifier tradeoffs UUIDv4 vs v7/Snowflake/ULID**, connection pooling, coupling types — location/temporal/data, **Selective Data Replication / event-carried state transfer**, shared-nothing), consistency (**Saga vs 2PC vs Process Manager triage**, **Dual-writes problem → Outbox pattern / Debezium**, Idempotent Consumer, CDC, Lamport/vector clocks, CRDTs, Raft/Paxos). Named decision rules: *share IDs across services, never full objects*; *Orchestration (central, traceable) vs Choreography (decentralized, flexible)*.

**[mehdihadeli/awesome-software-architecture](https://github.com/mehdihadeli/awesome-software-architecture)** — 11k★ · CC0 · `[core]` — **best reusable category tree.** Top-level topics include: Clean/Onion/Hexagonal/Vertical-Slice/Event-Driven/SOA architectures, **DDD (19 sub-topics)**, CQRS, **Microservices (17 sub-topics)**, Modular Monolith, **Architectural Design Principles (19 named:** CAP, Cohesion, Coupling, CQS, DIP, DRY, Fail-Fast, GRASP, ISP, IoC, KISS, OCP, Persistence-Ignorance, SRP, **Strangler-Fig**, SOLID, YAGNI…**)**, Design Patterns (GoF + REPR + Specification), **Cloud Design Patterns (**Ambassador, ACL, BFF, Bulkhead, Circuit Breaker, Gateway Aggregation, Inbox, Outbox, Saga, Sidecar, Strangler Fig**)**, Anti-Patterns (Big Ball of Mud, God Object, Leaky Abstractions), Messaging/AsyncAPI, Modeling (C4, event storming/modelling, domain storytelling).

**[ashishps1/awesome-system-design-resources](https://github.com/ashishps1/awesome-system-design-resources)** — 40k★ · GPL-3.0 (re-express) · `[core]`
Cleanest **"tradeoff-pair" (X vs Y) framing** in the cluster — directly reusable as a tradeoff-table skeleton: vertical vs horizontal, concurrency vs parallelism, long-polling vs WebSockets, batch vs stream, stateful vs stateless, strong vs eventual consistency, read-through vs write-through, push vs pull, REST vs RPC, sync vs async. Plus a must-read distributed-systems papers list (Paxos, Dynamo, Spanner, Bigtable, LSM-Tree).

**[binhnguyennus/awesome-scalability](https://github.com/binhnguyennus/awesome-scalability)** — 73k★ · MIT · `[core]`
Principle/Scalability/**Stability** taxonomy. Named **stability patterns:** Circuit Breaker, Bulkhead, Steady State, Throttling, Multi-Clustering, Determinism. Principle section names: 12-Factor, Clean Architecture, high-cohesion/low-coupling, monoliths-vs-microservices, ACID vs BASE, consistent hashing pitfalls, "avoid over-engineering / scalability worst-practices." The hundreds of company-blog case links → `[out→case-study reference doc]` (too granular to embed).

**[theanalyst/awesome-distributed-systems](https://github.com/theanalyst/awesome-distributed-systems)** — 12k★ · no-license · `[core]` — **the theory canon.** Bootcamp (CAP, Fallacies of Distributed Computing, **FLP Impossibility**), the paper mini-canon (Dynamo, Bigtable, GFS, "The Log", Kafka, **Paxos** + "Made Simple/Live", Chubby, **Raft**, PBFT, Byzantine Generals, CRDTs, Dapper), courses (MIT 6.824, Kleppmann's Cambridge lectures), Jepsen/Verdi verification.

**[mhadidg/software-architecture-books](https://github.com/mhadidg/software-architecture-books)** — 11k★ · CC-BY-4.0 · `[core]` — the **book canon**, 12 categories. Cite-worthy titles: Clean Architecture, PoEAA (Fowler), Fundamentals of Software Architecture + **Software Architecture: The Hard Parts** (Ford/Richards), Building Evolutionary Architectures, DDD Blue/Red books, Building Microservices (Newman), Monolith to Microservices, Microservice Patterns (Richardson), **DDIA** (top-rated), Enterprise Integration Patterns, Release It! (Nygard), SRE (Google), A Philosophy of Software Design.

**[QDenka/awesome-software-design](https://github.com/QDenka/awesome-software-design)** — 831★ · CC0 · `[core]` — scoped to code/component level; **uniquely strong on Architecture Verification / Fitness Functions**: ArchUnit (Java) / ArchUnitNET (C#) / ArchUnitTS (TS), phparkitect, pest-plugin-arch, Konsist (Kotlin), arch-go, tach (Python), Shopify/packwerk (Ruby), dependency-cruiser. Also a curated ADR-tooling list (joelparkerhenderson, MADR, log4brains, adr-manager, real-world ADR/RFC processes: **Kubernetes KEPs**, Rust/Next.js RFCs, GOV.UK RFCs) and named **coupling model** (Khononov's 3D: strength/distance/volatility, *Balancing Coupling in Software Design*).

**[ByteByteGoHq/system-design-101](https://github.com/ByteByteGoHq/system-design-101)** — 86k★ · **CC-BY-NC-ND (cite/link only!)** · `[core]` — visual explainer index; taxonomy inspiration only, no verbatim reuse. Standout titles: "10 System Design Tradeoffs You Cannot Ignore", "9 Essential Components of a Production Microservice", "The Ultimate Software Architect Knowledge Map".

**[simskij/awesome-software-architecture](https://github.com/simskij/awesome-software-architecture)** — CC0 · `[core]` — opinionated cousin; strong on Documentation/Modeling: **arc42**, ADRs (adr.github.io), **C4 Model**, **Structurizr**, PlantUML; workshop formats (Event Storming, Impact Mapping, Business Model Canvas). `[border→docs-writer]` for the docs-as-practice angle.

**[madd86/awesome-system-design](https://github.com/madd86/awesome-system-design)** — 12k★ · CC0 · `[out→tech-stack appendix]` — mostly a technology/tool directory (DBs, brokers, LBs); low unique architecture judgment.

**[DovAmir/awesome-design-patterns](https://github.com/DovAmir/awesome-design-patterns)** — 48k★ · `[border→build]` — GoF + cloud + microservices + serverless pattern catalog.

**[Vonng/ddia](https://github.com/Vonng/ddia)** — 23k★ · **license-ambiguous, copyrighted book — concept index only** · `[core]` — the DDIA concept map (see §8 for the full chapter/concept skeleton).

> **DEDUP ALERT:** `study8677/awesome-architecture` initially surfaced here as a "curated list" but is in fact a near-complete competing **architecture agent-skill** (ships an `architecture-copilot` Claude Code/Cursor/Codex companion). Moved to §11 — read it in full before building.

---

## 2. DDD · Clean/Hexagonal · modular-monolith · CQRS/Event-Sourcing

Heart of the skill's decomposition + boundary machinery. **The ddd-crew canvases are the highest-value reusable artifacts — structured decision templates, all CC-BY-SA-4.0.**

**[ddd-crew/ddd-starter-modelling-process](https://github.com/ddd-crew/ddd-starter-modelling-process)** — 5.9k★ · CC-BY-SA-4.0 · `[core]` — **the top-level workflow skeleton.** 8 stages, each naming its techniques: **1 Understand** (Business Model Canvas, Impact/Wardley Mapping) → **2 Discover** (EventStorming, Domain Storytelling, Example Mapping) → **3 Decompose** (Context Maps + Business Capability Modelling) → **4 Strategize** (Core Domain Charts, Purpose Alignment) → **5 Connect** (Domain Message Flow Modelling, BPMN) → **6 Organize** (Context Maps, Team Topologies) → **7 Define** (Bounded Context Canvas, C4 System Context) → **8 Code** (Aggregate Design Canvas, Design-Level EventStorming, Hexagonal Architecture).

**[ddd-crew/bounded-context-canvas](https://github.com/ddd-crew/bounded-context-canvas)** — 2.0k★ · CC-BY-SA-4.0 · `[core]` — **11-field canvas (verbatim):** 1 Name · 2 Purpose · 3 Strategic Classification (Domain role: core/supporting/generic · Business model: revenue/engagement/compliance · Evolution stage Wardley: genesis/custom/product/commodity) · 4 Domain Roles · 5 Inbound Communication · 6 Outbound Communication · 7 Ubiquitous Language · 8 Business Decisions · 9 Assumptions · 10 Verification Metrics · 11 Open Questions. Fill flows: standard / outside-in (start Inbound) / inside-out (start Business Decisions).

**[ddd-crew/context-mapping](https://github.com/ddd-crew/context-mapping)** — 1.8k★ · CC-BY-SA-4.0 · `[core]` — **canonical decision table for "how should two contexts talk."** 9 patterns: Open-Host Service · Conformist · **Anticorruption Layer (ACL)** · Shared Kernel · Partnership · Customer/Supplier · Published Language · Separate Ways · Big Ball of Mud. 3 team relationships: Mutually Dependent · Upstream/Downstream · Free.

**[ddd-crew/aggregate-design-canvas](https://github.com/ddd-crew/aggregate-design-canvas)** — 817★ · CC-BY-SA-4.0 · `[core]` — 9 fields: Name · Description · State Transitions · **Enforced Invariants** · **Corrective Policies** · Handled Commands · Created Events · Throughput · Size. Central tradeoff: invariant-enforcement (bigger aggregate, less complexity elsewhere) vs corrective policies (smaller aggregate, added eventual-consistency handling) + concurrency-conflict & size assessment charts.

**[ddd-crew/domain-message-flow-modelling](https://github.com/ddd-crew/domain-message-flow-modelling)** — 406★ · CC-BY-SA-4.0 · `[core]` — lightweight notation for a use-case's message flow across contexts (Actors · Bounded Contexts · Commands/Events/Queries), each message showing name + data + sequence order; keep 5–9 messages/diagram (Miller's Law).

**[Sairyss/domain-driven-hexagon](https://github.com/Sairyss/domain-driven-hexagon)** — 15k★ · MIT · `[core]` — **richest tactical-DDD + hexagonal guide.** Directly liftable rules: **Entities** (no anemic models, identity equality, no public setters, validate in constructor/Fail-Fast, readonly id/createdAt); **Aggregates** (root is sole gateway, all-or-nothing transactions, reference other aggregates by ID only, keep small); **Value Objects** (structural equality, immutable, enforce own invariants, serialize to primitives before crossing boundaries); **Guarding vs Validating** (validation = filter external input at boundary; guarding = failsafe inside the always-valid core — guard failures are bugs, throw; validation failures are expected, return errors); **Application Services** (one per use case, orchestrate only, never call other app services); **CQRS** (commands express intent, never chain Command→Command — use Command→Event→Command; queries may bypass domain/repo); **Domain vs Integration Events** (domain = in-process, saved in same txn; integration = out-of-process, published after txn via broker + **Transactional Outbox/CDC/Saga**); **DTOs** (Response DTOs whitelist never blacklist fields; DTOs ≠ Commands/Queries); **Domain Errors** ("recoverable → return error object; unrecoverable → throw"); **folder structure** (vertical slice by feature beats horizontal layering — explicit anti-pattern pair); **module encapsulation** (no direct cross-module imports, communicate via facade/command-event bus); **ban frameworks/ORM/randomness from the domain core**; **make illegal states unrepresentable** (union/typestate types); **enforce architecture with Dependency-Cruiser / ArchUnit in CI**.

**[kgrzybek/modular-monolith-with-ddd](https://github.com/kgrzybek/modular-monolith-with-ddd)** — 14k★ · MIT · `[core]` — **sharpest modular-monolith boundary rule found:** modules depend ONLY on other modules' `IntegrationEvents` (published event-contract assembly), never on their Domain/Application/Infrastructure; **modules communicate only asynchronously via an Events Bus — direct method calls not allowed**; separate DB schema per module; Outbox/Inbox for at-least-once delivery. Sync path only via a narrow per-module `ExecuteCommandAsync/ExecuteQueryAsync` interface ("API contains no application logic, just routes"). Named **decorator pipeline order:** Logging → Validation → Unit-of-Work. Domain-model checklist (6): high encapsulation, persistence ignorance, rich behavior, low primitive obsession, ubiquitous language, testable. **4-tier testing** (unit via public API only / integration with real DB / system-integration via Sampling-Probe polling for eventual consistency / architecture tests via NetArchTest) + mutation testing. Keeps a real ADR log under `docs/architecture-decision-log`.

**[evolutionary-architecture/evolutionary-architecture-by-example](https://github.com/evolutionary-architecture/evolutionary-architecture-by-example)** — 3.5k★ · MIT · `[core]` — **the "when to reach for what" sequencing story.** 4 chapters: 1 Initial (single project, vertical slices by capability) → 2 Modules Separation (purpose-built per module's actual complexity) → 3 Microservice Extraction (only on genuine "disintegrators": team scaling, deploy cadence, tech mismatch, load; add queues at the seam) → 4 Tactical DDD (VOs/aggregates/domain-events *after* boundaries, not before). Framing device: **"The Project Paradox"** — biggest architectural decisions needed when domain understanding is lowest → argument for incremental/evolutionary architecture over big-upfront-design.

**[ThreeDotsLabs/wild-workouts-go-ddd-example](https://github.com/ThreeDotsLabs/wild-workouts-go-ddd-example)** — 6.4k★ · MIT · `[core]` — Go DDD+Clean+CQRS+gRPC with a *refactoring-toward-it* article series. Named anti-pattern callouts: **over-engineering with too many technologies** (deliberately undone), **DRY needs nuance across bounded contexts**, and **"DDD Lite"** (named middle ground between CRUD monolith and full DDD/CQRS/ES).

**[Sairyss/domain-driven-hexagon]** pairs with two contrasting, independently-verified folder conventions worth presenting as named choices: **Sairyss = feature/use-case vertical slice** vs **[CodelyTV/typescript-ddd-example](https://github.com/CodelyTV/typescript-ddd-example)** (1.5k★, no-license) = **Context → Module → Layer nesting** (verified via directory tree: `Contexts/Backoffice/Courses/{application,domain,infrastructure}`).

**[ardalis/CleanArchitecture](https://github.com/ardalis/CleanArchitecture)** (18k★ MIT) & **[jasontaylordev/CleanArchitecture](https://github.com/jasontaylordev/CleanArchitecture)** (20k★ MIT) — `[core]` — the two flagship .NET Clean Architecture templates. Dependency rule: outer→Core, Core depends on nothing outer. Named patterns: **REPR** (Request-Endpoint-Response endpoints), **Specification Pattern**, Repository, MediatR CQRS. Two implementations of the cross-cutting-concerns pattern: kgrzybek's manual decorator chain vs jasontaylordev's **MediatR Pipeline Behaviors** — cite both as one unified "cross-cutting pipeline" rule.

**[heynickc/awesome-ddd](https://github.com/heynickc/awesome-ddd)** (12k★) · **[ddd-crew/free-ddd-learning-resources](https://github.com/ddd-crew/free-ddd-learning-resources)** (832★) — `[border→references]` — DDD/CQRS/ES tooling + learning indexes; named CQRS/ES libs (EventFlow, Axon, Commanded, Rails Event Store) and reference apps (eShopOnWeb, IDDD Samples, DDDSample).

**[bitloops/ddd-hexagonal-cqrs-es-eda](https://github.com/bitloops/ddd-hexagonal-cqrs-es-eda)** (1.4k★ MIT) · **[dotnet-architecture/eShopOnContainers](https://github.com/dotnet-architecture/eShopOnContainers)** (24k★, + free ".NET Microservices" e-book) · **[dotnet-architecture/eShopOnWeb](https://github.com/dotnet-architecture/eShopOnWeb)** (11k★ MIT) · **[AxonIQ/AxonFramework](https://github.com/AxonIQ/AxonFramework)** (3.6k★ Apache-2.0, `[border→backend]`) — worked references for the full acronym stack.

---

## 3. ADR — Architecture Decision Records (tooling + templates)  ·  C4 / diagrams-as-code / arc42  ·  API/contract-first  ·  governance/fitness-functions

*(Worker-3 deep-read still landing; entries below carry metadata + web-confirmed + cross-worker substance. Will deepen on arrival.)*

### ADR
- **[joelparkerhenderson/architecture-decision-record](https://github.com/joelparkerhenderson/architecture-decision-record)** · `[core]` — the most-cited ADR **template catalog**: Nygard, MADR, Tyree-Akerman, business-case, Alexandrian, minimal — plus when/how-to guidance. (Confirmed via QDenka's list as the canonical entry.)
- **[architecture-decision-record/architecture-decision-record](https://github.com/architecture-decision-record/architecture-decision-record)** — 17k★ · `[core]` — large ADR example/template set.
- **[npryce/adr-tools](https://github.com/npryce/adr-tools)** — 5.6k★ · `[core]` — the original ADR **CLI** (Nygard format): `adr new/link/supersede`, numbered markdown log in `doc/adr`. De-facto workflow.
- **[adr/madr](https://github.com/adr/madr)** — 2.3k★ · `[core]` — **MADR** modern template: Context & Problem Statement · Decision Drivers · Considered Options · Decision Outcome (+ consequences good/bad) · Pros/Cons of options. (arc-kit uses a MADR-v4 8-section variant — see §11.)
- **[thomvaill/log4brains](https://github.com/thomvaill/log4brains)** — 1.5k★ · Apache-2.0 · `[core]` — MADR-based ADR management + static-site knowledge base.
- Real-world ADR/RFC processes worth citing (from QDenka §1): Kubernetes KEPs, Rust RFCs, Next.js RFCs, GOV.UK RFCs, Spotify "when should I write an ADR."

### C4 / diagrams-as-code / arc42
- **[arc42/arc42-template](https://github.com/arc42/arc42-template)** — 1.3k★ · CC · `[core]` — the **12-section** architecture-doc template: 1 Intro & Goals · 2 Constraints · 3 Context & Scope · 4 Solution Strategy · 5 Building Block View · 6 Runtime View · 7 Deployment View · 8 Cross-cutting Concepts · 9 Architecture Decisions · 10 Quality Requirements · 11 Risks & Technical Debt · 12 Glossary.
- **[structurizr/java](https://github.com/structurizr/java)** (1.1k★ Apache-2.0) · **[structurizr/cli](https://github.com/structurizr/cli)** (566★) · **[structurizr/lite](https://github.com/structurizr/lite)** (383★) — `[core]` — reference **C4 model** "diagrams-as-code from one model"; C4 abstraction levels: **System Context / Container / Component / Code** (+ Deployment). DSL exports to PlantUML/Mermaid.
- **[mermaid-js/mermaid](https://github.com/mermaid-js/mermaid)** — 89k★ · MIT · `[border→build/design]` — default lightweight notation (renders in GitHub/artifacts; has C4 support).
- **[plantuml/plantuml](https://github.com/plantuml/plantuml)** — 13k★ · LGPL-3.0 · `[border]` — text→diagram; C4-PlantUML extension.

### API design / contract-first (the interfaces frontend+backend build to in parallel)
- **[OAI/OpenAPI-Specification](https://github.com/OAI/OpenAPI-Specification)** — 31k★ · Apache-2.0 · `[core]` — the contract-first REST description standard.
- **[zalando/restful-api-guidelines](https://github.com/zalando/restful-api-guidelines)** — CC-BY-4.0 · `[core]` — exhaustive **numbered** REST rulebook (one of the best contract-design rule-sets to cite).
- **[microsoft/api-guidelines](https://github.com/microsoft/api-guidelines)** — CC-BY-4.0 · `[core]` — MS REST guidelines (naming, versioning, pagination, errors, long-running ops).
- **[interagent/http-api-design](https://github.com/interagent/http-api-design)** — 14k★ · `[core]` — Heroku's pragmatic HTTP API rules (TLS, versioning via Accept, request IDs, ranges/pagination, errors).
- **[mfornos/awesome-microservices](https://github.com/mfornos/awesome-microservices)** — 14k★ · CC0 · `[core]` — microservice-architecture principles/patterns/tech catalog.
- `[border→build]`: OpenAPITools/openapi-generator (27k★), swagger-api/swagger-ui (29k★), Redocly/redoc (26k★), scalar/scalar (16k★), grpc/grpc-go (23k★).
- *Also referenced (QDenka):* Google API Design Guide. **Gap:** AsyncAPI (event contracts) + GraphQL federation under-collected.

### Evolutionary / governance / fitness functions
- **[archguard/archguard](https://github.com/archguard/archguard)** — 670★ · MIT · `[core]` — architecture workbench + governance (analyze/enforce rules).
- **[JonasTebben/archunit-examples](https://github.com/JonasTebben/archunit-examples)** — 41★ · MIT · `[core]` — **ArchUnit fitness-function examples** for ports-and-adapters (layering/dependency rules as tests).
- **[archifacts/archifacts](https://github.com/archifacts/archifacts)** — 53★ · Apache-2.0 · `[core]` — extract architectural concepts from code (living documentation/conformance).
- **Fitness-function ecosystem** (from QDenka §1): ArchUnit(NET/TS), Konsist, arch-go, tach, packwerk, dependency-cruiser — architecture-as-testable-CI-constraint.

---

## 4. Agentic / LLM / RAG architecture  `[agentic]` — first-class, dig-hard lane

**[humanlayer/12-factor-agents](https://github.com/humanlayer/12-factor-agents)** — 25k★ · Apache-2.0 (code) / CC-BY-SA-4.0 (prose) · `[agentic]` — **the canonical structured framework.** The 12 factors (verbatim): 1 **Natural Language → Tool Calls** · 2 **Own Your Prompts** · 3 **Own Your Context Window** · 4 **Tools Are Just Structured Outputs** · 5 **Unify Execution State & Business State** · 6 **Launch/Pause/Resume with Simple APIs** · 7 **Contact Humans with Tool Calls** · 8 **Own Your Control Flow** · 9 **Compact Errors into Context Window** · 10 **Small, Focused Agents** · 11 **Trigger from Anywhere / Meet Users Where They Are** · 12 **Make Your Agent a Stateless Reducer** (`state, event → new_state`). (+ proposed Factor 13: pre-fetch context.) Critiques CrewAI/LangChain/LangGraph for hiding control-flow/context; contrasts DAG orchestrators (Airflow/Prefect/Dagster/Inngest) with agent control flow.

**[ai-boost/awesome-harness-engineering](https://github.com/ai-boost/awesome-harness-engineering)** — 3.2k★ · CC0 · `[agentic]` — **the best agentic-architecture NFR/topology vocabulary map.** Design primitives: **Agent Loop** (Thought/Action/Observation; turn/goal/time/proactive variants; checkpoint+resume) · **Planning & Task Decomposition** (plan artifacts, planner/coder/reviewer roles, modular dependency graphs + localized replanning) · **Context Delivery & Compaction** (server-side compaction, prompt caching, hierarchical retrieval vs upfront doc-dump, AST/symbol compression) · **Tool Design** (schema/error conventions, client- vs server-side execution, structured-output guarantees) · **Skills & MCP** (MCP servers, skill bundles w/ versioning+routing, A2A protocol, `.well-known` discovery) · **Permissions & Authorization** (five-layer hooks→deny→mode→allow→canUseTool; two-phase fast-gate→CoT; least-privilege) · **Memory & State** (three-tier core/archival/recall; progressive consolidation episodes→facts→relationships→patterns; poly-store vector+relational+graph) · **Task Runners & Orchestration** (unified provider routing w/ retry/fallback, graph state-machines, supervisor/subagent, typed handoff schemas, "brain/hands/session" stateless decoupling, CodeAct) · **Verification & CI** (agent-eval-as-harness-testing, evals as deploy gates) · **Observability** (OTEL, hook-pipeline instrumentation) · **Human-in-the-Loop** (tool-call-boundary approval interrupts, "Approval Agent", on-behalf-of vs fixed-credential auth). Summary pattern taxonomies: Loop architectures · Multi-agent topologies (subagents/skills/handoffs/router/supervisor/decentralized) · Memory tiers (hot/warm/cold) · Tool-integration modes (direct/code-wrapper/MCP/skill-bundle) · Orchestration modes (sync/parallel/conditional/rollback). Names OWASP LLM06:2025 "excessive agency", SPIFFE workload identity, credential brokers.

**[asinghcsu/AgenticRAG-Survey](https://github.com/asinghcsu/AgenticRAG-Survey)** — 1.7k★ · no-license · `[agentic]` — **Agentic-RAG taxonomy.** 4 core agentic patterns (Reflection · Planning · Tool Use · Multi-Agent Collaboration); 5 workflow patterns (Prompt Chaining · Routing · Parallelization · Orchestrator-Workers · Evaluator-Optimizer); 7 RAG system types (Single-Agent · Multi-Agent · Hierarchical · Corrective · Adaptive · Graph-Based · Agentic Document Workflows).

**[NirDiamant/GenAI_Agents](https://github.com/NirDiamant/GenAI_Agents)** — 23k★ · custom non-commercial · `[agentic]` — 50+ worked agent tutorials graduated beginner→advanced (routing, reflection, planning, multi-agent, memory-enhanced, self-improving, RAG variants) — pattern spread as a reference, not reusable text.

**[Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps)** — 127k★ · Apache-2.0 · `[agentic/border→ai]` — 100+ agent/RAG app implementations (build-level examples; architecture value = pattern breadth).

*Note:* high-star agent *frameworks* (dify, langchain, gemini-cli, browser-use) are `[border→ai/build]`, not architecture-decision material. The `[agentic]` architecture substance concentrates in 12-factor-agents + harness-engineering + the RAG survey. **study8677 (§11) also has deep AI-native/agentic architecture chapters** (token-cost estimation, non-determinism, context engineering, eval-as-CI-gate).

---

## 5. Mobile architecture  (`[border→build]` where code, `[core]` where the decision)

**[android/architecture-samples](https://github.com/android/architecture-samples)** — 46k★ · Apache-2.0 · `[core/border]` — Google's official recommended Android architecture. **Dedup note:** the modern repo is now a *single* reference architecture (UI layer Compose + one ViewModel per screen; domain layer optional; data layer Repository over local Room + remote), NOT the old multi-branch MVVM/MVP/MVI comparison. Good model for **scoping-out**: its explicit "What is it not?" section routes to sibling repos (templates, compose-samples, nowinandroid).

**[uber/RIBs](https://github.com/uber/RIBs)** — 7.9k★ · Apache-2.0 · `[core]` — Uber's **R**outer-**I**nteractor-**B**uilder framework for very large apps. Key differentiator: **business logic drives the app, not the view tree** — a RIB need not have a view; the app hierarchy follows business-logic scopes, allowing a deep logic tree with a shallow view hierarchy. Hierarchical statically-typed DI (parent Builders satisfy child dependency interfaces). Proven to "hundreds of engineers / hundreds of nested RIBs."

`[border→build]`: igorwojda/android-showcase (6.8k★, modular clean-arch), skydoves/Pokedex (8.3k★, MVVM), mhadaily/flutter-architecture-ddd (408★). **Gap:** iOS-specific (pointfreeco/swift-composable-architecture, VIPER, Clean-Swift) under-collected.

---

## 6. SRE / resilience / data-intensive

**[Vonng/ddia](https://github.com/Vonng/ddia)** — 23k★ · **license-ambiguous / copyrighted book — concept index only** · `[core]` — *Designing Data-Intensive Applications* concept map. **Part I Foundations:** Ch1 Reliability/Scalability/Maintainability · Ch2 Data models (relational/document/graph) · Ch3 Storage & retrieval (LSM/B-tree, OLTP vs OLAP, column stores) · Ch4 Encoding & evolution. **Part II Distributed Data:** Ch5 Replication (single/multi-leader/leaderless, lag) · Ch6 Partitioning (+rebalancing, routing) · Ch7 Transactions (isolation, serializability) · Ch8 Trouble with distributed systems (partial failure, unreliable networks/clocks) · Ch9 **Consistency & Consensus** (linearizability, ordering, 2PC, consensus — the book argues CAP is a poor simplification, replaced by precise linearizability/availability framing). **Part III Derived Data:** Ch10 Batch · Ch11 Stream · Ch12 Future/data integration. → the concept skeleton for the data-architecture section's decision rules.

**[dastergon/awesome-sre](https://github.com/dastergon/awesome-sre)** — 13k★ · no-license · `[border→operate]` — SRE catalog (20 sections: Reliability, Monitoring/Observability/Alerting, On-Call, Post-Mortem, **Capacity Planning**, **SLA/SLI/SLO**, Performance, chaos…). Error-budget/SLO framing is `[core]` as *targets*; running it is operate. Good checklist skeleton for the NFR section.

**[binhnguyennus/awesome-scalability]** (§1) also carries the stability-patterns canon (circuit breaker, bulkhead, throttling).

---

## 7. Micro-frontends / modular front-end / platform engineering

- **[backstage/backstage](https://github.com/backstage/backstage)** — 34k★ · Apache-2.0 · `[border→operate/platform]` — the reference **Internal Developer Platform** (software catalog, TechDocs, scaffolder, plugins). Platform-engineering anchor.
- **[neuland/micro-frontends](https://github.com/neuland/micro-frontends)** — 4.7k★ · MIT · `[core]` — canonical micro-frontends explainer/patterns (composition types, integration strategies).
- `[border→frontend]`: module-federation/core (2.6k★), module-federation/module-federation-examples (6.1k★), umijs/qiankun (17k★), originjs/vite-plugin-federation (3.0k★).

---

## 8. EXISTING architecture agent-skills — DEDUP / structure study

**None found is a broad architecture-*decision* skill — the closest (study8677) is a curated-knowledge + step-guide companion; the rest are diagram-generators or an EA-governance suite. The decision-focused niche we're building is open.**

**★ [study8677/awesome-architecture](https://github.com/study8677/awesome-architecture)** — 1.9k★ · MIT · `[core] + PRIMARY DEDUP TARGET` — a near-complete competing architecture skill (bilingual CN/EN), ships an **`architecture-copilot` Claude Code/Cursor/Codex companion** turning the knowledge into an interactive step-by-step design guide. Structure: **`tutorial/` 40 chapters** in 4 bands (01-09 Foundations: architect's thinking framework requirements→constraints→quality-attributes→tradeoffs, C4, 10 core patterns, ADRs; 10-17 Advanced: distributed hard-truths, consistency engineering Saga/Outbox/idempotency, designing-for-failure circuit-breaker/bulkhead/load-shedding/SLO, scale mechanics, strangler-fig/zero-downtime migration, Conway/Team-Topologies/platform-eng, threat-modeling/zero-trust/tenant-isolation, **LLM-era architecture judgment: vibe-coding/non-determinism/context-engineering**; 18-22 Practice: 8-step design walkthrough w/ token-cost estimation; 23-26 AI-collaborative: spec-as-constraint/ADR-as-guardrail, eval-driven "good enough" CI gate; 27-34 tech-stack selection as architecture judgment; 35-40 AI-native org) · **`templates/` 31 architecture maps** (16 classic, 5 AI-native RAG/agent/inference/vector-db, 4 real 2026 agent products incl. **Claude Code & OpenAI Codex architectures**, 5 industrial/embedded) each scoped to problem/components/dataflow/tradeoffs/scale-breakpoints + an evolution path · **`cases/` 6 end-to-end design-to-scale narratives**. Three stated principles: *ask "why" before "how"* · *no best architecture, only most-fit* · *architecture grows — don't apply mature-stage arch to an MVP*. **Read in full before building; strongest source both to imitate and to differentiate from.**

**[tt-a1i/archify](https://github.com/tt-a1i/archify)** — 7.2k★ · MIT · `[border→diagram-generation]` — **diagram-generation skill** (not decision-making). Fork/extension of Cocoon-AI below. Structure: `archify/` folder w/ `SKILL.md` + `schemas/` (JSON-schema-validated IR) + `renderers/` (per-diagram-type) + `delta/` (before/after architecture-diff for pre-merge review) + `recipes/`/`examples/`. Output = self-contained HTML+inline-SVG, grounded/anti-hallucination ("never invent topology"). 336 files — a product-grade single-purpose skill. Do not out-render; cite/differentiate.

**[tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)** — 2.1k★ · modified-MIT (one proprietary plugin) · `[border→enterprise-architecture-governance]` — TOGAF/UK-Gov **Enterprise Architecture governance suite** (2137 files, 1623 md). Structure: **plugin marketplace** — 16 plugins (core `arckit-claude` "75 commands" + regional/sector/TOGAF-ADM/agent-architecture overlays), **command-per-artifact-type** (`/arckit:adr` backed by `docs/guides/adr.md`). Its `adr.md` = MADR-v4 **8-section** template (Context & Problem · Decision Drivers · Considered Options · Pros & Cons · Decision Outcome · Consequences · **Governance & Approvals** · **Traceability**) + a review checklist tying decisions to stakeholder drivers/risk-register/compliance. Different weight class/audience (enterprise architects) — low subject overlap; useful large-scale org pattern.

**[Cocoon-AI/architecture-diagram-generator](https://github.com/Cocoon-AI/architecture-diagram-generator)** — 6.7k★ · MIT · `[border→diagram-generation]` — minimal (13-file) ancestor of archify. `SKILL.md` is a **pure visual-design-token spec** (semantic color palette per component type, typography, SVG z-order/spacing rules, legend placement, 4-part page layout) — zero decision logic. Clearest example of a "100% rendering, no judgment" skill.

**[Agents365-ai/drawio-skill](https://github.com/Agents365-ai/drawio-skill)** — 6.5k★ · MIT · `[border→diagram-generation]` — broadest diagram tool (NL/code/IaC/SQL → `.drawio`, 11 presets incl. C4/Architecture/SysML/BPMN). **Best structural exemplars to reuse:** (1) an explicit **"when NOT to use this / route elsewhere"** table naming sibling skills (mermaid/excalidraw/plantuml); (2) **progressive-disclosure SKILL.md** — a lazy-load table mapping "when to read it" → 12 `references/*.md` + `scripts/*.py`, none loaded upfront; (3) rich frontmatter (`compatibility`, `platforms`, cross-tool `metadata`).

**[muratcankoylan/Agent-Skills-for-Context-Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering)** — 17k★ · MIT · `[agentic]` — 18-skill context/harness-engineering suite, tiered **Foundational → Architectural → Operational** (a reusable multi-skill-family README pattern); ships a `template/` for authoring new family skills ("skill-of-skills"). Cited by 2 academic surveys as prior art.

**[obra/superpowers](https://github.com/obra/superpowers)** — 260k★ (star-suspect) · MIT · `[border→skills-framework]` — **confirmed: no architecture skill inside** (14 skills, all dev-methodology/TDD). Best **structural template**: per-harness adapter folders (`.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`…), a `writing-skills` meta-skill, session-start hook auto-activation, and a skill-trigger test suite.

*Also for skill-structure canon:* [anthropics/skills](https://github.com/anthropics/skills) (official SKILL.md format), [wshobson/agents](https://github.com/wshobson/agents) (38k★, multi-harness marketplace).

---

## Top finds (shortlist)

1. **humanlayer/12-factor-agents** — canonical structured framework for `[agentic]` architecture (all 12 factors extracted verbatim). Highest-value newer find.
2. **ddd-crew canvas set** (starter-process 8 stages, bounded-context 11 fields, context-mapping 9 patterns + 3 relationships, aggregate 9 fields, message-flow notation) — reusable CC-BY-SA decision templates mapping directly onto the skill's decomposition/boundary work.
3. **study8677/awesome-architecture (+ architecture-copilot)** — primary dedup target: a near-complete competing skill with a 40-chapter tutorial, 31 architecture templates, and AI-native chapters. Read before building.
4. **Sairyss/system-design-patterns + domain-driven-hexagon** — the deepest pattern catalog (Saga/2PC/Process-Manager triage, Outbox, coupling types, identifier tradeoffs) and the richest tactical-DDD rulebook (guarding-vs-validating, aggregate/VO rules, illegal-states-unrepresentable).
5. **kgrzybek/modular-monolith-with-ddd + evolutionary-architecture-by-example** — the sharpest modular-monolith boundary rule ("IntegrationEvents-only") + the "when to reach for what" sequencing story ("The Project Paradox").
6. **ai-boost/awesome-harness-engineering** (CC0) — the agentic-system NFR/topology vocabulary (loop/memory-tier/permission/orchestration taxonomies).
7. **arc42 (12 sections) + Structurizr/C4 (Context/Container/Component/Code)** — documentation-template + notation backbone.
8. **ADR trio** (joelparkerhenderson catalog · MADR template · npryce adr-tools) — direct hit on the ADR deliverable.
9. **Taxonomy sources:** mehdihadeli/awesome-software-architecture (CC0 category tree, 19 principles + cloud-pattern list) · karanpratapsingh 7-step method + PACELC · Fitness-function ecosystem (QDenka: ArchUnit-family CI gates).
10. **Dedup insight:** existing "architecture" skills are diagram-generators or an EA-governance suite; **no broad architecture-*decision* skill exists** — the niche is open.

## Open gaps (coverage-honest — route to other channels)

- **Security architecture / threat modeling:** GitHub = tools/checklists (OWASP CheatSheetSeries, mrwadams/stride-gpt, OWASP/threat-dragon), not architecture-decision material → web/X channels for STRIDE/zero-trust *design*.
- **Cost & capacity modeling / performance budgets:** near-absent as standalone repos → web channel. (study8677 touches token-cost estimation; awesome-sre touches capacity planning.)
- **AsyncAPI (event contracts) + GraphQL federation:** under-collected — targeted hydrate of `asyncapi/spec`, `apollographql/federation` if wanted.
- **iOS architecture (TCA/VIPER/Clean-Swift):** under-collected vs Android — `pointfreeco/swift-composable-architecture` is the key missing id.
- **Data mesh / data contracts:** thin on GitHub (mostly `[border→data]`).
- **Well-architected / 12-factor(app) / serverless:** live as sites (12factor.net, cloud WAF docs), not high-signal repos → web channel.

---

## Artifacts

- `research/architecture/corpus.json` — full corpus (2,477 repos, enriched finalists).
- `research/architecture/shards.txt` — the 66-shard query file.
- Worker deep-read reports: `scratchpad/arch-research/reports/github-{1,2,3,4}.md` (1/2/4 folded above; 3 = ADR/C4/API/governance, deepening §3 on arrival).
