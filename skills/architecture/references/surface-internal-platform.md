# Surface: Internal Platform

Purpose: Apply the internal-tooling/platform-engineering overlay — use Team Topologies as the
org↔architecture bridge, decide whether a platform is even justified yet, and shape self-service
(IDP) when it is.

Read when:
- The request is an internal tool, developer platform, or "should we build an IDP / platform team"
  question.
- Team structure and cognitive load are part of what's driving a boundary decision.

Skip when:
- The system is customer-facing — use [surface-web-saas.md](surface-web-saas.md).
- The tool is small enough that no architecture pass is warranted — say so explicitly and stop (see
  §4); don't apply platform-team ceremony to a script.
- The ask is the actual scaffolder/catalog implementation or CI wiring — hand off to
  `backend`/`operate`.

Inputs:
- Number of teams that would consume the platform, and whether the capability needs ongoing
  operational ownership or is a one-time build — state explicitly; do not assume "platform-worthy."
- Current team structure, if the boundary question is Conway-shaped.

Produces:
- A team-topology read (which of the 4 types + interaction mode applies) that justifies the boundary.
- A platform-as-product framing (X-as-a-Service) if a platform team is warranted.
- An explicit "don't build a platform yet" call when the threshold in §4 isn't met.

## Procedure

### 1. Team Topologies as the org↔architecture bridge
Ground: Skelton & Pais, *Team Topologies* — teamtopologies.com/key-concepts-content. **4 team
types**: **Stream-aligned** (owns one flow of work end-to-end — the default team shape), **Enabling**
(temporarily helps stream-aligned teams adopt a new capability, then steps back), **Complicated-
Subsystem** (owns a piece needing deep specialist knowledge — a codec, an ML model), **Platform**
(reduces cognitive load for stream-aligned teams via a self-service capability — this is where
"internal platform" lives). **3 interaction modes**: **Collaboration** (temporary, high-bandwidth,
for discovery — expensive, not a steady state), **X-as-a-Service** (one team consumes another's
well-defined API/service with minimal ongoing collaboration — the platform's target steady state),
**Facilitating** (one team helps another remove an impediment).

**Cognitive load is the boundary-sizing input**: a team boundary is right-sized when the team can
hold its domain in working memory. If a stream-aligned team can't, that's the signal to extract a
platform or complicated-subsystem team — not to add headcount to the same team. **Inverse Conway
Maneuver**: deliberately shape team boundaries first to steer toward the system architecture wanted,
rather than reverse-engineering topology from whatever teams already exist.

### 2. Platform-as-product
An internal platform earns the name only once its steady-state interaction mode is
**X-as-a-Service** — a defined API/contract (route the schema itself to
[contracts.md](contracts.md)), a support/on-call model, and consumers who self-serve without a
ticket. If every consumer still needs Collaboration-mode hand-holding, it isn't a platform yet — it's
a team doing bespoke work wearing a platform label. Don't claim the Platform-team topology until
X-as-a-Service is real; claiming it early just relabels the cognitive-load problem without fixing it.

### 3. IDP shape when a platform is justified
Ground: backstage/backstage (CNCF, Apache-2.0) — the reference Internal Developer Platform shape,
used here as a structural vocabulary, not a build recommendation to adopt Backstage specifically:
**software catalog** (inventory of every service + its owner), **TechDocs** (docs live next to the
code they describe), **scaffolder** (golden-path templates for new services, so a new service starts
compliant instead of drifting), **plugins** (extends into CI/CD, cost, security without changing the
catalog's shape). Use these four as the checklist for "does this count as self-service" — a catalog
with no golden-path scaffolder is an inventory, not a platform.

### 4. When NOT to build a platform
Named trigger for graduating a capability from **shared library/convention** to **platform team**:
**≥3 independent teams need the same capability, AND the capability requires ongoing operational
ownership** (not a one-time script or a documented pattern). Below that threshold, a shared library
plus documentation beats standing up a team — the platform-team topology's cost (a dedicated team,
an API to maintain, a support model) only pays off once ongoing ownership and multi-team demand are
both real. Applying IDP/platform-team investment below this threshold is the internal-tooling
equivalent of over-architecting an MVP.

## Validation
- The team-topology type and interaction mode are named, not assumed.
- If a platform is proposed, its steady-state mode is X-as-a-Service, stated explicitly — not
  Collaboration dressed up as self-service.
- The "don't build yet" threshold (§4) was checked before recommending a platform team.
- Team-structure changes are named as an input to the decision, not solved here — org/hiring
  decisions are outside this skill's scope.

## Failure modes and handoff
- **A platform team proposed with no named 3-team-demand + ongoing-ownership trigger** — return to
  §4; recommend a shared library instead.
- **"Self-service platform" that still requires Collaboration-mode support per consumer** — not yet a
  platform; return to §2.
- **The ask is really the platform's API contract** — hand off to [contracts.md](contracts.md).
- **The ask is the scaffolder/catalog implementation or CI wiring** — hand off to
  `backend`/`operate`.
- **The ask is a team-structure or hiring decision** — name it as an input, don't attempt to resolve
  it; outside this skill's scope.
