# What is in the screenshot drop

One line per file: what it shows, and whether it could go on a public page. Written by AI from
looking at each image; the images themselves are not in git. See `README.md` for the convention.

**Publishable** means: nothing in frame identifies a real person, a real file path, a browser
profile, or a client's work, and the consent banner is not showing. It is a judgement made once,
here, so nobody has to re-make it every time an image is reached for.

| # | What it shows | Publishable | Notes |
|---|---|---|---|
| 0001 | Wide desktop: Find panel open over the grid network, Settings box open on Node/Link symbology, Profile tab drawn in the bottom pane | **No** | Panel still says the old "Find assets"; three panels open at once reads as clutter rather than capability |
| 0002 | Same window with the Project menu open (Settings, Libraries, Profile, Tables, Scenarios, Calculate) and a Replace in progress — "Change 1 assets?" then "1 found" | **Not as is** | Good evidence of Find-and-replace, but four overlapping panels. Worth re-taking with only the Find panel up |
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

## What the drop has taught us

- **There are three kinds of picture here, not two.** `graphics-plan.md` split them as Design
  (Elm Street on its site plan, 0007) and Management (Net3 on a street map, 0003). The
  georeferencing sequence adds a third: a real network placed on real ground and then read against
  it — 0028, where the profile pane is open under the map. It is the strongest still in the drop and
  the best candidate for the second half of the landing page's pair.
- **One panel, deliberately placed.** Almost every desktop capture has two to four panels open at
  once, because that is what using the page looks like; a shopper reads overlapping panels as
  clutter. 0028 is the one capture that does not, and it is also the one that needs no explaining.
  For anything public, open one panel and nothing else.
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
- **A sequence is worth more than a still for anything procedural.** 0010–0021 is the whole
  georeferencing walkthrough in order: unplaced on the world map, consent, search, scale question,
  placed, zoomed to street level, confirmed. That is a Help page or a blog post already, and six of
  its twelve frames need re-taking only because the browser chrome is in them.
- **Browser chrome is what disqualifies a frame, not the network.** Every unpublishable image here
  fails for the same two reasons — a bookmarks bar with real names or a real file path — and both
  are avoidable by capturing the page rather than the window.
| 0034 | **The first phone capture in the drop.** Net3-World on the OSM map in Chrome on Android, portrait, at `dev.hawsedc.com`. The transport row, tab strip, colour key, scenario and units readouts all render; the mode hint and the EPANET minor-loss note stand over the network | **No — and JPEG, to be replaced** | Tom's own capture, 2026-08-25. Browser chrome and URL bar in frame. **It found ROADMAP Task 524**: the two overlays ate a quarter of the canvas with no way to dismiss them. It also shows `Longitude:` first, which is NOT a live defect — `dev.hawsedc.com` was behind master, where the readout has led with Latitude since 2026-08-24 |

## The remake queue — what to shoot next

**2026-08-25.** Twelve of these went onto the public page (`screenshots.html` in the
librewaternet.org repository). This is the list of shots that would have gone too, and what stopped
each one. **Every entry is blocked by the frame, not by the software** — the page is ready, the
capture is not.

Shoot these deliberately rather than at random, and crop to the PAGE, not the window.

| Want | Why it is not already here | What a good frame looks like |
|---|---|---|
| **A phone, in tall mode** | **There is not one phone capture in the whole drop.** The landing page's own sentence says it works on a phone in tall mode, and nothing on the site shows that | A real network on a phone held upright. The one claim we make with no picture behind it |
| **Find and replace, one panel** | 0001 and 0002 both show it with three or four panels open, and 0001 still says the old "Find assets" | Find open, everything else closed, mid-replace so the count is visible |
| **Romanian, after the unit fix** | 0026 is the language still and predates Task 521 — its status strip and colour key disagree about pressure units, which is fixed | Same view as 0026, retaken. Any of the 27 languages; Romanian is proven to fit |
| **The Nominatim consent prompt** | 0011–0014 all have the browser's bookmarks bar and profile picture in frame | Just the dialog and the map. The consent wording is one of the most honest things in the suite and nothing shows it |
| **"Place the model here permanently?"** | 0021, same browser chrome | The confirm on its own. It is the plainest one-way-door warning we have written |
| **The Settings box, not covering the menu bar** | 0029 is the best picture of label control, but the box is dragged over the title and tab strip, so the frame stops saying what application it is | Same content, box parked clear of the top chrome |
| **Saving to a file** | 0025 shows a real folder listing and a real path | The browser's own permission prompt, over a network, in a folder whose name says nothing about you |

**The one habit that fixes most of this:** capture the page region, not the browser window. Six of
the eight unpublishable frames fail for that alone, and nothing on the page itself disqualified a
single image.
