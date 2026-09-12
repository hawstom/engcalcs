# What this suite does

**Script-generated. Do not edit.** The sentences are hand-written in
`dev/features-source.md`; regenerate with `php dev/scripts/generate_features.php`.
`check_all.sh` fails if this file is stale.

**The wording is a first pass and awaits Tom's edit,** and WHERE this list goes — the
LibreWaterNet landing page, the Help menu, both, neither — is his call and is not yet made.
Nothing on any served page reads this file.

44 features, citing 90 of the 554 closed task IDs. The other 464 are
bug fixes, refactors, rejected proposals, and work nobody outside this repository would
call a feature — and 134 of them are ledger entries carrying no text at all, whose
narrative is in git and which nothing here has judged either way. **This list is honest
rather than complete:** a feature is on it because somebody wrote a sentence for it.

## The network model

- A looped water network solved in the page by the global gradient method, with nothing to install. <!-- 146 -->
- Or solved by EPANET 2.3.5 itself, the EPA's own engine compiled into the page, and where the two engines disagree the page tells you by how much. <!-- 451, 419 -->
- Answers follow your edits as you make them, and on a network large enough for that to drag, you can turn it off. <!-- 467 -->

## Starting from what you already have

- Opens EPANET `.inp` files, takes the part it supports, and files a note on the element concerned for every difference rather than dropping it quietly. <!-- 196, 483 -->
- Net1, Net2, Net3, Elm Street Center and a Net3 placed on the world, each one click away. <!-- 314, 257, 454 -->
- Draw in latitude and longitude over a street map or satellite imagery, with the same tools you use anywhere else. <!-- 145 -->
- An x/y network you already have can be placed on the world, then moved, scaled and rotated onto its real ground. <!-- 476 -->
- Your own site plan or aerial photograph under the drawing, scaled by picking two points on it or by typing the size of a pixel. <!-- 276 -->
- Type a place name and the map goes there, if you turn that on. <!-- 437 -->
- Ground elevations read from terrain data and typed into the document, never replacing a number you already have without your having asked for exactly that. <!-- 497 -->

## Drawing the network

- Junction, reservoir, tank, pipe, pump, valve and text, placed by clicking the map. <!-- 146.02 -->
- ID prefixes you choose, with Apply to all for when you change your mind. <!-- 345 -->
- Find elements by any property, jump straight to one by ID, and set a property across everything the search found. <!-- 353, 420, 389 -->
- Or write the search out yourself, with AND, OR and brackets, in the words of your own language. <!-- 540 -->

## Over time

- Extended-period simulation: tanks fill and drain, demands follow their patterns, and a transport bar plays the run or steps to any moment in it. <!-- 248.01, 423, 410 -->
- Patterns on a reservoir head and on a pump's speed, beside the demand patterns. <!-- 248.02 -->
- Rule-based controls in EPANET's own words, read, written and edited beside the patterns and curves a run needs, with every level, pressure and flow in a rule put into the units your project is showing. <!-- 248.03, 460 -->
- A run reports its progress as it goes and hands you the engine's own report of it at the end. <!-- 450 -->
- Color limits hold still across a run, so a color means the same thing at every step. <!-- 448 -->

## What else it will tell you

- Fire flow for the whole system in one press: every junction tested against the flow your code requires, what it can actually deliver at the residual you set, and what drawing that flow does to everything around it. <!-- 530 -->
- Water quality over a run: how old the water reaching a point is, how much of it came from a source you name, and how a chemical residual decays as it travels, with the reaction coefficients yours to state rather than ours to guess. <!-- 566 -->
- What the pumps cost: how long each one ran, the power it drew, the energy it used and the money that came to, including the demand charge on the highest power drawn at any one moment. <!-- 566.01 -->
- Profiles: click along the map to choose the path, see ground, hydraulic grade and the pressure between them, and save the path with the project under a name you give it. <!-- 409, 433, 506, 510 -->

## Reading the answers

- A table for each kind of part: junctions, reservoirs, tanks, pipes, pumps and valves. <!-- 434, 455 -->
- Color the map by any value, from one control: three to seven classes, eight ways of choosing where the breaks fall, and 41 color ramps. <!-- 384, 327 -->
- Labels place themselves, keep a leader back to what they name if you drag them elsewhere, and where there is no room shed values in the order you chose instead of disappearing whole. <!-- 397, 398, 399, 469, 146.01, 383 -->
- Pipe labels lie along their pipe the way a map draws a street name, with prefixes, suffixes and a separator you choose. <!-- 329, 333, 336 -->
- A Text object takes several lines, bold, and a rotation that can match a pipe, and all lettering is haloed so it stays readable over the drawing underneath. <!-- 337, 342, 376 -->
- Text, symbols and pipes are three independent screen sizes, so a drawing reads the same at every zoom. <!-- 331, 362 -->

## Scenarios

- Change a few properties without disturbing the network they belong to, switch between those scenarios, and see at a glance which elements carry an override. <!-- 201, 407, 412, 512 -->

## Where your work lives

- A project is a `.lwn` file: JSON inside, on your own disk, readable without us. <!-- 246 -->
- As many projects as you like, each open in its own tab and saved in your own browser as you work, with the File menu remembering the recent ones and each reopening where you were looking. <!-- 146.08, 447, 352, 360 -->
- Writes EPANET `.inp` files back out, and every value you did not edit comes back exactly as it went in, character for character. <!-- 281 -->
- Open it once with a connection and it keeps working with none, and it installs on a desktop or a phone as an app of its own, icon and all. <!-- 2, 4, 37 -->
- And although you of course prefer working on your PC, it works also on a phone in tall mode. <!-- 486 -->

## The calculators

- Manning pipe flow solves in both directions, the flow from a depth and the depth from a flow, and every pipe and channel page says when the velocity it just computed is too fast or too slow. <!-- 13, 52, 65 -->
- Orifice flow, the time a tank takes to drain through one, micro-hydropower from gross head and penstock losses to the power a small site can deliver, and rock chute sizing by the Robinson method. <!-- 6, 12, 16, 30 -->
- Canal seepage and conveyance efficiency, including whether lining the canal pays for itself. <!-- 29, 38 -->
- Sketches drawn to scale from your own numbers, and a tip on every input saying what the number is. <!-- 11, 31 -->
- Name a calculation and copy a link to it; the link carries your inputs, and nothing is shared unless you share it. <!-- 39, 80, 228 -->
- Changing an input unit asks first, and says plainly that it reinterprets the numbers you typed rather than converting them. <!-- 422, 425 -->

## Language, license, and privacy

- Twenty-seven languages, and every word is evaluated for translation: the network model and the two Manning calculators go into all of them, the rest of the suite into Spanish, Portuguese, French, and Turkish, and every calculator is findable by name in every language while it waits its turn. <!-- 7, 15, 22, 34 -->
- Free software under the GNU GPL, source in the open. <!-- 244 -->
- No account, no visitor identifier, and nothing counted about you unless you say yes. <!-- 286, 288 -->
