# Surface: Mobile

Purpose: Apply the native-mobile-client overlay — pick a client architecture pattern, decide the
offline/sync strategy, and hold the client/server contract boundary where it belongs.

Read when:
- The system is (or includes) a native iOS or Android client and the request asks "which client
  architecture," "MVVM vs TCA vs Clean vs RIBs," or "how should offline/sync work."
- The client needs a state-management shape decided before build starts.

Skip when:
- The ask is the backend's tenancy/topology — use [surface-web-saas.md](surface-web-saas.md).
- The ask is the wire contract (API/event schema) the client consumes — use
  [contracts.md](contracts.md); this overlay decides which side owns state truth, not the schema.
- The ask is production Swift/Kotlin/Compose/SwiftUI implementation — hand off to `frontend`.

Inputs:
- Platform(s) targeted (iOS, Android, both) and expected app complexity/lifespan.
- Connectivity requirement — must the app function fully offline, or just tolerate brief loss? State
  explicitly; don't assume.

Produces:
- A client-architecture pattern pick, with what it costs and what NOT to build.
- An offline/sync strategy decision, including the conflict-resolution rule.
- A named client/server contract boundary, routed to [contracts.md](contracts.md).

## Procedure

### 1. The invariant beneath every pattern: SSOT + UDF
Ground: Android app architecture guide — developer.android.com/topic/architecture. Regardless of
which pattern below is chosen, hold two rules: **Single Source of Truth** (one owner mutates a piece
of state; everything else observes an immutable read of it) and **Unidirectional Data Flow** (state
flows down to the UI, events flow up to mutate it). A client architecture that violates either — two
places that can write the same state, or a view mutating state directly — is the failure mode this
overlay exists to prevent, independent of framework choice.

### 2. Pattern tradeoff
| Pattern | Shape | Choose when | What NOT to build |
|---|---|---|---|
| MVVM (Android official) | UI (Compose + `ViewModel`) → Domain (optional, use-cases) → Data (Repository over local/remote sources) | Default for most apps; simplest to onboard | Don't add the domain layer until use-case logic is reused across ≥2 ViewModels |
| TCA (The Composable Architecture) | State (value type) → Action (enum) → Reducer → Store → Effect | iOS app with many interacting features needing exhaustive test coverage (`TestStore`) | Don't adopt for a small/simple app — the ceremony costs more than it returns below a handful of features |
| Clean Architecture | Strict framework-agnostic core, layered boundaries | Long-lived app, large team, core logic must outlive framework churn | Don't over-layer a short-lived or single-developer app |
| uber RIBs | Router-Interactor-Builder; business logic drives the tree, not the view tree; hierarchical DI | Very large app, hundreds of engineers, deep nested feature ownership | Don't adopt below that team scale — RIBs' value is coordinating many teams' nested scopes, not app structure per se |

Ground: MVVM — developer.android.com/topic/architecture (Apache-2.0 samples). TCA —
github.com/pointfreeco/swift-composable-architecture (MIT): State/Action/Reducer/Store/Effect; the
`Store` runs the reducer, effects emit further actions, `TestStore` asserts whole workflows against
mock dependencies. RIBs — github.com/uber/RIBs (Apache-2.0): proven at "hundreds of engineers, hundreds
of nested RIBs"; a RIB need not own a view — the app hierarchy follows business-logic scopes, not the
view tree.

Android modularization default (new-silvermoon/awesome-android-agent-skills, Apache-2.0): `:app`,
`:core:{model,data,domain,ui}`, `:feature:[name]` — features depend only on `:core:domain` +
`:core:ui`; the domain module must not import `android.*` (keeps it platform-agnostic and testable
without instrumentation). DI via Hilt (`@HiltAndroidApp`/`@AndroidEntryPoint`/`@HiltViewModel`,
prefer `@Binds` over `@Provides`).

### 3. Offline-first as an architecture decision, not a feature
Decide this before build, not as a bug-fix later:

| Strategy | Shape | Choose when |
|---|---|---|
| Local-first (client DB is SSOT) | Client persists writes locally, background sync reconciles with server | Product must function fully offline (field work, unreliable connectivity) |
| Server-truth + cache | Client caches reads, writes require connectivity | Brief network loss is tolerable; offline is a UX nicety, not a requirement |

Whichever is chosen, state the **conflict-resolution rule explicitly** — last-write-wins,
CRDT-based merge, or server-arbitrated resolution — before implementation starts. An offline strategy
with no stated conflict rule is not a decision; it's a deferred bug.

### 4. Client/server contract boundary
This overlay decides which side owns state truth (§3) and which pattern shapes the client (§2). It
does **not** define the wire schema — that's [contracts.md](contracts.md)'s job. Hand off the
offline/sync decision to `contracts.md` as a constraint ("client may replay queued writes out of
order; the API must accept idempotency keys"), not as a schema you draft here.

## Validation
- The chosen pattern is justified against its "choose when" row, not picked by default preference.
- SSOT + UDF hold even inside the chosen pattern.
- If offline is required, the conflict-resolution rule is named explicitly.
- The client/server contract need is stated as a constraint and routed to `contracts.md`, not defined
  here.

## Failure modes and handoff
- **TCA or RIBs chosen for a small app "because it's more correct"** — over-architecture; return to
  §2 and pick MVVM/Clean unless the scale trigger is real.
- **"Offline-first" with no conflict-resolution rule** — incomplete; return to §3.
- **The ask is really the API contract** — hand off to [contracts.md](contracts.md).
- **The ask is implementation (Swift/Kotlin/Compose code)** — hand off to `frontend`.
