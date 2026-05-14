window.LATEST_SOURCE_SNAPSHOT = {
  "schemaVersion": 2,
  "checkedAt": "2026-05-14T07:22:23.791Z",
  "results": [
    {
      "id": "who-don",
      "sourceId": "who-don",
      "label": "WHO Disease Outbreak News latest",
      "tier": 1,
      "url": "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON600",
      "finalUrl": "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON600",
      "ok": true,
      "status": 200,
      "fetchedAt": "2026-05-14T07:22:24.235Z",
      "parserKey": "who-don",
      "parserVersion": 1,
      "contentHash": "f87fe9131aed9daf989dfe14b164dc9587b1a1dde4e8bb634b699507696c6d8f",
      "fetchedTextLength": 31714,
      "parsed": {
        "totalCases": 8,
        "confirmed": 6,
        "probable": 2,
        "suspected": 0,
        "deaths": 3,
        "mentionsRiskLow": true,
        "shipRiskModerate": true,
        "mentions147": true,
        "evidenceHumanToHuman": true
      },
      "facts": {
        "caseCounts": {
          "total": 8,
          "confirmed": 6,
          "probable": 2,
          "inconclusive": null,
          "suspected": 0,
          "deaths": 3
        },
        "risk": {
          "globalLow": true,
          "shipModerate": true
        },
        "transmission": {
          "onboardHumanToHumanEvidence": true
        }
      },
      "baseline": {
        "totalCases": 8,
        "confirmed": 6,
        "probable": 2,
        "suspected": 0,
        "deaths": 3
      }
    },
    {
      "id": "who-response",
      "sourceId": "who-response",
      "label": "WHO response update, historical",
      "tier": 1,
      "url": "https://www.who.int/news/item/07-05-2026-who-s-response-to-hantavirus-cases-linked-to-a-cruise-ship",
      "finalUrl": "https://www.who.int/news/item/07-05-2026-who-s-response-to-hantavirus-cases-linked-to-a-cruise-ship",
      "ok": true,
      "status": 200,
      "fetchedAt": "2026-05-14T07:22:24.264Z",
      "parserKey": "who-response",
      "parserVersion": 1,
      "contentHash": "4df5171c9e25ad3a28fd634954c0be6143eae546530c96170b34e58e337b372b",
      "fetchedTextLength": 5226,
      "parsed": {
        "totalCases": 8,
        "confirmed": 5,
        "deaths": 3,
        "mentionsAndes": true,
        "riskLow": true
      },
      "facts": {
        "caseCounts": {
          "total": 8,
          "confirmed": 5,
          "deaths": 3
        },
        "risk": {
          "globalLow": true
        }
      },
      "baseline": {
        "totalCases": 8,
        "confirmed": 5,
        "deaths": 3
      }
    },
    {
      "id": "ecdc-daily",
      "sourceId": "ecdc-daily",
      "label": "ECDC daily update",
      "tier": 1,
      "url": "https://www.ecdc.europa.eu/en/infectious-disease-topics/hantavirus-infection/surveillance-and-updates/andes-hantavirus-outbreak",
      "finalUrl": "https://www.ecdc.europa.eu/en/infectious-disease-topics/hantavirus-infection/surveillance-and-updates/andes-hantavirus-outbreak",
      "ok": true,
      "status": 200,
      "fetchedAt": "2026-05-14T07:22:25.005Z",
      "parserKey": "ecdc-daily",
      "parserVersion": 1,
      "contentHash": "dec049aaca61bdcf2ce81c299eddeb69761436276ef8b705559b44771462dff4",
      "fetchedTextLength": 5569,
      "parsed": {
        "totalCases": 11,
        "confirmed": 8,
        "probable": 2,
        "inconclusive": 1,
        "suspected": 0,
        "deaths": 3,
        "riskVeryLow": true,
        "tenerifeMay10": true
      },
      "facts": {
        "caseCounts": {
          "total": 11,
          "confirmed": 8,
          "probable": 2,
          "inconclusive": 1,
          "suspected": 0,
          "deaths": 3
        },
        "risk": {
          "regionalVeryLow": true
        },
        "travel": {
          "tenerifeMay10": true
        }
      },
      "baseline": {
        "totalCases": 11,
        "confirmed": 8,
        "probable": 2,
        "inconclusive": 1,
        "suspected": 0,
        "deaths": 3
      }
    },
    {
      "id": "cdc-current",
      "sourceId": "cdc-current",
      "label": "CDC current situation",
      "tier": 1,
      "url": "https://www.cdc.gov/hantavirus/situation-summary/index.html",
      "finalUrl": "https://www.cdc.gov/hantavirus/situation-summary/index.html",
      "ok": true,
      "status": 200,
      "fetchedAt": "2026-05-14T07:22:25.042Z",
      "parserKey": "cdc-current",
      "parserVersion": 1,
      "contentHash": "76f5d3c75ad23ff5b054c2d767132f5019eac5ad8245ab2ce33dad9dbacb51c7",
      "fetchedTextLength": 5824,
      "parsed": {
        "riskExtremelyLow": true,
        "noUsCases": true,
        "routineTravelNormal": false,
        "symptoms4to42Days": false
      },
      "facts": {
        "risk": {
          "usPublicExtremelyLow": true
        },
        "cases": {
          "noUsOutbreakLinkedCases": true
        }
      },
      "baseline": {
        "riskExtremelyLow": true,
        "noUsCases": true
      }
    }
  ],
  "signals": {
    "officialRiskStillLow": true,
    "cdcNoUsCases": true,
    "whoShipRiskModerate": true,
    "whoOnboardHumanToHumanEvidence": true,
    "sourceDisagreement": true,
    "warnings": [],
    "humanReviewRequired": true
  },
  "status": {
    "fetchErrors": 0,
    "parserBlanks": 0,
    "snapshotReady": true,
    "humanReviewRequired": true
  }
};
