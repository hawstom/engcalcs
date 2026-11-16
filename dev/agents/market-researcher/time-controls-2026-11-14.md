# Time controls for extended-period results: what others do (Mary, 2026-11-14)

Tom's question: how to remove the mandatory toolbar cost of the time controls, and why they are missing on his phone. Public docs only. Layout judgment is Ida's.

## What exists (each line tagged)

| Product | Where the time control lives | Source |
|---|---|---|
| WaterGEMS / WaterCAD / SewerGEMS | **Time Browser**, a separate dialog opened from Home or Analysis ribbon, "Times". Time display, time slider, Go to start / Play backward / Step back / Pause / Step / Play / Go to end, Speed slider, Increment, Record Animation, Options. Not applicable to steady-state runs. | CITED https://docs.bentley.com/LiveContent/web/Bentley%20SewerGEMS%20SS5-v2/en/35062.html ; ribbon location via search summary of Bentley wiki "Using the Time Browser" (page itself would not load, login redirect) |
| InfoWater Pro | **Output time slider in the Model Explorer** (the side tree), with a "Refresh Output" checkbox beside it; separate Animation Editor/Viewer for saved animations | CITED https://www.autodesk.com/learn/ondemand/tutorial/creating-an-animated-thematic-map (via search summary; page returned 403 to fetch); https://innovyzefeedback.autodesk.com/ideas/INWAPRO-I-205 |
| EPANET 2.2 GUI | **Map Browser** tab of the always-present Browser window: pick parameter and time period; four buttons (rewind, animate back, stop, animate forward). Time is picked in the Browser, and map colouring and queries follow it. | CITED https://usepa.github.io/EPANET2.2/4_EPANET_workspace.html and https://epanet-users-manual.readthedocs.io/en/latest/9_viewing_results.html |
| epanet-js app (app.epanetjs.com) | A **"time browser" in the top-right corner of the map**, appearing only once the project is switched from steady state to EPS. Step forward/back, jump to a time from a dropdown, keyboard shortcuts. No mention of mobile. | CITED https://epanetjs.com/blog/2026/01/13/epanet-js-december-2025-progress-report/ |
| QGIS Temporal Controller | A **panel** opened by a Map Navigation toolbar icon or View > Panels. Docs do not say dockable. Modes: off, animated, fixed range. | CITED https://docs.qgis.org/latest/en/docs/user_manual/map_views/map_view.html ; modes from https://api.qgis.org/api/qgstemporalcontrollerwidget_8h_source.html |
| QField (QGIS on a phone) | **No playback.** Fixed-range filter only: Side Dashboard, clock icon, choose a range; green clock = filter on. | CITED via search summary of https://docs.qfield.org/how-to/temporal-filtering (direct fetch 404) |
| ArcGIS Pro | Time slider appears across the top of the map, only when the map has time-aware layers. Desktop and web. Field Maps: no source found. | CITED https://pro.arcgis.com/en/pro-app/3.4/help/mapping/time/visualize-temporal-data-using-the-time-slider.htm (via search summary) |
| MIKE WaterNet Advisor (DHI) | Web app on EPANET models; "view and share results from a desktop, phone or tablet" (that sentence is on a page about SWMM models); overlays time series. Animation not mentioned. | CITED https://dhigroup.com/technologies/mikepoweredbydhi/mike-waternet-advisor |
| Phone apps running EPANET (HydroViewer, FlowAnalyzer, iOS) | Store listings mention running .inp files; no time animation listed. | CITED App Store listings https://apps.apple.com/app/id6754879365 and https://apps.apple.com/app/id6754671981 (via search summary) |
| Model View (open source, epanet-js based) | README lists "Mobile-friendly UI" under Future Enhancements; early preview. | CITED https://github.com/BlomTbl/model-view |
| Synergi, InfoWorks WS Pro | **NOT FOUND** in public docs I could reach. |  |

## What users complain about (thin evidence, said honestly)

- **Bentley Communities and Autodesk forums could not be fetched** (Bentley redirects to a login). Everything below is from search-result snippets, not full threads. No LinkedIn, Reddit or Eng-Tips complaint about time-control placement turned up. That is a finding: I looked and found no public complaint that the Time Browser is a separate window.
- CITED (snippet) Bentley wiki "annotation or color coding not updating when scrolling through time browser": symbology does not follow the slider unless Auto-Refresh is on. https://communities.bentley.com/products/hydraulics___hydrology/w/hydraulics_and_hydrology__wiki/13167/annotation-or-color-coding-not-updating-when-scrolling-through-time-browser
- CITED (snippet) Bentley forum "time browser default": the selected time resets after each run and the user must pick it again. https://communities.bentley.com/products/hydraulics___hydrology/f/haestad-hydraulics-and-hydrology-forum/225244/time-browser-default/694222
- CITED (snippet) A new user could not tell which EPS step the tables were showing. https://communities.bentley.com/products/hydraulics___hydrology/f/haestad-hydraulics-and-hydrology-forum/205535/eps/619507
- CITED InfoWater: dragging the slider on a large model can freeze the map; the workaround is to untick Refresh Output; a user idea (3 votes, "Gathering support") asks to move that checkbox because "Refresh Output should be checked 99.9% of the time" and leaving it off shows stale results unnoticed. https://innovyzefeedback.autodesk.com/ideas/INWAPRO-I-205

## Reading, for Ida (SPECULATION, re-derive before use)

1. Tom's reaction to WaterGEMS (separate Time Browser, confusing) is not matched by a public complaint, but the Bentley snippets share one theme: the user cannot see which time is showing or the display does not follow it. A hidden time control costs "which time am I looking at" more than it costs space. Whatever hides the controls should still state the time on screen.
2. Every desktop product puts the time control with the results (Browser, Model Explorer) or on the map corner (epanet-js, ArcGIS), conditioned on the run being extended-period. epanet-js appears only after the project is switched to EPS: the strongest precedent for "no mandatory toolbar cost for a steady-state user."
3. On a phone, the one documented precedent (QField) drops playback and keeps a chosen range or instant. No source shows a phone viewer that animates hydraulic results; MIKE WaterNet Advisor claims phone access without naming time controls. So "time step picker, no animation" on a phone is within what exists, and is not behind it.
