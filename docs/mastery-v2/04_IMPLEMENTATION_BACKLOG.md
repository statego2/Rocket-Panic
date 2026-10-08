# 04 — IMPLEMENTATION BACKLOG, WBS & SCHEDULE
**Edition:** 2026-10-08 | **Status:** PLANNED, NOT EXECUTED | **Branch:** experiment/mastery-mode-v2-planning
**Target planning windows (illustrative, not scheduled autonomous work):** 09 Oct–19 Nov 2026. Start shifts if implementation begins later. Six phases; stop or replan at each gate.
**Expected human/integrated effort:** 90–150 focused engineering hours plus ~15–30 hours hands-on/device QA, with creative iteration potentially expanding scope.

## 0. Reading and execution conventions
- All tickets are scoped to isolated MASTERY branch/path. No edits to Classic root without creator approval.
- Priority: **P0** = correctness/safety; **P1** = MVP creative differentiation; **P2** = polish/optional.
- Effort = approximate hands-on engineering hours (not wall clock of an AI agent; excludes unpredictable playtest cycles).
- Status default = TODO until branch commits demonstrate otherwise. Document updates require actual evidence.
- Completion means **code + tests + manual screenshot/device evidence where specified + changelog**.
- Single numbered ticket is the unit of execution; prefer 1–3 related tickets per PR.
- Multiple agents should avoid editing the same huge HTML file concurrently; use feature branches/rebase and explicit merge order.

## 1. WBS & ticket backlog

### PHASE 0 — Protect the baseline (W1, 09–15 Oct; target ~20h)
| ID | P | Task | Depends | Est. | Definition of Done |
| --- | --- | --- | --- | ---: | --- |
| M00 | P0 | Pin exact CLASSIC SHA and checksums; document tags/names | — | 1h | reference SHA + hash of index.html and current tests recorded; no code change |
| M01 | P0 | Collect CLASSIC visual/audio/input smoke recordings at Fields I, III, V | M00 | 3h | clips/screenshots + score/death examples; note actual device/browser |
| M02 | P0 | Fork copied playable /mastery/index.html on branch ONLY | M00 | 2h | page renders/starts; root diff still zero |
| M03 | P0 | Isolate V2 storage, names, title and deep-link; protect best score | M02 | 2h | scores isolated in storage; CLASSIC key unaffected |
| M04 | P0 | Baseline automation: V2 parse + existing physics unit tests; main hash guard | M02 | 4h | Node test green; CI workflow on experiment branch / PR |
| M05 | P0 | Add seeded RNG as optional fixture injection; no behavior change default | M02 | 3h | repeating seed gives same spawn recipe / no new input lag |
| M06 | P0 | Add diagnostics fixture runner + bounded event log toggle | M05 | 3h | 30/60/120 simulated frame profiles and event export in DEV |
| M07 | P1 | Stage gate G0 review and risk register refresh | M01,M03,M04,M06 | 2h | creator can compare Classic and cloned copy, confirm identical gameplay |

**W1 end:** independent technical shell, golden baseline, not new design.

### PHASE 1 — Rocket Ballet / feel and trust (W2, 16–22 Oct; target ~22h)
| ID | P | Task | Depends | Est. | Definition of Done |
| --- | --- | --- | --- | ---: | --- |
| M08 | P0 | Control input invariants and replay sequence tests | M04,M06 | 4h | same screen delta across stage zoom; repeated touch, slow/fast drag |
| M09 | P0 | Fix confirmed pointer loss/empty-coalesced-events/cancel/blur cases | M08 | 5h | no stuck touch or teleport; all fallback fixtures green |
| M10 | P0 | Test and tune worldBounds edge behavior in narrow portrait screens | M08 | 3h | no movement debt; near-edge dash safe and predictable |
| M11 | P0 | Integrate dash/swept hit telemetry with frame-order trace | M06,M09 | 4h | dash crossing any projectile resolves once, not visually delayed |
| M12 | P1 | Build opt-in "Ballet arena" authored encounters B1/B2/B3 | M08,M11 | 4h | encounter replayable with seed, clear movement solutions |
| M13 | P0 | Gate G1: side-by-side phone input comparison | M09,M10,M11,M12 | 2h | creator verifies never worse movement than Classic on iPhone |

**W2 end:** core feel is proven. **If not, no Judo feature starts until corrected.**

### PHASE 2 — Missile Judo (W3, 23–29 Oct; target ~25h)
| ID | P | Task | Depends | Est. | Definition of Done |
| --- | --- | --- | --- | ---: | --- |
| M14 | P0 | Specify commitment windows for tracker/interceptor/lance/predictor | M12 | 4h | distinct turn/timing profile cases; no omniscient AI |
| M15 | P1 | Implement 3 opportunity recipes with safe escape fallback | M14 | 6h | repeatable intentional pair collisions, readable lanes, no inevitable death |
| M16 | P0 | Extend precise collision provenance + ID tracking | M11,M15 | 5h | passive, dash, local influenced, unknown classified, no invented cause |
| M17 | P1 | V2 score engine: intentional collision reward / bounded chain timing | M16 | 4h | score attributable to actual events; passive far-away impact low reward |
| M18 | P0 | Unit/property/stress tests for pair order, dead objects, chain timing | M16,M17 | 4h | 30/60/120 profiles and repeated seeds green |
| M19 | P0 | Gate G2: 5–10 comparative runs and creator feedback | M15,M18 | 2h | at least one repeatable deliberate "I caused that" sequence documented |

**W3 end:** defensible initial fun prototype. **If no intentional skill emerges, simplify/scrap Judo tuning.**

### PHASE 3 — Infinite Orbit (W4, 30 Oct–05 Nov; target ~23h)
| ID | P | Task | Depends | Est. | Definition of Done |
| --- | --- | --- | --- | ---: | --- |
| M20 | P1 | Build Field V motif state machine | M19 | 4h | named motif transitions and intentional recovery period |
| M21 | P1 | Implement Pursuit Spiral, Lance Corridor, Orbital Crossfire | M20 | 7h | 3 actually distinct decisions and deterministic test seeds |
| M22 | P0 | Candidate spawn safety checks & fallback | M20,M21 | 5h | sampled response-path checks; fallback on rejected/overflow spawns |
| M23 | P0 | Bounded long-run progression / cap stress + no circling exploit tests | M21,M22 | 4h | ten-minute seeded runs complete; caps stable; exploit report |
| M24 | P1 | Tune motif pace, breath, enemy ratios and score consequences | M23 | 3h | no fake rest; long-run pressure purposeful not random storm |

**W4 end:** FIELD V is varied and tactically meaningful with bounded difficulty.

### PHASE 4 — Escape Velocity & feedback (W5, 06–12 Nov; target ~21h)
| ID | P | Task | Depends | Est. | Definition of Done |
| --- | --- | --- | --- | ---: | --- |
| M25 | P1 | Design 5-field atmosphere storyboard and transition color values | M19 | 3h | five visually distinct beat boards annotated for readability |
| M26 | P1 | Implement mode-only planet/depth/space visual choreography | M25 | 6h | Field I–V read differently; identical hitboxes and camera invariants |
| M27 | P0 | Render clarity pass: threats foreground to FX, bounded bloom | M26,M21 | 4h | no crucial hazards hidden at worst-case chains |
| M28 | P1 | Audio mix adaptation for deliberate collision + 3 stage motifs | M17,M21 | 4h | coherent with existing leitmotif; no repeated clipped/loud explosions |
| M29 | P1 | Stage-aware death-vista enhancement + screenshot validation | M26 | 3h | distinct death scenes and world persistence across all five Fields |
| M30 | P0 | Full stage transition / audio lifecycle smoke | M27,M28,M29 | 1h | iOS gesture-unlock, restart, death, re-enter successful |

**W5 end:** cinematic promise delivered without diminishing fair play.

### PHASE 5 — Integrate, A/B test, decide (W6, 13–19 Nov; target ~22h + 15–30h QA)
| ID | P | Task | Depends | Est. | Definition of Done |
| --- | --- | --- | --- | ---: | --- |
| M31 | P0 | Static regression / JS parse / screenshot diffs / link checks | M18,M23,M30 | 3h | CLASSIC untouched; V2 load reliable; smoke docs current |
| M32 | P0 | iPhone and lower-powered-browser performance profiling | M31 | 4h | stage V 10-min runs; frame distributions, audio dropout reports |
| M33 | P1 | A/B playtest scenario matrix and 5–10 external participants if feasible | M31,M32 | 4h | first-time comprehension, intention-to-repeat and skill visibility notes |
| M34 | P1 | Balance revision pass using evidence | M33 | 5h | prioritize top 3 observed game-feel faults; tests adjusted |
| M35 | P0 | Regression + final gate artifact | M34 | 3h | zero P0; P1 known deviations listed; coverage and QA evidence linked |
| M36 | P1 | Final release option analysis + rollback package | M35 | 2h | options: keep beta, select fixes, public mode, or cancel |
| M37 | P0 | Creator GO / NO-GO; no silent shipping | M36 | 1h | explicit creator decision; if go, separate public release ticket required |

**W6 end:** decisive prototype review, not forced release.

### POST-GATE (only if creator approves public mode)
| ID | P | Task | Depends | Est. | Definition of Done |
| --- | --- | --- | --- | ---: | --- |
| M38 | P0 | Plan separate staging Pages / independent preview URL safely | M37 | 2–4h | external preview verified, existing Pages not overwritten |
| M39 | P1 | Add minimal mode selector and separate per-mode scores | M37,M38 | 3–5h | Classic still one-click; Mastery opt-in; clear mode distinction |
| M40 | P0 | Main PR with rollback instructions + full regression | M39 | 3–5h | explicit approval before merge/deploy; rollback demonstrated |
| M41 | P2 | Optional leaderboard or polish discussion | M40 | unscheduled | no scope creep without fresh charter |

## 2. Dependency network / critical path

**Critical chain (near-sequential):**
M00 -> M02 -> M04 -> M08 -> M09 -> M11 -> M14 -> M15 -> M16 -> M17/M18 -> M19 -> M20 -> M21 -> M22 -> M23 -> M27/M30 -> M31 -> M32 -> M33 -> M34 -> M35 -> M36 -> M37.

**Possible non-colliding parallel streams** (only after file extraction or separate files):
- Visual storyboard M25 can start after basic gameplay foundations M19; no need to wait for motif implementation.
- Score tests M17/M18 can proceed alongside limited AI spawn tuning if independent files.
- Staging research M38 can be investigated early; changing Pages settings blocked until approval.
- Sound mockups may be explored early without implementing audio changes to live game.
- Device QA captures run after every stage, not only W6.

**Do not parallelize:** two agents simultaneously rewriting mastery/index.html; balance and control patching in same function; modifying score schema while QA fixtures are being frozen.

## 3. Schedule — view by week

| Week | Proposed dates | Dominant deliverable | Gate | Hours eng |
| --- | --- | --- | --- | ---: |
| W1 | 09–15 Oct 2026 | frozen clone, baseline tests/fixtures | G0 | ~20 |
| W2 | 16–22 Oct 2026 | trusted controls, Ballet encounters | G1 | ~22 |
| W3 | 23–29 Oct 2026 | Judo intentional skill loop | G2 | ~25 |
| W4 | 30 Oct–05 Nov 2026 | 3-state Infinite Orbit | intermediate | ~23 |
| W5 | 06–12 Nov 2026 | Escape Velocity production & audio | G3 readiness | ~21 |
| W6 | 13–19 Nov 2026 | performance, A/B and release decision | G3/G4 | ~22 |
| **Total** | **6 nominal weeks** | **~133 engineering hours** | **5 decision gates** | **~133** |

Device QA adds ~15–30 hours including several controlled 5–10 minute gameplay loops and test reporting. Schedule is a **planning baseline**, not active clock reservations or automated background work.

## 4. Scope control: change request template
Every new idea should be written as:
- Problem observed
- Hypothesis / intended feeling
- Minimal experiment
- Tickets affected
- New engineering/testing hours
- Could it break CLASSIC? Yes/No
- Kill metric / reversal criterion
- Human decision (accept / defer / reject)

**Default response to exciting unrelated ideas:** put into parking lot, do not smuggle into V2.

## 5. Mandatory deliverable evidence per ticket
- short design intent
- changed file list and diff scope
- automated test output and command
- device/browser test observation when relevant
- screenshots/GIF/trace for visual/mechanical changes
- known limitations and rollback step
- updated status in this backlog (TODO -> DOING -> DONE; never mark DONE based only on a proposed patch)

## 6. Producer / AI agent workflow
At each future work session:
1. Read root README and all docs/mastery-v2/ files; locate NEXT_ACTION.
2. Verify current branch tip vs last documented SHA; inspect any concurrent changes.
3. Pick next unblocked P0/P1 ticket; describe its acceptance criteria.
4. Create dedicated feature branch from approved experimental baseline.
5. Implement minimal diff and automated tests.
6. Validate manually when browser/device evidence is required; **never claim device testing if not performed**.
7. Create PR to experimental integration branch; do not target main without explicit approval.
8. Update ticket status, fresh known issues and exact next action.
9. If blocked on hands-on user testing, report concrete step, don't improvise success.
10. Repeat with a new user request/work session.

## 7. Gantt-like dependency overlay
W1: M00–M07 [Baseline]
W2: M08–M13 [Ballet]
W3: M14–M19 [Judo]
W4: M20–M24 [Orbit]
W5: M25–M30 [Cinema]
W6: M31–M37 [Validation]
M38–M41: [Separate post-approval release, unscheduled]

**Stop rules**
- G0 fail: No visual/physics changes until baseline repeatable.
- G1 fail: No further high-order mechanics until control trustworthy.
- G2 fail: Reconsider Judo design, do not paper over fun problem with FX.
- G3 fail: Stop release; correct fairness/performance/readability.
- G4 no-go: Preserve CLASSIC; archive experiment or selectively harvest tested patches.
