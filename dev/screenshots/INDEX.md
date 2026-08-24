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

## What these eight taught us, beyond the three bugs

- **The two-network split in `graphics-plan.md` is right, and 0007 proves it.** Elm Street with its
  site plan and hand-placed labels is a different kind of picture from Net3 on a street map, and
  putting them side by side as Design and Management is stronger than either alone.
- **Every desktop capture has three or four panels open at once.** That is what using the page looks
  like, and it is not what a first picture of it should look like: a shopper reads overlapping
  panels as clutter. For the landing page, one panel, deliberately placed.
- **0008 is the cheapest argument on the whole site.** One image turns "27 languages" from a list of
  names into a fact — and it also shows exactly where the gap is, which is the honest version.
