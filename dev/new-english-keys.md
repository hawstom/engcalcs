# English strings nobody has ruled on yet

**Generated — never hand-edited.** `php dev/scripts/new_english_keys.php --write`.
`check_all.sh` fails if this file has drifted from `lib/lang.ec.en.php`.

These are the keys that are in `lib/lang.ec.en.php` and in NONE of the other 26 language
files — which is, by construction, every string that has been written and not yet ruled on or
translated. **An absent key is the correct untranslated state**, so this is a worklist and never
a fault.

What to do with it: read the English, and say where it is wrong. A ruling is a sentence in
conversation, not an edit — the wording is Tom's and the editing is AI's. Once the wording is
settled these go into the next translation sprint as a batch.

**22 still to read**, of 22 untranslated keys, of 1559 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## lpn_  (22, 22 to read @@ NEEDS RULING)

- **`lpn_ff_col_static_tip`**
  > The pressure at this junction before any fire flow is drawn, with the system's ordinary demands still running. Nothing is shut off to measure it, so this is not a zero-flow pressure for the system; it is the same pressure the map shows at this junction. AWWA M31 and NFPA 291 both use this name for the reading a fire flow test starts from.
  @@ NEEDS RULING
- **`lpn_inp_drop_net_options`**
  > This EPANET .net file states these settings in places this page has no name for, so their values are listed here rather than carried across. Everything else came over. If you need them, open the file in EPANET and use File, Export, Network to save it as an .inp file, then import that.
  @@ NEEDS RULING
- **`lpn_net_emergency`**
  > This was an EPANET .net file. That is EPANET's own project file, it has no published description, and this page reads it by inspection, so treat it as a way in when you have no other rather than as a dependable route. The .inp file is the documented format that every other program reads: in EPANET use File, Export, Network to write one, and import that instead whenever you can.
  @@ NEEDS RULING
- **`lpn_quality_chemical_name`**
  > Chemical and units
  @@ NEEDS RULING
- **`lpn_quality_chemical_name_tip`**
  > The name of the chemical and the units its concentrations are written in, for example Chlorine mg/L. This is a label. EPANET does not convert a concentration, so every concentration and every coefficient in the project has to be written in these units already.
  @@ NEEDS RULING
- **`lpn_quality_initial`**
  > Initial quality
  @@ NEEDS RULING
- **`lpn_quality_initial_tip`**
  > How much of the chemical this node holds when the run starts. A reservoir holds its own value for the whole run, which is how the residual leaving a treatment plant is usually stated. Leave it empty for none.
  @@ NEEDS RULING
- **`lpn_reaction_bulk`**
  > Bulk reaction coefficient
  @@ NEEDS RULING
- **`lpn_reaction_bulk_tip`**
  > Reaction in the body of the water, used for every pipe that does not carry its own. A negative number decays the chemical and a positive one grows it. First order unless the file says otherwise, so the coefficient is a rate in 1/day. An empty box means no bulk reaction.
  @@ NEEDS RULING
- **`lpn_reaction_day`**
  > day
  @@ NEEDS RULING
- **`lpn_reaction_note`**
  > This page offers no reaction coefficient of its own. There is no standard test for one, and published field values for the same kind of water differ by a factor of ten, so a number supplied here would be read as a recommendation. Enter one you have measured or one you can cite, or leave the boxes empty for a chemical that does not react.
  @@ NEEDS RULING
- **`lpn_reaction_per_day`**
  > 1/day
  @@ NEEDS RULING
- **`lpn_reaction_pipe_tip`**
  > This pipe on its own. Leave it empty and the pipe uses the coefficient set for the whole network under Settings, Water quality.
  @@ NEEDS RULING
- **`lpn_reaction_wall`**
  > Wall reaction coefficient
  @@ NEEDS RULING
- **`lpn_reaction_wall_tip`**
  > Reaction at the pipe wall, used for every pipe that does not carry its own. A negative number decays the chemical. First order unless the file says otherwise, so the coefficient is a length per day, written in the project length unit. An empty box means no wall reaction.
  @@ NEEDS RULING
- **`lpn_result_concentration`**
  > Concentration
  @@ NEEDS RULING
- **`lpn_result_concentration_tip`**
  > How much of the chemical is left at this point after it has travelled and reacted. The units are the ones named beside the chemical under Settings, Water quality.
  @@ NEEDS RULING
- **`lpn_time_run_report_copied`**
  > Copied
  @@ NEEDS RULING
- **`lpn_time_run_report_copy`**
  > Copy
  @@ NEEDS RULING
- **`lpn_wrong_btn`**
  > Something wrong here?
  @@ NEEDS RULING
- **`lpn_wrong_thanks`**
  > Thank you. We got that.
  @@ NEEDS RULING
- **`lpn_wrong_tip`**
  > One tap tells us that something on this page is wrong. It sends the name of this page, the language you are reading it in, and the message on the map if there is one. It sends no text, no address, and nothing at all out of your drawing. Nobody can write back, because this tells us nothing about who you are. Use Help, Fix something when you want to say more.
  @@ NEEDS RULING
