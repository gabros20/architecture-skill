# NFR Budget Worksheet

Fillable worksheet for setting numeric NFR budgets before build starts. Defaults are quoted from
patricio0312rev/skills (MIT) — starting points, not requirements. Overwrite with the product's real
numbers; delete a row that doesn't apply.

## Performance

| Budget | Default | Target | Notes |
|---|---|---|---|
| Initial JS | 200KB | | |
| CSS | 50KB | | |
| Vendor JS | 150KB | | |
| Total initial load | 800KB | | |
| DB simple read | <50ms | | |
| DB complex join | <200ms | | |
| DB aggregation | <500ms | | |
| Queries per page | <20 | | |

## API latency (by percentile)

| Endpoint | p50 | p95 | p99 |
|---|---|---|---|
| (read path) | <100ms | <300ms | <500ms |
| (write path) | <200ms | <500ms | <1000ms |
| | | | |

## Core Web Vitals

| Metric | Good | Target | Poor |
|---|---|---|---|
| LCP | <2.5s | <2.0s | >4.0s |
| FID | <100ms | <50ms | >300ms |
| CLS | <0.1 | <0.05 | >0.25 |

## Reliability — SLO / error budget

| Critical path | SLI | SLO | Error budget (1−SLO) | SLA (if any) |
|---|---|---|---|---|
| | | | | |
| | | | | |

## Scaling triggers

| Signal | Warn | Critical | Action |
|---|---|---|---|
| CPU | 70% | 85% | add instances |
| Memory | 75% | 90% | upgrade instance size |
| DB connections | 40 | 50 | add read replicas |
| Query p95 | 500ms | 1000ms | add indexes |
| Queue depth | 1000 | 5000 | add workers |
| Error rate | 1% | 5% | investigate immediately |

## Capacity / cost model

| Tier | Monthly cost | Capacity | Notes |
|---|---|---|---|
| Cost-optimized | | | limited headroom |
| Balanced (default) | | | redundancy; monitor 1 month then adjust |
| Performance-optimized | | | max HA |

## Well-Architected self-audit

| Pillar | Status | Evidence | Recommendation |
|---|---|---|---|
| Operational Excellence | | | |
| Security | | | |
| Reliability | | | |
| Performance | | | |
| Cost Optimization | | | |
| Sustainability (if applicable) | | | |

Self-audit count: ___ of ___ applicable pillars covered.
