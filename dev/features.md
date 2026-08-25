# What this suite does

**Script-generated. Do not edit.** The sentences are hand-written in
`dev/features-source.md`; regenerate with `php dev/scripts/generate_features.php`.
`check_all.sh` fails if this file is stale.

**The wording is a first pass and awaits Tom's edit,** and WHERE this list goes — the
LibreWaterNet landing page, the Help menu, both, neither — is his call and is not yet made.
Nothing on any served page reads this file.

54 features, citing 87 of the 454 closed task IDs. The other 367 are
bug fixes, refactors, rejected proposals, and work nobody outside this repository would
call a feature — and 135 of them are ledger entries carrying no text at all, whose
narrative is in git and which nothing here has judged either way. **This list is honest
rather than complete:** a feature is on it because somebody wrote a sentence for it.

## The calculators

- Manning pipe flow solves in both directions — the flow from a depth, and the depth from a flow. <!-- 13 -->
- Every pipe and channel page checks the velocity it just computed and says when it is too fast or too slow. <!-- 52, 65 -->
- Orifice flow, and the time a tank takes to drain through one. <!-- 6, 12 -->
- Micro-hydropower, from gross head and penstock losses to the power a small site can actually deliver. <!-- 16 -->
- Canal seepage and conveyance efficiency, including whether lining the canal pays for itself. <!-- 29, 38 -->
- Rock chute sizing by the Robinson method. <!-- 30 -->
- Sketches drawn to scale from your own numbers, so you can see the section you just described. <!-- 11 -->
- A tip on every input saying what the number is, in the language of the page. <!-- 31 -->
- One button returns a page to a worked example that passes, so nothing is ever a blank form. <!-- 79 -->
- Name a calculation and copy a link to it; the link carries your inputs, and nothing is shared unless you share it. <!-- 39, 80, 228 -->
- Changing an input unit asks first, and says plainly that it reinterprets the numbers you typed rather than converting them. <!-- 422, 425 -->
- Install it from the browser you already have, and every calculator keeps working with no network at all. <!-- 2 -->

## Drawing a water network

- A drawing toolbar — junction, reservoir, tank, pipe, pump, valve and text — placed by clicking the map. <!-- 146.02 -->
- Many named projects, saved in your own browser, each open in its own tab. <!-- 146.08, 447 -->
- The property box is a window you can drag out of your way, not a panel that owns an edge of the screen. <!-- 344 -->
- ID prefixes you choose, with Apply to all for when you change your mind. <!-- 345 -->
- Find elements by any property, jump straight to one by ID, and set a property across everything the search found. <!-- 353, 420, 389 -->
- The File menu remembers your recent projects, and the map remembers where you were looking. <!-- 352, 360 -->
- One toggle clears the readouts off the map when you want the drawing and nothing else. <!-- 253 -->
- A Help menu specific to this calculator. <!-- 250 -->
- And although you of course prefer working on your PC, it works also on a phone in tall mode. <!-- 486 -->

## Solving it

- A looped network solved by the global gradient method, in the page, with no install and no upload. <!-- 146 -->
- Or solved by the EPANET 2.3 engine itself, compiled into the page and named by version where you can see it. <!-- 451 -->
- Standard gravity throughout, and where the two engines disagree the page tells you by how much. <!-- 419 -->
- Answers follow your edits as you make them, and if a big network makes that slow, it is a project setting you can turn off. <!-- 467 -->

## Time

- Extended-period simulation: tanks fill and drain, demands follow their patterns, and a bar along the bottom plays the run or steps to any moment in it. <!-- 248.01, 423, 410 -->
- Patterns on a reservoir head and on a pump's speed, beside the demand patterns. <!-- 248.02 -->
- A Libraries box holding the patterns and curves a run needs. <!-- 460 -->
- A Run button (optional, since answers can follow your edits instead) shows real progress, a completion report, and the engine's own report of the run. <!-- 450 -->
- Colour limits hold still across a run, so a colour means the same thing at every step. <!-- 448 -->

## Files and EPANET

- Opens EPANET `.inp` files, takes the part it supports, and reports every difference instead of dropping it quietly. <!-- 196 -->
- An import note is filed on the element it concerns, and you read it in that element's own property box. <!-- 483 -->
- Writes `.inp` files back out. Every value you did not edit comes back exactly as it went in, character for character. <!-- 281 -->
- Projects are `.lwn` files — JSON inside, on your own disk, readable without us. <!-- 246 -->
- An examples library that opens Net1, Net2, Net3, Elm Street Center and a Net3 placed on the world, in one click. <!-- 314, 257, 454 -->

## The map and the world

- A geographic project is drawn in latitude and longitude over a street map or satellite imagery, with the same drawing tools. <!-- 145 -->
- An existing x/y network can be placed on the world — moved, scaled and rotated onto its real ground. <!-- 476 -->
- Type a place name and the map goes there, if you turn that on. <!-- 437 -->
- Ground elevations read from terrain data and typed into the document, never replacing a number without first showing you the one it would replace. <!-- 497 -->

## Labels and lettering

- Labels place themselves. Where there is no room, a label sheds values in the order you chose instead of disappearing whole. <!-- 397, 398, 399, 469 -->
- Any label can be dragged where you want it, and it keeps a leader back to what it names. <!-- 146.01, 383 -->
- Pipe labels lie along their pipe, the way a map draws a street name. <!-- 329 -->
- Prefixes, suffixes and a separator you choose, with a link's values on one line. <!-- 333, 336 -->
- A Text object takes several lines, bold, and a rotation that can match a pipe. <!-- 337, 342 -->
- Lettering is haloed, so it stays readable over the drawing underneath it. <!-- 376 -->
- Text, symbols and pipes are three independent screen sizes, so a drawing reads the same at every zoom. <!-- 331, 362 -->

## Reading the results

- A table for each kind of part in the bottom pane — junctions, reservoirs, tanks, pipes, pumps and valves. <!-- 434, 455 -->
- Colour the map by any value, from one control: three to seven classes, eight ways of choosing where the breaks fall, and 41 colour ramps. <!-- 384, 327 -->
- Profiles. Click along the map to choose the path, and see ground, hydraulic grade and the pressure between them. <!-- 409, 433, 506 -->

## Scenarios

- Change a few properties without disturbing the network they belong to, switch between those scenarios, and see at a glance which elements carry an override. <!-- 201, 407, 412, 512 -->

## Language, licence, and privacy

- Twenty-seven languages, across the whole suite and not only its menus. <!-- 7, 15, 22, 34 -->
- Free software under the GNU GPL, source in the open. <!-- 244 -->
- It installs on a desktop or a phone as an app of its own, icon and all. <!-- 4, 37 -->
- No account, no visitor identifier, and nothing counted about you unless you say yes. <!-- 286, 288 -->
