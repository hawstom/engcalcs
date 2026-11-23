# Test trim, pass 2 (2026-11-22)

Pass 1 (`chore/test-trim`, merge 76e64f563) retired 60 checks and moved pixel harnesses on demand. Pass 2, approved by Tom 2026-10-29: merge the user-guide, pane, scenario and label harness families.

## What was done

- **A browser family now runs as a few `*-group-harness.js` files** (`user-guide-a..d`, `scenario-a..d`, `label-a..f`, `pane`: 15 files for 82 harnesses). Each group runs its members in one process on one PHP server and one Chromium through `dev/lpn-spike/browser-group-lib.js`. **No member was edited**, so every assertion and mutation control is the original's, and each member still runs alone with `node dev/lpn-spike/<member>`. `dev/scripts/group_harness_members.txt` names the members; `run_harnesses.sh` skips them and fails if one is in no group file.
- **Why members were not folded into one file:** a member is a whole scenario with its own seed, session and exit path (5654 lines in user-guide alone). Rewriting them into one body would move assertions by hand for no extra coverage. The library gives the saving that is available (one server and one Chromium boot) without touching an assertion.
- **Time saved is small, and said plainly.** Boot cost is 1 to 3 s per member; the harnesses spend their time in the page (fixed settle waits, real Chromium work). Measured below: a group takes about what its members take alone (4 percent of lane time at most). What fell is the number of units `run_harnesses.sh` queues (82 browser harnesses became 15) and the Chromium and PHP boots. A real cut in run time needs shorter waits inside the members, not merging.
- A group gets 900 s in `run_harnesses.sh` (a lone harness keeps 300 s); the library holds each member to 290 s, so a hang still fails by name.
- **Left alone:** `label-pipe-fields-browser-harness.js` (needs most of a 300 s budget; in a group it hit the 290 s member cap), `bottom-pane-toggle-lag-harness.js` (on demand), and every node-only harness (below).

## Result (browser harnesses; seconds alone before, group wall time after)

| family | browser files before | groups after | s before | s after | checks before | checks after |
|---|---|---|---|---|---|---|
| user-guide (with guide-style) | 27 | 4 | 873 | 846 | 874 | 874 |
| scenario | 22 | 4 | 1072 | 1061 | 815 | 815 |
| label | 21 | 6 | 1908 | 1803 | 722 | 722 |
| pane | 12 | 1 | 433 | 423 | 202 | 202 |
| total | 82 | 15 | 4286 | 4133 | 2613 | 2613 |

About 150 s (3.5 percent), and part of that is noise: the label "before" includes runs measured while another harness ran beside them. Check counts are lines starting `  ok `; the 874 for user-guide before is the sum of the 27 harnesses' own counts. No assertion was deleted or moved, so there is no duplicate to list. Deleted files: none (members stay, runnable alone). Added: `browser-group-lib.js`, 15 `*-group-harness.js`, `group_harness_members.txt`.

## Node-only harnesses: not merged

About 75 pane, scenario and label node harnesses, 0.1 to 3 s each (a few at 20 to 45 s: `label-open-side-harness`, `label-settings-memo-harness`, `scenario-settings-routing-harness`), run in the node pool 24 at a time. They stub the DOM and load `js/lpn-*.js` into global scope, so merging them would share globals between unrelated tests and save only node start-up (about 0.15 s each). Not worth the risk.

## Library mechanics (what a group changes for a member)

`env.stopServer()` held back (a member ending by `process.exitCode` is finished at its `stopServer()`); `chromium.launch()` returns one shared browser; `process.exit()` caught; the flock re-exec skipped by setting every `EC_..._LOCKED` the member or a sibling it requires checks; this folder's modules (except the helpers) and the environment are reset between members, because a wrapper such as `label-form-n600-browser-harness.js` sets `LABEL_FORM_SCENES` and requires another harness. Shared across members: the PHP server's error log. A group file that errors outside a member fails loudly.

## Inventory (seconds alone, one at a time, private browser lock, 2026-11-22; load from other sessions on jasmine was low but not zero)

Checks = lines starting `  ok `; a harness with its own output format shows 0 and its own total in the last column. Group = where it runs now.

### user-guide and guide-style (28 files)

| file | s | checks | runs in |
|---|---|---|---|
| guide-bold-labels-harness.js | 1 | 0 (all 6773 checks passed) | node pool |
| guide-chapter-page-harness.js | 1 | 56 | node pool |
| guide-style-harness.js | 8 | 22 | user-guide-a |
| user-guide-boxes-harness.js | 29 | 15 | user-guide-a |
| user-guide-calibration-harness.js | 22 | 14 | user-guide-d |
| user-guide-column-harness.js | 16 | 35 | user-guide-a |
| user-guide-contour-harness.js | 34 | 16 | user-guide-d |
| user-guide-criticality-harness.js | 30 | 20 | user-guide-d |
| user-guide-demandscale-harness.js | 20 | 19 | user-guide-d |
| user-guide-energy-harness.js | 25 | 14 | user-guide-c |
| user-guide-find-harness.js | 69 | 95 | user-guide-a |
| user-guide-fireflow-harness.js | 20 | 24 | user-guide-c |
| user-guide-hierarchy-harness.js | 14 | 47 | user-guide-b |
| user-guide-library-harness.js | 54 | 50 | user-guide-b |
| user-guide-map-harness.js | 93 | 30 | user-guide-b |
| user-guide-menus-harness.js | 14 | 16 | user-guide-d |
| user-guide-notes-harness.js | 25 | 15 | user-guide-c |
| user-guide-own-harness.js | 15 | 11 | user-guide-d |
| user-guide-point-harness.js | 31 | 61 | user-guide-b |
| user-guide-properties-harness.js | 27 | 34 | user-guide-d |
| user-guide-rail-harness.js | 24 | 65 | user-guide-d |
| user-guide-reports-harness.js | 27 | 22 | user-guide-c |
| user-guide-scenarios-harness.js | 134 | 67 | user-guide-c |
| user-guide-search-hit-harness.js | 6 | 24 | user-guide-a |
| user-guide-settings-harness.js | 55 | 40 | user-guide-b |
| user-guide-tables-harness.js | 23 | 15 | user-guide-a |
| user-guide-toolbar-harness.js | 16 | 18 | user-guide-a |
| user-guide-using-harness.js | 18 | 18 | user-guide-b |

### scenario (42 files)

| file | s | checks | runs in |
|---|---|---|---|
| export-scenario-confirm-browser-harness.js | 57 | 93 | scenario-d |
| fotobi-scenarios-harness.js | 1 | 46 | node pool |
| graph-bubble-scenario-browser-harness.js | 29 | 30 | scenario-d |
| import-new-scenario-browser-harness.js | 110 | 52 | scenario-d |
| inp-export-scenario-name-browser-harness.js | 14 | 6 | scenario-d |
| net1-scenarios-pair-harness.js | 1 | 13 | node pool |
| scenario-active-topology-browser-harness.js | 33 | 20 | scenario-d |
| scenario-active-topology-harness.js | 9 | 65 | node pool |
| scenario-all-overridable-harness.js | 1 | 34 | node pool |
| scenario-alternatives-harness.js | 2 | 0 (ALL PASS) | node pool |
| scenario-basemap-browser-harness.js | 10 | 8 | scenario-a |
| scenario-compare-fixed-head-harness.js | 0 | 5 | node pool |
| scenario-compare-harness.js | 0 | 19 | node pool |
| scenario-demand-blank-category-harness.js | 0 | 11 | node pool |
| scenario-demand-category-harness.js | 0 | 55 | node pool |
| scenario-demand-multiplier-harness.js | 0 | 26 | node pool |
| scenario-example-browser-harness.js | 18 | 14 | scenario-d |
| scenario-example-harness.js | 2 | 43 | node pool |
| scenario-flyout-browser-harness.js | 52 | 71 | scenario-c |
| scenario-harness.js | 1 | 0 (ALL PASS) | node pool |
| scenario-io-names-browser-harness.js | 37 | 22 | scenario-c |
| scenario-manager-basic-browser-harness.js | 18 | 21 | scenario-c |
| scenario-manager-browser-harness.js | 70 | 88 | scenario-c |
| scenario-manager-harness.js | 17 | 187 | node pool |
| scenario-name-truncate-browser-harness.js | 6 | 5 | scenario-a |
| scenario-only-delete-browser-harness.js | 42 | 30 | scenario-c |
| scenario-pass-1012-browser-harness.js | 145 | 59 | scenario-a |
| scenario-pass-1013-browser-harness.js | 181 | 51 | scenario-a |
| scenario-pass-1014-browser-harness.js | 43 | 28 | scenario-b |
| scenario-preset-harness.js | 0 | 35 | node pool |
| scenario-receipt-browser-harness.js | 34 | 24 | scenario-b |
| scenario-report-mix-browser-harness.js | 20 | 10 | scenario-b |
| scenario-results-by-asset-browser-harness.js | 58 | 76 | scenario-b |
| scenario-settings-routing-harness.js | 32 | 0 (ALL PASS) | node pool |
| scenario-sort-harness.js | 0 | 0 (ALL PASS) | node pool |
| scenario-time-option-harness.js | 1 | 51 | node pool |
| scenario-tree-browser-harness.js | 42 | 57 | scenario-c |
| scenario-tree-harness.js | 22 | 0 (ALL PASS, 536 passed) | node pool |
| scenario-ui-stored-shape-browser-harness.js | 18 | 17 | scenario-d |
| shape-scenario-browser-harness.js | 35 | 33 | scenario-d |
| text-scenario-harness.js | 0 | 62 | node pool |
| wtg-scenario-harness.js | 6 | 58 | node pool |

### label (59 files)

| file | s | checks | runs in |
|---|---|---|---|
| aligned-label-harness.js | 0 | 32 | node pool |
| box-label-wrap-browser-harness.js | 100 | 84 | label-f |
| customer-label-cause-harness.js | 1 | 7 | node pool |
| customer-label-size-harness.js | 0 | 10 | node pool |
| gradient-label-harness.js | 0 | 9 | node pool |
| hidden-label-grab-harness.js | 0 | 20 | node pool |
| label-affix-harness.js | 0 | 59 | node pool |
| label-batch-harness.js | 1 | 10 | node pool |
| label-bucket-cache-harness.js | 14 | 29 | node pool |
| label-clean-ground-harness.js | 24 | 14 | node pool |
| label-columns-harness.js | 0 | 375 | node pool |
| label-crossing-final-browser-harness.js | 98 | 6 | label-e |
| label-crossing-harness.js | 15 | 32 | node pool |
| label-decor-harness.js | 0 | 27 | node pool |
| label-drag-fit-harness.js | 30 | 8 | label-b |
| label-drag-track-harness.js | 155 | 8 | label-e |
| label-evict-return-harness.js | 8 | 14 | node pool |
| label-export-stable-browser-harness.js | 37 | 11 | label-b |
| label-form-n600-browser-harness.js | 94 | 26 | label-c |
| label-form-wheel-browser-harness.js | 242 | 148 | label-c |
| label-gang-harness.js | 20 | 27 | node pool |
| label-hit-box-browser-harness.js | 43 | 28 | label-a |
| label-leader-bound-browser-harness.js | 242 | 87 | label-b |
| label-leader-keep-harness.js | 47 | 54 | label-a |
| label-leader-shapes-browser-harness.js | 286 | 26 | label-a |
| label-limit-parity-harness.js | 1 | 43 | node pool |
| label-limit-zero-harness.js | 1 | 38 | node pool |
| label-measure-cache-harness.js | 0 | 3 | node pool |
| label-node-symbol-harness.js | 12 | 20 | node pool |
| label-open-side-browser-harness.js | 128 | 10 | label-d |
| label-open-side-harness.js | 47 | 42 | node pool |
| label-pass-economy-browser-harness.js | 85 | 29 | label-f |
| label-pipe-fields-browser-harness.js | 381 | 104 | alone |
| label-pipe-full-fields-harness.js | 22 | 31 | node pool |
| label-priority-harness.js | 0 | 0 (label-priority-harness: phase ) | node pool |
| label-repeat-harness.js | 0 | 43 | node pool |
| label-settings-memo-harness.js | 45 | 0 (PASS) | node pool |
| label-shed-harness.js | 0 | 0 (label-shed-harness: 182 checks) | node pool |
| label-snapshot-demand-browser-harness.js | 8 | 5 | label-a |
| label-stability-harness.js | 11 | 16 | node pool |
| label-station-cap-harness.js | 0 | 6 | node pool |
| label-visibility-harness.js | 0 | 44 | node pool |
| labels-off-work-harness.js | 1 | 26 | node pool |
| pipe-label-level-browser-harness.js | 94 | 37 | label-d |
| pipe-label-level-harness.js | 24 | 55 | node pool |
| pipe-label-level-wheel-browser-harness.js | 55 | 17 | label-d |
| rename-label-zombie-harness.js | 19 | 23 | label-c |
| settings-labels-rows-browser-harness.js | 40 | 30 | label-f |
| settings-labels-wrap-browser-harness.js | 18 | 32 | label-b |
| short-labels-browser-harness.js | 22 | 32 | label-b |
| short-line-label-harness.js | 0 | 17 | node pool |
| small-symbol-label-harness.js | 0 | 16 | node pool |
| text-label-props-harness.js | 0 | 32 | node pool |
| undo-redo-label-harness.js | 65 | 21 | label-f |
| valve-symbol-label-harness.js | 7 | 8 | node pool |
| zombie-label-harness.js | 0 | 14 | node pool |

### pane (36 files)

| file | s | checks | runs in |
|---|---|---|---|
| bottom-pane-toggle-growth-harness.js | 122 | 54 | pane |
| bottom-pane-toggle-lag-harness.js | 16 | 5 | alone |
| frequency-pane-height-harness.js | 5 | 11 | pane |
| pane-attached-align-harness.js | 0 | 32 | node pool |
| pane-boxes-browser-harness.js | 71 | 40 | pane |
| pane-clear-override-harness.js | 0 | 24 | node pool |
| pane-clear-override-speed-browser-harness.js | 30 | 10 | pane |
| pane-col-hide-harness.js | 0 | 35 | node pool |
| pane-col-width-harness.js | 0 | 20 | node pool |
| pane-column-drag-harness.js | 1 | 66 | node pool |
| pane-ctrlenter-harness.js | 0 | 61 | node pool |
| pane-description-heading-width-browser-harness.js | 46 | 9 | pane |
| pane-description-phone-browser-harness.js | 16 | 4 | pane |
| pane-filldown-harness.js | 0 | 26 | node pool |
| pane-fillhandle-harness.js | 0 | 67 | node pool |
| pane-follows-doc-harness.js | 0 | 15 | node pool |
| pane-harness.js | 1 | 412 | node pool |
| pane-heading-menu-harness.js | 0 | 36 | node pool |
| pane-heading-rule-ab-harness.js | 20 | 0 (1586/1586 checks passed. Scree) | pane |
| pane-heading-rule-examples-harness.js | 65 | 0 (5909/5909 checks passed. Scree) | pane |
| pane-heading-rule-harness.js | 34 | 0 (1061/1061 checks passed. Scree) | pane |
| pane-heading-wrap-harness.js | 10 | 16 | pane |
| pane-initial-width-harness.js | 0 | 20 | node pool |
| pane-modes-harness.js | 0 | 66 | node pool |
| pane-print-cell-wrap-harness.js | 5 | 43 | pane |
| pane-print-harness.js | 1 | 116 | node pool |
| pane-result-decimals-harness.js | 0 | 11 | node pool |
| pane-review-2-harness.js | 0 | 56 | node pool |
| pane-review-5-harness.js | 0 | 12 | node pool |
| pane-review-harness.js | 0 | 73 | node pool |
| pane-row-paste-harness.js | 5 | 116 | node pool |
| pane-select-harness.js | 0 | 75 | node pool |
| pane-select-option-colour-browser-harness.js | 9 | 15 | pane |
| pane-show-scenarios-harness.js | 0 | 38 | node pool |
| pane-table-paste-roundtrip-harness.js | 5 | 65 | node pool |
| pane-tableswitch-harness.js | 0 | 62 | node pool |

### other (panel-*, not a family) (4 files)

| file | s | checks | runs in |
|---|---|---|---|
| panel-cap-relax-harness.js | 0 | 44 | node pool |
| panel-capture-harness.js | 0 | 21 | node pool |
| panel-fill-harness.js | 0 | 90 | node pool |
| panel-touch-harness.js | 0 | 39 | node pool |

