# 06 — RESEARCH REVIEW / DESIGN DECISIONS
**Date:** 2026-10-08 | **Scope:** source-checked outside references that inform this V2, plus first-party repo inspection.
**Important:** Sources about other games/engines provide *analogies*, not proven performance or fun outcomes for Rocket Panic.

## 1. What the source code tells us
Repo: https://github.com/statego2/Rocket-Panic
Examined main index.html and tests/core-physics.test.mjs, .github/workflows/ci.yml on 2026-10-08; last observed head 9b44802cbc86f60e88aebc1bc7a181b31d7b0358.
- The current game is an inline Canvas/Web Audio/mobile CSS document with current flow mechanics (not a blank prototype).
- Existing systems include five stages; nuanced missiles; multiple authored patterns; combo/near/dash/pair collisions; immersive space backgrounds and death.
- Crucial design consequence: **avoid adding mechanics that already exist**. Upgrade their clarity/intentionality, not their count.
- Behavioral distinction between observed code functionality and real playtest enjoyment must be maintained.

## 2. Developer interviews about Geometry Wars
### 2.1 Bizarre team reflection on Geometry Wars 2 (GameSpot, 2008)
URL: https://www.gamespot.com/articles/qanda-bizarre-surveys-geometry-wars-2-aftermath/1100-6196237/
Developer Stephen Cakebread wanted to reduce scores driven mainly by marathon endurance and avoid the repetitive tactic of merely circling the arena. Craig Howard described using different enemy motions to prevent campers and repeated circling.
**Translation to Rocket Panic:** do not rely on exponential survival duration or just more following rockets. Use multiple opponent motion laws and give pilots reasons to use the whole screen. Our Mastery Score must distinguish skilled redirection from passive time.

### 2.2 Lucid Games on creating enemies (PlayStation Blog, 2015)
URL: https://blog.playstation.com/2015/04/03/creating-a-new-enemy-in-geometry-wars-3-dimensions-evolved/
Craig Howard explains that enemies are introduced to provoke a *specific new decision*; behaviors must be defined and anticipatable in intense screens; enemies are first playtested in a plain test area; exploit fixes precede visual polish.
**Translation:** use isolated encounter arena B1/B2/B3, prototype pursuit/commit before FX and add enemy only when its spatial decision is distinct. Prototype enemy conflicts against existing seven types.

### 2.3 Geometry Wars on handheld platforms (PlayStation Blog, 2015)
URL: https://blog.playstation.com/2015/07/01/geometry-wars-3-dimensions-evolved-hits-ps-vita-july-7th/
Lucid team discusses maintaining fast frame rates under large enemy counts and checks dead zones and control response across platforms.
**Translation:** test touch on a real iPhone and observe framerate/dead zones, not only desktop screenshots; visual optimization may require lower-cost bloom rather than reducing collision fidelity.

## 3. Web platform engineering
### Pointer events (MDN)
URL: https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/getCoalescedEvents
The browser can combine several pointer updates; getCoalescedEvents recovers more granular movement when available, but is not universally supported.
**Translation:** retain feature-detection fallback; test empty result, old browser, fast swipe and multi-pointer dash. Performance telemetry from screen events should not corrupt position.

### GitHub Pages source (GitHub Docs)
URL: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
GitHub Pages publishes from a configured source branch/folder or deployment action.
**Translation:** development branch is not automatically a staging site. Switching Pages publishing branch might replace existing live site; don't do that. Use local HTTP / isolated preview repo, and only publish /mastery after creator gate.

## 4. Visual effects and accessibility
### Xbox Accessibility Guideline 117 (Microsoft)
URL: https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117
Shows adjustable intensity of blur, screen shake, full-screen effects and reduced camera motion for comfort.
**Translation:** intense gameplay is no excuse for uncontrolled flash/whiteout or motion sickness; test reduced-motion/fx tuning while retaining the key visual identity. Settings could be one simple "reduced effects" toggle if genuinely needed, never an obligatory configuration page.

### GDC independent games art direction (GDC Vault)
URL: https://www.gdcvault.com/play/1021398/Don-t-Juice-It-or
"Don't Juice It or Lose It" critiques ornamental juice divorced from context and immersion.
**Translation:** spectacular explosion moments should communicate skilled action, not blanket the whole field. Less, well-timed reaction can be stronger.

## 5. Dynamic difficulty research
### Rethinking dynamic difficulty adjustment (Entertainment Computing, 2024)
URL: https://www.sciencedirect.com/science/article/pii/S1875952124000314
The authors explain that dynamic difficulty adjustment research has mixed efficacy and should be treated as precise game-difficulty control aligned to specific design goals.
**Translation:** do NOT add hidden performance-responsive punishment that arbitrarily increases pressure when someone plays well. Instead use authored, bounded, transparent-in-feeling danger waves and intentionally scheduled breath windows. Tune by player testing, not faith in an opaque "AI director."

## 6. Design inference and open hypotheses
Strong analogical support:
- Opponent design should provide a legible new strategy, not just a new hue.
- Prevent one trivial movement exploit; distinct motion types can help.
- Physical and frame-rate trust are foundational.
- Juicy visuals only improve game feel when tied to meaning.
- A branch and a deployed site are different things.

**Not established by research yet:**
- Which mix of three Field V motifs is most fun to the actual audience.
- Whether the scoring/chain mechanic materially increases replay intent.
- Whether cinematic changes outperform current aesthetic.
- Specific ideal 13s vs 18s pressure cycles, hit radii or missile counts.
- Whether all players will prefer Mastery; some may like simpler Classic better.
These are explicitly addressed by proposed fixtures and tests.

## 7. Research-to-implementation matrix
| Evidence | Design action | Ticket |
| --- | --- | --- |
| GameSpot circle/endurance exploit | circling tests + meaningful pursuit archetypes | M14–M15, M23 |
| PlayStation enemy prototyping | isolated encounter arena before cosmetic pass | M12, M15 |
| PlayStation handheld feel/performance | touch and density profiling | M08–M11, M32 |
| MDN pointer browser variation | event fallback/cancel fixtures | M09 |
| GitHub Docs publishing constraints | isolated preview plan and live Pages protection | M02, M38–M40 |
| Microsoft accessibility | adjustable/limited effects, reduced-motion checks | M27, M30 |
| GDC visual restraint | coherent low-occlusion feedback | M27–M28 |
| DDA research mixed results | bounded authored director, no opaque unfair scaling | M20–M24 |

## 8. Future targeted research backlog
Only if playtest shows a need:
- Measure iOS Safari PointerEvent differences across current devices/OS versions, official compatibility matrix.
- Test deterministic event and physics stepping under high-refresh screens.
- Compare psychoacoustic impact of short transient explosion families at conservative loudness.
- Study player trajectory counterfactuals to improve steered/pair collision evidence.
- Evaluate skill curve and onboarding comprehension with controlled user testing rather than relying on external games.

**Reference hygiene:** This report contains interpretations of public materials; it does not imply code or assets from other games should be copied. Do not reproduce copyrighted art/sound or user interface layouts.
