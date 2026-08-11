# WEB-CANON corpus — `architecture` skill research

**Channel:** open web (WebSearch + WebFetch/crwl/jina extraction) — the freely-parallel canonical-frameworks channel.
**Scope:** gather the CANONICAL, authoritative architecture frameworks + best writing, with source links, so the skill can *wrap and cite* (not reinvent) them. Agentic-architecture section deliberately rich.
**Method:** Opus lead ran broad serial WebSearch across the charter keyword space to identify authoritative primary sources; fanned out 4 Sonnet workers to deep-extract disjoint primary-source URL sets (W1 structure/API-contracts · W2 design paradigms · W3 distributed/cloud/reliability/security · W4 agentic + cross-surface); lead directly extracted the supplementary lanes below. Worker reports live under `scratchpad/arch-research/reports/web-{1..4}.md` and are folded in below.
**Relevance tags:** `[core]` architecture-owned · `[border]` boundary w/ another skill (named) · `[agentic]` agentic-system arch · `[out]` out of scope.
**Coverage honesty:** WebSearch is not a rate-limited relay, so discovery ran in parallel batches without issue. Every framework entry below carries its authoritative source URL. Gaps and any failed fetches are listed at the end.

---

## SUPPLEMENTARY LANES (extracted directly by lead — lanes not assigned to a worker)

### Enterprise Integration Patterns (EIP) — Hohpe & Woolf `[core]` (border: backend messaging impl)
- **What:** The canonical catalog of **65 messaging patterns** for connecting enterprise applications asynchronously. 2003 book + living online catalog.
- **Source:** https://www.enterpriseintegrationpatterns.com/patterns/messaging/ · book: https://www.enterpriseintegrationpatterns.com/
- **Substance:** Pattern families — Messaging Systems (Message Channel, Message, Pipes-and-Filters, Message Router, Message Translator, Message Endpoint); Messaging Channels (Point-to-Point, Publish-Subscribe, Dead Letter Channel, Guaranteed Delivery); Message Construction (Command/Document/Event Message, Request-Reply, Correlation Identifier, Return Address); Message Routing (Content-Based Router, Message Filter, Splitter, Aggregator, Resequencer, Scatter-Gather, Routing Slip, Process Manager); Message Transformation (Content Enricher, Content Filter, Claim Check, Normalizer, Canonical Data Model); Endpoints (Messaging Gateway, Idempotent Receiver, Competing Consumers, Message Dispatcher); System Management (Control Bus, Wire Tap, Message Store). These are the vocabulary for event-driven / integration topology decisions.

### CAP theorem + PACELC — consistency models `[core]`
- **What:** The foundational impossibility result governing distributed-data tradeoffs; PACELC extends it to the no-failure case.
- **Sources:** https://blog.bytebytego.com/p/consistency-and-partition-tolerance · Gilbert & Lynch proof (original). PACELC: Daniel Abadi.
- **Substance:** **CAP** — under a network **P**artition a system must choose **C**onsistency *or* **A**vailability (can't have both). **PACELC** — *if Partition, choose A or C; Else (normal operation) choose Latency or Consistency.* Design lever: strong consistency (linearizable) vs eventual consistency; quorum reads/writes; this is a hard-to-reverse architecture choice tied to data-store selection and SLOs. Consistency models spectrum: linearizable → sequential → causal → eventual.

### Team Topologies — Skelton & Pais `[border]` (org design ↔ architecture via inverse Conway)
- **What:** Framework for organizing teams for fast flow; directly shapes service boundaries (Conway's Law / inverse Conway maneuver).
- **Source:** https://teamtopologies.com/key-concepts-content/team-interaction-modeling-with-team-topologies · book "Team Topologies" (2019)
- **Substance:** **4 team types** — (1) **Stream-aligned** (aligned to a flow of work / product, the primary team type), (2) **Platform** (provide internal self-service services that reduce stream-aligned teams' cognitive load), (3) **Enabling** (coach other teams to acquire missing capabilities), (4) **Complicated-subsystem** (own parts needing deep specialist knowledge). **3 interaction modes** — **Collaboration** (intensive, time-bounded, high communication cost, for discovering new capability), **X-as-a-Service** (consume/provide with minimal collaboration via API+docs, low cognitive load, sustainable long-term), **Facilitating** (enabling team coaches, weeks-to-months, goal = autonomy). Key lever: **cognitive load** as a first-class design constraint; team boundaries should match bounded contexts. Underpins **platform engineering / Internal Developer Platform (IDP)** — the platform team runs the IDP as an X-as-a-Service product.

### Data Mesh — Zhamak Dehghani `[core]` (border: data skill)
- **What:** Decentralized data architecture organizing analytical data by business domain.
- **Sources:** https://www.datamesh-architecture.com/ · https://www.thoughtworks.com/en-us/insights/books/data-mesh · Dehghani's original essays (martinfowler.com)
- **Substance:** **4 principles** — (1) **Domain ownership** (domains own their analytical data), (2) **Data as a product** (discoverable, addressable, trustworthy, self-describing SLAs), (3) **Self-serve data platform** (infra as a platform lowering barrier), (4) **Federated computational governance** (global interoperability standards enforced computationally). Architectural lever: the **operational-vs-analytical split** — data mesh addresses analytical-plane decentralization vs a centralized lake/warehouse. Contrast with data lakehouse. Relevant to architecture's data-flow / analytical-vs-operational-split ownership.

### CNCF Cloud Native — definition + cloud-native standards `[core]`/`[agentic]`
- **What:** The authoritative definition of "cloud native" + the CNCF landscape/maturity model.
- **Sources:** https://github.com/cncf/toc/blob/main/DEFINITION.md (Cloud Native Definition v1.1) · https://maturitymodel.cncf.io/ · NEW/agentic: https://www.cncf.io/blog/2026/03/23/cloud-native-agentic-standards/
- **Substance:** Cloud-native = containers, service meshes, microservices, immutable infrastructure, declarative APIs → loosely-coupled systems that are **resilient, manageable, observable**, with robust automation for frequent high-impact changes. Pairs with 12-factor (see W2). **Standout newer find:** CNCF is now defining **cloud-native agentic standards (2026)** — signals agentic architecture is entering the cloud-native canon; worth tracking for the agentic section.

### API-style tradeoffs — REST vs gRPC vs GraphQL (+ versioning) `[core]` (border: backend/frontend impl)
- **What:** The contract-style decision for inter-component interfaces (architecture owns the choice; build skills implement).
- **Sources:** https://www.cncf.io/blog/2021/07/19/think-grpc-when-you-are-architecting-modern-microservices/ · general comparison literature
- **Substance:** **REST** — resource-focused, untyped, simple/interoperable request-response, weak streaming, payload/latency cost. **gRPC** — service-focused, strongly typed via **protobuf**, HTTP/2 streaming, high performance, best for internal service-to-service. **GraphQL** — query-focused, strongly-typed schema, single request fetches multiple resources (avoids over/under-fetching), good for diverse clients/BFF; **federation** composes multiple subgraph services into one supergraph. **Versioning:** URI/media-type versioning (REST), schema evolution + field deprecation (GraphQL, avoid breaking changes), protobuf field-number back-compat (gRPC). Decision drivers: data-model complexity, client diversity, change frequency, latency budget.

---

## CLUSTER W1 — Structure, documentation & API contracts
_(full detail: `scratchpad/arch-research/reports/web-1.md` — all 7 URLs reachable)_

### C4 model — https://c4model.com/ `[core]` · License: CC BY 4.0
Simon Brown's "abstraction-first," notation-independent approach to architecture diagramming. **Hierarchy:** Person → Software System → Container → Component → Code. **4 core levels:** (1) **System Context** — system as one box among users + external systems; low detail; audience = everybody; always use. (2) **Container** — apps + data stores inside the system boundary, their responsibilities + major tech choices + comms; technical audience; always use. (3) **Component** — decompose one container into components; only if it adds value / can be auto-generated. (4) **Code** — UML/ER inside a component; rarely, prefer IDE-generated. **Supplementary:** System Landscape (portfolio map, "bridge into enterprise architecture"), Dynamic (runtime collaboration for a story/use case), Deployment (instances → infra nodes per environment; nestable; use). **Notation rules:** every diagram needs title + key; specify each element's type; every container/component names its technology; every line is a labelled unidirectional relationship (avoid vague "Uses"); colours consistent + colour-blind-safe.

### arc42 — https://docs.arc42.org/home/ `[core]`
Lightweight 12-section architecture-documentation template (scales lean→regulated). **The 12 sections in order:** 1 Introduction & Goals · 2 Constraints · 3 Context & Scope · 4 Solution Strategy · 5 Building Block View (static decomposition, black/white-box) · 6 Runtime View (dynamic scenarios) · 7 Deployment View · 8 Crosscutting Concepts · 9 Architecture Decisions (natural border to ADRs) · 10 Quality Requirements (quality tree + scenarios) · 11 Risks & Technical Debt · 12 Glossary.

### 4+1 architectural view model — https://en.wikipedia.org/wiki/4%2B1_architectural_view_model `[core]`
Philippe Kruchten (1995), method/notation-agnostic. **Logical** (functionality → end-users; class/state diagrams) · **Process** (concurrency/performance/scalability → integrators; sequence/activity) · **Development/Implementation** (module/package org → developers; package diagrams) · **Physical/Deployment** (topology onto infra → system engineers; deployment diagrams) · **+1 Scenarios** (use cases tying the four together, validating consistency; all stakeholders).

### ADRs — Nygard original + catalog — https://github.com/joelparkerhenderson/architecture-decision-record `[core]` · License: **CC BY-NC-SA (non-commercial)** on the repo's own text — flag for verbatim reuse
An ADR "captures an important architecture decision made along with its context and consequences." **Nygard's original 5 fields:** Title · Status (proposed/accepted/deprecated/superseded) · Context · Decision · Consequences. Repo catalogs ~12 alternative templates (Tyree-Akerman, arc42, MADR, Zimmermann, Merson, Planguage/Y-statements, etc.).

### MADR + adr.github.io — https://adr.github.io/ · https://adr.github.io/madr/ `[core]`
adr.github.io = ADR org hub (vocabulary, tooling, 7-template comparison; recommends Y-statement format from Zdun et al.). **MADR** (Markdown ADR) full template: Title · Context & Problem Statement · Decision Drivers* · Considered Options · Decision Outcome · Consequences* · Confirmation* · Pros/Cons of Options* · More Information* (*=optional; minimal variant drops them). Optional YAML front-matter: status/date/decision-makers/consulted/informed (RACI-like layer Nygard lacks). Files `NNNN-title-with-dashes.md`. **vs Nygard:** more granular + decision-analysis-oriented.

### OpenAPI Specification (OAS) — https://swagger.io/specification/ `[core]` (border: backend/frontend API impl)
Language-agnostic contract for HTTP APIs; enables doc/code/test generation. **Top-level:** `openapi` (version) · `info` · `servers` · `paths` (endpoints+operations) · `components` (reusable `schemas`, `securitySchemes`, `parameters`, `responses` via `$ref`) · `security` · `tags`. Enables **contract-first** design (agree the spec before building → parallel producer/consumer work).

### AsyncAPI — https://www.asyncapi.com/docs/concepts `[core]` (border: backend messaging)
The event-driven counterpart to OpenAPI (contract for async/message APIs). **Core concepts:** Application · Server (broker/host) · Channel (topic/address e.g. `user/signedup`) · Message (payload schema + metadata) · Operation (`send`|`receive` on a channel — replaces pre-3.0 publish/subscribe) · Producer/Consumer · Protocol (MQTT/AMQP/Kafka via bindings). Document acts as "a communication contract between senders and receivers."

## CLUSTER W2 — Design paradigms (DDD, hexagonal, clean, evolutionary, 12-factor)
_(full detail: `scratchpad/arch-research/reports/web-2.md` — all 7 URLs reachable)_

### DDD — Bounded Context — https://martinfowler.com/bliki/BoundedContext.html `[core]`
The strategic-design pattern dividing a large domain into internally-consistent contexts with explicit relationships. "Total unification of the domain model for a large system will not be feasible." Boundary signal = where the **Ubiquitous Language** changes (same word, different meaning = "polysemes"). Boundary drivers: org/team culture, technical representation.

### DDD — Overview — https://martinfowler.com/bliki/DomainDrivenDesign.html `[core]`
Evans (2003). Best for complex domains (not CRUD). **Ubiquitous Language** embedded in code, evolved continuously. **Tactical design:** Entities (identity) · Value Objects (attributes, no identity) · Domain Services · **Aggregates** (consistency/transaction boundary with one Aggregate Root) · Repositories. **Strategic design:** multiple Bounded Contexts + their mapping; **Core Domain** = the differentiating part meriting most investment (vs supporting/generic subdomains).

### Context Mapping — https://github.com/ddd-crew/context-mapping `[core]` · License: **CC BY-SA 4.0** (LICENCE.md; README badge wrongly says CC BY 4.0 — share-alike applies)
**3 team relationships:** Mutually Dependent · Upstream/Downstream · Free. **9 context-map patterns** (Evans quotes): Open-Host Service (published protocol of services) · Conformist (downstream adopts upstream model wholesale) · Anticorruption Layer/ACL (isolating translation layer protecting downstream model) · Shared Kernel (small explicitly-shared model subset) · Partnership (coordinated mutual dependency) · Customer/Supplier (formalized upstream accountability to downstream) · Published Language (shared documented interchange language, e.g. iCalendar) · Separate Ways (deliberate non-integration) · Big Ball of Mud (fence off the messy legacy). Guidance: prefer small question-specific maps.

### Hexagonal / Ports & Adapters — https://alistair.cockburn.us/hexagonal-architecture/ `[core]`
Cockburn: let the app be driven equally by users/tests/batch/other programs and developed in isolation from run-time devices/DBs. The core exposes **ports** (purposeful interfaces); **adapters** translate tech-specific signals. Real asymmetry is **inside vs outside**, not top/bottom layers. **Primary/driving** ports (users, tests drive the app) vs **secondary/driven** ports (app calls DBs/APIs; mockable). Makes separation-of-concerns *verifiable* via automated tests.

### Clean Architecture — https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html `[core]`
Uncle Bob. **4 concentric circles** (outer→inner): Frameworks & Drivers → Interface Adapters (controllers/presenters/gateways) → Use Cases (app-specific rules) → Entities (enterprise rules). **The Dependency Rule:** source-code dependencies point only inward; inner circles know nothing of outer (uses Dependency Inversion). Explicit synthesis of Hexagonal (Cockburn), Onion (Palermo), Screaming, DCI, BCE — all sharing 5 goals: framework/UI/DB/external-agency-independent + testable.

### Fitness-Function-Driven Development / Evolutionary Architecture — https://www.thoughtworks.com/insights/articles/fitness-function-driven-development `[core]`
A fitness function "describe[s] how close an architecture is to achieving an architectural aim" — objective, automatable governance of the -ilities (vs TDD's feature correctness). Acts as automated CI/CD gatekeepers blocking promotion, preventing architectural drift. Article's domains: code quality, resiliency, observability, performance, compliance, security, operability; distinguishes continuous-monitoring vs triggered/pipeline-gate checks. **Gap:** the finer atomic/holistic·static/dynamic/temporal taxonomy is from the *Building Evolutionary Architectures* book (Ford/Parsons/Kua), NOT this article — cite the book for those terms.

### Twelve-Factor App — https://12factor.net/ `[core]`
1 Codebase (one repo, many deploys) · 2 Dependencies (explicit declare + isolate) · 3 Config (in the environment) · 4 Backing Services (attached resources via URL) · 5 Build/Release/Run (strictly separate, immutable releases) · 6 Processes (stateless, share-nothing) · 7 Port Binding (self-contained, export via port) · 8 Concurrency (scale out via process model) · 9 Disposability (fast startup, graceful shutdown) · 10 Dev/Prod Parity (minimize time/personnel/tools gaps) · 11 Logs (event streams to stdout) · 12 Admin Processes (one-off tasks in identical env).

## CLUSTER W3 — Distributed / cloud / reliability / security
_(full detail: `scratchpad/arch-research/reports/web-3.md` — all 9 URLs reachable)_

### Well-Architected frameworks — cross-cloud pillar comparison `[core]`
- **AWS** (6) — https://aws.amazon.com/architecture/well-architected/ : Operational Excellence · Security · Reliability · Performance Efficiency · Cost Optimization · **Sustainability** (2021, newest). Reviewed via free AWS Well-Architected Tool.
- **Azure** (5) — https://learn.microsoft.com/en-us/azure/well-architected/pillars : Reliability · Security (CIA triad explicit) · Cost Optimization · Operational Excellence · Performance Efficiency. No Sustainability pillar; first-class **Tradeoffs** pages; operationalized via Azure Advisor Score.
- **GCP** (6) — https://cloud.google.com/architecture/framework : Operational Excellence · **Security, Privacy & Compliance** (folds in privacy+regulatory) · Reliability · Cost Optimization · Performance Optimization · Sustainability.
- **Convergence:** all share Ops Excellence/Security/Reliability/Cost/Performance; Sustainability = AWS+GCP only; GCP uniquely merges privacy/compliance into Security. Good compare-table material.

### microservices.io pattern language — https://microservices.io/patterns/ `[core]` (Chris Richardson)
The standard catalog. **Decomposition:** by business capability / by subdomain / self-contained service / service-per-team. **Data:** Database-per-Service · Saga · CQRS · Event Sourcing · API Composition · Domain Event · Transactional Outbox / Log Tailing / Polling Publisher. **API layer:** API Gateway · Backend-for-Frontend (BFF). **Discovery:** client-side / server-side / service registry. **Reliability:** Circuit Breaker. **Observability:** log aggregation, metrics, distributed tracing, health-check API, audit logging. **Deployment:** service-per-container/VM/serverless. **Cross-cutting:** microservice chassis, externalized config, service template. **Refactoring:** Strangler + ACL.
- **Saga** (https://microservices.io/patterns/data/saga.html): sequence of local transactions + compensating transactions for cross-service consistency without 2PC. Two styles — **choreography** (events, no coordinator) vs **orchestration** (central command). Drawbacks: hand-designed compensation, no ACID isolation, needs Transactional Outbox.
- **CQRS** (https://microservices.io/patterns/data/cqrs.html): separate command model from read-only materialized views kept current via domain events; near-mandatory with Event Sourcing; views are eventually consistent (replication lag).

### Strangler Fig + Circuit Breaker (martinfowler.com/bliki) `[core]`
- **Strangler Fig** (https://martinfowler.com/bliki/StranglerFigApplication.html): incrementally replace legacy piece-by-piece via seams; old+new run concurrently behind a routing façade; needs a deliberately-temporary "transitional architecture." Beats big-bang rewrites (which "go down in flames").
- **Circuit Breaker** (https://martinfowler.com/bliki/CircuitBreaker.html): 3 states — **Closed** (calls pass) → **Open** (fail fast, no call) after a failure threshold (e.g. 5) → **Half-Open** (one trial probe after timeout) → back to Closed on success or Open on failure. Prevents cascading failure, conserves resources, self-heals. (From Nygard's *Release It!*)

### Google SRE — Embracing Risk — https://sre.google/sre-book/embracing-risk/ `[core]` (border: operate owns runtime)
**Error budget = 1 − SLO.** Budget consumed as a running % (e.g. failing 0.0002% of a quarter's queries against a 99.999% SLO spends 20% of budget). **Release-velocity control loop:** releases continue while budget remains; halt when exhausted → dev team self-polices. SLO number becomes a **budget constraint** sizing redundancy/regions/retries/on-call — a direct architecture input. (Chapter defines SLO+budget; SLI/SLA formal defs live in the sibling ch.4 — SLI=measured metric, SLO=target, SLA=SLO+contractual penalty.)

### Threat modeling — OWASP + Manifesto `[core]`
- **STRIDE** (https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html): Spoofing→Authentication · Tampering→Integrity · Repudiation→Non-repudiation · Information Disclosure→Confidentiality · Denial of Service→Availability · Elevation of Privilege→Authorization. **4 framing questions:** What are we working on? What can go wrong? What are we going to do about it? Did we do a good enough job? Other frameworks named: LINDDUN (privacy), PASTA, OCTAVE, VAST.
- **Threat Modeling Manifesto** (https://www.threatmodelingmanifesto.org/): 5 values (culture of finding/fixing over compliance; people+collaboration over tools; journey of understanding over snapshot; doing over talking; continuous refinement over single delivery) + 4 principles; patterns (Systematic Approach, Informed Creativity, Varied Viewpoints, Useful Toolkit, Theory into Practice) & anti-patterns (Hero Threat Modeler, Admiration for the Problem, Tendency to Overfocus, Perfect Representation).

## CLUSTER W4 — Agentic / LLM-app architecture (RICH) + cross-surface
_(full detail: `scratchpad/arch-research/reports/web-4.md` — all 8 URLs reachable; this is the richest cluster)_

### Anthropic — Building Effective Agents — https://www.anthropic.com/engineering/building-effective-agents `[agentic]`
The foundational vocabulary. **Workflows** = "LLMs and tools orchestrated through predefined code paths"; **Agents** = "LLMs dynamically direct their own processes and tool usage." **Augmented LLM** = base unit (LLM + retrieval + tools + memory). **5 workflow patterns:** Prompt Chaining (fixed sequential steps + gates) · Routing (classify → specialized branch) · Parallelization (Sectioning = independent subtasks; Voting = same task N times) · Orchestrator-Workers (central LLM dynamically decomposes+delegates+synthesizes — subtasks NOT pre-defined) · Evaluator-Optimizer (generator + evaluator loop). **Autonomous agent** = plan+act with environmental ground truth each step; use for open-ended, unpredictable-step-count tasks in a trusted sandbox. **Guidance:** start simple; agents trade latency/cost for performance; invest in **ACI** (Agent-Computer Interface) design + poka-yoke tools; prefer direct APIs over opaque frameworks.

### Anthropic — Multi-Agent Research System — https://www.anthropic.com/engineering/multi-agent-research-system `[agentic]`
Orchestrator-worker at scale: Opus lead spawns 3-5 Sonnet subagents with separate context windows; each explores an angle, returns condensed findings; lead synthesizes; CitationAgent attributes. **Numbers:** multi-agent beat single Opus by **90.2%**; standard agents ~**4×** chat tokens, multi-agent ~**15×**; token usage explains **80%** of performance variance. **Wins** on breadth-first, context-exceeding, parallelizable work; **loses** on shared-context/high-dependency/coding tasks. **Scale effort to complexity** (1 agent/3-10 calls → 10+ agents). Eval: ~20 queries + LLM-as-judge rubric + human testing. Production: resume-from-checkpoint, tracing for non-determinism, rainbow deployments, sync-execution bottleneck.

### Anthropic — Effective Context Engineering — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents `[agentic]`
Context engineering = "curating and maintaining the optimal set of tokens during inference" across the whole lifecycle (supersedes prompt engineering). **"Context rot":** recall degrades as tokens grow (n² attention) → context is a finite "attention budget." **Techniques:** system prompt at the right "altitude" (specific yet heuristic); unambiguous non-overlapping tools; canonical few-shot examples; **just-in-time retrieval** (lightweight identifiers, load at runtime). **Long-horizon:** Compaction (summarize near limit) · lightweight tool-result clearing · Structured note-taking (external memory) · Sub-agent context isolation (return 1-2k-token summaries). Principle: "smallest set of high-signal tokens."

### Google Cloud — Choose a Design Pattern for Your Agentic AI System — https://docs.cloud.google.com/architecture/choose-design-pattern-agentic-ai-system `[agentic]`
12 named patterns w/ tradeoffs. **Single-Agent** (model+tools+prompt). **Multi-agent:** Sequential · Parallel · Loop · Review-and-Critique · Iterative Refinement · Coordinator (model-driven routing) · Hierarchical Task Decomposition · Swarm (all-to-all, no supervisor). **Plus:** ReAct (Thought→Action→Observation) · Human-in-the-Loop (checkpoints) · Custom Logic (code branching). **Selection matrix:** Deterministic→Sequential/Parallel/Iterative-Refinement; Dynamic orchestration→Single/Coordinator/Hierarchical/Swarm; Iterative→ReAct/Loop/Review-Critique; Special→HITL/Custom. **Rule: start single-agent, graduate to multi-agent as complexity demands.** (Best-structured single reference for an agentic pattern-selection page.)

### RAG architectures — https://humanloop.com/blog/rag-architectures `[agentic]`
8 named variants (static→autonomous): **Simple RAG** (FAQ) · **Simple RAG w/ Memory** (contextual chatbot) · **Branched RAG** (selective source choice) · **HyDE** (hypothetical-doc embedding guides retrieval) · **Adaptive RAG** (strategy varies by query complexity) · **Corrective/CRAG** (self-grade docs into knowledge strips, web-search fallback; high-stakes) · **Self-RAG** (model generates+refines its own retrieval queries) · **Agentic RAG** (Document-Agent-per-doc + meta-agent). Two-stage core: retrieval → generation. Choose by query complexity/KB size/accuracy/context/sources. (Under-details chunking/embedding/vector-store/reranking — see gaps.)

### Android app architecture guide — https://developer.android.com/topic/architecture `[border: frontend/mobile build]`
3-layer (domain optional): **UI Layer** (Compose UI + `ViewModel` state holders) → **Domain Layer** (use cases/interactors) → **Data Layer** (Repositories over Data Sources). Principles: **Separation of Concerns** (no logic in ephemeral Activities) · **Drive UI from persistent data models** · **SSOT** (single owner mutates, exposes immutable types) · **UDF** (state down, events up). DI via Hilt. General-purpose state/layering pattern beyond Android.

### Micro-frontends — https://martinfowler.com/articles/micro-frontends.html `[border: frontend build]` (Cam Jackson)
"Independently deliverable frontend applications composed into a greater whole." Benefits: independent deploy (own CD pipeline), vertical team autonomy, incremental upgrades (strangler), decoupled codebases. **Integration approaches:** server-side template composition · build-time (npm — anti-pattern, lockstep coupling) · run-time iframes (isolation, awkward routing) · **run-time JavaScript (most flexible/common)** · run-time Web Components. **CSS isolation:** BEM/CSS-in-JS/Shadow DOM/CSS modules. **Cross-app comms:** URL/routing, custom events, callbacks — AVOID shared global store. Pairs with **BFF**. Downsides: payload duplication, env drift, operational complexity.

### The Composable Architecture (TCA) — https://github.com/pointfreeco/swift-composable-architecture `[border: iOS build]` · License: **MIT**
Point-Free's unidirectional SwiftUI/UIKit architecture. **Core:** State (value type) · Action (enum of all occurrences) · Reducer (state→state + declares Effects) · Store (runtime) · Effect (side effects). Flow: action→store→reducer mutates state + returns effects→effects emit actions→UI updates. Features decompose into composable isolated domains. `TestStore` asserts whole workflows with mock dependencies. Redux-inspired.

---

## TOP FINDS (shortlist)
1. **Anthropic "Building Effective Agents"** — the canonical agentic vocabulary (workflows-vs-agents + 5 workflow patterns + ACI). The spine of the skill's agentic section. `[agentic]`
2. **Google Cloud "Choose a design pattern for your agentic AI system"** — the single best-structured *selection framework* for 12 agentic patterns with an explicit decision matrix. Less-obvious find; pairs perfectly with #1. `[agentic]`
3. **Anthropic "Effective context engineering"** — reframes context as a finite budget with named long-horizon strategies (compaction, note-taking, sub-agent isolation, JIT retrieval) — architecture-relevant because non-determinism + context limits are *design constraints*. `[agentic]`
4. **C4 model** — the diagramming backbone; CC BY 4.0 (reusable with attribution); maps cleanly onto arc42 §3/§5/§7. `[core]`
5. **microservices.io pattern language** (incl. Saga + CQRS mechanics) — the distributed-systems vocabulary in one authoritative catalog. `[core]`
6. **ddd-crew/context-mapping** — the 9 context-map patterns as a ready cheat-sheet; **but CC BY-SA 4.0** (share-alike) — reuse implication flagged. `[core]`
7. **Cross-cloud Well-Architected triangulation** (AWS 6 / Azure 5 / GCP 6) — turnkey non-functional-budget checklist + a compare-table. `[core]`
8. **Anthropic multi-agent economics** — the 4×/15×-token and 90.2% numbers give the skill concrete "when is multi-agent worth it" decision data. `[agentic]`
9. **Team Topologies** — the org-design↔architecture bridge (inverse Conway, cognitive load as a boundary driver) — underappreciated architecture input. `[border]`
10. **CNCF cloud-native agentic standards (2026)** — signal that agentic architecture is entering the cloud-native canon; worth tracking. `[agentic]`

### License flags for verbatim reuse (for the skill author)
- `joelparkerhenderson/architecture-decision-record` → **CC BY-NC-SA** (non-commercial) — re-express, don't copy at length.
- `ddd-crew/context-mapping` → **CC BY-SA 4.0** (share-alike; README badge wrongly says CC BY 4.0).
- `c4model.com` → **CC BY 4.0** (attribution only — safest to quote).
- `swift-composable-architecture` (TCA) → **MIT**.
- Vendor docs (AWS/Azure/GCP/Android/Anthropic/microservices.io/martinfowler.com) → cite + re-express, don't reproduce wholesale.

## OPEN GAPS (coverage honesty)
- **Book-only depth not fetched:** the fuller *Building Evolutionary Architectures* fitness-function taxonomy (atomic/holistic · static/dynamic/continuous/temporal) and Evans's/Vernon's DDD tactical depth live in books, not the fetched pages — cite the books for those specifics.
- **SRE ch.4 not fetched:** SLI/SLA formal definitions come from the sibling "Service Level Objectives" chapter (only "Embracing Risk" was targeted). Supplementary defs added + marked.
- **RAG mechanics thin:** the Humanloop source names variants well but under-details chunking/embedding/vector-store/reranking — a dedicated RAG-internals source (e.g. an arxiv RAG survey seen in discovery: arxiv.org/html/2506.00054) would fill this.
- **Not deep-read (identified in discovery, not extracted):** Enterprise Integration Patterns individual pattern pages; CAP/PACELC primary proofs; full Team Topologies text; GraphQL Federation / gRPC / API-versioning primary specs; data-mesh primary essays. Captured at summary depth in the Supplementary Lanes section above — adequate for scoping, not for verbatim wrapping.
- **AsyncAPI-vs-OpenAPI** relationship is synthesized inference (the fetched concept pages lacked a direct comparison) — flagged in web-1.md.
- **arc42 section one-liners** are from the overview page, not each official section template — high confidence but not independently re-verified per section.
- **12-factor successor:** did not evaluate whether a newer "beyond 12-factor" / 15-factor (IBM) framing should be included — worth a quick follow-up if the skill wants current cloud-native app methodology.
