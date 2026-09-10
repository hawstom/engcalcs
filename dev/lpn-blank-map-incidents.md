# Looped-Network blank-map incidents

One dated entry per reported occurrence, newest last. **This file exists because "it happened
again" is the most important fact about this bug and there was nowhere to record a second
occurrence beside the first.** ROADMAP Task 623 owns the scenario list; this file is the evidence
it will be built from.

## NO DATA LOSS HAS EVER BEEN CONFIRMED, IN ANY OCCURRENCE

**This file was called `lpn-loss-incidents.md` when it was written and renamed in the same
session; the name was an inference nobody had checked.** Tom, asked directly: *"I cannot confirm that in any instance the
document ever was gone. I didn't investigate earlier."* On the one occurrence that WAS
investigated the document was fully intact -- 97 nodes, 119 links, parsing cleanly -- and the
network had been drawn into the DOM.

**So the observed phenomenon is A BLANK MAP, and "lost project" is what a blank map looks like to
the person in front of it.** Those are different bugs with different fixes, and the loss reading
sent two rounds of investigation into storage and autosave paths where nothing was wrong. Record
what was measured; call it loss only when a document has been shown to be gone.

### THE RENAME IS ABOUT WHERE TO LOOK. IT IS NOT A DOWNGRADE.

**Tom, 2026-09-10, immediately on being told the document was intact: *"But a blank map is equally
fatal as a lost project. User doesn't know the difference."*** He is right and it is the ruling
this file opens with, because the correction above invites precisely the wrong inference.

- **SEVERITY IS UNCHANGED.** A network the user cannot see is a network they have lost, and they
  will act accordingly -- redraw it, abandon it, or close the tab and take the "gone for good"
  confirm at its word. **The intact bytes are worth nothing to somebody who has no reason to
  believe they are there**, and nothing on that screen tells them.
- **What the distinction buys is diagnostic, and only that**: it says look at the render and the
  view, not at storage. Never quote it to argue the bug is smaller.
- **It also names a defect of its own.** The page had a drawn, intact, 97-node network and told
  the user nothing -- no error, no status line, no hint that what they were looking at disagreed
  with what they had. A blank canvas over a non-empty document is a state the page can DETECT: it
  knows `doc.nodes.length` and it knows what it painted.

**What an entry is for:** classifying the occurrence -- was the document applied, was it drawn, was
it visible, and was anything actually lost. Task 623's scenario list (reload without reconnecting,
close without saving, storage evicted, quota exceeded mid-autosave, two tabs, denied permission, a
file moved under us) remains the frame for a genuine loss, if one is ever confirmed. An entry that
cannot be classified says so and names what evidence was missing.

**These are development machines and every project in them is a throwaway** (Tom, 2026-09-10:
*"This is a throwaway. The dear file will be a throwaway. It's all throwaway. This is
development."*). An incident is a defect to document, never a project to salvage. Do not spend a
live specimen on recovery.

---

## 2026-09-10 -- second reported occurrence: SOLVED. A CORRUPTED VIEW.

**Sequence, in Tom's own words (2026-09-10).** *"I restarted my computer. I went to the local
lpn. I noticed that there was a persistent message on the map that the EPANET solver could not be
loaded. So I checked the Transport controls. They had the mistaken message that this project has no
EPS. I reloaded the page. Net3 disappeared. The project tab name is the only thing left. I
immediately opened Developer Tools"* -- and, on inspecting storage: *"The project is still in
storage. But the map is blank."*

**So nothing was destroyed. The document is intact and the map did not draw it.** That is the fact
the whole entry turns on, and it was established only by asking: the first reading of "the project
tab name is the only thing left" was that the document had been overwritten with an empty one, and
that was WRONG.

**Report.** Tom reported losing an open project; no document was in fact lost. Not reproducible on demand; his words: *"I am unable to
reproduce this easily, but it happened again."* The first occurrence is the one recorded in Task
623, on the same day, and was diagnosed as by-design (a reload cannot carry the browser's write
permission, the handle returns `'prompt'`, one click restores it).

**Console, complete.** Two errors, and this is the whole of what the browser reported:

```
log-human-view.php:1  Failed to load resource: the server responded with a status of 400 (Bad Request)
web-client-content-script.js:2  Uncaught (in promise) Object
    message: "Could not establish connection. Receiving end does not exist."
```

**THE SIGNIFICANT FINDING IS A NEGATIVE: `js/looped-network.js` threw nothing.** No exception, no
stack, no error from the map editor, the solver or any `lpn_` module. So this occurrence is **not**
an uncaught exception during `init()` leaving the library unreachable -- which was the leading
hypothesis on the evidence available before the console was read, and it is now excluded for this
occurrence. Whatever happened, the page's own code ran to completion without complaining.

`web-client-content-script.js` is a browser EXTENSION's content script failing to reach its own
service worker. Not this suite, not this origin's code, and not related. Recorded only so the next
reader does not re-investigate it.

**The 400 is real, is ours, and is almost certainly NOT the loss.** It is an analytics beacon; it
touches no project storage, no handle and no `localStorage` key the library reads. It is written up
as its own defect in ROADMAP Task 626 -- see below for why it appears on a page that did nothing
wrong. **Do not let it become the explanation for the loss merely because it is the only error in
the log.**

**Why the 400 appears here at all.** `log-human-view.php` returns 400 on exactly one condition:
`$page === ''`. The live app page emits `EngCalcs.cookieName='Looped-Network'` on BOTH mounts
(verified 2026-09-10 by fetching `https://librewaternet.org/app/` and
`https://hawsedc.com/engcalcs/Looped-Network.php`), and the server's sanitizer keeps hyphens -- so
the app page as served cannot produce an empty page name. The 400 is therefore a **replay from the
offline queue**, whose stored `record.params` were captured with an empty `page` by some earlier
page load and are re-sent verbatim on every flush. **A 400 observed on a page is not evidence about
that page.** It can be days old and can come from a different page entirely.

**UNCLASSIFIED, and here is what was missing.** No storage state was captured while the specimen
was live, so the occurrence cannot be placed against the scenario list. Specifically unknown:
whether `lpn_index` still listed the project, whether its `lpn_project_<id>` document still existed,
whether the two disagreed, the handle's `queryPermission` state, and `navigator.storage.estimate()`
/ `persisted()`. A read-only capture that answers all of these in one paste is in
`dev/scripts/lpn-forensics.js`; run it BEFORE closing the tab next time.

**MEASURED, and it overturned the first two readings.** A console probe on the live specimen:

```
openId pmtvzksxwhiul5   chars 35399   parses true   nodes 97   links 119
drawnSymbols 677   anySvg 1890   view {cx: 835.390625, cy: -4957.78125, s: 5.322222222222222}
```

**The document is intact and the network WAS DRAWN.** So neither earlier reading survives: not the
overwrite (nothing was overwritten), and not the `init()` gap of Task 627 (the document parsed and
was applied -- 677 symbols are in the DOM). **Both were reasoned from a symptom description and
both were wrong.** The lesson is the cheap one: `drawnSymbols` took one line to measure and
decided in one step what two rounds of code reading had got backwards.

**Where it stands: the network is drawn and invisible.** That is the face ROADMAP Task 624
predicted for its unreproducible all-blue map -- *"the symptom is now pipes too thin to see rather
than a blue wall ... the same bug wearing a survivable face, and it should be reported, not
shrugged at."* Every scale fallback in `css/engcalcs.css` is now `0`, so a `publishScaleSizes()`
that never ran leaves `stroke-width: var(--lpn-lw, 0)` and nothing renders. **The competing reading
is the VIEW** -- a camera pointing away from the network draws all 677 symbols off-screen, and the
stored `cy: -4957.78` at `s: 5.32` is not obviously on-target. Not yet separated; the probe for it
measures the symbol group's client rect against the window and reads the two custom properties.

**Standing conditions worth keeping, none of them yet tied to the mechanism:** the machine had just
been restarted; the page reported the EPANET engine could not be loaded; the Transport controls
said the project has no EPS, which is wrong for Net3 and may be a second defect in its own right
(EPS runs through the engine only, so "no engine" and "no EPS" are different sentences and the
right one is `lpn_time_no_engine`).

---

### SOLVED, BY TOM, IN THE BROWSER: it is a zoom fault and nothing else

*"Zoom to fit restores it all. It's a zoom mistake!"* -- and the three observations that got him
there, each of which had been sitting in front of both of us:

- ***"the legends are still on the map"*** -- legends are SCREEN-fixed furniture, so they survive a
  camera pointing anywhere. He called it *"probably not significant"*; it was the first evidence
  that the render was healthy and only the view was wrong.
- ***"And against all hope of hopes, the Tables are still populated"*** -- the tables read the
  document, not the canvas.
- ***"the longitude is 983 and the latitude is -90"*** -- the readout, saturated.

**THE MEASUREMENT.** Stored view `{cx: 835.390625, cy: -4957.78125, s: 5.322222222222222}` against
the two shipped Net3 examples, both of which have exactly 97 nodes and 119 links:

| document | cx | cy | s |
|---|---|---|---|
| `examples/Net3.lwn` (XY grid) | 24.95 | 15.58 | 21.69 |
| `examples/Net3-Novato-CA-World.lwn` (geographic) | -122.60 | 41.27 | 6478.75 |
| **Tom's** | **835.39** | **-4957.78** | **5.32** |

**THE SCALE ALONE IS FATAL AND IS THE HEADLINE.** `s` is pixels per degree for a geographic
document. At 5.322, Net3-Novato's 0.0965 deg by 0.082 deg extent draws **0.51 px by 0.44 px**. The
network is half a pixel. It would be invisible perfectly centred, so the off-world centre is a
second symptom of one corrupted view, not a separate fault.

**AND THE CENTRE IS OUTSIDE THE WORLD IN BOTH AXES.** `Geom.mercY()` is 0 at the equator and +-180
at the cut-off (`js/lpn-geom.js:697`), so a Mercator y of -4957.78 is 27x outside the entire world;
`mercLat(-4957.78)` saturates at exactly **-90**, which is his readout, and cx 835.39 is likewise
outside longitude's +-180.

**WHAT IS EXONERATED, both of which this session filed against it first:** Task 624 (the scale
fallbacks) -- the strokes were fine, 677 symbols were drawn, and a missed `publishScaleSizes()`
does not move a camera. Task 627 (the `init()` gap) -- the document parsed and was applied. **Two
mechanisms reasoned out from a symptom description, both wrong, and one line of measurement
settled each.**

**NOT ESTABLISHED: how the view got there.** It matches neither example's saved view, so it was not
a straight copy of the sibling tab's. Task 624's original report was *"opening the geographic Net3
example beside an existing project"* -- two Net3s, one grid and one geographic, indistinguishable
by node count -- so a view crossing between them remains the first place to look. `view` is part of
the document and part of `docSignature()`, so whatever wrote it also marked the project dirty.

**THE SPECIMEN IS SPENT.** Zoom to fit recomputed the camera and the autosave wrote the good view
over the bad one. The table above is all that survives of it; there is no way back to the state.
**Capture `view` before touching anything on the next one.**

---

## 2026-09-10 -- it recurred on a reload, and THIS ONE IS SOLVED

**Captured live, with the fixture saved:** `dev/lpn-spike/net3-world-bad-view.lwn`, Tom's own
Net3-Novato-CA-World, the first reproducible specimen of this bug. **Capture the LIVE TRANSFORM as
well as the stored view** -- the stored view says what the document claims, the transform says what
the screen is doing, and the first occurrence was lost for want of the second.

```
storedView    {cx: 835.390625, cy: -4957.78125, s: 5.322222222222222}
liveTransform translate(-4140.688888888889,-26424.28888888889) scale(5.322222222222222)
canvas        1918 x 365      symbolsOnScreen  x -4139  y -26252  w 1  h 0     drawn 677
coords geo    origin {0,0}    nodes x -122.6076..-122.5111  y 38.0645..38.1287
```

**THREE EXACT IDENTITIES, and they close it.** Derived geo origin is
`floor(-122.607554 x 128)/128 = -122.609375`, so in the local frame:

| quantity | value | equals |
|---|---|---|
| `s` | 5.322222222222222 | `1916/360` -- `minScale()`, the "whole world fits" floor |
| `cx` local | **958.000000** | `w/2` -- half the canvas width, IN PIXELS |
| `cy` local | **4999.000000** | `h/2` for a 9998 px tall SVG, IN PIXELS |

A real local coordinate here is about 0.05 degrees. These are pixels.

**THE LINE IS `defaultViewForCoords()`** (`js/looped-network.js:7239`): `if (isGeoProject()) {
return geoHomeView(); }` and otherwise `{cx: w/2, cy: h/2, s: 1}`, which is correct for an XY grid
and nonsense for degrees. `isGeoProject()` reads `project.coords`, and `project` is still the
PREVIOUS project's while a geographic one arrives, so the geographic document takes the grid
branch. `s: 1` is then raised by `applyView()`'s clamp to `minScale()`, which is exactly the stored
number. Reached from `if (!doc.nodes.length) { applyView(defaultViewForCoords()); return; }`.

**THE COMMENT DIRECTLY ABOVE THAT LINE FIXES THE OPPOSITE DIRECTION ONLY** -- "a blank XY tab made
after a lat/lon one was drawn through a geographic transform" -- so geo-after-XY was never closed.
**Which makes this Task 624's original report as well**: *"an all-blue map after opening the
geographic Net3 example beside an existing project."* One bug; 624's fallback fix changed its face
from a blue wall to a blank page, exactly as that task predicted.

**Why it survives a reload:** `view` is document state, so the autosave writes the bad camera and
every boot restores it. Zoom to fit cures it and the next boot re-creates it, which is what made it
look intermittent.

**What the earlier entry got wrong, for the record:** it proposed the corrupted view came from a
copy of a sibling tab's view. It did not -- it was computed, correctly, by the wrong branch.

Owned by ROADMAP Task 629.

