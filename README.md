# Rocket Panic

A one-finger portrait arcade survival game with five escalating flight fields, cinematic planetary environments, adaptive electronic/orchestral music and skill-driven missile choreography.

**[Play Rocket Panic](https://statego2.github.io/Rocket-Panic/)** (iPhone Safari / mobile browser)

## Controls

- **Drag with one finger:** steer the rocket with direct relative movement and screen-space-consistent response at every zoom level.
- **Second finger:** dash through danger, break intercepted missiles and clear crossing projectiles.
- **Landing grace:** the dash has 0.14 seconds of active travel protection plus approximately 0.24 seconds of brief post-dash collision protection. Overlapping hazards are consumed during this window instead of costing an unavoidable shield.
- **Three shields** with limited regeneration. No new buttons or upgrades.

## Gameplay

- Five staged environments, from low atmosphere to deep orbit, with continuous world progression and cinematic death scenes.
- Rocket Ballet encounter patterns and real missile-to-missile collisions.
- Missile Judo rewards only sufficiently local, recently influenced pair collisions; passive collisions give minimal score.
- Three Infinite Orbit encounter families cycle in Field V, including short relief intervals.
- Near misses remain an ordinary positioning/score reward; **they do not deflect missiles**. There is no gravity-slingshot mechanic or related UI text.
- Adaptive music grows with the run and skill; battle effects and death scenes remain in the same visual world.

## Release and rollback

On 8 October 2026, validated Mastery gameplay replaced the previous Classic implementation at `/index.html`.

- The existing score key `rocketPanicV22Best` is preserved for returning players.
- The previous Classic game is frozen at branch `backup/classic-v22-20261008-pre-mastery` (commit `9b44802cbc86f60e88aebc1bc7a181b31d7b0358`).
- The isolated experimental Mastery code and full test suite remain available on `mastery-preview`.
- Run published-game regressions with `node --test tests/*.test.mjs`; CI runs on pull requests to `main` and direct pushes.
- GitHub Pages deploys from `main`. Browser smoke checks were completed on the matching Mastery preview before promotion; hands-on device feel and balance remain player-validation tasks.

## Install-like launch on iPhone

Open the [game](https://statego2.github.io/Rocket-Panic/) in Safari and use **Share → Add to Home Screen**.
