# Hantavirus Signal Tracker Design Plan

Status: Draft v1.2  
Last updated: 2026-05-09  
Scope: MV Hondius / Andes virus tracker first, extensible to other emerging infectious disease events.

## Product Positioning

This project is a signal-driven public health tracker, not a headline feed. It should help readers understand what changed, which source changed it, and whether the change affects risk.

Core principles:

- Signal over noise: prioritize inflection points over article volume.
- Primary sources first: WHO, CDC, ECDC, PAHO, and national health agencies outrank media.
- Explainable risk: every green, orange, or red signal must map to a rule and source.
- No drama: use restrained language and avoid fear framing.
- Bilingual native: Chinese explanations should preserve English official terms and links.

Non-goals for this repo:

- Online medical advice or triage.
- Social engagement features.
- Fully automated publication of medical judgments.
- Commercialization.

## Source Tiers

Tier 1:

- WHO Disease Outbreak News and response pages.
- CDC current situation, clinical, and public health guidance pages.
- ECDC daily updates and threat assessments.
- PAHO and national or local health departments.

Tier 2:

- Peer-reviewed medical literature and official academic explainers.

Tier 3:

- AP, Reuters, BBC, NHK, Xinhua, and similarly reliable media. Use these for logistics and human context, not for overriding medical facts.

Tier 4:

- Social media and forum claims. Use only as rumor-monitoring input and never as fact records without confirmation.

## Current Event Data Policy

Do not merge conflicting official numbers by arithmetic. Store and display each official source snapshot with:

- source
- publication date and fetched date
- total cases
- confirmed / probable / suspected / non-case counts
- deaths
- risk text
- notes about scope and uncertainty

As of 2026-05-09, the tracker intentionally shows a source difference:

- WHO DON600, dated 2026-05-08: 8 cases, 6 laboratory-confirmed Andes virus infections, 2 probable cases, 3 deaths, global risk low, risk for passengers and crew moderate.
- ECDC daily page, dated 2026-05-08: 8 cases, 5 confirmed, 2 probable, 1 suspected, 3 deaths, EU/EEA general population risk very low.
- CDC Current Situation, dated 2026-05-08: no U.S. cases reported from this outbreak, risk to American public and travelers extremely low, routine travel can continue.

## Site Information Architecture

MVP pages:

- Dashboard: current status, source snapshots, risk signals, timeline, monitoring windows.
- Timeline: event chronology and source-backed updates.
- Sources: source registry and trust tier.
- Methodology: signal rules, update policy, disclaimers.

Future pages:

- Articles and explainers.
- Risk assessment.
- COVID comparison.
- Fact checks.
- Map and contact-chain visualization.
- RSS and email digest.

## Signal Rules

Green signals:

- Official public-risk ratings remain low, very low, or extremely low.
- New cases are still inside known passenger, crew, close-contact, or medical-care chains.
- Monitoring windows pass without cases outside known exposure pools.

Orange signals:

- Healthcare worker or ship medical staff case appears inside a known chain.
- WHO or another Tier 1 source describes likely limited human-to-human transmission in a defined setting.
- Case count grows but remains explainable by known incubation windows.

Red signals:

- Cases appear with no cruise, South America, rodent, healthcare, or close-contact exposure.
- Casual or short-contact transmission is confirmed by Tier 1 sources.
- Public risk level is upgraded by WHO, CDC, ECDC, or national authorities.
- Multiple healthcare infections occur despite appropriate infection prevention.
- Sequencing or official investigation suggests a material transmission change.

## Editorial Boundaries

Automation can:

- Fetch official pages.
- Detect content hash changes.
- Extract candidate numbers and risk language.
- Draft site updates and summaries.
- Flag source disagreements.

Automation must not publish as final without review when a change involves:

- Death counts.
- Treatment, vaccine, or symptom guidance.
- Human-to-human transmission expansion.
- Public-risk upgrades.
- Travel, isolation, or quarantine advice.
- COVID comparison claims.

## Technical Direction

Current repo:

- Static HTML/CSS/JS dashboard.
- Structured data in `data/incident-data.js`.
- CSV exports in `data/events.csv` and `data/sources.csv`.
- Official-source checker in `scripts/check-news.mjs`.
- Timestamped source snapshots in `data/source-snapshots/`.
- Generated update drafts in `data/update-drafts/`.
- Static methodology, sources, and update-history pages.
- Repo-local Codex skill in `.codex/skills/andes-report-updater`.
- App-level recurring automations for 6-hour news checks and weekly editorial review.

MVP backend direction:

- Next.js + TypeScript frontend.
- FastAPI or lightweight Node service for APIs.
- Postgres for source snapshots, facts, articles, and signal records.
- Object storage for raw HTML/PDF snapshots.
- Redis or queue-backed scheduled jobs for fetching and processing.

Longer-term architecture:

- Source registry.
- Snapshot store.
- Fact and case-count snapshot tables.
- Signal classifier.
- Editorial review layer.
- RSS and email alerts.

## Minimum Data Model

Use these entities when moving past static files:

- `sources`: publisher, tier, language, base URL, active status.
- `source_snapshots`: URL, title, published/fetched timestamps, content hash, parsed text, raw object path.
- `events`: outbreak or cluster-level record.
- `case_count_snapshots`: event + source snapshot + as-of date + case fields.
- `facts`: source-backed claims with verification status.
- `signals`: rule-triggered interpretation records.
- `articles`: published editorial content linked to facts.
- `correction_logs`: full correction history.

## MVP Roadmap

Phase 0:

- Source registry.
- Terminology list.
- Update playbook.
- Risk signal rules.
- Static dashboard.
- Static methodology/sources/history pages.
- Snapshot and draft-update pipeline.
- CI data validation.

Phase 1:

- Automated WHO/ECDC/CDC checks.
- Source snapshots and disagreement display.
- Human-reviewed update workflow.
- RSS output.
- Public correction/disclaimer pages.
- Deployment target.

Phase 2:

- Article/explainer system.
- Email digest.
- Map and timeline pages.
- Public methodology page.

## Implementation Progress

Completed by 2026-05-09:

- Static dashboard with source-aware metrics, timeline, route context, monitoring windows, and red/green signal cards.
- WHO DON600 / ECDC / CDC source snapshots displayed side by side.
- `npm run check-news`, `npm run snapshot-news`, and `npm run draft-update`.
- Data integrity validator and GitHub Actions workflow.
- Repo-local update skill and two active Codex app automations.
- Private GitHub repository on `main`.

Not complete yet:

- Production deployment.
- RSS feed.
- Email subscriptions.
- Backend database and CMS.
- Map visualization.
- Article/explainer content workflow.
- Multi-pathogen data model.

Phase 3:

- Multi-pathogen support.
- API and data downloads.
- PWA.
- Expert review workflow.

## Legal And Safety Notes

The site must say clearly that it is not medical advice. It must link original sources, summarize rather than republish full articles, and preserve uncertainty. Avoid collecting personal health information; any future risk questionnaire should run locally and avoid storage by default.
