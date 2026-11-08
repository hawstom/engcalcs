# Ida, 2026-11-06: which asset does Properties show?

OBSERVED (lib/lang.ec.en.php:918-920): box title is the fixed word "Properties"; comment says it names the BOX, not the element.
OBSERVED (js/looped-network.js:74698-74715): single asset: first body row is an editable "ID" box; the TYPE appears nowhere. Text uses its own heading "Text" (js ~77130). Several selected: heading "2 selected", sections "Pipes (2)" (lang.ec.en.php:1076).
OBSERVED: docked box may show only the start of its title (Tom's rule), so "Properties" always wins that slot and tells nothing.
CITED (EPANET manual ch.6, epanet-manual.readthedocs.io/en/latest/6_objects.html): the Property Editor edits Junctions, Pipes, Valves etc.; the search did not return its caption text. UNVERIFIED.
SPECULATION: EPANET's editor caption reads "Junction 10"; WaterGEMS shows type in its Properties header. Not checked.

RECOMMEND: title = type word first, then ID, replacing "Properties": "Valve V12" (single), "Pipes (2)" / "2 selected" kept for a selection, "Pump+ P3" for Pump+ (type per open scenario, so it follows Morph live). Keep the ID edit row; drop nothing else. Cost: one title string per type (those words already exist) plus a live title; no new words except none.
ALTERNATIVE: "Properties: Valve V12" -- keeps the box findable, but a docked tab truncates to "Properties: ..." and hides the type, which breaks Tom's start-word rule.
SPECULATION: docked tab then reads "Valve V12" and loses the "Properties" word; the box ? help and menu row still say Properties.
