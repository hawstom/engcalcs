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
| MUST BLOCK | 38 | Left as native dialogs (20 `confirm`, 17 `prompt`, 1 `alert`) |
| INFORMATION, info | 9 | Now `setNotice()` |
| INFORMATION, warning | 30 | Now `setWarning()` (same door, severity `warning`) |
| DELETE | 0 | Nothing was redundant |
| **Total** | 77 | |

`dev/lpn-spike/no-raw-alert-harness.js` holds this table: no `alert(` outside the one audited site, and the MUST BLOCK
`confirm(`/`prompt(` counts per function are an allowlist. `dev/lpn-spike/dialog-audit-browser-harness.js`
shows two converted messages landing in the log, with no dialog, in a real Chrome.

## Open question for Tom

The 38 MUST BLOCK sites are still the browser's own plain dialogs. Whether they become one styled
in-page modal (consistent look, can show the message log beside it, can carry a Cancel that names
the thing being kept) is a separate decision and was not made here. One of them, `drawTestGrid`'s
"add to the existing network" confirm, guards an undoable act on a developer button, so it is the
likeliest to simply go.

The click-here instructions of the background image tools (scale by picking, scale from a point,
position) were alerts. They are now a notice and a log entry, and the "Adjusting the background
image" bar at the bottom of the screen carries the current step's words for as long as the mode
lasts (the mode hint is hidden on a phone, so it could not be relied on).

A warning is also shown in a strip fixed above every open box (`#lpn_warn_strip`), because a
refusal raised inside Libraries, Settings or the survey dialog landed under the box on a phone.

The map notice line is one amber for every message and always was; only the log row's colour
follows severity. Nothing was lost there.

## The sites

Function names, not line numbers, so the table survives edits. File is `js/looped-network.js`
unless named. BLOCK = MUST BLOCK, INFO = information at info, WARN = information at warning.

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
