# ROCKET PANIC — MASTERY MODE V2
## Project Charter (approved scope proposal; implementation NOT started)

**Created:** 2026-10-08  
**Repo:** https://github.com/statego2/Rocket-Panic  
**Planning branch:** experiment/mastery-mode-v2-planning  
**Baseline reference:** main at the initial planning snapshot (2026-10-08; latest observed commit 9b44802cbc86f60e88aebc1bc7a181b31d7b0358).  
**Status:** CHARTER READY FOR IMPLEMENTATION; all numeric playtest gates are provisional targets, NOT measured results.  
**Owner / product approval:** project creator. **Execution:** developer/AI implementers working in isolated feature branches.  
**Documentation:** 01 charter, 02 gameplay blueprint, 03 technical architecture, 04 backlog/schedule, 05 QA/metrics/release, 06 next action.

### 1. Executive mandate

Produce a parallel experimental **MASTERY** mode built upon Rocket Panic's present mobile one-/two-finger neon survival core, **without changing the shipped CLASSIC gameplay**. V2 must integrate exactly four selected vectors:

1. **Rocket Ballet:** precise, predictable movement and skill-expressive traversal.
2. **Missile Judo:** deliberate lure/redirect/cross/chain of incoming missiles, without introducing player weapons or extra controls.
3. **Escape Velocity:** memorable authored ascent, five emotionally distinct Fields, carefully staged cinema and death aftermath.
4. **Infinite Orbit:** sustained, meaningful long-run variation within Field V rather than more Fields or exponential clutter.

**North-star player fantasy:** "At first I run from the missiles; eventually I use them to choreograph the battlefield."

**Definition of success:** A first-time player understands how to move and dash almost immediately; an experienced player repeatedly produces intentional, visually legible multi-enemy collisions while feeling fully accountable for failures. The better play looks demonstrably different from beginner play, not merely longer.

### 2. Starting baseline (observed in code, not verified via device playtest)

- Portrait mobile web game, Canvas + CSS + Web Audio inside a single ~4.5k-line root index.html.
- Five time-based Fields begin at 0, 20, 47, 77, 110 seconds; Field V has survival scaling.
- Relative finger drag; second simultaneous finger = dash; current control sensitivity 1.34; zoom compensated motion, field camera scales [1,.8,.6,.42,.28].
- Three shields, regenerative shield loop, invulnerability windows; dash cooldown and short active window.
- Existing 7 enemy types: basic, dart, hook, interceptor, lance, tracker, predictor.
- Existing authored recipes: Pincer, Swarm, Chase, Cross, Gap; breathing cycle about 13 seconds.
- Current mastery metrics: near misses, dash breaks, steered/passive missile pair collisions, combo/skill heat/flow. Near misses are a secondary element, NOT the new game's premise.
- Swept collision timing, separate cinematic death aftermath, stage music, stage transitions, mobile-friendly single-file deployment.
- Existing automated Node tests for swept collision, dash corridor, impact ordering, basic JS syntax in tests/core-physics.test.mjs; CI workflow at .github/workflows/ci.yml runs on main and PRs targeting main.
- CLASSIC localStorage high score key: rocketPanicV22Best. Do not modify or overwrite it.

### 3. Business / experience goals

| ID | Goal | Observable proof |
| --- | --- | --- |
| G1 | Preserve current CLASSIC | Root index.html unchanged during experiment; baseline regression suite green |
| G2 | Grow expressive skill | Expert test participants intentionally engineer interceptions/chain collisions; action causality confirmed in events |
| G3 | Make input trustworthy | Direct input does not acquire inertia or drift, including Field V, screen edges, finger relift, 2nd-touch dash |
| G4 | Make ascent genuinely epic | Five fields feel distinct while threat readability never worsens because of cinematic effects |
| G5 | Make Field V worth mastering | Alternating mechanically distinct orbit phrases, no cheap unavoidable death, no clutter-only difficulty scaling |
| G6 | Remain extremely simple | Existing control grammar only: relative drag + two-finger dash; no tutorial wall, menus, inventory, upgrades |
| G7 | Produce actionable evidence | Baseline vs V2 instrumented A/B manual playtest with pass/fail release gates |

### 4. Scope in / scope out

**IN:** forked playable mode, input fidelity, intentional enemy-intersection opportunities, authored 3+ phase Field V orchestration, collision causality and fair rewards, high-clarity explosion art direction, ascent/death cinematic polish, deterministic seeded test scenarios, isolated score namespace, benchmarks, feature flags and safety rollback.

**OUT:** multiplayer, online leaderboard, new monetization, cosmetics, new weapon controls, boss fights, extra Fields, RPG/meta progression, mandatory objectives, long narrative cutscenes, rewriting CLASSIC, switching engines/frameworks, account systems, cloud backends, auto-adjustment secretly targeting player performance.

**Not equivalent:** "more rockets" != more skill; "longer survival" != stronger replayability; "larger explosion" != better game feel.

### 5. Product configuration / player-facing approach

**Recommended staged delivery:**
- **Incubation:** MASTERY runs only under a dedicated development path/branch. No mode selector in CLASSIC.
- **Private test:** Publish an independent preview only after explicitly configuring an isolated test deployment. A GitHub branch alone does not create a Pages preview URL.
- **Opt-in public beta (after gates):** additive /mastery/ path, optionally a single simple landing selector (CLASSIC | MASTERY) after creator acceptance.
- **Final decision:** keep two modes if both are differentiated and valued; otherwise preserve CLASSIC and cherry-pick only objectively better changes. No requirement to ship two modes.

### 6. Constraints and invariants (non-negotiable)

1. **Main branch protected by procedure.** No gameplay commits to main until explicit go/no-go.
2. CLASSIC source and its storage key remain unchanged until accepted and separately regression-tested.
3. No player weaponry / additional on-screen skill buttons.
4. Direct touch and consistent on-screen response across five camera scales.
5. No automatic camera moves that shift collision space while a player is making a precision input, except existing discrete breakout with safety window.
6. Death sequence retains "the world continues without you"; the view responds to the Field where death occurred.
7. Design for modern portrait iPhone Safari with browser API fallbacks; test on actual hardware.
8. All scoring differences are MODE-SPECIFIC; never compare old score against new score as if equal.

### 7. Primary audiences and target experience

- **Newcomer (0-5 sessions):** understand movement, hazards, two-finger dash; discover stage progression without explanation-heavy UI.
- **Returning player (5-25 sessions):** recognize enemy archetypes, deliberately create first multi-missile interception.
- **Expert (25+ sessions):** exploit committed enemy trajectories, navigate escape corridors, chain 3+ interactions at high pressure.
- Skill maturity is approximate segmentation, not enforced by game.

### 8. Scope decision matrix

| Vector | Priority | Initial implementation | Deferred |
| --- | --- | --- | --- |
| Rocket Ballet | P0 | same mapping, robust input processing, safe bounds, traceable response | configurable assists, advanced gestures |
| Missile Judo | P0 | AI telegraph/commit windows, steering/collision score provenance | external force fields, explosion physics weapons |
| Escape Velocity | P1 | stage-specific visual composition, transition accent, world-scale depth | new cinematic cutscenes, elaborate lore |
| Infinite Orbit | P0/P1 | 3 contrasting motif families, bounded director, pressure pulse | extra planetary worlds, new levels |
| Polish | P1 | clearer telegraphs/feedback, visual budgets | skins, progression, external leaderboards |

### 9. Governance / responsibilities

- **Creator (human):** sets desired feel and aesthetic; performs phone playtests; decides scope changes and final release.
- **Engineering agent:** implements only numbered backlog ticket(s), tests changes, documents diffs and risks.
- **QA agent/reviewer:** reviews trace logs, fixture results, screenshots and controlled playtest sessions.
- **Producer (agent/project charter):** keeps dependency plan and NEXT_ACTION accurate; prohibits implicit feature creep.
- **Merge rights:** no agent may silently modify main or overwrite the existing live experience.

### 10. Planned stage gates

- **G0 — Baseline frozen:** CLASSIC snapshot, reproducible test commands, device behavior observations.
- **G1 — Technical vertical slice:** MASTERY launches isolated, controls identical, collision mechanics proven.
- **G2 — Fun prototype:** steering collisions can be deliberately triggered and explained; 5-stage ascent intact.
- **G3 — Beta quality:** Field V arc, cinematic contrast and sound survive device checks; no P0 failures.
- **G4 — Ship or reject:** creator reviews side-by-side A/B, selects keep-beta / redesign / selective merge / cancel.

See 04_IMPLEMENTATION_BACKLOG.md for dates, estimates and dependencies; 05_QA_RELEASE.md for quantitative/qualitative exit criteria.

### 11. Indicative planning envelope

**Proposal, not a delivery commitment:** six sequential 7-day planning windows, from **9 Oct to 19 Nov 2026**, contingent on actual execution and playtest availability. Rough development effort 90–150 focused engineering hours plus 15–30 hours review/device testing. A single assistant interaction does not work asynchronously; the backlog is designed for repeated explicit work sessions with multiple implementers.

Budget: existing repo and GitHub Pages; no external paid assets or third-party services needed for core prototype. Audio/visual iteration should reuse current aesthetic and avoid licensing dependencies.

### 12. Decision register

- D-001: Protect CLASSIC; isolated MASTERY path/branch.
- D-002: Keep original controls; maximize high-skill interactions without new inputs.
- D-003: Preserve five Fields and their initial time thresholds for first comparative iteration.
- D-004: Mastery score separate from CLASSIC; avoid near-miss farming as dominant objective.
- D-005: Branch/PR does NOT imply an externally playable preview; isolate hosting.
- D-006: Performance/readability outrank new particle counts.
- D-007: Use pattern-seeded repeatable fixtures for balance regression; production patterns may remain variable.
- D-008: Explicit creator gate before any release touching main or published landing.

### 13. Research-grounded notes

- Geometry Wars developer interviews emphasize maintaining simple controls and creating difficulty through enemy interactions rather than merely giving every enemy projectiles: https://www.nintendo.com/en-gb/News/2007/Interview-Geometry-Wars-Galaxies-Wii-DS--249637.html
- Geometry Wars 2 developers flagged endless score-as-endurance and circling exploits; enemy combinations create emergent gameplay: https://www.gamespot.com/articles/qanda-bizarre-surveys-geometry-wars-2-aftermath/1100-6196237/
- Geometry Wars 3 enemy prototyping prioritized clearly readable enemy intent and testing in an isolated arena: https://blog.playstation.com/2015/04/03/creating-a-new-enemy-in-geometry-wars-3-dimensions-evolved/
- Dynamic difficulty adjustments have mixed outcomes; avoid opaque player-targeted manipulation: https://www.sciencedirect.com/science/article/pii/S1875952124000314
- Browser coalesced input availability varies; retain fallback: https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/getCoalescedEvents
- A branch alone does not publish a distinct GitHub Pages site: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

### 14. Charter acceptance

This charter authorizes **planning**, isolated prototyping and scoped testing. It does not authorize silent release to main. The creator's request selected four design vectors; future design decisions not explicitly selected remain recommendations until proven in prototype.
