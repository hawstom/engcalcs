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
| `Net1-lpn.json` | 11 | 13 | gpm | EPANET's Net1. Public domain, ships with EPANET, every water engineer recognises it. |
| `Net2-lpn.json` | 36 | 40 | gpm | EPANET's Net2. |
| `Net3-lpn.json` | 97 | 119 | gpm | EPANET's Net3. The large-model case — this is the one that exercises label clutter and the sizing paradigm. |
| `Elm-Street-Center-lpn.json` | 18 | 19 | gpm | Tom's own design snapshot, anonymised, with a CAD site plan as its backdrop. The first example drawn from real work rather than invented. |

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

`<Name>-lpn.json`, and each file carries `format: 'hawsedc-lpn'` plus an `app` URL as its first two
keys (ROADMAP Task 315, ratified 2026-08-14). The marker is inside the document on purpose: a
filename is exactly the thing a person renames, so it was never the durable identifier — which is
what let the suffix shrink from 30 characters to four. `dev/lpn-spike/file-naming-harness.js` pins
both halves.
