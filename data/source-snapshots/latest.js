window.LATEST_SOURCE_SNAPSHOT = {
  "schemaVersion": 2,
  "checkedAt": "2026-05-12T18:59:52.538Z",
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
      "fetchedAt": "2026-05-12T18:59:52.802Z",
      "parserKey": "who-don",
      "parserVersion": 1,
      "contentHash": "c1db0daf65f410585235d19a22121e2af0a326e8e128faceff6c8eeacc41f520",
      "fetchedTextLength": 31662,
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
      "fetchedAt": "2026-05-12T18:59:52.837Z",
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
      "fetchedAt": "2026-05-12T18:59:53.216Z",
      "parserKey": "ecdc-daily",
      "parserVersion": 1,
      "contentHash": "f18737932b689ef2cdab23c4f0997186d61432c78bda5f03c0077fc641fbb2bc",
      "fetchedTextLength": 5098,
      "parsed": {
        "totalCases": 11,
        "confirmed": 9,
        "probable": 2,
        "suspected": 0,
        "deaths": 3,
        "riskVeryLow": true,
        "tenerifeMay10": true
      },
      "facts": {
        "caseCounts": {
          "total": 11,
          "confirmed": 9,
          "probable": 2,
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
        "totalCases": 8,
        "confirmed": 6,
        "probable": 2,
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
      "fetchedAt": "2026-05-12T18:59:53.251Z",
      "parserKey": "cdc-current",
      "parserVersion": 1,
      "contentHash": "ca89b442f575612aaef1dbcf036f1ca3ade4837e81109171f2fefee32f7e6f1f",
      "fetchedTextLength": 5773,
      "parsed": {
        "riskExtremelyLow": true,
        "noUsCases": false,
        "routineTravelNormal": false,
        "symptoms4to42Days": false
      },
      "facts": {
        "risk": {
          "usPublicExtremelyLow": true
        },
        "travel": {
          "routineTravelNormal": false
        },
        "monitoring": {
          "symptoms4to42Days": false
        },
        "cases": {
          "noUsOutbreakLinkedCases": false
        }
      },
      "baseline": {
        "riskExtremelyLow": true,
        "noUsCases": true,
        "routineTravelNormal": true,
        "symptoms4to42Days": true
      }
    }
  ],
  "signals": {
    "officialRiskStillLow": true,
    "cdcNoUsCases": false,
    "whoShipRiskModerate": true,
    "whoOnboardHumanToHumanEvidence": true,
    "sourceDisagreement": true,
    "warnings": [
      {
        "sourceId": "ecdc-daily",
        "sourceLabel": "ECDC daily update",
        "key": "totalCases",
        "expected": 8,
        "observed": 11,
        "type": "baseline-change",
        "message": "totalCases: baseline 8, page 11"
      },
      {
        "sourceId": "ecdc-daily",
        "sourceLabel": "ECDC daily update",
        "key": "confirmed",
        "expected": 6,
        "observed": 9,
        "type": "baseline-change",
        "message": "confirmed: baseline 6, page 9"
      },
      {
        "sourceId": "cdc-current",
        "sourceLabel": "CDC current situation",
        "key": "noUsCases",
        "expected": true,
        "observed": false,
        "type": "baseline-change",
        "message": "noUsCases: baseline true, page false"
      },
      {
        "sourceId": "cdc-current",
        "sourceLabel": "CDC current situation",
        "key": "routineTravelNormal",
        "expected": true,
        "observed": false,
        "type": "baseline-change",
        "message": "routineTravelNormal: baseline true, page false"
      },
      {
        "sourceId": "cdc-current",
        "sourceLabel": "CDC current situation",
        "key": "symptoms4to42Days",
        "expected": true,
        "observed": false,
        "type": "baseline-change",
        "message": "symptoms4to42Days: baseline true, page false"
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
