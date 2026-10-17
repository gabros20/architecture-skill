# Agentic / LLM-system architecture

Purpose: Shape the architecture of a system whose core behavior is an LLM or agent acting under
uncertainty — the harness it runs inside, the workflow-vs-agent decision, multi-agent topology,
context/memory design, RAG topology, and the eval gate and security model that make a
non-deterministic system's shape decidable, and who owns the runtime.

Read when:
- The system has an LLM or agent doing real work — deciding, calling tools, multi-step action — not
  a deterministic feature with a model call bolted on.
- A primary reference ([system-design.md](system-design.md), [decomposition.md](decomposition.md),
  [nfr-budgets.md](nfr-budgets.md), [security-architecture.md](security-architecture.md)) hits an
  agentic component needing deeper treatment, or the team weighs a managed agent runtime or voice
  platform.

Skip when:
- The request is eval/prompt/retrieval *implementation* — `ai`'s territory; this file owns the
  harness decision, eval threshold, and topology pick, not the code.
- The request is the product-level autonomy/UX decision (HITL level, escalation copy, capability
  tier) — `product`'s own `surface-agentic.md`; consume its capability/risk brief, don't re-derive.
- The model is decorative (fixed FAQ, no action) — route to
  [surface-web-saas.md](surface-web-saas.md).

Inputs: the job(s) the agent performs and its harness; any capability/risk brief from `product`'s
`surface-agentic.md` — state explicitly when none exists; existing eval/pilot evidence if any.

Produces: harness design; workflow-vs-agent decision; multi-agent go/no-go (§3); RAG-topology pick +
eval quadrant; memory-tier design; eval-as-acceptance-criteria gate; agent-security model;
runtime build-vs-buy and lifecycle-ownership decision (§10).

## Contents
1 Thin/thick-harness thesis · 2 Workflow-vs-agent patterns · 3 When multi-agent is worth it ·
4 Context engineering · 5 Memory tiers · 6 12-Factor Agents · 7 RAG topology and eval ·
8 Eval-as-acceptance-criteria · 9 Agent security · 10 Runtime ownership

## 1. Thin-model / thick-harness thesis

**Agent = Model + Harness** (Viv, "The Anatomy of an Agent Harness," x.com/Vtrivedy10). The harness
is everything else: prompts, tools/skills/MCPs, bundled infra (filesystem, sandbox, browser),
orchestration, hooks. **Architecture decisions live in the harness** — derive each component from a
specific model limitation, never speculatively:

| Model limitation | Harness component |
|---|---|
| No durable state across turns | Filesystem-as-memory |
| Can't self-verify its own output | Sandbox / code execution |
| Fixed training cutoff | Web/tool search |
| Context rot at scale (§4) | Compaction, tool-result offload, progressive disclosure |
| No cross-session learning | AGENTS.md / procedural memory (§5) |

Same-model, different-harness deltas prove this: Opus 4.5 went 42%→78% on CORE-Bench across two
harnesses; Vercel deleted 80% of an agent's tools and it went from failing to succeeding (145K→67K
tokens, 100→19 steps) (Himanshu, "Agent Harness is the Real Product," x.com/himanshutwtxs). Every
harness runs the core loop `while (tool calls) { execute → capture → append → call again }`.
Consensus across Claude Code / Cursor / Manus / Devin: flat loop over
complex DAG, filesystem as memory, errors kept in context, primitives over pre-built integrations,
and keep *simplifying*.

## 2. Workflow vs agent — pattern selection

**Workflows** = LLMs/tools on predefined code paths (predictable, cheaper). **Agents** = an LLM
directs its own process and tool use (flexible, costlier, errors compound) (Anthropic, "Building
Effective Agents"). Default to a workflow; graduate to an agent only
when step count is unpredictable and the environment tolerates compounding error.

**5 workflow patterns:**

| Pattern | Shape | Use when |
|---|---|---|
| Prompt Chaining | linear, gated steps | the task decomposes into a fixed sequence with checkable gates |
| Routing | classify → specialized path/model | inputs cluster into distinct types needing different handling or cost tier |
| Parallelization | sectioning (independent subtasks) or voting (same task N×) | subtasks are independent, or a confidence vote is needed |
| Orchestrator-Workers | lead LLM decides subtasks at runtime | subtasks aren't knowable in advance (e.g. a multi-file code change) |
| Evaluator-Optimizer | generate → critique → refine loop | evaluation criteria are clear and iteration measurably improves output |

Google Cloud's 12-pattern matrix extends this to topologies
(cloud.google.com/architecture/choose-design-pattern-agentic-ai-system): **deterministic ordering**
→ Sequential/Parallel/Iterative-Refinement; **dynamic orchestration** →
Single-Agent/Coordinator/Hierarchical/Swarm; **iterative reasoning** → ReAct/Loop/Review-and-Critique;
**special-purpose** → Human-in-the-Loop/Custom-Logic. Start single-agent; graduate when measured.

**Deterministic core, model at the judgment points.** Scoring, routing, retries, and state
transitions are code; the model is called only for language or judgment, behind a golden set
tracking abstention and drift, with a no-model fallback that degrades rather than fails. Human,
scheduler, and agent drive one command surface (§1), and no tool hides a second agent
(12-Factor Factor 8, §6).

## 3. When multi-agent is worth it

Anthropic's "How We Built Our Multi-Agent Research System" gives decision data: a lead/subagent
orchestrator beat single-Opus by **+90.2%** on a breadth-first eval — but a single agent's tokens run
~4× a chat turn's, multi-agent ~**15×**. **Token usage
explains ~80% of eval-score variance** — cost is the dominant lever, not incidental.

| Signal | Multi-agent wins | Single agent wins |
|---|---|---|
| Task shape | Breadth-first, parallelizable, info exceeds one context window | Shared-context, tightly interdependent steps |
| Domain | Research, many independent tool calls | Most coding tasks |
| Per-step reliability | — | Per-step error rate **>45%** (Google/GPT/Gemini/Claude, 180 experiments) |

The **45% per-step-error threshold** is the sharpest gate: below it, decomposing into more agents
pays off; above it, fix the step first — stacking agents on a broken step multiplies the failure.
Scale effort to complexity: a simple fact 1 agent/3–10 calls; a comparison 2–4 subagents/10–15
calls; complex work 10+ subagents.

## 4. Context engineering as a design constraint

**Context rot**: recall degrades as tokens grow — a gradient, not a cliff (Anthropic, "Effective
Context Engineering for AI Agents"). Treat context as a **finite attention budget**: it bounds what
one agent/turn can own, and so the harness and topology decisions in §1–3.

Techniques, in order of first resort: **compaction** (summarize near the limit; keep architectural
decisions and unresolved bugs, drop redundant tool output); **tool-result clearing** (lowest-risk
compaction — evict stale outputs, keep the call); **sub-agent isolation** (a subagent burns 10Ks of
tokens, returns a 1–2K-token summary — also the mechanism behind §3's pattern); **just-in-time
retrieval** (load identifiers, fetch full content on demand); **structured note-taking** (persistent
memory outside the context window, not more tokens inside it).

Rule of thumb (Manus, via harness surveys): past **~40% of nominal input capacity** agents enter a
"dumb zone" — budget working context with headroom, not to the advertised window.

## 5. Agent memory tiers

CoALA-grounded taxonomy (SwirlAI, newsletter.swirlai.com/p/memory-in-agent-systems): three long-term
tiers, one pattern — **store → embed → retrieve-on-demand → inject** into working memory: **Episodic**
(past actions, vector-stored, retrieved semantically — "RAG over the agent's own history"),
**Semantic** (external knowledge plus self-identity facts), **Procedural** (system prompt, tools,
guardrails, topology; codified in git/registries, not retrieved at runtime).
Working memory is the turn's context window, not a fourth store. Palantir (§9) governs all four
through **one substrate**, so the prompt-injection surface isn't fragmented across stores.

## 6. 12-Factor Agents — the reliability stance

Two factors are load-bearing for architecture (humanlayer/12-factor-agents, CC-BY-SA-4.0 —
re-expressed, attribute if quoting directly): **Factor 8, own your control flow** — don't delegate
orchestration to an opaque framework that hides the prompt/response cycle. **Factor 12, make your
agent a stateless reducer** — `(state, event) → new_state` over explicit state, not hidden
accumulated context. Both point where §1 does: control belongs in code the team owns.

## 7. RAG topology and eval

Variant ladder, cheapest → most-capable (RAG_Techniques, athina-ai/rag-cookbooks, MIT; Weaviate
Agentic RAG): **Naive → Hybrid** (dense + BM25) **→ HyDE** (embed a hypothetical answer to guide
retrieval) **→ Corrective/CRAG** (self-grade retrieved docs, web-search fallback on a low grade)
**→ Self-RAG** (model refines its own queries) **→ Agentic RAG** (an agent decides whether/what/how
to retrieve, looping retrieve → evaluate → re-retrieve → generate). Climb only when the cheaper
stage's failure mode is *observed*.

**Two-stage retrieve-then-rerank is near-mandatory at scale**: over-retrieve ~5×, rerank with a
cross-encoder — "no reranking" is the most common cause of RAG hallucination (omer-metin,
llm-architect skill). Hybrid search combines dense + BM25 via
**Reciprocal Rank Fusion**, `score += 1/(k + rank + 1)`, `k=60`. Set an explicit relevance threshold
(~0.7) below which the system answers "I don't know" rather than answering ungrounded.

**RAGAS eval quadrant** (docs.ragas.io) — use as a diagnostic, not a report card:

| Metric | Measures | Low score → fix |
|---|---|---|
| Context precision | relevant chunks ranked high | reranking, retrieval ordering |
| Context recall | retrieved context covers the ground truth | chunking, embeddings, hybrid search |
| Faithfulness | answer grounded in retrieved context | prompt constraints, grounding instructions |
| Answer relevancy | answer addresses the actual question | synthesis-model prompt, query rewriting |

Low precision/recall is retrieval; low faithfulness/relevancy with good context is generation.

## 8. Eval-in-the-loop as acceptance criteria

A non-deterministic system is accepted only by a stated pass rate against a task set, so
architecture specifies the eval as a **release gate** (one layer down from `product`'s own
`surface-agentic.md` §3). Anthropic's multi-agent build starts evals at ~20
queries, scores with an LLM-as-judge rubric (accuracy, citations, completeness, source quality, tool
efficiency) plus human eval for judge bias, and gates on a **regression check** against the last
committed run.

State four things per gated capability: **task-set size/source** (real usage or pilot transcripts,
not invented cases), the **evaluator** (exact-match / LLM-as-judge / human review / tool-trace
check), the **pass threshold**, and the **regression gate** — the agentic system's contract the way
[contracts.md](contracts.md) is the deterministic one's. `ai` implements the harness and judge;
architecture owns which threshold gates a release.

## 9. Agent security

Palantir's production agent-runtime work ("Securing Agents in Production," x.com/PalantirTech)
gives 5 dimensions as a checklist: (1) secure/resilient access to the reasoning core; (2) insulated
orchestration of executors; (3) granular policy across all memory forms; (4) governed multimodal
tool access; (5) real-time observability plus post-hoc audit. **Provenance-based authorization**
resolves permission across the whole call chain, at runtime *and* publish-time — so a nested
sub-call cannot leak marked data through an intermediate agent that looks compliant alone. **Agent permission =
composition of 3 identities**: the owner, the agent's own service/SDK scope, and the user it's acting
for — authorize and audit against all three, never just the service credential.

Prompt injection via retrieved content is the concrete instance at the RAG layer (§7):
**XML-delimit untrusted content** so the model separates instruction from data structurally, not by
inferring from prose that a retrieved paragraph is untrusted.

**Action safety — enforce in the execution layer, never the prompt** (OWASP LLM06 *Excessive
Agency*, complete mediation: authorize in downstream systems, not the LLM). Each tool's contract
declares its effect class ([contracts.md](contracts.md) §5); one dispatcher enforces the gate
`product`'s capability/risk brief assigns per class, and `ai` implements it — with no brief, assume
external/irreversible and new tools need confirmation, and say so. An approval binds the exact
payload (hash, target, version, approver, time, expiry, one-use nonce); any edit voids it (CWE-367
TOCTOU). Refusals stop the action — never route around an auth challenge by switching driver,
account, or proxy. Fallback routes and adapter drift: [contracts.md](contracts.md) §5; credentials:
[security-architecture.md](security-architecture.md) §2.

## 10. Runtime ownership — build vs buy, thin clients, separate lifecycles

**Buying the harness is a data-contract decision.** Before committing to a managed agent service,
check per enabled feature: residency and regions, retention and ZDR eligibility, session and file
deletion, state export, beta status, and which are sold only on an enterprise tier. Buy when it removes measured operational work and passes this
check; self-host when its cost is below the hosted premium or a contract requires it. Dated examples
(vendor docs, 2026-10-17 — re-verify): OpenAI's Agents API is US-residency-only with no ZDR, even
with a self-hosted sandbox; Claude Managed Agents is beta and outside ZDR and HIPAA-BAA coverage;
LangSmith Managed Deep Agents is a US-only public beta. Bought or built, product records (tenancy,
approvals, action ledger, canonical preferences) and integration permissions stay in your system of
record ([data-architecture.md](data-architecture.md) §5), outside provider sessions. An EU-hosted
database does not make models, search, browser, memory extraction, telemetry, backups, or support
access EU-processed — run [security-architecture.md](security-architecture.md) §6 across the whole
flow.

**A voice platform is the same check plus one margin.** Components cost the same bought or built
(unbundle a bundled quote first), so the margin is the platform's orchestration fee: break-even is
minutes × (fee − self-hosting) against the build's engineering (derived; use your own quotes). The
check adds per-tier concurrency caps and a model menu the platform limits. Build sooner when
compliance is sales-gated or a priced add-on (Vapi: EU region Premier-only, organizations
single-region, HIPAA a paid add-on exclusive with zero retention — vendor docs, 2026-10-17,
re-verify), turn-taking must beat the platform's floor, or the language needs components it lacks.
Keep the exit cheap: your own numbers or SIP trunk, flows and prompts as data in your repository,
recordings and transcripts exported before any zero-retention mode (`operate` `observability.md`
"AI-system observability — same discipline, one new signal"). Components are `ai`'s
(`surface-voice.md` "Speech components: language, finalization, billing unit").

**Thin clients, server owns truth.** Every client speaks one versioned API and event contract
(conversation, run, event, artifact, approval — [contracts.md](contracts.md)); prompts, credentials,
policy, run state, and framework graph state stay server-side. Boundaries are
modules before services ([decomposition.md](decomposition.md)). Run engine, conversation/event
store, sandbox, and object storage keep **independent lifecycles** and reference each other (Cursor,
*What we've learned building cloud agents*, 2026). Architecture assigns ownership; the
implementation is `backend`'s `surface-agentic.md` "Run control: approvals, version pins, budgets,
linked lifecycles".

## Validation

- The harness names its context-management strategy (§4) — "a bigger context window" is not a design.
- Multi-agent, if chosen, is justified against §3's decision data, not assumed as more capable.
- The eval gate (§8) states task-set size/source, evaluator, pass threshold, and regression gate.
- The RAG topology (§7) names its rung and why a cheaper rung wasn't sufficient.
- The security model (§9) names its authz composition and the prompt-injection mitigation for every
  untrusted-content path, and each tool's effect class and where its gate is enforced.
- A bought runtime (§10) passes its data-contract check; product records stay outside provider
  sessions; a voice platform's decision states the fee margin, sales-gated features, and exit path.
- Component coverage — context management, retrieval, memory, tools/MCP, durable-execution owner,
  sandbox, approvals and action ledger, streaming/event contract, evals, guardrails,
  observability/cost: each states its decision or "N/A because …"; a silent gap fails.

## Failure modes and handoff

- **No capability or eval evidence exists yet** — say so; the first deliverable is a probe plan, not
  a committed architecture — same discipline as an unmeasured [nfr-budgets.md](nfr-budgets.md).
- **"Multi-agent sounds more capable"** — push back with §3's data; a single well-scoped agent under
  the 45% threshold usually wins on cost and reliability.
- **The harness treated as `backend`'s implementation detail** — it isn't: identical models swing
  30+ points purely from harness changes (§1); route it through this reference first.

<!-- grounding: Anthropic Building Effective Agents / Multi-Agent Research System / Effective
Context Engineering · Cursor cloud-agent lessons · managed-runtime vendor docs (dated) · Google
Cloud agentic design-pattern matrix · humanlayer/12-factor-agents (CC-BY-SA-4.0) · SwirlAI memory
taxonomy · RAG_Techniques + athina-ai/rag-cookbooks (MIT) · RAGAS ·
omer-metin llm-architect skill (Apache-2.0) · Palantir agent-runtime security · X long-form harness
articles (Vtrivedy10, himanshutwtxs) — see research/architecture/x-corpus.md §B, D. -->
