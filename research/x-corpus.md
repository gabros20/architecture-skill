# Architecture skill — X / social-channel corpus

**Channel:** X/Twitter (`xrelay`) + Tamás's local X bookmark archive (`bookmark-search`, 4,600+ saved posts)
**Scope covered:** the full `architecture` keyword space (system design, distributed systems, microservices, DDD, event-driven, API/contract design, ADR/C4/arc42, scalability/resilience, security architecture, data architecture, migration, evolutionary architecture, and — first-class — agentic/LLM-app architecture, RAG topology, multi-agent, context engineering).

## Method

1. **Bookmark archive first (lead channel, offline, no rate limits).** Ran 32 `bookmark-search` queries across the keyword space (compact), then 8 more in full-JSON mode for untruncated finalist text. 518 distinct saved posts surfaced; 257 survived an architecture-signal / anti-noise filter. The engagement-ranked top is dominated by viral AI-product launches (model drops, tool announcements) — noise for architecture — so ranking was redone on per-topic relevance + topic-breadth.
2. **Live X (`xrelay`) — WORKED this round but slow.** `xrelay doctor` passed (auth OK, test search 1.8s). A serialized 30-query `batch` (rate-limit-safe, `--delay 3500`) reached query 25/30 in ~7 min (~15s/query for `--product Top`) before I killed it — and `batch --out` only writes on full completion, so that partial sweep was lost (my error). **Net: live search is alive this round (unlike last round's dead endpoint), just slow; I deprioritized re-running it in favor of higher-value archive content** (see next).
3. **The archive's crown jewels = native X long-form Articles.** Many top finalists resolve to `x.com/i/article/…` — long-form pieces, heavily bookmarked (up to 26k). Extracted the top 13 via `xrelay article` **serially** (single account, no parallel calls), saved locally, then distilled with one worker.
4. **4 Sonnet deep-read workers (charter budget), all on DISJOINT targets, none touching the rate-limited search endpoint:** x-1 = classic system-design canon (web), x-2 = agentic-architecture canon (web), x-3 = RAG/LLM-app taxonomy (web), x-4 = the 13 extracted X long-form articles (local files). Full worker extractions live in `scratchpad/arch-research/reports/x-{1,2,3,4}.md`; their substance is folded in below.

## Coverage honesty

- **Bookmark archive relevance: HIGH for this skill** (much higher than it was for `product`). The archive skews AI-engineering / agentic / distributed-systems — which is squarely architecture-relevant, and gives the `[agentic]` scope unusually deep, current (2026) primary material that canonical textbooks don't have yet.
- **Weak archive lanes (honest gaps):** classic **mobile architecture** (iOS/Swift MVVM/TCA, Android/Clean) — queries return v0/tooling noise, near-zero real substance; **ADR templates, STRIDE threat-modeling, DB schema/normalization** as canonical craft — also thin/noisy. These must come from the GitHub + web channels, not here.
- **Live X at scale:** not fully harvested (slow endpoint + my kill of the partial batch). The archive + article extraction more than compensated; a future run could let a serialized `batch` finish for fresh non-saved voices.
- Canonical web resources (Fowler, C4, Anthropic, RAG repos) surfaced here will overlap with the GitHub/web channels — deduped by the controller. The UNIQUE value of this channel is the bookmark-archive threads + X long-form articles below, which no other channel can see.

---

# A — [core] Classic software architecture & system design

### A1. System Design Primer — donnemartin/system-design-primer
- **What:** most-starred system-design learning repo (interview prep + scalability fundamentals). **URL:** https://github.com/donnemartin/system-design-primer — **License: CC BY 4.0** (attribution, verbatim-friendly with credit).
- Core trade-off triplets to teach: performance vs scalability · latency vs throughput · availability vs consistency (CAP → CP vs AP under partition).
- Consistency spectrum: weak → eventual → strong. Availability patterns: fail-over (active-passive / active-active), replication.
- Layered vocabulary: DNS · CDN (push vs pull) · load balancer (L4 vs L7) · reverse proxy · application layer + service discovery · RDBMS scaling (master-slave, master-master, federation, sharding, denormalization, SQL tuning) · NoSQL (key-value, document, wide-column, graph) · caching layers (client/CDN/webserver/DB/object) + update patterns (cache-aside, write-through, write-behind, refresh-ahead) · async (message queues, task queues, back-pressure) · comms (TCP/UDP, RPC vs REST).
- **The 4-step system-design-interview method** (reusable as an architecture-shaping checklist): (1) outline use cases/constraints/assumptions (scope, request & data volume, read/write ratio); (2) high-level design (components + arrows, justify); (3) design core components in depth (consistent hashing, schema, API contracts); (4) scale it (find bottlenecks → horizontal scale, LB, cache, shard).

### A2. System Design 101 — ByteByteGoHq/system-design-101
- **What:** ByteByteGo's visual one-diagram-per-topic explainer index (~500 guides, 15 categories). **URL:** https://github.com/ByteByteGoHq/system-design-101 — **License: CC BY-NC-ND 4.0** (⚠ no commercial use, no derivatives — reference-only, do NOT re-express verbatim into a shipped skill).
- Value = a **vocabulary/coverage index** of what a complete system-design curriculum spans: API & web dev · real-world case studies (Netflix/Uber/Discord…) · DB & storage · caching & performance (eviction LRU/LFU) · payments/fintech · software architecture (microservices, DDD, patterns) · cloud & distributed systems · security (authN/Z, OAuth, JWT) · computer fundamentals (DNS, TCP/UDP, OSI).

### A3. C4 Model — Simon Brown (c4model.com)
- **What:** notation-independent hierarchical architecture-diagram model. **URL:** https://c4model.com/ — **License: CC BY 4.0.**
- **4 zoom levels:** (1) **System Context** — system as one box + people + external systems (audience: everyone); (2) **Container** — separately deployable/runnable units (web/mobile app, DB, service, serverless fn — *not* Docker) + tech choices + comms; (3) **Component** — building blocks inside one container; (4) **Code** (optional, usually auto-generated, deprioritized).
- **Notation rules:** every element = name + technology/description; labeled directional arrows describe what/why/protocol; consistent shapes/colors/legend across all levels. Deliberately informal (just boxes+lines+labels).
- **Supplementary diagrams:** System Landscape (whole estate), Dynamic (runtime scenario/sequence), Deployment (containers → infra nodes/environments).

### A4. arc42 template (arc42.org)
- **What:** 12-section tool-agnostic architecture-documentation template. **URL:** https://arc42.org/overview — free/CC.
- **The 12 sections:** 1 Introduction & Goals (+quality goals) · 2 Constraints · 3 Context & Scope (system boundary, external interfaces) · 4 Solution Strategy · 5 Building Block View (static decomposition, whitebox/blackbox, refined by level) · 6 Runtime View (behavior scenarios) · 7 Deployment View · 8 Crosscutting Concepts (domain model, patterns, security, persistence, error handling, logging) · 9 Architectural Decisions (arc42's ADR log) · 10 Quality Requirements (quality tree + testable scenarios) · 11 Risks & Technical Debt (ranked) · 12 Glossary. Note: section order ≠ writing order; fill iteratively.

### A5. Microservices — the canonical definition (Fowler & Lewis)
- **What:** the 2014 article that named/defined microservices vs monolith. **URL:** https://martinfowler.com/articles/microservices.html
- **The 9 characteristics (each a design rule):** 1 Componentization via *Services* (independently deployable, remote calls = conscious coarse-grained trade-off); 2 Organized around Business Capabilities (cross-functional teams cut by business line, not tech layer — full-stack per capability); 3 Products not Projects ("you build it you run it"); 4 Smart Endpoints & Dumb Pipes (logic in services, simple HTTP/lightweight messaging, anti-ESB); 5 Decentralized Governance (polyglot, no mandated platform); 6 Decentralized Data Management (DB-per-service, eventual consistency + compensating ops, no distributed ACID); 7 Infrastructure Automation (CI/CD makes releases "boring"); 8 **Design for Failure** (tolerate dependency failure + real-time monitoring; **Circuit Breaker** named); 9 Evolutionary Design (boundaries evolve; "things that change together live together").

### A6. Microservices pattern catalog — Chris Richardson (microservices.io)
- **What:** the canonical named-pattern language for microservices. **URL:** https://microservices.io/patterns/index.html
- **Decomposition:** by business capability · by subdomain (DDD) · self-contained service · service-per-team. **Refactoring:** Strangler Application · Anti-corruption layer.
- **Data management:** Database-per-Service · **Saga** (distributed txns via local txns + compensations) · **CQRS** · **Event Sourcing** · API Composition · Domain Event · shared-DB (escape hatch). **Transactional messaging:** Transactional Outbox · Transaction Log Tailing · Polling Publisher.
- **External API:** API Gateway · Backend-for-Frontend (BFF). **Comms:** RPC · Messaging · Idempotent Consumer. **Discovery:** client-side / server-side / service registry. **Reliability:** Circuit Breaker. **Observability:** log aggregation, metrics, audit log, distributed tracing, health-check API. **Testing:** Consumer-driven contract tests. **Deployment:** instance-per-host/VM/container, serverless. **Cross-cutting:** Microservice Chassis, Externalized Config.

### A7. Monolith-First / Microservice-Premium decision rule — Fowler
- **URLs:** https://martinfowler.com/bliki/MonolithFirst.html · https://martinfowler.com/bliki/MicroservicePremium.html
- **Rule:** almost all successful microservice systems started as a monolith that grew and was decomposed; almost all greenfield-microservices systems hit serious trouble. Reasons: (1) the **microservice premium** (automated deploy, monitoring, failure handling, eventual consistency — real overhead); (2) YAGNI/uncertainty (monolith → validated learning faster); (3) boundaries are hard up front and expensive to move once they're network/data seams.
- **Quotable:** "Don't even consider microservices unless you have a system that's too complex to manage as a monolith." Keep the first monolith well-modularized ("sacrificial architecture"); peel services at the edges once the domain/boundaries and team size justify it. Caution: most "monolith problems" are internal-discipline failures, not inherent to monolithic deployment.

### A8. System-design case-study index — Neo Kim (@systemdesignone)
- **URL:** https://x.com/systemdesignone/status/2037884162967781641 (thread) → blog.systemdesign.one
- **19 worked case studies** (each links a full write-up): Stock Exchange · Payment System · YouTube · Google Docs · **Kafka** · Pastebin · WhatsApp · … — a ready reference set of "how X works" reference architectures. High-signal author for the classic/core lane (bm 4.2k).

### A9. OpenAI Postgres scaling — Arpit Bhayani (@arpit_bhayani)
- **URL:** https://x.com/arpit_bhayani/status/2074509051686445362
- Substance: OpenAI serves ~800M ChatGPT users on **one PostgreSQL primary + ~50 read replicas** (links to OpenAI's own engineering post). Reusable as a scale/capacity anchor and a "scale reads before you shard writes" argument. Arpit Bhayani = high-signal distributed-systems educator worth mining further.

---

# B — [agentic] Agentic-system architecture (FIRST-CLASS — the archive's deepest, most current lane)

### B1. Building Effective Agents — Anthropic (the canonical framework)
- **URL:** https://www.anthropic.com/engineering/building-effective-agents
- **Workflows vs Agents:** workflows = LLMs/tools orchestrated through *predefined code paths* (predictable); agents = LLM *dynamically directs its own process/tools* (flexible). Trade predictability for flexibility.
- **Augmented LLM** = LLM + retrieval + tools + memory = the base building block. Give it a clean, well-documented interface (MCP one option).
- **5 workflow patterns (with diagram shapes):** (1) **Prompt Chaining** (linear, gated steps); (2) **Routing** (classify → specialized path/model; e.g. cheap model for easy, capable for hard); (3) **Parallelization** — *sectioning* (independent subtasks) + *voting* (same task N× for confidence); (4) **Orchestrator-Workers** (lead LLM decides subtasks at runtime — not pre-defined; for multi-file code changes); (5) **Evaluator-Optimizer** (generate→critique→refine loop when criteria are clear).
- **Agents = "just LLMs using tools based on environmental feedback in a loop."** Use for open-ended, unpredictable-step problems in trusted, sandboxed environments; higher cost + compounding-error risk.
- **Tool/ACI design** (agent-computer interface, treat like HCI): give room to think, match formats to training-data shapes, remove formatting overhead, write params like "a docstring for a junior dev," apply **poka-yoke** (mistake-proof arg shapes), test empirically. Anthropic spent *more* time on tools than the prompt.
- **Keep-it-simple / anti-patterns:** find the simplest thing that works, add complexity only when measured to help; frameworks (LangGraph et al.) hide the prompt/response and cause "incorrect assumptions about what's under the hood" — start with direct API calls. Three principles: simplicity, transparency (show planning steps), well-tested ACI.

### B2. How We Built Our Multi-Agent Research System — Anthropic
- **URL:** https://www.anthropic.com/engineering/built-multi-agent-research-system
- **Architecture:** lead-agent/subagent orchestrator-worker; lead plans + spawns parallel subagents (each own context window, own tools/prompt), acts as "intelligent filter" synthesizing condensed findings. Dynamic multi-step search ≠ static-chunk RAG.
- **When multi-agent wins (+90.2% vs single Opus on internal eval):** breadth-first, parallelizable, info exceeds one context window, many complex tools. **When it loses:** shared-context / tight-inter-dependency tasks, most coding.
- **Token economics (design budget!):** agents ≈ 4× chat tokens; multi-agent ≈ 15×. Token usage explains ~80% of eval-score variance. Embedded scaling rule: simple fact = 1 agent/3-10 calls; comparison = 2-4 subagents/10-15 calls; complex = 10+ subagents with divided responsibilities.
- **Prompt-for-agents rules:** explicit delegation (objective/format/tools/boundaries — vague → duplicated work); effort-scaling rules; teach tool-selection heuristics; agents-as-prompt-engineers (auto-rewrote a tool description → **40% faster** task completion); broad→narrow search; extended thinking as scratchpad; parallel tool calls (up to −90% research time).
- **Eval:** start with ~20 queries (large early effect sizes); LLM-as-judge single 0–1 score on a rubric (accuracy, citations, completeness, source quality, tool efficiency) + human eval for edge cases/source-bias.
- **Production reality:** long-running stateful agents → resume-from-failure + checkpoints + retries; full decision tracing; **rainbow deployments** (don't disrupt in-flight agents); >200K context truncates → persist plan to external memory; long horizons → summarize phases + handoff to fresh subagents. "The last mile is most of the journey — errors compound."

### B3. Effective Context Engineering for AI Agents — Anthropic
- **URL:** https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- **Context engineering ⊃ prompt engineering:** prompt = writing instructions for one task; context engineering = curating the optimal token set *every turn* across system prompt, tools, MCP, external data, history — iterative.
- **"Right altitude":** between brittle hardcoded logic (too low) and vague guidance (too high) — "minimal set of information that fully outlines expected behavior"; start minimal, add only on observed failures.
- **Context rot:** recall accuracy degrades as tokens grow (gradient, not cliff) — attention has n² pairwise relations + fewer long-range params. Treat context as a finite resource.
- **Techniques:** **compaction** (summarize near limit; keep architectural decisions/unresolved bugs, drop redundant tool output — maximize recall then precision); **tool-result clearing** (safest compaction); **sub-agent isolation** (subagent burns 10Ks of tokens, returns ~1-2K summary); **just-in-time retrieval** (lightweight identifiers → load on demand); **structured note-taking** (persistent memory outside context); structured system prompts (XML/markdown sections); few-shot with diverse canonical examples (not edge-case laundry list).
- **Tool rules:** self-contained, unambiguous, minimal overlap — "if a human engineer can't say which tool to use, neither can the agent."

### B4. 12-Factor Agents — humanlayer
- **URL:** https://github.com/humanlayer/12-factor-agents — **License: code Apache-2.0, content CC BY-SA 4.0.**
- **The 12 factors:** 1 NL→tool calls · 2 Own your prompts · 3 Own your context window · 4 Tools are structured outputs · 5 Unify execution state & business state · 6 Launch/pause/resume with simple APIs · 7 Contact humans with tool calls · 8 Own your control flow · 9 Compact errors into context · 10 Small focused agents · 11 Trigger from anywhere / meet users where they are · 12 **Make your agent a stateless reducer** ((state,event)→state). — A production-reliability manifesto; the "stateless reducer" + "own your control flow" framing is the load-bearing architectural stance.

### B5. Agent Memory taxonomy + State of Context Engineering 2026 — Aurimas Griciūnas (SwirlAI)
- **URLs:** https://www.newsletter.swirlai.com/p/memory-in-agent-systems · https://www.newsletter.swirlai.com/p/state-of-context-engineering-in-2026 · thread https://x.com/Aurimas_Gr/status/1973742212186882107
- **Memory taxonomy (CoALA-grounded):** short-term/working = the current-turn context window; long-term = **Episodic** (past interactions, vector-stored, retrieved semantically — "RAG over the agent's own actions"), **Semantic** (external knowledge + self-identity), **Procedural** (system prompt, tools, guardrails, topology — codified in Git/registries, not runtime-retrieved). Pattern: store→embed→retrieve-on-demand→inject into working memory.
- **5 context-management patterns (each with accuracy/latency/token/maintainability trade-off):** (1) **Progressive Disclosure / Agent Skills** (tiered: ~80-token discovery → 275-8K activation → execution; Markdown+YAML skill files; degrades past ~100 skills); (2) **Context Compression** (top-N / sliding-window+summarize / long-term-store; Manus refinements: keep recent tool calls raw + preserve error traces); (3) **Context Routing** (LLM / hierarchical / rule-based / hybrid classify-before-window); (4) **Retrieval Evolution** (Agentic RAG → Graph RAG → Self-RAG, with over-retrieval guardrails); (5) **Tool/Capability Management** (schemas cost 500+ tokens each, 90+ tools → 50K tokens; OpenAI: <20 tools, degrades past 10; don't mutate tools mid-run — invalidates KV cache).
- **Layered architecture:** definition (disclosure + tools) → execution (routing + compression) → knowledge (retrieval) → evaluation.

### B6. Choosing the right multi-agent architecture — LangChain
- **URL:** https://x.com/LangChain/status/2011527733176856671 (→ LangChain blog, with benchmarks)
- **Decision rule: start single-agent; when you need multi-agent, pick the pattern:** **Subagents** (centralized orchestration across domains) · **Skills** (progressive disclosure, load capabilities on demand) · **Handoffs** (sequential workflows w/ state transitions) · **Router** (parallel dispatch to specialists). Includes performance benchmarks per pattern.

### B7. Agentic workflow patterns / Agent Harness threads (bookmark archive)
- **@_avichawla "A harnessed LLM agent"** — https://x.com/_avichawla/status/2062082282878627946 — thesis: the real architecture *inverts* "model + tools bolted on"; the model is deliberately **thin**, intelligence pushed outward into the **harness** which composes it at runtime. Three dimensions orbit the harness core: **Memory** (state the model shouldn't carry — working/semantic/episodic), Model, Tools.
- **@ghumare64 "cleanest architectural piece"** — https://x.com/ghumare64/status/2064360751788114204 — agentic backend = 4 separate workers **harness · context-manager · session-manager · llm-router**; no integration code between them — each runs on the same engine (queue, state, pubsub, observability, HTTP, sandbox, cron). "Add a worker, get the whole system." (Clean/ports-and-adapters applied to agent backends.)
- **@Aurimas_Gr "Agentic System Workflow Patterns"** — https://x.com/Aurimas_Gr/status/2003116206782402769 — in enterprise settings the *simplest* Anthropic workflow patterns deliver the most value; start simple.
- **@Saboo_Shubham_ "Agentic Design Patterns 101"** — https://x.com/Saboo_Shubham_/status/2007520607358071032 — 8 patterns w/ Google ADK, starting Sequential Pipeline (A→B→C, one job each, predictable/debuggable).
- **@Sumanth_077 ROMA** — https://x.com/Sumanth_077/status/2007085363630575856 — meta-agent framework, recursive hierarchical task decomposition (decompose → subagents → aggregate upward).
- **@ashpreetbedi "The Rise of the Agent OS"** — https://x.com/ashpreetbedi/status/1967270918138351634 — network of agents/teams/workflows with shared memory + MCP as the "proxy layer" for tool access.
- **@pontusab "50+ tool AI assistant, Vercel AI SDK v5"** — https://x.com/pontusab/status/1973703315096846608 — **domain-driven tool organization**, dynamic routing via activeTools + prepareStep, explicit dependency management. (DDD applied to agent tools.)
- **@rohanpaul_ai "Google context-engineering guide for multi-agent"** — https://x.com/rohanpaul_ai/status/1997405403987222642 — replaces giant prompts with a **compiled view over state** split into Working Context / Session / Memory / Artifacts; every call rebuilds Working Context.
- **@rohanpaul_ai "65-page agent-adaptation taxonomy"** (Stanford/Princeton/Harvard) — https://x.com/rohanpaul_ai/status/1998904144393068729 — nearly all advanced agent systems = 4 basic ways to adapt (update the agent, or update its tools); first full taxonomy of agentic adaptation.
- **@jiqizhixin "Google agentic scaling law / the 45% trap"** — https://x.com/jiqizhixin/status/1999030820296863814 — 180 experiments across GPT/Gemini/Claude: if a single agent's per-step error >45%, more agents don't help — a concrete decomposition threshold.

### B8. Agentic Design Patterns (424-page book) — Antonio Gulli / senior Google engineer
- **URLs:** https://x.com/aaditsh/status/1974900178957259012 · https://x.com/_rohit_tiwari_/status/1964303138740982100 (bm ~10k / ~2k)
- Free code-backed "curriculum" (~400+ pages) covering: prompt chaining, routing, parallelization, reflection, planning, tool use, **multi-agent coordination, memory management**, MCP, guardrails, reasoning. A structural reference for how to *organize* an agentic-patterns catalog.

---

# C — [core/agentic] RAG & LLM-application architecture taxonomy

### C1. RAG technique catalog — NirDiamant/RAG_Techniques
- **URL:** https://github.com/NirDiamant/RAG_Techniques — **License: MIT** (~29k stars). The densest RAG-vocabulary reference.
- **Foundational:** Basic · Reliable · Chunk-size optimization · Proposition chunking · CSV/JSON RAG. **Query enhancement:** Query transformations · **HyDE** (embed a hypothetical answer) · HyPE (precompute per-chunk questions). **Enrichment:** Contextual chunk headers · Relevant-segment extraction · Semantic chunking · Contextual compression · Document augmentation. **Advanced retrieval:** **Fusion** (BM25+vector) · Reranking (cross-encoder/LLM) · Multi-faceted filtering · **Hierarchical indices** · Dartboard (info-gain) · Multi-modal. **Iterative/adaptive:** Feedback loops · Adaptive retrieval. **Advanced architectures:** **Agentic RAG · Graph RAG (LangChain / MS community-detection / Milvus) · RAPTOR (recursive cluster-summarize tree) · Self-RAG · Corrective RAG (CRAG, web-search fallback) · Local Graph RAG.**

### C2. athina-ai/rag-cookbooks — one notebook per architecture
- **URL:** https://github.com/athina-ai/rag-cookbooks — **License: MIT.**
- **Advanced (non-agentic):** Naive · Hybrid (dense+BM25) · HyDE · **Parent-Document Retriever** (match small, return parent) · **RAG Fusion** (multi-query + Reciprocal Rank Fusion) · Contextual · **Rewrite-Retrieve-Read** · Unstructured/multimodal. **Agentic:** Basic Agentic · **Corrective (CRAG)** · Self · Adaptive · ReAct RAG.
- Cross-check with C1 reveals the taxonomy's two orthogonal axes: **retrieval patterns** (Hyde/Fusion/Corrective/Self/Adaptive) vs **indexing-structure innovations** (RAPTOR, GraphRAG).

### C3. Weaviate — Agentic RAG (single vs multi-agent)
- **URL:** https://weaviate.io/blog/what-is-agentic-rag
- Vanilla RAG = fixed pipeline; **Agentic RAG** inserts an agent that reasons about retrieval: decide *whether* to retrieve, *which* source, rewrite the query, *evaluate* and re-retrieve — loop **retrieve→evaluate→re-retrieve→validate→generate** on a **ReAct** (Thought→Action→Observation) control loop.
- **Single-agent / Router:** one agent picks among ≥2 sources itself. **Multi-agent / Coordinator:** master routes to specialist retrieval agents (internal data / personal accounts / web) and aggregates. **Rule:** router for few/simple sources; coordinator when sources are heterogeneous (auth/format/latency differ).

### C4. Weaviate — Six pillars of context engineering
- **URL:** https://weaviate.io/blog/context-engineering
- **6 pillars (checklist for a context-engineering section):** Agents (orchestration) · Query Augmentation (reshape query per consumer) · Retrieval (chunk-size tension) · Prompting (CoT/ReAct as hallucination-control layers) · Memory (short=window, long=vector store; actively filter/prune) · Tools (hard part = orchestration/selection; MCP the standardizer).

### C5. Production RAG hard-won lessons — Jerry Liu / LlamaIndex
- **URLs:** https://developers.llamaindex.ai/python/framework/optimizing/production_rag/ · threads https://x.com/jerryjliu0/status/1940500707494580698 · https://x.com/jerryjliu0/status/2000677592559706396
- **Decouple retrieval chunks from synthesis chunks** (embed summaries/sentences that link to a larger context window — retrieve precise, synthesize rich; beats "lost in the middle"). **Structured retrieval at scale (100+ docs):** metadata-filter auto-retrieval (simpler, recall-limited) vs document-hierarchy + recursive retrieval (precise, expensive upfront summaries). **Task-dependent retrieval:** routers/data-agents pick strategy per query (lookup vs summarize vs compare). **Embedding fine-tuning** (label-free, synthetic queries). Table stakes: chunk-size tuning, MMR (cut redundancy), access-control at the data-connector layer. "RAG 2.0" thesis: virtualize the filesystem (AgentFS), parse unstructured docs, let the agent run over files like Claude Code.

### C6. RAG evaluation metrics — RAGAS
- **URL:** https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/
- **Retrieval quality:** Context Precision (relevant chunks ranked high) · Context Recall (retrieved context covers the ground truth). **Generation quality:** Faithfulness (answer grounded in retrieved context, not hallucinated) · Answer Relevancy (answers the actual question). Extended: Context Entities Recall · Noise Sensitivity · Multimodal Faithfulness/Relevance.
- **Diagnostic rule:** low precision/recall → fix retrieval (chunking/embeddings/reranking/hybrid); low faithfulness/relevancy with good context → fix generation (prompt constraints, grounding, synthesis model).

### C7. RAG-architecture summary threads (bookmark archive quick-refs)
- **@victorialslocum "7 RAG architectures"** — https://x.com/victorialslocum/status/1904504036369543434 — Naive → (7 variants).
- **@ordax "RAG Architectures"** — https://x.com/ordax/status/1883232564737102299 — Reranker · Multimodal · Graph · Hybrid · Agentic (clean 5-way summary diagram).
- **@techNmak "RAG has evolved"** — https://x.com/techNmak/status/1997174041690423462 — categories by the problem each solves (accuracy/latency/compliance/context).
- **@TheTuringPost "12 new advanced RAG types"** — https://x.com/TheTuringPost/status/2007792632685314557 — bleeding-edge research variants (MiA-RAG, hypergraph-memory, Graph-O1, etc.) — a "what's next" pointer.
- **@femke_plantinga "Agentic RAG for production framework"** — https://x.com/femke_plantinga/status/2016088819531915464 — moving past chatbots to agentic RAG.

---

# D — [agentic] X long-form Articles (bookmark archive — UNIQUE to this channel)

These are native X long-form articles from the bookmark archive, extracted via `xrelay article` and distilled in `reports/x-4.md` (full detail there). They are the most current (2026) primary material on **agent-harness architecture** — a topic no textbook covers yet. Collectively they converge on a thesis: **Agent = thin Model + thick Harness**, and the *harness* (context management, filesystem-as-memory, tool/loop design, sub-agent orchestration) is where architecture decisions live.

### D1. The Anatomy of an Agent Harness — Viv (@Vtrivedy10)
- **URL:** https://x.com/Vtrivedy10/status/2031408954517971368
- **Agent = Model + Harness.** Harness = everything that isn't the model: system prompts, tools/skills/MCPs, bundled infra (filesystem, sandbox, browser), orchestration (subagent spawning, handoffs, model routing), hooks/middleware. Derive each component from a model limitation: **filesystem** (durable state models can't hold in context) · **bash/code exec** (general escape hatch so the model builds its own tools) · **sandboxes** (isolated self-verification loops) · **memory+search** (AGENTS.md continual learning; web search for cutoffs) · **context-rot countermeasures** (compaction, tool-call offloading keeping head+tail, Skills progressive disclosure) · **long-horizon** (git + the **Ralph Loop**: hook intercepts exit, reinjects prompt into clean context, filesystem carries state).
- **Model/harness co-evolution:** production agents are post-trained *with* their harness (overfits to tool conventions); Terminal Bench 2.0 shows the same model swings Top-30→Top-5 on harness change alone.

### D2. Agent Harness is the Real Product — Himanshu (@himanshutwtxs)
- **URL:** https://x.com/himanshutwtxs/status/2028116431876116660
- **Same model, huge deltas from harness:** Opus 4.5 42%→78% on CORE-Bench across two scaffolds; Vercel deleted 80% of an agent's tools → failing→succeeding (145K→67K tokens, 100→19 steps, 724s→141s).
- **Universal core loop:** `while(model returns tool calls){ execute → capture → append → call again }` — all differentiation is what surrounds it.
- **Per-company harness architectures (reusable comparison table):** **Claude Code** (flat message list, ~18 primitive tools, primitives-over-integrations, regex over vector DB, 6-layer context stack, **system-reminder injection** > system-prompt-only, TodoWrite as a deliberate **no-op "progress anchor"**) · **Cursor** (files as primitive, per-model tuning, trained semantic-search on session traces, lazy MCP loading −46.9% tokens) · **Manus** (KV-cache above all: never mutate tools mid-run, **logit masking** over 29 always-loaded tools, **hierarchical action space** L1 atomic/L2 bash utils/L3 dynamic scripts, gains came from *removing*) · **SWE-Agent/ACI** (linter-gated edits, observation compression) · **Devin** (cloud VMs, Playbooks, KMS) · **Windsurf** (background planner + foreground actor) · **Aider** (PageRank repo map via tree-sitter) · **Replit** (1→3 agents Manager/Editor/Verifier).
- **Cross-cutting consensus:** flat loop > complex DAG · filesystem as memory · preserve errors · fake planning tools for coherence · primitives over integrations. **Disagreements:** logit-masking vs lazy-loading; how much the harness should manage (Google's 2M-window "give it everything" vs everyone else's active-filter harnesses). **Rule cited:** past ~40% of input capacity you enter the "dumb zone." **Trend:** best teams keep *simplifying* the harness.

### D3. Agent Harness Architectures — Aparna Dhinakaran (@aparnadhinak, Arize)
- **URL:** https://x.com/aparnadhinak/status/2016915570503938452
- **Filesystem + Unix commands = emerging standard for agent memory** — makes fixed context feel infinite (explicit analogy to the 1980s CPU memory-hierarchy: cache/RAM/virtual memory). Unix chosen for composability (pipeable) + zero tool-def overhead (LLM already knows it).
- **Dynamic indexing (named pattern):** `ls/find/grep` streamed stdout = an ephemeral query→location index built at runtime, not precomputed — "building indexes in the context window." **Hierarchical dynamic indexing:** truncated-preview table (keep every column, drop rows) + fetch-by-ID + paging tools = progressive fidelity for rows bigger than the window.
- **Eval design (reusable):** 10K files, one contains AU addresses, count postal codes — compares how Claude Code / Cursor approach large-context; observed dynamic self-correction (context-window-aware backtracking).

### D4. Effective Agent Design — Lance Martin (@RLanceMartin, LangChain)
- **URL:** https://x.com/RLanceMartin/status/2009683038272401719
- **7 context-management patterns:** (1) **Give agents a computer** (filesystem + shell); (2) **Multi-layer action space** (few bound tools + push actions to compute layer; **CodeAct** — chain actions via code to save tokens; GitHub MCP 35 tools = 26K tokens as the anti-example); (3) **Progressive disclosure** (index tools, retrieve on demand — langgraph-bigtool, Agent Skills frontmatter); (4) **Offload context** (write trajectories to FS, summarize only at diminishing returns); (5) **Cache context** (Manus: "cache hit rate = most important production metric"; caching can beat a cheaper model); (6) **Isolate via sub-agents** (map-reduce; **Ralph Wiggum loop** via git history); (7) **Evolve context** (continual learning in *token* space not weights — Letta, GEPA, distill sessions → CLAUDE.md).
- **Open challenges:** learned context management (Bitter Lesson may displace hand-crafted heuristics); multi-agent coordination (Cognition's "don't build multi-agents"; Yegge's "Gas Town" mayor+merge-queue); no standard for agent observability/HITL.

### D5. Securing Agents in Production (Agentic Runtime) — Palantir (@PalantirTech) `[border: security]`
- **URL:** https://x.com/PalantirTech/status/2014360213692854657
- **5 security dimensions (checklist):** (1) secure/resilient access to the reasoning core; (2) insulated orchestration of executors; (3) granular policy across all memory forms; (4) governed multimodal-tool access; (5) real-time observability + post-hoc audit.
- **Agent def:** "a stateful control loop that repeatedly invokes a stateless reasoning core… until termination." **Runtime = Rubix (hardened K8s):** every workload isolated, all interaction authn+authz+logged; **ephemerality as a hard constraint** (nodes ≤48h forces resilient-by-construction design); tens of thousands of concurrent orchestrations.
- **Agent permission = composition of 3 identities:** owner + agent service-user/SDK scope + the user it currently acts on-behalf-of (authz enforced down to *visibility of the audit trail*).
- **4 memory types with distinct governance** (working/episodic/semantic/procedural) served through ONE substrate (the Ontology) — uniformity mitigates prompt-injection attack-surface fragmentation. **Provenance-based security (flagship):** authz resolved at the *whole call-chain* level at runtime AND compile-time (can't publish a tool version violating provenance) — nesting can't leak marked data downstream. **3 tool categories:** data / logic / action-oriented.

### D6. Towards a Disaggregated Agent Filesystem on Object Storage — Pekka Enberg (@penberg) `[agentic]+[core]`
- **URL:** https://x.com/penberg/status/2010360708253274513
- **AgentFS** stores an agent's entire runtime (files, KV state, tool-call audit log) in one SQLite file, 3 interfaces (POSIX filesystem / KV / append-only toolcall audit). Classic inode/dentry design in SQLite tables; **whiteout mechanism** for overlay deletes (copy-on-write, reused from OverlayFS). FUSE/NFS mount → unmodified git/grep/ffmpeg work.
- **Disaggregation at the database level via SQLite WAL:** Turso pushes local WAL mutations as *logical* ops, pulls remote as *physical* pages; object store = source of truth → local-disk-speed reads/writes + async cloud durability + automatic cross-agent conflict resolution + **time-travel/branching** (WAL captures every mutation). Named open problems: single-writer bottleneck, checkpoint overhead, 4KB-page write amplification, large blobs.

### D7. How to Build a Context Graph — Animesh Koratana (@akoratana, PlayerZero) `[agentic]`
- **URL:** https://x.com/akoratana/status/2005303231660867619
- **"Two Clocks Problem" (named framework):** every system has a *state clock* (what's true now — easy, DB overwrites) and an *event clock* (what happened, in what order, *why* — hard; the reasoning lived in Slack/heads, never captured as data). Most infra was built only for the state clock.
- **Schema as OUTPUT not input:** no universal ontology exists, so let **agents as informed walkers** discover it live (a trajectory is an implicit ontology map). Use **structural embeddings** (node2vec — "these entities play similar roles") not semantic embeddings ("these mean similar things"); local walks → homophily, global walks → structural equivalence. **Context graph = world model:** must encode dynamics/structure and enable *simulation*. **Litmus test:** "if your context graph can't answer 'what if,' it's just a search index." Reframes continual learning as expanding the *world model the fixed model reasons over*, not updating weights.

### D8. Introducing Universal Context — Alexander Christie (@byteofbits, Attio) `[agentic]+[core: data]`
- **URL:** https://x.com/byteofbits/status/2019447660864807345
- **Thesis:** agentic workloads (tens of thousands of concurrent agents) massively raise conflict risk that legacy CRM/data architectures never handled. **Critique of bolt-on vector DBs:** a Pinecone replica of the source-of-truth introduces **delayed replication** — agents reconcile structured queries with unstructured recall across two out-of-sync systems (a **Consistency** problem in DB terms).
- **Answer — External Consistency:** embeddings guaranteed exactly in sync at *write time* (not async indexing), exposed via MCP so agents in *other* platforms (ChatGPT/Claude Code) get the same guarantee → real-time cross-platform collaborative consistency on one source of truth. Built on **Particle** (graph-relational format) + semantic + full-text. "**Schema as context**" — not just data access but a consistent *shape* to reason about. **App SDK** = a TypeScript sandbox designed as an AI "compilation target" (npm ecosystem, autonomous build/test/deploy) vs Salesforce Apex lock-in.

### D9. The File System Is the New Database — Muratcan Koylan (@koylanai) `[agentic]`
- **URL:** https://x.com/koylanai/status/2025286163641118915 (bm ~18k)
- **"Personal Brain OS"** — file-based agent OS in a Git repo, 80+ files, zero DB/vector-store. **Attention Budget principle:** split into **11 isolated modules** so a content task never loads network data. **Explicit 3-level progressive disclosure:** L1 always-loaded routing `SKILL.md` → L2 module instruction files (40-100 lines) → L3 data (JSONL/YAML), **max two hops** to any info. **Instruction hierarchy** (repo `CLAUDE.md` → `AGENT.md` decision table → module files) eliminates single-system-prompt rule conflicts.
- **File-format→function rules:** JSONL for logs (append-only = safety mechanism; lost 3 months to a JSON overwrite; delete via `status:archived`; schema line per file) · YAML for config · Markdown for narrative. **Episodic memory stores judgment not facts** (experiences/decisions/failures logs). **Flat-file relational model** (join via `contact_id`). **Anti-patterns checklist:** over-engineered empty-field schemas confuse agents; front-load critical rules in first ~100 lines; module boundaries ARE loading decisions (splitting cut voice-task tokens 40%).

### D10. Custom Agent Framework / The Agent Stack Powering OpenClaw — nader dabit (@dabit3) `[agentic]`
- **URL:** https://x.com/dabit3/status/2023986942300627132
- **4-layer stack:** **pi-ai** (unified multi-provider LLM interface, 2000+ models, one normalized streaming event contract — switch provider in one line) → **pi-agent-core** (`Agent` tool-loop; tools return `{content→LLM, details→UI-only}`; **steer()** interrupts mid-execution vs **followUp()** queues after stop) → **pi-coding-agent** (built-in tools, **JSONL session tree** with `id`+`parentId` for branching, compaction that offloads-but-doesn't-destroy, **extensions** that modify agent behavior invisibly to the model, tool factories for sandboxing/workspace-scoping) → **pi-tui** (differential-render terminal UI). **Production patterns:** multi-provider `AuthStorage` (API key / env / `!shell-cmd` / OAuth auto-refresh), stream middleware for per-provider headers/cache flags, one event stream → many front-ends (CLI/Telegram/Discord/Slack). Explicit contrast with monolithic agent frameworks (compose layers, no lock-in).

### D11. Quarq Agent (open-sourced) — QuarqLabs (@quarqlabs) `[agentic]`
- **URL:** https://x.com/quarqlabs/status/2059320863070286177 — (repo archived; research reference)
- **4-layer memory-first architecture:** **Query** (expand question into multiple **search hypotheses** across vector+keyword indices in parallel, merge/rank — hybrid beat either alone) → **Storage** (typed: semantic/episodic/procedural, FAISS+JSON) → **Reasoning** (anti-hallucination constraints applied post-retrieval: temporal event-vs-record-date, numeric attribution, entity isolation, "if evidence incomplete, search again before answering") → **Learning** (async background model create/update/deletes memories, off the response path). **5 design principles:** retrieve broadly/reason narrowly · evidence beats confidence · time is first-class · learning must not add latency · context is a resource.

### D12. The Longform Guide to Everything Claude Code — cogsec (@affaan) `[border: tooling]` (architectural bits only)
- **URL:** https://x.com/affaan/status/2014040193557471352 (bm ~2k)
- **Hook-based cross-session memory pipeline:** SessionStart (load prior context) → PreCompact (save state before summarization destroys it) → Stop (persist learnings to `~/.claude/sessions/`). **Instruction-authority ladder:** `--system-prompt` injection > `@file`/`.claude/rules/` (tool-output authority). **Sub-agent context-gap problem** + iterative-retrieval fix (orchestrator passes query *and* objective, evaluates returns, ≤3 follow-up cycles). **Sequential 5-phase orchestration:** Research→Plan→Implement→Review→Verify, one input/one output per agent, files-as-interchange, `/clear` between agents. **Eval architecture:** pass@k vs pass^k (consistency), 3 grader types, checkpoint vs continuous evals. **Model tiering** (Haiku/Sonnet/Opus cost ratios as an architecture-of-cost decision). **Modular-monolith/DDD layout** (apps/ → modules/{api,domain,infra,use-cases} → shared/) framed as a *token-economics* decision. Git worktrees for parallelism (cap 2-4).

### D13. How to Simulate Like a Quant Desk — gemchanger (@gemchange_ltd) `[out]`
- Monte Carlo / prediction-market modeling — not system architecture. Recorded to close the loop; routed out.

---

# E — [border] / [out] notes

- **AgentAuth — auth for AI agents** (@KaranVaidya6, https://x.com/KaranVaidya6/status/1861037496295137314) — `[border: security ↔ agentic]` — OAuth/API-key/permission management designed for agents (traditional auth wasn't built for agent delegation). Relevant to the auth/authz-model portion of security architecture *for agentic systems*.
- **Securing Agents in Production (Palantir)** — see D-section — `[border: security]` agentic runtime + threat model.
- **AGENTS.md spec** (@DavidOndrej1 → https://agents.md/) — `[border: agentic ↔ handoff]` — the emerging cross-tool convention file; procedural-memory artifact.
- **Spec-driven development for AI coding** (@GithubProjects, https://x.com/GithubProjects/status/2032464246286725588) — `[border: product/handoff]`.
- **`[out]` routed away:** model/product launches (Qwen/LongCat/Kimi/DeepSeek), vibe-coding tool drops (v0, Cursor tricks), design-linting (Impeccable), scraping tools, "Personal Brand OS" content-workflow posts — high engagement, no architecture substance. DESIGN.md/Stitch → design skill. Quant-desk simulation → out.

---

# Top finds (shortlist)

1. **Anthropic trio** — Building Effective Agents + Multi-Agent Research System + Effective Context Engineering (B1-B3): the spine of the `[agentic]` scope — patterns, token budgets, production reliability, context-as-resource.
2. **12-Factor Agents** (B4) — the reliability manifesto; "stateless reducer / own your control flow" is the architectural stance.
3. **SwirlAI memory + context-engineering** (B5) — the cleanest agent-memory taxonomy (episodic/semantic/procedural) + 5 named context-management patterns with trade-off profiles.
4. **Fowler microservices + Monolith-First + Richardson pattern catalog** (A5-A7) — the canonical `[core]` decomposition + when-not-to rule + named-pattern vocabulary (Saga, CQRS, Strangler, BFF…).
5. **C4 + arc42** (A3-A4) — the two diagram/documentation notations the skill should standardize on.
6. **RAG taxonomies** (C1-C2, RAGAS C6) — the full RAG-variant vocabulary + the eval-metric diagnostic quadrant.
7. **Agent-harness architecture articles** (D1-D6, unique to this channel) — the thin-model/thick-harness thesis, per-company harness breakdowns (Claude Code / Cursor / Manus / Devin / Aider), filesystem-as-memory + Unix-as-dynamic-index, Palantir's 5-dimension agent-security model, Enberg's disaggregated agent filesystem. Current 2026 primary material no textbook has — the highest-value payload of this channel.
8. **Multi-agent decision rules** — LangChain pattern picker (B6) + the "45% error" decomposition threshold (B7) + Anthropic's 15×-token / when-multi-agent-wins rule (B2).

# Open gaps

- **Classic mobile architecture** (iOS Swift MVVM/TCA/Clean, Android) — archive near-empty; needs GitHub/web channel.
- **ADR practice** (templates, MADR, Nygard format), **STRIDE threat modeling**, **DB schema/normalization/data modeling as craft** — archive noisy; canonical sources must come from elsewhere.
- **Event-driven / CQRS / event-sourcing deep material** (beyond the pattern names in A6) — thin here; the archive names them but doesn't go deep.
- **Cost & capacity modeling, performance budgets as explicit numbers**, **API versioning/deprecation strategy**, **cross-surface frontend architecture (micro-frontends/module federation)** — only lightly touched.
- **Live X at scale** — not fully harvested (slow `--product Top` endpoint; partial batch discarded). A future serialized `batch` run left to completion would add fresh non-bookmarked voices (Arpit Bhayani, systemdesignone, and canonical architecture accounts).
