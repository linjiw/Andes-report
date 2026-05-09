# News Update Playbook

Use this workflow for every automated or manual update to the Andes report site.

## 1. Check Sources

Run:

```bash
npm run check-news
```

To save an auditable source snapshot:

```bash
npm run snapshot-news
```

To save a snapshot plus an editor-facing update draft:

```bash
npm run draft-update
```

To run the full automated refresh cycle used by scheduled GitHub automation:

```bash
npm run update-news
```

To run the daily framework self-audit:

```bash
npm run framework-review
```

Important:

- `draft-update` is an audit step, not a substitute for updating `data/incident-data.js`.
- Only publish a new `data/source-snapshots/latest.*` snapshot to the webpage when the run fetched and parsed official sources successfully.
- The scheduled automation should commit and push generated snapshot/draft changes after validation so GitHub Pages redeploys the latest public status.
- The homepage should show whether the curated dashboard is already aligned with the latest successful official check; do not imply a fully synchronized narrative when only snapshot/history files were refreshed.
- `framework-review` is the daily meta-loop for parser drift, source-registry gaps, and dashboard-sync truthfulness.
- If you want parallel research with Codex subagents, do it in Codex app automation or an interactive Codex session, not in GitHub Actions.

Primary source order:

1. WHO DON latest event page.
2. CDC Current Situation and Andes virus pages.
3. ECDC daily update and ECDC assessment.
4. PAHO or national health authorities if relevant.
5. AP / Reuters for logistics only.

## 2. Compare Snapshots

When counts or risk language differ, preserve the difference. Do not merge WHO, CDC, and ECDC numbers into a single synthetic count.

Update these fields first:

- `data/incident-data.js` `sourceSnapshots`
- `stats`
- `caseStatus`
- `riskRatings`
- `events`
- `signals`
- `sources`

Then mirror important event/source rows in:

- `data/events.csv`
- `data/sources.csv`

When those files are updated and validated, the webpage is already refreshed because the static pages read these data files directly.

## 3. Classify The Change

Green:

- Public-risk ratings remain low, very low, or extremely low.
- New cases are still in known passenger, crew, close-contact, or healthcare chains.

Orange:

- New healthcare or ship medical staff case inside a known chain.
- Tier 1 source describes likely limited human-to-human transmission in a defined setting.

Red:

- Unknown-source cases.
- Confirmed casual or short-contact transmission.
- Public-risk rating upgrade.
- Multiple protected healthcare infections.
- Sequencing suggests material transmission change.

## 4. Rewrite Rules

Use calm, explicit language:

- Say `Andes virus`, not generic `Hantaan virus`, when this incident is the subject.
- Separate facts, interpretation, and uncertainty.
- Include as-of dates for counts.
- Explain why source differences exist when possible.
- Do not compare to COVID as a headline; explain concrete transmission differences.

Avoid:

- Fear language.
- Unqualified death-rate claims.
- Medical advice beyond official guidance.
- Treating media reports as authoritative case counts.

## 5. Validate

Before committing or opening a PR, run the offline validator:

```bash
npm run validate
```

Before changing source-driven facts or risk language, run the live official-source check:

```bash
npm run validate-with-news
```

For visual changes, serve locally and inspect:

```bash
python3 -m http.server 4173
```

There is no separate site build step for routine data refreshes. `index.html`, `sources.html`, and `history.html` read the tracked data and generated snapshot files directly.

For framework-level maintenance, review `data/framework-review/latest.md` after the daily review automation runs.

## 6. Human Review Required

Require human review before public release if the update changes:

- death count
- treatment or vaccine wording
- human-to-human transmission assessment
- risk level
- travel or quarantine guidance
- medical symptoms or when to seek care

This gate applies to curated dashboard facts, interpretation, and copy. Timestamped audit snapshots and clearly labeled status/history artifacts may still publish automatically, as long as the site does not imply the narrative was fully re-reviewed.

## 7. Commit Style

Use concise commits:

- `Update WHO DON600 source snapshot`
- `Add official-source disagreement display`
- `Refresh risk signal playbook`
