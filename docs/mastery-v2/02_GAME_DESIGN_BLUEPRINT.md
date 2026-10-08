# 02 — MASTER GAME DESIGN BLUEPRINT
**Project:** Rocket Panic Mastery V2 — optional parallel mode
**State:** SPECIFICATION / HYPOTHESES FOR PLAYTEST, not already shipped.
**Invariant:** no new controls, no rewriting of CLASSIC.

## A. The player experience, one sentence
A single rocket, chased by a living swarm, ascends from the planet into orbit; novice players dodge to survive, experts weaponize pursuit lines to orchestrate beautiful chain collisions.

## B. Core loop
1. **READ** incoming silhouettes, headings and temporal attack sequence.
2. **POSITION** via direct relative drag while maintaining a possible escape lane.
3. **BAIT** trackers/predictors/committed dashers into crossing trajectories.
4. **CUT/ESCAPE** via movement or 2nd-finger dash.
5. **PAYOFF:** collisions, coherent blooms, local sound punctuation, mastery-specific score.
6. **RECOVER:** spatial reorientation, pressure-release breath, next purposeful threat phrase.

**Strict exception:** Player may always opt to simply survive. Doing elaborate tricks is never obligatory, and never becomes the only feasible path.

## C. Four design pillars / hypothesis map

### Pillar 1 — ROCKET BALLET
Hypothesis: Better physical trust, visual cues and enemy predictability produce an expressive skill ceiling with no new mechanics.

**Preserve:**
- one primary pointer: relative drag; second pointer: dash.
- zero inertial delay between finger movement and rocket movement.
- world-to-screen zoom compensation.
- existing invuln windows and instant dash interaction.

**Improve via experiments:**
- Low-speed and fast swipe calibration across FIELD I–V and browser touch sample rates; compare actual on-screen displacement at screen X/Y against the requested displacement.
- Restore consistent control after touch cancel, 2nd-touch dash, app background/foreground, orientation/viewport change.
- Enemy telegraph clarity: differentiated outlines, subtle direction arrows only where valuable, effect priority over aesthetics.
- Dash should feel powerful through hit timing, sound and visible path, not by adding opaque aim assistance.
- Build short voluntary "dance opportunities" using predictably committed missiles and meaningful escape room.
- Boundaries may be psychologically frustrating: test precise near-edge handling, no hidden elastic movement or camera pan.

**Reject:** inertia, auto-steer, dynamic swipe acceleration, sticky target snapping, permanent slow motion, skill combos involving 3+ fingers.

**Ballet experiment recipes:**
- B1 "Close Arc": two trackers create a curved chase; controlled lateral cut makes a safe cross.
- B2 "Knife Thread": two committed interceptors leave a clear narrow corridor.
- B3 "Cross-and-Release": one predictor and one dart cross; player may redirect without trapping themselves.
- Each must pass guaranteed-escape-path numerical sweep tests across phone aspect ratios before runtime.

### Pillar 2 — MISSILE JUDO
Hypothesis: Intentionally arranging a collision between pursuers feels more satisfying than passive missile collisions and increases expert repeatability.

**No weapons or extra button.** Enemy AI is the weapon.
**Design vocabulary (internal only):**
- **Lure:** keep a committed enemy chasing your previous location.
- **Cross:** change your lane so trajectories intersect behind/near you.
- **Redirect:** lead predictive enemies into trajectories occupied by others.
- **Release:** intentionally dodge through a safe corridor as pursuing missiles intersect.
- **Chain:** a second independently caused collision within a short proximity/time window. Visual effects may appear linked, but physics does not propagate damage to nearby missiles unless a later explicit experiment chooses that.

**Important physics distinction:** Existing "chain boom" is a scored missile-on-missile pair collision; we must not falsely promise a destructive radius that is not in the solver. First release provides **temporal chain scoring** for successive real impacts, not fictional blast propagation.

**Actor commitments, testable not magical:**
- Certain pursuers have a brief "commit" window where direction change is bounded and readable (use existing lance/interceptor commitment concept).
- Trackers remain persistent and turn more quickly but can be drawn to a common point.
- Predictors lead player's motion, but cap predictive horizon; no perfectly omniscient AI.
- Intent is implied by silhouettes/contrails and timings, not extra HUD labels.

**Skill attribution proposal:**
Existing telemetry stores collision:{steered,passive,dash}. Extend in MASTERY only:
- collision participants and previous/current positions
- whether each missile had local player-induced heading change in prior 0.5–1.5s
- whether their intersecting paths were plausible due to player motion; if uncertain, tag "unclassified", NEVER fabricate causality
- location in screen px from player, danger band, event timestamp
- swept time of impact and chronological resolution
- player near-intersection trajectory influence diagnostics
- direct dash vs missile pair vs passive background separate

**Scoring:**
- Keep base survival scoring secondary to intentional play; do not require aggressive risk.
- Avoid counting incidental offscreen missile collisions as skill.
- No near-miss combo farming.
- A 2nd linked collision within a tunable 1.2–2.5 seconds grants restrained bonus, capped to prevent runaway.
- Score diagnostics reflect actual source so "steered" attribution can be challenged in QA.
- Mode score namespace: rocketPanicMasteryV2Best, schema with version/mode if statistics are stored. Never write rocketPanicV22Best.

**Visual/audio feedback envelope:**
- Single pair hit: crisp central burst plus short ring, clear low-frequency accent.
- Deliberate multi-pair chain: escalating accent and carefully shaped bloom with no sustained overbright screen fog.
- Dash break: sharp directional emphasis, distinct from passive impact.
- Expert sequence: brief *coherent* moment rather than ever-increasing particle count.
- Explosion art changes must remain mode-local; preserve currently liked CLASSIC effects.

### Pillar 3 — ESCAPE VELOCITY
Hypothesis: Each Field creates a memorable "I have gone somewhere" emotional milestone while keeping active control throughout.

**Preserve current 5 thresholds first:** I=0s, II=20s, III=47s, IV=77s, V=110s.
These are first-pass A/B comparability anchors, not immutable final balance.
**The story remains wordless.** The player is not required to read lore or pause for cutscenes.

| Field | Emotional signature | Composition | Beat at transition | Threat learning |
| ---- | ------------------- | ----------- | ------------------ | --------------- |
| I NIGHT LAUNCH | vulnerable spark above a vast world | dense atmosphere, distant city/ground cues, subdued flashes | engine ignition, first open sky | basic pursuit + movement |
| II UPPER AIR | accelerating climb | atmospheric texture and increasing speed references | luminous atmospheric corridor | first readable two-missile cross |
| III CURVATURE | awe and scale | planet curvature, moonlight and star emergence | short camera-safe outward reveal | committed trajectories and escape lanes |
| IV ORBIT | command and peril | dominant planet limb, sparse high-contrast orbital tracers | clean field-breakout swell | combine enemy archetypes |
| V INFINITE ORBIT | beautiful dangerous mastery | restrained palette, planetary depth, distant secondary body | final wide reveal, sustained living universe | multi-phrase orchestration |

**Cinematic rules:**
- During precision moments, geometry owns priority: ship, relevant threats, trajectory cues, escape corridor > blooms > atmospheric haze > stars.
- Stage transitions use existing breakout protection; no increase to player hazard during involuntary camera scale transition.
- Music retains existing leitmotif and progression; no mandatory full-score rewrite.
- Death depends on the current altitude/Field; missile flight, world/planet motion and distant traffic continue under translucent panel.
- Each stage should feel different in framing and temporal rhythm, not only by hue.
- Tone: heroic, vast, elegant, no visual clutter or over-saturated Field V.

**Proposed 5-shot cinematic test storyboard:**
E1 takeoff establishes a tiny ship versus the world;
E2 sky parts and the field becomes larger;
E3 planet curvature enters frame;
E4 orbit resolves into a serene but dangerous scale;
E5 deep orbit exposes immense planetary depth; death camera remains appropriately field-dependent.
All shots implemented in procedural/Canvas systems where possible, no heavyweight video assets.

### Pillar 4 — INFINITE ORBIT
Hypothesis: Expert retention is improved by varying threat *decisions*, not adding only spawn rate, density or velocity.

**Field V starts at ~110 seconds; structured motifs can begin after the safe breakout.**
Three initial families (plus ambient transition periods), with different movement solutions:
1. **Pursuit Spiral** (18–26s tentative): tracker/hooks gradually converge from offset lanes; solution is smart repositioning, cross and release.
2. **Lance Corridor** (14–22s tentative): fast committed attackers and clear escape gaps; solution is timing, judgment, late dodge.
3. **Orbital Crossfire** (18–26s tentative): predictors + dart crossings from contrasting headings; solution is redirecting opponents into intersections.

Within each family a **build → crest → release** pulse. A deliberately breathable moment must be playable, not a fake gap filled by ambient rockets.
Sequence variation comes from seeded recipe permutations, rotations, mirrored angles and bounded enemy mix.
Do not make motifs rote/predictable: allow controlled diversity in angle and timing *within guaranteed readability and safety constraints*.

**Director contracts:**
- Never exceed tested caps for simultaneous missiles, bullets or bloom counts.
- During authored motifs, background/ambient spawn remains suppressed or entirely off if overlap makes path unclear.
- Exclude impossible closed formations with no viable escape corridor for a defined reaction interval.
- Do not rely on RNG for fairness; generate candidate spawns, simulate/check safety, reject and try fallback.
- Existing 13s pressure/breath cycle is the baseline; experimental tempo changes should be independent and specifically tested.
- Difficulty increases slowly through richer interactions, faster decisions and motif overlaps that remain bounded; no hidden performance compensation.
- After repeated motifs vary spatial solutions more than raw projectile count.
- Allow endless expert runs without exploding memory, CPU or audio node counts.

**Timeline sketch within FIELD V:** 110–115 recovery/opening; then 15–25-second motifs interleaved with 2–4 seconds genuine recovery; once beyond ~180 seconds introduce composite motifs cautiously; beyond 300 seconds emphasize variation, not caps. These are estimates to playtest.

## D. Core score/attention economy
**What the player should notice:** rocket location, inbound type/direction, safe space, dash readiness, meaningful explosions.
**What should remain unobtrusive:** combo formulas, underlying flow value, exact enemy AI strategy, score explanation.
**What should not dominate:** near-miss text spam, elaborate combo banners, survival-time multipliers, permanent screen shake.
High score may be a reason to return but is not the fantasy itself.

## E. Fidelity and fairness tests

**Test against these counterexamples:**
- "I moved my finger, but the ship barely moved in Field V." → fail.
- "My rocket was hit, although the attacker passed visibly beside me." → fail after frame replay inspection.
- "A missile pair collided far away and I got rewarded for skill." → attribution fail.
- "The bloom concealed an incoming fast lance." → visual clarity fail.
- "Every orbit pattern is just more rockets." → design fail.
- "I must provoke near-misses to get a meaningful score." → score dominance fail.
- "A camera transition moved my ship into an unavoidable impact." → fail.
- "The death vista always shows a huge planet even when dying at Field I." → cinematic fail.
- "I can survive indefinitely by circling in one place." → balance warning, test across conditions.
- "The game only works on desktop mouse." → product fail.

## F. Tuning variables (config, not scattered constants)
- controlGain and sensitivity, camera compensation, dash distance / cooldown (baseline defaults first)
- enemy velocity and turn profiles, commit duration, target retarget period, launch spacing
- pattern duty cycle, motif duration, inter-motif breath, safety window, caps
- player hit radius (visible px), near bands, post-hit recovery
- chain-provenance intervals, score multipliers and maximum bonus
- art bloom opacity/lifetime, particle budget, shake limit, audio ducking
- generation seed and QA/diagnostic rendering (DEV only)

## G. Creative approval prompts at playtest
1. Is movement more precise at Field V than in CLASSIC, with no extra work?
2. Did you *intend* and then *cause* a two-missile collision?
3. Was that achievement understandable without HUD explanation?
4. Could you tell how you died?
5. Did each Field feel like genuinely rising through space?
6. Does Field V feel different after two distinct phrases?
7. Would you choose MASTERY again rather than CLASSIC?
8. Did the experiment lose any of the original game's appeal?

**Decision policy:** If no stronger skill feeling emerges after a focused playtest/tuning round, don't ship the feature merely because it is engineered.
