# EngCalcs test-suite efficiency audit — measured 2026-10-15 00:55–02:31 MST on jasmine

Report-only. Nothing in the repo was edited. Raw data in this folder:
steps.tsv (static checks, per step), node_times.tsv, browser_times.tsv, calc_times.tsv (secs, exit, file),
out/ out_b/ out_c/ (each harness's output), simulate.py (scheduler model), timed_checks.sh (check_all copy
with slot logic, stamp and harness runners removed, each run_check timed).

Method: waited for every check_all to finish. Static steps run serially as check_all does (65 s).
Node lpn harnesses in a rolling pool of 6 (the pool size check_all gets on 24 cores / 4 slots).
Browser harnesses one at a time under flock /tmp/engcalcs-browser.lock (four per lock hold, so other
sessions' harnesses waiting on that lock with their 280 s give-up were not starved; EC_BROWSER_LOCK
pointed at a private file so the self-locking harnesses did not deadlock). All 481 harnesses exited 0.

## 1. Where the time goes (a full check_all today is ~57 min, not 25)

Today's real runs: check_all2 21:59 → 22:56, check_all3 22:59 → 23:56 (harness phase alone ~56 min).

| Part | Files | Sum of per-file time | Wall time in check_all |
|---|---|---|---|
| 160-odd PHP/static checks | 166 steps | 64 s | 65 s (serial) |
| node lpn harnesses | 354 | 328 s | 60 s at 6 at a time |
| browser lpn harnesses | 107 by the grep (106 real) | 3155 s = 52.6 min | 52.6 min (serial) |
| calc harnesses | 20 | 8 s | 8 s (serial) |
| scheduling loss (batch-wait + drain) | | | ~4 min (modelled 3392 s vs 3155 s) |

Browser harnesses are 92% of the wall time. Slowest static step is 5 s (harness wording selftest).
Browser harness size: 28 under 10 s, 42 at 10–30 s, 24 at 30–60 s, 13 over 60 s. Fastest real launch
~1.5–2 s, so start-up (php -S + Chromium + page) is roughly 2–4 s each, ~5 min of the 52.
Load average stayed ~0.5 during the serial browser run: they mostly WAIT (fixed sleeps, settle()).
The browser harnesses contain 1,221 literal fixed waits totalling 818 s as written (more in loops).

### Top 25 slowest harnesses (all are browser harnesses; slowest node one is change-type, 20 s)
| harness | s |
|---|---|
| label-drag-track-harness.js | 143.01 |
| shape-import-harness.js | 125.03 |
| setting-scope-browser-harness.js | 108.10 |
| backdrop-export-roundtrip-browser-harness.js | 100.61 |
| dock-title-band-harness.js | 97.31 |
| shape-browser-harness.js | 83.19 |
| convert-as-browser-harness.js | 80.61 |
| label-pass-economy-browser-harness.js | 78.78 |
| message-hide-reload-harness.js | 77.89 |
| workspace-browser-harness.js | 66.74 |
| user-guide-find-harness.js | 66.17 |
| undo-redo-label-harness.js | 64.44 |
| contour-browser-harness.js | 63.10 |
| dialog-modal-browser-harness.js | 59.24 |
| dialog-audit-browser-harness.js | 57.03 |
| epanet-topology-refusal-browser-harness.js | 56.03 |
| dock-memory-harness.js | 53.29 |
| snap-browser-harness.js | 50.33 |
| pane-heading-rule-examples-harness.js | 48.19 |
| dock-flag-order-harness.js | 47.97 |
| tip-door-browser-harness.js | 45.95 |
| hover-card-browser-harness.js | 45.69 |
| dock-browser-harness.js | 45.50 |
| scenario-only-delete-browser-harness.js | 41.59 |
| convert-as-fotobi-harness.js | 41.50 |

### Slowest static steps
| step | s |
|---|---|
| harness wording selftest | 5.2 |
| php syntax (all .php) | 4.0 |
| button type selftest | 3.7 |
| key hygiene | 3.4 |
| harness wording pins | 2.6 |
| log format selftest | 2.4 |
| lang syntax rules A-D | 2.3 |
| host script parity | 1.8 |
| number step selftest | 1.8 |
| form field units selftest | 1.6 |

## 2. Scheduling in run_harnesses.sh (modelled from the measured per-file times)

| Schedule | Harness phase |
|---|---|
| today: batch-of-6 wait + drain before every browser harness | 3392 s (56.5 min) |
| rolling node pool, still draining before browser | 3372 s (−20 s) |
| one browser lane beside the node pool (no drain) | 3155 s (−4 min) |
| 2 browser lanes + node pool | 1585 s (26 min) |
| 3 browser lanes | 1057 s (17.6 min) |
| 4 browser lanes | 810 s (13.5 min; longest-first ordering 789 s) |

Batch-wait costs almost nothing (node phase is only 60 s). The drain costs ~4 min. The real lever is
running browser harnesses side by side.

### Task 797 feasibility: what collides
- Ports: no collision. dev/browser-pass/lib/env.js asks the OS for a port and proves the server with a
  random sentinel; docroot is mkdtemp. Chromium profiles are Playwright temp contexts (backdrop-export
  makes its own mkdtemp profile).
- THE BROWSER LOCK is the real blocker: 102 of the 107 harnesses re-exec themselves under
  flock -w 280 $EC_BROWSER_LOCK (default /tmp/engcalcs-browser.lock; check_all sets one per slot).
  Lanes sharing one EC_BROWSER_LOCK would simply queue, and a queue over 280 s prints NOT RUN and FAILS.
  Each lane needs its own lock file (e.g. /tmp/engcalcs-browser.slot$i.lane$k.lock).
- Note: "one Chromium at a time" is already not true machine-wide. check_all slots use per-slot locks,
  so up to 4 slots plus every ad-hoc session on the global lock run Chromiums at once (seen tonight:
  feat-text-halo, fix-search-zoom-accuracy, feat-leader-keep, feat-bentley-interop worktrees all queued
  on the global lock while check_all ran on slot1). The "7 GB box" reasoning in run_harnesses.sh is stale:
  jasmine has 24 threads and 60 GB.
- Shared checkout state, the one real hazard: sw-precache-log-harness.js moves REPO/log/*.log aside and
  asserts EXACT row counts (=== 0, === 1). Any other harness loading a page in the same checkout at the
  same time adds rows. It should use EC_TEST_LOG_DIR as count-code-browser-harness.js and
  calc-spike/visit-dedupe-harness.js already do (lib/config.inc.php:362). Until then keep it exclusive.
  (It is already exposed today to the other slots in the same checkout, and if killed mid-run it leaves
  the real logs renamed *.harness-aside.)
- Wall-clock assertions that will get flakier in company: contour-browser-harness.js:154 (cold < 500 ms),
  engine-idle-prefetch-harness.js:169 (took < 3500 ms). Measure them under 3–4 lanes first.
- Cosmetic: fixed screenshot paths (/tmp/message-dismiss-*.png, shape-table, mode-focus dir) only
  collide with the same harness in another slot. menu-button-harness.js:26 defaults its screenshots into
  ANOTHER SESSION's scratchpad (…/18aaeba2-…/scratchpad) — harmless, but wrong.
- Classification: zoom-control-harness.js is node-only (0.1 s) but is treated as a browser harness because
  a comment mentions chromium. The grep counts 107; 106 really launch.
What it would take: run_harnesses.sh starts K browser lanes (K≈3, or cores/slots/2), each a serial queue
with its own EC_BROWSER_LOCK, alongside the rolling node pool; longest-first ordering; sw-precache-log moved
to EC_TEST_LOG_DIR (or kept in an exclusive tail); the two timing pins re-measured. Output stays in glob
order (already per-file). Effort: about half a day including a few trial runs at ENGCALCS_HARNESS_JOBS=1
for comparison.

## 3. Redundancy (evidence from a read of headers and ok() labels; file:line)
High confidence:
- Box title-bar "?": dock-browser-harness.js section 4 (:394 etc.) duplicates user-guide-column:187 and
  user-guide-rail:199-200, :263-266; tip-door-browser:203-206 repeats one. dock-browser's only unique item
  there: Fire flow/Criticality/Demand scaling open on their intro.
- Explanation-tip width: tip-width-browser:66,68 = tip-door-browser:140,:259. tip-width unique: name-tip
  half (:56-60). 
- Message hide: message-dismiss-browser:140-151,180 = message-dismiss-x:121-132; reload checked in
  dismiss-x:164-174 and (more strongly) message-hide-reload:75-88. "Words never stored" 3 times
  (dismiss-browser:225, dismiss-x:167, node message-hide-persist:74). dismiss-browser also carries an
  unrelated Zoom Window section (:250-354).
- Label drag: label-drag-track (143 s, slowest) says (lines 8-10) it generalises label-drag-fit:161.
  fit's remaining unique checks: tip string :159 and zoom-to-fit threshold :185-211.
- Menu focus: menu-keyboard:170-177 = menu-mnemonic:120; phone-menu-keys:65 = mnemonic:237-261.
Medium (overlap, and separate launches that could be one):
- properties-box-fill/-fit/-width (47 s total, 3 launches); user-guide x6 + guide-style (172 s, 7 launches);
  dock-* x5 + alt-autohide (275 s); tank-depth-graph/-volume; workspace-browser/-inplace; shape-browser /
  shape-import / shape-import-qgis (shared DXF and EPSG:3857 flows).
Node/browser pairs: contour, epanet-topology-refusal, tank-ground are complementary (math in node, UI in
browser). web-mercator mostly complementary. dxf-export browser half re-checks R2000/spec items the node half
holds (deliberate: the stub once passed while the page threw). convert-as overlaps on one claim.
calc-spike: all-calcs-smoke's "defaults pass" overlaps 9 per-calc harnesses, but it is all node and 8 s total.
Saving from merging: start-up is only 2–4 s a launch, so merging these clusters saves ~1–3 min serial, much
less once lanes exist. Worth it for maintenance (one fix instead of three), not for speed.

## 4. Brittleness (pins incidental values)
Load-dependent (flake on a busy box; check_all runs 4 suites at once):
- save-entry-at-hand-harness.js:284,:289 — compares medians of two code paths (afterMs < beforeMs).
- contour-browser-harness.js:154 cold < 500 ms; engine-idle-prefetch-harness.js:169 took < 3500 ms.
- collide-harness.js:304 ms < 500; collide-span-bound-harness.js:60,:101 < 2000 ms.
- low risk hang-catchers: pane-row-paste:135 (<5 s), contour-harness:785 (<4 s), ramps:237 (<10 s).
Counts that grow with the product (break on a legitimate addition):
- projection-harness.js: === 184 catalogue rows in 8 places; :764 === 5347 register rows.
- dock/pane tab counts: dock-default:95 (14), workspace-inplace:236 (14), workspace-browser:261 (13),
  pane-harness:363 (13; its comment at :358-362 records four earlier bumps).
- deleted-key:93, key-merge:77 langs.length === 27 (derive from the glob).
- help-menu:66,68 row counts 7/13; help-file-menu-745-718:132 (10); report-harness:172,:249 column counts;
  custom-property:407 (10 rows); change-type:275 exactly 23 newlines in a message.
Layout / numerical incidentals: node-shed:562 drawn >= 45 labels; zoom-pass-determinism:117 > 40;
demand-scaling:192 solves <= 13; alt-table-layout:174,:186 pixel windows ±2/±6 px; button-base:124,:127
24–34 px heights; pane-column-drag:440 holdMs 400–500; popover-place:111,:193 exact stub heights.
Not flagged (deliberate rules): byte-exact .inp round trips, bit-exact idempotence, fixed EPANET tables.

## 5. Dead or nearly dead
Real defects in the tests:
- inp-roundtrip-net3-harness.js:151 — if export is REFUSED it prints and process.exit(0): its whole subject
  failing is green. Also :181-186 judges only the gallery leg; control-leg findings never fail.
- dxf-export-browser-harness.js:203 — a failed ezdxf audit (traceback, no "ERR") prints NOT RUN, not FAIL.
  The node twin dxf-export-harness.js:178 does it right.
- demand-category-harness.js:558-593 — try/catch turns any throw (a regression included) into
  "skip, engine unavailable".
Always-pass assertions: backdrop-attach-browser:196 ("|| true"), notice-log:515 ("|| true"),
text-object:90 (first half "|| true"); placeholder ok(…, true) in fireflow-box:358,:408, pattern-demand:126,
label-drag-fit:203, first-visit-geo:131, small-symbol-label:126, calc-spike/or-harness:343 (a known
defect logged as a pass).
Never run in check_all:
- ezdxf audit: python ezdxf is not installed on jasmine and EC_EZDXF_PYTHON is never set, so all 8 audit
  calls print NOT RUN on every run (dxf-export-harness.js:160-163; dxf-export-browser:81,:204).
- dev/epanet-models/ does not exist, so the client-model halves of net-import:387-391, inp-import:503-507,
  scenario:915-917 skip silently.
- env-gated by design (manual only): EC_LIVE_GEOCODE (search:171), NET1_DIGEST (ewb-meeting:231),
  *_MUTATE self-tests (basemap-dateline:45, xy-world-map:39).
- 89 browser harnesses exit(0) "SKIPPING" with no Chromium/playwright. Present on jasmine, but a broken
  browser install would turn ~89 harnesses green at once. The runner could count SKIPPING as a failure
  (or check once that Chromium launches).
Clean: every function harnesses extract() from js/ still exists; every js/ lib/ path they read resolves.

## 6. Recommendations, ranked (minutes are per full check_all)
1. Browser lanes in run_harnesses.sh (Task 797), K=3 with per-lane EC_BROWSER_LOCK, longest-first:
   saves ~39 min (57 → ~19); K=4 ~43 min. Risk: low once sw-precache-log uses EC_TEST_LOG_DIR and the two
   ms pins are re-measured; catches the same defects. Effort: ~half a day.
2. Stop draining the node pool before each browser harness (one browser lane beside the pool): ~4 min.
   Trivial; subsumed by 1. Rolling instead of batch pool: 20 s, not worth a change on its own.
3. Fix the test defects in section 5 (inp-roundtrip exit 0, dxf NOT RUN-on-failure, demand-category
   catch, the  asserts). 0 min saved; these are where defects can hide today. Effort: an hour.
4. Install ezdxf on jasmine (pip in a venv, set EC_EZDXF_PYTHON in check_all) or delete the audit and say
   so: today it guards nothing. Guards: a DXF a visitor's CAD program refuses. Effort: 15 min.
5. Replace fixed sleeps with waits on a condition in the slowest browser harnesses (818 s written; top:
   convert-as-browser 30 s, dialog-modal 28 s, tip-door 28 s, dialog-audit 28 s, engine-idle 24 s).
   Estimate 5–10 min serial (2–3 min with lanes). Risk: medium (a too-early read gives a false failure;
   never a false pass if the condition is the thing asserted). Effort: a day, harness by harness.
6. De-pin the growing counts (projection 184 x8, tab counts, langs 27) by deriving them from the source,
   and turn the timing pins into ratios measured alternately (as testing-notes.md already prescribes).
   0 min saved; removes red builds that are not defects.
7. Merge the redundant clusters in section 3 (tip-width into tip-door, dock-browser §4 into user-guide-rail,
   message-dismiss-x's reload into message-hide-reload, label-drag-fit into label-drag-track). Saves ~1–3 min
   serial, under 1 min with lanes. Do it for maintenance. Each merge moves the unique checks named above;
   nothing is lost.
8. Not worth it: parallelising the 166 static checks (65 s total) or the calc harnesses (8 s).
