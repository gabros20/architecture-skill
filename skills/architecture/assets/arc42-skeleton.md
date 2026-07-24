# arc42 skeleton

Fillable 12-section skeleton for a full architecture document, used from
[system-design.md](../references/system-design.md). Section structure after arc42 (arc42/arc42-
template, license unclear — NOASSERTION on the template repo; headings and structure re-expressed
here in original prompts, not copied from the template text — https://arc42.org).

Hard rules (oocx/tfplan2md, MIT — github.com/oocx/tfplan2md): don't fabricate a section's content;
ask one question at a time for what's missing. Mark an incomplete section `TBD`, don't skip it
silently. Link to existing ADRs from §9 — don't duplicate their content here. This document is not
a substitute for code-level docs. **Don't produce a full arc42 doc for a trivial feature** — a
single ADR is usually the right weight; reserve this skeleton for a system or a decision large
enough to need all 12 sections.

## 1. Introduction and goals
What the system must do (functional requirements, linked not restated), the top 3–5 quality goals
ranked by priority, and who the stakeholders are and what each expects.

## 2. Architecture constraints
Constraints that bound the solution space — technical, organizational/political, and convention —
each with the reason it exists. Mark which are negotiable and which aren't.

## 3. Context and scope
Business context: every external actor/system this system communicates with, and what data crosses
each boundary. Technical context: the channels/protocols/hardware carrying that communication.

## 4. Solution strategy
The cornerstone section — the handful of foundational decisions everything else refers back to:
technology choices, the top-level decomposition pattern, how the top quality goals get achieved,
and any key organizational decision (build vs. buy, in-house vs. outsourced).

## 5. Building block view
Hierarchical decomposition (system → components → modules), each block stating its purpose,
its interfaces, and — where relevant — its quality characteristics and open risks.

## 6. Runtime view
The handful of scenarios chosen for architectural relevance, not volume — critical use cases,
external-interface interactions, startup/shutdown, and error/exception paths. Use whatever notation
fits (numbered steps, sequence diagram, state machine).

## 7. Deployment view
Where the building blocks actually run — environments, infrastructure elements, network topology —
mapped explicitly if dev/test/prod differ.

## 8. Cross-cutting concepts
Concepts that touch multiple building blocks (security, logging, error handling, persistence).
Cover only what's actually needed here — don't attempt exhaustive coverage of every possible
concept.

## 9. Architecture decisions
Point to the relevant ADRs ([adr-and-governance.md](../references/adr-and-governance.md)) rather
than duplicating their content — this section is the index into the decision log, not a second
copy of it.

## 10. Quality requirements
The quality-attribute scenarios that matter, each stated as: source/stimulus → environment →
response → response measure. Prefer a short table over prose; this is a checklist, not an essay.

## 11. Risks and technical debt
Prioritized list, each with a stated mitigation or an explicit "accepted, not mitigating."

## 12. Glossary
Term → definition, for any term a reader outside the immediate team would need.
