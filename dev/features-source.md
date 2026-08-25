# Features source — the hand-written half of the features list

**This file is EDITED BY HAND. `dev/features.md` is generated from it** by
`php dev/scripts/generate_features.php`, which also proves every ID cited here is a task the closed
ledger actually holds.

## Why this file exists at all

A closed-ledger line is written for a developer re-resolving a `Task N` citation: it names files,
functions, measured deltas and the alternative that was rejected. A features list is read by
somebody deciding whether to open the page. Those are different sentences about the same event, and
no script turns the first into the second. So the ledger supplies the PROOF that something shipped,
and this file supplies the WORDS.

## How to edit

One line per feature, under a `##` area heading:

```
- <ids>| <one sentence, present tense, written for a reader who has never seen the page>
```

`<ids>` is one or more closed task IDs, comma-separated. Every one must exist in
`dev/roadmap-closed-ids.md` at priority 0, and no ID may be cited by two features — the generator
fails on either. Adding a feature is one line; retiring one is deleting that line.

House rules that apply to the sentences here exactly as they apply anywhere else, because these are
public claims: `dev/positioning.md` is the authority, "a phone" and never "your phone", no
completeness claim against EPANET, our own element vocabulary (a **Text** object is EPANET's Label),
and never the words "PC application".

**The prose below is a first pass and awaits Tom's edit.** It was drafted so the generator would
have something to generate; the wording is his call, not ours.

---

## The calculators

- 13| Manning pipe flow solves in both directions — the flow from a depth, and the depth from a flow.
- 52, 65| Every pipe and channel page checks the velocity it just computed and says when it is too fast or too slow.
- 6, 12| Orifice flow, and the time a tank takes to drain through one.
- 16| Micro-hydropower, from gross head and penstock losses to the power a small site can actually deliver.
- 29, 38| Canal seepage and conveyance efficiency, including whether lining the canal pays for itself.
- 30| Rock chute sizing by the Robinson method.
- 11| Sketches drawn to scale from your own numbers, so you can see the section you just described.
- 31| A tip on every input saying what the number is, in the language of the page.
- 79| One button returns a page to a worked example that passes, so nothing is ever a blank form.
- 39, 80, 228| Name a calculation and copy a link to it; the link carries your inputs, and nothing is shared unless you share it.
- 422, 425| Changing an input unit asks first, and says plainly that it reinterprets the numbers you typed rather than converting them.

## Drawing a water network

- 146.02| A drawing toolbar — junction, reservoir, tank, pipe, pump, valve and text — placed by clicking the map.
- 146.08, 447| Many named projects, saved in your own browser, each open in its own tab.
- 344| The property box is a window you can drag out of your way, not a panel that owns an edge of the screen.
- 345| ID prefixes you choose, with Apply to all for when you change your mind.
- 353, 420, 389| Find elements by any property, jump straight to one by ID, and set a property across everything the search found.
- 352, 360| The File menu remembers your recent projects, and the map remembers where you were looking.
- 253| One toggle clears the readouts off the map when you want the drawing and nothing else.
- 250| A Help menu on the page itself.
- 486| And although you of course prefer working on your PC, it works also on a phone in tall mode.

## Solving it

- 146| A looped network solved by the global gradient method, in the page, with no install and no upload.
- 451| Or solved by the EPANET 2.3 engine itself, compiled into the page and named by version where you can see it.
- 419| Standard gravity throughout, and where the two engines disagree the page tells you by how much.
- 467| Answers follow your edits as you make them, and that is a project setting you can turn off.

## Time

- 248.01, 423, 410| Extended-period simulation: tanks fill and drain, demands follow their patterns, and the transport controls scrub the run.
- 248.02| Patterns on a reservoir head and on a pump's speed, beside the demand patterns.
- 460| A Libraries box holding the patterns and curves a run needs.
- 450| Run shows real progress, a completion report, and the engine's own report of the run.
- 448| Colour limits hold still across a run, so a colour means the same thing at every step.

## Files, and EPANET

- 196| Opens EPANET `.inp` files, takes the part it supports, and reports every difference instead of dropping it quietly.
- 483| An import note is filed on the element it concerns, and you read it in that element's own property box.
- 281| Writes `.inp` files back out. Every value you did not edit comes back exactly as it went in, character for character.
- 246| Projects are `.lwn` files — JSON inside, on your own disk, readable without us.
- 314, 257, 454| An examples library that opens Net1, Net2, Net3, Elm Street Center and a Net3 placed on the world, in one click.

## The map, and the world

- 145| A geographic project is drawn in latitude and longitude over a street map or satellite imagery, with the same drawing tools.
- 476| An existing x/y network can be placed on the world — moved, scaled and rotated onto its real ground.
- 437| Type a place name and the map goes there, if you turn that on.
- 497| Ground elevations read from terrain data and typed into the document, never replacing a number without first showing you the one it would replace.

## Labels and lettering

- 397, 398, 399, 469| Labels place themselves. Where there is no room, a label sheds values in the order you chose instead of disappearing whole.
- 146.01, 383| Any label can be dragged where you want it, and it keeps a leader back to what it names.
- 329| Pipe labels lie along their pipe, the way a map draws a street name.
- 333, 336| Prefixes, suffixes and a separator you choose, with a link's values on one line.
- 337, 342| A Text object takes several lines, bold, and a rotation that can match a pipe.
- 376| Lettering is haloed, so it stays readable over the drawing underneath it.
- 331, 362| Text, symbols and pipes are three independent screen sizes, so a drawing reads the same at every zoom.

## Reading the results

- 434, 455| A table for each kind of part in the bottom pane — junctions, reservoirs, tanks, pipes, pumps and valves.
- 384, 327| Colour the map by any value, from one control: three to seven classes, eight ways of choosing where the breaks fall, and 41 colour ramps.
- 409, 433, 506| Profiles. Click along the map to choose the path, and see ground, hydraulic grade and the pressure between them.

## Scenarios

- 201, 407, 412, 512| Change a few properties without disturbing the network they belong to, switch between those scenarios, and see at a glance which elements carry an override.

## Language, licence and privacy

- 7, 15, 22, 34| Twenty-seven languages, across the whole suite and not only its menus.
- 244| Free software under the GNU GPL, source in the open.
- 2, 4, 37| Installable, and it keeps working with no network once installed.
- 286, 288| No account, no visitor identifier, and nothing counted about you unless you say yes.
