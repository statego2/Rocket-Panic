# 05 — QA, EXPERIMENT DESIGN, KPIs & RELEASE CONTROL
**V2 still in planning.** Every threshold below is a proposed quality bar to validate, not a claim of measured current gameplay.

## I. Quality hierarchy
P0: CLASSIC never damaged; control predictability; collision correctness; survivable authored patterns; safe deployment; no crashes.
P1: expert mastery feels intentional; five stages cinematic distinct; audio crisp; Field V varied.
P2: polish, secondary stats and aesthetic variation.

A game with spectacular particles but lost pointer control is NOT ship-ready.

## II. Baseline capture before changes (G0)
Capture and archive separately:
- exact main SHA and hash of original index.html.
- Browser & device: iPhone 12 Pro Max Safari (target), one other mobile if available, desktop touch/mouse fallback.
- 3 sample runs, stage progression, 2 death samples (Field I and V), both audio on/off.
- original pointer travel amount near middle/edge and at Field I/V.
- original frame time traces in 2+ minute Field V run or a debug stage warp fixture.
- original screenshots for stage visual treatments, launch, death, scores.
- test output node --test tests/*.test.mjs.

Record **observed** values; never synthesize them.

## III. Automated tests (required in V2 path)

### A. Browser input / control
C-01: drag +80 px / -60 px produces same intended on-screen displacement across each stage scale at middle of field, within configured tolerance and clipping exceptions.
C-02: single slow drag / 5 fast coalesced segments / 1 parent event yield same final position.
C-03: getCoalescedEvents undefined OR returns [] => process parent event.
C-04: pointer cancel, visibilitychange, blur and release never leave control.active locked.
C-05: second pointer generates one dash while first pointer remains steering; repeated tap while cooldown does not repeat.
C-06: finger re-touch elsewhere does not teleport ship.
C-07: border clamp does not accumulate movement and doesn't collapse available range at stage V.
C-08: dash swept corridor kills intersecting missiles/bullets regardless of display frame ordering.
C-09: device variation simulation with timestamp discontinuities does not produce NaN/Infinity.

### B. Collision/physics
P-01: two missiles pass through each other within one frame => collision counted.
P-02: player impact precedes later missile-pair impact => player damage, no false pair destruction.
P-03: pair collision precedes player impact => destroyed projectile can't hit player later that frame.
P-04: dash crossing missiles/bullets clears them, scores exactly once, respects dash invulnerability.
P-05: near miss means swept distance avoids actual contact, not a race between event handlers.
P-06: same enemy never dies twice or emits two death audio cues.
P-07: seeded trajectory at 30/60/120 fps does not materially change collision ordering.
P-08: all positions, sizes and velocities finite even during 10-minute fixture.

### C. Intent attribution and score
J-01: offscreen passive missile-pair hit -> no intentional-play award.
J-02: successful local chase cross has diagnostic evidence (recent retarget/heading influence).
J-03: uncertain causality is tagged unknown; cannot be force-reclassified as intentional for scoring.
J-04: two real pair collisions inside chain window -> bounded time-chain bonus.
J-05: one explosion bloom without second physics impact -> no fictitious chain bonus.
J-06: near-miss-only strategy doesn't dominate score over deliberate safe intersection tests at matched survival times.
J-07: cannot farm score by parking while missiles destroy themselves offscreen.
J-08: V2 writes to own score key; any pre-existing CLASSIC value remains bit-for-bit identical.

### D. Stage and director
D-01: field thresholds/timing unchanged for first comparison.
D-02: breakout safe window and camera transition behave correctly at 20/47/77/110 seconds.
D-03: Field V contains three distinct motif families and true recovery intervals.
D-04: seeded phrase rotations reproduce same authored instructions.
D-05: across fixtures, threat count never breaks configured cap and avoids unbounded backlog.
D-06: every authored pattern has ≥1 sampled feasible escape trajectory in finite-horizon preview; if none, fallback.
D-07: reject/retry of unsafe candidate does not cause sudden 100-projectile storm when backlog releases.
D-08: ten-minute stage V fixture stays finite, deterministic enough, and no long-run exception.
D-09: stationary play, clockwise circle, counterclockwise circle, edge hugging tested for degenerate exploits.
D-10: no body-blocking by cinematic sprite/flash during real input.

### E. Audio/cinematic
V-01: each Field distinguishes atmosphere and composition in paused screenshot comparison.
V-02: field transitions retain collision-safe breakout and no misleading movement offset.
V-03: death view per stage shows context and ongoing world motion; game-over control and replay operate.
V-04: screen effect intensity bounded; incoming threats remain visible during compound bloom and shake.
A-01: iOS user-gesture Web Audio unlock works.
A-02: start soundtrack transition remains continuous at Field V (same core leitmotif).
A-03: at most 3 simultaneous scored explosions not clipped/distorted or painfully loud.
A-04: sound OFF, tab background, audio resume, death-to-restart works.

## IV. Manual comparative playtest protocol (small-N directional, not statistical proof)
Participants: creator plus ideally 5–10 independent players with varied arcade experience; can run with fewer but do not assert statistical significance.
- Within-participant balanced A/B sequence, order counterbalanced: HALF Classic-first, HALF Mastery-first.
- Same device/headphones, comfortable volume, comparable total sessions and controls.
- Stage V can use an unlocked/dev fixture for controlled expert testing in addition to natural full runs.
- Task T1: first 60 seconds with no tutorial other than minimal controls.
- Task T2: attempt 3 purposeful missile pair collisions.
- Task T3: one dense Field V phrase under fixed seed then one varied run.
- Task T4: explain each death in player's own words; compare hit visibility.
- Task T5: free choice: which would you immediately play again, why?

### Five questions (1–7 rating, plus open-ended remarks)
1. I felt in complete control of my rocket.
2. When I died, I usually understood why.
3. I could intentionally use missile movement rather than rely on luck.
4. I felt a genuinely large-scale ascent into orbit.
5. I wanted to play again after the run.

Secondary observation: undesired confusion, finger obstruction, overbrightness, audio fatigue, gimmick perception.

### Candidate decision thresholds (to calibrate after baseline)
- Control: no confirmed stage-dependent drag regression; ≥90% of scripted displacement cases within predeclared pixel tolerance in unit tests.
- Intentional agency: at least 4 of 5 returning/expert testers (if at least 5 available) can deliberately engineer >=2 missile pair intersections over controlled practice scenarios **without** changing controls; otherwise consider major rework. Sample-size caveat.
- Fair death: ≥80% of rated review events reported understandable; screenshot trace validates not obscured. Initial target only.
- Overall preference: in paired test, Mastery should be preferred by a majority who experienced both, but no automatic shipping on one tiny sample.
- Field V variety: players can articulate different threat decisions across ≥2 motif families without reading names.
- Score fairness: offscreen passive impact cannot give chain mastery points; no positive incentive to sit motionless for entire stage.
- Stability: zero P0 crashes/repeated stuck touches/permanent audio silence; all automated tests green.
- Performance (candidate): >95% of rAF intervals <25 ms on representative phone under normal Field V, p99 <50ms; examine stutters/hardware first. Do NOT treat raw rAF as precise CPU/GPU timing. 10-min stage-V session no monotonic explosion in count or unbounded retained memory.
- Accessibility: prefers-reduced-motion is respected in Intro and other optional effects if offered; stage readability consistent and screen shakes not excessive.

**No invented current metrics or baselines.** Write measured logs after sessions.

## V. Golden compare sequences
GOLD-01: brand new game, no previous scores, sound on/off.
GOLD-02: switch app / change tabs / return after 15 seconds during stage.
GOLD-03: pause in touch-drag motion, add second finger to dash, relift/retouch.
GOLD-04: stage transitions from 19–21s, 46–48s, 76–78s and 109–111s.
GOLD-05: 60-second Field V sequence with multiple missiles converging, at three screen sizes.
GOLD-06: simultaneous projectile pairs + player overlap in same frame.
GOLD-07: death Field I and death Field V, restart within 2 seconds / after full vista.
GOLD-08: full long-run stage V with cap pressure and multi-pair chain.
GOLD-09: CLASSIC best score still present after MASTERY run, and vice versa.

## VI. Manual log format
For each test session capture:
- DATE / branch SHA / game mode / device / OS+browser / screen viewport / audio mode.
- Scenario / run seed / field / duration / sample frames / screenshot link.
- What was expected, observed, discrepancy, player subjective verbatim.
- Severity: P0 blocker, P1 important, P2 polish.
- Owner + ticket + reproduction steps + fixture seed.
- Decision: fix now / tune later / design reconsideration / not reproduced.

## VII. Risk register and mitigation
| Risk | Severity | Likelihood | Early indicator | Owner action / stop |
| --- | --- | --- | --- | --- |
| Main Classic regression | Critical | Low if branch only | root/index diff, score key write | stop immediately, revert experimental merge |
| Field V control drift | Critical | Medium | displacement mismatch in stage V | lock downstream work pending fix |
| Cheap/unfair death | Critical | Medium | no viable sampled response; multiple identical complaints | decrease unsafe motif, revise director |
| New enemy patterns merely random | High | Medium | players can't predict motive or exploit it | simplify types, improve commit windows |
| Causal scoring dishonest | High | Medium | passive far collision rewarded | reject score event, tag unknown |
| Explosion overload | High | High | attacks hidden, p99 spikes | lower art budget/readability first |
| Increasing code fragility | High | High | repeated inline conflicts | smaller V2-only modules / disciplined PRs |
| Audio overstimulation | Medium | Medium | clipped chain, complaints | amplitude envelope and rate limiting |
| Orbit monotony | High | Medium | three motifs felt equivalent | revise tactical choices |
| Endless runs are endurance/circling | High | Medium | score correlated with time only | strategic variety, bounded time bonus |
| Device compatibility | Critical | Medium | missing coalesced API or silent audio | fallback, on-device QA |
| Wrong GitHub Pages preview | Critical | Medium | main live root replaced by test | independent preview deployment; audit settings |
| Over-scoping the prototype | High | High | features beyond 4 pillars | change control, park noncore ideas |

## VIII. Kill / rollback decision rules
- If control is measurably worse after two targeted fixes, restore original control module and pause experimentation.
- If deliberate Judo cannot be consistently learned after a focused iteration cycle, cut complex Judo scoring rather than fabricate spectacle.
- If Field V is unreadable, reduce density/effects before adding more tutorial/assists.
- If public staging could replace live Pages, don't deploy: use local HTTP or independent preview repo.
- If V2 fails to beat Classic in desired skill expression while costing much more cognitive load, revert to Classic and harvest only individually verified improvements.
- Publishing requires creator's explicit approval at G4.

## IX. Release checklist (ALL checked with proof, not prose)
- [ ] Classic SHA/hash protected and compare evidence archived
- [ ] Isolated path playable and device-tested
- [ ] No writes to Classic score key
- [ ] Controls test suite green on stage 1–5 variants
- [ ] Physics/dash ordering and Judo provenance tests green
- [ ] Field V seeded safety/cap stress green
- [ ] Five visual transitions and death outcomes reviewed
- [ ] Audio verified on iPhone Safari
- [ ] Long-run performance measured
- [ ] Creator A/B feedback documented
- [ ] Changelog, limitations, rollback ready
- [ ] Explicit go/no-go recorded
- [ ] Live Pages deployment remains unchanged until approved

## X. Research references
- MDN PointerEvent.getCoalescedEvents: https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/getCoalescedEvents
- GameSpot Geometry Wars 2 interview: https://www.gamespot.com/articles/qanda-bizarre-surveys-geometry-wars-2-aftermath/1100-6196237/
- Lucid Games developing a Geometry Wars 3 enemy: https://blog.playstation.com/2015/04/03/creating-a-new-enemy-in-geometry-wars-3-dimensions-evolved/
- Lucid Games on portable game feel / responsive controls / frame rate: https://blog.playstation.com/2015/07/01/geometry-wars-3-dimensions-evolved-hits-ps-vita-july-7th/
- Game accessibility / full screen effects and shake: https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117
- 2024 research rethinking DDA: https://www.sciencedirect.com/science/article/pii/S1875952124000314
- GitHub Pages single publishing source setup: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
