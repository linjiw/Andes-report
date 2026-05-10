window.LATEST_SOURCE_SNAPSHOT = {
  "schemaVersion": 2,
  "checkedAt": "2026-05-10T12:39:29.472Z",
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
      "fetchedAt": "2026-05-10T12:39:30.198Z",
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
      "fetchedAt": "2026-05-10T12:39:30.257Z",
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
      "fetchedAt": "2026-05-10T12:39:30.840Z",
      "parserKey": "ecdc-daily",
      "parserVersion": 1,
      "contentHash": "1de46ee4e5d5152434502f2b4c4c717bfaecb7339c8ef7222e48469cbefa0404",
      "fetchedTextLength": 5065,
      "parsed": {
        "totalCases": 8,
        "confirmed": 6,
        "probable": 2,
        "suspected": 0,
        "deaths": 3,
        "riskVeryLow": true,
        "tenerifeMay10": true
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
      "fetchedAt": "2026-05-10T12:39:30.929Z",
      "parserKey": "cdc-current",
      "parserVersion": 1,
      "contentHash": "07fb2cc4c0ec0ccd712292427faf7f4239b6570c2c1e9396bed15819478f0765",
      "fetchedTextLength": 8003,
      "parsed": {
        "riskExtremelyLow": true,
        "noUsCases": true,
        "routineTravelNormal": true,
        "symptoms4to42Days": true
      },
      "facts": {
        "risk": {
          "usPublicExtremelyLow": true
        },
        "travel": {
          "routineTravelNormal": true
        },
        "monitoring": {
          "symptoms4to42Days": true
        },
        "cases": {
          "noUsOutbreakLinkedCases": true
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
    "cdcNoUsCases": true,
    "whoShipRiskModerate": true,
    "whoOnboardHumanToHumanEvidence": true,
    "sourceDisagreement": false,
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
