# Terms

The concept list that translators work from. Each entry is named in plain words, with synonyms joined by "or"; the English term is one rendering among the others. Tom edits this file directly. `dev/scripts/glossary.json` is to be generated from it, never the reverse.

## How an entry is written

- The heading is the plain-words name. Synonyms stand side by side, joined by "or", with no parentheses, so no one word outranks the others.
- A comma before "or" only in a list of three or more.
- No units in a name. Meaning first, qualifier last ("per Manning").
- The English word may be one of the synonyms, unless it is a problem word such as head or halo.
- An "also called" line only when "or" would make the name unreadable. Long is fine.
- **Definition** appears only where Tom has written one, in his words.
- Suggestions only, no prohibitions.

## Uniqueness attention

Find unique names for each. A group is added only where two meanings sit side by side on the same map or in the same box, and a real collision has been seen. Necessary and few.

1. label, text, description, tag, ID
2. hydraulic grade line, head loss gradient, colour ramp

## Entries

### Flow quantity or amount of water passing per time

- English: flow
- id: `flow`

### Speed quantity or how fast the water moves

- English: velocity
- id: `velocity`

### Energy per weight of water as an elevation, height, or level

- English: head
- id: `head-family`

### Energy per weight of water lost along the way, as a drop in elevation, height, or level

- English: head loss
- id: `head-loss`

### Cross section area quantity divided by wetted perimeter quantity

- English: hydraulic radius
- id: `hydraulic-radius`

### Length of channel cross section outline or edge that the water touches

- English: wetted perimeter
- id: `wetted-perimeter`

### Coefficient, factor, or number for how rough, bumpy, or coarse the channel is, per Manning

- English: Manning roughness
- id: `manning-roughness`

### Friction factor or number for how much the pipe wall drags on the water in the Darcy-Weisbach formula

- English: friction factor
- id: `friction-factor`

### Coefficient or factor for how much less water flows or discharges than the ideal

- English: discharge coefficient
- id: `discharge-coefficient`

### Wall, dam, or barrier that water spills, pours, or overflows over

- English: weir
- id: `weir`

### Hole, opening, or gap that water pours, flows, or squirts through

- English: orifice
- id: `orifice`

### Loose rocks, stones, or boulders laid to keep the ground from washing, wearing, or eroding away

- English: riprap
- id: `riprap`

### Share, part, or fraction of the canal water that reaches the end

- English: conveyance efficiency
- id: `conveyance-efficiency`

### Water soaking, leaking, or oozing out through the bottom and sides

- English: seepage
- id: `seepage`

### Pipe, tube, or conduit from intake to turbine

- English: penstock
- id: `penstock`

### Whole, full, or total drop available before anything is lost

- English: gross head
- id: `gross-head`

### Drop that is left or remains after the losses

- English: net head
- id: `net-head`

### Share, part, or fraction of the water's power that becomes electricity

- English: plant efficiency
- id: `plant-efficiency`

### How evenly, equally, or uniformly the field gets its water

- English: distribution uniformity
- id: `distribution-uniformity`

### Rate of watering or irrigating expressed like rainfall intensity in depth per time

- English: application rate
- id: `application-rate`

### Little outlet, dripper, or nozzle that lets water out slowly

- English: emitter
- id: `emitter`

### Water height, level, or elevation on the side it comes from

- English: headwater elevation
- id: `headwater-elevation`

### Water height, level, or elevation on the side it goes to

- English: tailwater elevation
- id: `tailwater-elevation`

### Elevation, height, or level of the inside floor or bottom of the pipe

- English: invert elevation
- id: `invert-elevation`

### Slope, steepness, grade, or incline, as vertical change divided by horizontal change

- English: slope
- id: `slope`

### Smooth, calm, or orderly flow in layers

- English: laminar
- id: `laminar`

### Churning, swirling, or tumbling flow

- English: turbulent
- id: `turbulent`

### In-between flow, between smooth and churning

- English: transitional
- id: `transitional`

### Steep rocky slide, ramp, or channel for water

- English: rock chute
- id: `rock-chute`

### Steep slide, ramp, or channel for water

- English: chute
- id: `chute`

### Flow quantity per width

- English: unit discharge
- id: `unit-discharge`

### Middle, typical, or half-way rock size

- English: median rock size
- id: `median-rock-size`

### How the rock sizes are mixed, spread, or sorted

- English: gradation
- id: `gradation`

### How much empty space, gaps, or voids is between the rock, as space divided by rock plus space

- English: porosity
- id: `porosity`

### Pool, pond, or standing water that forms before the slide

- English: ponding
- id: `ponding`

### Total energy loss at points, spots, or places like joints or bends

- English: junction loss
- id: `junction-loss`

### Power from a river with no dam or storage

- English: run-of-river
- id: `run-of-river`

### Place where water is taken, drawn, or diverted from the river

- English: headworks
- id: `headworks`

### Line showing the total energy per weight of water, from elevation, pressure, and speed, as an elevation, height, or level

- English: energy grade line
- id: `egl`

### Water pipe branching or splitting off to the side of the main water pipe

- English: lateral
- id: `lateral`

### Big, main, or trunk pipe that feeds the small ones

- English: mainline
- id: `mainline`

### Channel with an odd-shaped cross section of a variable number of parts

- English: irregular channel
- id: `irregular-channel`

### Part, stretch, or section of the channel length

- English: reach
- id: `reach`

### Energy per weight of water from its speed, as an elevation, height, or level

- English: velocity head
- id: `velocity-head`

### Height, depth, or level of approaching water above the spill wall

- English: weir head
- id: `weir-head`

### Pad, slab, or floor at the bottom of the slide

- English: outlet apron
- id: `outlet-apron`

### Toward where the water comes from

- English: upstream
- id: `upstream`

### Toward where the water goes

- English: downstream
- id: `downstream`

### How many times as heavy or dense as water

- English: specific gravity
- id: `specific-gravity`

### Energy loss from rubbing, dragging, or scraping along the channel

- English: friction loss
- id: `friction-loss`

### Energy loss at spots, points, or places like joints or bends

- English: minor loss
- id: `minor-loss`

### Ratio of the driest quarter's average to the overall average

- English: low-quarter distribution uniformity
- id: `low-quarter-distribution-uniformity`

### Inside top, roof, or ceiling of a pipe

- English: crown
- id: `crown`

### Small gate, wall, or barrier that holds canal water up

- English: check structure
- id: `check-structure`

### The force per area of the water and the channel scrubbing, rubbing, or dragging against each other

- English: shear stress
- id: `shear-stress`

### Middle, centre, or balance point of the hole

- English: centroid
- id: `centroid`

### Calculator, tool, or program that finds and tells mathematical answers

- English: calculator
- id: `calculator`

### Putting, giving, or applying water on a field

- English: application (irrigation)
- id: `application-irrigation`

### How deep the flowing water is

- English: flow depth
- id: `depth`

### A tree-like arrangement of pipes with no loops

- English: branched network
- id: `branched-network`

### Pipe that splits, forks, or divides off another

- English: branch
- id: `branch`

### Flow used, taken, or consumed

- English: demand
- id: `demand`

### Energy per weight of water at the source when no water flows, as an elevation, height, or level

- English: static head
- id: `static-head`

### Most energy per weight of water a pipe is built to carry, as an elevation, height, or level above the pipe

- English: maximum allowable head
- id: `maximum-allowable-head`

### Energy per weight of water available at the source at the design flow, as an elevation, height, or level

- English: supply head
- id: `supply-head`

### Curve, graph, or line telling how the energy per weight of water at the source as an elevation, height, or level changes as flow changes

- English: supply curve
- id: `supply-curve`

### Pipes that are connected in loops, rings, or circuits

- English: looped network
- id: `looped-network`

### One stretch, length, or run of pipe

- English: pipe line
- id: `pipe-line`

### Most, highest, or largest pressure a pipe is made to take, hold, or withstand

- English: pressure rating
- id: `pressure-rating`

### Lowering, cutting, or easing pressure that is too high

- English: pressure reduction
- id: `pressure-reduction`

### Pressure or how hard the water presses, pushes, or squeezes

- English: pressure
- id: `pressure`

### Elevation, height, or level of a point

- English: elevation
- id: `elevation`

### Make a picture, drawing, or diagram of the network

- English: draw (a diagram)
- id: `draw-a-diagram`

### Junction or node where pipes meet, join, or connect and water can be taken out

- English: junction
- id: `junction`

### Node that is a water source whose level never moves, stays fixed, or holds constant

- English: reservoir
- id: `reservoir`

### Pipe network connection, meeting, or joining point

- English: node
- id: `node`

### Pipe network connector, such as a pipe, pump, or valve

- English: link
- id: `link`

### Bend, corner, or turning point in a drawn pipe

- English: vertex
- id: `vertex`

### Image, picture, or photo behind the drawing

- English: background image
- id: `background-image`

### Curve, graph, or line telling how the energy per weight of water added by a pump changes as its flow changes

- English: pump curve
- id: `pump-curve`

### Water network project, file, or model

- English: project (saved network)
- id: `project-saved-network`

### What-if version, case, scenario, or arrangement of circumstances

- English: scenario
- id: `scenario`

### Covering, layer, or surface on the channel's bottom and sides

- English: channel lining
- id: `channel-lining`

### Water wearing, washing, or scouring the ground away

- English: erosion
- id: `erosion`

### Show, fit, or frame the whole drawing

- English: zoom to extents
- id: `zoom-to-extents`

### Starting or preset value, before anyone changes it

- English: default (setting)
- id: `default-setting`

### Linked file that saves straight back where it came from

- English: connected file
- id: `connected-file`

### Tab, page, or sheet for each open network

- English: tab (project tab)
- id: `tab-project-tab`

### Software everyone is free to use, change, and share

- English: libre software
- id: `libre-software`

### Counting or adding one to a total

- English: count (tally)
- id: `count-tally`

### Small information, data, or note a website keeps in your browser

- English: cookie (browser storage)
- id: `cookie-browser-storage`

### Writing down, recording, or noting that something happened

- English: log (record)
- id: `log-record`

### Finding an answer by trying the middle of a range that holds it, keeping the half that still holds it, and repeating

- English: bisection
- id: `bisection`

### Solver or the part that works out the answer

- English: solver
- id: `solver`

### Small file saying where a picture sits, lies, or is placed on the earth

- English: world file
- id: `world-file`

### Tank, basin, vessel, or storage whose water rises and falls

- English: tank
- id: `tank`

### Valve, device, or fitting that controls flow or pressure

- English: valve
- id: `valve`

### Number, value, or setting that tells how a valve acts, works, or behaves

- English: valve setting
- id: `valve-setting`

### Value that this what-if version changes or replaces

- English: override (scenario value)
- id: `override-scenario-value`

### The name of these calculators

- English: EngCalcs (product name)
- id: `engcalcs-product-name`

### Row, range, or scale of colours that values are painted, shown, or coloured with

- English: colour ramp
- id: `colour-ramp`
- Uniqueness attention: group 2

### Where one colour stops or ends and the next starts or begins

- English: colour band limit
- id: `colour-band-limit`

### Equal intervals or same-size steps / equal counts or same number of items in each step

- English: equal intervals / equal counts
- id: `equal-intervals-equal-counts`

### Water needed to fight or put out a fire

- English: fire flow
- id: `fire-flow`

### Side view, cut, or section along a route

- English: profile (long section)
- id: `profile-long-section`

### Line showing how high, to what height or level, water would rise in a standpipe or open tube or channel

- English: hydraulic grade line
- id: `hgl`
- Uniqueness attention: group 2

### Energy per weight of water lost per length of pipe

- English: head loss gradient
- id: `head-loss-gradient`
- Uniqueness attention: group 2
- New entry, awaiting your OK

### Which edge or side the words line up on

- English: alignment (text)
- id: `alignment-text`

### Time-step by time-step multipliers or factors for water use

- English: demand pattern
- id: `demand-pattern`

### British or UK gallon

- English: imperial gallon
- id: `imperial-gallon`

### Valve that takes off, removes, or drops a fixed amount of pressure

- English: pressure breaker valve
- id: `pressure-breaker-valve`

### Project placed on the earth, with real-world coordinates

- English: georeferenced
- id: `georeferenced-project`
- New entry, awaiting your OK

### Project drawn on its own flat grid, with no place on the earth

- English: local
- id: `local-project`
- New entry, awaiting your OK

### Leave a value off the map when there is no room or space

- English: drop (a label)
- id: `drop-a-label`

### Simulation run or one go of working out the network

- English: run (a simulation)
- id: `run-a-simulation`

### Compute, calculate, or figure out

- English: work out (compute)
- id: `work-out-compute`

### Decimal separator or the mark, point, or comma between whole and fraction

- English: decimal separator
- id: `decimal-separator`

### How deep the water in the tank is, its water level or depth

- English: tank level
- id: `tank-level`

### Open, letting water through, passing, or flowing

- English: open (link status)
- id: `open-link-status`

### Share from a given source at a given point

- English: source trace
- id: `source-trace`
- Definition: Share from a given source at a given point.

### Place, point, or node whose water we follow or track

- English: trace node
- id: `trace-node`

### Words that join, connect, or combine search conditions

- English: query keyword (AND, OR)
- id: `query-keyword-and-or`

### Route, way, or line the side view follows

- English: path (profile route)
- id: `path-profile-route`

### Pressure before the fire-fighting water is drawn, taken, or used

- English: static pressure (fire flow)
- id: `static-pressure-fire-flow`

### Most or greatest fire-fighting water a point can give, supply, or deliver

- English: available fire flow
- id: `available-fire-flow`

### Short word, name, or tag stuck on a pipe or point

- English: tag (EPANET)
- id: `label-word-gus`
- Uniqueness attention: group 1

### Short code that names one item, like J-1 or P-12

- English: ID
- id: `element-id`
- Uniqueness attention: group 1
- New entry, awaiting your OK

### Rule, method, or formula for turning earth coordinates into paper, map, or flat coordinates

- English: projection (map)
- id: `projection-map`

### How the map shows, displays, or marks things with colour, size, and words

- English: symbology
- id: `symbology`

### Someone, a home, or a business that gets water from a pipe

- English: customer
- id: `customer`

### Potential energy per weight of water from elevation and pressure, as an elevation, height, or level

- English: hydraulic head (node value)
- id: `hydraulic-head`

### Words, values, or names the program writes beside a pipe or point

- English: label (map annotation)
- id: `label-sym-sally`
- Uniqueness attention: group 1

### Words, notes, or captions you type onto the map

- English: text (map annotation)
- id: `label-user-tessa`
- Uniqueness attention: group 1

### Note, remark, or description for people about one item

- English: description (asset notes)
- id: `label-long-dora`
- Uniqueness attention: group 1

### Checking, adjusting, or tuning the model against field readings or measurements

- English: calibration
- id: `calibration`

### Map of lines and bands, zones, or areas of equal pressure or something else

- English: contour (pressure plot)
- id: `contour-plot`

### How much is lost, or how much it matters, if one piece fails or breaks

- English: criticality
- id: `criticality`

### Water in compared with water out

- English: flow balance
- id: `flow-balance`

### Note saying someone else is editing or changing it

- English: edit lock
- id: `edit-lock`

### Saved arrangement, layout, or setup of boxes, panels, or windows

- English: workspace (saved layout of boxes)
- id: `workspace-layout`

### Height or level or elevation of the tank floor or bottom

- English: base elevation (tank bottom)
- id: `tank-base-elevation`

### Drawn point, line, or area with no water meaning, just a picture

- English: Shape
- id: `drawing-shape-fig`

### Does not apply here, no value, or not relevant

- English: N/A
- id: `not-applicable`

### White, light, or clear area, band, or edge around figures, shapes, or lettering

- English: halo
- id: `halo`
- Definition: Halo, aura, or background mask applied to every stroke.
