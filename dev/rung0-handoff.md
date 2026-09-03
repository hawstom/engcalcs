# Handoff: the Rung 0 grievance link on `lpn_`

Written 2026-09-03 for an orchestrator to hand to one subagent. Everything here is settled unless a
line says Tom must rule it. Background on the whole idea — the cost ladder, the honesty boundary,
the permanently rejected ideas — is `dev/dilettante-path.md`; **read it before writing code**, and
read ROADMAP Task 207. This file is the build brief, not a second copy of the reasoning.

## 1. What to build, in one paragraph

A visitor on `Looped-Network.php` can tell us something is wrong **in one tap, with nothing typed**.
The tap posts a fixed context — page, language, and a short slug naming the situation — and nothing
else. No text box, no email field, no account, no gate. It is the floor of the cost ladder in
`dev/dilettante-path.md`, and the whole design claim is that **cost, not visibility, is what keeps
people from writing in.**

## 2. Why this page, and what the evidence does and does not support

- `Looped-Network.php:859` records that it is the **only calculator that does not call
  `echoFeedback()`**. Its invitation is Help > Fix something, which opens `contact.php` in a new
  tab. The page whose users have the most to say has the longest path to saying it.
- **Read the evidence limits in `dev/usage-data-log.md`'s 2026-09-03 section before designing
  anything.** The short version: a placement hung on the diagnostic box was RULED OUT — the amber
  `#lpn_status` box was met three times in ten and a half days. The surface every visitor meets is
  the map on the example network (17 of 20 opening moves). `first:import` was zero that window.
- **The bound, and it must not be argued away: 13 of 26 page loads did nothing at all.** This is an
  instrument for people who tried. It is not a fix for the ones who left.

## 3. The placement that follows

**Two sites, and the standing one is primary.**

1. **A standing, quiet affordance on the map surface** — visible to somebody who is *not* stuck,
   because that is who almost everybody is. It must not compete with the drawing: this page is a
   full-window drawing surface and its desktop layout is authoritative (CLAUDE.md, `lpn_` section).
2. **The `#lpn_status` diagnostic box, when it appears.** Rare, but it is the point of noticing and
   costs almost nothing once the mechanism exists. `setStatus()` currently writes `textContent`, so
   this is the one place the DOM shape has to change.

**Do not add a third door.** Task 542's elevation-fill row is the worked example of what happens
when one capability grows three entry points.

## 4. THE TRANSPORT ALREADY EXISTS — do not build a new one

This is the most important thing in the file and it was found by reading, not assumed:

- `EngCalcs.logSignal(event, detail)` in `js/Calculators.lib.js` already posts to
  `log-signal-event.php`, already dedupes per page load in memory, and already **queues to IndexedDB
  and retries when the visitor is offline** (`_sendOrQueue` / `_queueBeacon`). The PWA requirement in
  `dev/dilettante-path.md` is therefore already met by the channel — do not write a second one.
- `log-signal-event.php` holds a **closed set** of event names
  (`outbound`, `touch`, `units`, `repeat`, `lpn`, `share`) and sanitises the detail slug to
  `[A-Za-z0-9._:/-]` capped at 80 characters. Its own comment states the order for adding one:
  **the allowlist line, then the block comment in `lib/config.inc.php`, then
  `log/lang-log-stats.sh`.** Follow that order; the report is the only thing that can read what you
  write, so an unreported signal is an invisible one.
- **Recommended shape: reuse the existing `lpn` event with a new detail slug** rather than adding a
  seventh event name — the lpn rows already carry `first:<what>` and `diag:<code>`, so a
  `wrong:<code>` (and `wrong:none` for the standing affordance) fits the vocabulary that is already
  there and needs no new column value. Report it as its own block in `lang-log-stats.sh`, beside the
  existing lpn section.

## 5. Constraints, all of them blocking

- **NOTHING NEW IS STORED ON THE VISITOR'S DEVICE.** That is the entire reason this shape was
  chosen: no new storage means no `consent_body` rewrite, no 26 retranslations, no
  `EC_CONSENT_VERSION` bump that re-asks everybody. If your design starts wanting to remember who
  tapped, stop and re-read `CLAUDE.md`'s storage section — the answer is no.
- **Never anything out of the user's document.** No element ids, no coordinates, no counts of what
  they drew, no file names. A node coordinate says where their network is.
- **Three or four new English strings at most.** Every string costs x26. They go in
  `lib/lang.ec.en.php` ONLY — an absent key in the other 26 files is the correct untranslated state
  — and they reach Tom through `dev/new-english-keys.md`. **Never hand-edit that file.**
- **`$ec_lang_syn` is off-limits.** No entry, no edit, no exception.
- **Write in OUR vocabulary, not EPANET's** (`lpn_` section of `CLAUDE.md`).
- **The tone is fixed and it is half the design.** Warm, specific, no manufactured urgency, no guilt,
  no fake counters, nothing to dismiss. A thank-you must not imply a reply that is not coming.
- **A new lang key that reaches JS must go through the pageConfig bridge** or the visitor sees
  `undefined`; `pageconfig_check.php` reads aliases (`var pc = EngCalcs.pageConfig`) and will catch
  a miss.
- **Do NOT regenerate `dev/translation_payloads/`.** Say in your report that you added keys and
  leave them alone; a `payload freshness` failure in your own `check_all.sh` is EXPECTED and is not
  yours to fix. The orchestrator regenerates once, before the commit.
- **Commit inside the worktree. Never push.**

## 6. The seams to name, because this is where a parallel track will collide

- **`js/looped-network.js` is the collision risk.** As of 2026-09-03 another track was live in it
  (`.net` import study, element symbols, pipe theming). **Sequence this after that track lands, or
  give both briefs this seam by name.** Disjoint files are not enough — see the `setProp()`
  incident in `CLAUDE.md`.
- **`setStatus()` is the one writer of `#lpn_status`.** Go through it; do not write the element from
  a second place.
- **`EngCalcs.logSignal` is the one write seam for a signal row.** Do not post to the endpoint
  directly from page code.
- **`sw.php`** — a new shipped file must appear in the service worker manifest with its
  `?v=<filemtime>` query, or `sw_manifest_check.php` fails and the offline promise quietly breaks.
  Adding no new file is the easier answer.

## 7. Acceptance

- `sh dev/scripts/check_all.sh` green, payload freshness excepted (see above).
- **A harness in `dev/lpn-spike/`** driving the real page: the affordance exists, one tap calls
  `logSignal` exactly once with the expected slug, a second tap in the same page load posts nothing,
  and the status-box variant carries the diagnostic code that was on screen. Follow
  `dev/testing-notes.md` — a stub that removes the coupling makes a harness pass for the wrong
  reason.
- Report which keys you added, in your own words, so the orchestrator can regenerate payloads once.

## 8. What Tom must rule, and nobody else

1. **The wording of the three or four strings.** Draft them, do not decide them.
2. **An opted-out visitor's tap is currently DROPPED.** `log-signal-event.php` returns 204 for
   anyone matching `ecLoggingOptedOut()`, which is correct for analytics and arguably wrong for a
   message a person deliberately chose to send. Do not change that behaviour on your own judgement;
   surface it and let him decide.
3. **Whether this ever appears on the other calculators.** Out of scope here. `lpn_` first.
