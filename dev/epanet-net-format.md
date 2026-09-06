# EPANET's `.net` project file: what it holds, and what it does not

Record of the 2026-09-06 pass that closed the last of Task 574's unnamed option slots and answered
Tom's profile question. The reader itself is `js/lpn-net.js`, with `dev/scripts/epanet_net_to_inp.php`
as its twin; both carry the reasoning at the point of use. This file holds the two things that do not
belong in either: the source that settled it, and the profile answer.

## 1. Profiles are not in the file, and there is no pointer to them

**Tom's hypothesis (2026-09-06): *"Profiles save to an external file with no pointer, I think."*
Confirmed, and it is stronger than he put it.** A profile is not merely stored elsewhere: the project
file has no field for one, no filename, no count, and no trace of any sort.

The evidence is the writer itself. `Ufileio.pas` `SaveProject` is the whole of what a `.net` contains,
top to bottom, and it is short enough to read in one sitting: magic, version, ten component counts,
title, notes, the option array, patterns, curves, nodes, links, controls, rules, map labels, map
dimensions, backdrop, map display options, two colour arrays, seven calibration filenames, the ID
prefixes and defaults, the legend intervals, the page layout, and `-1`. The word *profile* does not
appear anywhere in that unit.

Where a profile does live: the Graph Selection dialog (`Dgraph.pas`) keeps the node list in a listbox
on the form. Its Save button asks for an identifier, prepends it as line 1, and writes the listbox to
a **`.PRO`** file — a plain text list, one ID per line — through an ordinary save dialog. Nothing
records the path. The listbox is discarded when the dialog closes. `Uinifile.pas`, which holds the
per-user preferences that survive between sessions, mentions profiles nowhere either, so not even a
most-recently-used entry exists.

**What establishes an ABSENCE here, since that was the question.** Three things together, and no one
of them alone: (a) the writer procedure is complete and accounted for, (b) our own reader walks the
same stream to the end-of-data marker and every token it produces has a home — the last nine tokens
of Tom's `Net3-mysteries.net` are `'EPANET Example Network 3'`, `2`, `true`, `'EPANET 2.2'`, `0`,
`true`, `6`, `true`, `0`, `-1`, which is exactly `SaveProject`'s page header, footer, page numbers,
`TitleAsHeader`, `Orientation` and the marker; and (c) an `.inp` has no profile section either, so
there is nothing to lose in the conversion this page performs.

**Consequence for this page: there is nothing to import, and no defect to fix.** A user who wants a
profile they built in EPANET has to be given the `.PRO` file, and reading one is a separate feature
against a separate format — nine bytes of it are a label and the rest are node IDs.

## 2. The option array is named in full

Task 574 measured 36 of the 45 slots from real files, correctly, and stalled on 16, 17, 39 and 40
because EPANET's own `.inp` export of those files states nothing to match them against. That was the
right call and the reason is now visible: EPANET writes 39 and 40 only when they are positive, never
writes 16 at all, and writes 17 twice under two different keywords.

**The source is EPA's own, and it is public**: `Uglobals.pas` declares every index by name and
`Uexport.pas` shows what each becomes in an `.inp`.

- USEPA/EPANET-legacy-user-interface (mirror: OpenWaterAnalytics/epanet-gui), `epanet2w/`.

| Slot | EPA constant | `.inp` keyword | Note |
|---|---|---|---|
| 16 | `MAX_SEGS_INDEX` | *none* | Max. pipe segments, quality solver. Declared and otherwise unused; `Uexport.pas` never writes it. Empty in every file seen. **Named, still reported as uncarried if populated.** |
| 17 | `BULK_ORDER_INDEX` | `Order Bulk` **and** `Order Tank` | One index, written twice on consecutive lines. No model can ever separate the pair. |
| 39 | `HEAD_ERROR_INDEX` | `HEADERROR` | Written only when it parses positive. `0` in every reference model, hence no line and nothing to match. |
| 40 | `FLOW_CHANGE_INDEX` | `FLOWCHANGE` | Same guard. |
| 45 | `EMITTER_BACK_INDEX` | `Emitter Backflow` | Past the end of every file in the corpus, which stop at 44. The count is read from the file, so a longer array is handled; slot 45 is reported as uncarried. |

Every name Task 574 measured agrees with this declaration, index for index. That agreement is what
makes it safe to take the four the measurement could not reach — the source is not a second opinion
here, it is the same witness that wrote the files.

**Slot 6, `UNBALANCED_INDEX`, and its missing `10`.** The old comment noted that the slot holds
`Continue` alone while EPANET writes `Unbalanced Continue 10`. `Uexport.pas` hard-codes the `10`. It
is not stored, and nothing was lost.

## 3. What the rest of the file is, past the option array

Read out of `SaveProject`, and confirmed against `Net3-mysteries.net`, in which Tom typed a
distinguishable string into every field of two EPANET dialogs so the slots would identify themselves.
Nothing below is read by this page; it is written down so nobody has to walk the stream twice.

- **Seven calibration filenames**, `NodeCalibData[DEMAND..NODEQUAL]` then `LinkCalibData[FLOW..HEADLOSS]`:
  demand, head, pressure, quality, flow, velocity, headloss. Tom's file names the first six
  (`haws-demand-calibration-file-name` and so on, in that order) and leaves headloss empty — which is
  the dialog's own row order, measured.
- **`IDIncrement`, then a ten-entry `IDPrefix` array** indexed by EPANET's object-type constant:
  junction, reservoir, tank, pipe, pump, valve, **label**, pattern, curve, **control**. Tom's file
  reads `Haws-J, Haws-R, Haws-T, Haws-L, Haws-P, Haws-V, '', Haws-P, Haws-C, ''` — the two gaps are
  labels and controls, which have no ID prefix in the dialog, and the array is indexed rather than
  packed.
- **Six default-property arrays of 45**, junction through valve. The pipe one reads
  `1000, 12, 100, 0, Open`; the valve one `12, PRV, 0, 0, None`.
- **Legend intervals**: 7 node views then 10 link views, 4 breakpoints each, 68 floats.
- **Page layout**: four margins, header text and alignment and enabled, the same three for the
  footer, page numbers, `TitleAsHeader`, orientation, then `-1`.

## 4. One difference from EPANET that is deliberate and one that is not

**Deliberate:** we write `Order Bulk` and `Order Tank` from slot 17 because EPANET does, and the
harness's standard is EPANET's own export of the same `.net`.

**Not yet resolved, and out of this pass's scope:** EPANET writes the demand-model quartet only when
the model is PDA; this reader writes `Demand Model DDA` and the three pressure values whenever the
slots are populated. Harmless — DDA is EPANET's default and the values are the ones the file states —
but it is a difference, and `Net3-mysteries.inp` is the file that shows it, EPANET having written no
`[OPTIONS] Demand Model` line at all.
