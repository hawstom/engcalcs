# The vocabulary change: coordinate system, georeferenced, convert (Task 641 / 646)

Tom's instruction, 2026-09-16, and the review he asked for. **This is a plan and a set of
recommendations, not a record of work done** -- nothing below is built.

---

## 1. The words

His ruling, verbatim in shape:

| Question | The two answers |
|---|---|
| Is the drawing tied to the Earth? | **Georeferenced** / **Local or Arbitrary** |
| If it is tied, how? | **EPSG Coordinate System** / **Georeferenced Local Coordinate System** |

And the two rewrites that follow from it:

- **"Projection" and "geographic projection" are retired from visitor-facing English.** They become
  *coordinate system*, *EPSG coordinate system*, *coordinate reference system*, or *CRS*. The word
  survives in code comments and in `dev/*.md` where it names the mathematics, which is what it
  really means.
- **"Georeferencing" now means ATTACHING THE WORLD MAP, not converting coordinates.** That is the
  change with teeth: today `georefStart()` is the wizard that *converts* an xy drawing into a
  lat/lon one, so the one word currently names the thing it is about to stop naming.

**THE ONE AMBIGUITY TO SETTLE BEFORE ANY STRING IS WRITTEN.** Under the new terms a project with a
custom map attachment is *georeferenced*, and so is a project stating an EPSG code. The status strip
says `Not georeferenced` today when `project.crs` is empty -- which will be wrong for a locally
georeferenced project the moment Task 646 ships, and right for every other. **Either the strip names
the two states separately (`Local`, `Georeferenced (custom)`, `EPSG:26912 ...`), or `georeferenced`
in the strip means "has an EPSG code" and contradicts the menu.** Recommendation: three states in
the strip, because the user can reach all three and the difference decides whether a length is
trustworthy.

## 2. What it costs, and why the answer is "now"

**17 shipped English strings carry the word, and NOT ONE OF THEM IS TRANSLATED INTO ANY LANGUAGE.**
Measured 2026-09-16 across `lib/lang.ec.*.php`: `lpn_new_crs`, `lpn_crs_list`, `lpn_crs_count`,
`lpn_new_coordsys_geo`, `lpn_georef_projected`, `lpn_crs_none` and the rest of that block exist in
English only.

So the terminology change is **free today and costs 26 retranslations a string the day after a
sprint touches them**. That is the whole argument for doing it before anything else on this branch,
and it is the same economics `dev/translation-process.md` records from sprint 459: his reading is
the critical path, and a sprint run ahead of his ruling is paid work thrown away.

**The wording is already in production.** `ce626311` (2026-09-13) put the coordinate-system box on
master and Tom's last pull (`e1c0794f`) carries it, so "Map projection" is on screen for visitors
now. Nothing about that is urgent -- it is not wrong, only about to be superseded.

## 3. The keys: rename, reword, or make new

**THE RULE THIS PROJECT ALREADY WROTE FOR EXACTLY THIS CASE**, in `lib/lang.ec.en.php` above the
new-project box, when the three-radio version was replaced by two: *"New keys rather than reworded
ones on purpose: those six are translated into 26 languages, and a repointed key would show 26
confident translations of the OLD question, where an absent key shows English, which is the correct
untranslated state."*

That gives three clean cases, and Tom's pasted block contains all three:

| Case | What to do | Cost |
|---|---|---|
| The English does not change; only the key name does | `php dev/scripts/rename_lang_key.php old new --apply` -- all 27 files, `$ec_lang_syn`, every call site, the drift manifest, the exempt list and the coverage declaration in one pass | free, and the translations travel |
| The English changes materially (the sentence now says something else) | **a NEW key**; let the old one die | 1 new English string, 26 absent = English shown, which is correct |
| The string describes a behaviour we are removing | delete the key with the code | retires 27 strings |

**A HAND RENAME IS ~40 EDITS AND EVERY MISS FAILS SILENTLY.** Never do one.

### 3a. The prefix to use, and why `lpn_transform_*` is the wrong one

Tom's block renames the whole placement wizard `lpn_georef_*` to `lpn_transform_*`. **Recommend
against it, on his own terms.** *Transform* is a third word for a thing that now has a name:

- the wizard that CONVERTS coordinates onto a new system is **`lpn_convert_*`** -- it is what the
  File menu will call *Convert coordinates as…*;
- the wizard that ATTACHES THE WORLD MAP and changes no number is **`lpn_georef_*`**, which is what
  *georeference* now means and what Task 646 builds.

So the existing `lpn_georef_*` family should not be renamed to `lpn_transform_*`; it should be
**split**: the strings that survive as conversion strings move to `lpn_convert_*`, and the name
`lpn_georef_*` is left free for the feature that earns it. A reader of the code then finds the same
two words the user reads.

### 3b. His pasted block, key by key

Compared against `lib/lang.ec.en.php` on master, 2026-09-16, by string equality rather than by
reading -- **23 of his keys are byte-identical to the shipped English and are therefore pure
renames**; the rest are listed one by one below.

| His key | Shipped as | Verdict |
|---|---|---|
| `lpn_transform_intro`, `_adjust`, `_step1`, `_step2`, `_step1_hint`, `_detach`, `_size_prompt`, `_drop`, `_finish`, `_cancel`, `_scale`, `_scale_tip`, `_backdrop_unrotated`, `_empty`, `_unavailable`, `_goto`, `_twopt`, `_twopt_tip`, `_twopt_pick1`, `_twopt_pick2`, `_twopt_same`, `_twopt_done` | `lpn_georef_*`, same text | **Pure rename** to `lpn_convert_*`. Free, and the 26 translations travel. |
| `lpn_transform_rotation` | `Turn anticlockwise (degrees)` | **Reword, and he is right on the merits**: APA 7th is this project's reference and Merriam-Webster spells it *counterclockwise*. The tip below it already says counterclockwise, so the two disagree today. |
| `lpn_transform_rotation_tip` | `...to align with the world map.` | New key: his *"to align with the new coordinate system"* is the conversion wizard's sentence, not the map-attachment one. |
| `lpn_transform_confirm` | `...the drawing stops being an xy project. To get xy back, close this project without saving.` | New key. His version describes the copy-to-a-new-tab model and is the better sentence. |
| `lpn_transform_done` | `This is a lat/lon project now.` | New key -- the destination is no longer always lat/lon. |
| `lpn_transform_tab_locked`, `_save_locked` | `Finish the placement with...` | New keys (*placement* → *conversion*). Small change, real meaning change. |
| `lpn_transform_georefed` + `_btn` + `_tip` | `lpn_georef_asdegrees` / `_asdeg_btn` / `_asdeg_tip` | **He marks the button and tip obsolete and he is right**, for a reason worth keeping: the old button asked the user to judge whether their x and y were really a longitude and a latitude. If the conversion wizard can READ an existing coordinate system there is nothing to ask. Delete both; keep one sentence of the `_georefed` shape as a *state*, not a button. |
| `lpn_transform_projected` | `This project already states a map projection, so its coordinates cannot be placed on the map a second time.` | **Obsolete, as he says, and it is the sentence this whole branch exists to falsify.** A georeferenced project is EASIER to convert, not forbidden. Delete with the refusal. |
| `lpn_transform_on_map` | `This project is already on lat/lon.` | Keep as a rename; still true. |
| `lpn_file_import_geo` | `Open xy file on map…` | Rename + reword to *Convert coordinates as…*. **Task 641's own note says the rename was deliberately NOT made, because it would advertise a door that does not exist yet.** It exists once the target-system selector does; not before. |
| `lpn_new_coords` (`'Coordinates'`) | defined, rendered by nothing | **Dead, as he suspects.** `key_hygiene_check.php` does not list it because the new-project radio group is `name="lpn_new_coords"` in the HTML, which the reference count reads as a use. A false negative worth knowing about. Five more from the retired three-radio box are dead beside it: `_tip`, `_xy`, `_geo`, `lpn_new_place`, `lpn_new_place_tip`. |
| `lpn_geomap` (`'lat/lon'`), `lpn_xymap` (`'xy'`) | rendered by nothing, **on purpose** | **NOT dead, and they are the lever for this whole change.** `mode_name_check.php` holds every other string's prose to whatever a language calls the mode in these two keys -- 26 languages, 4 derived strings. Changing their values to `georeferenced` and `local` is how the vocabulary changes consistently instead of one string at a time, and the check then refuses any string that goes on saying `xy`. It also means 26 languages need the two new words: the one real translation cost in this whole plan. |
| `lpn_crs_place_projected` | `A projected project opens on its own plane... which this page does not have yet.` | **Obsolete WHEN the transform lands, and true until then.** It is an honest statement of a real gap, so it goes out with the code that closes it -- not before. |
| `lpn_crs_*` block (`view`, `place`, `name`, `list`, `count`, `noview`, `choose`) | untranslated | Reword in place. No new keys needed: nothing to strand. |

**The `lpn_goto_*` four in his block are the shipped English unchanged** and need nothing.

**TWO MECHANICAL CONSTRAINTS ON ANY NEW STRING WRITTEN HERE.** (a) `em_dash_ratchet_check.php` is a
ratchet at 69 in shipped English: a RENAMED key carries its dash along and changes nothing, but a
NEW key carrying one fails the build. `Step 1 of 2 — quick` is therefore free as a rename and would
be refused as a new string, so a new one spells it `Step 1 of 2: quick`. (b) `lpn_new_coordsys_tip`
and `lpn_new_crs_tip` both quote the File menu row by name, so they change in the same edit the menu
row does, or the interface quotes a command that is not there.

**One correction to his draft text.** `lpn_transform_projected` as he rewrote it reads *"so it s
coordinates"* -- a missing apostrophe. If that sentence survives at all it wants `its`.

## 4. The four features, against what exists

1. **Custom georeferencing that does not convert.** This is **ROADMAP Task 646, already open at
   priority 100**, in his own words from 2026-09-13. What is new in his 2026-09-16 statement is the
   wizard's shape: zoom to the site, then **rotate and scale the MAP behind the network**, then pin.
   - The thing that does not exist yet is the stored object. A background image today is
     `{href, x, y, width, height, tx, ty, s}` -- a translation and a uniform scale, **no rotation**
     (`lpn_georef_backdrop_unrotated` is that gap admitting itself). A custom georeference needs
     translation, scale AND rotation, so it is a new field on the project, and the `.inp` exporter
     must skip it exactly as it skips `basemap`.
   - **It preserves the inputs, which is why it is the safe door.** Nothing is converted; the
     drawing's own numbers never move.
   - **On his "absurdity of zooming away": nothing needs to be refused.** A custom georeference is
     a similarity transform -- a rotation and one scale -- and Web Mercator's own scale runs as
     `sec(latitude)`, so the fit is exact at the pin and drifts with distance from it: about 0.01%
     across 1 km, 0.1% across 10 km, 1.0% across 100 km at latitude 33.5 (the table in
     `dev/map-projection-decision.md`). The COORDINATES stay exactly as typed however far he zooms;
     what degrades is the map's alignment under them. **So the honest instrument is a stated
     validity, not a refusal** -- and refusing to show a coordinate the user typed would break this
     suite's own first rule about the user's numbers.
2. **A new project chooses an EPSG system or stays unreferenced.** This is what the box does today
   (Task 641 phase 1, shipped 2026-09-13): two radios, *Geographic projection* and *Local,
   schematic, or custom*. **The work here is vocabulary, not behaviour**, plus the second radio's
   promise -- the branch's own wording already says *"or georeference later"*, which is a promise
   Task 646 has to keep.
3. **File, Convert coordinates as…** -- copy to a new tab and run the existing wizard.
   - The target-system selector at the front is new, and it is the piece that turns the existing
     wizard into this feature.
   - **The unattended precise conversion between two EPSG systems needs proj4js, which is not
     vendored.** Task 641's ruling P3 settles that it will be; nothing on the projected path has a
     transform today, which is exactly why `lpn_crs_place_projected` says so out loud.
   - Starting an unreferenced project at whole-world view and letting Place search and Go to find
     the site is what the wizard already does.
4. **Convergence angles: confirmed, and already ruled on.** Every projected system has a grid
   convergence -- the angle between its grid north and true north -- and it is not small: **0.496
   degrees at 100 km from a central meridian at latitude 33.5**. His own ruling P5 of 2026-09-13
   says to draw in the coordinate system and fit the tiles to it, using the view centre's scale
   factor and convergence angle. **The one correction already on file is to pin per TILE rather than
   per view**: a single centre pin is off 0.03 m across 1 km and 2,338 m across the 300 km mission
   scope. It is NOT built, and it was not smuggled in with the half-merged part -- **no transform
   exists on the projected path at all**, so there is nothing yet for a convergence angle to rotate.

## 5. Recommended order

1. **The vocabulary, while it is free** -- the `lpn_crs_*` and `lpn_new_coordsys_*` block, in place,
   plus `lpn_geomap` / `lpn_xymap` and the 26 translations of those two words.
2. **The dead keys**, on his word: the six from the retired three-radio box.
3. **Task 646, the custom georeference wizard**, which is the feature the new vocabulary is for and
   the one that needs no proj4js.
4. **proj4js, then Convert coordinates as…**, then the per-tile fit and the convergence rotation.

**Steps 1 and 2 are string and documentation work; step 3 is a feature and needs his all-clear and a
lifted freeze to reach master.**
