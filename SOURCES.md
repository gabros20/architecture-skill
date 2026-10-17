# Sources & attribution

The `architecture` skill wraps a published canon of software-architecture frameworks rather than
reinventing it. This file attributes that canon and records the license posture applied to each.

**License policy (applied throughout the pack).** Default posture: **re-express the facts and cite
the standard.** Verbatim text is lifted only from permissively licensed sources (MIT, Apache-2.0,
MIT-0, CC0) with attribution here. CC-BY sources are attributed and cited. CC-BY-SA sources
(ddd-crew canvases, humanlayer/12-factor-agents) are attributed and treated share-alike-aware — the
fillable-canvas assets that adapt them carry their own inline CC-BY-SA notice. CC-BY-NC-ND sources
(karanpratapsingh, ByteByteGo-style material) and no-license repositories are **cited/linked only,
never re-expressed into shipped text as prose**; copyrighted books (Evans, Khononov, Kleppmann,
Nygard, Ford/Parsons/Kua) are used as a concept index and cited, never reproduced.

---

## Permissive — re-expressed with attribution (MIT / Apache-2.0 / MIT-0 / CC0)

| Source | License | Used in |
|---|---|---|
| [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) — `@system-design`, `@architecture` | Apache-2.0 | system-design |
| [google/skills](https://github.com/google/skills) — `google-cloud-solution-architecture` (requirements-gate, output-template) | Apache-2.0 | system-design, solution-architecture-doc asset |
| [vasilyu1983/ai-agents-public](https://github.com/vasilyu1983/ai-agents-public) | MIT | system-design, data-architecture, nfr-budgets, migration |
| [citypaul/.dotfiles](https://github.com/citypaul/.dotfiles) — DDD/hexagonal/aggregate rules | MIT | decomposition |
| [tech-leads-club/agent-skills](https://github.com/tech-leads-club/agent-skills) — `modular-decomposition` (Khononov model), TDD rule | MIT | decomposition, solution-architecture-doc asset |
| [athola/claude-night-market](https://github.com/athola/claude-night-market) — paradigm-selection matrix | MIT | decomposition |
| [kgrzybek/modular-monolith-with-ddd](https://github.com/kgrzybek/modular-monolith-with-ddd) | MIT | decomposition |
| [evolutionary-architecture/evolutionary-architecture-by-example](https://github.com/evolutionary-architecture/evolutionary-architecture-by-example) | MIT | decomposition |
| [wshobson/agents](https://github.com/wshobson/agents) — `api-design-principles`, `architecture-decision-records`, `postgresql` | MIT | contracts, adr-and-governance, data-architecture |
| [patricio0312rev/skills](https://github.com/patricio0312rev/skills) — performance-budget-setter, scalability-playbook, api-versioning-deprecation-planner | MIT | contracts, nfr-budgets, migration, nfr-budget-worksheet asset |
| [binhnguyennus/awesome-scalability](https://github.com/binhnguyennus/awesome-scalability) — stability taxonomy | MIT | nfr-budgets |
| [bobmatnyc/claude-mpm-skills](https://github.com/bobmatnyc/claude-mpm-skills) — `threat-modeling`, common-threats catalog | MIT | security-architecture, threat-model-register asset |
| [harperaa/secure-claude-skills](https://github.com/harperaa/secure-claude-skills) — 5-layer defense-in-depth | MIT | security-architecture |
| [aws-samples/sample-well-architected-skills-and-steering](https://github.com/aws-samples) — `migration-readiness` (7 Rs) | MIT-0 | migration |
| [adr/madr](https://github.com/adr/madr) — MADR template + Confirmation section | MIT / CC0-1.0 | adr-and-governance, adr-template asset |
| [joelparkerhenderson/architecture-decision-record](https://github.com/joelparkerhenderson/architecture-decision-record) — Y-Statement, ADR properties | (catalog, cited) | adr-and-governance |
| [ruvnet/ruflo](https://github.com/ruvnet) — ADR-as-graph toolkit, drift detection | (cited) | adr-and-governance |
| [JonasTebben/archunit-examples](https://github.com/JonasTebben/archunit-examples) — fitness-function rule shapes | MIT | adr-and-governance |
| [oocx/tfplan2md](https://github.com/oocx/tfplan2md) — arc42 hard-rules | MIT | adr-and-governance |
| [QDenka/awesome-software-design](https://github.com/QDenka/awesome-software-design) — ArchUnit-family catalog | CC0-1.0 | adr-and-governance |
| [RAG_Techniques](https://github.com/NirDiamant/RAG_Techniques), [athina-ai/rag-cookbooks](https://github.com/athina-ai/rag-cookbooks) — RAG variant ladder | MIT | surface-agentic |
| [omer-metin llm-architect skill](https://github.com/omer-metin) — retrieve-then-rerank, sharp edges | Apache-2.0 | surface-agentic |
| [pointfreeco/swift-composable-architecture](https://github.com/pointfreeco/swift-composable-architecture) — TCA | MIT | surface-mobile |
| [uber/RIBs](https://github.com/uber/RIBs) | Apache-2.0 | surface-mobile |
| [new-silvermoon/awesome-android-agent-skills](https://github.com/new-silvermoon) — modularization defaults | Apache-2.0 | surface-mobile |
| [Android app architecture guide](https://developer.android.com/topic/architecture) — MVVM, SSOT/UDF (samples) | Apache-2.0 | surface-mobile |
| [backstage/backstage](https://github.com/backstage/backstage) — IDP structural vocabulary | Apache-2.0 (CNCF) | surface-internal-platform |

## CC-BY-4.0 — attributed, cited

| Source | Used in |
|---|---|
| [C4 model](https://c4model.com) — Simon Brown | system-design |
| [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) — back-of-envelope numbers, 4-step method | system-design |
| [zalando/restful-api-guidelines](https://github.com/zalando/restful-api-guidelines) | contracts |
| [microsoft/api-guidelines](https://github.com/microsoft/api-guidelines) | contracts |
| [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/) · [Azure Well-Architected](https://learn.microsoft.com/azure/well-architected/) · [Google Cloud Architecture Framework](https://cloud.google.com/architecture/framework) — pillars, tenancy models, deployment stamps, security pillar | nfr-budgets, surface-web-saas, security-architecture |
| [Google Cloud — choose a design pattern for an agentic AI system](https://cloud.google.com/architecture/choose-design-pattern-agentic-ai-system) — 12-pattern matrix | surface-agentic |

## CC-BY-SA-4.0 — attributed, share-alike-aware

The fillable canvas/template assets that adapt these carry their own inline CC-BY-SA-4.0 notice.

| Source | Used in |
|---|---|
| [ddd-crew/context-mapping](https://github.com/ddd-crew/context-mapping) — 9 context-map patterns | decomposition |
| [ddd-crew/bounded-context-canvas](https://github.com/ddd-crew/bounded-context-canvas) | bounded-context-canvas asset |
| [ddd-crew/aggregate-design-canvas](https://github.com/ddd-crew/aggregate-design-canvas) | aggregate-design-canvas asset |
| [humanlayer/12-factor-agents](https://github.com/humanlayer/12-factor-agents) — Factor 8, Factor 12 | surface-agentic |

## Cited, not copied — concepts, standards, and restrictive/no-license material

Named and linked as canon; **not** re-expressed from a restrictively licensed rendering. Facts are
drawn from the open standard or the primary concept, not from these renderings' prose.

- **Concepts / books (concept index only, never reproduced):** Eric Evans, *Domain-Driven Design*;
  Vlad Khononov, *Balancing Coupling in Software Design*; Martin Kleppmann, *Designing
  Data-Intensive Applications*; Michael Nygard, *Release It!* & "Documenting Architecture Decisions";
  Neal Ford / Rebecca Parsons / Patrick Kua, *Building Evolutionary Architectures*; Skelton & Pais,
  *Team Topologies*; Zhamak Dehghani, *Data Mesh*.
- **Cited essays / articles (not copied):** Martin Fowler's bliki (BoundedContext, MonolithFirst,
  MicroservicePremium, StranglerFigApplication); [microservices.io](https://microservices.io)
  (Chris Richardson — API Gateway/BFF, CQRS, Transactional Outbox, Saga); Google SRE Book
  (*Embracing Risk*); Anthropic engineering ("Building Effective Agents," "How We Built Our
  Multi-Agent Research System," "Effective Context Engineering for AI Agents"); ThoughtWorks
  Insights (fitness-function-driven development); CAP (Gilbert & Lynch); PACELC (Daniel Abadi);
  Cockburn (Hexagonal Architecture); "Uncle Bob" Martin (Clean Architecture / Dependency Rule);
  Olaf Zimmermann (Y-Statement); SwirlAI (agent-memory taxonomy); Weaviate (Agentic RAG); Palantir
  Tech and X long-form harness authors (Vtrivedy10, himanshutwtxs) — agent-harness and agent-security
  theses.
- **Integration, reliability, and agent-safety guidance (cited, not copied):** Hohpe & Woolf, *Enterprise Integration Patterns* —
  [Process Manager](https://www.enterpriseintegrationpatterns.com/patterns/messaging/ProcessManager.html)
  (data-architecture); David Harel's statecharts — orthogonal regions, via
  [statecharts.dev](https://statecharts.dev/glossary/parallel-state.html) (data-architecture);
  Cartwright, Horn & Lewis, [*Patterns of Legacy Displacement* — Feature Parity](https://martinfowler.com/articles/patterns-legacy-displacement/feature-parity.html)
  (migration); Per Brinch Hansen's separation of mechanism and policy (RC 4000) (migration);
  [AWS Builders' Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)
  (contracts); [GitHub REST API best practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api)
  (nfr-budgets); Brendan Gregg, [Active Benchmarking](https://www.brendangregg.com/activebenchmarking.html)
  (nfr-budgets); [OWASP Top 10 for LLM Applications — LLM06 Excessive Agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/)
  and [CWE-367](https://cwe.mitre.org/data/definitions/367.html) (surface-agentic);
  Cursor, [What we've learned building cloud agents](https://cursor.com/blog/cloud-agent-lessons)
  (2026 — decoupled agent loop, machine, and conversation state) and the managed-runtime docs used
  as dated examples, checked 2026-10-17:
  [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview),
  [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview),
  [LangSmith Managed Deep Agents](https://github.com/langchain-ai/managed-deepagents) (surface-agentic §10);
  [OWASP SSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
  and [Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
  cheat sheets, [W3C TAG — Good Practices for Capability URLs](https://www.w3.org/TR/capability-urls/)
  (draft), [GDPR Recital 26](https://gdpr-info.eu/recitals/no-26/) (security-architecture).
- **Open standards & specs:** [OpenAPI](https://swagger.io/specification/),
  [AsyncAPI](https://www.asyncapi.com), [arc42](https://docs.arc42.org),
  [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html),
  [Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org),
  [RAGAS](https://docs.ragas.io), [CNCF](https://www.cncf.io),
  [RFC 8259 §6](https://www.rfc-editor.org/rfc/rfc8259#section-6) (JSON number interoperability),
  [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457) (problem details),
  [RFC 9111](https://www.rfc-editor.org/rfc/rfc9111) (HTTP caching),
  [Google AIP-217](https://google.aip.dev/217) (unreachable resources),
  [llms.txt proposal](https://llmstxt.org) (Markdown page variants) — contracts / system-design.
- **CC-BY-NC-ND — link only, never re-expressed as prose:**
  [karanpratapsingh/system-design](https://github.com/karanpratapsingh/system-design) (the 7-step
  method and PACELC framing are cited; text is not lifted).
- **No license on file — paraphrase of facts only, no text copied:**
  [Sairyss/system-design-patterns](https://github.com/Sairyss/system-design-patterns) (Transactional
  Outbox, identifier schemes); [dastergon/awesome-sre](https://github.com/dastergon/awesome-sre)
  (SRE catalog); npryce/adr-tools (Nygard template distribution — canonical format re-expressed, file
  not copied verbatim).

---

*Every framework above is wrapped, not reproduced. If an attribution is missing or a license posture
is wrong, open an issue — see [CONTRIBUTING.md](CONTRIBUTING.md).*
