---
name: andes-report-updater
description: Update the Andes-report repository from official public-health sources. Use when checking WHO/CDC/ECDC hantavirus news, organizing source snapshots, rewriting calm Chinese dashboard copy, updating timeline/risk-signal data, or preparing automation-driven website updates for this repo.
---

# Andes Report Updater

## Purpose

Maintain this repo as a source-traceable, signal-driven public health tracker for the MV Hondius / Andes virus incident. Favor official source snapshots and explicit uncertainty over a single flattened headline count.

## Workflow

1. Read [docs/NEWS_UPDATE_PLAYBOOK.md](../../../docs/NEWS_UPDATE_PLAYBOOK.md).
2. Run `npm run check-news`.
3. Run `npm run draft-update` when an auditable source snapshot and editor-facing draft should be saved, `npm run update-news` for the full scheduled refresh path, or `npm run framework-review` for the daily meta-review loop.
4. Verify official pages directly when the script detects count or risk-language changes, or when fetch/parser failures make the saved draft audit-only.
5. Update `data/incident-data.js` first, then mirror durable rows in `data/events.csv` and `data/sources.csv` in the same run; do not stop at a draft if the source change is clear.
6. Treat those data-file edits as the webpage update. The dashboard, sources page, and history page read repo data directly, so there is no extra manual HTML sync step for routine source refreshes.
7. Rewrite Chinese copy so it separates fact, interpretation, and uncertainty.
8. Validate with:

```bash
npm run validate
```

Run `npm run validate-with-news` before changing source-driven facts or risk language.

In the scheduled GitHub automation path, commit and push validated generated snapshot/draft files after the run so GitHub Pages publishes the latest public status automatically.

Only let a successful, publishable official-source check replace `data/source-snapshots/latest.*`. Keep failed fetch/parser runs as timestamped audit artifacts without pushing them into the public latest snapshot.

Make sure the homepage exposes whether the curated dashboard is aligned with the latest successful official check. If only snapshots/history were refreshed, label that honestly instead of implying the narrative was fully auto-updated.

When the task is framework hardening instead of a normal source refresh, use the repo-local `andes-framework-review` skill and parallel subagents rather than treating it as a routine data update.

## Source Policy

Use source priority:

1. WHO DON and WHO response pages.
2. CDC Current Situation / Andes virus / clinical guidance.
3. ECDC daily update and assessment.
4. National health agencies and PAHO.
5. AP / Reuters for logistics only.

Do not let media reports override Tier 1 case counts or risk language.

## Data Rules

Preserve source disagreements in `sourceSnapshots`. Do not average, add, or overwrite official counts across sources.

If a previous WHO/ECDC disagreement later disappears, remove stale disagreement framing from the dashboard copy and shift uncertainty back to transmission-chain or follow-up-monitoring questions.

Required fields for each snapshot:

- source and date
- total
- confirmed
- probable
- suspected
- nonCases
- deaths
- publicRisk
- note
- sourceIds

## Signal Rules

Green:

- Public risk remains low / very low / extremely low.
- New cases remain inside known passenger, crew, close-contact, or healthcare chains.

Watch/orange:

- Healthcare or ship medical staff case inside a known chain.
- Tier 1 source describes likely limited human-to-human transmission in a defined setting.

Red:

- Unknown-source cases.
- Casual short-contact transmission confirmed.
- Public-risk upgrade.
- Multiple protected healthcare infections.
- Sequencing suggests material transmission change.

## Rewrite Standards

Use calm and precise Chinese. Prefer:

- `Andes virus / 安第斯病毒`
- `汉坦病毒家族`
- `有限人传人`
- `已知接触链`
- `来源差异`

Avoid:

- fear framing
- “new COVID” framing
- unqualified fatality-rate claims
- medical advice not present in official guidance

## Human Review Gate

Require human review before treating a change as publish-ready when it changes:

- deaths
- treatment or vaccine wording
- transmission assessment
- risk level
- travel or quarantine guidance
- symptom or care-seeking guidance

This gate applies to curated dashboard interpretation and copy. It does not forbid publishing clearly labeled audit/status artifacts that say the latest official check still needs review.
