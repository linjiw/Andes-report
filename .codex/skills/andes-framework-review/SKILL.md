---
name: andes-framework-review
description: Review and improve the Andes-report news framework. Use when the task is to audit source coverage, parser robustness, schema gaps, automation behavior, or daily/weekly improvement loops for this repo.
---

# Andes Framework Review

## Purpose

Find framework-level weaknesses before the next wave of news breaks the workflow. This skill is for source-registry design, parser drift, auditability, automation truthfulness, and recurring improvement loops.

## When To Use

- New official or media sources start mattering.
- Repeated parser blanks or fetch failures appear.
- The latest source snapshot and the curated dashboard start diverging.
- The repo needs a daily or weekly process for rethinking schema, automations, or review gates.

## Required Subagent Pattern

When using Codex app automation or an interactive Codex session, split the review in parallel:

1. Explorer A: workflow loopholes and publish-safety review.
2. Explorer B: source-registry, parser, and schema coverage review.
3. Main agent: synthesize findings, patch the repo, and update docs/report artifacts.

Do not ask subagents to edit overlapping files.

This applies only to Codex-driven review. GitHub Actions should not be described as using subagents; keep the CI path deterministic.

## Workflow

1. Read `docs/AUTOMATIONS.md`, `docs/NEWS_UPDATE_PLAYBOOK.md`, and `docs/DESIGN_PLAN.md`.
2. Run `npm run framework-review`.
3. Read `data/framework-review/latest.json` and recent `data/source-snapshots/` entries.
4. If framework issues are real, update the relevant scripts/docs/workflows immediately.
5. Re-run:

```bash
npm run validate
npm run framework-review
```

6. If the fix changes scheduled behavior, update `.github/workflows/`.
7. If the fix changes source policy or subagent usage, update repo-local skills.

## Review Targets

- Source registry coverage and duplicate metadata drift.
- Snapshot schema completeness and backward compatibility.
- Truthful separation between automated status pages and curated narrative.
- Workflow race conditions and artifact retention.
- Whether daily/weekly review loops produce actionable outputs.

## Deliverables

- Code or docs changes that narrow the loophole.
- Updated `data/framework-review/latest.json` and `latest.md`.
- A concise summary of what remains inherently non-automatable.
