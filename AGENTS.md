# AGENTS.md — Rocket Panic Mastery Planning Branch
This file governs development on the experiment/mastery-mode-v2-planning branch and its child feature branches only.

## Mission
Build an opt-in second ROCKET PANIC Mastery mode from the four creator-selected directions: Rocket Ballet, Missile Judo, Escape Velocity, Infinite Orbit. Preserve current CLASSIC.

## Required reading
- docs/mastery-v2/README.md
- docs/mastery-v2/01_PROJECT_CHARTER.md
- docs/mastery-v2/02_GAME_DESIGN_BLUEPRINT.md
- docs/mastery-v2/03_TECHNICAL_ARCHITECTURE.md
- docs/mastery-v2/04_IMPLEMENTATION_BACKLOG.md
- docs/mastery-v2/05_QA_RELEASE.md
- docs/mastery-v2/06_RESEARCH_REVIEW.md
- docs/mastery-v2/NEXT_ACTION.md
- docs/mastery-v2/BASELINE.md

## Hard safety rules
- NEVER edit /index.html, classic score data or main/published site without explicit creator release approval.
- No GitHub Pages source changes; branch is NOT automatically a hosted preview.
- First copy validated classic root game into isolated /mastery/index.html on a feature branch.
- Add no new buttons, weapons, RPG/upgrades, levels or external dependencies without scope approval.
- Tests and actual hands-on evidence required; never claim a playtest not performed.
- Work from first unblocked Mxx ticket; keep changes small and branch-specific.
- Cross-check for newer main commits and other agents before applying edits; avoid clobbering work.
- In doubt, stop/roll back experiment, never damage Classic.

## Definition of Done
Testable code + test output + documented risk/rollback + PR into experimental integration only + backlog status update. Public merge/main only after creator G4 approval.

## Next
Read docs/mastery-v2/NEXT_ACTION.md.
