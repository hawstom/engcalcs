# Graphs

Tom's specification, 2026-09-12. ROADMAP Task 640 is the umbrella and points here; Task 599 (time
series) and Task 600 (contour, frequency, flow balance) are the per-graph work and keep their own
priorities. Nothing here is built.

## Where they live

**A `Graphs` submenu in the Water menu**, holding five rows: Time series, Profile, Contour,
Frequency, System flow balance.

**Every graph opens in the BOTTOM PANE as a tab**, exactly as Profile already does -- except
Contour, which is not a chart at all but a map LAYER, turned on and off under `Settings > Map and
page > Layers` (Task 639).

**Profile is already built** (`lpn_profile_*`) and moves under this menu rather than being written
again. It is listed here because a reader looking for the graphs must find all five in one place.

**Draw them the way the profile is drawn** -- the axis pair, unit label per axis, legend and
hand-rolled plot in `js/lpn-profile.js`. No chart library, nothing vendored. A second plotting idiom
on this page is the expensive mistake (Task 599 already records this).

## The five

- **Time series.** The selected property for each specified asset, of either Node or Link type, as
  one line per asset across a full-duration EPS -- or a partial duration as specified. Task 599.
- **Profile.** The selected property as one profile line at the current display time step,
  responding to the transport controls, for each specified asset of Node type. One of the property
  options is **Head with Elevation**, which draws TWO lines. Built.
- **Contour.** The selected Node property's colour symbology plotted on the MAP at the current
  display time step, responding to the transport controls. Task 600 carries the unknown: what is
  drawn where there are no nodes.
- **Frequency.** The selected property of either Node or Link type as one distribution line --
  property against per cent less than -- at the current display time step, responding to the
  transport. Task 600.
- **System flow balance.** **No options at all.** A special form of Time series showing two lines,
  total system inflow and total system outflow across the EPS. Task 600 holds the warning that its
  definition must be confirmed against EPANET's own help before any interface is written.

## What a graph tab carries

From Task 637 (the Graph button on the Properties box), and true of every graph tab:

- A selector for the **property to graph**.
- **Export as** image PNG, PDF, comma-separated values CSV, and spreadsheet ODS.
- Possibly a **time range** selector.

A tab opened from one element's Properties box is named for what it shows, e.g. `L435 Lake Trace`.

## Open

- PDF and ODS are FORMATS THIS SUITE HAS NEVER WRITTEN. Both are plausible without a vendored
  library and neither has been costed; do that before promising the row.
- "Each specified asset" needs a way to specify. The selection, a Find result and a typed list are
  all candidates and nothing is decided.
