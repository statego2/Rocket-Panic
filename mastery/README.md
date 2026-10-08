# Rocket Panic — Mastery V2 (isolated development copy)

This is a feature-branch experiment, NOT the published Classic game and NOT
the completed four-pillar Mastery gameplay redesign. The main `/index.html`
is intentionally untouched. The new route `/mastery/index.html` contains
the current independent clone. **Do not publish it to the Classic Pages URL.**

## Local launch (after checking out the feature branch)

```sh
python3 -m http.server 8000
# open http://localhost:8000/mastery/
```

The existing game uses relative drag, second-finger dash, and five Fields.
The Mastery clone has its own high-score key `rocketPanicMasteryV2Best`;
Classic uses `rocketPanicV22Best` and is not modified.

## Optional QA fixtures — never enabled for ordinary players

Before the page's own inline script executes, a browser automation harness
(e.g. Playwright `page.addInitScript`) can set:

```js
window.__ROCKET_MASTERY_DEV_SEED__ = 777;
window.__ROCKET_MASTERY_DEV_TELEMETRY__ = true;
```

The seed controls the gameplay encounter random stream: spawn angles, enemy
archetypes, schedules and pattern recipes, without letting cosmetic random
effects consume that stream. No seed -> original Math.random behavior.

With QA telemetry enabled, inspect `window.__ROCKET_MASTERY_QA__.getEvents()`
after a run. Events cover start, entering Fields, missile pairs, death. The
array is private, limited to 256 records and only copied out on request;
no network requests, location, identity, or persistence. The current
"nearby" pair label is a proximity **heuristic, not causal proof**.
Do not use it for final Judo scoring until M16/M17 are complete.

## Tests

```sh
node --test tests/*.test.mjs
```

CI confirmed 28/28 passing Node tests on the experimental branch (2026-10-08, Actions run 37791307768). Tests include pinned Classic Git blob fingerprint, Mastery JavaScript parsing,
score isolation, five-camera-scale input delta invariants, touch-cancel/blur
recovery, multi-touch dash, seeded recipe repeatability and telemetry cap.
A dedicated experimental GitHub Actions workflow is on this branch.

## Known open gates

- Browser smoke and actual iPhone Safari comparison still pending.
- GitHub CI confirmation still pending until a successful run is observed.
- 30/60/120 Hz **encounter director and swept-collision fixtures** now pass; full rendered-game fixed-step/10-minute performance profiling is NOT yet implemented.
- This is a technical shell; intentional Missile Judo, Infinite Orbit motifs
  and Escape Velocity redesign are future WBS tickets.
- Do not claim this feature-branch path is an independently hosted URL.
