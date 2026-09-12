# Features source — the hand-written half of the features list

**This file is EDITED BY HAND. `dev/features.md` is generated from it** by
`php dev/scripts/generate_features.php`, which also proves every ID cited here is a task the closed
ledger actually holds.

## What this list is, and what it is not

**It is not a list of what we finished.** That list is the closed ledger, and its public home, when
there is one, is a "Completed issues" area of a published roadmap (Tom, 2026-09-12). Writing the
two in one place is what produced the first draft of this file: 64 rows, one per closed task,
several of them about our own furniture — a draggable property box, a searchable Settings panel, a
menu reorganization, a Help menu — which read, in his words, as an *"in-house 'done, yay' vibe"*.

**It is a list of what a reader can do**, written for somebody who has never opened the page and is
deciding whether to. The test on every sentence here:

> Would somebody choosing between this and something else be worse off not knowing it?

A line about how our controls are arranged fails that test. So does an apology for a box being
long. Seven such lines were cut on 2026-09-12 and their IDs are simply uncited, which the generator
allows and counts.

**And one salient point gets one home.** The second defect in that first draft was scattering: the
single question *"where does my work live and how does it get in and out"* was answered across five
headings, so a reader had to read the whole page to assemble it. The heading order below follows
the order somebody meets the software — what it is, what they can bring to it, drawing, solving,
time, the analyses, reading it, scenarios, and only then where it all lives.

## How to edit

One line per feature, under a `##` area heading:

```
- <ids>| <one sentence, present tense, written for a reader who has never seen the page>
```

`<ids>` is one or more closed task IDs, comma-separated. Every one must exist in
`dev/roadmap-closed-ids.md` at priority 0, and no ID may be cited by two features — the generator
fails on either. A closed ID cited by nothing is fine and expected. Merge freely: the unit of this
list is a capability, not a task, so one line may carry six IDs.

House rules that apply to the sentences here exactly as they apply anywhere else, because these are
public claims: `dev/positioning.md` is the authority, "a phone" and never "your phone", no
completeness claim against EPANET, our own element vocabulary (a **Text** object is EPANET's Label),
never the words "PC application", APA spelling, and no em dash.

**Two headings are load-bearing for the sibling site** and cannot be renamed or restructured without
editing `~/webdev/librewaternet.org/tools/build-features.php` to match: that builder skips
`## The calculators` wholesale (LibreWaterNet does not advertise the calculator suite), and it moves
the line whose ID set is exactly `486` into its own honest-edges note, so that line stays solo.

---

## The network model

- 146| A looped water network solved in the page by the global gradient method, with nothing to install.
- 451, 419| Or solved by EPANET 2.3.5 itself, the EPA's own engine compiled into the page, and where the two engines disagree the page tells you by how much.
- 467| Answers follow your edits as you make them, and on a network large enough for that to drag, you can turn it off.

## Starting from what you already have

- 196, 483| Opens EPANET `.inp` files, takes the part it supports, and files a note on the element concerned for every difference rather than dropping it quietly.
- 314, 257, 454| Net1, Net2, Net3, Elm Street Center and a Net3 placed on the world, each one click away.
- 145| Draw in latitude and longitude over a street map or satellite imagery, with the same tools you use anywhere else.
- 476| An x/y network you already have can be placed on the world, then moved, scaled and rotated onto its real ground.
- 276| Your own site plan or aerial photograph under the drawing, scaled by picking two points on it or by typing the size of a pixel.
- 437| Type a place name and the map goes there, if you turn that on.
- 497| Ground elevations read from terrain data and typed into the document, never replacing a number you already have without your having asked for exactly that.

## Drawing the network

- 146.02| Junction, reservoir, tank, pipe, pump, valve and text, placed by clicking the map.
- 345| ID prefixes you choose, with Apply to all for when you change your mind.
- 353, 420, 389| Find elements by any property, jump straight to one by ID, and set a property across everything the search found.
- 540| Or write the search out yourself, with AND, OR and brackets, in the words of your own language.

## Over time

- 248.01, 423, 410| Extended-period simulation: tanks fill and drain, demands follow their patterns, and a transport bar plays the run or steps to any moment in it.
- 248.02| Patterns on a reservoir head and on a pump's speed, beside the demand patterns.
- 248.03, 460| Rule-based controls in EPANET's own words, read, written and edited beside the patterns and curves a run needs, with every level, pressure and flow in a rule put into the units your project is showing.
- 450| A run reports its progress as it goes and hands you the engine's own report of it at the end.
- 448| Color limits hold still across a run, so a color means the same thing at every step.

## What else it will tell you

- 530| Fire flow for the whole system in one press: every junction tested against the flow your code requires, what it can actually deliver at the residual you set, and what drawing that flow does to everything around it.
- 566| Water quality over a run: how old the water reaching a point is, how much of it came from a source you name, and how a chemical residual decays as it travels, with the reaction coefficients yours to state rather than ours to guess.
- 566.01| What the pumps cost: how long each one ran, the power it drew, the energy it used and the money that came to, including the demand charge on the highest power drawn at any one moment.
- 409, 433, 506, 510| Profiles: click along the map to choose the path, see ground, hydraulic grade and the pressure between them, and save the path with the project under a name you give it.

## Reading the answers

- 434, 455| A table for each kind of part: junctions, reservoirs, tanks, pipes, pumps and valves.
- 384, 327| Color the map by any value, from one control: three to seven classes, eight ways of choosing where the breaks fall, and 41 color ramps.
- 397, 398, 399, 469, 146.01, 383| Labels place themselves, keep a leader back to what they name if you drag them elsewhere, and where there is no room shed values in the order you chose instead of disappearing whole.
- 329, 333, 336| Pipe labels lie along their pipe the way a map draws a street name, with prefixes, suffixes and a separator you choose.
- 337, 342, 376| A Text object takes several lines, bold, and a rotation that can match a pipe, and all lettering is haloed so it stays readable over the drawing underneath.
- 331, 362| Text, symbols and pipes are three independent screen sizes, so a drawing reads the same at every zoom.

## Scenarios

- 201, 407, 412, 512| Change a few properties without disturbing the network they belong to, switch between those scenarios, and see at a glance which elements carry an override.

## Where your work lives

- 246| A project is a `.lwn` file: JSON inside, on your own disk, readable without us.
- 146.08, 447, 352, 360| As many projects as you like, each open in its own tab and saved in your own browser as you work, with the File menu remembering the recent ones and each reopening where you were looking.
- 281| Writes EPANET `.inp` files back out, and every value you did not edit comes back exactly as it went in, character for character.
- 2, 4, 37| Open it once with a connection and it keeps working with none, and it installs on a desktop or a phone as an app of its own, icon and all.
- 486| And although you of course prefer working on your PC, it works also on a phone in tall mode.

## The calculators

- 13, 52, 65| Manning pipe flow solves in both directions, the flow from a depth and the depth from a flow, and every pipe and channel page says when the velocity it just computed is too fast or too slow.
- 6, 12, 16, 30| Orifice flow, the time a tank takes to drain through one, micro-hydropower from gross head and penstock losses to the power a small site can deliver, and rock chute sizing by the Robinson method.
- 29, 38| Canal seepage and conveyance efficiency, including whether lining the canal pays for itself.
- 11, 31| Sketches drawn to scale from your own numbers, and a tip on every input saying what the number is.
- 39, 80, 228| Name a calculation and copy a link to it; the link carries your inputs, and nothing is shared unless you share it.
- 422, 425| Changing an input unit asks first, and says plainly that it reinterprets the numbers you typed rather than converting them.

## Language, license, and privacy

- 7, 15, 22, 34| Twenty-seven languages, and every word is evaluated for translation: the network model and the two Manning calculators go into all of them, the rest of the suite into Spanish, Portuguese, French, and Turkish, and every calculator is findable by name in every language while it waits its turn.
- 244| Free software under the GNU GPL, source in the open.
- 286, 288| No account, no visitor identifier, and nothing counted about you unless you say yes.
