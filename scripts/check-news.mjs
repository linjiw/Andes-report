#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const SNAPSHOT_RETENTION = 50;
const sourceRegistry = JSON.parse(await readFile(join(repoRoot, "data/source-registry.json"), "utf8"));
const sourceRegistryById = new Map(sourceRegistry.sources.map((source) => [source.id, source]));

const numberWords = new Map([
  ["one", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9],
  ["ten", 10],
  ["eleven", 11],
  ["twelve", 12],
  ["thirteen", 13],
  ["fourteen", 14],
  ["fifteen", 15],
  ["sixteen", 16],
  ["seventeen", 17],
  ["eighteen", 18],
  ["nineteen", 19],
  ["twenty", 20]
]);

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&ldquo;/g, "\"")
    .replace(/&rdquo;/g, "\"")
    .replace(/&rsquo;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function slugTimestamp(iso) {
  return iso.replace(/[:.]/g, "-");
}

function asNumber(value) {
  if (!value) return null;
  const trimmed = value.toLowerCase();
  if (numberWords.has(trimmed)) return numberWords.get(trimmed);
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function matchNumber(text, patterns) {
  for (const pattern of patterns) {
    const found = text.match(pattern);
    if (found) return asNumber(found[1]);
  }
  return null;
}

function parseEcdc(text) {
  return {
    totalCases: matchNumber(text, [
      /total of\s+(\d+|[a-z]+)\s+cases/i,
      /(\d+)\s+cases\s+have been reported/i
    ]),
    confirmed: matchNumber(text, [/Confirmed cases\*+\s+(\d+)/i, /(\d+)\s+confirmed/i]),
    probable: matchNumber(text, [/Probable cases\*+\s+(\d+)/i, /(\d+)\s+probable/i]),
    inconclusive: matchNumber(text, [/Inconclusive cases\*+\s+(\d+)/i, /(\d+)\s+inconclusive/i]),
    suspected: matchNumber(text, [/Suspected cases\*+\s+(\d+)/i, /(\d+)\s+suspected/i]),
    deaths: matchNumber(text, [/Deaths\s+(\d+)/i, /(\d+)\s+deaths/i]),
    riskVeryLow:
      /risk to the EU\/EEA general population is very low/i.test(text) ||
      /EU\/EEA general population is very low/i.test(text),
    tenerifeMay10: /10 May/i.test(text) && /Tenerife/i.test(text)
  };
}

function parseWhoResponse(text) {
  return {
    totalCases: matchNumber(text, [
      /(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+cases have been reported/i
    ]),
    confirmed: matchNumber(text, [
      /(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+of the\s+\d+\s+cases have been confirmed/i,
      /(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+of the\s+\d+\s+reported cases have been confirmed/i,
      /(\d+)\s+confirmed cases/i
    ]),
    deaths: matchNumber(text, [/(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+deaths/i]),
    mentionsAndes: /Andes virus/i.test(text),
    riskLow:
      /WHO assesses the public health risk as low/i.test(text) ||
      /low public health risk/i.test(text) ||
      /risk assessment[^.]*low/i.test(text)
  };
}

function parseWhoDon(text) {
  return {
    totalCases: matchNumber(text, [
      /total of\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+cases/i,
      /(\d+)\s+cases,\s+including\s+\d+\s+deaths/i
    ]),
    confirmed: matchNumber(text, [
      /(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+cases have been laboratory-confirmed/i,
      /\((\d+)\s+confirmed and\s+\d+\s+probable cases\)/i
    ]),
    probable: matchNumber(text, [
      /(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+probable cases/i
    ]),
    suspected: matchNumber(text, [/(\d+)\s+suspected cases/i]) ?? 0,
    deaths: matchNumber(text, [
      /including\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+deaths/i,
      /Number of deaths\s+(\d+)/i
    ]),
    mentionsRiskLow:
      /risk is assessed at the Global level as low/i.test(text) ||
      /global population[^.]*low/i.test(text) ||
      /risk[^.]*global population[^.]*low/i.test(text),
    shipRiskModerate:
      /risk for passengers and crew[^.]*moderate/i.test(text) ||
      /ship is considered moderate/i.test(text) ||
      /cruise ship[^.]*moderate/i.test(text),
    mentions147: /147/i.test(text),
    evidenceHumanToHuman: /Current evidence points to subsequent human-to-human transmission onboard/i.test(text)
  };
}

function parseCdc(text) {
  return {
    riskExtremelyLow: /extremely low/i.test(text),
    noUsCases:
      /no cases of Andes virus have been (?:reported|confirmed) in the United States as a result of this outbreak/i.test(
        text
      ),
    routineTravelNormal: /Routine travel can continue as normal/i.test(text),
    symptoms4to42Days: /between 4 to 42 days after exposure/i.test(text)
  };
}

function normalizeFacts(source, parsed) {
  if (source.roles?.includes("primary-count")) {
    return {
      caseCounts: {
        total: parsed.totalCases ?? null,
        confirmed: parsed.confirmed ?? null,
        probable: parsed.probable ?? null,
        inconclusive: parsed.inconclusive ?? null,
        suspected: parsed.suspected ?? null,
        deaths: parsed.deaths ?? null
      },
      risk: {
        globalLow: Boolean(parsed.mentionsRiskLow),
        shipModerate: Boolean(parsed.shipRiskModerate)
      },
      transmission: {
        onboardHumanToHumanEvidence: Boolean(parsed.evidenceHumanToHuman)
      }
    };
  }

  if (source.roles?.includes("comparison-count")) {
    return {
      caseCounts: {
        total: parsed.totalCases ?? null,
        confirmed: parsed.confirmed ?? null,
        probable: parsed.probable ?? null,
        inconclusive: parsed.inconclusive ?? null,
        suspected: parsed.suspected ?? null,
        deaths: parsed.deaths ?? null
      },
      risk: {
        regionalVeryLow: Boolean(parsed.riskVeryLow)
      },
      travel: {
        tenerifeMay10: Boolean(parsed.tenerifeMay10)
      }
    };
  }

  if (source.roles?.includes("us-risk")) {
    return {
      risk: {
        usPublicExtremelyLow: Boolean(parsed.riskExtremelyLow)
      },
      cases: {
        noUsOutbreakLinkedCases: Boolean(parsed.noUsCases)
      }
    };
  }

  if (source.roles?.includes("historical-count-check")) {
    return {
      caseCounts: {
        total: parsed.totalCases ?? null,
        confirmed: parsed.confirmed ?? null,
        deaths: parsed.deaths ?? null
      },
      risk: {
        globalLow: Boolean(parsed.riskLow)
      }
    };
  }

  return {};
}

const parserByKey = new Map([
  ["who-don", parseWhoDon],
  ["ecdc-daily", parseEcdc],
  ["who-response", parseWhoResponse],
  ["cdc-current", parseCdc]
]);

const sourceConfigs = sourceRegistry.sources
  .filter((source) => source.pollable)
  .map((source) => ({
    id: source.id,
    label: source.checkLabel ?? source.name,
    tier: source.tier,
    url: source.canonicalUrl,
    parserKey: source.parserKey,
    parser: parserByKey.get(source.parserKey),
    baseline: source.baseline ?? {},
    roles: source.roles ?? []
  }));

for (const source of sourceConfigs) {
  if (!source.parser) {
    throw new Error(`Missing parser for pollable source: ${source.id} (${source.parserKey ?? "no parserKey"})`);
  }
}

function sourceIdByRole(role) {
  return sourceRegistry.sources.find((source) => source.roles?.includes(role) && source.pollable)?.id ?? null;
}

function compareToBaseline(parsed, baseline = {}) {
  const changes = [];
  for (const [key, expected] of Object.entries(baseline)) {
    if (parsed[key] === null || parsed[key] === undefined) {
      changes.push({
        key,
        expected,
        observed: parsed[key] ?? null,
        type: "parser-blank",
        message: `${key}: baseline ${expected}, parser returned blank`
      });
    } else if (parsed[key] !== expected) {
      changes.push({
        key,
        expected,
        observed: parsed[key],
        type: "baseline-change",
        message: `${key}: baseline ${expected}, page ${parsed[key]}`
      });
    }
  }
  return changes;
}

function classifySignals(results) {
  const byId = new Map(results.map((result) => [result.id, result.parsed]));
  const primaryCountSource = byId.get(sourceIdByRole("primary-count")) ?? {};
  const comparisonCountSource = byId.get(sourceIdByRole("comparison-count")) ?? {};
  const usRiskSource = byId.get(sourceIdByRole("us-risk")) ?? {};
  const warnings = results.flatMap((result) =>
    compareToBaseline(result.parsed, result.baseline).map((change) => ({
      sourceId: result.id,
      sourceLabel: result.label,
      ...change
    }))
  );

  return {
    officialRiskStillLow: Boolean(
      primaryCountSource.mentionsRiskLow && comparisonCountSource.riskVeryLow && usRiskSource.riskExtremelyLow
    ),
    cdcNoUsCases: Boolean(usRiskSource.noUsCases),
    whoShipRiskModerate: Boolean(primaryCountSource.shipRiskModerate),
    whoOnboardHumanToHumanEvidence: Boolean(primaryCountSource.evidenceHumanToHuman),
    sourceDisagreement:
      primaryCountSource.confirmed !== undefined &&
      comparisonCountSource.confirmed !== undefined &&
      primaryCountSource.confirmed !== null &&
      comparisonCountSource.confirmed !== null &&
      primaryCountSource.confirmed !== comparisonCountSource.confirmed,
    warnings,
    humanReviewRequired: warnings.length > 0 || Boolean(primaryCountSource.evidenceHumanToHuman)
  };
}

async function fetchSource(source) {
  const response = await fetch(source.url, {
    headers: {
      "user-agent": "Andes-report news checker"
    }
  });
  const body = await response.text();
  const text = stripHtml(body);
  const parsed = source.parser(text);
  return {
    id: source.id,
    sourceId: source.id,
    label: source.label,
    tier: source.tier,
    url: source.url,
    finalUrl: response.url,
    ok: response.ok,
    status: response.status,
    fetchedAt: new Date().toISOString(),
    parserKey: source.parserKey,
    parserVersion: 1,
    contentHash: sha256(text),
    fetchedTextLength: text.length,
    parsed,
    facts: normalizeFacts(source, parsed),
    baseline: source.baseline
  };
}

async function buildSnapshot() {
  const checkedAt = new Date().toISOString();
  const results = [];
  for (const source of sourceConfigs) {
    try {
      results.push(await fetchSource(source));
    } catch (error) {
      results.push({
        id: source.id,
        sourceId: source.id,
        label: source.label,
        tier: source.tier,
        url: source.url,
        finalUrl: source.url,
        ok: false,
        status: "fetch-error",
        fetchedAt: checkedAt,
        parserKey: source.parserKey,
        parserVersion: 1,
        parsed: {},
        facts: {},
        baseline: source.baseline,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  const snapshot = {
    schemaVersion: 2,
    checkedAt,
    results,
    signals: classifySignals(results)
  };
  snapshot.status = {
    fetchErrors: countFetchErrors(snapshot),
    parserBlanks: countParserBlanks(snapshot),
    snapshotReady: isStatusSnapshotReady(snapshot),
    humanReviewRequired: snapshot.signals.humanReviewRequired
  };
  return snapshot;
}

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function writeJson(path, value) {
  await ensureDir(dirname(path));
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeJsData(path, globalName, value) {
  await ensureDir(dirname(path));
  await writeFile(path, `window.${globalName} = ${JSON.stringify(value, null, 2)};\n`);
}

function countFetchErrors(snapshot) {
  return snapshot.results.filter((result) => !result.ok).length;
}

function countParserBlanks(snapshot) {
  return snapshot.signals.warnings.filter((warning) => warning.type === "parser-blank").length;
}

function isStatusSnapshotReady(snapshot) {
  return countFetchErrors(snapshot) === 0 && countParserBlanks(snapshot) === 0;
}

async function saveTimestampedSnapshot(snapshot) {
  const fileName = `${slugTimestamp(snapshot.checkedAt)}.json`;
  const snapshotPath = join(repoRoot, "data/source-snapshots", fileName);
  await writeJson(snapshotPath, snapshot);
  return snapshotPath;
}

async function publishLatestSnapshot(snapshot) {
  const latestPath = join(repoRoot, "data/source-snapshots/latest.json");
  await writeJson(latestPath, snapshot);
  await writeJsData(join(repoRoot, "data/source-snapshots/latest.js"), "LATEST_SOURCE_SNAPSHOT", snapshot);
  return latestPath;
}

function formatHumanReviewReason(snapshot) {
  const reasons = [];
  if (snapshot.signals.warnings.length) reasons.push("baseline count or risk-language change");
  if (snapshot.signals.whoOnboardHumanToHumanEvidence) reasons.push("transmission assessment wording");
  return reasons.length ? reasons.join("; ") : "none";
}

function createDraftMarkdown(snapshot) {
  const snapshotReady = isStatusSnapshotReady(snapshot);
  const lines = [
    `# Andes report update draft`,
    ``,
    `Checked at: ${snapshot.checkedAt}`,
    ``,
    `## Official-source status`,
    ``,
    `- WHO public risk still low: ${snapshot.signals.officialRiskStillLow}`,
    `- CDC reports no U.S. cases from this outbreak: ${snapshot.signals.cdcNoUsCases}`,
    `- WHO ship passenger/crew risk moderate: ${snapshot.signals.whoShipRiskModerate}`,
    `- WHO onboard human-to-human evidence language present: ${snapshot.signals.whoOnboardHumanToHumanEvidence}`,
    `- WHO/ECDC confirmed-count disagreement present: ${snapshot.signals.sourceDisagreement}`,
    `- Automated status snapshot ready: ${snapshotReady}`,
    ``,
    `## Parsed source snapshots`,
    ``
  ];

  for (const result of snapshot.results) {
    lines.push(`### ${result.label}`);
    lines.push(``);
    lines.push(`- URL: ${result.url}`);
    lines.push(`- HTTP: ${result.status}`);
    lines.push(`- Content hash: ${result.contentHash ?? "n/a"}`);
    lines.push(`- Parsed: \`${JSON.stringify(result.parsed)}\``);
    lines.push(`- Facts: \`${JSON.stringify(result.facts ?? {})}\``);
    const warnings = compareToBaseline(result.parsed, result.baseline);
    lines.push(`- Baseline warnings: ${warnings.length ? warnings.map((item) => item.message).join("; ") : "none"}`);
    lines.push(``);
  }

  lines.push(`## Human review`);
  lines.push(``);
  lines.push(`Required: ${snapshot.signals.humanReviewRequired}`);
  lines.push(`Reason: ${formatHumanReviewReason(snapshot)}`);
  lines.push(``);
  lines.push(`## Suggested editor action`);
  lines.push(``);
  if (!snapshotReady) {
    lines.push(
      `- This run should stay audit-only: keep the timestamped snapshot and draft, but do not replace the public \`data/source-snapshots/latest.*\` files.`
    );
  }
  if (snapshot.signals.warnings.length) {
    lines.push(`- Open the official source(s) with baseline warnings and decide whether to update data/incident-data.js.`);
  } else {
    lines.push(`- No count or risk baseline changes detected. Keep the published dashboard unchanged unless editorial wording needs cleanup.`);
  }
  if (snapshot.signals.sourceDisagreement) {
    lines.push(`- Preserve WHO and ECDC as separate sourceSnapshots; do not merge their confirmed-case counts.`);
  }
  lines.push(
    `- After verified data edits and \`npm run validate\`, the dashboard, sources page, and update-history page refresh automatically from the tracked data files.`
  );
  lines.push(`- Run validation before publishing: \`npm run validate\`.`);
  lines.push(``);

  return `${lines.join("\n")}\n`;
}

async function saveDraft(snapshot) {
  const fileName = `${slugTimestamp(snapshot.checkedAt)}.md`;
  const draftPath = join(repoRoot, "data/update-drafts", fileName);
  await ensureDir(dirname(draftPath));
  await writeFile(draftPath, createDraftMarkdown(snapshot));
  return draftPath;
}

async function readSnapshotIndex() {
  try {
    return JSON.parse(await readFile(join(repoRoot, "data/source-snapshots/index.json"), "utf8"));
  } catch {
    return { schemaVersion: 2, updatedAt: null, lastCheckedAt: null, snapshots: [] };
  }
}

async function updateSnapshotIndex(snapshot, snapshotPath, draftPath = null, statusPublished = true) {
  const index = await readSnapshotIndex();
  const relativeSnapshotPath = snapshotPath.replace(`${repoRoot}/`, "");
  const relativeDraftPath = draftPath ? draftPath.replace(`${repoRoot}/`, "") : null;
  const nextEntry = {
    checkedAt: snapshot.checkedAt,
    path: relativeSnapshotPath,
    draftPath: relativeDraftPath,
    warnings: snapshot.signals.warnings.length,
    humanReviewRequired: snapshot.signals.humanReviewRequired,
    officialRiskStillLow: snapshot.signals.officialRiskStillLow,
    sourceDisagreement: snapshot.signals.sourceDisagreement,
    snapshotReady: snapshot.status.snapshotReady,
    statusPublished,
    fetchErrors: countFetchErrors(snapshot),
    parserBlanks: countParserBlanks(snapshot)
  };
  const snapshots = [nextEntry, ...index.snapshots.filter((item) => item.path !== relativeSnapshotPath)].slice(
    0,
    SNAPSHOT_RETENTION
  );
  const updatedAt = statusPublished ? snapshot.checkedAt : index.updatedAt ?? null;
  await writeJson(join(repoRoot, "data/source-snapshots/index.json"), {
    schemaVersion: 2,
    updatedAt,
    lastCheckedAt: snapshot.checkedAt,
    snapshots
  });
  await writeJsData(join(repoRoot, "data/source-snapshots/index.js"), "SOURCE_SNAPSHOT_INDEX", {
    schemaVersion: 2,
    updatedAt,
    lastCheckedAt: snapshot.checkedAt,
    snapshots
  });
  await pruneSnapshotArtifacts(snapshots);
}

async function pruneSnapshotArtifacts(snapshots) {
  const snapshotDir = join(repoRoot, "data/source-snapshots");
  const draftDir = join(repoRoot, "data/update-drafts");
  const keepSnapshots = new Set(snapshots.map((item) => item.path?.split("/").pop()).filter(Boolean));
  const keepDrafts = new Set(snapshots.map((item) => item.draftPath?.split("/").pop()).filter(Boolean));

  try {
    const files = await readdir(snapshotDir);
    await Promise.all(
      files
        .filter((file) => file.endsWith(".json"))
        .filter((file) => file !== "index.json" && file !== "latest.json")
        .filter((file) => !keepSnapshots.has(file))
        .map((file) => unlink(join(snapshotDir, file)))
    );
  } catch {}

  try {
    const files = await readdir(draftDir);
    await Promise.all(
      files
        .filter((file) => file.endsWith(".md"))
        .filter((file) => !keepDrafts.has(file))
        .map((file) => unlink(join(draftDir, file)))
    );
  } catch {}
}

function printText(snapshot) {
  const snapshotReady = isStatusSnapshotReady(snapshot);
  console.log(`# Andes-report news check`);
  console.log(`Checked at: ${snapshot.checkedAt}`);
  console.log("");

  for (const result of snapshot.results) {
    console.log(`## ${result.label}`);
    console.log(`URL: ${result.url}`);
    console.log(`HTTP: ${result.status}`);
    if (result.error) console.log(`Error: ${result.error}`);
    console.log(`Content hash: ${result.contentHash ?? "n/a"}`);
    console.log(`Parsed: ${JSON.stringify(result.parsed)}`);
    const changes = compareToBaseline(result.parsed, result.baseline);
    if (changes.length) {
      console.log(`Count change warning: ${changes.map((change) => change.message).join("; ")}`);
    }
    console.log("");
  }

  const ecdc = snapshot.results.find((item) => item.id === sourceIdByRole("comparison-count"))?.parsed ?? {};
  const who = snapshot.results.find((item) => item.id === sourceIdByRole("primary-count"))?.parsed ?? {};
  const cdc = snapshot.results.find((item) => item.id === sourceIdByRole("us-risk"))?.parsed ?? {};

  console.log("## Signal summary");
  console.log(
    `- Official-risk check: WHO low=${Boolean(who.mentionsRiskLow)}, ECDC very low=${Boolean(
      ecdc.riskVeryLow
    )}, CDC extremely low=${Boolean(cdc.riskExtremelyLow)}, CDC no US cases=${Boolean(cdc.noUsCases)}`
  );
  console.log(
    `- WHO count check: total=${who.totalCases ?? "unknown"}, confirmed=${
      who.confirmed ?? "unknown"
    }, probable=${who.probable ?? "unknown"}, deaths=${who.deaths ?? "unknown"}, ship moderate=${Boolean(
      who.shipRiskModerate
    )}, onboard H2H evidence=${Boolean(who.evidenceHumanToHuman)}`
  );
  console.log(
    `- ECDC count check: total=${ecdc.totalCases ?? "unknown"}, confirmed=${
      ecdc.confirmed ?? "unknown"
    }, probable=${ecdc.probable ?? "unknown"}, inconclusive=${ecdc.inconclusive ?? "unknown"}, suspected=${
      ecdc.suspected ?? "unknown"
    }, deaths=${ecdc.deaths ?? "unknown"}`
  );
  console.log(`- Human review required: ${snapshot.signals.humanReviewRequired}`);
  console.log(`- Automated status snapshot ready: ${snapshotReady}`);
  console.log(
    "- Manual next step: if counts changed or risk text is no longer low/very low/extremely low, update data/incident-data.js and re-check the relationship chain before changing the narrative."
  );
  if (!snapshotReady) {
    console.log(
      "- Publication note: timestamped audit artifacts can be saved, but the public latest source snapshot should stay on the last successful run."
    );
  }
}

function parseArgs(argv) {
  const mode = argv.find((arg) => ["check", "snapshot", "update-draft"].includes(arg)) ?? "check";
  return {
    mode,
    json: argv.includes("--json")
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const snapshot = await buildSnapshot();
  const snapshotReady = isStatusSnapshotReady(snapshot);

  if (args.mode === "snapshot") {
    const snapshotPath = await saveTimestampedSnapshot(snapshot);
    const latestPath = snapshotReady ? await publishLatestSnapshot(snapshot) : null;
    await updateSnapshotIndex(snapshot, snapshotPath, null, snapshotReady);
    if (args.json) {
      console.log(JSON.stringify({ ...snapshot, snapshotPath, latestPath, snapshotReady }, null, 2));
    } else {
      printText(snapshot);
      console.log("");
      console.log(`Saved snapshot: ${snapshotPath}`);
      console.log(
        snapshotReady
          ? `Updated latest: ${latestPath}`
          : "Skipped latest snapshot publish because this run had fetch/parser failures."
      );
    }
    return;
  }

  if (args.mode === "update-draft") {
    const snapshotPath = await saveTimestampedSnapshot(snapshot);
    const draftPath = await saveDraft(snapshot);
    const latestPath = snapshotReady ? await publishLatestSnapshot(snapshot) : null;
    await updateSnapshotIndex(snapshot, snapshotPath, draftPath, snapshotReady);
    if (args.json) {
      console.log(JSON.stringify({ ...snapshot, snapshotPath, latestPath, draftPath, snapshotReady }, null, 2));
    } else {
      printText(snapshot);
      console.log("");
      console.log(`Saved snapshot: ${snapshotPath}`);
      console.log(`Saved draft: ${draftPath}`);
      console.log(
        snapshotReady
          ? `Updated latest: ${latestPath}`
          : "Skipped latest snapshot publish because this run had fetch/parser failures."
      );
    }
    return;
  }

  if (args.json) {
    console.log(JSON.stringify(snapshot, null, 2));
    return;
  }

  printText(snapshot);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
