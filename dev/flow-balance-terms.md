# What to call the System Flow graph and its two lines

Asked by Tom 2026-10-03. He chose the title "Flow balance" and leaned toward "Inflow / Outflow"
or "In/Out" for the lines, "only if Mary finds support". Researched by Mary (market researcher).
Every line is CITED below or marked as not found.

## Recommendation

1. **Keep the title "Flow balance".** It is EPANET's own: `TXT_SYSTEM_FLOW = ' System Flow Balance'`
   in the EPANET GUI's `Fgraph.pas`, and the OWA engine's report block is headed "Hydraulic Flow
   Balance". No one will be surprised.
2. **Keep "Produced" and "Consumed" for the two lines.** They are the labels the tool we mirror has
   always shown, the OpenEPANET forum answer to "how do I get the water balance" says "total produced
   and total consumed", and our own rule is to default to EPANET terminology.
3. **"Inflow / Outflow" has real support but means something different, so it is the worse swap.**
   See the table. Adopting it would put "Total Inflow / Total Outflow" (the engine's report, which this
   app prints verbatim) beside a graph whose "Outflow" would not equal that report's "Total Outflow".
4. **If a second reading is wanted, WaterGEMS's "Supplied / Demanded" is the closest professional
   vocabulary**, and would be the thing to adopt instead of "Inflow/Outflow". Not recommended now.
5. "In/Out" and "Flow in & out" found no support anywhere I looked.

## Evidence

| Source | Words | Notes |
|---|---|---|
| EPANET GUI source, `Fgraph.pas` (github.com/OpenWaterAnalytics/epanet-gui, epanet2w/Fgraph.pas, HEAD 8818a69) | Title "System Flow Balance"; lines `TXT_PRODUCED='Produced'`, `TXT_CONSUMED='Consumed'` | `GetSysFlow`: "Sums up flow produced and consumed". Loops JUNCS and RESERVS only (Uglobals.pas: JUNCS=0, RESERVS=1, TANKS=2), so tanks are in neither line. Demand > 0 adds to Consumed, else subtracts from Produced. **A reservoir with positive "demand" (filling) therefore counts as Consumed.** |
| EPANET 2.2 manual, ch. 9 (epanet-manual.readthedocs.io/en/latest/9_viewing_results.html) | "System Flow: Plots total system production and consumption versus time" | The manual says production/consumption in prose; it never prints "Produced" or "Consumed" as labels. |
| OpenEPANET forum, "EPANET Water balance", 22 Feb 2005 (openepanet.org/Topic/22313/water-balance) | Asker: "total water volumes supplied, consumed and the change in the sum of storages"; answer: "Quick way to get total produced and total consumed ... select 'System flow'" | Practitioners' own words are all of produced, supplied, consumed, storage. Tank change is done by hand. |
| OWA-EPANET 2.3 engine, `src/flowbalance.c` and `src/report.c` (github.com/OpenWaterAnalytics/EPANET, dev) | Report block "Hydraulic Flow Balance": Total Inflow, Consumer Demand, Demand Deficit, Emitter Flow, Leakage Flow, Total Outflow, Storage Flow, Flow Ratio | Total Inflow = negative junction demands + reservoirs supplying: the same set as the GUI's "Produced". **Total Outflow = consumer demand + emitters + leakage + reservoirs being filled, and tanks are a separate "Storage Flow"**, so it is not the GUI's "Consumed". Code comment calls it "the system flow balance". |
| WaterCAD/WaterGEMS, Bentley Communities thread "WaterGems Flow Stored and Flow Demanded" (via Scribd copy and search summary; I could not read the page body, re-verify before quoting) and Bentley docs "Calculation Summary" (docs.bentley.com .../9005-2.html) | Flow Supplied, Flow Demanded, Flow Stored | The docs page confirms "flow demanded" and "flow stored" as system flow results. The summary I found defines Supplied as flow out of reservoirs plus negative demands, Stored as net inflow to tanks, and "mass balance" as the display. Tanks get their own term. |
| WaterGEMS Pressure Zone Manager (docs.bentley.com .../9803.html) | "Net inflow" ("flow across the boundaries but not including flow originating from tanks and reservoirs"), "Demand" | Zone-level, not system-level. |
| Innovyze/Autodesk Info360 Help, "Mass Balance" (help-innovyze.refined.site/space/info360/15008061/Mass+Balance) | Inflow, Outflow, Storage, Usage | Per pressure zone, hourly/daily/monthly, an operations and water-loss concept: "Calculated Usage" = inflows minus outflows plus or minus storage change. Boundary-crossing sense. |
| AWWA M36 water audit, as reproduced in state guidance (mass.gov M36 training; California DWR Water Audit Manual 2016; NH DES water-balance guidance) | System Input Volume, Water Supplied, Authorized Consumption, Water Losses | Annual volumes, utility-wide. "Consumption" is a customer-side word there; "produced" is the old utility word for source output. A utility reader will map Produced to input and Consumed to authorized consumption plus losses, which is close but not equal here. |
| Sewer I/I (Wikipedia "Infiltration and inflow"; EPA-based definitions in WaterWorld and state sites) | "Inflow" = non-sanitary water entering a sewer from roof leaders, drains, covers | Collection-system word. In a water-distribution context the confusion is mild, but "Inflow" on a graph title or axis can read as unwanted water entering the pipes. Not a reason alone to reject it. |
| KYPipe (Pipe2000/2012 manuals; Eng-Tips thread) | Search summaries mention "total demand", "tank supply", "total supply", "inflow" | I could not read the PDFs (no PDF tool here) and Eng-Tips returned 403. **Not verified; no claim.** |

## Looked for, not found

- **Walski et al., *Advanced Water Distribution Modeling and Management*:** book and catalogue pages only; I could not read the text for these terms. No claim.
- **InfoWater Pro, Synergi Water, MIKE+:** no System Flow report wording surfaced beyond Info360 above.
- **epanet-js app:** the app's own reports not examined for these labels; only the toolkit docs came up.
- **QWater and GHydraulics (QGIS):** they hand the run to EPANET; I found no graph of this kind or its labels.

## Reading it as a practitioner would

- **Produced** is the word EPANET users already know from this exact graph and the old forum thread. Utility
  operations staff say "produced" for source output. It is slightly off for a negative demand, which is an
  inflow from outside, and it would not say "produced" of a tank draining, which is why tanks are absent.
- **Consumed** is slightly wrong exactly where EPANET's code is: a reservoir being filled counts as consumed.
  That is EPANET's behavior, inherited, and worth a one-line tip rather than a new word.
- **Inflow / Outflow** matches the 2.3 engine report and Info360 zone balances, but in both of those the
  quantities are not these two lines, and in tank work "net inflow" already means flow into a tank. On a
  graph that leaves tanks out of both lines, "Outflow" invites the reader to ask where the tank went.
- Whatever words are chosen, the tip should say tanks are in neither line. That is the reading skill the graph
  needs: while a tank drains it supplies the network but appears in neither line, so Consumed exceeds Produced,
  and while it fills the reverse. (My inference from the `GetSysFlow` code above, not a quoted source.)
