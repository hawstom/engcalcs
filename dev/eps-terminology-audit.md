# What this page calls the extended-period simulation

Tom, 2026-09-04, ruling on `lpn_energy_over` ("Over a run of {time}."): *"Use 'extended period
simulation' and audit the page for this terminology standardization Time Simulation in all its real
variants becomes EPS or extended etc."*

The one string he ruled on is changed. **This file is the audit, and it is a worklist for him rather
than a sweep already made**, because the sweep costs more than it looks and part of it would undo
rulings he made the same morning.

## The measurement

58 shipped English strings on the `lpn_`/`bpn_` pages contain *run*, *running*, *ran*, *period* or
*simulation*. That number is the reason this is an audit and not a find-and-replace: **most of them
are ordinary English and have nothing to do with naming the analysis.**

| Kind | Count | Examples |
|---|---|---|
| Ordinary English "run" — nothing to standardise | 21 | *"this site has run out of room"*, *"A search is already running"*, *"Runs the EPANET solver"*, *"pumps run at a speed other than…"*, *"Run the model with the EPANET engine"* |
| Names the EXTENDED-PERIOD ANALYSIS, using a variant | 20 | *Total run time*, *"the run finished"*, *"through the run"*, *"how long this network runs"*, *"from the start of the run to the end of it"* |
| Says *period* or *simulation* already | 8 | listed in full in §4 |
| Fire flow's own runs — a DIFFERENT thing | 13 | *"Fire flow run"*, *"This run solved the whole network {solves} times"*, *"Runs"* as a column heading |

**TOM RULED TWO OF THOSE FOUR GROUPS ON 2026-09-04, AND HIS RULING INVERTS WHAT THIS FILE FIRST
RECOMMENDED.** Of the 20 that name the analysis with a variant — *Total run time*, *"through the
run"* — he wrote *"I think these probably are okay as is."* Of the 13 fire-flow ones, the same. **So
the two expensive groups are closed and the §3 recommendation below is spent**: there is no ratchet
to argue for and no 442 retranslations to weigh, because the strings that would have paid for it are
ruled correct. What is left open is the group that already reaches for the words — *"I think some of
these need to be changed. Can you give me the full list to audit?"* — and it is §4.

**The fire-flow group is the one that must not be swept**, and it is nearly a quarter of the hits. A
fire-flow run is N steady-state solves, not an extended-period simulation; renaming it would say
something false. Same for `lpn_ff_calculate` ("Run") and the `Runs` column.

## 3. What the closed groups cost, kept because it is the argument that won

Of the 20 strings that name the analysis with a variant, **17 are already translated into 26
languages**, so rewriting them was 17 x 26 = **442 retranslations of text whose meaning does not
move** — and six of them Tom had ruled OK the same morning, a ruling being keyed on the exact English
it was made on, so each would have lapsed and come back to him unread. `lpn_time_duration` ("Total
run time") is also quoted by five other strings that tell the reader to *"Set a Total run time under
Time"*, so it could not have moved alone.

That arithmetic is why the file recommended a ratchet rather than a sweep. **Tom reached the same
place from the other direction and more cheaply — he simply read them and found them correct** — so
the recommendation is spent and only the record of the cost is worth keeping. It is the same
arithmetic that settled the em-dash question (60 x 26 = 1,560), and it is the number to reach for the
next time a sweep is proposed.

## 4. THE OPEN LIST: every shipped string that already says *period* or *simulation*

Tom: *"I think some of these need to be changed. Can you give me the full list to audit?"* This is
all eight, in full, in key order. **Two were changed on 2026-09-04 and are shown so the set is
complete.** A recommendation is given for each so the audit is one pass rather than two; each is a
suggestion and none is applied.

| Key | Translated | The string today | Recommendation |
|---|---|---|---|
| `lpn_energy_col_avg_kw_tip` | no | *The average power while this pump was running. It is not averaged over the whole period, so a pump that ran for half the day still reports the power it drew while it ran.* | **Leave.** "The whole period" here means the run's duration in contrast to the pump's on-time; it is doing arithmetic, not naming the analysis. |
| `lpn_energy_menu_tip` | no | *How long each pump ran, what power it drew and what it cost over the last extended period simulation.* | **Changed 2026-09-04.** Already says it. |
| `lpn_energy_over` | no | *Over an extended period simulation of {time}.* | **Changed 2026-09-04.** The string Tom ruled on. |
| `lpn_inp_drop_eps` | 26 | *This file describes a simulation that runs over a period of time. The part of this page that runs a network through time did not load, so only the starting conditions came in.* | **Change.** It defines the thing rather than naming it, in a sentence a reader meets when a file's own EPS could not be honoured — the one place the name is most useful. Suggested: *This file describes an extended period simulation. The part of this page that runs a network through time did not load, so only the starting conditions came in.* Shorter as well as more exact. |
| `lpn_time_no_engine` | 26 | *…Connect to the internet once to fetch the EPANET solver, which runs the whole period.* | **Change the last clause only**: *"…which runs an extended period simulation."* This is the sentence that explains why the built-in solver answers one instant, so it is teaching the distinction and should name what the other engine does. |
| `lpn_time_no_period` | 26 | *This project has no time period, so there is only one moment to show. Set a Total run time in Settings to calculate the network over time.* | **Change the first clause**: *"This project has no extended period simulation set, so there is only one moment to show."* Keep *Total run time* verbatim in the second sentence — it is the literal name of the control the reader must find, and Tom has ruled that control's own label correct. |
| `lpn_time_run_note` | 26 | *…This network takes so long to calculate over its whole time period that the results for the later times are not kept up to date while you work…* | **Leave.** "Its whole time period" is the network's duration, not the name of the analysis, and the sentence is already long. |
| `lpn_time_running` | 26 | *Working out the whole time period with the EPANET solver.* | **Change.** This is the progress line — what the page says while it is doing the thing — so it is the single best place to say the thing's name. Suggested: *Working out the extended period simulation with the EPANET solver.* |

**Four changes recommended, all translated, so 4 x 26 = 104 retranslations.** Three of the four are
the sentences that TEACH the distinction (why one moment, why the other engine, what is happening
now), which is the same test §3 arrived at from the cost side.

**Not applied. Waiting on Tom.**
