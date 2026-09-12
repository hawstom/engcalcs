# Roadmap index — open tasks, titles only

**Script-generated. Do not edit.** Regenerate with `php dev/scripts/generate_roadmap_index.php`.
`roadmap_id_check.php` fails if this file is stale. Edit `dev/ROADMAP.md`; this follows.

One line per open task: priority band, ID, marker, actor tag, and the executive-summary
title — the first bolded run of the description, 4–12 words. The rule and its rationale
live in `dev/scripts/roadmap_lib.php`. A title marked `!` is outside that range.

**69 open tasks.** Next (100): 9 · Soon (75): 9 · Someday (50): 18 · Maybe (25): 10 · Parked (5): 17 · priority 60 (60): 3 · priority 70 (70): 1 · priority 95 (95): 2

## 100 — Next (9)

- Task 185 — Match/Copy properties tool (originated during Task 146).
- Task 247 — Customers: metered demands with account numbers, lumped to the nearest node.
- ! Task 322 — Convert standing advisories into checks, and survey for the ones nobody has named.
- Task 539 — Gang the neighbour labels so their leaders stop crossing.
- Task 592 — [AI] · Read a surveyed point list: junctions from a CSV or GPX file.
- Task 599 — Graph a value against time across an extended-period run.
- Task 611 — Import a library (pipe types, fittings, curves) from another project file.
- Task 616 — [H] · Visual feedback: a prompt history in the banner area.
- Task 618 — WYSIWYG hit areas: what you can click is what you can see.

## 95 — Priority 95 (2)

- Task 627 — [H] · An unreadable document leaves a named tab, then autosave destroys it.
- Task 628 — [H] · A restored view is never checked against the model it must show.

## 75 — Soon (9)

- Task 239 — The English-friction loop: run the mechanized Wave 0 and measure its yield.
- Task 441 — Settings box: docking left or right, and an AutoCAD-style anchor-and-flyout with autohide.
- Task 498 — A public roadmap, with epanet-js's Canny board as the worked example.
- Task 578 — Fire flow: the EPS frame and the Run concept, extracted from 530.
- ! Task 608 — [H] · The engine's 664 KB is no longer opt-in, and somebody pays for it.
- Task 612 — [H] · Screenshot 0082 is the centerpiece of any lpn display.
- ! Task 617 — A basemap the reader can tone down, and a menu of tile styles.
- Task 623 — [H] · File loss judged only by people whose files are throwaway.
- Task 624 — [H] · The scale fallbacks turn any missed publish into a flooded canvas.

## 70 — Priority 70 (1)

- Task 630 — [H] · The map's own honesty: a scale bar, and what projection we offer.

## 60 — Priority 60 (3)

- Task 625 — [H] · BUILT: the app page divorced from EngCalcs chrome. Remainder below.
- Task 626 — A refused beacon is retried like an offline one, 20 times.
- Task 629 — [H] · GUARDED: a geographic project opening on the XY default view, in pixels.

## 50 — Someday (18)

- ! Task 146.09 — A key map: the whole project as a thumbnail, with a box round where you are.
- Task 217 — A suite-owned, multilingual Manning's n table, built from primary sources.
- Task 218 — Find advisors and proteges: a standing, nagged commitment.
- Task 221 — Retire the "constants now match EPANET" note (Task 213) — CHECK: 2027-08-01.
- Task 234 — Canal Seepage must prove its worth or go.
- Task 269 — Both EWB chapters answered, and Phoenix invited a talk.
- Task 282 — Offer to attach the backdrop an imported `.inp` names.
- Task 283 — Map label legibility: what remains is the AUTO-HIDE rule.
- Task 285 — We do not know what devices anybody uses this on.
- Task 544 — [H] · epanet-js is implicitly claiming to be EPANET, and we have now decided.
- Task 600 — The three EPANET plots we do not have: contour, frequency, flow balance.
- Task 601 — Calibration files: measured field data, against the model that predicts it.
- Task 604 — Read an EPANET `.PRO` profile file.
- Task 610 — [H] · Paste that CREATES table rows: gated on the data-entry clerk's own spec.
- Task 614 — The sewer-slope cluster is the largest demand we do not convert.
- Task 620 — [H] · A changed icon never reaches a returning visitor.
- Task 622 — [H] · A refused terrain lookup is reported as an unreachable one.
- Task 631 — Four things Tom hit while testing, none of them urgent.

## 25 — Maybe (10)

- Task 144 — Diagnose the Hazen-Williams conversion leak — full record in `dev/hazen-williams-leak.md`.
- Task 225.13 — `dev/lpn-file-lock-test-punchlist.md` §13 needs the rewrite §0–§8 got
- Task 303 — Usage logging: the remaining lower-value questions.
- Task 348 — Sub-categories and paging in the examples gallery.
- Task 416 — The tester control panel: move it, prune it, repurpose it.
- Task 487 — The suite only works when its URL path is `/engcalcs/`.
- ! Task 607 — A moving picture of drawing a pipe -- Task 178's phase 2, extracted on close.
- Task 613 — [H] · "Note" instead of "Text" for the free-text map object.
- ! Task 619 — [H] · The map cursor reverts to an arrow on Chrome at fractional display scaling.
- Task 621 — [H] · A command search: KDH went looking for one.

## 5 — Parked (17)

*Ruled against, or set aside, and kept here for documentation. A row is alive only so that it is not re-proposed from scratch.*

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

62 of 69 titles are within 4–12 words. `!` marks the rest;
`php dev/scripts/roadmap_id_check.php` lists them with their word counts.
