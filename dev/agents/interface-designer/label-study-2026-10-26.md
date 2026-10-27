# Labelling the Properties box (and its sister boxes): a study (Ida, 2026-10-26)

Tags: CITED = external source, named. OBSERVED = this repository or my own probe. SPECULATION = my inference.
Column tags in the big table: "Ours" is OBSERVED; "EPANET" and "WaterGEMS" are CITED unless a cell says (S); "Proposed" is my SPECULATION (a proposal, not a fact).

## 0. The short version

- OBSERVED: the labels are already close to right. Of about 70 rows across junction, reservoir, tank, pipe, pump, valve and customer, 14 are worth changing. One label (the minor loss coefficient) is more than a third of the problem.
- Tom's guess about case is answered by the repository: every one of these labels is already in sentence case. Nobody has to be retrained. Proper Case would be the retraining.
- The best move is not a new wording. It is to point Properties at the `_short` keys the suite already owns and has already translated: `lpn_field_km_short` ("Minor loss, k"), `lpn_reaction_bulk_short`, `lpn_reaction_wall_short`, `lpn_reaction_tank_short`, `lpn_field_type`. Five renames, zero new translations. One of those short keys has a Turkish defect to fix first (section 5).

## 1. How I got the list of labels (OBSERVED)

I did not read the code and guess. I ran a real Chromium (dev/browser-pass, harness lock) against `feat/box-rows-properties`, opened Net1 (junction 11, reservoir 9, tank 2, pipe 10, pump 9, customer M1) and Valves.lwn (PBV1, PRV1, PSV1, FCV1, TCV1, GPV1), and dumped every `.lpn-gname` and table heading in `#lpn_popup_fields`. Probe: `/tmp/claude-1000/-home-haws-webdev-hawsedc-com-engcalcs/6f9ffbd0-8357-427a-8eaf-ce8a5cd5fb74/scratchpad/probe-labels.js`; raw output `.../scratchpad/labels.json`. The worktree was mid-edit (uncommitted changes in `js/looped-network.js` and the 28 lang files; new keys `lpn_prop_label_unit` = "{label} ({unit})" and `lpn_prop_label_symbol_unit` = "{label}, {symbol} ({unit})"), so what I saw is that moment's state: names without units, which is the unit-column layout of Task 828. Tom's message describes the other plan, the unit inside the label. Both are covered below: the unit-in-label plan adds 5 to 9 characters to every unit-bearing row ("Highest water depth (ft)" is 24; "Average Chlorine concentration (mg/L)" is 37).

Two things the probe showed that no one asked about:
- OBSERVED: the checkbox label is `lpn_field_active` = "Is active?" and the help glyph is a second "?", so the row reads "Is active??". CLAUDE.md says exactly one "?" per label, always the tip.
- OBSERVED: the mid-sentence capital in "Average Chlorine concentration" and "Chlorine concentration". The chemical name is inserted as typed (default "Chlorine"), so a sentence-case label carries a Proper Case word in it. It is the user's own word and should stay; I only note it.

## 2. Vocabulary (Tom asked for the words)

- Name column, value column, unit column: the three tracks of the grid. A "label" in Tom's message is the name column's text.
- Truncate vs wrap: when the name is wider than its column, either cut it with an ellipsis on one line (EPANET, Bentley) or let it fold onto a second line (epanet-js). Truncation keeps every row the same height, so the column scans as a column. The cost is that the cut-off part is invisible, so the first words must carry the meaning.
- Front-loading: put the word that tells this row from its neighbours at the left edge. The eye runs down the left edge of a list. CITED: Nielsen Norman Group, "First 2 Words: A Signal for Scanning" article (nngroup.com/articles/first-2-words-a-signal-for-scanning/): users pass their eyes "down the text's left side in a fairly straight line", and links and headings should "front-load" the informative terms. The article is about links and headings, not field labels; I apply it to labels by analogy (SPECULATION that it carries over unchanged).
- Inversion: reordering a noun phrase to lead with its head noun ("Depth, maximum" for "Maximum depth"). WaterGEMS does it with parentheses ("Level (Maximum)").
- Modifier stack / noun string: a chain of nouns and adjectives before the head noun ("Minor (local) loss coefficient"). Microsoft's global-writing advice is to avoid long ones: CITED, learn.microsoft.com/en-us/style-guide/global-communications/writing-tips ("Avoid modifier stacks").
- Sentence case: "Minor loss, k". Title case (what Tom calls Proper Case; style guides call it title case or headline style): "Minor Loss, K".
- Sibling parallelism: neighbouring labels share a first or last word ("Bulk reaction", "Wall reaction") so the column reads in groups.
- `_short` key: this repository's own device for a narrow use of a long label (the comment at lib/lang.ec.en.php beside `lpn_field_km_short` says why: "a shared label must fit its narrowest use").

## 3. The table

Legend for the EPANET column. "T6.n" is a table in the EPANET 2.2 manual, section 6 (epanet-manual.readthedocs.io/en/latest/6_objects.html). "AppA" is the manual's Appendix A, Units of Measurement (epanet-manual.readthedocs.io/en/latest/back_matter.html), where EPANET writes its own short forms. The Windows Property Editor's on-screen strings I could not retrieve (it is a Windows program); Tom reports "Loss coeff." there. The manual's own tables spell out "Loss Coefficient" (T6.4, T6.6) and its Appendix A writes "Minor Loss Coeff." and "Reaction Coeff. (Bulk)". (S) marks a form I recall from the program and could not confirm.

Legend for the WaterGEMS column. Source pages, all Bentley help: Pipe Attributes (WaterGEMS SS6, docs.bentley.com GUID-7E022352...), Junction Attributes (WaterCAD CONNECT Edition Help, GUID-982FB203...), Tank Attributes (WaterCAD CONNECT, GUID-A8BF4541...), PRV Attributes (WaterGEMS SS6, GUID-A9C1E354...). The pump and reservoir pages I reached were the HAMMER and WaterCAD copies of the shared attribute model, via a search summary rather than a fetch, so those cells are weaker. "n/f" = not found on the pages I read. Bentley writes Title Case, and writes the qualifier in parentheses after the noun: "Pressure Setting (Initial)", "Level (Maximum)", "Elevation (Base)", "Minor Loss Coefficient (Local)".

Rows are grouped; a row that appears in several element types is listed once with where it appears. "Keep" means my proposal equals today's label.

### 3a. Every box

| Row (key) and where | Ours today | EPANET 2.2 | WaterGEMS | Proposed | Why |
|---|---|---|---|---|---|
| X, Y (`lpn_field_x/y`; Latitude, Longitude in a geographic project). All nodes, Text | X / Y | X-Coordinate, Y-Coordinate (T6.1) | n/f | Keep | 1 character. A longer word would buy nothing; the status strip says the same. |
| ID (`lpn_field_id`). All | ID | Junction ID, Pipe ID (T6.1, T6.4); "ID Label" on a valve (T6.6) | ID | Keep | Shortest possible, and it is what both products and the INP file call it. |
| Description (`lpn_field_desc`). All | Description | Description | n/f (Bentley has Label and Notes) | Keep | EPANET's word, already short. |
| Tag (`lpn_field_tag`). All | Tag | Tag | n/f | Keep | EPANET's word. |
| Elevation (`lpn_field_elev`). Junction, reservoir, tank | Elevation | Elevation (T6.1, T6.3) | Elevation | Keep | One word in all three. |

### 3b. Junction

| Row (key) | Ours today | EPANET 2.2 | WaterGEMS | Proposed | Why |
|---|---|---|---|---|---|
| Base demand (`lpn_field_base_demand`, table head) | Base demand | Base Demand | Demand Collection | Keep | EPANET's word, 11 characters. |
| Demand pattern (`lpn_field_demand_pattern`) | Demand pattern | Demand Pattern | n/f | Keep | EPANET's word. Sibling of Base demand, so "Demand" leads both. |
| Demand (`bpn_demand`, result) | Demand | "water demand" (section 3.1 prose); (S) "Actual Demand" in the program | Demand (calculated) | Keep | One word, front-loaded. |
| Required fire flow (`lpn_ff_required`) | Required fire flow | n/f (not an EPANET property) | Fire Flow (Needed) | Keep | "Required" is the only row starting with it, so it scans. Shared with the Fire flow box and Tables, which want the full phrase (SPECULATION: a `_short` would save 9 characters and cost 26 translations for one row; not worth it). |
| Emitter coefficient (`lpn_field_emitter`) | Emitter coefficient | Emitter Coefficient (T6.1; AppA) | Emitter Coefficient | Keep | Three sources agree exactly. 19 characters is tolerable for an unmistakable engineering term. Do not abbreviate to "Emitter coeff." |
| Head (`lpn_result_head`, result) | Head | AppA "Hydraulic Head"; reservoir input "Total Head" (T6.2) | Hydraulic Grade | Keep | Shorter than all three. CLAUDE.md already treats "head" as a trap term with its tip. |
| Pressure (`lpn_result_pressure`) | Pressure | Pressure | Pressure | Keep | |
| Initial quality (`lpn_quality_initial`) | Initial quality | Initial Quality | Concentration (Initial) | Keep | EPANET's word. |
| Source type / Source quality / Source pattern (`lpn_source_*`) | same | Source Quality (T6.1) | Constituent Source Type; Pattern (Constituent) | Keep | Three rows that begin with "Source": the front-load rule working without anyone designing it. |
| {chemical} concentration (`lpn_quality_named_concentration`) | Chlorine concentration | "Quality" | Concentration (Calculated) | Keep | R-323 template. |
| Is active? (`lpn_field_active`), every element | Is active? | none (EPANET has no such flag) | none on pages read; Bentley's booleans are "Is Closed?", "Has Check Valve?" | **Active** | The word is a checkbox's name; the box beside it says yes or no. Removes the double question mark (OBSERVED, sec. 1). 10 to 6 characters. Note `lpn_settings_row_label_on` already says "Is active" without a mark. |

### 3c. Reservoir

| Row | Ours today | EPANET 2.2 | WaterGEMS | Proposed | Why |
|---|---|---|---|---|---|
| Head (`lpn_field_head`) | Head | Total Head (T6.2) | Elevation (it is the hydraulic grade at a reservoir, per Bentley's definition) | Keep | |
| Head pattern (`lpn_field_head_pattern`) | Head pattern | Head Pattern | Hydraulic Grade Pattern (weak source, see legend) | Keep | |

### 3d. Tank

| Row | Ours today | EPANET 2.2 | WaterGEMS | Proposed | Why |
|---|---|---|---|---|---|
| Base elevation (`lpn_field_tank_base_elev`) | Base elevation | "Elevation" is the tank bottom (T6.3) | Elevation (Base) | Keep | We follow Bentley here: our "Elevation" is the ground, "Base elevation" the bottom. The first words are nearly the same, so a truncated column shows "Elevation" twice with only "Base" to tell them apart (SPECULATION: it is fine at 13 characters). |
| Water depth (`lpn_field_tank_level`) | Water depth | Initial Level (T6.3) | Level (Initial) | **Initial depth** | OBSERVED: the property `level` is the starting level (js/lpn-inp.js:990 builds the water surface as "bottom plus the initial level"). "Water depth" does not say so, and the same box shows a read-only "Depth" (`lpn_result_depth`) a few rows down, so the two are easy to confuse. "Initial" is EPANET's and Bentley's word. 11 to 13 characters. |
| Lowest water depth (`lpn_field_tank_minlevel`) | Lowest water depth | Minimum Level | Level (Minimum) | **Minimum depth** | "Minimum"/"Maximum" are the words both products use and the tip already uses ("Minimum allowable depth"). 18 to 13. Sibling parallel with Initial depth and Maximum depth: the column reads as a group. |
| Highest water depth (`lpn_field_tank_maxlevel`) | Highest water depth | Maximum Level | Level (Maximum) | **Maximum depth** | 19 to 13. As above. |
| Tank diameter (`lpn_field_tank_diameter`) | Tank diameter | Diameter (AppA: "Diameter (Tanks)") | Diameter | **Diameter** (needs a `_short` key) | The box is a tank's. The long form stays for Settings, where "Tank diameter" (default) must be told from pipe diameter (OBSERVED: key is used by `defaults.tankDiameter`, js/looped-network.js:30784). 13 to 8. |
| Reaction coefficient (`lpn_reaction_tank`) | Reaction coefficient | Reaction Coefficient (T6.3) | Bulk Reaction Rate (Local) | **Reaction** (existing `lpn_reaction_tank_short`) | Key exists and is translated. The unit column ("1/day") supplies the rest. 20 to 8. Trade: loses EPANET's word "coefficient" (a tip carries it). |
| Mixing model (`lpn_mixing_model`) | Mixing model | Mixing Model | Tank Mixing Model | Keep | |
| Depth, Available volume (results) | Depth, Available volume | n/f | n/f | Keep | |

### 3e. Pipe

| Row | Ours today | EPANET 2.2 | WaterGEMS | Proposed | Why |
|---|---|---|---|---|---|
| Pipe type (`lpn_field_pipetype`) | Pipe type | n/f | Material | Keep | |
| Diameter | Diameter | Diameter (AppA: "Diameter (Pipes)") | Diameter | Keep | |
| Roughness, C (`lpn_field_roughness` + symbol) | Roughness, C | Roughness (T6.4); AppA "Roughness Coefficient" | Hazen-Williams C | Keep | The symbol pattern "Word, symbol" is the one inversion I want kept; section 4. |
| Fittings list (`lpn_field_fittings`) | Fittings list | n/f | Minor Losses | **Fittings** | The control is a chooser with an "Edit fittings" button; "list" tells the user nothing. 13 to 8. Low value; do it only if the key is opened for another reason. |
| Minor (local) loss coefficient, k (`lpn_field_km`). Pipe and four valve types | Minor (local) loss coefficient, k | Loss Coefficient (T6.4, T6.6); AppA "Minor Loss Coeff." | Minor Losses on a pipe (Pipe Attributes); Minor Loss Coefficient (Local) on a valve (PRV Attributes) | **Minor loss, k** (existing `lpn_field_km_short`) | The single biggest win: 33 to 13 characters, five boxes. "k" already says coefficient. Key exists in 26 languages. Defect to fix first: Turkish short form (sec. 5). Tom's D3 ruling (dev/label-normalization-decision.md) says "(local)" is load-bearing against a "smaller loss" mistranslation; the repo's short translations in 9 of 10 languages I read already say "local" (es "Pérdida localizada", fr "Perte singulière", de "Einzelverlust"), and dev/terms.md defines "minor loss" for translators. So "(local)" is not needed in English if the short key is the one translators see. If Tom wants "(local)" kept: "Minor (local) loss, k" is 21 characters and costs a new value for the key. |
| Length (`lpn_field_length`) | Length | Length | Length | Keep | |
| Bulk reaction coefficient (`lpn_reaction_bulk`) | Bulk reaction coefficient | Bulk Coefficient (T6.4); AppA "Reaction Coeff. (Bulk)" | Bulk Reaction Rate (Local) | **Bulk reaction** (existing `lpn_reaction_bulk_short`) | 25 to 13. Exists, translated. Caveat: the same box has a result "Reaction rate"; keep results in their own block and unit column so an input coefficient and an output rate do not sit adjacent unlabelled. |
| Wall reaction coefficient (`lpn_reaction_wall`) | Wall reaction coefficient | Wall Coefficient (T6.4) | Wall Reaction Rate (First Order) | **Wall reaction** (existing `lpn_reaction_wall_short`) | As above. |
| From, To (`lpn_field_from/to`) | From, To | Start Node, End Node (T6.4) | (S) Start/Stop Node | Keep | 4 and 2 characters. |
| Closed (`lpn_field_closed`) | Closed | Initial Status (Open, Closed, CV) | Is Initially Closed? | Keep | |
| Check valve (CV) (`lpn_field_cv`) | Check valve (CV) | Initial Status = CV | Has Check Valve? | **Check valve** | 16 to 11. Key exists only in English (OBSERVED: grep finds it in lang.ec.en.php alone), so changing it now costs nothing in translation. "(CV)" is already in the tip. |
| Flow, Velocity (`lpn_result_*`) | Flow, Velocity | flow rate, velocity (sec. 3.1 prose) | Flow, Velocity | Keep | |
| Head loss (`lpn_result_headloss`) | Head loss | "headloss" (one word, sec. 3.1) | Headloss | Keep | OBSERVED: both EPANET and Bentley write one word; the suite writes two (HEC register). Not a labelling question; flagged for Tom only. |
| Head loss gradient (`lpn_result_gradient`) | Head loss gradient | (S) "Unit Headloss" | Headloss Gradient | Keep | Matches Bentley. Starts with the same 9 characters as the row above; the tail separates them. |
| Status, Reaction rate | Status, Reaction rate | Status; "average reaction rate" (3.1) | Status (Calculated) | Keep | |
| Average {chemical} concentration (`lpn_quality_named_avg_concentration`) | Average Chlorine concentration | "average water quality" (3.1) | Concentration (Calculated) | Keep, flagged | At 30 characters this is the longest label left in the pipe and pump boxes. It is a template Tom approved (R-349). If a column ever has to be narrow, this is the row that truncates. |

### 3f. Pump

| Row | Ours today | EPANET 2.2 | WaterGEMS | Proposed | Why |
|---|---|---|---|---|---|
| Pump head curve (`lpn_pump_curve_source`) | Pump head curve | Pump Curve (T6.5) | Pump Definition (HAMMER page) | **Pump curve** | EPANET's own phrase, 15 to 10. Low value: key is used in three places and carries a library meaning. Alternative "Head curve" is parallel with "Efficiency curve" but is not EPANET's word. |
| Relative speed (`lpn_field_pump_speed`) | Relative speed | Speed (T6.5) | Relative Speed Factor (Initial) | Keep | "Relative" carries meaning EPANET's one word leaves to its tip. |
| Speed pattern, Price pattern | same | Pattern, Price Pattern | n/f | Keep | Ours says what the pattern is for; EPANET's bare "Pattern" does not. |
| Price of power (`lpn_energy_price`) | Price of power | Energy Price (T6.5) | n/f | **Energy price** | EPANET's word, and "of" goes. 14 to 12. Low value, but it is also the CLAUDE.md rule (default to EPANET terminology). |
| Pump efficiency curve (`lpn_pump_effic_curve`) | Pump efficiency curve | Efficiency Curve (T6.5) | n/f | **Efficiency curve** | EPANET's exact phrase. 21 to 16. |
| Head, Flow, Status (results) | same | | | Keep | |

### 3g. Valve (six types)

| Row | Ours today | EPANET 2.2 | WaterGEMS | Proposed | Why |
|---|---|---|---|---|---|
| Valve type (`lpn_field_valve_type`) | Valve type | Type (T6.6) | Valve Type | **Type** (existing `lpn_field_type`) | The box is a valve's. Key exists. 10 to 4. |
| Pressure setting / Pressure drop / Flow setting (`lpn_field_valve_setting_*`) | same | Setting (one word for all, T6.6) | Pressure Setting (Initial) | Keep | Ours names what the number means for that valve type; EPANET's "Setting" does not. |
| Loss coefficient (TCV, `lpn_field_valve_setting_loss`) | Loss coefficient | Setting; "TCV - Loss Coeff" | n/f | Keep | |
| Valve head loss curve (GPV, `lpn_gpv_curve_source`) | Valve head loss curve | Setting: "GPV - ID of head loss curve" | n/f | **Head loss curve** | 21 to 15. Low value. |
| Diameter | Diameter | Diameter | Diameter (Valve) | Keep | |
| Minor loss | see pipe | Loss Coefficient (T6.6) | Minor Loss Coefficient (Local) | Minor loss, k | As in the pipe row. Note that EPANET's valve "Loss Coefficient" is our minor loss, while ours "Loss coefficient" on a TCV is its setting; the two words are one word apart in different boxes, which is why "Minor loss" should be the pipe/valve name. |

### 3h. Customer

| Row | Ours today | EPANET 2.2 | WaterGEMS | Proposed | Why |
|---|---|---|---|---|---|
| Demand per service (`lpn_field_meter_demand`) | Demand per service | n/f | Unit Demand Collection | Keep | "Demand" leads. |
| Demand pattern | Demand pattern | | | Keep | |
| Number of services (`lpn_field_meter_count`) | Number of services | n/f | n/f | **Services** | 18 to 8. A number box under "Services" reads as a count. Medium risk: bare nouns are ambiguous to translators (sec. 5). |
| Total demand | Total demand | | | Keep | |
| Connected asset / Connected to / Added to node | same | | | Keep | |
| Station along the pipe (%) (`lpn_field_meter_station`) | Station along the pipe (%) | n/f | n/f | **Station along the pipe** | The "(%)" is the unit. With a unit column, or with the new `{label} ({unit})` template, it would print twice. 26 to 22. Same rule for any key that hard-codes a unit. |
| Offset from the pipe | Offset from the pipe | | | Keep | Keep "the": Microsoft's translation advice is to keep articles (CITED, writing-tips page above). |

### 3i. The ten renames, ranked by value

Value = characters saved x boxes it appears in x whether a translation already exists.

| # | Today | Proposed | Saves | Translation cost |
|---|---|---|---|---|
| 1 | Minor (local) loss coefficient, k | Minor loss, k | 20 characters, 5 boxes | None (existing `_short`); fix tr first |
| 2 | Bulk reaction coefficient | Bulk reaction | 12 | None (existing `_short`) |
| 3 | Wall reaction coefficient | Wall reaction | 12 | None (existing `_short`) |
| 4 | Reaction coefficient (tank) | Reaction | 12 | None (existing `_short`) |
| 5 | Highest water depth | Maximum depth | 6 | 26 (edit three tank-level values together) |
| 6 | Lowest water depth | Minimum depth | 5 | (with #5) |
| 7 | Water depth (the initial one) | Initial depth | adds 2, fixes a meaning | (with #5) |
| 8 | Is active? | Active | 4, one "?" fewer | 26 (a short value, easy) |
| 9 | Valve type | Type | 6 | None (existing `lpn_field_type`) |
| 10 | Check valve (CV) | Check valve | 5 | None yet (English only) |

Next in line: Tank diameter to Diameter (new `_short`), Pump efficiency curve to Efficiency curve, Number of services to Services, Station along the pipe (%) to Station along the pipe, Price of power to Energy price, Pump head curve to Pump curve.

Effect on widths (OBSERVED, arithmetic on the probe's label list, English characters, before to after, without units): longest label in the valve box 33 to 16; pipe box mean 12.3 to 9.7 with the longest becoming "Average Chlorine concentration" at 30; tank box mean 12.4 to 10.9; pump box 10.6 to 9.6; customer 15.0 to 13.6.

## 4. Principles for a narrow label column (ranked)

1. **The name column holds names, not explanations.** Delete every word the box already supplies ("Pump", "Tank", "Valve" in a pump, tank or valve box) and every word the symbol, unit column or tip carries ("coefficient" when a "k" follows, "(%)", "(CV)"). Deletion is the whole technique; it never loses a translation, it shortens one. This single rule produces eight of the ten renames above. (SPECULATION: my synthesis. Grounded in the repository's own `_short` practice, OBSERVED at lib/lang.ec.en.php beside `lpn_field_km_short`, and in Microsoft's advice to avoid modifier stacks, CITED above.)
2. **Put the word that tells the row apart at the left edge, by deletion, not inversion.** Front-loading is CITED (NN/g, above, for headings and links); we get it by removing the redundant leading word ("Pump efficiency curve" becomes "Efficiency curve"). Do not copy WaterGEMS's inversion ("Level (Maximum)"): our parentheses are now taken by the unit (`{label} ({unit})`, OBSERVED), and a qualifier in a bracket forces every translator to reorder and then to translate the bracket. The one inversion kept is "Word, symbol" ("Roughness, C"), because a symbol is a letter nobody translates (OBSERVED, js/looped-network.js comment above `roughnessSymbol()`).
3. **Use the engineer's word, EPANET's first, and no abbreviation we would have to defend.** CLAUDE.md already says default to EPANET terminology. CITED: EPANET's manual tables spell out "Loss Coefficient" and "Efficiency Curve"; only its units appendix abbreviates ("Coeff."). CITED: W3C Internationalization, "Text size in translation" (w3.org/International/articles/article-text-size): other languages may not be able to replicate an abbreviation, and the translator may need a list. CITED: Microsoft writing-tips: "Use only common abbreviations". So "Loss coeff." and "Effic." are out; a symbol (k, C, Q) is in.
4. **Siblings share a first word or a last word.** "Initial/Minimum/Maximum depth", "Bulk/Wall reaction", "Source type/quality/pattern", "Demand/Base demand/Demand pattern". A reader finds one row by finding its family. (SPECULATION: from NN/g's left-edge scanning; I know of no study of property grids.)
5. **Budget the label, then test it by truncation.** Aim for 20 characters or fewer in English, because the Spanish and French medians run 1.3 to 1.4 times English (sec. 5) and the column must hold the worst language. Anything longer needs a reason or a `_short` key. Then check the rule that matters in a truncating column: the first 12 characters of every name in a box must differ from every other name's. OBSERVED: I ran this on the probe's label lists and all twelve boxes (junction, reservoir, tank, pipe, pump, customer, six valves) pass today; the longest labels left are the two results templates. (SPECULATION as a number; the 20-character figure is my arithmetic from the observed ratios.)

## 5. Translation consequences

- OBSERVED (php over lib/lang.ec.*.php, 32 Properties keys; characters, median of translation length over English length): es 1.42, sw 1.31, fr 1.28, pt 1.25, ru 1.16, de 1.08, km 1.08, tr 0.94, ar 0.86, hi 0.85, zh 0.28. The worst single string is the minor loss label, 44 characters in both es and fr. Chinese counts characters not widths; a Han character is about two Latin columns wide, so read zh as roughly 0.55.
- CITED: W3C, "Text size in translation", quoting IBM's averages for English into European languages: 1-10 characters expand 200-300%, 11-20 expand 180-200%, 21-30 expand 160-180%, 31-50 expand 140-160%. Our observed medians are lower than IBM's (they were measured on sentences and longer strings). The direction holds: short labels expand proportionally more, so a one-word label is not safe from growth; it just grows from a smaller base.
- OBSERVED: the saving is worth the most where the longest translated string sets the column. With "Minor (local) loss coefficient, k" the Spanish and French columns need 44 characters; with the short key, 21 and 19.
- **Reuse the existing short keys first.** Rows #1 to #4 and #9 point at keys that exist in 26 languages: no translation sprint. Rows #5 to #8 edit existing values and trigger retranslation (CLAUDE.md: Tom approves each sprint, I do not start one). Row #10 is English-only today.
- **A defect to fix before reuse (OBSERVED).** `lpn_field_km_short` in Turkish is "Küçük kayıp, k" ("small loss"), the exact mistranslation D3 warned of; the full-length key is "Küçük (yerel) kayıp katsayısı, k". The other nine short forms I read keep the "local" sense (es, pt "localizada"; fr "singulière"; de "Einzelverlust"; ru "Местные"; ar "الموضعي"; zh "局部"; hi "स्थानीय"; sw "wa ndani"). Reusing the short key surfaces Turkish in five boxes where it used to surface in two. A one-string repair, and Tom's call.
- **Short is also vaguer.** "Active", "Type", "Services", "Reaction" and "Initial depth" are now one or two words and a translator has only the string. dev/plain-sentences.md and dev/terms.md exist for this (I may not edit them; Tom does). Suggest an entry for each of the short ones.
- **Abbreviations.** OBSERVED: no `lpn_field_*` label abbreviates today; the one "coeff." in the suite is `mphl_total_junction_k_short` ("Loss coeff., k_m"), a table heading. Keep it so.
- **Right-to-left (five languages).** SPECULATION: the new template `{label}, {symbol} ({unit})` puts a Latin letter and a Latin unit inside an Arabic, Persian, Hebrew, Pashto or Urdu run. Each string is translatable (it is a key), so the comma and the bracket can be localised, but the order of the three pieces under the Unicode bidirectional algorithm is the kind of thing a harness catches and a reading does not. Worth one Chromium render in ar and he at a narrow column before the branch merges.
- **Case in translation.** OBSERVED: none of the 26 translations I read is in title case (es "Profundidad de agua máxima", fr "Hauteur d'eau maximale", de capitalises nouns because German does). Eleven of the 26 languages have no letter case at all (am, ar, bn, fa, he, hi, km, my, ps, ur, zh). The English-source choice therefore changes only the English column and the translators' reading of the source.

## 6. Proper Case or sentence case in 2026

**My view: sentence case. Keep what is already there. The only thing that could be done differently is to stop doing it by accident.**

What EPANET and Bentley do (CITED): the EPANET 2.2 manual tables (Junction ID, X-Coordinate, Base Demand, Emitter Coefficient) and the Bentley help pages (Minor Loss Coefficient (Local), Has User Defined Length?, Pressure Setting (Initial)) are Title Case throughout. Tom's reading of them is right.

What the guides say now:
- **Microsoft** (CITED, learn.microsoft.com/en-us/style-guide/capitalization, page dated 2026-10-15 in its own header): "Microsoft style uses sentence-style capitalization." The rule explicitly covers "UI label (such as the name of a button or checkbox)". The same page keeps title-style for product names, book titles and white-paper titles, i.e. things that are titles, not labels. The global-communications page repeats "Use sentence-style capitalization" as a localisation tip.
- **Google** (CITED, developers.google.com/style/capitalization): headings and titles in sentence case; "Use sentence case for labels, callouts, and other text in images and diagrams." That page does not rule on a UI field label directly.
- **Material Design 3** (CITED through a search summary of m3.material.io/foundations/content-design/style-guide/ux-writing-best-practices; I could not fetch the page body, so treat the wording as secondary): sentence case for all text, titles, labels and menu items, and advice against title case. Material 2 said the same for labels and menu items (m1.material.io/style/writing.html, summary).
- **Apple** (CITED, Human Interface Guidelines, "Writing", via the page's JSON): does not mandate either. "Title case is generally considered formal, while sentence case is more casual. Choose a style for each UI element type and use it consistently." So Apple is the one guide that says it is a voice choice, plus consistency.
- **APA 7** (CITED, apastyle.apa.org, table setup and sentence case pages, via search summary): column headings in sentence case. CLAUDE.md already adopts APA 7 for mechanics; this is the same rule, applied to the same kind of object (a heading over a column of values).

The "30 years" question. SPECULATION (memory, unverified): Windows UIs of the EPANET/Haestad era (late 1990s to 2000s) were conventionally headline style for labels and menu items; the shift to sentence case for labels is a 2010s change led by the web (Material, Microsoft's own docs). The sources above establish the current state; I did not find a source for the date of the change. Do not assert the history to anyone.

Why not follow EPANET and Bentley: (1) They are Title Case because they are old, not because Title Case is better for a property grid; neither product's help states a rationale (OBSERVED: none given on the pages read). (2) Title Case has a real cost in a translated product: 11 of 26 languages cannot reproduce it and most of the rest do not use it, so a Title Case English source makes every translator undo a decision. (3) Sentence case keeps proper nouns and symbols visible: "Roughness, C", "Source quality", chemical names. In Title Case "Minor Loss, K" the symbol's case is ambiguous (k and K are different quantities). That last one is the point I would put to Tom: it is a correctness argument, not taste.

The honest case for Proper Case: engineers who open this next to EPANET or WaterGEMS see familiar-looking labels; each row begins with a capital, which gives a bumpier left edge for the eye. I weigh the first as small (the words are what they recognise) and the second as unmeasured here.

Cost of staying: nothing. OBSERVED: every `lpn_field_*` value is already sentence case. The only Proper Case-looking strings are the chemical names the user types. There is no retraining to do; `dev/language-strings.md` already says sentence-based English and APA 7 (CLAUDE.md).

## 7. What I could not establish

- EPANET's on-screen Property Editor strings. The manual's tables spell words out; Appendix A abbreviates. Tom says the program shows "Loss coeff."; I could not fetch the program. The Appendix A abbreviation ("Minor Loss Coeff.") and a Qatium help page that quotes "Emitter Coeff." as EPANET's property name (search summary) agree with him. (S)
- epanet-js's labels (not retrieved). That it wraps is Tom's report, not mine.
- WaterGEMS's own pump and reservoir pages (read through HAMMER/WaterCAD copies via a search summary), its Start/Stop node labels, and a Bentley rationale for Title Case.
- Whether a user can tell "Initial depth" from "Depth" without the tip. That is a browser pass, not a study.
- Any pixel measurement. The column widths in rem are a layout decision for the branch; the character counts here are a proxy.

## 8. If only one thing is done

Point the Properties box's pipe and valve minor-loss row at `lpn_field_km_short`, after fixing Turkish. It is the longest label in the box, the longest in every language, in five boxes, and it needs no new translation.

Sources: EPANET 2.2 manual chapter 6 (https://epanet-manual.readthedocs.io/en/latest/6_objects.html), section 4.8 Property Editor (https://epanet-manual.readthedocs.io/en/latest/4_EPANET_workspace.html: "a grid with two columns - one for the property's name and the other for its value. The columns can be re-sized"), Appendix A (https://epanet-manual.readthedocs.io/en/latest/back_matter.html); Bentley Pipe Attributes (https://DOCS.BENTLEY.COM/LiveContent/web/Bentley WaterGEMS SS6-v1/en/GUID-7E022352A26641E7860CC5BFCDBA312B.html), Junction Attributes (https://DOCS.BENTLEY.COM/LiveContent/web/Bentley WaterCAD CONNECT Edition Help-v1/en/GUID-982FB2039EB64BF69F99499D52BF5E62.html), Tank Attributes (https://DOCS.BENTLEY.COM/LiveContent/web/Bentley WaterCAD CONNECT Edition Help-v1/en/GUID-A8BF45418DC04913815F45BAD0C733D9.html), PRV Attributes (https://DOCS.BENTLEY.COM/LiveContent/web/Bentley WaterGEMS SS6-v1/en/GUID-A9C1E354B0254D1D837C234F0748AA48.html); Microsoft capitalization (https://learn.microsoft.com/en-us/style-guide/capitalization) and writing tips (https://learn.microsoft.com/en-us/style-guide/global-communications/writing-tips); Google (https://developers.google.com/style/capitalization); Apple HIG Writing (https://developer.apple.com/design/human-interface-guidelines/writing); Material 3 (https://m3.material.io/foundations/content-design/style-guide/ux-writing-best-practices); APA (https://apastyle.apa.org/style-grammar-guidelines/tables-figures/tables); NN/g (https://www.nngroup.com/articles/first-2-words-a-signal-for-scanning/); W3C (https://www.w3.org/International/articles/article-text-size).
