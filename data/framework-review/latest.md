# Andes framework review

Generated at: 2026-06-04T14:37:38.809Z
Latest official check: 2026-05-19T07:33:16.517Z

## Dashboard sync

- Overall aligned: false
- WHO aligned: true
- ECDC aligned: false
- CDC aligned: true

## Latest status

- Snapshot ready: true
- Human review required: true
- Fetch errors: 0
- Parser blanks: 0

## Key facts by source

- WHO Disease Outbreak News latest: `{"caseCounts":{"total":8,"confirmed":6,"probable":2,"inconclusive":null,"suspected":0,"deaths":3},"risk":{"globalLow":true,"shipModerate":true},"transmission":{"onboardHumanToHumanEvidence":true}}`
- WHO response update, historical: `{"caseCounts":{"total":8,"confirmed":5,"deaths":3},"risk":{"globalLow":true}}`
- ECDC daily update: `{"caseCounts":{"total":12,"confirmed":9,"probable":2,"inconclusive":1,"suspected":0,"deaths":3},"risk":{"regionalVeryLow":false},"travel":{"tenerifeMay10":false}}`
- CDC current situation: `{"risk":{"usPublicExtremelyLow":true},"cases":{"noUsOutbreakLinkedCases":true}}`

## Warning patterns

- Recent runs reviewed: 5
- Runs with parser blanks: 5
- Runs with fetch errors: 1
- Runs requiring human review: 5

## Registry coverage

- Missing in registry: none
- Unused registry sources: none
- Pollable sources missing from latest snapshot: none

## Recommendations

- Curated dashboard is not fully aligned with the latest successful official check.
- Human review is still required for the latest official check before treating narrative/risk interpretation as settled.
- Review repeated parser/fetch failures and adjust source parsers or fallback handling.

