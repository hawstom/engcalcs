# Water network examples

Saved Looped-Network projects that are cleared for publication. These are the shelf the examples
gallery (ROADMAP Task 314) draws from, and they are ordinary documents of ours — not a special
format, not a template language. An example is a FILE, which is the whole architectural point of
Task 314: the two built-in examples are JS functions today (`drawExampleNetwork()`, ~290 lines),
and a function cannot carry a description, cannot be authored by anyone who is not editing
`js/looped-network.js`, and does not scale to a screen full of examples.

## What is here

| File | Nodes | Links | Units | Notes |
|------|------:|------:|-------|-------|
| `Net1.lwn` | 11 | 13 | gpm | EPANET's Net1: 9 junctions, 1 reservoir, 1 tank, 1 pump. Public domain, ships with EPANET. |
| `Net1-SI.lwn` | 11 | 13 | L/s | `Net1.lwn` converted to SI (below), rules included. |
| `Net2-Branford-CT.lwn` | 36 | 40 | gpm | EPANET's Net2 placed at Branford, Connecticut on EPSG:2234 (Tom's own saved project, 2026-10-12). No backdrop. |
| `Net3-Novato-CA-World.lwn` | 97 | 119 | gpm | EPANET's Net3 placed at Novato, California as a lat/lon project, world map behind it. No backdrop. |
| `Elm-Street-Center.lwn` | 18 | 19 | gpm | Tom's own design snapshot, anonymised, with a CAD site plan as its backdrop. The one example with a backdrop (Tom, 2026-10-12). |

**`Net1-SI.lwn`, `Net2-Branford-CT-SI.lwn` and `Net3-Novato-CA-World-SI.lwn` are unit conversions of the files above** (Task 786,
Tom 2026-10-11), made by `node dev/scripts/convert_example_to_si.js Net3-Novato-CA-World Net3-Novato-CA-World-SI "Net3-Novato-CA-World SI"`:
ft to m, in to mm, gpm to L/s, rounded as Tom set it on 2026-10-13: pipe diameters to the nearest 50 mm;
demands and curve flows to 0.001 L/s; reservoir heads, tank levels and diameters, control levels,
curve heads, pipe lengths and elevations to 0.001 m. Hazen-Williams
roughness, minor loss k, patterns, times and the quality sections are carried across unchanged. A unit
switch on the page reinterprets rather than converts, so an SI twin is a separate file. **The drawing
converts with it** where it is a length: Net2 is drawn in its CRS's feet, so its drawing converts at
0.3048, its origin shift at the US survey foot, and its CRS becomes the metre twin (EPSG:2234 to
EPSG:26956); Net1 is a plain local drawing in feet (no CRS, no origin), so its drawing converts at 0.3048 and its two `[RULES]` tank levels round like control depths; Net3 is a lat/lon project, whose degrees are no length, so its drawing and view are
carried untouched. `dev/lpn-spike/si-example-equivalence-harness.js` checks every rounded number against that rule
and that each pair behaves alike (tank levels within 1 m through the whole EPANET extended-period run) and that both twins place a node on the same spot of the
Earth. They carry no `.inp` of their own. The converter reads the SHIPPED US file.

**`Net2.lwn` and `Net3.lwn` are NOT examples any more.** They carry site plans (Tom, 2026-10-12: *"Remove all
the examples that have background images except Elm Street Center."*), so `examples.json` does not name
them and the generator does not publish them. They stay in this folder as the ft-grid test fixtures that
dozens of harnesses read, beside the `.inp` they came from.

## Two things to know before adding one

**The directory is default-deny.** `.gitignore` here is a whitelist: an unrecognised file is
ignored, and publishing one means adding a line for it. That is deliberate — this folder is also
where real client models get dropped to stress-test the `.inp` importer, and those carry client
names, real coordinates, base maps and fire-flow results. `Estrellas-*` and
`utility-map-estrellas.bmp` are sitting here right now and are ignored for exactly that reason.
The whitelist line you add IS the publication decision, and it shows up in the diff where someone
can see it.

**The EPA three carry what their own `.inp` states, and are REFRESHED SURGICALLY.** `Net1`, `Net2`
and `Net3` are stored projects, so they do not gain a feature the day the importer does — they
carried no `Quality` option for as long as that carry existed, and the first person to notice was
Tom exporting one. They were topped up in place on 2026-08-29 with `settings.qualityOptions` and the
`inpSections` bag (`[ENERGY]`, `[QUALITY]`, `[SOURCES]`, `[REACTIONS]`, `[REPORT]` as each file
states them), and `dev/lpn-spike/section-carry-harness.js` §6 now asserts a shipped example against
its own source `.inp` so the gap cannot reopen quietly.

**Do NOT close that gap by regenerating from the `.inp`.** `Net2` and `Net3` carry a backdrop an
`.inp` cannot hold at all, and `Net1` carries hand-placed label offsets; an import would drop both.

**AND IT REOPENED, IN THE CURVE LIBRARY** (Tom, 2026-09-06, asking for exactly this audit;
`dev/examples-audit.md` is the record). A stored project holds the pre-Task-586 shape, so
`mintCurveLibrary()` rebuilt each pump curve out of `curvePoints` on open -- correctly, and out of
numbers, which is all a list of numbers can give. What went was the curve's NAME (EPANET's
`;PUMP: Pump Curve for Pump 10 (Lake Source)` comment, the one thing the Library shows a person) and
EPA's own tokens: `Net3` exported `104.` as `104`. `Net1`, `Net3` and `Net3-Novato-CA-World` were
topped up in place with the `curves` array a fresh import of their own `.inp` produces, and
`Net3-Novato-CA-World` gained the `Quality Timestep 0:05` its source states and the 2026-08-29 pass
had missed. The legacy `curvePoints`/`curveRef`/`curveId` stay on the pumps: the migration seeds from
an existing `curves` list, matches kind and points, reuses what is there, and deletes the old homes
at open.

**`dev/lpn-spike/examples-audit-harness.js` is what stops it reopening a fourth time.** It compares a
shipped example, OPENED, against a fresh import of its own source `.inp` -- whole document, field by
field, with the exemptions declared one line at a time rather than a list of fields to check. Adding
an example forces a line in its `SOURCE_OF`, an `.inp` name or `null` with the reason it has none.

**`settings.hydraulics` was the last piece and it is in now** — all four EPA files (`Net1`, `Net2`,
`Net3`, `Net3-Novato-CA-World`) state the eleven `[OPTIONS]` their own `.inp` states, added by hand
in place. It does change what the gallery COMPUTES, because these files say `Accuracy 0.001` and
this page's own default is `1e-9` (`solveAccuracy()`), so that was measured before it was done:
**worst head change 2.5e-7 m (Net3, node 231), worst relative flow change 0.00224% (Net3, link
285), and every example still converges.** Every one of those is below any decimal place the page
shows. `dev/lpn-spike/hydraulic-options-harness.js` §8 reads `examples/Net1.lwn` — the SHIPPED file,
not this folder — against `Net1.inp`'s own numbers, so the gap cannot reopen through a regeneration.

Note that the four still carry `settings.tolerance: 1e-9`, the deprecated key `Accuracy` replaced.
Left alone deliberately: `solveAccuracy()` reads it only as a fallback, so it changes nothing, and
rewriting a stored document to tidy a field is the thing this section exists to warn against.

**Version drift is expected and harmless.** `Net2` and `Net3` are `v: 4`; `Net1` and Elm Street
are `v: 6`. `applySaved()` merges an older document onto current defaults, so all four open
correctly. Re-saving one from the page will float it to the current version — fine, but do it
deliberately rather than as a drive-by, because the diff on a re-saved 97-node file is unreadable.

## THIS FOLDER IS THE SOURCE; `examples/` IS GENERATED — regenerate after every edit

```
php dev/scripts/generate_examples.php
```

**Editing a file here changes nothing that a visitor can see until you run that.** The served copy
under `examples/` is written by the generator, along with `examples/manifest.json` and a thumbnail
SVG per example. `sh dev/scripts/check_all.sh` fails with `STALE: <file>` when the two disagree,
which is the backstop — but the check only speaks when it is run, so run the generator as part of
the edit.

**Why the two folders are not merged** (Tom asked, 2026-08-15, having edited Elm Street twice and
seen the old copy both times — a fair question):

- **`dev/` is unreachable over HTTP at all.** `dev/.htaccess` is `Require all denied`. Serving the
  examples from here would need either a child `.htaccess` — the one class of change that can
  return 500 for *every* request under `/engcalcs/` if the host has not granted the directive (see
  CLAUDE.md's deploy section) — or a PHP endpoint that echoes files out of a folder that also holds
  client models. Neither is worth it to save a copy.
- **This folder holds things `examples/` must not**: the `.gitignore` whitelist that IS the
  publication decision, the original `.inp` files, `examples.json` (which lang key each card uses
  and where it sits on the wall), un-whitelisted client models, and this README.
- **`examples/` holds things this folder must not**: a generated `manifest.json` and a generated
  thumbnail per example. Both are derived, and a hand-kept index beside a folder of files drifts
  silently — which is the reason the generator exists at all.

So: keep both, edit here, regenerate. Deleting either side loses something that is not in the other.

## Filename convention

**`<Name>.lwn`** — the extension this page writes (ROADMAP Task 246), and every source here now
carries it. Each file also carries `format: 'hawsedc-lpn'` plus an `app` URL as its first two keys
(ROADMAP Task 315, ratified 2026-08-14). The marker is inside the document on purpose: a filename is
exactly the thing a person renames, so it was never the durable identifier — which is what let the
suffix shrink from 30 characters, to `-lpn.json`, to nothing at all beside the extension.
`dev/lpn-spike/file-naming-harness.js` pins both halves.

**Renamed 2026-08-27**, on Tom's word (*"Renaming all to lwn would be nice. I like that idea."*).
The six sources were `<Name>-lpn.json` until then — `Net3-lpn.json`, `Elm-Street-Center-lpn.json`
and so on — and any older note, screenshot row or commit naming one of those is naming the same
file. `Elm-Street-Center.lwn` is JSON inside, as every `.lwn` is; the extension names the
application, not the syntax. The generator publishes whatever name it finds
(`exampleIsProjectFile()` accepts both), so a `-lpn.json` source dropped in here still works —
nothing about the format changed, only what the six files are called.
