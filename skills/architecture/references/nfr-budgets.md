# NFR Budgets

Purpose: Turn the "-ilities" into quantified budgets and targets — performance, reliability,
scalability, and cost as numbers an implementer can build against and CI can enforce — instead of a
vague mandate to "make it scalable."

Read when:
- The request asks to set performance/latency/reliability targets, an SLO, a scaling plan, a
  capacity/cost estimate, or a Well-Architected review.
- A build skill (`frontend`/`backend`/`data`) needs a number to design against and none exists yet.
- The system is entering a load range, tenant count, or SLA commitment it hasn't been sized for.

Skip when:
- The ask is which boundaries to extract, not how big to build them — use
  [decomposition.md](decomposition.md); budgets constrain that decision, they don't replace it.
- The ask is the API/event contract shape — use [contracts.md](contracts.md).
- The ask is runtime SLO monitoring, alerting, or dashboards — that's `operate`'s job; this reference
  sets the target, not the pipeline.
- The ask is circuit-breaker/retry/bulkhead code — that's `backend`'s job; this reference decides
  where resilience is needed and to what target, not the implementation.

Inputs:
- Expected load (RPS, concurrent users, data volume) and its growth horizon — state explicitly when
  unknown; do not invent a number the requester hasn't given or approved.
- Existing SLAs/contractual commitments, if any.
- Cost ceiling or tier, if stated.

Produces:
- A performance-budget table (bundle/API-latency/DB-query/Core-Web-Vitals rows with targets).
- An SLO + error-budget statement per critical path.
- A scaling strategy: named triggers + a capacity/cost model.
- A Well-Architected self-audit (pillar × status × evidence).
- A named resilience-pattern decision per fragile boundary (not its implementation).

## Contents
- Performance budgets
- Reliability as SLO + error budget
- Scalability: triggers + capacity/cost model
- Well-Architected pillars as an NFR checklist
- Resilience patterns as strategy
- Validation
- Failure modes and handoff

## Procedure

### 1. Performance budgets
Set numeric ceilings before code exists, not after a regression. Defaults below are quoted from
patricio0312rev/skills's `performance-budget-setter` and `scalability-playbook` (MIT,
github.com/patricio0312rev/skills) — starting defaults, tune to the actual product:

| Budget | Target |
|---|---|
| Initial JS | 200KB |
| CSS | 50KB |
| Vendor JS | 150KB |
| Total initial load | 800KB |
| DB simple read | <50ms |
| DB complex join | <200ms |
| DB aggregation | <500ms |
| Queries per page | <20 |

Budget API latency by percentile, not a single average — a p50 target hides the tail latency that
breaks SLOs:

| Endpoint class | p50 | p95 | p99 |
|---|---|---|---|
| Read (`GET /products`) | <100ms | <300ms | <500ms |
| Write (`POST /checkout`) | <200ms | <500ms | <1000ms |

Core Web Vitals (good / target / poor): LCP <2.5s / <2.0s / >4.0s; FID <100ms / <50ms / >300ms; CLS
<0.1 / <0.05 / >0.25. vasilyu1983/ai-agents-public's `scalability-reliability-guide.md` (MIT) adds
internal-service p95 benchmarks worth cross-checking a budget against: DB query <10ms, cache read
<1ms, internal API <50ms, external API <200ms. Enforce budgets at CI (bundlesize/Lighthouse-CI gate,
`webpack.performance.hints:"error"`) — an unenforced budget decays within a quarter. Fill
[nfr-budget-worksheet.md](../assets/nfr-budget-worksheet.md) when the deliverable is a standalone
budget document rather than an inline answer.

**Benchmark equal work before setting a target.** Measure a baseline per workload class (one-record
read, paged search, bulk export, media job): cold start, first-result latency, total time, peak
process-tree memory, network calls, bytes. Compare only runs with equal results and coverage —
speed bought by dropping records is not the same work (Brendan Gregg's active-benchmarking warning:
"you benchmark A, but actually measure B, and conclude you've measured C"). Optimize the dominant
cost first; a rewrite in a faster language needs that measurement behind it.

### 2. Reliability as SLO + error budget
Ground: Google SRE, *Embracing Risk* — https://sre.google/sre-book/embracing-risk/. **Error budget =
1 − SLO.** A 99.999% quarterly SLO leaves a 0.001% error budget; failing 0.0002% of that quarter's
queries spends 20% of it. This is a **release-velocity control loop**, not just a health metric:
releases continue while budget remains; once exhausted, halt releases and invest in stability instead
— the team self-polices against a number instead of waiting for a gatekeeper.

Architecture's job is to **pick the SLO and size the system to it** — the SLO is a budget constraint
that sizes redundancy, region count, retry/timeout policy, and on-call investment. State SLI (the
measured metric: latency, success-rate) → SLO (the target on that SLI) → SLA (SLO + contractual
penalty, usually looser than the internal SLO) explicitly per critical path; don't default every path
to "as reliable as possible" — a background job and a checkout path do not share a budget. Runtime SLO
measurement and alerting is `operate`'s border — name the target here, don't build the dashboard.

### 3. Scalability: triggers + capacity/cost model
Ground: patricio0312rev/skills `scalability-playbook` + `capacity-planning-helper` (MIT). Define
scaling **triggers** as warn/critical threshold pairs, not "scale when slow":

| Signal | Warn | Critical | Action |
|---|---|---|---|
| CPU | 70% | 85% | add instances |
| Memory | 75% | 90% | upgrade instance size |
| DB connections | 40 | 50 | add read replicas |
| Query p95 | 500ms | 1000ms | add indexes |
| Queue depth | 1000 | 5000 | add workers |
| Error rate | 1% | 5% | investigate immediately |

Order fixes cheapest-first: quick wins (indexes, cache) → horizontal scale (replicas, load balancer) →
architecture changes (CDN, async queues) → data-layer changes (sharding, event-driven) — don't reach
for a data-layer rewrite to fix an indexing problem. Size capacity with `(peak RPS × latency) / target
CPU%` (vasilyu1983) and the rule-of-thumb **~100 RPS per instance with headroom, 50% compute headroom
multiplier** (patricio) as a first pass, not a final answer. Model cost in named tiers so the tradeoff
is explicit — cost-optimized (limited headroom) vs balanced (redundancy, default) vs
performance-optimized (max HA) — and state the capacity each tier buys, not just its price. Price the
whole model, not just compute: usage-billed third-party APIs, plan tiers whose terms exclude
commercial use, domains/DNS, and operator time — at low volume, model-token cost is rarely the
deciding line.

### 4. Well-Architected pillars as an NFR checklist
Ground: AWS Well-Architected (6 pillars — aws.amazon.com/architecture/well-architected) · Azure
Well-Architected (5 pillars — learn.microsoft.com/azure/well-architected/pillars) · Google Cloud
Architecture Framework (6 pillars — cloud.google.com/architecture/framework).

| Pillar | AWS | Azure | GCP |
|---|---|---|---|
| Operational Excellence | ✓ | ✓ | ✓ |
| Security | ✓ | ✓ | ✓ (folds in privacy/compliance) |
| Reliability | ✓ | ✓ | ✓ |
| Performance | ✓ Efficiency | ✓ Efficiency | ✓ Optimization |
| Cost Optimization | ✓ | ✓ | ✓ |
| Sustainability | ✓ | — | ✓ |

Run this as a per-pillar **self-audit table**, never a narrative summary: one row per applicable
pillar (`Pillar | Status | Evidence | Recommendation`), then count pillars covered against the total
before calling the review complete. A narrative "checked all the pillars" pass is exactly the failure
mode a parallel AWS Well-Architected review exists to fix — a single unstructured pass reliably stops
citing findings well before full coverage; the uniform table plus an explicit count is the correction.
Apply the same discipline to any other N-item NFR checklist — never close one out narratively.

Azure's architecture catalog also names a **10-item performance anti-pattern taxonomy** worth checking
directly: Busy Database, Busy Front End, Chatty I/O, Extraneous Fetching, Improper Instantiation,
Monolithic Persistence, No Caching, Noisy Neighbor, Retry Storm, Synchronous I/O.

### 5. Resilience patterns as strategy
Ground: Nygard, *Release It!* (Circuit Breaker, Bulkhead) · binhnguyennus/awesome-scalability's
Stability taxonomy (MIT, github.com/binhnguyennus/awesome-scalability) — Circuit Breaker, Bulkhead,
Throttling, Steady State, Multi-Clustering, Determinism.

Architecture's decision is **which boundary needs which pattern and to what target** — not the code.
For each fragile dependency (an external API, a shared DB, a queue consumer), name: a **circuit
breaker** (trip after N failures, degrade to a named fallback), a **bulkhead** (isolate its
connection/thread pool so its failure can't starve unrelated work), **retry with exponential backoff +
jitter** (bounded count, never infinite), or a **saga** (compensating actions across services — full
pattern owned by [data-architecture.md](data-architecture.md)). State the degrade-gracefully target
explicitly ("checkout falls back to cached pricing, not a 500") — a resilience call with no stated
fallback is not a decision. Implementation (the retry library, the breaker state machine) is
`backend`'s border; runtime trip-rate monitoring is `operate`'s.

**Third-party quota is a budget.** Budget calls per provider × account identity, not per process:
reserve allowance atomically before dispatch, keep reserved and actually-used apart, persist
cooldowns across restarts, and after a crash mid-dispatch record an uncertain attempt rather than
refunding it. Several credentials for one account share one budget identity. Serialize same-identity
mutations (GitHub's REST guidance: "make requests serially instead of concurrently" to avoid
secondary limits) while independent providers proceed inside a global budget, and show a plan plus a
capped sample before any unbounded external call. Rotating accounts or proxies to keep a throttled
or blocked job running is evasion, not resilience.

## Validation
- Every budget row has a number, not an adjective — "fast" is not a budget.
- Reliability is stated as SLI→SLO→SLA per critical path with the error-budget percentage computed.
- Every scaling trigger names a warn AND critical threshold plus the action taken at each.
- The Well-Architected pass is a table with a self-audit count, never a narrative "looks good."
- Every resilience-pattern call names the boundary, the pattern, and the degrade-gracefully target.
- Every third-party dependency names its quota budget identity and reservation rule.

## Failure modes and handoff
- **Budgets set with no enforcement mechanism** — a budget with no CI gate decays; name the gate or
  flag it as unenforced.
- **"Make it scalable" with no load number** — stop and ask for expected RPS/users/growth horizon
  before proposing a scaling strategy; do not invent one.
- **A narrative Well-Architected summary instead of a table** — redo as a uniform table with a
  self-audit count.
- **A resilience pattern named with no fallback target** — return to §5; "add a circuit breaker" with
  no stated degrade path is incomplete.
- **The ask is really "should we decompose this service"** — hand off to
  [decomposition.md](decomposition.md); budgets inform that call, they don't make it.
- **The ask is runtime dashboards/alerting** — hand off to `operate`; this reference stops at the
  target.
