# Wave 0 on the fifteen calculators: the 16 questions only Tom can answer

**What this is.** `dev/english-friction/239-wave0-calcs.json` is the machine-run Wave 0 over the 415
English strings of the non-lpn calculators. It found 35 things, fixed 6 in the English itself,
knocked down 13 as false alarms, and stopped at these 16. It stopped for exactly two reasons, and
both are standing rules rather than uncertainty:

- **`$ec_lang_syn` is off-limits to AI.** AI proposes a diff; you approve; only then does AI write.
  Seven of these are that, and each one already carries a drafted payload below.
- **A visible wording change is your call.** Nine of these change a label a user reads, or a sketch,
  or a button. Some cost column width, which is the constraint you have ruled on before.

**How to answer.** Write on the `**Tom:**` line under each item. Anything is a valid answer,
including *leave it*, *do the other one*, or your own wording. Blank means not yet decided and the
item stays open; nothing gets written on a guess.

**What happens after.** Each answer lands in `lib/lang.ec.en.php` or `$ec_lang_syn`, the JSON entry's
`disposition` changes from `refer-to-human` to `english` / `syn` / `dismissed` with your ruling as
its `resolution`, and the affected keys go back into the translation queue. `$ec_lang_syn` entries
cost nothing to translate (they are instructions TO the translator, never displayed); an English
label change re-opens that key in 26 languages, which is the real price and is noted per item.

---

## Part 1 — Seven `$ec_lang_syn` payloads awaiting your approval

These change nothing a user sees. They are notes handed to the translation agents so they stop
guessing. **Cost: nothing. Nothing is retranslated; the next sprint just reads better instructions.**

Each must pass the substitution test — every phrase before the `|` could stand on the control as the
label itself.

### 1. `ip_press` — Irrigation Pressure, results column

Currently: **`Press.`** — the abbreviation of *Pressure*, and also the imperative of the verb *to
press*, in the exact form a UI uses for a button. Nothing tells a translator which word is shortened.

Proposed payload:

```
Pressure or pressure/piezometric head/height/charge/load at this reach's downstream node| layout: column heading; avoid: the imperative verb "press"
```

**Tom:**
It was laid out as a description. I changed it to a much more diverse syn entry. Please follow my example.
### 2. `ip_t_run` — Irrigation Pressure

Currently: **`Runtime (hours)`** — a computing term of art as well as the irrigation sense. In a
suite that IS software, the wrong sense is the more available one to somebody working from a list of
strings.

Proposed payload:

```
How long the zone must run (irrigation time, operating time, watering duration) to apply the target depth. | avoid: the computing sense of "runtime"
```

There is an English alternative — `Run time (hours)`, two words — which fixes it at the source for
every language at once, and costs a retranslation of one key. Say if you would rather have that.

**Tom:**
OK.
### 3. `mi_n617` — Manning Irregular, results column

Currently: **`Comp.<br />n`**. The existing entry carries commentary only (`| layout: column
heading; symbol`) and never says what `Comp.` expands to. Composite, computed, comparison and
component are all live, and only one is right.

Proposed payload (prepends to the existing entry, keeping its commentary):

```
Composite (combined, weighted) Manning n for the whole region, from the segment n and other hydraulic properties | layout: column heading; symbol
```

**Tom:**
I edited it.
### 4. `dw_friction_factor_method` — Darcy-Weisbach

Currently: **`Friction factor method`** — a three-noun stack with two bracketings. `[friction
factor] method` is meant; `friction [factor method]` is available. Languages that must build an
explicit genitive have to pick one.

Proposed payload:

```
Which equation is used to compute the Darcy-Weisbach friction factor f (equation for f, f formula, method for the friction factor).
```

**Tom:**
I edited it.
### 5. `wi_save_and_calculate` — Weir Flow Irregular, button

Currently: **`Save and Calculate`**. It stores the entered cross-section points in the page's own
input cookie. In 2026 the dominant reading of *Save* on a web page is "write a file to my computer",
and this suite genuinely does that elsewhere, so a translator choosing the file sense promises
something the button does not do.

Proposed payload:
Remove this and its parent key. There is no such button.
```
Store (keep, remember) the values entered on this page and calculate again. | layout: button; avoid: saving a file to disk
```

**Tom:**

### 6. `mhp_vel_ok_short` / `mhp_vel_high_short` / `mhp_vel_low_short` — Microhydropower verdicts

Currently: **`OK`**, **`High`**, **`Low`**, standing alone in a narrow cell. Their row label
(`Velocity check`) is a separate key the translator may never see beside them. Out of context, High
and Low are also quality judgements, and in several languages must agree in gender with a noun the
translator cannot see.

Proposed payload, on all three:

```
Verdict on the flow velocity: acceptable / too high / too low. | layout: column heading
```

The same three words are shared by `ip_pressure_*_short` and `bpn_pressure_warn_short`, where the
subject is pressure rather than velocity — so the entries have to be per key, not one shared entry.
Approving this implies six more of the same shape on those pages; say if you want those too.

**Tom:**
OK. I trust your judgement.
### 7. `mhp_annual_kwh` — Microhydropower

Currently: **`Annual energy at 100% capacity`**. *Capacity factor* (every hour of the year, which is
what `mhp_notes_7_def` says it means) or *rated capacity* (full output whenever it runs). The two
differ by the capacity factor itself, often a factor of two or more.

Proposed payload:

```
Energy produced in a year if the plant ran at full output every hour (8760 h) -- an upper bound, before any capacity factor.
```

**Tom:**
OK.
---

## Part 2 — Nine visible wording choices

These change what a user reads. **Cost: the key re-opens in 26 languages.** That is cheap for a key
nobody has translated yet and real for one that is done everywhere.

### 8. `cs_pct_loss` — Canal Seepage

Currently: **`Fraction lost`**, beside a field that defaults to the percent unit. The page routinely
shows `Fraction lost   12.5 %`, so the label and the number disagree in kind: a translator picking
their language's word for *fraction* (a ratio, 0 to 1) translates faithfully and still mislabels the
value. It also never says lost as a share of what (inflow).

Candidates: **`Loss, share of inflow`** · **`Loss / inflow`** · leave it.

**Tom:**
"Portion lost" or "Proportion lost" I am not sure.
### 9. `rc_sketch_filter` — Rock Chute definition sketch

Currently: **`Filter`**. Means the granular filter/bedding layer under the rock. In software
vocabulary *Filter* is overwhelmingly a control or a verb, and this suite has filters elsewhere in
its UI. Every language has a settled construction term for the layer and a different word for the UI
sense.

Candidate: **`Filter layer`**. Note this is a sketch label, where your standing rule is to label only
what an engineer cannot infer — so *delete it* is also a real answer.

**Tom:**
"Filter" is correct because it may be a fabric or an aggregate layer.
### 10 & 11. `odt_sketch_start` / `odt_sketch_end` — Orifice Drain Time sketch

Currently: **`Start`** and **`End`**, marking the starting and ending water surfaces. Read cold,
`Start` is the imperative verb that begins a run, on a page that has a calculate action. These two
must be answered together.

Candidates: **`Start level` / `End level`** · **`Start WS` / `End WS`** · a `$ec_lang_syn` entry
instead, leaving the English alone · leave them.

**Tom:**
Either of your suggestions is fine. I like Start WS and End WS. But "level" is good too.
### 12. `mtc_n_strickler` and its three siblings — Manning Trapezoidal Channel

Currently: **`n for design rock size (Strickler method)`**, and identically for Blodgett, Bathurst
and Phillips & Ingersoll. The preposition carries the whole meaning and points both ways: n computed
FROM the rock size (intended), or the n to use WHEN sizing rock. Whichever a translator picks, they
pick it four times, consistently and invisibly.

Candidate: **`n from design rock size (Strickler method)`** across all four.

**Tom:**
Yes, "from".
### 13. `mtc_blodgett_v_bathurst` — Manning Trapezoidal Channel

Currently: **`Blodgett vs. Bathurst`**, which names a comparison. The cell does not report one:
`js/Manning.lib.js` writes `Bathurst`, `Blodgett`, `----` or `++++` — which method the relative
submergence selects, plus two range markers whose meaning (below range / above range) appears
nowhere on the page.

Candidate: **`Method selected (Blodgett or Bathurst)`** — longer, and this column is width-
constrained, so it may not fit. Two separate questions here, and the second one may be the bigger:
should `----` and `++++` get a legend?

**Tom:**
Leave as is or change "vs." to "or"
### 14. `bpn_topology_warn_short` — Branched Network verdict cell

Currently: **`Network`**. Its siblings in that slot are verdicts — `Low` for pressure, `OK`/`High`
elsewhere — so the convention is a judgement, and a bare noun judges nothing. It means the network
topology is broken.

Candidates: **`Broken`** · **`Check IDs`** · **`Unconnected`** · leave it.

**Tom:**
Either use your best judgement or explain to me better. I am unclear on this.
### 15. `ip_max_head` — Irrigation Pressure

Currently: **`Max. allow. pipe pressure`**. Two stacked abbreviations, and the second is the
ambiguous one: *allow.* expands to allowable (a limit) or allowance (a margin added). The tip
resolves it, but the tip is a separate key a translator may batch separately.

Candidate: **`Max. allowable pipe pressure`** — costs label width, which is your call.

**Tom:**
Leave as is. No ambiguity. Allowable and allowance result in the same thing.
### 16. `mhp_notes_3_def` — Microhydropower notes

Currently: *"...often falls around 4–6% where electricity is most valuable."* *Where* is locative or
conditional and both make sense; several languages need different conjunctions for the two.

Candidate: **`where electricity has a high value`**. A one-word change in a notes paragraph, so the
retranslation cost is one key.

**Tom:**
I don't know. Use your best judgement or explain to me better. 