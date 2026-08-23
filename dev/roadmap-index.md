# Roadmap index — open tasks, titles only

**Script-generated. Do not edit.** Regenerate with `php dev/scripts/generate_roadmap_index.php`.
`roadmap_id_check.php` fails if this file is stale. Edit `dev/ROADMAP.md`; this follows.

One line per open task: priority band, ID, marker, actor tag, and the executive-summary
title — the first bolded run of the description, 4–12 words. The rule and its rationale
live in `dev/scripts/roadmap_lib.php`. A title marked `!` is outside that range.

**83 open tasks.** Next (100): 6 · Soon (75): 8 · Someday (50): 17 · Maybe (25): 25 · Parked (5): 27

## 100 — Next (6)

- ! Task 145 — GEOGRAPHIC PROJECTS: a project declares grid or geographic before anything is drawn, the same way it declares units.
- ! Task 388 — The documentation is written as a transcript of revision, not as current state.
- ! Task 389 — Search and replace inputs across the network — WANTED, and no longer gated on network size.
- Task 405 — WAIT: sprint · Resync four English strings the sprint itself earned.
- ! Task 436 — A wheel notch on the map costs a full label relayout, and that is editor-wide.
- ! Task 439 — The lat/lon drawing comes apart past ~600,000 px/degree, and it is Task 354 in degrees.

## 75 — Soon (8)

- Task 239 — The English-friction loop: run the mechanized Wave 0 and measure its yield.
- Task 378 — [H] · Give the seven harnesses a network some other way, and delete `drawExampleNetwork()`.
- Task 426 — The SI and US preset buttons give no clue what they do.
- Task 458 — WAIT: sprint · One project mode, two names, in four languages.
- ! Task 465 — [H] · Reusable pipe and pump TYPES — one "150 mm PVC" definition that 400 pipes point at, so editing it edits all 400.
- ! Task 476 — [H] · Convert to lat/lon should land in a NEW project, not mutate the open one.
- Task 477 — [H] · A New-project WIZARD instead of the four-row File > New fly-out.
- Task 479 — LibreWaterNet.org needs a landing page, and this account needs a hosting decision.

## 50 — Someday (17)

- Task 207 — The dilettante path: make replying cost one tap, not five steps.
- ! Task 248.02 — Patterns (Task 248 child) — attach one to a RESERVOIR HEAD and a PUMP.
- Task 269 — ASU Engineers Without Borders answered, and asked to meet.
- Task 408 — Label leader dragging: an optional snap to 15°/30°/45° angle increments, user's choice.
- ! Task 425 — The dialog shown when you change a unit on the lpn page and the project already has content.
- Task 427 — Say on the map which field it is coloured by.
- ! Task 429 — The Ranges picker.
- Task 433 — Profile: the last piece is the CHOOSER.
- Task 437 — [H] · The geocoder works; it has no interface outside the placement tool.
- Task 441 — Settings box: docking left or right, and an AutoCAD-style anchor-and-flyout with autohide.
- ! Task 442 — [H] · The toolbar may want to become a side menu, and phones have a gesture we do not use.
- ! Task 452 — Satellite imagery from Mapbox — BUILT, and blocked on one decision about the token.
- Task 459 — WAIT: sprint · The next sprint's contents, already earned.
- Task 469 — Node labels should SHED properties before one of them is hidden.
- ! Task 472 — `alignedSideFor()` walks every link to place one label, which is the next quadratic.
- ! Task 478 — [H] · Tab should walk down the input column, not sideways into every unit select.
- ! Task 481 — A closed task cited as pending is how three false claims shipped in one day.

## 25 — Maybe (25)

- Task 144 — Diagnose the Hazen-Williams conversion leak — full record in `dev/hazen-williams-leak.md`.
- Task 146.05 — EPANET-style element browser (Task 146 child).
- Task 185 — Match/Copy properties tool (originated during Task 146).
- Task 217 — A suite-owned, multilingual Manning's n table, built from primary sources.
- ! Task 218 — Find advisors and proteges — a standing, nagged commitment, not a task that completes.
- Task 221 — Retire the "constants now match EPANET" note (Task 213) — CHECK: 2027-08-01.
- Task 225.13 — `dev/lpn-file-lock-test-punchlist.md` §13 needs the rewrite §0–§8 got
- ! Task 234 — Canal Seepage must prove its worth or go (Tom, 2026-08-08: "in my crosshairs").
- Task 247 — Demand allocation by customer (epanet-js has it, EPANET does not).
- ! Task 248 — Extended-period simulation — the last of the three things the EPANET engine unlocked, and the GATE on the LibreEPANET.org launch (Tasks 306/307).
- Task 248.03 — Rule-based controls, EPANET's `[RULES]` (Task 248 child).
- Task 248.04 — Curves (Task 248 child) — probably NEVER a separate interface.
- Task 266 — Multi-select (lasso) plus edit-all-selected, as EPANET has.
- Task 283 — Map label legibility: what remains is the AUTO-HIDE rule.
- Task 284 — Settings box follow-ups, after the two-pane box shipped (Task 441).
- ! Task 285 — We do not know what devices anybody uses this on, and several decisions have quietly assumed an answer.
- Task 322 — Standing advisories worth converting rather than re-reading.
- Task 348 — Sub-categories and paging in the examples gallery.
- ! Task 390 — Finish the unit paradigm migration: a unit is a NAME, and a file's numbers are the user's.
- ! Task 416 — The tester control panel: move it, prune it, and make it the request channel.
- ! Task 417 — Long-press on an element should enter Edit mode, exactly as a click does.
- Task 435 — The Labels panel's column headings sit too far right.
- Task 468 — Demand categories on a junction — the breakdown the importer already flattens.
- Task 470 — Search for a place by name while placing a model.
- Task 475 — Manning Irregular emits NaN for a zero-length segment.

## 5 — Parked (27)

- Task 114 — Reservoir / detention routing calculator (Modified Puls) — full scope in `dev/detention-routing-scope.md`.
- Task 116 — Solar water pumping sizing.
- Task 117 — Pico-hydro / hydrokinetic (damless, in-stream) turbine feasibility.
- Task 118 — Solar water pasteurization / SODIS exposure calculator.
- Task 146.09 — Map insets for congested areas of a drawing (Task 146 child).
- ! Task 155 — [H] · Deploy and verify the Task 149 search-index fix — deployed, awaiting Search Console confirmation.
- Task 158 — `sewslope.php` and `peakfact.php` are English-only while the sewer-slope demand is not.
- Task 175 — A real printable version, suite-wide.
- Task 178 — Build a real filmstrip-GIF Help asset from `dev/filmstrip-gif-recipe.md`
- Task 181 — Per-element symbol sizing (originated during Task 146).
- Task 186 — Table-paradigm editor with spreadsheet copy/paste (originated during Task 146).
- ! Task 191 — Junction emitters — surface the pressure-dependent demand the solver already has (originated during Task 146).
- Task 192 — Right-click / long-press context-menu system. PARKED at 5, 2026-08-13
- ! Task 194 — Touch gesture model: one finger scrolls the page, two fingers pan the map (originated during Task 146).
- ! Task 202 — `zh` converts at ~15% where its peers convert at 50–75% — PARKED until n=30, with a pre-registered threshold.
- Task 267 — "Save as" the backdrop image.
- Task 282 — Offer to attach the backdrop an imported `.inp` names.
- Task 294 — [H] · Decide the 7 remaining dead language keys, one each.
- Task 303 — Usage logging: the remaining lower-value questions.
- Task 306 — LibreEPANET.org: the rebranded site variant. BLOCKED on Task 248.
- Task 307 — [H] · LibreEPANET.org front-door copy. BLOCKED on Task 248.
- Task 347 — No project tabs at all until a project is opened.
- Task 355 — Long labels and short pipes — WAIT AND TEST.
- Task 391 — [H] · Evaluate `// @ts-check` with JSDoc branded types — a joint decision, not a proposal.
- ! Task 400 — Phase 3 — bounded local search on the residue. LOWERED 60→15, Tom 2026-08-17: "Phases 1 and 2 are good enough for GIS mode or management mode. Phase 3 may be helpful for report mode."
- ! Task 410 — Animation: a time-frame slider (time display, play, pause, speed) once Task 248 lands.
- Task 482 — EPANET's vocabulary collides with ours, and we are keeping ours.

---

55 of 83 titles are within 4–12 words. `!` marks the rest;
`php dev/scripts/roadmap_id_check.php` lists them with their word counts.
