# Round 2 changes

- Added `src/data/fixtures.ts` with typed synthetic document records derived from the four data CSVs.
- Replaced editable amount boxes with document selectors and record-linked comparison values.
- Added source cards with IDs, periods, versions, issue dates, statuses, and internal validation for employer records.
- Added explicit acknowledgement for non-active/unverified/synthetic sources before showing a comparison result.
- Added an illustrative corrected-document lineage panel.
- Integrated the existing in-memory, hash-chained `AppendOnlyLedger` for source selection, comparison recording, review acknowledgement, and verification.
- Exposed record IDs in reconciliation evidence and `docIds`.
- Added accessible status announcements and switch semantics to the theme toggle.
- Removed unused `zustand` dependency from `package.json`.
- Added a source provenance regression assertion to the existing test harness.
- Added a visible synthetic-data disclosure and updated README scope/limitations.

**Verification limitation:** the package install did not finish in the execution environment. Build/tests are not reported as passing. Please run `npm install`, `npm run typecheck`, `npm test`, and `npm run build` locally.
