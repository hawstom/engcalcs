<?php
/**
 * Icons.lib.php — the suite's one icon set (ROADMAP Task 231).
 *
 * WHY SVG AND NOT EMOJI. The first pass used emoji, and Tom's review killed it on the two
 * icons that matter most here: a reservoir is an open-top tank and a pump is a circle with a
 * tangent discharge tail, and Unicode has neither. Those are the shapes his office already
 * draws and the shapes on this suite's own canvas, so the icon that teaches the notation beats
 * any approximate emoji. Three more reasons the switch was worth making everywhere rather than
 * only there:
 *   - Emoji render as somebody else's artwork. The same code point is a different picture on
 *     Windows, Android, iOS and Linux, so a set that looks balanced here looks scrappy for a
 *     visitor we never see — and 26 of this suite's 27 languages are read somewhere else.
 *   - Colour emoji cannot inherit their surroundings. These take `currentColor`, so one icon is
 *     correct on a light row, a hover row, and a greyed-out disabled row.
 *   - A stroked path stays legible at 14px. A colour emoji shrinks into a smudge.
 *
 * THE RULE THIS SET OBEYS: an icon is a PREFIX, never a replacement — everywhere except the `lpn_`
 * toolbar row. Icon-only saves no translation work (the label survives as the tip and the accessible
 * name) and spends first-time comprehension, which is the audience a web calculator exists for, so
 * it is never the default. The toolbar is the one place where the cost on the other side is real:
 * Tom, 2026-08-18, "they are taking up too much room, and we have to move them into tips." A menu
 * row is as wide as its longest label whatever it holds, so an icon there buys nothing; a nineteen-
 * button strip is the only chrome on this suite that runs out of width. Plan: dev/toolbar-icons.md.
 * The word is NOT deleted there, it moves — to the front of the title and to an aria-label, because
 * a button whose only content is an aria-hidden svg has no accessible name at all.
 *
 * SINGLE SOURCE. The paths live here once. PHP-rendered chrome calls ecIcon(); JS-built chrome
 * (js/looped-network.js) reads the same array from EngCalcs.icons, printed by
 * HeadersFooters.lib.php. Never re-draw a path in JS — that is two icons pretending to be one.
 *
 * DRAWING CONVENTIONS. 24×24 viewBox, stroke-based, no fill unless the shape is solid by
 * nature (a junction node, a cursor). Stroke width, caps and joins are set once on the <svg>
 * element in ecIcon(), so an individual path only ever carries geometry. A shape that must be
 * filled says so on its own element.
 *
 * These are original drawings. Tom referenced commercial icon sets while reviewing (Vecteezy,
 * Icons8) as examples of the SHAPE he wanted; nothing here is traced or copied from them, which
 * also keeps the suite's GPL clean of another party's licence terms.
 */

// The wrapper every icon is drawn in. Defined once and ALSO handed to JS (HeadersFooters.lib.php
// prints it as EngCalcs.iconOpenTag) so the stroke weight, cap style and viewBox are one decision
// rather than two that drift. Only geometry lives in $ec_icons below.
define('EC_ICON_OPEN_TAG', '<svg class="ec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
	. ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">');

$ec_icons = array(

	// ---- Menu bar ----
	'file'       => '<path d="M3 19V5h6l2 2h10v12z"/>',
	'edit'       => '<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="M14 6l4 4"/>',
	'insert'     => '<path d="M12 5v14M5 12h14"/>',
	// Stays an eye. Tom weighed a camera and two other paradigms against it and then withdrew the
	// question — "I forgot that I love what you already have now" (2026-08-08). Recorded so the
	// camera is not re-proposed: it was drawn, compared, and declined on the merits.
	'view'       => '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/>',
	// SIX TEETH at a 60° pitch. The count is a consequence of the rule, not the point of it: a gear
	// reads as a gear when TOOTH WIDTH EQUALS GAP WIDTH at the pitch circle, with matching fillets on
	// the inside and outside corners — which is what the real history of gear refinement converged
	// on. Six is the classic UI gear because at 16px a twelfth of the rim is under a pixel, so a
	// higher count spends every extra tooth on a serration nobody can resolve. Tom, 2026-08-18, once
	// the toolbar had gone wordless and the icons carried everything: "I would like the Settings icon
	// to be reworked to have 6 teeth according to the physical gear design principles we documented."
	//
	// ONE CLOSED OUTLINE whose edge IS the tooth profile — flank out, across the tip on the addendum
	// circle, flank in, along the root circle — which is how a real gear is shaped. Do not go back to
	// teeth drawn as separate radial strokes: those are limited by the gap between them, so tooth
	// count and tooth depth compete, and the mark reads as a sun or a ship's wheel long before it
	// reads as a gear.
	//
	// The geometry, all about centre (12,12) in the 24-unit box:
	//   tip (addendum) radius   9.8  Unchanged, so the mark still paints 21.6 x 20.4 and carries the
	//                                same weight in the toolbar as the 9-radius round marks beside it
	//                                ('globe', 'help', 'info'); a toothed silhouette needs the extra
	//                                0.8 to weigh the same as a plain disc.
	//   root (dedendum) radius  6.6  3.2 units of tooth depth. The 2-unit stroke swallows exactly one
	//                                of them — the notch a reader sees bottoms out on the root
	//                                circle's outer edge — so the visible notch is 2.2 deep and 4.7
	//                                wide at its mouth, both well clear of the ~1-unit floor.
	//   pitch radius            8.2  The mid-radius, where the parity is measured.
	//   tooth half-width       10° at the tip, 20° at the root, interpolating linearly to 15° at the
	//                                pitch circle: tooth 4.294 units, gap 4.294 units — exact parity.
	//                                The same two angles give a 1.33:1 root-to-tip taper, so the tooth
	//                                is wider at the root than at the tip as a real one is, and the
	//                                tip still keeps a 1.4-unit land rather than closing to a point.
	//                                Teeth centre on 0°, so the crisp tips sit on the horizontal axis
	//                                and the mark stays a touch wider than tall.
	//   bore radius             2.8  Unchanged. The bore is what no sun and no flower has, and at 3.6
	//                                units of clear width it survives 16px.
	// The fillets are free and must stay that way: stroke-linejoin="round" on the shared open tag
	// rounds all 24 corners by half the stroke width, inside corners and outside corners alike, which
	// is exactly the chamfer parity the rule asks for. Never override the join on this path.
	//
	// If it is ever redrawn again, chase the width parity and the fillets, not the count — the count
	// is a symptom. Derived from the gear itself; not traced from anyone else's icon.
	'settings'   => '<path d="M18.2 14.26L21.65 13.7A9.8 9.8 0 0 0 21.65 10.3L18.2 9.74A6.6 6.6 0 0 0 17.06 7.76L18.3 4.49A9.8 9.8 0 0 0 15.35 2.79L13.15 5.5A6.6 6.6 0 0 0 10.85 5.5L8.65 2.79A9.8 9.8 0 0 0 5.7 4.49L6.94 7.76A6.6 6.6 0 0 0 5.8 9.74L2.35 10.3A9.8 9.8 0 0 0 2.35 13.7L5.8 14.26A6.6 6.6 0 0 0 6.94 16.24L5.7 19.51A9.8 9.8 0 0 0 8.65 21.21L10.85 18.5A6.6 6.6 0 0 0 13.15 18.5L15.35 21.21A9.8 9.8 0 0 0 18.3 19.51L17.06 16.24A6.6 6.6 0 0 0 18.2 14.26Z"/><circle cx="12" cy="12" r="2.8"/>',

	// ---- File ----
	'new'        => '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
	'open'       => '<path d="M3 19V5h6l2 2h8v3"/><path d="M3 19l3-8h18l-3 8z"/>',
	'save'       => '<path d="M4 4h12l4 4v12H4z"/><path d="M8 4v5h7V4"/><path d="M8 20v-7h8v7"/>',
	// Tom, 2026-08-08: "Sometimes a disk with a pencil. You used a page with a pencil." Correct —
	// Save as is a variant of Save, so it must wear Save's disk, not a different object entirely.
	// Second pass, same day: "we can afford to depict a little of the lower label square." He is
	// right — the shutter alone is the top half of a floppy, and a viewer reading only the top half
	// is reading a rectangle. The label is what makes the object a disk. Here it runs partway and
	// then disappears under the pencil, which is what an occluded object should do; on saveall
	// nothing occludes it, so it is drawn whole.
	'saveas'     => '<path d="M4 4h10l4 4v4"/><path d="M4 4v16h8"/><path d="M8 4v4h6"/><path d="M8 20v-5h4"/><path d="M21.5 12.5l-6 6-3 1 1-3 6-6z"/>',
	'saveall'    => '<path d="M8 3h9l4 4v11H8z"/><path d="M12 3v4h6"/><path d="M11.5 18v-5h6v5"/><path d="M17 18v3H3V7h3"/>',
	'revert'     => '<path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1"/><path d="M21 3v5h-5"/>',
	'close'      => '<path d="M6 6l12 12M18 6L6 18"/>',

	// ---- Edit ----
	'undo'       => '<path d="M9 7l-5 5 5 5"/><path d="M4 12h11a5 5 0 0 1 0 10h-4"/>',
	'del'        => '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 14h10l1-14"/><path d="M10 11v6M14 11v6"/>',
	// Not a broom: a network with an X through it says WHICH thing is being deleted, which is the
	// entire difference between this row and the Delete tool directly above it.
	'delnetwork' => '<circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><path d="M5 8v8"/><path d="M13 8l8 8M21 8l-8 8"/>',
	// Tom, 2026-08-08, on the warning triangle: "I love it! And this is a very useful button."
	// It is the one icon here that signals danger rather than naming an action; that is deliberate.
	'wipe'       => '<path d="M12 3L2 21h20z"/><path d="M12 10v5"/><path d="M12 18v.4"/>',

	// ---- The five drawing tools: these MAP THE MAP ----
	// Drawn from Tom's own sketch, 2026-08-08. An open-top tank with the side walls carried up
	// past the water line — the shape his office draws and a shape a first-time visitor reads as
	// "water container" without being told. EPANET's downward triangle scales smaller but has to
	// be learned first; that trade goes the other way on a page whose whole audience is new.
	// Walls widened from x:6-18 (12 wide, margin 6) to x:3-21 (18 wide, margin 3) 2026-08-09, per
	// Tom: "as wide as you can make it without violating the space constraints of the standard
	// menu icon in our palette (about 50% wider)". A 3-unit margin is this set's own established
	// convention at this size, not a new one -- 'file', 'image' and 'zoom' all use it. This is the
	// ONE shared source for both the toolbar button and the map symbol (js/looped-network.js,
	// ROADMAP Task 146.10) -- see RESERVOIR_HALF_W there for how the map compensates its own box
	// width so widening this shared path doesn't also widen the map's rendering.
	'reservoir'  => '<path d="M3 9h18v11H3z" fill="currentColor" stroke="none" opacity=".18"/><path d="M3 4v16h18V4"/><path d="M3 9h18"/>',
	// A STORAGE TANK (ROADMAP Task 248, 2026-08-14), and its whole job is to not be the reservoir
	// directly above it. Two independent cues, so it survives greyscale and a red-green colour-blind
	// reader — the same test Task 146.10 was written to pass:
	//   1. CLOSED, not open. The reservoir's walls run up past the water and stop; this one has a
	//      domed roof over it. That is the real physical difference between a basin and a tank, and
	//      it is the one a person can name without being taught a symbol.
	//   2. TALL AND NARROW where the reservoir is wide and short (x:5–19 against x:3–21, and the map
	//      box in js/looped-network.js pushes the proportion further). "The proportion is the
	//      identity" is the pump's own lesson four entries down, and it applies twice as hard when
	//      the two shapes are otherwise siblings.
	// The dome, not a flat lid: a flat one makes the mark a rectangle with a line in it, which reads
	// as a box before it reads as a tank. Same shared-path rule as the reservoir — this ONE string
	// draws both the toolbar button and the map symbol, and the map's backdrop patch traces the
	// identical outline, so a change here needs the matching `d` in buildNodeEls() changed with it.
	'tank'       => '<path d="M5 11h14v9H5z" fill="currentColor" stroke="none" opacity=".18"/><path d="M5 6q7-3.5 14 0v14H5z"/><path d="M5 11h14"/>',
	// A VALVE (ROADMAP Task 248 phase 2, 2026-08-14). The BOWTIE, and there was never a second
	// candidate: it is what every P&ID, every hydraulic schematic and EPANET itself draw, so this
	// is the one icon in the set that a water engineer already knows before arriving. Two solid
	// triangles meeting point-to-point at the centre of the line, with a stem and handwheel on top.
	//
	// Three things it has to survive, all of which drove the geometry rather than decorating it:
	//   1. IT SITS ON A LINE, not on a page. A valve is a LINK, like the pump, so this mark is
	//      drawn ON the pipe and rotated along it (positionPumpSymbol() in js/looped-network.js).
	//      That is why the bowtie is horizontal and centred: rotated to any angle it still reads,
	//      where an upright symbol would only read on a horizontal run.
	//   2. GREYSCALE. Against the pump it is angular where the pump is round, and against a pipe
	//      it has area where a pipe is a stroke. Neither cue is colour, which is the same test the
	//      tank above had to pass.
	//   3. THE WAIST MUST NOT CLOSE UP AT 14px. The two triangles meet exactly at x=12 with a
	//      2-unit stroke, so the pinch reads as a pinch rather than blurring into one hexagon.
	//      Widening the triangles to touch a fuller box was tried and lost the waist.
	// The stem is short and the wheel is a plain bar -- a circular handwheel at this size adds a
	// second round shape to an icon whose whole job is to not be the pump.
	// Same shared-path rule as the reservoir and the tank: this ONE string draws the toolbar
	// button and the map symbol both.
	'valve'      => '<path d="M4 5v14l8-7z" fill="currentColor" stroke="none" opacity=".18"/><path d="M20 5v14l-8-7z" fill="currentColor" stroke="none" opacity=".18"/><path d="M4 5v14l8-7z"/><path d="M20 5v14l-8-7z"/><path d="M12 12V7"/><path d="M8 4h8"/>',
	// Casing plus a discharge tail leaving it on the top tangent — the tangency is what makes this
	// read as a pump rather than as a magnifier.
	//
	// Four passes (Tom, 2026-08-08), and the shape only got simpler each time. A long tail pushed
	// the casing off-centre. A short tail drawn as a box turning upward collapsed into a blob at
	// 15px — "the arrowhead is too much to fit. It's like a 6, but with a horizontal tail, not
	// upward." Then, with the tail finally horizontal, it was too short: "about twice as wide...
	// shrink the circle a little so this ends up wide or squat instead of square."
	//
	// That last note is the real design lesson, and it is not about pumps. Every other icon here
	// fills a square, so this one was drawn to fill a square too — and a pump that fills a square
	// is mostly casing, which makes it a circle with a nub. Letting it run WIDE is what separates
	// it at a glance from every round icon in the set. The proportion is the identity.
	// Tail shortened 40% on the fifth pass — Tom asked for "25% or so... I hesitate to say 50%,
	// though I am leaning that way", so this splits his stated range toward the lean. The casing
	// moved right at the same time to keep the whole mark centred in the box, which shortening
	// alone would have broken. Still 1.4:1 wide, so it keeps the squat proportion that is its
	// identity; the number is a one-line change if he wants the other 10%.
	'pump'       => '<circle cx="9.8" cy="12.5" r="5"/><path d="M9.8 7.5H19.1"/>',
	// Solid, because a junction is a node and the canvas draws it solid.
	'junction'   => '<circle cx="12" cy="12" r="4.5" fill="currentColor" stroke="none"/>',
	// A run between two nodes — the thing you are actually about to place.
	'pipe'       => '<path d="M7.4 16.6l9.2-9.2"/><circle cx="5" cy="19" r="2.4"/><circle cx="19" cy="5" r="2.4"/>',
	'text'       => '<path d="M5 6h14"/><path d="M12 6v14"/><path d="M9 20h6"/>',

	// ---- Backdrop ----
	'image'      => '<path d="M3 5h18v14H3z"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4"/>',
	'scale'      => '<path d="M4 10V4h6"/><path d="M20 14v6h-6"/><path d="M4 4l6.5 6.5M20 20l-6.5-6.5"/>',
	'position'   => '<path d="M12 3v18M3 12h18"/><path d="M12 3l-2.5 2.5M12 3l2.5 2.5M12 21l-2.5-2.5M12 21l2.5-2.5M3 12l2.5-2.5M3 12l2.5 2.5M21 12l-2.5-2.5M21 12l-2.5 2.5"/>',

	// ---- Insert, misc ----
	// A little network, not a sparkle: the command draws a network, so the icon draws one.
	'example'    => '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="9" r="2"/><circle cx="10" cy="19" r="2"/><path d="M6.9 6.4l10.2 2.2M5.6 8l3.8 9"/>',
	'devtest'    => '<path d="M10 3v6.5L4.5 20h15L14 9.5V3"/><path d="M9 3h6"/><path d="M7.6 15h8.8"/>',

	// ---- View ----
	// Zoom to fit: four corner brackets opening outward around the content. Tom flagged the
	// magnifier as not-simplifiable and pointed at a zoom-to-extents mark; this is that idea —
	// the frame growing to meet the drawing, with no lens to misread as plain "zoom in".
	'zoom'       => '<path d="M3 9V3h6"/><path d="M21 9V3h-6"/><path d="M3 15v6h6"/><path d="M21 15v6h-6"/><path d="M9.5 9.5h5v5h-5z"/>',
	'labels'     => '<path d="M20.6 13.4L13 21l-9-9V4h8z"/><circle cx="7.6" cy="7.6" r="1.5"/>',
	// A LONG-SECTION, not a line chart (Tom, 2026-08-18: "a jagged profile arising from the
	// baseline"). The difference is that the ground line is CLOSED down to the datum at both ends,
	// so the mark is a body of earth with a surface on top — which is what a profile sheet actually
	// draws. A chart would need axes; an open polyline would be a sparkline; either would say
	// "graph" where this says "ground". No axes here for that reason, and no gridlines.
	//
	// Relief amplitudes are 6, 5, 9, 7 and 4 units, all at or above the 4-unit floor a 24-unit box
	// can still show at 16px (0.67 px per unit — a 2-unit notch is one pixel and simply disappears).
	// The surface runs 16 -> 10 -> 15 -> 6 -> 13 -> 9, so it climbs overall while still falling twice:
	// a monotonic rise reads as a trend line, and a symmetric hump reads as a mountain.
	// ONE path, filled AND stroked via fill-opacity rather than the set's usual patch-plus-outline
	// pair. Every other translucent shape here needs two because its outline is open (the reservoir's
	// walls, the tank's dome); this outline is closed and identical to its own patch, and two copies
	// of one `d` is a drift waiting to happen.
	'profile'    => '<path d="M3 20V16l4-6 3 5 4-9 3 7 4-4v11z" fill="currentColor" fill-opacity=".18"/>',
	// A magnifying glass — the physical object, lens and handle. The note above 'zoom' explains why
	// a lens was WRONG there: it reads as "make bigger", which zoom-to-extents does not do. Find is
	// the command a magnifier has always meant, so it belongs here and nowhere else in this set.
	'find'       => '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.4 15.4L21 21"/>',
	'units'      => '<path d="M2 8h20v8H2z"/><path d="M6 8v4M10 8v3M14 8v4M18 8v3"/>',
	// A solid pointer plus one click arc. Tom: "a mouse arrow and click circle fragment. Or maybe
	// just a solid mouse arrow icon." Solid, because a hollow cursor reads as an outline shape
	// rather than as the pointer itself.
	'select'     => '<path d="M6 3v14.5l3.8-3.6 2.9 6.3 2.6-1.2-2.8-6.1 4.5-.5z" fill="currentColor" stroke="none"/><path d="M15.5 4.2a5.5 5.5 0 0 1 4.3 4.4"/>',
	'duplicate'  => '<path d="M9 9h12v12H9z"/><path d="M5 15H3V3h12v2"/>',

	// ---- Panes (Task 434) ----
	// A TWIN PAIR, and they are only ever read against each other, so the pair is the design rather
	// than either icon (Tom, 2026-08-18: "Bottom pane and right pane can have twin partition-like
	// icons at the extreme right"). One window frame, one partition, the docked pane shaded — the
	// difference between them is which way the partition runs, which is the only difference between
	// the two things themselves.
	//
	// The frame is 18x14 (x:3-21, y:5-19), landscape like the window it stands for; a square frame
	// would make the two bands equally plausible and kill the cue. Each band is about 40% of its own
	// axis, which is roughly what each pane really takes: bottom 6 of 14, right 7 of 18. Those are
	// not the same number because what a reader weighs is the CLEAR band inside the strokes, and a
	// 2-unit stroke eats twice as much from the short axis — 72 and 70 square units respectively,
	// so the two shaded areas land within 3% of each other and the pair reads as balanced.
	// The clear band is 4 units either way, which is the floor: at 16px that is under 3px, and a
	// 3-unit band would close up into a doubled line.
	'pane-bottom' => '<path d="M3 13h18v6H3z" fill="currentColor" stroke="none" opacity=".18"/><path d="M3 5h18v14H3z"/><path d="M3 13h18"/>',
	'pane-right'  => '<path d="M14 5h7v14h-7z" fill="currentColor" stroke="none" opacity=".18"/><path d="M3 5h18v14H3z"/><path d="M14 5v14"/>',

	// ---- Time playback transport (Task 248) ----
	// The tape-transport convention, drawn straight and deliberately not reinvented. This set's
	// preference for a physical referent does not apply: there is no object here, only a mark every
	// user has read since cassette decks, and the whole value is instant recognition. All four are
	// solid, so each carries its own fill="currentColor" stroke="none" against EC_ICON_OPEN_TAG —
	// the reason is spelled out on 'select' above.
	//
	// PLAY IS BIGGER THAN PAUSE ON PURPOSE. A triangle inside the pause bars' own 12 x 14 box holds
	// 84 square units against their 112 — a 25% deficit, and it looks shrunken sitting next to them
	// in the same strip. At 13.5 x 16 the triangle holds 108, within 4% of the bars, which is what
	// makes the pair look like one weight. Horizontally the triangle's box is centred on x 13.05
	// while its centroid is at 10.8; the eye splits the difference at about 11.9, so the mark reads
	// centred without the box being centred. A triangle centred by its box looks pushed left.
	//
	// step-back and step-fwd are EXACT MIRRORS through x = 12 (every coordinate is 24 minus its
	// partner's), because a transport pair that is only approximately symmetric reads as a mistake.
	// The bar is the part that fails first at 16px, so it is 3.6 units wide -- 2.4px, against the
	// 2-unit floor this box can show -- and the triangle stops 2 units short of it so the apex does
	// not weld itself to the bar at toolbar size.
	'play'       => '<path d="M6.3 4v16l13.5-8z" fill="currentColor" stroke="none"/>',
	'pause'      => '<rect x="6" y="5" width="4" height="14" fill="currentColor" stroke="none"/>'
	              . '<rect x="14" y="5" width="4" height="14" fill="currentColor" stroke="none"/>',
	'step-back'  => '<rect x="3.2" y="5" width="3.6" height="14" fill="currentColor" stroke="none"/>'
	              . '<path d="M20.8 5v14l-12-7z" fill="currentColor" stroke="none"/>',
	'step-fwd'   => '<path d="M3.2 5v14l12-7z" fill="currentColor" stroke="none"/>'
	              . '<rect x="17.2" y="5" width="3.6" height="14" fill="currentColor" stroke="none"/>',

	// RUN: work the whole time period out (ROADMAP Task 248). A LIGHTNING BOLT, which is EPANET's
	// own Run Analysis mark and the shape already drawn on every mains box and warning plate in the
	// world -- a real object, not an abstract glyph. Deliberately NOT a second triangle: it sits two
	// icons from Play in the same group, and two triangles would read as two speeds of the same
	// command rather than as "work it out" beside "watch it".
	// Solid, like the four transport marks beside it, so the group reads as one weight; the return
	// stroke is offset from the outbound one (13 down, 9 up) so the zigzag keeps a visible waist at
	// 16px instead of closing into a bar.
	'run'        => '<path d="M13 2L4 14h6l-1 8 9-12h-6z" fill="currentColor" stroke="none"/>',

	// LIBRARIES: an open book (ROADMAP Task 462). A REAL OBJECT, and the one every library sign in
	// the world is drawn as -- two page blocks meeting at a spine.
	// The three books on a shelf that shipped first are gone: at 16 px their 3-unit widths and
	// 1.5-unit gaps were narrower than the 2-unit stroke, so the uprights merged and the leaning
	// third book crossed them. Tom: "it looks maybe like a shelf of books, but it's hard to make
	// out." Nothing here is narrower than the stroke twice over.
	'library'    => '<path d="M12 7.5C9.6 5.6 6.8 5 3.5 5.2V16.5C6.8 16.3 9.6 16.9 12 18.8"/>'
		. '<path d="M12 7.5C14.4 5.6 17.2 5 20.5 5.2V16.5C17.2 16.3 14.4 16.9 12 18.8"/>'
		. '<path d="M12 7.5V18.8"/>',

	// PROJECT: a plan set, unrolled (ROADMAP Task 467). A REAL OBJECT, and the one this trade
	// means by "the project" -- Tom, 2026-08-21: *"I'd make it unrolled as much as possible... If
	// you can make maybe one end of the roll with writing depicted on the outside, that would be
	// very 'plan set'."* So the sheet is flat and carries the drawing, and only its far end is
	// still rolled.
	// **NOT A ROLLED TUBE**, which was the other half of his sketch and is the one shape this page
	// cannot use: a cylinder in a water-network toolbar reads as a PIPE, and 'pipe' is two icons
	// away. Nor a hard hat (says construction, not water) and not a water drop (says water, not
	// the job) -- both were considered, and the roll is the one that means "the whole job".
	// The two lines inside are the drawing, at the density every file-with-text icon uses; the
	// opening in the rolled end is what keeps it from reading as a page with a bent corner.
	'project'    => '<path d="M15.5 6H2.5V18H15.5"/>'
		. '<path d="M15.5 6C19.2 6 21.2 8.6 21.2 12C21.2 15.4 19.2 18 15.5 18"/>'
		. '<path d="M16.9 12C16.9 10.2 18 9.1 19.4 9.4"/>'
		. '<path d="M6 9.6H12.2"/><path d="M6 14.4H10.2"/>',

	// ---- Shared site chrome ----
	// Tom, 2026-08-08, on the 🔗 emoji: "I would prefer something cleaner... or a horizontal
	// version of that." Two interlocking horizontal capsules — a chain link lying flat, which is
	// what a link in a horizontal toolbar should look like.
	'link'       => '<path d="M13 8.5h3.5a3.5 3.5 0 0 1 0 7H13"/><path d="M11 15.5H7.5a3.5 3.5 0 0 1 0-7H11"/><path d="M8.5 12h7"/>',
	'restore'    => '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3 3v5h5"/>',
	'print'      => '<path d="M7 9V3h10v6"/><path d="M3 9h18v8H3z"/><path d="M7 14h10v7H7z"/>',
	'install'    => '<path d="M12 3v12"/><path d="M7 10.5l5 5 5-5"/><path d="M4 20h16"/>',
	'globe'      => '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18a13 13 0 0 1 0-18z"/>',
	'check'      => '<path d="M4.5 12.5l5.5 5.5L20 6.5"/>',
	// A camera: body, lens, and the raised shutter-housing bump over the lens that every
	// compact camera has. It marks the CLEAN MAP command (ROADMAP Task 253), whose whole
	// purpose is taking a screenshot. This does not reopen the 2026-08-08 question above --
	// that one was whether the VIEW menu should be a camera instead of an eye, and it stays
	// an eye. Two different commands, two different objects.
	'camera'     => '<path d="M3 8h4l1.5-2.5h7L17 8h4v12H3z"/><circle cx="12" cy="13.5" r="3.5"/>',

	// The other two rows of the lpn Help menu. Drawn rather than left blank: openMenu() reserves an
	// icon column so a bare row would still align, but one iconed row beside two empty ones in a
	// three-row menu reads as unfinished.
	//
	// 'info' is a stroked i-in-a-circle. It shares the outer circle with 'help' above, which is
	// acceptable only because they never compete: they sit two rows apart in the same short menu,
	// where position disambiguates them, and the label is right there.
	'info'       => '<circle cx="12" cy="12" r="9"/><path d="M12 11.2v5.4"/><path d="M12 7.6v.4"/>',
	'mail'       => '<path d="M3 6h18v12H3z"/><path d="M3.6 6.6l8.4 5.9 8.4-5.9"/>',
	// A LIFE PRESERVER, not a question mark, for the lpn Help menu (Tom, 2026-08-13). The obvious
	// choice would have been "?" in a circle -- and it is the wrong one HERE, because this suite
	// already spends "?" on something else: every .ec-tip tooltip glyph on every page is a "?", so a
	// "?" on the menu bar would read as "this control has a tooltip" rather than "help lives here".
	// A life ring collides with nothing in the set and is the standard help mark besides.
	//
	// Two concentric circles plus four spokes on the diagonals, so it stays readable at 16px where a
	// drawn-in rope texture would silt up. Stroked outline in currentColor like the rest of the set.
	// FOUR PAINTED BANDS, not spokes (Tom, 2026-08-13: "would look more correct with wider dark
	// bands... often depicted as equal eights of the circle"). He is right, and the first attempt was
	// wrong in kind, not degree: four thin diagonal lines between two rings is a ship's wheel. A
	// buoy's bands are painted ACROSS the full width of the ring, which is why they have to be as
	// thick as the ring itself.
	//
	// Drawn as ONE dashed circle rather than four arc paths. Stroke width 6 on r=7 fills r=4..10 --
	// exactly the ring's cross-section, bounded by the two outlines below. The circumference is
	// 43.98, so an eighth is 5.4978, and a 5.5/5.5 dash pattern paints four eighths and leaves four.
	// dashoffset -2.75 is half a segment, which centres the bands on the 45 degree diagonals; without
	// it they would start there instead and sit visibly askew.
	//
	// stroke-linecap MUST be butt here, overriding the round cap the shared open tag sets: a round
	// cap on a 6-wide stroke adds a 3-unit bulge to each end of all four bands, which closes the
	// white gaps and turns the ring into a solid disc.
	//
	// Bands first, outlines second, so the two circles draw ON TOP and stay unbroken.
	'help'       => '<circle cx="12" cy="12" r="7" stroke-width="6" stroke-linecap="butt"'
	              . ' stroke-dasharray="5.5 5.5" stroke-dashoffset="-2.75"/>'
	              . '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/>',
	// The ONE brand mark in this set, and the one exception to "stroked outline, currentColor".
	// GitHub's Octocat is a filled silhouette; redrawing it as strokes would make it unrecognizable,
	// and recognition is the entire job here -- the mark is what tells a passing engineer that the
	// source really is there (Task 244). It still takes currentColor, so it greys and hovers with
	// its row like every other icon. Official mark, used only to link to our own GitHub repository.
	'github'     => '<path fill="currentColor" stroke="none" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
);

/**
 * Render one icon as inline SVG.
 *
 * aria-hidden, always: the icon is a prefix to a word that is right there and already read by a
 * screen reader. Announcing it a second time as an image is noise, not access.
 *
 * @param string $name Key in $ec_icons. An unknown name renders nothing rather than a broken
 *                     glyph — a missing icon should degrade to the label alone, which still works.
 * @param string $cls  Extra class names appended to 'ec-icon'.
 */
function ecIcon($name, $cls = '') {
	global $ec_icons;
	if (!isset($ec_icons[$name])) { return ''; }
	$open = EC_ICON_OPEN_TAG;
	if ($cls !== '') {
		$open = str_replace('class="ec-icon"', 'class="ec-icon ' . htmlspecialchars($cls, ENT_QUOTES, 'UTF-8') . '"', $open);
	}
	return $open . $ec_icons[$name] . '</svg>';
}
