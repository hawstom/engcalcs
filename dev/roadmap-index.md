# Roadmap index — open tasks, titles only

**Script-generated. Do not edit.** Regenerate with `php dev/scripts/generate_roadmap_index.php`.
`roadmap_id_check.php` fails if this file is stale. Edit `dev/ROADMAP.md`; this follows.

One line per open task: priority band, ID, marker, actor tag, and the executive-summary
title — the first bolded run of the description, 4–12 words. The rule and its rationale
live in `dev/scripts/roadmap_lib.php`. A title marked `!` is outside that range.

**61 open tasks.** Next (100): 11 · Soon (75): 9 · Someday (50): 12 · Maybe (25): 12 · Parked (5): 17

## 100 — Next (11)

- Task 248.03 — Rule-based controls: the text is CARRIED now; the language is still parked.
- ! Task 322 — Convert standing advisories into checks, and survey for the ones nobody has named.
- Task 436 — What a wheel notch costs, and the placement leftovers.
- Task 508 — Tom's screenshot drop: dozens of captures, indexed and reused.
- ! Task 509 — Edit mode on the path itself: drag any point, click a waypoint off.
- Task 530 — Fire flow: Tom's rulings are recorded; what is left is BUILDING them.
- ! Task 545 — [H] · The list is a file now. Tom read it once and the edits were lost.
- Task 553 — [H] · Demands and Hydraulics options: BUILT. One wording question is left.
- Task 562 — One touch radius for every object, and a node always wins.
- ! Task 565 — The EPANET bridge never asks whether the run converged. It says it did.
- Task 566 — Close the EPANET gap: eight sections are carried but not understood.

## 75 — Soon (9)

- Task 178 — NOTHING in the suite links to the screenshots page. Fix that first.
- Task 185 — Match/Copy properties tool (originated during Task 146).
- Task 239 — The English-friction loop: run the mechanized Wave 0 and measure its yield.
- Task 247 — Customers: metered demands with account numbers, lumped to the nearest node.
- Task 441 — Settings box: docking left or right, and an AutoCAD-style anchor-and-flyout with autohide.
- Task 479 — [H] · One question left: should the suite answer at librewaternet.org/engcalcs/ ?
- Task 531 — Tag the examples: US/SI, design/maintenance, xy/lat-lon.
- ! Task 532 — An English style guide for label wording — Tom says he is writing one by intuition.
- Task 539 — Gang the neighbour labels so their leaders stop crossing.

## 50 — Someday (12)

- ! Task 146.09 — A key map: the whole project as a thumbnail, with a box round where you are.
- Task 186 — Make the Tables pane spreadsheet-interoperable.
- Task 207 — The dilettante path: make replying cost one tap, not five steps.
- Task 218 — Find advisors and proteges: a standing, nagged commitment.
- Task 221 — Retire the "constants now match EPANET" note (Task 213) — CHECK: 2027-08-01.
- Task 234 — Canal Seepage must prove its worth or go.
- Task 269 — ASU Engineers Without Borders answered, and asked to meet.
- Task 282 — Offer to attach the backdrop an imported `.inp` names.
- Task 285 — We do not know what devices anybody uses this on.
- Task 498 — A public roadmap, with epanet-js's Canny board as the worked example.
- Task 541 — Clicking a label: should it select the asset for editing?
- ! Task 544 — [H] · epanet-js is implicitly claiming to be EPANET, and we have not decided what to do.

## 25 — Maybe (12)

- Task 144 — Diagnose the Hazen-Williams conversion leak — full record in `dev/hazen-williams-leak.md`.
- Task 217 — A suite-owned, multilingual Manning's n table, built from primary sources.
- Task 225.13 — `dev/lpn-file-lock-test-punchlist.md` §13 needs the rewrite §0–§8 got
- Task 266 — Multi-select (lasso) plus edit-all-selected, as EPANET has.
- Task 283 — Map label legibility: what remains is the AUTO-HIDE rule.
- Task 303 — Usage logging: the remaining lower-value questions.
- Task 348 — Sub-categories and paging in the examples gallery.
- Task 390 — Finish the unit paradigm migration: a unit is a NAME.
- Task 416 — The tester control panel: move it, prune it, repurpose it.
- Task 465 — [H] · Reusable pipe and pump TYPES, so editing one edits 400.
- Task 484 — Log which unhandled EPANET features actually arrive in real imports.
- Task 487 — The suite only works when its URL path is `/engcalcs/`.

## 5 — Parked (17)

- Task 114 — Reservoir / detention routing calculator (Modified Puls) — full scope in `dev/detention-routing-scope.md`.
- Task 116 — Solar water pumping sizing.
- Task 117 — Pico-hydro / hydrokinetic (damless, in-stream) turbine feasibility.
- Task 118 — Solar water pasteurization / SODIS exposure calculator.
- Task 155 — [H] · The Task 149 search-index fix awaits Search Console confirmation.
- Task 158 — `sewslope.php` and `peakfact.php` are English-only while the sewer-slope demand is not.
- Task 175 — A real printable version, suite-wide.
- Task 181 — Per-element symbol sizing (originated during Task 146).
- Task 191 — Junction emitters: surface the pressure-dependent demand already solved.
- Task 192 — Right-click / long-press context-menu system. PARKED at 5, 2026-08-13
- Task 202 — `zh` converts at ~15% where its peers convert at 50–75%.
- Task 267 — "Save as" the backdrop image.
- Task 391 — [H] · Evaluate `// @ts-check` with JSDoc branded types — a joint decision, not a proposal.
- Task 400 — Phase 3: bounded local search on the label residue.
- Task 482 — EPANET's vocabulary collides with ours, and we are keeping ours.
- Task 492 — [H] · Rewriting the 986 existing commit messages is NOT recommended.
- ! Task 537 — [H] · PARKED. Both seats say a phone reaching a PC's model is a want that mostly is not there.

---

53 of 61 titles are within 4–12 words. `!` marks the rest;
`php dev/scripts/roadmap_id_check.php` lists them with their word counts.
