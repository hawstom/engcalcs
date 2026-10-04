# Raw dialog audit (Task 710)

Every raw `alert(`, `confirm(` and `prompt(` call on the Looped Network page, sorted by what the
visitor needs. Task 704 built the message log; an `alert()` is the opposite of it, because it holds
the page and leaves nothing behind. Rule: **a dialog may block only to guard data loss or an
irreversible act, or to take a typed answer.** Everything else is a message and goes through
`setNotice()` (severity info) or `setWarning()` (the banner's second severity) and so into the log.
Severity stays at the two the banner already draws. No string's English changed, only its delivery.
None of the converted strings mentioned "OK" or any button, so none needed rewording.

The count was 57 when Ida wrote the item; today it is **77** non-comment call sites (71 in
`js/looped-network.js`, 3 in `js/lpn-search.js`, 3 in `js/lpn-terrain.js`).

## Totals

| Verdict | Count | What happened |
|---|---|---|
| MUST BLOCK | 38 | Now `askDialog()`, the page's one in-page box (20 confirm, 17 prompt, 1 alert) |
| INFORMATION, info | 9 | 5 are an `askDialog` alert again (`tellNotice()`); the 4 click instructions of the background image tools are a notice and stay on the mode bar |
| INFORMATION, warning | 30 | `setWarning()`: an `askDialog` alert, waiting for OK, and logged at severity `warning` |
| DELETE | 0 | Nothing was redundant |
| **Total** | 77 | No native alert/confirm/prompt is left on the page |

## The one question box

Tom, 2026-10-04: *"The browser-style boxes aren't pretty. I think they all should be converted."*
The 38 MUST BLOCK sites still block, but in the page's own box: `askDialog(req, done)` in
`js/looped-network.js` (`EngCalcs.lpnAsk` for `js/lpn-search.js` and `js/lpn-terrain.js`;
`askDialogP()` is the Promise form the async file commands `await`). It is not a second modal: it
fills `#lpn_dialog`, the box `openDialog()` already used for the close prompt and the lock choice,
which gained a title band (`.lpn-setbox-title`, as on every other box), Enter for the default
button, Escape for Cancel, a Tab trap, focus returned to the opener, `role="alertdialog"` for a
question, and a width that fits a phone in tall mode. A question asked while another is open waits
its turn. Buttons are plain page buttons dressed alike, so the consent questions still cannot
dress Accept to stand out.

A native dialog held the script until answered; this cannot, so every caller moved what followed
the answer into the callback. The one native dialog left is the browser's own "Leave site?" box
on `beforeunload`, which no page can replace.

`dev/lpn-spike/no-raw-alert-harness.js` refuses any raw `alert(`/`confirm(`/`prompt(` in
`js/looped-network.js`, `js/lpn-*.js` and `Looped-Network.php`. Headless harnesses answer the box
through `window.lpnDialogAnswerer`, which `lpn-dom-stub.js` routes to their scripted
`window.confirm`/`prompt` (the browser-pass Session routes it to the native dialog, so its
`answerConfirmsWith`/`answerPromptWith` still work). `dev/lpn-spike/dialog-modal-browser-harness.js`
removes that seam and clicks the real box in Chrome, desk and 390 px.

The background image tools' click instructions are a notice and a log entry, and the "Adjusting the
background image" bar carries the current step's words for as long as the mode lasts. That bar now
wears the same light background, ink and border as every other box (it was the one dark strip).

**Convert, never downgrade** (coordinator relaying Tom, 2026-10-04). An earlier pass made 39 of
the alerts 8-second notices and a warning strip; a failure message must not vanish unread, so every
former alert that reported something is a modal again, in the page's box, and kept in the log. The
warning strip is gone. A held Enter or Space never answers the box (Perry's review: a held Enter on
Delete network pressed OK); only a fresh key pressed while it is open does. On a phone the mode bar
is a short band along the foot of the window.

Tom's browser pass, 2026-10-04: the title band lay over the message's first line, because the box's
inline `padding: 12px` outranked the titled rule; the padding now lives in the stylesheet. A box
opened by a press on the map (the two-point pick) lost its field's focus to that press, so the first
typed character went missing; openDialog() takes the focus back once the press is over. Save as asks
no question of its own (the file picker is its box). Delete network, which was never undoable, is
now one undoable step, and its question no longer says it cannot be undone (all 27 languages lost
that sentence and nothing else).

The map notice line is one amber for every message and always was; only the log row's colour
follows severity.

## The sites

Function names, not line numbers, so the table survives edits. File is `js/looped-network.js`
unless named. BLOCK = MUST BLOCK (now `askDialog()`), INFO = information at info, WARN = information at warning.

| Function | Call | String key | Verdict | Reason |
|---|---|---|---|---|
| `scenarioMenuRows` | prompt | `lpn_scenario_prompt_name` | BLOCK | needs a typed name (new scenario) |
| `scenarioMenuRows` | prompt | `lpn_scenario_prompt_name` | BLOCK | needs a typed name (rename) |
| `scenarioMenuRows` | confirm | `lpn_scenario_delete_confirm` | BLOCK | deletes values held only by the scenario |
| `pushBaseToScenarios` | alert | `lpn_push_none_displayed` | INFO | nothing to apply; no data at stake |
| `scopedKeys` | alert | `lpn_scenario_push_none` | INFO | nothing to change |
| `scopedKeys` | confirm | `(computed text)` | BLOCK | discards scenario overrides |
| `downscaleImage` | alert | `lpn_backdrop_unreadable` | WARN | picture failed to load |
| `readWorldFile` | alert | `lpn_backdrop_scale_entry_bad` | WARN | bad world file |
| `readWorldFile` | alert | `lpn_backdrop_wld_bad` | WARN | unusable world file, nothing applied |
| `startBackdropScale` | alert | `lpn_backdrop_scale_prompt1` | INFO | instruction before two clicks |
| `startBackdropScale` | prompt | `lpn_backdrop_scale_prompt2` | BLOCK | needs a typed distance |
| `startBackdropScaleFrom` | alert | `lpn_backdrop_scale_from_prompt1` | INFO | instruction before a click |
| `startBackdropScaleFrom` | prompt | `lpn_backdrop_scale_from_prompt2` | BLOCK | needs a typed factor |
| `applyScaleEntry` | alert | `lpn_backdrop_wld_bad` | WARN | unusable pasted world file |
| `applyScaleEntry` | alert | `lpn_backdrop_scale_entry_bad` | WARN | entry not understood |
| `startBackdropPosition` | alert | `lpn_backdrop_position_prompt1` | INFO | instruction before a click |
| `startBackdropPosition` | alert | `lpn_backdrop_position_prompt2` | INFO | instruction; the panel itself follows |
| `showBackdropTargetPanel` | prompt | `lpn_backdrop_coords_prompt` | BLOCK | needs typed X,Y |
| `backdropAction` | confirm | `lpn_backdrop_remove_confirm` | BLOCK | removes the background image |
| `goToLatLon` | prompt | `lpn_goto_prompt` | BLOCK | needs typed latitude, longitude |
| `georefAskSize` | prompt | `(computed text)` | BLOCK | needs a typed length |
| `georefTwoPointClick` | prompt | `lpn_goto_prompt` | BLOCK | needs typed latitude, longitude |
| `georefFinish` | confirm | `lpn_georef_confirm` | BLOCK | converts every coordinate |
| `mapgeoScaleFromCurrent` | prompt | `lpn_map_attach_scale_from_prompt` | BLOCK | needs a typed factor |
| `paneColId` | alert | `(validateNewId text)` | WARN | rename refused |
| `newSavedProfile` | prompt | `lpn_profile_prompt_name` | BLOCK | needs a typed name |
| `renameSavedProfile` | prompt | `lpn_profile_prompt_name` | BLOCK | needs a typed name |
| `deleteSavedProfile` | confirm | `(computed text)` | BLOCK | deletes a saved path |
| `deleteElement` | confirm | `lpn_delete_drops_overrides` | BLOCK | discards scenario values |
| `setStorageError` | alert | `lpn_storage_unreadable` | BLOCK | "Not saved": the status line is wiped by the first solve and a user could edit for an hour into a tab that saves nothing |
| `wipeEverything` | confirm | `lpn_confirm_wipe` | BLOCK | deletes everything saved |
| `prepareDocument` | alert | `lpn_storage_too_new` | WARN | file refused |
| `importProject` | alert | `lpn_import_no_room` | WARN | import refused, no storage |
| `acceptImportedText` | alert | `lpn_import_bad_file` | WARN | file refused |
| `importProjectFromFile` | alert | `lpn_import_bad_file` | WARN | read error |
| `inpTextFromBytes` | alert | `lpn_net_bad_file` | WARN | file refused |
| `importInpFromFile` | alert | `lpn_inp_bad_file` | WARN | read error |
| `landInpText` | alert | `lpn_inp_bad_file` | WARN | file refused |
| `importSurveyFromFile` | alert | `lpn_survey_read_error` | WARN | read error |
| `read (survey)` | alert | `(survey error text)` | WARN | file refused (empty) |
| `read (survey)` | alert | `(survey error text)` | WARN | file refused (ambiguous) |
| `draw (survey)` | alert | `(survey error text)` | WARN | file refused |
| `openAsGeoFile` | alert | `lpn_import_bad_file` | WARN | read error |
| `saveAs` | alert | `lpn_saveas_same_file` | WARN | save refused; nothing is lost |
| `saveAs` | confirm | `lpn_saveas_overwrites_newer` | BLOCK | overwrites someone's newer file |
| `saveAs` | confirm | `lpn_saveas_overwrites_project` | BLOCK | overwrites a different project |
| `revertCurrent` | confirm | `lpn_revert_confirm` | BLOCK | throws away changes |
| `openHandle` | alert | `lpn_import_bad_file` | WARN | file refused |
| `askForLockedFile` | prompt | `lpn_lock_ask_prompt` | BLOCK | asks for initials |
| `openProjectMenu` | prompt | `lpn_prompt_project_name` | BLOCK | needs a typed name (rename) |
| `openProjectMenu` | prompt | `lpn_prompt_project_name` | BLOCK | needs a typed name (new) |
| `deleteNetwork` | confirm | `lpn_confirm_delete_network` | BLOCK | deletes the whole network |
| `drawTestGrid` | confirm | `(literal English)` | BLOCK | adds to a network; undoable, so a candidate for Tom to drop (see open question) |
| `nonNegative` | alert | `lpn_id_invalid` | WARN | bad ID entry |
| `selectRow` | alert | `lpn_cp_key_needed` | WARN | bad key entry |
| `selectRow` | alert | `lpn_cp_key_taken` | WARN | key in use |
| `syncElevSource` | alert | `lpn_push_base_only` | WARN | action refused |
| `syncElevSource` | alert | `lpn_push_none_displayed` | INFO | nothing to apply |
| `counts` | alert | `lpn_push_nothing` | INFO | nothing to apply |
| `counts` | alert | `lpn_push_no_change` | INFO | nothing would change |
| `counts` | confirm | `(computed text)` | BLOCK | overwrites many values |
| `hydNumberRow` | confirm | `lpn_method_switch_confirm` | BLOCK | roughness numbers become meaningless |
| `hydNumberRow` | confirm | `lpn_confirm_restore_defaults` | BLOCK | resets all settings |
| `libImportFromFile` | alert | `lpn_import_bad_file` | WARN | file refused |
| `buildPipeTypeEntry` | alert | `lpn_library_pipetype_in_use` | WARN | delete refused, in use |
| `buildFittingSetEntry` | alert | `lpn_library_fittings_in_use` | WARN | delete refused, in use |
| `buildCurveEntry` | alert | `lpn_library_curve_in_use` | WARN | delete refused, in use |
| `libCopyOut` | prompt | `lpn_library_curve_copy_manual` | BLOCK | clipboard fallback: the text must be selectable |
| `idField` | alert | `(validateNewId text)` | WARN | rename refused |
| `applyIdPrefixToAll` | confirm | `lpn_confirm_apply_prefix` | BLOCK | renames many assets |
| `loadCalibFile` | alert | `lpn_survey_read_error` | WARN | read error |
| `lpn-search.js` | confirm | `consentText()` | BLOCK | consent to a third-party request |
| `lpn-search.js` | prompt | `(search text)` | BLOCK | needs typed text |
| `lpn-search.js` | prompt | `lpn_search_prompt` | BLOCK | needs a typed choice |
| `lpn-terrain.js` | confirm | `consentText()` | BLOCK | consent to a third-party request |
| `lpn-terrain.js` | confirm | `consentText(count)` | BLOCK | consent to a third-party request |
| `lpn-terrain.js` | confirm | `lpnTerrainPlanText()` | BLOCK | replaces existing elevations |
