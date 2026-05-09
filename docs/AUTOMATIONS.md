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

## CI Split

`Validate` is intentionally offline for push and pull request events. It checks syntax and local data integrity without hitting WHO/CDC/ECDC on every code change.

`News Check And Publish` is the live network workflow. It runs on the 6-hour schedule, updates organized snapshot/draft artifacts, commits them back to `main`, and lets the normal Pages workflow deploy the refreshed public status.

The automation should use:

- [docs/NEWS_UPDATE_PLAYBOOK.md](/Users/linji/projects/Andes-report/docs/NEWS_UPDATE_PLAYBOOK.md)
- [docs/DESIGN_PLAN.md](/Users/linji/projects/Andes-report/docs/DESIGN_PLAN.md)
- [`.codex/skills/andes-report-updater/SKILL.md`](/Users/linji/projects/Andes-report/.codex/skills/andes-report-updater/SKILL.md)
