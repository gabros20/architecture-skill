# Threat model register

Fillable register for [security-architecture.md](../references/security-architecture.md). One row
per (element, STRIDE category) pair with a real threat — don't pre-fill all 6 categories per
element if a category doesn't apply, but do check all 6 before moving to the next element.

Grounding bobmatnyc/claude-mpm-skills `threat-modeling` (MIT) —
https://github.com/bobmatnyc/claude-mpm-skills.

## Scope

- **System / boundary being modeled:**
- **Assets in scope** (PII, credentials, payment data, other regulated data):
- **Stated SLO/SLA, if any:**
- **Data classification / regulatory regime** (GDPR, PCI-DSS, none — state explicitly):

## Data-flow diagram

Describe or link the diagram. Mark every trust boundary crossing explicitly, e.g.:
`public internet → edge → internal → database → third-party`.

## Register

| Element | STRIDE | Threat | Impact (L/M/H) | Likelihood (L/M/H) | Mitigation | Owner | Status |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

Status values: `Open` / `Mitigated` / `Accepted risk` / `Deferred`. Every `Open` High-impact row
needs an owner and a target date before the model is considered complete.

## Validation checklist

- [ ] Every element in the DFD has at least one STRIDE entry.
- [ ] All High-impact threats have an assigned owner and mitigation.
- [ ] Each mitigation maps to a backlog ticket or a test case (link it, don't just describe it).
- [ ] The register states its own assumptions and scope boundaries.
- [ ] The PR/release checklist reflects any new security requirement this pass introduced.

## Re-run triggers

New data store or trust boundary · auth-flow changes · new third-party integration · major scaling
change. Update this register in place; don't fork a parallel copy per re-run.
