# NEXT_ACTION — ROCKET PANIC MASTERY V2
**Status as of 2026-10-08:** documentation complete. **Implementation NOT STARTED.** No executable V2 has been added yet.
**Branch:** experiment/mastery-mode-v2-planning
**Live CLASSIC /index.html:** unchanged by this planning work.

## Instructions to any subsequent AI engineer
1. Read docs/mastery-v2/README.md and all 01–06 files; user selected ONLY Rocket Ballet, Missile Judo, Escape Velocity, Infinite Orbit.
2. Do NOT modify root /index.html or deploy/alter existing GitHub Pages.
3. Query current main and planning branch HEAD; inspect changes from baseline. The repository may be actively modified by other agents.
4. Pick the first unblocked work package from 04_IMPLEMENTATION_BACKLOG.md, starting M00, M01/M02. Work in feature branch derived from this planning branch; never automatically rebase onto future main without review.
5. For M00 obtain exact source content checksums and SHA, record outputs in a new docs/mastery-v2/BASELINE.md. Do not fabricate evidence.
6. For M02 copy the current approved baseline to /mastery/index.html on isolated feature branch. Keep it functionally and visually identical initially. First dev modifications permitted: non-visible namespaced localStorage and title/identification after snapshot.
7. Run the legacy Node tests and add path-specific V2 tests before experimenting with control or collision mechanics. Existing test: node --test tests/*.test.mjs; .github/workflows/ci.yml only currently checks main pushes / PRs targeting main.
8. Create small commits and PRs targeting experiment/mastery-mode-v2-planning (or a derived approved integration branch), not main. Mark tickets DONE only when tested.
9. Request creator/device comparison at G0/G1; never claim hands-on iPhone playtest without real result.
10. Do not invent a Pages URL: preview branch is not deployed automatically. Don't change Pages source; use local HTTP or separate preview site when authorized.

## Exact initial execution order / acceptance
**Step 1 M00:** snapshot main:
  - index.html hash, test paths, CI path, branch SHA; record device baseline pending.
  - Confirm Classic score localStorage key is rocketPanicV22Best.
  - Record current Field cutoffs 20/47/77/110, camera scales [1,.8,.6,.42,.28].
**Step 2 M02:** isolated cloned V2 path. Smoke-load as local HTML served by HTTP. Provide URL only after verification.
**Step 3 M03:** switch V2-only stored-best key to rocketPanicMasteryV2Best, validate Classic untouched.
**Step 4 M04:** V2 path static parser/core test plus root hash invariance check.
**Step 5 M01/M05/M06:** device screenshot baseline, RNG fixture injection and tiny telemetry ring.
**Step 6 M07 G0:** confirm clone parity before designing new gameplay.

## Stop conditions
- Any change to live CLASSIC without explicit creator permission.
- Any score namespace collision.
- Input regression, especially FIELD V dragging.
- False claim of playable hosted beta.
- Any request to "finish everything overnight" without tools for unattended continued execution: do current scoped tasks, report exact changes and next steps; do not claim asynchronous work.

## Prompt for future implementation sessions
> Continue Rocket Panic Mastery V2 from GitHub planning branch experiment/mastery-mode-v2-planning. Read docs/mastery-v2/README.md and NEXT_ACTION.md, then work on the next unblocked P0/P1 tasks from 04_IMPLEMENTATION_BACKLOG.md. Do not touch CLASSIC/main, run tests, commit feature branch changes and update next action with observed evidence. Provide exact branch and PR/commit links.

## Version control policy
The G4 decision is NOT implied by this document. A real player test and explicit release approval are required before merging anything into main.
