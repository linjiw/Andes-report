#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const sourceConfigs = [
  {
    id: "who-don",
    label: "WHO Disease Outbreak News latest",
    tier: 1,
    url: "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON600",
    parser: parseWhoDon,
    baseline: {
      totalCases: 8,
      confirmed: 6,
      probable: 2,
      suspected: 0,
      deaths: 3
    }
  },
  {
    id: "ecdc-daily",
    label: "ECDC daily update",
    tier: 1,
    url: "https://www.ecdc.europa.eu/en/infectious-disease-topics/hantavirus-infection/surveillance-and-updates/andes-hantavirus-outbreak",
    parser: parseEcdc,
    baseline: {
      totalCases: 8,
      confirmed: 5,
      probable: 2,
      suspected: 1,
      deaths: 3
    }
  },
  {
    id: "who-response",
    label: "WHO response update, historical",
    tier: 1,
    url: "https://www.who.int/news/item/07-05-2026-who-s-response-to-hantavirus-cases-linked-to-a-cruise-ship",
    parser: parseWhoResponse,
    baseline: {
      totalCases: 8,
      confirmed: 5,
      deaths: 3
    }
  },
  {
    id: "cdc-current",
    label: "CDC current situation",
    tier: 1,
    url: "https://www.cdc.gov/hantavirus/situation-summary/index.html",
    parser: parseCdc,
    baseline: {
      riskExtremelyLow: true,
      noUsCases: true,
      routineTravelNormal: true,
      symptoms4to42Days: true
    }
  }
];

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
  ["ten", 10]
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
      /total of\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+cases/i,
      /(\d+)\s+cases\s+have been reported/i
    ]),
    confirmed: matchNumber(text, [/Confirmed cases\*+\s+(\d+)/i, /(\d+)\s+confirmed/i]),
    probable: matchNumber(text, [/Probable cases\*+\s+(\d+)/i, /(\d+)\s+probable/i]),
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
    riskLow: /risk .* low|low public health risk|risk assessment.*low/i.test(text)
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
    mentionsRiskLow: /Global level as low|global population .* low|risk .* global population .* low/i.test(text),
    shipRiskModerate: /ship is considered moderate|cruise ship as moderate|risk .* ship .* moderate/i.test(text),
    mentions147: /147/i.test(text),
    evidenceHumanToHuman: /Current evidence points to subsequent human-to-human transmission onboard/i.test(text)
  };
}

function parseCdc(text) {
  return {
    riskExtremelyLow: /extremely low/i.test(text),
    noUsCases: /no cases of Andes virus have been reported in the United States as a result of this outbreak/i.test(
      text
    ),
    routineTravelNormal: /Routine travel can continue as normal/i.test(text),
    symptoms4to42Days: /between 4 to 42 days after exposure/i.test(text)
  };
}

function compareToBaseline(parsed, baseline = {}) {
  const changes = [];
  for (const [key, expected] of Object.entries(baseline)) {
    if (parsed[key] !== null && parsed[key] !== undefined && parsed[key] !== expected) {
      changes.push({
        key,
        expected,
        observed: parsed[key],
        message: `${key}: baseline ${expected}, page ${parsed[key]}`
      });
    }
  }
  return changes;
}

function classifySignals(results) {
  const byId = new Map(results.map((result) => [result.id, result.parsed]));
  const who = byId.get("who-don") ?? {};
  const ecdc = byId.get("ecdc-daily") ?? {};
  const cdc = byId.get("cdc-current") ?? {};
  const warnings = results.flatMap((result) =>
    compareToBaseline(result.parsed, result.baseline).map((change) => ({
      sourceId: result.id,
      sourceLabel: result.label,
      ...change
    }))
  );

  return {
    officialRiskStillLow: Boolean(who.mentionsRiskLow && ecdc.riskVeryLow && cdc.riskExtremelyLow),
    cdcNoUsCases: Boolean(cdc.noUsCases),
    whoShipRiskModerate: Boolean(who.shipRiskModerate),
    whoOnboardHumanToHumanEvidence: Boolean(who.evidenceHumanToHuman),
    sourceDisagreement:
      who.confirmed !== undefined &&
      ecdc.confirmed !== undefined &&
      who.confirmed !== null &&
      ecdc.confirmed !== null &&
      who.confirmed !== ecdc.confirmed,
    warnings,
    humanReviewRequired: warnings.length > 0 || Boolean(who.evidenceHumanToHuman)
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
  return {
    id: source.id,
    label: source.label,
    tier: source.tier,
    url: source.url,
    ok: response.ok,
    status: response.status,
    contentHash: sha256(text),
    fetchedTextLength: text.length,
    parsed: source.parser(text),
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
        label: source.label,
        tier: source.tier,
        url: source.url,
        ok: false,
        status: "fetch-error",
        parsed: {},
        baseline: source.baseline,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return {
    schemaVersion: 1,
    checkedAt,
    results,
    signals: classifySignals(results)
  };
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

async function saveSnapshot(snapshot) {
  const fileName = `${slugTimestamp(snapshot.checkedAt)}.json`;
  const snapshotPath = join(repoRoot, "data/source-snapshots", fileName);
  const latestPath = join(repoRoot, "data/source-snapshots/latest.json");
  await writeJson(snapshotPath, snapshot);
  await writeJson(latestPath, snapshot);
  await writeJsData(join(repoRoot, "data/source-snapshots/latest.js"), "LATEST_SOURCE_SNAPSHOT", snapshot);
  return { snapshotPath, latestPath };
}

function formatHumanReviewReason(snapshot) {
  const reasons = [];
  if (snapshot.signals.warnings.length) reasons.push("baseline count or risk-language change");
  if (snapshot.signals.whoOnboardHumanToHumanEvidence) reasons.push("transmission assessment wording");
  return reasons.length ? reasons.join("; ") : "none";
}

function createDraftMarkdown(snapshot) {
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
  if (snapshot.signals.warnings.length) {
    lines.push(`- Open the official source(s) with baseline warnings and decide whether to update data/incident-data.js.`);
  } else {
    lines.push(`- No count or risk baseline changes detected. Keep the published dashboard unchanged unless editorial wording needs cleanup.`);
  }
  if (snapshot.signals.sourceDisagreement) {
    lines.push(`- Preserve WHO and ECDC as separate sourceSnapshots; do not merge their confirmed-case counts.`);
  }
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
    return { schemaVersion: 1, snapshots: [] };
  }
}

async function updateSnapshotIndex(snapshot, snapshotPath, draftPath = null) {
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
    sourceDisagreement: snapshot.signals.sourceDisagreement
  };
  const snapshots = [nextEntry, ...index.snapshots.filter((item) => item.path !== relativeSnapshotPath)].slice(0, 50);
  await writeJson(join(repoRoot, "data/source-snapshots/index.json"), {
    schemaVersion: 1,
    updatedAt: snapshot.checkedAt,
    snapshots
  });
  await writeJsData(join(repoRoot, "data/source-snapshots/index.js"), "SOURCE_SNAPSHOT_INDEX", {
    schemaVersion: 1,
    updatedAt: snapshot.checkedAt,
    snapshots
  });
}

function printText(snapshot) {
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

  const ecdc = snapshot.results.find((item) => item.id === "ecdc-daily")?.parsed ?? {};
  const who = snapshot.results.find((item) => item.id === "who-don")?.parsed ?? {};
  const cdc = snapshot.results.find((item) => item.id === "cdc-current")?.parsed ?? {};

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
    }, probable=${ecdc.probable ?? "unknown"}, suspected=${ecdc.suspected ?? "unknown"}, deaths=${
      ecdc.deaths ?? "unknown"
    }`
  );
  console.log(`- Human review required: ${snapshot.signals.humanReviewRequired}`);
  console.log(
    "- Manual next step: if counts changed or risk text is no longer low/very low/extremely low, update data/incident-data.js and re-check the relationship chain before changing the narrative."
  );
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

  if (args.mode === "snapshot") {
    const saved = await saveSnapshot(snapshot);
    await updateSnapshotIndex(snapshot, saved.snapshotPath);
    if (args.json) {
      console.log(JSON.stringify({ ...snapshot, saved }, null, 2));
    } else {
      printText(snapshot);
      console.log("");
      console.log(`Saved snapshot: ${saved.snapshotPath}`);
      console.log(`Saved latest: ${saved.latestPath}`);
    }
    return;
  }

  if (args.mode === "update-draft") {
    const saved = await saveSnapshot(snapshot);
    const draftPath = await saveDraft(snapshot);
    await updateSnapshotIndex(snapshot, saved.snapshotPath, draftPath);
    if (args.json) {
      console.log(JSON.stringify({ ...snapshot, saved, draftPath }, null, 2));
    } else {
      printText(snapshot);
      console.log("");
      console.log(`Saved snapshot: ${saved.snapshotPath}`);
      console.log(`Saved draft: ${draftPath}`);
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
