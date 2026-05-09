# Automations

This repo is set up for a recurring official-source check.

## News Check Automation

Schedule: every 6 hours.

Workspace: `/Users/linji/projects/Andes-report`

Expected behavior:

1. Run `npm run check-news`.
2. Run `npm run draft-update` when a durable audit artifact is useful.
3. Review WHO DON latest, ECDC daily update, and CDC Current Situation.
4. If official counts or risk language changed, update static data files and CSV exports.
5. Preserve source disagreements instead of flattening them.
6. Keep changes local and source-traceable unless the user explicitly asks for a publish/push step.
7. Report changed files and validation output.

The automation should use:

- [docs/NEWS_UPDATE_PLAYBOOK.md](/Users/linji/projects/Andes-report/docs/NEWS_UPDATE_PLAYBOOK.md)
- [docs/DESIGN_PLAN.md](/Users/linji/projects/Andes-report/docs/DESIGN_PLAN.md)
- [`.codex/skills/andes-report-updater/SKILL.md`](/Users/linji/projects/Andes-report/.codex/skills/andes-report-updater/SKILL.md)
