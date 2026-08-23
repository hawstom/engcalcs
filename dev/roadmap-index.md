# Roadmap index — open tasks, titles only

**Script-generated. Do not edit.** Regenerate with `php dev/scripts/generate_roadmap_index.php`.
`roadmap_id_check.php` fails if this file is stale. Edit `dev/ROADMAP.md`; this follows.

One line per open task: priority band, ID, marker, actor tag, and the executive-summary
title — the first bolded run of the description, 4–12 words. The rule and its rationale
live in `dev/scripts/roadmap_lib.php`. A title marked `!` is outside that range.

**80 open tasks.** Next (100): 7 · Soon (75): 9 · Someday (50): 12 · Maybe (25): 25 · Parked (5): 27

## 100 — Next (7)

- Task 145 — GEOGRAPHIC PROJECTS: grid or geographic, declared before anything is drawn.
- Task 388 — Documentation is written as a transcript of revision, not current state.
- Task 389 — Search and replace inputs across the network, no longer gated on size.
- Task 436 — A wheel notch costs a full label relayout, editor-wide.
- Task 439 — The lat/lon drawing comes apart past ~600,000 px/degree.
- Task 459 — WAIT: sprint · The next sprint's contents, already earned.
- Task 489 — Our Mapbox attribution is incomplete, and theirs is a licence term.

## 75 — Soon (9)

- Task 239 — The English-friction loop: run the mechanized Wave 0 and measure its yield.
- Task 378 — [H] · Give the seven harnesses a network some other way, and delete `drawExampleNetwork()`.
- Task 442 — [H] · The toolbar may want to become a side menu.
- Task 472 — `alignedSideFor()` walks every link to place one label.
- Task 477 — [H] · New blank project startup wizard: xy/lat-lon, units, head loss.
- Task 478 — [H] · Tab should walk down the input column, not sideways.
- Task 479 — LibreWaterNet.org needs a landing page, and this account needs a hosting decision.
- Task 483 — EPANET import: carry unhandled features into a per-asset import notes field.
- Task 485 — Give the production log archives a systematic path and naming.

## 50 — Someday (12)

- Task 207 — The dilettante path: make replying cost one tap, not five steps.
- Task 248.02 — Patterns: attach one to a RESERVOIR HEAD and a PUMP.
- Task 269 — ASU Engineers Without Borders answered, and asked to meet.
- Task 408 — Label leader dragging: an optional snap to 15°/30°/45° angle increments, user's choice.
- Task 425 — The unit-change dialog for an lpn project that already has content.
- Task 433 — Profile: the last piece is the path CHOOSER.
- Task 441 — Settings box: docking left or right, and an AutoCAD-style anchor-and-flyout with autohide.
- Task 465 — [H] · Reusable pipe and pump TYPES, so editing one edits 400.
- Task 469 — Node labels should SHED properties before one of them is hidden.
- Task 481 — A closed task cited as pending ships false claims.
- Task 487 — The suite only works when its URL path is `/engcalcs/`.
- Task 488 — The Print table button crowds the tab strip it shares.

## 25 — Maybe (25)

- Task 144 — Diagnose the Hazen-Williams conversion leak — full record in `dev/hazen-williams-leak.md`.
- Task 185 — Match/Copy properties tool (originated during Task 146).
- Task 217 — A suite-owned, multilingual Manning's n table, built from primary sources.
- Task 218 — Find advisors and proteges: a standing, nagged commitment.
- Task 221 — Retire the "constants now match EPANET" note (Task 213) — CHECK: 2027-08-01.
- Task 225.13 — `dev/lpn-file-lock-test-punchlist.md` §13 needs the rewrite §0–§8 got
- Task 234 — Canal Seepage must prove its worth or go.
- Task 247 — Demand allocation by customer (epanet-js has it, EPANET does not).
- Task 248 — Extended-period simulation, the GATE on the LibreEPANET.org launch.
- Task 248.03 — Rule-based controls, EPANET's `[RULES]` (Task 248 child).
- Task 248.04 — Curves (Task 248 child) — probably NEVER a separate interface.
- Task 266 — Multi-select (lasso) plus edit-all-selected, as EPANET has.
- Task 283 — Map label legibility: what remains is the AUTO-HIDE rule.
- Task 284 — Settings box follow-ups, after the two-pane box shipped (Task 441).
- Task 285 — We do not know what devices anybody uses this on.
- Task 322 — Standing advisories worth converting rather than re-reading.
- Task 348 — Sub-categories and paging in the examples gallery.
- Task 390 — Finish the unit paradigm migration: a unit is a NAME.
- Task 416 — The tester control panel: move it, prune it, repurpose it.
- Task 417 — Long-press on an element should enter Edit mode.
- Task 435 — The Labels panel's column headings sit too far right.
- Task 468 — Demand categories on a junction — the breakdown the importer already flattens.
- Task 470 — Search for a place by name while placing a model.
- Task 475 — Manning Irregular emits NaN for a zero-length segment.
- Task 484 — Log which unhandled EPANET features actually arrive in real imports.

## 5 — Parked (27)

- Task 114 — Reservoir / detention routing calculator (Modified Puls) — full scope in `dev/detention-routing-scope.md`.
- Task 116 — Solar water pumping sizing.
- Task 117 — Pico-hydro / hydrokinetic (damless, in-stream) turbine feasibility.
- Task 118 — Solar water pasteurization / SODIS exposure calculator.
- Task 146.09 — Map insets for congested areas of a drawing (Task 146 child).
- Task 155 — [H] · The Task 149 search-index fix awaits Search Console confirmation.
- Task 158 — `sewslope.php` and `peakfact.php` are English-only while the sewer-slope demand is not.
- Task 175 — A real printable version, suite-wide.
- Task 178 — Build a real filmstrip-GIF Help asset from `dev/filmstrip-gif-recipe.md`
- Task 181 — Per-element symbol sizing (originated during Task 146).
- Task 186 — Table-paradigm editor with spreadsheet copy/paste (originated during Task 146).
- Task 191 — Junction emitters: surface the pressure-dependent demand already solved.
- Task 192 — Right-click / long-press context-menu system. PARKED at 5, 2026-08-13
- Task 194 — Touch gestures: one finger scrolls the page, two pan the map.
- Task 202 — `zh` converts at ~15% where its peers convert at 50–75%.
- Task 267 — "Save as" the backdrop image.
- Task 282 — Offer to attach the backdrop an imported `.inp` names.
- Task 294 — [H] · Decide the 7 remaining dead language keys, one each.
- Task 303 — Usage logging: the remaining lower-value questions.
- Task 306 — LibreEPANET.org: the rebranded site variant. BLOCKED on Task 248.
- Task 307 — [H] · LibreEPANET.org front-door copy. BLOCKED on Task 248.
- Task 347 — No project tabs at all until a project is opened.
- Task 355 — Long labels and short pipes — WAIT AND TEST.
- Task 391 — [H] · Evaluate `// @ts-check` with JSDoc branded types — a joint decision, not a proposal.
- Task 400 — Phase 3: bounded local search on the label residue.
- Task 410 — Animation: a time-frame slider, once Task 248 lands.
- Task 482 — EPANET's vocabulary collides with ours, and we are keeping ours.

---

80 of 80 titles are within 4–12 words. `!` marks the rest;
`php dev/scripts/roadmap_id_check.php` lists them with their word counts.
