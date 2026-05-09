#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));

globalThis.window = globalThis;
await import("../data/incident-data.js");

const incidentData = globalThis.INCIDENT_DATA;
const latestSnapshot = JSON.parse(await readFile(join(repoRoot, "data/source-snapshots/latest.json"), "utf8"));
const snapshotIndex = JSON.parse(await readFile(join(repoRoot, "data/source-snapshots/index.json"), "utf8"));
const sourceRegistry = JSON.parse(await readFile(join(repoRoot, "data/source-registry.json"), "utf8"));

function latestResultsById() {
  return new Map((latestSnapshot.results ?? []).map((result) => [result.id, result]));
}

function sourceIdByRole(role) {
  return sourceRegistry.sources.find((source) => source.roles?.includes(role) && source.active)?.id ?? null;
}

function findSnapshotByPrimarySourceId(sourceId) {
  return incidentData.sourceSnapshots.find((item) => item.sourceIds?.[0] === sourceId);
}

function countsMatch(dataSnapshot, parsed) {
  if (!dataSnapshot || !parsed) return false;
  return (
    dataSnapshot.total === (parsed.totalCases ?? null) &&
    dataSnapshot.confirmed === (parsed.confirmed ?? null) &&
    dataSnapshot.probable === (parsed.probable ?? null) &&
    dataSnapshot.suspected === (parsed.suspected ?? null) &&
    dataSnapshot.deaths === (parsed.deaths ?? null)
  );
}

function dashboardSyncStatus() {
  const byId = latestResultsById();
  const primaryCountSourceId = sourceIdByRole("primary-count");
  const comparisonCountSourceId = sourceIdByRole("comparison-count");
  const usRiskSourceId = sourceIdByRole("us-risk");
  const whoAligned = countsMatch(findSnapshotByPrimarySourceId(primaryCountSourceId), byId.get(primaryCountSourceId)?.parsed);
  const ecdcAligned = countsMatch(
    findSnapshotByPrimarySourceId(comparisonCountSourceId),
    byId.get(comparisonCountSourceId)?.parsed
  );
  const cdcSnapshot = findSnapshotByPrimarySourceId(usRiskSourceId);
  const cdcAligned =
    Boolean(cdcSnapshot) &&
    (!byId.get(usRiskSourceId)?.parsed?.riskExtremelyLow || /extremely low/i.test(cdcSnapshot.publicRisk ?? ""));

  return {
    whoAligned,
    ecdcAligned,
    cdcAligned,
    overallAligned: Boolean(whoAligned && ecdcAligned && cdcAligned)
  };
}

function repeatedWarningSummary() {
  const recent = snapshotIndex.snapshots.slice(0, 5);
  return {
    recentRuns: recent.length,
    parserBlankRuns: recent.filter((item) => (item.parserBlanks ?? 0) > 0).length,
    fetchErrorRuns: recent.filter((item) => (item.fetchErrors ?? 0) > 0).length,
    humanReviewRuns: recent.filter((item) => item.humanReviewRequired).length
  };
}

function registryCoverage() {
  const registryIds = new Set(sourceRegistry.sources.map((source) => source.id));
  const incidentIds = incidentData.sources.map((source) => source.id);
  const missingInRegistry = incidentIds.filter((id) => !registryIds.has(id));
  const unusedRegistrySources = sourceRegistry.sources.filter((source) => !incidentIds.includes(source.id)).map((source) => source.id);
  const pollableSources = sourceRegistry.sources.filter((source) => source.pollable).map((source) => source.id);
  const latestResultIds = new Set((latestSnapshot.results ?? []).map((result) => result.id));
  const pollableMissingFromLatest = pollableSources.filter((id) => !latestResultIds.has(id));
  return {
    missingInRegistry,
    unusedRegistrySources,
    pollableMissingFromLatest
  };
}

function buildRecommendations(report) {
  const recommendations = [];
  if (!report.dashboardSync.overallAligned) {
    recommendations.push("Curated dashboard is not fully aligned with the latest successful official check.");
  }
  if (report.latest.status?.humanReviewRequired) {
    recommendations.push("Human review is still required for the latest official check before treating narrative/risk interpretation as settled.");
  }
  if (report.warningPatterns.parserBlankRuns > 0 || report.warningPatterns.fetchErrorRuns > 0) {
    recommendations.push("Review repeated parser/fetch failures and adjust source parsers or fallback handling.");
  }
  if (report.registryCoverage.missingInRegistry.length || report.registryCoverage.pollableMissingFromLatest.length) {
    recommendations.push("Fix source registry coverage before adding more automated source roles.");
  }
  if (!recommendations.length) {
    recommendations.push("No immediate framework blockers detected; continue with daily source checks and weekly schema review.");
  }
  return recommendations;
}

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  latest: {
    checkedAt: latestSnapshot.checkedAt,
    status: latestSnapshot.status ?? {
      snapshotReady: false,
      humanReviewRequired: true,
      fetchErrors: null,
      parserBlanks: null
    },
    keyFacts: (latestSnapshot.results ?? []).map((result) => ({
      sourceId: result.id,
      label: result.label,
      facts: result.facts ?? {}
    }))
  },
  dashboardSync: dashboardSyncStatus(),
  warningPatterns: repeatedWarningSummary(),
  registryCoverage: registryCoverage()
};

report.recommendations = buildRecommendations(report);

function toMarkdown(value) {
  const lines = [
    "# Andes framework review",
    "",
    `Generated at: ${value.generatedAt}`,
    `Latest official check: ${value.latest.checkedAt}`,
    "",
    "## Dashboard sync",
    "",
    `- Overall aligned: ${value.dashboardSync.overallAligned}`,
    `- WHO aligned: ${value.dashboardSync.whoAligned}`,
    `- ECDC aligned: ${value.dashboardSync.ecdcAligned}`,
    `- CDC aligned: ${value.dashboardSync.cdcAligned}`,
    "",
    "## Latest status",
    "",
    `- Snapshot ready: ${value.latest.status.snapshotReady}`,
    `- Human review required: ${value.latest.status.humanReviewRequired}`,
    `- Fetch errors: ${value.latest.status.fetchErrors}`,
    `- Parser blanks: ${value.latest.status.parserBlanks}`,
    "",
    "## Key facts by source",
    "",
    "",
    "## Warning patterns",
    "",
    `- Recent runs reviewed: ${value.warningPatterns.recentRuns}`,
    `- Runs with parser blanks: ${value.warningPatterns.parserBlankRuns}`,
    `- Runs with fetch errors: ${value.warningPatterns.fetchErrorRuns}`,
    `- Runs requiring human review: ${value.warningPatterns.humanReviewRuns}`,
    "",
    "## Registry coverage",
    "",
    `- Missing in registry: ${value.registryCoverage.missingInRegistry.length ? value.registryCoverage.missingInRegistry.join(", ") : "none"}`,
    `- Unused registry sources: ${value.registryCoverage.unusedRegistrySources.length ? value.registryCoverage.unusedRegistrySources.join(", ") : "none"}`,
    `- Pollable sources missing from latest snapshot: ${value.registryCoverage.pollableMissingFromLatest.length ? value.registryCoverage.pollableMissingFromLatest.join(", ") : "none"}`,
    "",
    "## Recommendations",
    ""
  ];

  value.latest.keyFacts.forEach((item) => lines.push(`- ${item.label}: \`${JSON.stringify(item.facts)}\``));
  lines.push("");
  lines.push("## Recommendations");
  lines.push("");
  value.recommendations.forEach((item) => lines.push(`- ${item}`));
  lines.push("");
  return `${lines.join("\n")}\n`;
}

const reviewDir = join(repoRoot, "data/framework-review");
await mkdir(reviewDir, { recursive: true });
await writeFile(join(reviewDir, "latest.json"), `${JSON.stringify(report, null, 2)}\n`);
await writeFile(join(reviewDir, "latest.md"), toMarkdown(report));

console.log(`Framework review written: ${join(reviewDir, "latest.json")}`);
