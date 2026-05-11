# Andes framework review

Generated at: 2026-05-11T14:37:05.716Z
Latest official check: 2026-05-11T07:35:35.871Z

## Dashboard sync

- Overall aligned: true
- WHO aligned: true
- ECDC aligned: true
- CDC aligned: true

## Latest status

- Snapshot ready: true
- Human review required: true
- Fetch errors: 0
- Parser blanks: 0

## Key facts by source


## Warning patterns

- Recent runs reviewed: 5
- Runs with parser blanks: 1
- Runs with fetch errors: 0
- Runs requiring human review: 5

## Registry coverage

- Missing in registry: none
- Unused registry sources: none
- Pollable sources missing from latest snapshot: none

## Recommendations

- WHO Disease Outbreak News latest: `{"caseCounts":{"total":8,"confirmed":6,"probable":2,"suspected":0,"deaths":3},"risk":{"globalLow":true,"shipModerate":true},"transmission":{"onboardHumanToHumanEvidence":true}}`
- WHO response update, historical: `{"caseCounts":{"total":8,"confirmed":5,"deaths":3},"risk":{"globalLow":true}}`
- ECDC daily update: `{"caseCounts":{"total":8,"confirmed":6,"probable":2,"suspected":0,"deaths":3},"risk":{"regionalVeryLow":true},"travel":{"tenerifeMay10":true}}`
- CDC current situation: `{"risk":{"usPublicExtremelyLow":true},"travel":{"routineTravelNormal":true},"monitoring":{"symptoms4to42Days":true},"cases":{"noUsOutbreakLinkedCases":true}}`

## Recommendations

- Human review is still required for the latest official check before treating narrative/risk interpretation as settled.
- Review repeated parser/fetch failures and adjust source parsers or fallback handling.

