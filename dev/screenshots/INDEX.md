# What is in the screenshot drop

> **DELETED FRAMES STILL HAVE ROWS, AND THAT IS THE POINT.** Tom, 2026-08-25: *"You can delete all
> the unusable ones, and I will just keep dropping them in forever."* So on that date the 18 frames
> this index marked **No** or **Not as is** were deleted from disk — 0011–0014, 0021, 0025, 0034,
> 0035, 0037–0042, 0044–0046, 0048 — and **their rows stay here.** That is Task 508's whole
> principle working as intended: *the pictures do not survive a clone; what we learned from them
> does.* A row whose file is gone is a record of a judgement already made, so nobody re-makes it,
> and it names what a re-shoot would need to fix.
>
> **0049–0066 arrived on 2026-08-25 — one CALCULATOR page each, which is what nothing else in this
> drop had.** Tom: *"I dropped in images for every calculator."* They were read and indexed the same
> day, and they unblocked the per-calculator share cards (the per-page half of Task 534): fifteen of
> them are in `icons/cards/` today — fourteen language cards and Darcy-Weisbach's English one; 0063
> and 0066 were cropped too and have since been replaced by better English re-shoots. **They are full-window captures at 1920 wide, so a card is the top-left
> 1280x672 (or 1440x756 where a longer title needed the room) scaled to 1200x630** — the title, the
> form and the first results, which is the whole page's identity in one frame. Every one is
> privacy-clean by the test below: no browser chrome at all, no real project name (the two typed
> title fields that carry anything read `SECTION C-C` / `NORTH OF HOUSE`, which name no client and
> no place), no file path, no consent banner.
>
> **0067–0081 arrived the same day and are the ENGLISH half.** Tom: *"I added the specified
> English/fallback screenshots."* Fourteen became the no-suffix cards a `?lang=` URL falls back to,
> and two of those REPLACED a weaker English card already in the directory (Manning-Pipe-Flow and
> Manning-Trap, both now on shipped defaults with the printable title fields empty). All fifteen are
> ~1905x920, so none needed padding. **All twelve wanted are satisfied** — Orifice was the last one
> open and Tom re-shot it into the same ordinal, so the 0071 ON DISK is the good frame and
> `icons/cards/Orifice.png` shipped from it. **A frame's privacy is not the only test a CARD has to
> pass:** a card should show the page as a first-time visitor meets it, so a ⚠ from a typed-in
> experiment, a typed printable title, or a results column that never computed all make a frame a
> weaker card than a clean one. That is why 0074 is indexed but unused.
>
> **RECONCILED 2026-08-26 against what is on disk: 63 files, every one indexed, no un-indexed frame.**
> The 18 rows with no file are the deliberate deletions listed above and stay. What the pass did find
> was STALENESS, and all of it in one shape — **the Water menu's glyph changed twice on 2026-08-25**
> (plan sheet → drop at 02:13, drop → water TOWER at 04:13 because a drop reads as a tear, peaked roof
> at 05:14). So "the water-drop toolbar" is no longer the mark of a current frame; the tower is. Only
> 0028, re-shot into its own ordinal at 18:21, carries it. **A second date line runs through the drop:
> lat-before-lon shipped 2026-08-24 at 12:48**, so any frame captured before then shows a
> longitude-first status readout — that is 0001–0030, and it is the thing to check in the strip before
> publishing any of them.


One line per file: what it shows, and whether it could go on a public page. Written by AI from
looking at each image; the images themselves are not in git. See `README.md` for the convention.

**Publishable** means: nothing in frame identifies a real person, a real file path, a browser
profile, or a client's work, and the consent banner is not showing. It is a PRIVACY test and nothing
else, made once, here, so nobody has to re-make it every time an image is reached for. **No** is that
test failing. **Not as is** is that test passing while something in the content — a defect since
fixed, a stale icon, a hand annotation — means the frame needs work before it goes out. What a frame
is not marked down for is how many panels are open; see the clutter entry below.

| # | What it shows | Publishable | Notes |
|---|---|---|---|
| 0001 | Wide desktop, one frame doing four pictures' work: the Find panel open over a grid network, the Settings box open on node and link symbology with its per-value decimal spinners, the Profile drawn in the bottom pane, and two project tabs along the top | **Yes** | Privacy-clean: a synthetic grid, projects called Project1 and Project2, no browser chrome. **This row corrects an earlier judgement.** It was marked **No** for showing three panels at once; Tom, 2026-08-25: *"I disagree about clutter. In this case it's parsimonious, and that's why I did it."* A frame with four things working at once is an inventory, and the CAPTION is what makes it one -- name what is on display, one clause each. Two things date it and neither is the panel count: the box says the old "Find assets", and the menu bar says Project where it now says Water |
| 0002 | The same window with four things on display at once: the Project menu open (Settings, Libraries, Profile, Tables, Scenarios, Calculate), the Libraries box on Patterns, a Replace mid-flight -- "Change 1 assets?" then "1 found" -- and the Profile still drawn below | **Yes** | Privacy-clean, same as 0001. **Also corrects an earlier judgement**: "four overlapping panels" was given as the reason not to publish it, and Tom overruled that on 2026-08-25. Written to a caption that enumerates -- the menu, the pattern library, the replace, the profile -- it is the densest single picture of the page we have. Dated the same two ways as 0001, "Find assets" and the Project menu name |
| 0003 | Narrow window (~840 px), Net3 on the OSM street map, colour key showing Pressure and Flow bands, Settings stacked one-column | **Yes** | The best evidence that the layout reduces gracefully. Also a natural "Management" still for the landing page |
| 0004 | Narrow window, the ColorBrewer scheme picker open over Net3 on satellite imagery | **Yes** | Shows the colour work; the Mapbox/OSM/Maxar credits are in frame, which is correct and should stay |
| 0005 | Desktop, the examples gallery open on all seven cards | **Yes** | The obvious "what do I get" still. Card text is legible at full size |
| 0006 | Elm Street Center on its site plan, scenario menu open (Base / Daily Flow (3), New, Rename, Delete) | **Yes** | Shows scenarios, which nothing else here does |
| 0007 | Elm Street Center full drawing, Settings searched for "underlin", one tip open explaining the highest/lowest marks | **Yes — and this is the hero candidate** | The annotated exhibit the landing page argues for: hand-placed labels, leader lines, a real site plan, a title block. `graphics-plan.md` step 1 |
| 0008 | The same Elm Street network with the whole interface in **Romanian**, coloured by pressure, Find open | **Yes — and it is the language still** | Also the bug evidence: "Change what was found / Property to change / New value" stand in English inside the Romanian panel, because Task 389's keys had not been through a sprint when it was shot. **Since repaired** — `lib/lang.ec.ro.php` now carries `lpn_replace_title`, `lpn_replace_prop` and `lpn_replace_value`, so the frame documents a state that is gone |
| 0009 | Desktop, English: the report dialog after importing `Net3.inp` — "97 junctions, reservoirs and tanks, 119 pipes, pumps and valves, in GPM", then what changed on the way in (patterns kept, water quality and pump energy left out) | **Yes** | The single best evidence for "reports every difference, never drops silently". Also shows the label legend at the right and Net3 drawn behind |
| 0010 | Desktop, English: Net3 sitting on the OpenStreetMap world map with the georeferencing wizard's **Step 1 of 2 — quick** bar open (Go to… / Search by name… / These are already lon/lat / Put the model here / Cancel). The unplaced model lands over west Africa | **Yes** | The "before" frame of the georeferencing walkthrough 0010–0021. Also the pre-fix status readout: `Longitude: … Latitude: …`, and a button reading "These are already lon/lat" — both since corrected to latitude-first |
| 0011 | The Nominatim consent prompt ("Search by place name sends the words you type to nominatim.openstreetmap.org …"), captured with the browser's bookmarks bar in frame | **No** | Browser chrome: a bookmark folder named "Tom" and a second one manually blacked out. The consent text itself is worth quoting; re-take without chrome |
| 0012 | The Search-by-name prompt, empty, over Net3 on the world map. Browser URL bar and bookmarks bar in frame | **No** | Browser chrome, same bookmarks. Shows the example placeholder wording, "Petaluma, California" |
| 0013 | Same prompt with **Novato, California** typed in | **No** | Browser chrome plus the profile avatar at top right |
| 0014 | The follow-up prompt "About how wide is the site, across the whole project? (ft)" with 15000 typed | **No** | Browser chrome, bookmarks and profile avatar. The "Matthew" bookmark was blacked out in the file itself on 2026-08-24 at Tom's request; "Tom" and the avatar remain, and still disqualify it. The prompt is a good one to re-shoot: it is the whole of the scale question in one sentence |
| 0015 | Desktop, English: the map has moved to Novato, California; the Nominatim attribution ribbon is across the top left; Step 1 bar still open; model not yet placed | **Yes** | Proves the geocoder credit shows where it must. Attribution ribbon and the OSM credit bottom right should both stay in any crop |
| 0016 | Same, zoomed out one step so San Pablo Bay is in frame; Step 1 bar open | **Yes** | Cleaner than 0015 (no attribution ribbon over the drawing) but for that reason a worse citation still |
| 0017 | **Step 2 of 2 — fine**: the model is on the ground, its bounding box drawn with four corner handles and the round rotate handle above, "Ground distance per drawing unit 720.927 ft", "Turn anticlockwise 0" | **Yes** | The clearest single frame of the place-and-scale interaction. The handle geometry reads correctly at full size |
| 0018 | Step 2 zoomed in to street level over central Novato — Novato Boulevard, Novato High School, US 101 — the model's pipes now following real streets | **Yes** | The argument that a georeferenced model can be checked against the ground. Pipes are visibly off the streets here, which is honest: this is a placement in progress, not a survey |
| 0019 | Near-duplicate of 0018 with the model nudged; the same Step 2 bar and the same 720.927 | **Yes** | Only useful as the second half of a before/after pair with 0018. On its own it adds nothing |
| 0020 | Step 2 zoomed back out to the whole town, selection box and four handles around the model, ground distance now 752.49 ft | **Yes** | The best "placed and scaled" frame of the sequence: whole model, whole town, handles visible |
| 0021 | The confirm dialog "Place the model here permanently? … the drawing stops being an xy project. To get xy back, close this project without saving." | **No** | Browser chrome, bookmarks, avatar. "Matthew" blacked out in the file on 2026-08-24; the rest remains. The wording is the honest version of a one-way door and is worth re-shooting clean |
| 0022 | Desktop, English: Settings open on **Map and page → Page** over the georeferenced Net3; a tip is showing for "Show page titles" | **Yes** | Documents a layout defect: the Settings category index breaks words mid-word — "Visualizati / on", "Node symbolog / y", "Map appearan / ce". **Ruled, not fixed: Task 515, closed 2026-08-25** on Tom's own word (*"It's a long word... I'm not really that embarrassed by the breaking. Accept as is."*), so the frame is accurate about today's desktop and nobody should re-file it. The PHONE version of the same index was a real defect and Task 527 fixed it |
| 0023 | The same view with the toolbar's Save tip showing — "Save — Saves to the connected file." | **Yes** | Pairs with 0024 as the file-handle story. Same mid-word index as 0022, and the same ruling — Task 515, accepted as is |
| 0024 | The first-save explainer: the file is written only when you ask, the site tracks who has it open, the browser's own permission question, and "Your initials" | **Yes** | The clearest statement anywhere of what saving does and does not do. A strong Help-page still |
| 0025 | The Windows Save-as dialog on `Desktop\dup`, listing Elm-Street-Center.lwn, Net2.lwn and three `.lwn` files | **No** | A real file path and a real folder listing. Internally it is useful evidence that `.lwn` and `.json` both round-trip |
| 0026 | The whole interface in **Romanian** — "Calculator online gratuit pentru rețele de distribuție a apei" — Setări open on Vizualizare, Net3 georeferenced on Novato and coloured by pressure, pressure key at the right | **Yes** | The Romanian counterpart to 0008 and a better picture than it: a real network on real ground with a translated colour key. Units are metric here (L/s, m H2O), which is the honest pairing with a non-English interface |
| 0027 | Romanian, Libraries open on **Patterns** beside Setări on Calcul, with the time dropdown expanded down the hour list | **Yes** | Three panels at once, so it is evidence rather than a hero. Documents an untranslated label: "Recalculate automatically ?" reads English amid Romanian. The `ro` file now carries `lpn_settings_auto_run`, so this is a state since repaired |
| 0028 | Desktop, English, **no dialog**: Net3 on the Novato street map, nodes coloured by pressure and links by velocity, the colour keys top-left, the labels legend middle-right, and the bottom pane open on **Profile** — ground surface, hydraulic grade line, pressure band, "Nodes: 26, length: 79161 ft" | **Yes — publishable, and the strongest frame we have** | **RE-SHOT 2026-08-28 ON TODAY'S MASTER** (md5 `38cca2d9…`; `img/0028.png` in the librewaternet.org repository is still the OLD one, md5 `f879f1f8…`). Everything the two earlier attempts failed on is right here. The menu bar reads **File / Edit / Map / Water / Help** — the post-Task-543 structure, so nothing in it can be dated by a glyph or a menu name. The status strip reads `Latitude: 38.130412 Longitude: -122.555780`, latitude first. The tab is `*Net3-Novato-CA-World.lwn`. **And the colour keys no longer print through the labels legend**: Tom moved them to the opposite corner, and Task 552 fixed the code that let them collide at all, so the same view comes out readable either way. Privacy-clean: no browser chrome, no URL, no personal data. **This is what replaces `img/0028.png`** — it has not been pushed to the sibling repository, which is Tom's call. **RE-SHOT AGAIN 2026-08-29 (md5 `ac5e67fa…`) and READ FROM THE PIXELS 2026-09-01: both documented blockers are gone.** The status strip reads `Latitude: 38.056234 Longitude: -122.476835` — latitude first. The colour keys sit top-RIGHT and the node/link labels legend top-LEFT, so nothing prints through anything. Menu bar is File / Edit / Map / Water / Help. The bottom pane is open on Profile. **Publishable as it stands; `img/0028.png` in the sibling repo is still the 25 August file (md5 `f879f1f8…`) and the swap is Tom's call.** | **PUBLISHED 2026-09-01** on Tom's word — `img/0028.png` in `librewaternet.org` is now the 29 August frame (md5 `ac5e67fa…`), commit `10eda9e`.
| 0029 | Settings open on **Visualization**, the label-content checkboxes with their per-value decimal spinners; bottom pane still on Profile; street-level Novato behind | **Yes** | The best picture of label control. The Settings box is dragged over the menu bar and tab strip, which hides the page's own identity — worth avoiding in a public still |
| 0030 | Same, scrolled to **Color band boundaries: Velocity**, links drawn in the viridis ramp, both a Pressure key and a Velocity key at the right | **Yes** | Documents a second layout defect: the colour key overlaps the node/link label legend, so the legend's rows are unreadable behind it. **Superseded — this frame is what Task 516 was opened on, and 516 closed 2026-08-25** because Task 529 gave both legends an **Off** placement and the two now default to different corners (colour key bottom-right, labels legend top-right on a pointer; top-right and top-left on a phone, Task 527). A project SAVED with both in one corner still opens that way, by design |
| 0031 | Settings and Libraries → Patterns open together over a velocity-coloured Novato network, page titles switched off | **Yes** | Shows the pattern editor's sparkline-plus-numbers rows at full size. Two panels cover most of the drawing |
| 0032 | Libraries → **Curves** beside Settings → Map appearance, over **satellite imagery**; the "Background image opacity" field is ringed in yellow highlighter | **Yes** | Pump curves as a plot plus their point table. The yellow ring is a hand annotation added after capture, so crop or re-take before any public use. Mapbox / OpenStreetMap / Maxar credits are in frame and correct |
| 0033 | Libraries → **Controls** beside Settings → Calculation, over satellite: six simple controls (`Link 10 OPEN AT TIME 1`, `Link 335 OPEN IF Node 1 BELOW 17.1`, …), each marked "✓ Understood" | **Yes** | The evidence that simple `[CONTROLS]` are read and honoured, which is what makes what is left of Task 248 rule-based `[RULES]` alone. Also shows the ColorBrewer / viridis / EPANET credits at the foot of Settings |
| 0034 | **The first phone capture in the drop** (Tom's own, 2026-08-25, Chrome on Android, portrait, page region only). Net3-World on the OSM street map: collapsed navbar, toolbar, transport row, tab strip, scenario and units readouts all render. Over the drawing stand the mode hint, the EPANET minor-loss note, and the Pressure and Flow keys | **Not as is** | Nothing identifying in frame — no browser chrome, no phone status bar. **Superseded: it is the evidence behind Task 524** (mode hint now hidden below 640px, status note bounded), so it shows a defect that is fixed. Coordinate readout is the un-hovered `X: -- Y: --`, which is all a touch device ever sees. Corrects an earlier index entry: this file is PNG, not JPEG, and does not show a longitude-first readout |
| 0035 | Near-duplicate of 0034, six pixels shorter and otherwise the same frame | **Not as is** | Two chances at the same shot, which is the drop working as intended. Use 0034 and ignore this one unless 0034 crops badly. Same Task 524 supersession |
| 0036 | The same phone view with pipe 309's property popup open — ID, diameter 6 in, C 130, k 0, length 1580 ft, Auto/Shut/Part-of-network boxes, then solved flow 216.96 gpm, velocity 1.38 ft/sec, head loss 1.70 ft H2O | **Not as is** | **The best phone PROPERTY-POPUP frame in the drop, and privacy-clean.** The popup is legible at phone width with real numbers, and the status readout reads `Latitude:` first — so this deploy already had the 2026-08-24 latitude-first fix. What retires it is the toolbar: captured before the 2026-08-25 02:13 water drop, so it still carries the plan-sheet Project button, two glyph generations behind today's tower. Behind the popup the labels legend, mode hint and note overlap each other, which Tasks 524, 527 and 529 have since addressed. Re-shoot the same popup and it is publishable |
| 0037 | The popup closed again, zoomed to street level; the EPANET gravity note still standing | **Not as is** | Tom's point that a solve does not dismiss the note. **Fixed by Task 525** — the note is a fact about the engine, said once per project and engine choice, not re-emitted on every solve. Also the clearest count of the old overlay pile: mode hint, labels legend, engine note and two colour keys, five things in one corner |
| 0038 | Settings open on Visualization → Link symbology at phone width | **Not as is — bug evidence, and BOTH are now fixed** | It showed two defects: the category index breaking EVERY label mid-word — "Visualiz/ation", "Node symbo/logy", "Link symbo/logy", "Map appear/ance" — and the label-content column headers reading "BeforeAfter 0.000 Drop", touching each other. **Task 527, closed 2026-08-25**, made the phone index a horizontally-scrolling strip of whole names (content pane 238 → 320 px) and gave the symbology headings `overflow-wrap: anywhere`. The desktop version of the index defect is Task 515, closed the same day as accepted-as-is |
| 0039 | Bottom pane open on Profile, map above: ground surface, hydraulic grade line, pressure band, "Nodes: 26, length: 79161 ft" | **Not as is — bug evidence, since fixed** | The chart itself draws well and reads well. **Its axes did not:** the y ticks overprinted into a solid smear and the x node labels were an unreadable scribble. **Task 527, closed 2026-08-25**, found the cause and it was not label count — `profileLayout()` floored the viewBox at 240x180, so the whole chart including its text was drawn at scale 0.64. At 360 px it is now scale 1.000, y labels 29 px apart |
| 0040 | The same Profile view scrolled, captured with the browser's own chrome in frame | **No** | The one phone frame that fails on the frame rather than the content: Chrome's URL bar showing `dev.hawsedc.com`, the tab count and the overflow menu. 0039 is the same view captured clean — use that. Same illegible axes (Task 527) |
| 0041 | Bottom pane on the Pipes table, with Print table beside the tab row | **Not as is — bug evidence, Task 527** | **Checked and NOT a defect: the values are right.** Pipes 40, 50, 60 and 101 match `examples/Net3-World-lpn.json` (renamed 2026-08-27 to `Net3-Novato-CA-World.lwn`) exactly; pipe 20 reads diameter 1200 and k 12.2 against the file's 99 and 0, which are Tom's own unsaved edits (the tab shows `*Net3-World`) and are what raised the note he photographed. Nothing is clipped. The one defect was the header breaking "Roughnes/s, C" mid-word, **fixed by Task 527** — the roughness column went to `break-word`, at a cost of 28 px |
| 0042 | Phone, portrait: the scenario menu open over the network on satellite imagery -- Base ticked, New scenario..., Rename scenario..., Delete scenario, Apply Base values to all scenarios -- with both colour keys and the labels legend stacked down the right | **Not as is** | **This is the file the index used to list under the grabber's own name `Screenshot_20260825_012922.png`;** it has since been renamed to the ordinal convention and this row replaces that one. The menu is well sized for touch. **Three supersessions:** Task 528 (the menu hangs detached in mid-canvas rather than below the button that opened it), Task 529 (the colour key it cuts off mid-list now has an **Off** placement), and the toolbar's old plan-sheet Project button, since a water drop on a menu now called Water. The mode hint and the engine note are piled behind the labels legend at top left (Tasks 524, 525) |
| 0043 | Phone, portrait: Find and replace filling the screen — What to search: Pipe, Property: Diameter, Condition: equal to, Value 30, the Query line reading `Pipe.Diameter equal to 30`, Find, then "Change what was found" and "13 found. Click one to go to it." | **Not as is — the box it shows has since been rebuilt** | **RE-SHOT 2026-08-27** (md5 `89d1a884…`; `img/0043.png` in the librewaternet.org repository is still the OLD one, md5 `355d70d1…`). The date defect is gone — the toolbar carries today's icons, not the two-hour water drop. **But it is now bug evidence instead**, and it is the frame Tom read the defects off: the box runs past the bottom of the screen with the hit list below the fold, the title "Find and replace" spends a body line, and Property and Condition take a line each. All three are fixed on master the same day (`.lpn-find-pair`, the title moved into the drag band, `capPanelToRoomBelow()`), so the frame documents the version before the fix. **A re-shoot on today's master is what replaces `img/0043.png`; this file does not.** **RE-SHOT AGAIN 2026-08-29 (md5 `3abcc37f…`) and READ 2026-09-01: the Task 549 fixes are visibly in it** — Property and Condition share one line, and the title sits in the drag band beside the X rather than spending a body line. It also shows Tom's own approved wording, `n highest`, and the query line `Junction.ID 5 highest`. **One thing I could not settle from the pixels:** the result list is cut by the bottom edge of the screen, which is either the list scrolling normally or the pre-Task-556 overflow — the frame predates that fix by a day. `img/0043.png` in the sibling repo is still the 25 August file (md5 `355d70d1…`). | **PUBLISHED 2026-09-01** on Tom's word (*"Proceed to swap. 0043 shows all that would fit. 0047 is good enough."*) — `img/0043.png` in `librewaternet.org` is now the 29 August frame (md5 `3abcc37f…`), commit `10eda9e`. **The 0043 question is answered by him and not by the pixels: the cut-off list is all that would fit.**
| 0044 | Byte-identical re-drop of 0040 | **No** | Same md5 as `0040.png` -- an accidental second copy, which costs nothing and is worth saying rather than describing twice. Fails for 0040's reason: Chrome's URL bar showing `dev.hawsedc.com`, the tab count and the overflow menu are in frame. 0039 is the same view captured clean |
| 0045 | Byte-identical re-drop of 0039 | **Not as is** | Same md5 as `0039.png`: the bottom pane on Profile at phone width. The chart itself draws and reads well; its AXES were the defect, and **Task 527 closed 2026-08-25 fixed it** -- see 0039 for what the cause turned out to be |
| 0046 | Phone, portrait, on today's master: the network at street level on satellite, both colour keys down the right, the node/link labels legend top left, nothing else open | **Not as is** | Privacy-clean, and current on the day -- water-drop Water button (since replaced by the tower), and the mode hint gone (Task 524). What stopped it was the labels legend and the orange EPANET engine note printing over each other in the top-left corner. **Both halves have since moved:** Task 527 sent the phone's two legends to opposite top corners and Task 529 gave either one an **Off** placement, so the pile is a setting away. The frame the remake queue still wants is this view with the legends Off |
| 0047 | Phone, portrait: the **Water** menu open directly beneath the button that opened it — Settings, Libraries, Profile, Tables, Scenarios, Calculate, EPANET run report — over the network at street level on satellite, both colour keys down the right, the labels legend bottom-left, and the units, friction method and scenario along the bottom | **Not as is — one live defect in frame** | **RE-SHOT 2026-08-27** (md5 `216a2100…`; `img/0047.png` in the librewaternet.org repository is still the OLD one, md5 `dabea425…`). The date defect is gone: the menu bar carries the **water tower**, not the drop, and the menu still hangs from its own button, which is Task 528's proof. The legends do not collide here — labels bottom-left, colour keys right — so it does not repeat 0028's fault. **What stops it being publishable is one line: the status strip reads `X: --  Y: --` on a project drawn over a street map.** The readout was driven by `pointermove` alone and a phone has no hover, so a geographic project announced itself as a grid — a public picture of our own page arguing against the rule `coord_order_check.php` blocks commits over. Fixed on master the same day (`refreshCoordsReadout()`, guarded by `dev/lpn-spike/geo-project-harness.js`). **A re-shoot on today's master is what replaces `img/0047.png`.** **RE-SHOT AGAIN 2026-08-29 (md5 `4ada4ec9…`) and READ 2026-09-01: the blocker is gone.** The status strip reads `Latitude: --  Longitude: --` — latitude first, and the `--` is correct rather than a defect, because a phone has no hover and nothing has been pointed at yet (Task 550). Water menu carries the tower and hangs from its own button. **Publishable.** One cosmetic note, not a blocker: the colour keys print over map labels and over the end of the scenario line at the bottom right — legend over MAP CONTENT, not legend over legend, and on a phone-width screen there is nowhere else for it to go. `img/0047.png` in the sibling repo is still the 25 August file (md5 `dabea425…`). | **PUBLISHED 2026-09-01** on Tom's word — `img/0047.png` in `librewaternet.org` is now the 29 August frame (md5 `4ada4ec9…`), commit `10eda9e`.
| 0048 | Desktop, 1920 wide, **no panel open at all**: `Net3-Novato-CA-World.lwn` on satellite imagery over Novato, nodes coloured by pressure and links by velocity, both keys and the labels legend down the right, and a latitude-first coordinate readout in the status strip | **Not as is** | Privacy-clean, and the cleanest wide frame in the drop -- zero panels, which not even 0028 manages. **One thing dated it:** the menu bar still carried the old rolled-plan glyph rather than today's water tower (`lib/Icons.lib.php`, 2026-08-25), so it wanted a re-shoot rather than a publish. **That re-shoot exists: it is the current 0028**, which is the same model on the same ground with the tower in the menu bar and a latitude-first readout |

## What the drop has taught us

- **There are three kinds of picture here, not two.** `graphics-plan.md` split them as Design
  (Elm Street on its site plan, 0007) and Management (Net3 on a street map, 0003). The
  georeferencing sequence adds a third: a real network placed on real ground and then read against
  it — 0028, where the profile pane is open under the map. It is the strongest still in the drop and
  the best candidate for the second half of the landing page's pair.
- **A crowded frame is not automatically a cluttered one, and this index said otherwise for a
  while.** Almost every desktop capture has two to four panels open at once, because that is what
  using the page looks like. That was read here as clutter and it was the wrong reading. Tom,
  2026-08-25: *"I disagree about clutter. In this case it's parsimonious, and that's why I did it.
  'In this shot we see on display the Pump curves graphed in the Library, the Pipe Table at the
  bottom pane, and ....'"* One frame showing four things working together does four pictures' work.
  **The caption is what turns a pile into an inventory** -- write it as an enumeration, naming what
  is on display, one clause each, and the reader counts capabilities instead of counting boxes. A
  frame with nothing open (0028, 0048) is still the easiest picture to read, but that is a
  preference and not a rule, and it is no longer a reason to mark a frame down.
- **A panel dragged over the menu bar costs the page its identity.** In 0029–0031 the Settings box
  covers the title, the File menu and the tab strip, so the frame no longer says what application it
  is. Fine while working, wrong in a still.
- **Language is still the cheapest argument on the site, and now it has a better frame.** 0008 made
  it with Elm Street; 0026 makes it with a translated colour key over a real town, in metric, which
  is the honest pairing. Both also show where the gap is: 0008's Find-and-replace strings and 0027's
  "Recalculate automatically" were English inside a translated interface.
- **The drop is where stale interface text gets caught.** Between them these images hold the
  longitude-first coordinate readout and the "These are already lon/lat" button (both since
  corrected to latitude-first), the old "Find assets" wording, and one Romanian label that had not
  been through a sprint. None of these were found by a check; they were found by looking at a
  picture.
- **Two layout defects were on file only because somebody screenshotted them, and both are now
  closed.** The Settings category index breaking words mid-word (0022–0023, 0038) became Task 515 on
  the desktop, where Tom accepted it as is, and Task 527 on the phone, where it was fixed. The colour
  key overlapping the label legend (0030) became Task 516, closed once Task 529 gave either legend an
  **Off** placement and the two defaults moved to different corners. **Neither would exist without a
  picture**, which is the point.
- **The phone session (0034–0042) paid for itself in one
  sitting.** Nine frames from Tom's first real use of the page on a phone, 2026-08-25, and they
  produced five tasks: 524 (overlays eating the canvas), 525 (an engine note a solve could not
  dismiss), 528 (a menu detached from its button), 529 (**Off** as a legend placement), and 527 for
  what was left. **All five closed on 2026-08-25.** No harness found any of them; he found them by
  using the page and photographing it.
- **A picture goes stale the moment the bug is fixed, and the index is where that gets said.**
  Five fixes landed after these were shot and none was on `dev.hawsedc.com` at the time, so eight of
  the nine show at least one defect that no longer exists. Every phone row names which task
  superseded it, so nobody re-diagnoses a fixed bug from a stale frame. **All nine also show the old
  Project toolbar icon**, since replaced by a water drop on a menu now called Water.
- **The re-shoot answered it: 0043, 0046 and 0047 are the same phone after the fixes**, and two of
  them are on the public page. The proof is in the frame rather than in a ledger citation -- the mode
  hint is gone, and in 0047 the menu hangs from the button that opened it. Two things have moved
  since: the toolbar glyph they show was replaced hours later, and the top-left pile 0046 documents
  is now a placement setting away (Tasks 527 and 529).
- **A capture is dated by its ICONS faster than by anything else in it, and the Water glyph moved
  TWICE in one day.** Plan sheet until 2026-08-25 02:13, water drop until 04:13, water tower since
  (peaked roof at 05:14). So the drop dates a frame as surely as the plan sheet does — 0043 and 0047
  were shot at 03:51, inside that two-hour window, and both are published. Only 0028, re-shot at
  18:21, carries the tower. **When judging whether a frame is current, look at the toolbar before
  reading the dialogs, and compare against the glyph shipping TODAY rather than the one the last
  index entry praised.**
- **The other date line is the coordinate readout.** Lat-before-lon shipped 2026-08-24 at 12:48, so
  every frame captured before then — 0001–0030 — shows `Longitude:` first wherever the status strip
  is in view. The copy of 0028 published on `screenshots.html` is one of them, which is a shipped
  ruling contradicted on a public page by a picture.
- **Publishable and useful are different axes, and the phone rows were the first place that
  mattered.** These frames are clean by the privacy test — one panel of Tom's own example network,
  no chrome, no status bar, nothing identifying — and still mostly wrong to publish, because they
  show fixed bugs. That is what **Not as is** means, and marking them a flat "No" would have retired
  0036, which is the best phone frame we have.
- **A sequence is worth more than a still for anything procedural.** 0010–0021 is the whole
  georeferencing walkthrough in order: unplaced on the world map, consent, search, scale question,
  placed, zoomed to street level, confirmed. That is a Help page or a blog post already, and six of
  its twelve frames need re-taking only because the browser chrome is in them.
- **Browser chrome is what disqualifies a frame, not the network.** Every unpublishable image here
  fails for the same two reasons — a bookmarks bar with real names or a real file path — and both
  are avoidable by capturing the page rather than the window.

## The remake queue — what to shoot next

**2026-08-25, revised the same day after the phone re-shoot.** Fourteen of these are on the public
page (`screenshots.html` in the librewaternet.org repository). This is the list of shots that would
have gone too, and what stopped each one. Most are blocked by the frame rather than the software —
the page is ready, the capture is not. **A row blocked by DATE is the harder kind:** the frame is
clean, the software has moved on under it, and only a re-shoot fixes that. Two such rows closed on
2026-08-25 and two more opened.

Shoot these deliberately rather than at random, and crop to the PAGE, not the window.

| Want | Why it is not already here | What a good frame looks like |
|---|---|---|
| **A phone, in tall mode, with the WATER TOWER in the toolbar** | 0043 and 0047 answered the five fixes and are on `screenshots.html`, but both were shot inside the two hours the water DROP existed on 2026-08-25. The published phone plates are therefore one glyph generation behind | Either frame re-shot, nothing else changed. The drop is the only thing wrong with them |
| **A phone frame with no legends over the map** | Still open, and 0046 is the evidence: on today's master the labels legend and the engine note print over each other in the top-left corner, so the map's corner is unreadable | The network filling the map area on a phone with both legends set to **Off** (Task 529), nothing over it but the status strip. Tom ruled the pane-covers-map case NOT a defect, so this is a marketing frame, not a bug fix |
| **A wide desktop frame with today's icons — STILL OPEN, 2026-08-27** | 0028 was re-shot 2026-08-25 with the water tower and a latitude-first readout, **but the two colour keys are drawn over the labels legend and it cannot be published.** What is still on `screenshots.html` is the OLD 0028, showing the Project menu and a longitude-first readout | The same frame with the colour keys and the labels legend moved apart or set **Off**, so the top-right corner reads. Only then does it replace `img/0028.png` |
| **Find and replace on the DESKTOP, current wording** | 0043 answers this on a phone. 0001 and 0002 answer it on the desktop but say the old "Find assets" and name the menu Project | The desktop panel mid-replace so the count is visible. Panel count is NOT a reason to re-take it -- see the clutter entry above |
| **Romanian, after the unit fix** | 0026 is the language still and predates Task 521 — its status strip and colour key disagree about pressure units, which is fixed | Same view as 0026, retaken. Any of the 27 languages; Romanian is proven to fit |
| **The Nominatim consent prompt** | 0011–0014 all have the browser's bookmarks bar and profile picture in frame | Just the dialog and the map. The consent wording is one of the most honest things in the suite and nothing shows it |
| **"Place the model here permanently?"** | 0021, same browser chrome | The confirm on its own. It is the plainest one-way-door warning we have written |
| **The Settings box, not covering the menu bar** | 0029 is the best picture of label control, but the box is dragged over the title and tab strip, so the frame stops saying what application it is | Same content, box parked clear of the top chrome |
| ~~Twelve calculators, in ENGLISH, on their own defaults~~ **ELEVEN DONE 2026-08-25** | 0067–0081 are the English re-shoot and closed eleven of the twelve. They also replaced the two weak English cards this queue had flagged separately, so Manning-Pipe-Flow and Manning-Trap now open on their shipped defaults with the printable title fields empty | -- |
| ~~ORIFICE, in English, with its results computed~~ **DONE 2026-08-25** | Tom re-shot it into the same ordinal: the 0071 on disk now shows 105 / 100 / 101 / 18 in and Cd 0.61 producing `Q = 15.589 cfs` and `✓ Free outfall`, and `icons/cards/Orifice.png` shipped from it | -- |
| **Saving to a file** | 0025 shows a real folder listing and a real path | The browser's own permission prompt, over a network, in a folder whose name says nothing about you |

## The calculator frames, 0049–0066

The Publishable column is the same privacy test as above. The **Card** column is what the per-page card pass did
with the frame — the default card for a calculator is the ENGLISH one, because one picture has to
serve all 26 other `?lang=` URLs until a matching one exists, and a Chinese card on the English URL
reads as a mistake rather than as a translation. A non-English frame is therefore filed under its own
`-<lang>` name, where it is used on that language's URL and nowhere else. **Nothing Tom shot is
wasted, and nothing is used where it would look wrong.**

| # | Page | Lang | Publishable | Card | Notes |
|---|---|---|---|---|---|
| 0049 | Weir-Flow-Simple | zh | **Yes** | `Weir-Flow-Simple-zh.png` | Chinese throughout including the notes and the weir equation. Clean, short page; the whole calculator fits the card |
| 0050 | Irrigation-Pressure | sw | **Yes** | `Irrigation-Pressure-sw.png` | Swahili. The widest results table in the suite; the card catches the inputs, the results and the ⚠ advice line under them |
| 0051 | Canal-Seepage | fa | **Yes** | `Canal-Seepage-fa.png` | Persian, and the drop's first RTL calculator frame. Content is right-aligned, so the card is cropped from the RIGHT edge — a left crop of an RTL page is a picture of the margin |
| 0052 | Weir-Flow-Irregular | my | **Yes** | `Weir-Flow-Irregular-my.png` | Burmese. Its title is the longest in the drop and ran past a 1280 crop, so this card is cropped 1440 wide. The capture is only 563 rows tall and the card is padded with white below, which is invisible because the page ends in white |
| 0053 | Weir-Flow-Irregular | my | **Yes** | *(none)* | The scrolled REMAINDER of 0052 — the section-point table, the cross-section sketch and the notes, with no title and no navbar anywhere in frame. Privacy-clean, but a card needs the page's identity in it, so this one is not one |
| 0054 | Weir-Flow-Simple | es | **Yes** | `Weir-Flow-Simple-es.png` | Spanish, an anchor language. Same short page as 0049; also padded below |
| 0055 | Orifice-Drain-Time | ro | **Yes** | `Orifice-Drain-Time-ro.png` | Romanian, and the conic-volume method's whole result set — seconds, minutes, hours and days — reads on the card |
| 0056 | Orifice | pt | **Yes** | `Orifice-pt.png` | Portuguese, an anchor language. Shows the free/submerged verdict row |
| 0057 | Micro-Hydro-Power | am | **Yes** | `Micro-Hydro-Power-am.png` | Amharic, a low-resource-tier language and the only frame we have of one. The gross/net head sketch is just below the card's edge |
| 0058 | Rock-Chute | tr | **Yes** | `Rock-Chute-tr.png` | Turkish, an anchor language. The Robinson equation-selection row and both range checks read on the card |
| 0059 | Manning-Irregular | bn | **Yes** | `Manning-Irregular-bn.png` | Bengali. A row-table calculator with all five section points in frame; cropped 1440 wide so the navbar is not cut |
| 0060 | Manning-Trap | id | **Yes** | `Manning-Trap-id.png` | Indonesian. Carries a ⚠ "Di luar rentang" and a negative rock size, because the capture has `sg` typed as `.001` — a user's experiment, not the shipped defaults. Fine as a picture of the page; a re-shoot on defaults would be a better advert |
| 0061 | Branched-Network | he | **Yes** | `Branched-Network-he.png` | Hebrew, RTL, cropped from the right like 0051. The pipe table below the form is left-aligned and only partly in frame, which is the one untidy edge in the set |
| 0062 | Darcy-Weisbach | **en** | **Yes** | `Darcy-Weisbach.png` | One of only three English frames, so one of only three DEFAULT cards. Clean, on the shipped defaults, every check passing |
| 0063 | Manning-Trap | **en** | **Yes** | *(superseded by 0079)* | Was the English default card. Same `sg = .001` state as 0060, so the same ⚠ and the same negative rock sizes were on the card. 0079 is the re-shoot on defaults and took the name |
| 0064 | Hazen-Williams | uk | **Yes** | `Hazen-Williams-uk.png` | Ukrainian. Cropped 1440 wide so the navbar's Copy-link button is not cut in half |
| 0065 | Manning-Pipe-Head-Loss | hr | **Yes** | `Manning-Pipe-Head-Loss-hr.png` | Croatian. Clean, complete, nothing to explain away |
| 0066 | Manning-Pipe-Flow | **en** | **Yes** | *(superseded by 0078)* | Was the English default card for the suite's most-used calculator. Two things made it an advert rather than evidence: the printable title fields carried `SECTION C-C` / `NORTH OF HOUSE`, and the state was a 6 m pipe with a ⚠ High velocity check. Nothing identifying — and 0078 is the re-shoot that took the name |

## The English calculator frames, 0067–0081

All fifteen are English, all ~1905x920, all page-region captures with no browser chrome, no file
path and no consent banner. The **Crop** column is the native box taken from the top-left before the
scale to 1200x630: **1280x672 unless the navbar's Copy-link button ran past 1280**, which was
measured on every frame rather than eyeballed — it does on the nine marked 1440.

| # | Page | Publishable | Crop | Card | Notes |
|---|---|---|---|---|---|
| 0067 | Canal-Seepage | **Yes** | 1440x756 | `Canal-Seepage.png` | The only frame here that is not on bare shipped defaults, and deliberately so: the four OPTIONAL economics inputs (wetted perimeter, water value, lining cost, target efficiency) ship blank, and Tom filled them, so the card shows the payback period and the annual value the page exists to produce. No ⚠ — the verdict is ✓ Good |
| 0068 | Weir-Flow-Irregular | **Yes** | 1440x756 | `Weir-Flow-Irregular.png` | The four weir points and their cumulative flow all read. Longest title in the English set, which is what needed the 1440 |
| 0069 | Weir-Flow-Simple | **Yes** | 1440x756 | `Weir-Flow-Simple.png` | Exact defaults, 1/1/3. The suite's shortest calculator, so the card carries the whole page including the weir equation and the footer — a picture of a small tool, which is what it is |
| 0070 | Orifice-Drain-Time | **Yes** | 1440x756 | `Orifice-Drain-Time.png` | Exact defaults. Seconds, minutes, hours and days all in frame, and the ✓ ending-elevation check |
| 0071 | Orifice | **Yes** | 1440x756 | `Orifice.png` | **RE-SHOT INTO THE SAME ORDINAL 2026-08-25 and this row describes the new file.** The first 0071 was clean but showed the page's shipped placeholder labels with no numbers, because the on-load calculation had not run when the shutter fired; a card advertising a calculator that produces no answers is worse than the generic suite card, so it was rejected. The frame on disk now is the same page on its exact defaults a moment later — 105 / 100 / 101 / 18 in, Cd 0.61, `Q = 15.589 cfs`, `✓ Free outfall`, every result cell carrying a number. It closed the last of the twelve |
| 0072 | Micro-Hydro-Power | **Yes** | 1440x756 | `Micro-Hydro-Power.png` | Exact defaults. Power output, annual energy and both ✓ checks on the card; the gross/net head sketch begins just at its lower edge |
| 0073 | Rock-Chute | **Yes** | 1280x672 | `Rock-Chute.png` | Exact defaults including the deliberately blank optional normal depth. The Robinson equation-selection row and both ✓ range checks read |
| 0074 | Manning-Irregular | **Yes** | -- | *(superseded by 0081)* | An earlier Manning Irregular capture, in SI, taken while Tom had CHANGED the page's defaults trying for a better example. He then restored them. Rejected for the card on that ground alone — it is privacy-clean and correct, it just is not the page a first-time visitor meets |
| 0075 | Branched-Network | **Yes** | 1280x672 | `Branched-Network.png` | Exact defaults. Three pipe lines with their flows, losses and downstream pressures, and the network diagram just below the crop |
| 0076 | Hazen-Williams | **Yes** | 1440x756 | `Hazen-Williams.png` | Exact defaults. The fullest results column in the English set — twenty rows, both ✓ checks, HGL and EGL at both ends |
| 0077 | Manning-Pipe-Head-Loss | **Yes** | 1440x756 | `Manning-Pipe-Head-Loss.png` | Exact defaults. Complete: every input and every result on one card |
| 0078 | Manning-Pipe-Flow | **Yes** | 1440x756 | `Manning-Pipe-Flow.png` | **The re-shoot 0066 was flagged for, and strictly better than it**: printable title fields empty, exact shipped defaults, ✓ OK velocity, no ⚠. The suite's most-used calculator finally has an advert rather than evidence |
| 0079 | Manning-Trap | **Yes** | 1280x672 | `Manning-Trap.png` | **The re-shoot 0063 was flagged for, and strictly better than it**: `sg` back at 2.65, so the ⚠ and the negative rock sizes are gone and every rock-size method reports a real number |
| 0080 | Irrigation-Pressure | **Yes** | 1280x672 | `Irrigation-Pressure.png` | Exact defaults. The orange advice line under the form ("Pressure at test emitter ≥ supply pressure") is the SHIPPED default state, not a typed experiment — the same line is on `Irrigation-Pressure-sw.png` |
| 0081 | Manning-Irregular | **Yes** | 1280x672 | `Manning-Irregular.png` | Tom, having restored the defaults: *"The defaults are great. As soon as I restored them, the new screenshot 0081.PNG is good enough."* US units, ✓ OK, five section points with both bank boundaries checked, and a cross-section sketch that actually looks like a natural channel |

**The calculators still waiting for an ENGLISH frame**, and therefore still showing the suite card
when their English URL is shared: **none.** All twelve closed on 2026-08-25 with 0067–0081, Orifice
last, when Tom re-shot 0071 with its results computed. Looped-Network was never one of them and is a different
job: its card is the suite card, which is already an lpn frame.

**The one habit that fixes most of this:** capture the page region, not the browser window. Six of
the eight unpublishable frames fail for that alone — 0011–0014, 0021, and now 0040 — and nothing on
the page itself has ever disqualified a single image. **It holds on the phone too, and Tom already
does it:** eight of the nine phone frames are cropped to the page and are clean; 0040 is the one
that kept Chrome's URL bar, and 0039 is the same view shot correctly.
