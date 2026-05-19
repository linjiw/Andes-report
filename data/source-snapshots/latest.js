window.LATEST_SOURCE_SNAPSHOT = {
  "schemaVersion": 2,
  "checkedAt": "2026-05-19T07:33:16.517Z",
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
      "fetchedAt": "2026-05-19T07:33:16.979Z",
      "parserKey": "who-don",
      "parserVersion": 1,
      "contentHash": "3f7746d6c73ae5004e82f775a62c30e6b6df8cea0d1868fb87b1c4ee6a7de32a",
      "fetchedTextLength": 31716,
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
      "fetchedAt": "2026-05-19T07:33:17.010Z",
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
      "fetchedAt": "2026-05-19T07:33:17.991Z",
      "parserKey": "ecdc-daily",
      "parserVersion": 1,
      "contentHash": "691c43e321d70215ca0d814e4f4ac0c34ee94c4271c9e57eb6c0be09a337bb97",
      "fetchedTextLength": 6080,
      "parsed": {
        "totalCases": 12,
        "confirmed": 9,
        "probable": 2,
        "inconclusive": 1,
        "suspected": 0,
        "deaths": 3,
        "riskVeryLow": false,
        "tenerifeMay10": false
      },
      "facts": {
        "caseCounts": {
          "total": 12,
          "confirmed": 9,
          "probable": 2,
          "inconclusive": 1,
          "suspected": 0,
          "deaths": 3
        },
        "risk": {
          "regionalVeryLow": false
        },
        "travel": {
          "tenerifeMay10": false
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
      "fetchedAt": "2026-05-19T07:33:18.058Z",
      "parserKey": "cdc-current",
      "parserVersion": 1,
      "contentHash": "5147721f755d51a4d86852c448d472d6c6e1e194c27d2d583d7b1a169aa25129",
      "fetchedTextLength": 6235,
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
    "officialRiskStillLow": false,
    "cdcNoUsCases": true,
    "whoShipRiskModerate": true,
    "whoOnboardHumanToHumanEvidence": true,
    "sourceDisagreement": true,
    "warnings": [
      {
        "sourceId": "ecdc-daily",
        "sourceLabel": "ECDC daily update",
        "key": "totalCases",
        "expected": 11,
        "observed": 12,
        "type": "baseline-change",
        "message": "totalCases: baseline 11, page 12"
      },
      {
        "sourceId": "ecdc-daily",
        "sourceLabel": "ECDC daily update",
        "key": "confirmed",
        "expected": 8,
        "observed": 9,
        "type": "baseline-change",
        "message": "confirmed: baseline 8, page 9"
      }
    ],
    "humanReviewRequired": true
  },
  "status": {
    "fetchErrors": 0,
    "parserBlanks": 0,
    "snapshotReady": true,
    "humanReviewRequired": true
  }
};
