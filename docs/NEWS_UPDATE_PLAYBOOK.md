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

## 6. Human Review Required

Require human review before public release if the update changes:

- death count
- treatment or vaccine wording
- human-to-human transmission assessment
- risk level
- travel or quarantine guidance
- medical symptoms or when to seek care

## 7. Commit Style

Use concise commits:

- `Update WHO DON600 source snapshot`
- `Add official-source disagreement display`
- `Refresh risk signal playbook`
