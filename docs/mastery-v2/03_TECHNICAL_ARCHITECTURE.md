# 03 — TECHNICAL ARCHITECTURE & SAFE BRANCH STRATEGY
**Status:** engineering design for future implementation, no playable V2 yet.

## 1. Non-destructive engineering strategy

Main/current CLASSIC is represented by /index.html and its associated current tests. Do not touch /index.html, CLASSIC CSS/sound, or CLASSIC score key during experimentation. V2's first executable should be an explicit copy at **/mastery/index.html** made in a separate feature branch based on the approved planning branch. This isolates CSS, JS, Canvas render and Web Audio at first, avoids risky broad extraction in a mature 4,544-line monolith. Accept temporary duplication; only extract shared pure functions if test evidence shows this is worthwhile.

**Explicit rule:** planning documents in experiment/mastery-mode-v2-planning; create child implementation branches (e.g. experiment/mastery-v2/00-baseline). Never change live root path or Pages settings as a side effect.

Architecture milestones:
- A0: record immutable CLASSIC SHA and store hashes/screenshot checklist (copy not manually retyped).
- A1: isolated /mastery/index.html copy with title + localStorage namespace only; path must run in local HTTP server, NO selector.
- A2: isolate config/event instrumentation and ship tests before changing behavior.
- A3: separate active experiment subsystems **within mastery path** (where advantageous), based on adapter boundaries below.
- A4: once proven and creator approved, include /mastery/ on published site and optionally landing selector, preserving classic launch and scores.

## 2. Reference baseline code contracts (verified 2026-10-08)
Main index.html functions and structures:
- S: mutable run state, t/score/flow/combo, camera/zoom, arrays for missiles/bullets/particles, death scene fields.
- player: x/y/vx/vy/angle/hp, trail.
- control: pointer IDs/last X/Y, sensitivity, move and smoothed speed.
- applyRelativeMove(dx,dy,eventTime): direct mapping + camera compensation + worldBounds clipping.
- pointerDown/pointerMove/pointerUp: lower 62% steering, second pointer dash, optional getCoalescedEvents fallback.
- dash(): dash path destroys missiles/bullets using swept geometry.
- sweptCircleTOI / segmentMinDistanceSq / resolveCombatCollisions: chronological continuous collisions.
- difficulty(): five time thresholds + pressure/breath + bounded Field V scaling.
- zoomStageForTime(): [0,20,47,77,110]; zoomForStage(): [1,.8,.6,.42,.28].
- spawnMissile(): seven types with different speed/turn/retarget profiles and short commitment types.
- beginThreatPattern()/updatePatternDirector(): Pincer, Swarm, Chase, Cross, Gap recipes.
- update(dt): physics/state/audio; stage transitions; spawn orchestration; calls collision resolver.
- draw(), background(), drawPlanet(), drawDeathVista(): visuals.
- gameOver()/updateDeathScene(): cinematic continuation, localStorage rocketPanicV22Best.
- tests/core-physics.test.mjs extracts actual functions from HTML for Node test; .github/workflows/ci.yml currently covers PRs to main and pushes main.

**Critical:** active repo may change concurrently. At execution start check branch tip, verify this map and rebase only after comparing conflicts. Do not assume baseline mapping forever.

## 3. Modularity targets (internal V2 only)
Temporary isolated single-file copy is acceptable. When extracting, propose minimal modules:
mastery/
  index.html                 # experimental document; initially copied intact
  src/
    config.js               # all mode tuning constants; no magic overrides
    rng.js                  # seeded PRNG for fixture/repro runs
    telemetry.js            # tiny bounded event ring; no personal data
    encounter-director.js   # motives, spawn scheduling, safety candidates
    score.js                # mode-specific scoring/event provenance
    cinema.js               # stage visual recipes/death cues
  tests/
    controls.test.mjs
    collisions.test.mjs
    encounters.test.mjs
    stage-transitions.test.mjs
    perf-smoke.test.mjs
  fixtures/
    stage1.json
    stage5-long-run.json
    missile-cross.json
    mobile-bounds.json
  README.md
  QA_PLAYTEST_LOG.md

**Not a required upfront refactor.** Extract only pure/testable bits after baseline copy renders identically. If modules introduce deployment CORS quirks or alter audio initialization on iOS, keep working single-file architecture and use clear namespaced sections instead.

## 4. Explicit subsystem interfaces
Model as contracts, even if implemented inline first:

InputAdapter:
  sample(pointerId, timestamp, clientX, clientY)
  down/up/cancel(pointerId)
  normalized worldDelta = screenDelta * gain / cameraScale
  onSecondPointerDash()
  invariant: same net screen-distance for same finger-distance across stages except collision-clamped borders

ThreatDirector:
  update(dt, worldState, seed) -> list of spawn commands
  command = {timeOffset,spawnAngle,type,targetOffsetX,targetOffsetY,paceClass}
  invariant: bounded spawn count, no unavoidable blocking group at the entrance, no invisible enemy

EnemyController:
  updateMissile(m, dt, playerSample, worldState)
  metadata = {type,headingCommitUntil,turnBound,targetType,spawnGroupId,visualCue}
  invariant: no teleporting targets; distinguishable paths; current game projectile family physics preserved until validated

CollisionResolver:
  sweptCircleTOI + chronological events
  events = {type:'missile-pair'|'dash-hit'|'player-hit'|'bullet-hit',at,x,y,ids,provenanceHints}
  invariant: TOI ordering correct, dead projectiles cannot damage twice, invulnerability applied consistently

ScoreEngine:
  onCollision(event), onRunTick(dt), onNearMiss(...)
  storage uses 'rocketPanicMasteryV2Best' (never CLASSIC key).
  invariant: bounded multipliers, no offscreen passive farming, separate schema version

StageDirector:
  field(t), onBreakout(field), backgroundMood(field), deathVista(field)
  invariant: camera scale and perceived control sync; stage transitions do not spawn lethal overlaps

FeedbackController:
  effect(event, budget), music(event), audioMix(stage)
  invariant: projectile silhouettes override particles, no flash blanket over clear hazards, audio levels bounded

## 5. Feature switches / safe experimental toggles
All in MASTERY, defaults should duplicate CLASSIC until individually activated:
- masteryBalletInput = false
- masteryJudoAI = false
- masteryJudoScore = false
- masteryOrbitPhrases = false
- masteryCinematicPass = false
- masteryTelemetry = true for DEV; false for production
Flags should be selected at **startup** from a static mode configuration to prevent mid-run physics changes; DEV-only overrides may exist in local test runner but not public gameplay query params, unless explicitly justified. Reset each subsystem on new run.

## 6. Pointer input hazards & remedies
Baseline uses e.getCoalescedEvents() if available, otherwise [e]. MDN states method is not Baseline and coalescing may reduce granularity; keep strict fallback and do not assume cross-browser support.
- Empty getCoalescedEvents() result? include parent event fallback; avoid lost displacement.
- Normalize timestamps and avoid spikes/zeros; observe not invent velocity.
- On pointercancel/blur/visibilitychange, release active pointer and prevent stuck controls/dash repeats.
- Multiple pointer ordering: never swap steering pointer inadvertently.
- Pointer capture may fail, must not crash; graceful release.
- Swipe gain target remain stable across DPR/visualViewport safe areas and camera zoom.
- Clamped movement at world bounds must **not** accumulate invisible movement debt.
- No input filtering allowed on position path if it adds perceptible delay; smoothing for visual orientation ONLY.
- Dash path must resolve immediate contact even when followed by move events before next rAF.

Automated property tests: movement vectors by camera scale, time-normalized event batches, input sequences with cancel/restart, bounds, dash contact. Human verification on iPhone Safari indispensable.

## 7. Judo physics/score provenance
Do not conflate:
A) missile pair naturally crossing;
B) intentional local pursuit cross influenced by player action;
C) dash attack;
D) near miss;
E) visual explosion cluster with no actual multiple hits.

Telemetry log should be bounded and ephemeral by default: seed, fixture, field, event type and participant IDs, screen positions, player proximity, recent missile retarget changes, timestamps; no user identity/location/network transmission.
Attribution heuristics are uncertainty-aware: 'steered-likely', 'passive', 'unknown'. Reward can use defensible localized conditions while diagnostics display uncertainty. A future counterfactual re-simulation can refine scoring, not required for first MVP.
**Chain:** a temporal sequence of real collisions; do not add splash damage just to increase spectacle. Consider capped small chained bonus. Test against lure-free AFK cases and offscreen enemy pairs.

## 8. Encounter safety / pseudo-algorithm
1. Compute current screen-space bounds and player/dash state.
2. Build a candidate recipe from seed, tempo/motif family, enemy types.
3. Simulate candidate trajectory windows 0.8–1.8 s (tunable) on several physically plausible player response paths: stationary, left, right, up, down, sustained arc, dash when ready.
4. Reject candidates if all sampled feasible response paths collide before a humane minimum reaction time.
5. Reserve an escape corridor in candidate data; defer other ambient enemies overlapping it for a short interval.
6. If too many rejects, downgrade to a proven low-pressure fallback.
7. At runtime monitor actual cap, projected offscreen-entry speed, and collision-density spikes; cap and skip, don't overfill.
8. Record fixture seed and candidate rejection statistics.

**Honesty note:** finite path sampling cannot mathematically prove every encounter survivable, especially with previously spawned missiles. It is a practical risk-reduction system; use device playtests and stress fixtures to catch remaining failure cases.

## 9. Simulation / determinism
Current simulation uses requestAnimationFrame, capped dt ~0.033; random choices are Math.random. For reproducibility:
- introduce an injected seeded random stream **in MASTERY only** for enemy spawn/phrase selections.
- ideally isolate fixed-step physics after golden-master behavior tests, but defer a full timebase rewrite unless a test demonstrates necessity. Time manipulation can break sound, spawns, deaths, and input.
- store small fixture traces to reproduce collision/framerate pathologies in Node.
- fixture record = {version, seed, startingStage, viewportPx, fpsProfile, scriptedPlayerPath, expectedEventBounds}.
- run same seed at 30/60/120Hz profiles to reveal update ordering regressions, without expecting pixel-perfect floating point equality.
- all telemetry DEV-only unless consciously released; no cloud analytics by default.

## 10. Render/audio performance budget
First collect baseline data: device FPS/rAF, frame time p50/p95/p99, active missile counts, particles, canvas dimensions/DPR and test-duration memory estimate where possible.
Tentative *targets* (calibrate to actual devices):
- >95% of frames under 25ms at target 60Hz during typical stage V
- p99 <50ms without repeated multi-frame freeze
- no sustained audio breakup or clipping during max 3-collision chain
- no unlimited growing arrays/nodes, blur / gradient radius spikes
- screen output keeps readable player and threats even during full shockwave

Test with iPhone 12 Pro Max Safari as primary representative device plus one weaker device if available. Avoid promising exact 60 FPS at all times on all phones. Minimize heavy overdraw and large blur/particles when threat density high. Dynamic quality may drop *cosmetics only*, never change hitboxes or spawn fairness.

## 11. CI and preview delivery plan
- Existing workflow currently runs only when pushes go to main or PR targets main; plan separate test branch workflow trigger or scoped PR to main WITHOUT merging, but avoid deploying/mutating Pages.
- CI additions should assert CLASSIC source snapshot/hash unchanged and check MASTERY parsing, basic loaded HTML, legacy tests, new collision/input/director unit tests and seeded test runs.
- Local smoke: serve repo via HTTP (e.g. python3 -m http.server) and open /mastery/ (only after playable prototype exists).
- **Do not assume** https://<owner>.github.io/Rocket-Panic/mastery/ exists merely because code is in a feature branch.
- Before public preview, choose independent preview repository/domain OR deploy an explicit separate staging environment with a distinct Pages publishing pipeline and verify it cannot replace live Pages.
- For public release, after creator approval merge additive /mastery/index.html and links into main under test. Preserve current /index.html behavior and backing localStorage. Explicit rollback: remove selector/new route while retaining CLASSIC untouched.

## 12. Attack surface for regressions
| Risk | Symptoms | Mitigation |
| --- | --- | --- |
| giant inline monolith | accidental broad edit | isolated copy, diff check, limited-size PRs |
| pointer API on iOS | missing move/swipe/sticky | fallback tests, iPhone testing, reset on cancel |
| Camera scale | drag becomes sluggish Field V | screen-displacement invariant test |
| Swept collisions | tunneling, wrong collision ordering | property/regression tests, seed replay |
| Judo scoring | passive pair rewarded as mastery | tagged telemetry + score tests |
| V orbit director | unplayable cap/rng storms | spawn budget, candidate checks, safe fallback |
| Overbright effects | death without visible cause | visual occlusion budget + manual review |
| Web Audio policies | silent startup on iOS | existing gesture-unlock preserved |
| Branch build/deployment | classic overwritten | stage preview separate from live Pages |
| localStorage cross-mode | best score corruption | separate keys + migration tests |
| concurrent agent edits | stale assumptions/overwrite | branch head check, small commits, PR review |

## 13. Clean merge criteria
A V2 change MAY be considered for CLASSIC only if:
1. It improves a quantified gameplay defect rather than merely aesthetic taste.
2. It passes original test suite and recorded manual smoke sequences.
3. Creator explicitly approves that specific CLASSIC change.
4. Rollback and snapshot are documented.
**Default:** No cherry-picks from MASTERY to CLASSIC.
