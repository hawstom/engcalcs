# The examples, audited against their own `.inp` files

Tom, 2026-09-06: *"Examples update: Do we need to update the examples now that we handle all this
EPANET functionality? I guess we should audit the examples to ensure that nothing in the original
.inp files is missing."*

Answer: **one thing was, and it was in the newest feature.** The three EPA models and the geographic
one were losing every pump curve's NAME and every one of EPA's own number tokens. Nothing else the
source files state is missing. This file records the method, the table, and what is now held by a
check.

---

## Why this could go wrong at all

**A gallery example is a stored project, not a re-import.** It does not gain a feature the day the
importer does. Every task that teaches this page to interpret a section it used to merely carry
leaves the seven stored copies behind, and the symptom is invisible from inside: the file opens, the
drawing is right, the round trip passes, and the information is simply not there.

That has now happened three times. `[OPTIONS] Quality` (Task 553), then `[QUALITY]`/`[REACTIONS]`/
`[ENERGY]` (566), each caught by a person. **This audit is the third, and it was the curve library
(Task 586).**

`applySaved()` closes most of the gap by itself and deliberately: it carries a **once-only read** for
`[QUALITY]`, `[REACTIONS]`, `[ENERGY]`, `[SOURCES]`, `[MIXING]` and `[TAGS]`, each behind its own
guard, so a project saved before any of those were interpreted gains them **on open rather than
never**. `mintCurveLibrary()` is the same idea for curves. That is why most of what looked stale in
the stored files turned out to cost the visitor nothing — and it is exactly why the one real loss
was hard to see, because the migration ran, produced a curve, and produced it from numbers.

---

## Method — what was measured, not assumed

1. **The source files are the same networks EPA ships.** `dev/water-network-examples/Net{1,2,3}.inp`
   and `dev/lpn-spike/reference/Net{1,2,3}.inp` are byte-identical apart from CRLF and a final
   newline. Checked, not assumed.
2. **Every section each source states was enumerated** and each one classified by READING
   `js/lpn-inp.js` — `INP_SECTIONS_READ` for what is taken apart, `LPN_CARRIED_PLACED` for what is
   kept verbatim, and the once-only reads in `applySaved()` for what a stored project gains on open.
3. **The measuring instrument is the importer, not a list.** For each shipped example with a source
   `.inp`: open the shipped file the way the gallery does (`migrateSaved()` then `applySaved()`),
   serialize it, and compare the whole document against a **fresh import of that same `.inp`**.
   Anything the importer knows how to read today, the stored copy must already say.
4. **And the characters.** Export each shipped example and compare its `[CURVES]`, `[PATTERNS]`,
   `[ENERGY]`, `[QUALITY]`, `[REACTIONS]`, `[SOURCES]`, `[MIXING]` and `[REPORT]` **token sequences**
   against the source's own. Column padding is the exporter's; tokens are the file's.

---

## The table

| Source | Sections it states (with content) | What the shipped example carries | Gap |
|---|---|---|---|
| `Net1.inp` → `Net1.lwn` | TITLE, JUNCTIONS, RESERVOIRS, TANKS, PIPES, PATTERNS, CURVES, CONTROLS, ENERGY, QUALITY, REACTIONS×2, TIMES, REPORT, OPTIONS, COORDINATES, VERTICES, LABELS, BACKDROP | the drawing; `settings.quality/reactions/energy/hydraulics/qualityOptions`; 11 initial qualities; `[ENERGY] [QUALITY] [REACTIONS] [REPORT]` verbatim | **the pump curve's name and `src` text.** FIXED |
| `Net2.inp` → `Net2.lwn` | as above plus SOURCES (a real fluoride dose at node 1), PATTERNS×36 | all of it; the dose is recovered onto node 1 by `applySaved()`'s once-only `[SOURCES]` read | none |
| `Net3.inp` → `Net3.lwn` | as Net1 plus STATUS, two pump curves | all of it | **both pump curves' names, and EPA's `104.` / `2000.` tokens rewritten as `104` / `2000`.** FIXED |
| `Net3.inp` → `Net3-Novato-CA-World.lwn` | same source; the geographic placement is the curation | as Net3 | the two curves as above, **plus the `Quality Timestep 0:05` its source states.** BOTH FIXED |
| `Basic-example-SI-units.lwn` | — | authored in metres on this page | no source to be behind |
| `Basic-example-US-units.lwn` | — | authored, the teaching starter | no source to be behind |
| `Elm-Street-Center.lwn` | — | Tom's own design snapshot with a CAD backdrop | no source to be behind |

`[TAGS]`, `[MIXING]` and (in Net1 and Net3) `[SOURCES]` are stated as a bare header in all three EPA
files. There is nothing in them to lose, and a file that states nothing must not be told it did.

**Task 587's tank volume curve has nothing to lose here either, and that was checked rather than
assumed:** the `VolCurve` column is empty on every tank in all three files (Net1's tank 2, Net2's 26,
Net3's 1, 2 and 3), so all five are cylinders and the run is unaffected. The first `.inp` that states
one will be compared like anything else — the harness reads the whole node, not a named list of
fields.

---

## The one real loss, in full

`examples/Net3.lwn` exported this:

```
[CURVES]
;PUMP:
 1	0	104
 1	2000	92
```

EPA's own file, and a fresh import of it today, say this:

```
[CURVES]
;PUMP: Pump Curve for Pump 10 (Lake Source)
 1               	0           	104.
 1               	2000.       	92.
```

Two rules broken at once. **The `;PUMP:` comment is how EPANET TYPES a curve** and it carries the
curve's NAME — the one thing the Library shows a person, so the gallery's Net3 opened on two unnamed
curves. And `104.` came back as `104`: CLAUDE.md's *preserve the TOKEN, not the value*, in the one
place a stored project could still break it.

**The cause is chronology and nothing else.** The stored copies hold the pre-Task-586 shape
(`curvePoints` on the pump), `mintCurveLibrary()` correctly builds a curve object out of it on open,
and there is no text in a list of numbers to build `src`, `note` or `tok` from. The migration is not
at fault; it recovered everything that was there to recover.

**Fixed by topping the three sources up in place** with the `curves` array a fresh import of their
own `.inp` produces — `src`, `note` and `tok` included — and regenerating `examples/`. The legacy
`curvePoints`/`curveRef`/`curveId` were left on the pumps: `mintCurveLibrary()` seeds from an
existing `curves` list, matches kind and points, reuses the curve already there, and deletes the old
homes at open. Surgical, per the folder README, because Net2 and Net3 carry a backdrop an `.inp`
cannot hold and Net1 carries hand-placed label offsets — regenerating from the `.inp` would drop
both.

---

## The second failure the brief named, and why it did not apply

The other thing that could be wrong is an import REPORT over- or under-stating what happened.
**A gallery example produces no import report at all** — it is opened, not imported, so there is no
sentence for it to get wrong. The report is exercised where it is produced, against the source
files, by `section-carry-harness.js` §3 and §4: every stated section is still COUNTED as a
difference, no carried section is described as a loss, and every drop code has a sentence a person
can read rather than a bare code string. Both were re-run here and pass.

---

## What is NOT a defect, checked and left alone

- **Net3-Novato's four `demand-pattern` `importNotes`** (nodes 15, 35, 123, 203). A note is written
  into the document at import and KEPT after the feature that closed its gap ships;
  `LPN_INP_NOT_A_LOSS` in `js/lpn-inp.js` filters it at DISPLAY time instead, because the record is
  the document's and a later feature may make it a loss again. Working as designed.
- **The stored files' `settings.sources` / `mixing` / `tags` records are absent**, and `applySaved()`
  supplies them on open along with the values they guard. Stale in the file, correct on screen.
- **`Net1.lwn`'s stored `h0`/`a`/`b`.** The three-point fit is derived and stored nowhere now; these
  are read past and rebuilt.
- **Version drift** (`v` 6, 7 and 10 across the seven). `applySaved()` merges an older document onto
  current defaults. Re-saving one floats it to the current version and produces an unreadable diff on
  a 97-node file, so it is done deliberately or not at all.
- **Curation.** Which engine an example opens on, where the reader is looking, symbol and text size,
  colouring and legend limits, and Net1's label offsets all differ from a raw import on purpose. Each
  is declared by name in the harness with its reason.

---

## The check that would catch a recurrence

`dev/lpn-spike/examples-audit-harness.js` (in `run_harnesses.sh` by the glob, so it is in
`check_all.sh` already). 271 checks, in four sections:

1. **Every published example is declared** in `SOURCE_OF` — an `.inp` name, or `null` with the reason
   it has none. Read out of `examples/manifest.json`, so publishing an eighth example forces the
   line.
2. **The measurement.** Shipped-and-opened against fresh-imported, field by field, for every
   top-level key, every settings key, every node and every link. **The exemptions run the other way
   round from a list of things to check**: a field nobody here has heard of is compared by default,
   and each exemption is a line somebody had to write with a reason. That is the property
   `section-carry-harness.js` §6's named `INTERPRETED` list does not have, and is why 586 and 587
   walked past it.
3. **The declared roll call.** Every section a source `.inp` states is accounted for by name in one of
   four dispositions — `structure`, `interpreted`, `carried`, `header-only` — or the harness fails
   telling you to write the sentence.
4. **The characters.** Exported token sequences against the source's own, plus every `;PUMP:`-style
   curve comment.

Verified to fail on the real defect: emptying `curves` out of `examples/Net3.lwn` fails sections 2
and 4 by name, quoting `104.` against `104`.

**This does not replace `section-carry-harness.js` §6 and is not a duplicate of it.** That one asks
whether the CARRIED TEXT survives and whether a named set of interpreted fields matches; this one
asks whether the whole document does. Both are cheap.
