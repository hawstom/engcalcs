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
| `Net1.lwn` | 11 | 13 | gpm | EPANET's Net1. Public domain, ships with EPANET, every water engineer recognises it. |
| `Net2.lwn` | 36 | 40 | gpm | EPANET's Net2. |
| `Net3.lwn` | 97 | 119 | gpm | EPANET's Net3. The large-model case — this is the one that exercises label clutter and the sizing paradigm. |
| `Elm-Street-Center.lwn` | 18 | 19 | gpm | Tom's own design snapshot, anonymised, with a CAD site plan as its backdrop. The first example drawn from real work rather than invented. |

**All four are US/gpm.** The gap is an SI example and it CANNOT be made by converting one of these:
this suite reinterprets rather than converts when a unit changes (CLAUDE.md, "Unit Sets"), so
clicking SI on Net1 gives 8 mm mains, not 200 mm ones. An SI example has to be authored in metres,
or imported from an `.inp` declaring LPS/LPM/CMH/MLD — which `js/lpn-inp.js` already reads
correctly, and which is the cheap route if a public SI model turns up.

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
