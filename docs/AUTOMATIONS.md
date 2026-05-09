# Automations

This repo is set up for a recurring official-source check.

## News Check Automation

Schedule: every 6 hours.

Workspace: `/Users/linji/projects/Andes-report`

Expected behavior:

1. Run `npm run check-news`.
2. Run `npm run update-news` in scheduled automation so the run saves an auditable draft, validates, and refreshes public source-snapshot files when publishable.
3. Review WHO DON latest, ECDC daily update, and CDC Current Situation.
4. If official counts or risk language changed, update `data/incident-data.js` first, then mirror durable rows in `data/events.csv` and `data/sources.csv`.
5. Treat those data-file edits as the webpage update: `index.html`, `sources.html`, and other dashboard pages read the tracked data directly, so no separate HTML copy pass is required unless layout text itself changes.
6. Preserve source disagreements instead of flattening them, but remove stale disagreement language when WHO and ECDC later realign.
7. Keep failed fetch/parser runs as timestamped audit artifacts only; do not overwrite `data/source-snapshots/latest.*` on the public webpage unless the check is publishable.
8. The homepage should expose the latest successful official-check status separately from the curated dashboard narrative, so readers can tell when the raw check is newer than the manually curated interpretation.
9. Scheduled GitHub automation should commit and push validated generated status files so GitHub Pages redeploys the latest check state automatically.
10. Prune old timestamped snapshot/draft artifacts from the working tree so the repo does not grow without bound.
11. Report changed files and validation output.

Human-review-required runs are not blocked from publishing status artifacts. The block is on implying that the curated dashboard narrative, risk interpretation, or guidance copy was automatically re-approved.

## Daily Framework Review

Schedule: daily.

Expected behavior:

1. Run `npm run framework-review`.
2. Re-check whether the source registry, snapshot schema, and dashboard-sync rules still match the live news situation.
3. Record repeated parser blanks, fetch failures, source-registry gaps, and dashboard-alignment drift in `data/framework-review/latest.*`.
4. Commit and push the generated framework-review report when it changes.
5. In Codex app automation, use subagents in parallel for deeper review:
   - explorer A for workflow/publish loopholes
   - explorer B for source-registry and schema gaps
   - main agent to synthesize fixes and patch the repo

Note:

- GitHub Actions cannot run Codex subagents. Subagent-based research belongs to Codex app/desktop automation or interactive Codex sessions, while GitHub Actions should stick to deterministic scripts and report generation.

## CI Split

`Validate` is intentionally offline for push and pull request events. It checks syntax and local data integrity without hitting WHO/CDC/ECDC on every code change.

`News Check And Publish` is the live network workflow. It runs on the 6-hour schedule, updates organized snapshot/draft artifacts, commits them back to `main`, and lets the normal Pages workflow deploy the refreshed public status.

`Daily Framework Review` is the slower meta-loop. It does not claim to rewrite curated facts automatically; it exists to catch framework drift before new kinds of news break the system.

The automation should use:

- [docs/NEWS_UPDATE_PLAYBOOK.md](/Users/linji/projects/Andes-report/docs/NEWS_UPDATE_PLAYBOOK.md)
- [docs/DESIGN_PLAN.md](/Users/linji/projects/Andes-report/docs/DESIGN_PLAN.md)
- [`.codex/skills/andes-report-updater/SKILL.md`](/Users/linji/projects/Andes-report/.codex/skills/andes-report-updater/SKILL.md)
