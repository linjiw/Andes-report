#!/usr/bin/env node

globalThis.window = globalThis;
await import("../data/incident-data.js");

const data = globalThis.INCIDENT_DATA;
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

assert(data?.meta?.asOf, "meta.asOf is required");
assert(Array.isArray(data.sources), "sources must be an array");
assert(Array.isArray(data.events), "events must be an array");
assert(Array.isArray(data.sourceSnapshots), "sourceSnapshots must be an array");

const sourceMap = new Map(data.sources.map((source) => [source.id, source]));
const sourceIds = new Set(sourceMap.keys());

function checkIds(ids = [], path) {
  for (const id of ids) {
    assert(sourceIds.has(id), `${path} references missing sourceId: ${id}`);
  }
}

data.stats.forEach((item, index) => checkIds(item.sourceIds, `stats[${index}]`));
data.riskRatings.forEach((item, index) => checkIds(item.sourceIds, `riskRatings[${index}]`));
data.sourceSnapshots.forEach((item, index) => checkIds(item.sourceIds, `sourceSnapshots[${index}]`));
data.monitoringWindows.forEach((item, index) => checkIds(item.sourceIds, `monitoringWindows[${index}]`));
data.events.forEach((item, index) => checkIds(item.sourceIds, `events[${index}]`));
data.signals.forEach((item, index) => checkIds(item.sourceIds, `signals[${index}]`));

for (let index = 1; index < data.events.length; index += 1) {
  const prev = data.events[index - 1].date;
  const current = data.events[index].date;
  assert(prev <= current, `events are not sorted at index ${index}: ${prev} > ${current}`);
}

const whoSnapshot = data.sourceSnapshots.find((snapshot) => snapshot.source.includes("WHO"));
const ecdcSnapshot = data.sourceSnapshots.find((snapshot) => snapshot.source.includes("ECDC"));
assert(whoSnapshot, "WHO source snapshot is required");
assert(ecdcSnapshot, "ECDC source snapshot is required");

const sourceOrgAliases = [
  ["WHO", "WHO"],
  ["ECDC", "ECDC"],
  ["CDC", "CDC"],
  ["Reuters", "Reuters"],
  ["AP", "AP"]
];

for (const [index, snapshot] of data.sourceSnapshots.entries()) {
  const primaryId = snapshot.sourceIds?.[0];
  const primarySource = sourceMap.get(primaryId);
  assert(primarySource, `sourceSnapshots[${index}] missing primary source`);
  const expectedOrg = sourceOrgAliases.find(([label]) => snapshot.source.includes(label))?.[1];
  if (expectedOrg && primarySource) {
    assert(
      primarySource.org === expectedOrg,
      `sourceSnapshots[${index}] source "${snapshot.source}" points to ${primaryId} (${primarySource.org}), expected ${expectedOrg}`
    );
  }
}

if (whoSnapshot && ecdcSnapshot && whoSnapshot.confirmed !== ecdcSnapshot.confirmed) {
  assert(
    data.meta.posture.includes("差异") || data.summary.some((item) => item.includes("差异")),
    "WHO/ECDC disagreement must be explained in meta posture or summary"
  );
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Data validation passed: ${sourceIds.size} sources, ${data.events.length} events`);
