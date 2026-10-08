# MASTERY V2 — BASELINE SOURCE SNAPSHOT
**Captured:** 2026-10-08. **Snapshot type:** Git SHA and blob identity only; NOT a measured iPhone performance baseline, NOT a completed game test.
**Repo:** https://github.com/statego2/Rocket-Panic
**Main commit (latest observed via commit search):** 9b44802cbc86f60e88aebc1bc7a181b31d7b0358
**Planning branch name:** experiment/mastery-mode-v2-planning

| Original main path | Git blob SHA captured via GitHub fetch_file |
| --- | --- |
| README.md | ea0a21db17a0d418df6fd931ebb7a42ed118daf3 |
| index.html | 4262dcf85f3593f2f224aa65e3ca92cd93bb0f52 |
| .github/workflows/ci.yml | 43d78ed9c3cf0d5c2a86c5ad560dd3157f7ec376 |
| tests/core-physics.test.mjs | 2d60ac6098f15974eecf1d6aecc81bdaff504844 |

**Direct cross-branch verification at capture:** root /index.html fetched from planning branch AND main returned identical blob SHA 4262dcf85f3593f2f224aa65e3ca92cd93bb0f52. Therefore the planning commits did not change the CLASSIC root HTML at this point in time.

**Known source invariants:**
- CLASSIC score key: rocketPanicV22Best
- V2 reserved key: rocketPanicMasteryV2Best
- Field thresholds: 20,47,77,110 seconds
- Camera scale list: [1.00,.80,.60,.42,.28]
- Existing main Node test file: tests/core-physics.test.mjs
- Existing CI workflow: .github/workflows/ci.yml; configured for PRs targeting main, pushes to main, manual workflow dispatch.

**Future test runner:** Run node --test tests/*.test.mjs in the GitHub checkout/CI environment to confirm actual test status. No tests or live browser were run by this planning snapshot. **Mark M00 technically source-hashed, M01 and remaining device/test capture still TODO.**

**Concurrent change warning:** Repo may evolve; this snapshot is a historical baseline. Re-fetch current main before building. Do not overwrite any newer changes blindly.
