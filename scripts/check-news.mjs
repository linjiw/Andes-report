#!/usr/bin/env node

const sources = [
  {
    id: "who-don",
    label: "WHO Disease Outbreak News latest",
    url: "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON600",
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
    url: "https://www.ecdc.europa.eu/en/infectious-disease-topics/hantavirus-infection/surveillance-and-updates/andes-hantavirus-outbreak",
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
    url: "https://www.who.int/news/item/07-05-2026-who-s-response-to-hantavirus-cases-linked-to-a-cruise-ship",
    baseline: {
      totalCases: 8,
      confirmed: 5,
      deaths: 3
    }
  },
  {
    id: "cdc-current",
    label: "CDC current situation",
    url: "https://www.cdc.gov/hantavirus/situation-summary/index.html"
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
    .replace(/\s+/g, " ")
    .trim();
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
    probable: matchNumber(text, [/(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+probable cases/i]),
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

function compareCounts(parsed, baseline) {
  const changes = [];
  if (!baseline) return changes;
  for (const [key, expected] of Object.entries(baseline)) {
    if (parsed[key] !== null && parsed[key] !== undefined && parsed[key] !== expected) {
      changes.push(`${key}: baseline ${expected}, page ${parsed[key]}`);
    }
  }
  return changes;
}

async function fetchSource(source) {
  const response = await fetch(source.url, {
    headers: {
      "user-agent": "Andes-report news checker"
    }
  });
  const body = await response.text();
  return {
    ...source,
    ok: response.ok,
    status: response.status,
    text: stripHtml(body)
  };
}

async function main() {
  const results = [];
  for (const source of sources) {
    try {
      const fetched = await fetchSource(source);
      let parsed = {};
      if (source.id === "ecdc-daily") parsed = parseEcdc(fetched.text);
      if (source.id === "who-response") parsed = parseWhoResponse(fetched.text);
      if (source.id === "who-don") parsed = parseWhoDon(fetched.text);
      if (source.id === "cdc-current") parsed = parseCdc(fetched.text);
      results.push({ ...fetched, parsed });
    } catch (error) {
      results.push({
        ...source,
        ok: false,
        status: "fetch-error",
        parsed: {},
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  const jsonMode = process.argv.includes("--json");
  if (jsonMode) {
    console.log(
      JSON.stringify(
        {
          checkedAt: new Date().toISOString(),
          results: results.map(({ text, ...result }) => result)
        },
        null,
        2
      )
    );
    return;
  }

  console.log(`# Andes-report news check`);
  console.log(`Checked at: ${new Date().toISOString()}`);
  console.log("");

  for (const result of results) {
    console.log(`## ${result.label}`);
    console.log(`URL: ${result.url}`);
    console.log(`HTTP: ${result.status}`);
    if (result.error) console.log(`Error: ${result.error}`);
    console.log(`Parsed: ${JSON.stringify(result.parsed)}`);
    const changes = compareCounts(result.parsed, result.baseline);
    if (changes.length) {
      console.log(`Count change warning: ${changes.join("; ")}`);
    }
    console.log("");
  }

  const ecdc = results.find((item) => item.id === "ecdc-daily")?.parsed ?? {};
  const who = results.find((item) => item.id === "who-don")?.parsed ?? {};
  const cdc = results.find((item) => item.id === "cdc-current")?.parsed ?? {};

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
  console.log(
    "- Manual next step: if counts changed or risk text is no longer low/very low/extremely low, update data/incident-data.js and re-check the relationship chain before changing the narrative."
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
