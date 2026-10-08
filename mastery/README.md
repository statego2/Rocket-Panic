# ROCKET PANIC — MASTERY V2 playable prototype

**Branch:** experiment/mastery-v2/four-pillars-playable
**Preview target:** mastery-preview (NOT main; Classic unchanged)
**Status:** Four-pillar playable code complete. Automated validation and creator
hands-on iPhone game-feel review are separate quality gates.

## What actually changes from Classic

1. **ROCKET BALLET:** From late Field I, the director introduces paired,
   relatively readable converging patterns. Field II/III bring Knife Thread,
   Close Arc and Cross-and-Release recipes. Near misses provide small rewards,
   while threading repeated moving misses gives supplemental Ballet points.
2. **MISSILE JUDO:** Enemies from authored pairs can cross in actual physics.
   A local real missile-to-missile collision can earn Judo points only if the
   player has actively moved enough after those rockets acquired headings.
   Passive/offscreen collisions get a token score instead. Consecutive genuine
   local crosses within 2.4s trigger a bounded ×5 Judo chain, brief cue,
   instrumental harmonic accents and readable gold feedback.
   This attribution is a *conservative gameplay heuristic*, not scientific proof
   that the user's counterfactual action caused a missile collision.
3. **INFINITE ORBIT:** Field V cycles three tactical phrase families:
   Pursuit Spiral, Lance Corridor and Orbital Crossfire. Each 18-second
   phrase has approximately 14s pressure + 4s without new scheduled
   ambient/pattern missiles. Existing missiles continue naturally. Enemy caps
   and three shields remain bounded by the existing collision rules.
4. **ESCAPE VELOCITY:** Subtle field-specific visual gradients/arcs,
   floating phase names at breakouts, motif-specific deep-orbit light geometry,
   chain-aware adaptive music punctuation, and a death screen recording real
   earned Judo count + peak chain. Existing world persistence / death vistas
   continue.

**No new input:** direct relative drag, second touch to dash. **No weapons,
levels, RPG upgrades, mandatory objective or new libraries at game runtime.**

## Manual iPhone playtest checklist

- Field I: start, move immediately, feel the exact Classic steering; notice a
  distinct Mastery intro cue. After roughly 7 seconds, watch for a two-rocket
  Ballet phrase. Try bringing their chase paths together before cutting across.
- Field II (~20s): observe Knife Thread / Close Arc encounters with clear escape
  choices. Check finger re-touch, second-finger dash and edge control.
- Field III (~47s): deliberately try a Cross-and-Release; look for **MISSILE
  JUDO** only after a *real close missile pair collision you actively influenced*.
  Surviving without tricks is also valid.
- Field IV (~77s): more tactical crossovers but same trusted control.
- Field V (~110s): look for three different styles of pursuit, each with short
  breathable recovery sections. Observe readability during multiple explosions.
- Death: confirm Judo count / peak chain statistics and Field-specific world
  continuation. Restart and check separate Mastery best score.

**Key critique:** Are the pair crosses deliberate enough to learn, or mostly
chance? Is the late Field V camera/input still responsive? Do orbit motifs
feel genuinely different? Is the aesthetic more epic without adding clutter?

## Quality and deployment

- The Classic `/index.html` is NEVER modified by the Mastery branch.
- Node regression runner: `node --test tests/*.test.mjs`.
- Headless Chromium portrait smoke runs on PR; artifacts show Field I & V.
- Direct QA-only replay: initialize `__ROCKET_MASTERY_DEV_TELEMETRY__` and
  `__ROCKET_MASTERY_DEV_SEED__` before game script execution, then call
  `__ROCKET_MASTERY_QA__.warpToField(4)` after game launch.
- Browser smoke is not a human iPhone playtest, actual acoustic judgment
  or a ten-minute performance certification.
- Never merge to main or alter public GitHub Pages without explicit creator
  signoff. Preview uses its own `mastery-preview` Git branch/CDN route.
