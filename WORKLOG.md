# Worklog

## Current Focus
Deployed custom evaluation prompts feature. Each kit can now have a hand-crafted evaluation prompt.

## Queue
- [x] Push to GitHub ✓
- [x] Deploy Edge Function with new fields ✓
- [x] Custom evaluation prompts per kit ✓

## Decisions Made
| Decision | Date | Context |
|----------|------|---------|
| Grouped parentheticals over monolithic strings | 2026-01-24 | Better composability - users can copy individual concept clusters |
| Remove group labels from UI | 2026-01-24 | Terms are self-documenting, labels added clutter |
| Remove lightning bolt from Recent | 2026-01-24 | Simplify visual hierarchy |
| Add Evaluate Leads button | 2026-01-24 | Copy screening prompt for ChatGPT/Claude evaluation |
| Add SAM.md coaching system | 2026-01-24 | Claude nudges Sam on batching, checkpointing, front-loading |
| Replace Company with Organization dropdown | 2026-01-24 | Turing-specific orgs: TA2, TI, Finance, People, Marketing, Delivery, Fulfillment, Legal, R&D |
| Header layout: search + tabs same row | 2026-01-24 | Better visual balance, less vertical stacking |
| Use Opus 4.5 with prompt caching | 2026-01-24 | Quality + speed for generation |
| Email-based favorites (not localStorage UUID) | 2026-01-24 | Works across devices |
| Specificity levels collapsed by default | 2026-01-24 | Reduce visual noise, expand on demand |
| Custom evaluation prompts per kit | 2026-01-25 | Hand-crafted prompts for niche roles are more effective than auto-generated |

## Parked Ideas
- **Sourcing Copilot** — Async HM collaboration + DSM learning from sourcing feedback. See `/docs/sourcing-copilot-spec.md`
