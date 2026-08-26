# What is in the screenshot drop

> **DELETED FRAMES STILL HAVE ROWS, AND THAT IS THE POINT.** Tom, 2026-08-25: *"You can delete all
> the unusable ones, and I will just keep dropping them in forever."* So on that date the 18 frames
> this index marked **No** or **Not as is** were deleted from disk — 0011–0014, 0021, 0025, 0034,
> 0035, 0037–0042, 0044–0046, 0048 — and **their rows stay here.** That is Task 508's whole
> principle working as intended: *the pictures do not survive a clone; what we learned from them
> does.* A row whose file is gone is a record of a judgement already made, so nobody re-makes it,
> and it names what a re-shoot would need to fix.
>
> **0049–0060 arrived on 2026-08-25 and are NOT YET INDEXED.** Reading them is the next pass.


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
| 0008 | The same Elm Street network with the whole interface in **Romanian**, coloured by pressure, Find open | **Yes — and it is the language still** | Also the bug evidence: "Change what was found / Property to change / New value" are still English, because Task 389's keys have not been through a sprint |
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
| 0022 | Desktop, English: Settings open on **Map and page → Page** over the georeferenced Net3; a tip is showing for "Show page titles" | **Yes** | Documents a layout defect: the Settings category index breaks words mid-word — "Visualizati / on", "Node symbolog / y", "Map appearan / ce". Not named by Task 284, which is about sticky headings and the narrow-screen collapse |
| 0023 | The same view with the toolbar's Save tip showing — "Save — Saves to the connected file." | **Yes** | Pairs with 0024 as the file-handle story. Same mid-word index defect as 0022 |
| 0024 | The first-save explainer: the file is written only when you ask, the site tracks who has it open, the browser's own permission question, and "Your initials" | **Yes** | The clearest statement anywhere of what saving does and does not do. A strong Help-page still |
| 0025 | The Windows Save-as dialog on `Desktop\dup`, listing Elm-Street-Center-lpn.json, Net2-lpn.json and three `.lwn` files | **No** | A real file path and a real folder listing. Internally it is useful evidence that `.lwn` and `.json` both round-trip |
| 0026 | The whole interface in **Romanian** — "Calculator online gratuit pentru rețele de distribuție a apei" — Setări open on Vizualizare, Net3 georeferenced on Novato and coloured by pressure, pressure key at the right | **Yes** | The Romanian counterpart to 0008 and a better picture than it: a real network on real ground with a translated colour key. Units are metric here (L/s, m H2O), which is the honest pairing with a non-English interface |
| 0027 | Romanian, Libraries open on **Patterns** beside Setări on Calcul, with the time dropdown expanded down the hour list | **Yes** | Three panels at once, so it is evidence rather than a hero. Documents an untranslated label: "Recalculate automatically ?" reads English amid Romanian. The `ro` file now carries `lpn_settings_auto_run`, so this is a state since repaired |
| 0028 | Desktop, English, **no dialog**: Net3 georeferenced on the Novato street map, coloured by pressure with the key at the right, and the bottom pane open on **Profile** — ground surface, hydraulic grade line, pressure band, "Nodes: 26, length: 79161 ft" | **Yes — the strongest new hero** | The only capture in the drop with exactly one panel open. Map above, profile below, both readable, nothing to explain away |
| 0029 | Settings open on **Visualization**, the label-content checkboxes with their per-value decimal spinners; bottom pane still on Profile; street-level Novato behind | **Yes** | The best picture of label control. The Settings box is dragged over the menu bar and tab strip, which hides the page's own identity — worth avoiding in a public still |
| 0030 | Same, scrolled to **Color band boundaries: Velocity**, links drawn in the viridis ramp, both a Pressure key and a Velocity key at the right | **Yes** | Documents a second layout defect: the colour key overlaps the node/link label legend, so the legend's rows are unreadable behind it. Both default to the right edge and nothing separates them. Not on the roadmap |
| 0031 | Settings and Libraries → Patterns open together over a velocity-coloured Novato network, page titles switched off | **Yes** | Shows the pattern editor's sparkline-plus-numbers rows at full size. Two panels cover most of the drawing |
| 0032 | Libraries → **Curves** beside Settings → Map appearance, over **satellite imagery**; the "Background image opacity" field is ringed in yellow highlighter | **Yes** | Pump curves as a plot plus their point table. The yellow ring is a hand annotation added after capture, so crop or re-take before any public use. Mapbox / OpenStreetMap / Maxar credits are in frame and correct |
| 0033 | Libraries → **Controls** beside Settings → Calculation, over satellite: six simple controls (`Link 10 OPEN AT TIME 1`, `Link 335 OPEN IF Node 1 BELOW 17.1`, …), each marked "✓ Understood" | **Yes** | The evidence that simple `[CONTROLS]` are read and honoured, which is what makes what is left of Task 248 rule-based `[RULES]` alone. Also shows the ColorBrewer / viridis / EPANET credits at the foot of Settings |
| 0034 | **The first phone capture in the drop** (Tom's own, 2026-08-25, Chrome on Android, portrait, page region only). Net3-World on the OSM street map: collapsed navbar, toolbar, transport row, tab strip, scenario and units readouts all render. Over the drawing stand the mode hint, the EPANET minor-loss note, and the Pressure and Flow keys | **Not as is** | Nothing identifying in frame — no browser chrome, no phone status bar. **Superseded: it is the evidence behind Task 524** (mode hint now hidden below 640px, status note bounded), so it shows a defect that is fixed. Coordinate readout is the un-hovered `X: -- Y: --`, which is all a touch device ever sees. Corrects an earlier index entry: this file is PNG, not JPEG, and does not show a longitude-first readout |
| 0035 | Near-duplicate of 0034, six pixels shorter and otherwise the same frame | **Not as is** | Two chances at the same shot, which is the drop working as intended. Use 0034 and ignore this one unless 0034 crops badly. Same Task 524 supersession |
| 0036 | The same phone view with pipe 309's property popup open — ID, diameter 6 in, C 130, k 0, length 1580 ft, Auto/Shut/Part-of-network boxes, then solved flow 216.96 gpm, velocity 1.38 ft/sec, head loss 1.70 ft H2O | **Yes** | **The best phone frame in the drop and the only one worth publishing as is.** The popup is legible at phone width with real numbers, and the status readout reads `Latitude:` first — so this deploy already had the 2026-08-24 latitude-first fix. Behind the popup the labels legend, mode hint and note overlap each other, which Tasks 524 and 529 have since addressed |
| 0037 | The popup closed again, zoomed to street level; the EPANET gravity note still standing | **Not as is** | Tom's point that a solve does not dismiss the note. **Fixed by Task 525** — the note is a fact about the engine, said once per project and engine choice, not re-emitted on every solve. Also the clearest count of the old overlay pile: mode hint, labels legend, engine note and two colour keys, five things in one corner |
| 0038 | Settings open on Visualization → Link symbology at phone width | **Not as is — bug evidence, Task 527** | Two live defects, neither superseded. The category index breaks EVERY label mid-word — "Visualiz/ation", "Node symbo/logy", "Link symbo/logy", "Map appear/ance" (Task 515 is the desktop version, parked at Maybe; this is a worse order of ugly). And the label-content column headers read "BeforeAfter 0.000 Drop", touching each other and not aligned with the four boxes beneath |
| 0039 | Bottom pane open on Profile, map above: ground surface, hydraulic grade line, pressure band, "Nodes: 26, length: 79161 ft" | **Not as is — bug evidence, Task 527** | The chart itself draws well and reads well. **Its axes do not:** the y ticks overprint into a solid smear and the x node labels are an unreadable scribble. That is the live defect and it is only the axes |
| 0040 | The same Profile view scrolled, captured with the browser's own chrome in frame | **No** | The one phone frame that fails on the frame rather than the content: Chrome's URL bar showing `dev.hawsedc.com`, the tab count and the overflow menu. 0039 is the same view captured clean — use that. Same illegible axes (Task 527) |
| 0041 | Bottom pane on the Pipes table, with Print table beside the tab row | **Not as is — bug evidence, Task 527** | **Checked and NOT a defect: the values are right.** Pipes 40, 50, 60 and 101 match `examples/Net3-World-lpn.json` exactly; pipe 20 reads diameter 1200 and k 12.2 against the file's 99 and 0, which are Tom's own unsaved edits (the tab shows `*Net3-World`) and are what raised the note he photographed. Nothing is clipped. The one defect is the header breaking "Roughnes/s, C" mid-word |
| 0042 | Phone, portrait: the scenario menu open over the network on satellite imagery -- Base ticked, New scenario..., Rename scenario..., Delete scenario, Apply Base values to all scenarios -- with both colour keys and the labels legend stacked down the right | **Not as is** | **This is the file the index used to list under the grabber's own name `Screenshot_20260825_012922.png`;** it has since been renamed to the ordinal convention and this row replaces that one. The menu is well sized for touch. **Three supersessions:** Task 528 (the menu hangs detached in mid-canvas rather than below the button that opened it), Task 529 (the colour key it cuts off mid-list now has an **Off** placement), and the toolbar's old plan-sheet Project button, since a water drop on a menu now called Water. The mode hint and the engine note are piled behind the labels legend at top left (Tasks 524, 525) |
| 0043 | Phone, portrait, **shot on today's master**: Find and replace filling the screen -- What to search: Pipe, Property: Diameter, Condition: equal to, Value 30, the Find and Replace buttons, then "13 found. Click one to go to it." and the hit list beneath | **Yes** | **Published** on `screenshots.html`. The first phone frame in the drop that is both clean and current: the water-drop Water button is in the toolbar, the panel says "Find and replace" rather than 0001's old "Find assets", and there is no overlay pile because the panel owns the screen. It also answers the remake queue's "Find and replace, one panel", on a phone rather than on the desktop it was asked for |
| 0044 | Byte-identical re-drop of 0040 | **No** | Same md5 as `0040.png` -- an accidental second copy, which costs nothing and is worth saying rather than describing twice. Fails for 0040's reason: Chrome's URL bar showing `dev.hawsedc.com`, the tab count and the overflow menu are in frame. 0039 is the same view captured clean |
| 0045 | Byte-identical re-drop of 0039 | **Not as is** | Same md5 as `0039.png`: the bottom pane on Profile at phone width. The chart itself draws and reads well; its AXES are the live defect (Task 527, not superseded) -- the y ticks overprint into a smear and the x node labels are a scribble |
| 0046 | Phone, portrait, on today's master: the network at street level on satellite, both colour keys down the right, the node/link labels legend top left, nothing else open | **Not as is** | Privacy-clean and current -- water-drop Water button, and the mode hint is gone (Task 524). What stops it is LIVE, not superseded: the labels legend and the orange EPANET engine note still print over each other in the top-left corner, so the corner is unreadable. That is why it did not get a plate. The frame the remake queue wants is this one with both legends set to **Off** (Task 529) |
| 0047 | Phone, portrait, on today's master: the **Water** menu open directly beneath the button that opened it -- Settings, Libraries, Profile, Tables, Scenarios, Calculate, EPANET run report -- over the network at street level on satellite, the Flow key at the right, and the units, friction method and scenario stated along the bottom | **Yes** | **Published** on `screenshots.html`. The proof frame for Task 528: the menu hangs from its own button instead of floating in mid-canvas. Shows the water-drop icon in the toolbar and the whole menu at a size a thumb can hit. 0046's top-left overlap is behind the menu here and barely reads |
| 0048 | Desktop, 1920 wide, **no panel open at all**: `Net3-Novato-CA-World.lwn` on satellite imagery over Novato, nodes coloured by pressure and links by velocity, both keys and the labels legend down the right, and a latitude-first coordinate readout in the status strip | **Not as is** | Privacy-clean, and the cleanest wide frame in the drop -- zero panels, which not even 0028 manages. **One thing dates it:** the menu bar still reads Water beside the old rolled-plan glyph rather than the water drop (`lib/Icons.lib.php`, 2026-08-25), so re-shoot it rather than publish it. Two tabs are open, `*Project1` and the model, which is honest rather than staged |

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
- **Two layout defects are on file only because somebody screenshotted them.** The Settings category
  index breaks words mid-word (0022–0023), and the colour key overlaps the label legend when both
  sit at the right edge (0030). Neither is on the roadmap.
- **The phone session (0034–0042) paid for itself in one
  sitting.** Nine frames from Tom's first real use of the page on a phone, 2026-08-25, and they
  produced five tasks: 524 (overlays eating the canvas), 525 (an engine note a solve could not
  dismiss), 528 (a menu detached from its button), 529 (**Off** as a legend placement), and 527 for
  what is left. No harness found any of them; he found them by using the page and photographing it.
- **A picture goes stale the moment the bug is fixed, and the index is where that gets said.**
  Five fixes landed after these were shot and none was on `dev.hawsedc.com` at the time, so eight of
  the nine show at least one defect that no longer exists. Every phone row names which task
  superseded it, so nobody re-diagnoses a fixed bug from a stale frame. **All nine also show the old
  Project toolbar icon**, since replaced by a water drop on a menu now called Water.
- **The re-shoot answered it: 0043, 0046 and 0047 are the same phone after the fixes**, and two of
  them are on the public page. The proof is in the frame rather than in a ledger citation -- the
  water drop is in the toolbar, the mode hint is gone, and in 0047 the menu hangs from the button
  that opened it. What the re-shoot did NOT clear is the top-left corner, where the labels legend
  and the engine note still print over each other; that is live and 0046 is the evidence.
- **A capture is dated by its ICONS faster than by anything else in it.** 0048 was dropped later
  than 0043–0047 and is nonetheless the older-looking frame, because its menu bar carries the
  rolled-plan glyph the Water menu had until 2026-08-25. When judging whether a frame is current,
  look at the toolbar before reading the dialogs.
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
| ~~A phone, in tall mode, after the five fixes~~ **DONE 2026-08-25** | 0043 and 0047 are the re-shoot: water-drop toolbar, no mode hint, and the menu hanging from its own button. Both are on `screenshots.html` | -- |
| **A phone frame with no legends over the map** | Still open, and 0046 is the evidence: on today's master the labels legend and the engine note print over each other in the top-left corner, so the map's corner is unreadable | The network filling the map area on a phone with both legends set to **Off** (Task 529), nothing over it but the status strip. Tom ruled the pane-covers-map case NOT a defect, so this is a marketing frame, not a bug fix |
| **A wide desktop frame with today's icons** | 0048 is the cleanest wide capture in the drop -- zero panels open -- but its menu bar carries the pre-2026-08-25 rolled-plan glyph instead of the water drop | The same view re-shot, or any wide view with nothing open. It is the frame the front door would use |
| **Find and replace on the DESKTOP, current wording** | 0043 answers this on a phone. 0001 and 0002 answer it on the desktop but say the old "Find assets" and name the menu Project | The desktop panel mid-replace so the count is visible. Panel count is NOT a reason to re-take it -- see the clutter entry above |
| **Romanian, after the unit fix** | 0026 is the language still and predates Task 521 — its status strip and colour key disagree about pressure units, which is fixed | Same view as 0026, retaken. Any of the 27 languages; Romanian is proven to fit |
| **The Nominatim consent prompt** | 0011–0014 all have the browser's bookmarks bar and profile picture in frame | Just the dialog and the map. The consent wording is one of the most honest things in the suite and nothing shows it |
| **"Place the model here permanently?"** | 0021, same browser chrome | The confirm on its own. It is the plainest one-way-door warning we have written |
| **The Settings box, not covering the menu bar** | 0029 is the best picture of label control, but the box is dragged over the title and tab strip, so the frame stops saying what application it is | Same content, box parked clear of the top chrome |
| **Saving to a file** | 0025 shows a real folder listing and a real path | The browser's own permission prompt, over a network, in a folder whose name says nothing about you |

**The one habit that fixes most of this:** capture the page region, not the browser window. Six of
the eight unpublishable frames fail for that alone — 0011–0014, 0021, and now 0040 — and nothing on
the page itself has ever disqualified a single image. **It holds on the phone too, and Tom already
does it:** eight of the nine phone frames are cropped to the page and are clean; 0040 is the one
that kept Chrome's URL bar, and 0039 is the same view shot correctly.
