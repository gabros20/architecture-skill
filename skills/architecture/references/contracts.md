# Contracts

Purpose: Produce the API and event contracts that let `frontend` and `backend` (and any external
consumer) build in parallel against an agreed interface, before either side writes production code.

Read when:
- The request asks to "design the API," "define the contract," "spec the endpoints/events," or a
  build skill needs a stable interface before frontend/backend work starts in parallel.
- A service boundary from [decomposition.md](decomposition.md) needs its inter-service or
  inter-team interface made explicit.
- An existing API needs a versioning or deprecation plan.

Skip when:
- The boundary itself (which service owns what) isn't decided yet — use
  [decomposition.md](decomposition.md) first; a contract for the wrong boundary just moves the
  rework downstream.
- The ask is implementing the endpoint/handler/client — route to `backend`/`frontend`; this
  reference stops at the spec, not the code behind it.
- The ask is consumer-driven contract *testing* (Pact, schema-diff CI gates) — route to `quality`;
  this reference designs the contract, quality verifies it keeps holding.
- The question is the numeric latency/rate-limit budget for an endpoint — use
  [nfr-budgets.md](nfr-budgets.md); this reference shapes the interface, not its numeric targets.

Inputs:
- The service/context boundary and its owner, from [decomposition.md](decomposition.md) — state
  explicitly if not yet decided, do not invent one.
- The consumer list: which clients/teams/services call this, and how diverse they are (one
  internal service vs many external SDKs).
- Any existing contract being versioned against — state explicitly when none exists.

Produces:
- A contract-style decision (REST/gRPC/GraphQL, sync/async) with the tradeoff stated.
- An OpenAPI (sync) or AsyncAPI (event) skeleton, or a pointer to write one.
- A versioning + deprecation plan with dates.
- A completed API-contract review checklist.

## Contents

- Contract-first design (OpenAPI + AsyncAPI)
- REST vs gRPC vs GraphQL-federation
- Versioning + deprecation
- API-contract review checklist

## Procedure

### 1. Contract-first design
Agree the interface *before* either side builds — producer and consumer both code against the same
document in parallel, instead of the consumer waiting on a running server (OpenAPI Initiative,
https://swagger.io/specification/; AsyncAPI, https://www.asyncapi.com/docs/concepts). Use
**OpenAPI** for synchronous HTTP: `info` / `servers` / `paths` (endpoints+operations) /
`components` (reusable `schemas`/`securitySchemes`/`parameters`/`responses` via `$ref`) /
`security` / `tags`. Use **AsyncAPI** for event interfaces: `channels` (an addressable topic, e.g.
`user/signedup`), `operations` (`send`|`receive` on a channel — the 3.0 replacement for
publish/subscribe), `messages` (payload schema), `servers` (the broker). Both serve the same
purpose for a different transport — "a communication contract between senders and receivers."
Broker config and consumer-group tuning are impl → `backend`.

### 2. REST vs gRPC vs GraphQL-federation
Architecture picks the contract style; build skills implement it. Decision drivers: data-model
complexity, client diversity, change frequency, latency budget (CNCF,
https://www.cncf.io/blog/2021/07/19/think-grpc-when-you-are-architecting-modern-microservices/).

| Style | Best for | Cost |
|---|---|---|
| **REST** | Simple resource CRUD, broad interoperability, public/external APIs, diverse unknown clients | Untyped by default; over/under-fetching; weak native streaming |
| **gRPC** | Internal service-to-service, high-throughput/low-latency, strict typed contracts | Protobuf toolchain; poor browser/public-client ergonomics |
| **GraphQL (+ federation)** | Diverse clients needing different shapes from one data set (BFF-like) | N+1 risk (needs DataLoader), schema-governance overhead; federation adds a supergraph-composition layer |

Default: REST for public/consumer-diverse surfaces; gRPC for internal high-frequency calls where
you own both ends; GraphQL/federation when many client shapes read the same underlying data.
Don't reach for GraphQL to serve a single internal client — that's REST with extra steps.

### 3. Versioning + deprecation
Pick one versioning mechanism and hold it — mixing strategies mid-API is the actual anti-pattern
(wshobson/agents `api-design-principles`, MIT, github.com/wshobson/agents):

| Mechanism | Example | Tradeoff |
|---|---|---|
| **URL path** | `/v1/orders` | Explicit, cacheable; clutters URLs, invites full-endpoint duplication |
| **Header/media-type** | `Accept: application/vnd.heroku+json; version=3` | Stable URLs; invisible to casual inspection |
| **Query param** | `?version=1` | Easiest to retrofit; easy to omit by accident |

Never ship an implicit default version — defaults are hard to change later once clients depend on
them (interagent/http-api-design, the Heroku API guide). Deprecation is a **timeline, not an
event** (patricio0312rev/skills `api-versioning-deprecation-planner`, MIT): announce via response
headers — `Deprecation: true`, `Sunset: <date>`, `Link: rel="alternate"`, `Warning: 299` — give
consumers a stated **6-month** window, keep the old version behind an adapter/feature flag for
backward compatibility during the overlap, and remove only after telemetry shows zero traffic.
Classify every change **breaking vs non-breaking** before shipping it as a silent "minor" bump:
adding an optional field is non-breaking; renaming/removing a field, tightening validation, or
changing a status code is breaking.

### 4. API-contract review checklist
Cover every category with a uniform table, not a narrative — narrative summaries collapse recall
on long checklists (the AWS Well-Architected coverage-recall lesson: an ungated single pass over a
large checklist reliably stops at 20–60 items). Self-audit: count checked rows against total
before calling the contract review done.

| Category | Check |
|---|---|
| Resource design | Nouns not verbs; plural collections; nesting minimized (root-level resources over deep paths) |
| HTTP methods | Method semantics match intent (GET safe/idempotent, PUT idempotent, POST creates/acts) |
| Status codes | Consistent across endpoints (200/201+`Location`/202 async/401/403/422/429) |
| Pagination | One strategy declared (offset / cursor / `Range` header) and applied everywhere |
| Filtering & sorting | Query-param convention documented once, reused everywhere |
| Versioning | One mechanism (§3), no implicit default |
| Error handling | One JSON error shape everywhere: machine `id`, human `message`, optional docs `url` |
| AuthN/AuthZ | Security scheme declared in `components.securitySchemes`, referenced per operation |
| Rate limiting | Limits documented, remaining-quota header exposed |
| Idempotency | Mutating retries are safe (idempotency keys on POST that may be retried) |
| Docs | Generated from the spec, not hand-maintained twice |

Condensed from wshobson/agents `api-design-principles` `assets/api-design-checklist.md` (~80 items,
MIT); use zalando/restful-api-guidelines and microsoft/api-guidelines (both CC-BY-4.0) for a fuller
numbered rulebook when the team wants one.

## Validation
- Every named consumer can build against the spec without a clarifying question back to this team.
- The versioning mechanism is singular and stated; deprecation dates exist for anything replaced.
- The §4 checklist is a filled table with a row count, not a paragraph.

## Failure modes and handoff
- **Contract drafted before the boundary is settled** — return to
  [decomposition.md](decomposition.md); a well-specified contract on the wrong boundary is wasted
  work.
- **Versioning strategy mixed mid-API** (some endpoints URL-versioned, others header-versioned) —
  flag and unify before shipping either.
- **The real ask is contract-testing setup** (Pact, schema-diff gate) — hand off to `quality`.
- **The real ask is the endpoint/client implementation** — hand off to `backend` (or `frontend`
  for a BFF/client-side aggregation layer).
