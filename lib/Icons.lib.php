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
	// **THE EYE IS NOT THE MENU BAR'S ANY MORE, and it is kept because other rows still draw it.**
	// View became Map on 2026-08-27 (Task 543) and took a push pin with it — see 'pin' below. The
	// eye stays exactly as it was for the rows that are genuinely about seeing: the street-map and
	// satellite toggles.
	//
	// Stays an eye. Tom weighed a camera and two other paradigms against it and then withdrew the
	// question — "I forgot that I love what you already have now" (2026-08-08). Recorded so the
	// camera is not re-proposed: it was drawn, compared, and declined on the merits.
	'view'       => '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/>',
	// **THE MAP MENU'S PIN: A MARKER STANDING ON A FOLDED MAP** (Tom, 2026-08-28, choosing from
	// four renderings: *"Map icons A, B, and C all look nice"*, then *"I meant B."*)
	//
	// **THIS IS THE EXACT GEOMETRY HE APPROVED. DO NOT "IMPROVE" IT.** It was redrawn once between
	// his choice and the commit -- the map moved down two units so the aperture would hold further
	// down the size range -- and he stopped it: *"Please oh please don't change it. I said I liked
	// it."* Quite right. An approval is of a PICTURE, not of a direction, and a redraw after it
	// hands him something he has never seen while telling him he chose it.
	//
	// **RENDER, NEVER DESCRIBE.** The size the menu bar draws is 17px and that is what decides an
	// icon here. Four were drawn and rendered at 17/24/48/96/192 before he chose:
	//     node dev/scripts/icon_png_preview.js pin
	//   A  folded map + compass in the top-right corner. He liked it and it does NOT survive 17px --
	//      the map goes to a smudge and the compass to a dot. Good from 48px up, so it is the one to
	//      reach for if this set ever needs a large mark.
	//   B  **this one.** The marker's aperture closes below about 24px, which is a KNOWN and ACCEPTED
	//      property of the drawing he picked, not a defect to go and fix.
	//   C  a marker standing on a trapezoidal map plane. The most legible of the four at 17px, and
	//      the fallback if this one is ever judged too busy -- by him.
	//   D  a world map traced inside a square frame, his own later suggestion. **Not shipped and not
	//      attempted properly:** a freehand "trace" of continents from memory is invented shape, and
	//      it rendered as blobs twice. A real one needs real coastline coordinates (Natural Earth
	//      110m is public domain and would be clean; tracing a reference image would not be, per
	//      this file's provenance rule at the top). It would still leave ~11 units of interior
	//      inside a 2-unit frame at 17px.
	//
	// The white shape is a KNOCKOUT: it fills the marker's body so the map's fold lines do not run
	// through it, and the stroked outline is drawn over it. It is the one colour in this set that
	// does not follow currentColor, so this icon assumes a light ground -- which every surface it is
	// drawn on today is.
	'pin'        => '<path d="M1.5 8.6V21.5L8 18.6L15.5 21.5L22.5 18.6V5.7L15.5 8.6L8 5.7Z"/>'
		. '<path d="M8 5.7V18.6"/><path d="M15.5 8.6V21.5"/>'
		. '<path fill="#fff" stroke="none" d="M12 2.2A4.6 4.6 0 0 1 16.6 6.8C16.6 10 12 15 12 15S7.4 10 7.4 6.8A4.6 4.6 0 0 1 12 2.2Z"/>'
		. '<path d="M12 15S7.4 10 7.4 6.8A4.6 4.6 0 1 1 16.6 6.8C16.6 10 12 15 12 15Z"/>'
		. '<circle cx="12" cy="6.8" r="1.7"/>',
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
	'reservoir'  => '<path d="M3.5 5.5H20.5L12 20Z"/>',
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
	'tank'       => '<path d="M4 6.5h16v11H4z"/>',
	// A VALVE (ROADMAP Task 248 phase 2, 2026-08-14). The BOWTIE, and there was never a second
	// candidate: it is what every P&ID, every hydraulic schematic and EPANET itself draw, so this
	// is the one icon in the set that a water engineer already knows before arriving.
	//
	// **THE BOWTIE AND NOTHING ELSE** (Tom, 2026-09-01: the old icon "is embarrassing and overly
	// complex. It should be a simple bowtie without other decoration (the little T)."). The little T
	// was a stem and a handwheel bar sitting on the waist -- an operating detail borrowed from a
	// gate-valve elevation, which at map size was two strokes of noise on top of the one shape that
	// carries the meaning. It is gone, and so is the temptation to add a circle around the bowtie:
	// "possibly inside a circle" was research, not the ruling.
	//
	// Two things the geometry still has to survive:
	//   1. IT SITS ON A LINE, not on a page. A valve is a LINK, like the pump, so this mark is
	//      drawn ON the pipe and rotated along it (positionPumpSymbol() in js/looped-network.js).
	//      That is why the bowtie is horizontal and centred: rotated to any angle it still reads,
	//      where an upright symbol would only read on a horizontal run.
	//   2. THE WAIST MUST NOT CLOSE UP AT 14px. The two triangles meet exactly at x=12, y=12 with a
	//      2-unit stroke, so the pinch reads as a pinch rather than blurring into one hexagon.
	//      Widening the triangles TOWARD each other was tried and lost the waist; growing them
	//      OUTWARD into the space the T used to occupy (x:4-20,y:5-19 became x:3-21,y:4-20) makes
	//      the mark bigger at every symbol size and leaves the waist exactly where it was.
	// Greyscale, and angular where the pump is round -- neither cue is colour, the same test the
	// tank above had to pass.
	// Same shared-path rule as the reservoir and the tank: this ONE string draws the toolbar
	// button and the map symbol both, so the map backdrop `d` in buildLinkEls() changes with it.
	'valve'      => '<path d="M3 4v16l9-8z"/><path d="M21 4v16l-9-8z"/>',
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
	'pump'       => '<path d="M10 7H20.5V13H16A6 6 0 1 1 10 7Z"/>',
	// **THE MAP PUMP IS THE ONE SYMBOL WITH ITS OWN DRAWING**, and the divergence is Tom's
	// (2026-09-02): *"In EPANET, which was my pattern, the symbol (not menu) pump snout is as long
	// as the body diameter. So the pump icon has about a 2:1 aspect ratio... longer snout is better
	// on the map. But shorter is better in the menu."* Body diameter 10 and snout 10 here against
	// body 12 and snout 6.5 in 'pump' above. It letterboxes inside the same square 24 box, centred
	// on y=12, so resizePumpSymbol() needs to know nothing about it.
	'pumpmap'    => '<path d="M7 7H22V12H12A5 5 0 1 1 7 7Z"/>',
	// Solid, because a junction is a node and the canvas draws it solid.
	'junction'   => '<circle cx="12" cy="12" r="4.25"/>',
	// A run between two nodes — the thing you are actually about to place.
	'pipe'       => '<path d="M5 12H19" stroke-linecap="butt"/><path d="M5 7.5V16.5M19 7.5V16.5"/>',
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

	// Vertices mode (Task 567). A bent line with HOLLOW SQUARE grips on its bends, which is exactly
	// what the mode puts on the map -- EPANET's own grip shape, and the one symbol on this map that
	// is a square, so it is not read as any other object. The line bends, because a bend is the
	// thing the mode is about; a straight line with dots on it would read as a pipe with junctions.
	'vertices'   => '<path d="M2 20l6.5-9 6.5 4.5L22 4"/><rect x="6.2" y="8.7" width="4.6" height="4.6"/><rect x="12.7" y="13.2" width="4.6" height="4.6"/>',

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

	// A TABLE, and it is deliberately NOT pane-bottom (Tom, 2026-08-21: the tables were "a gap
	// barely discoverable with the bottom pane button"). pane-bottom draws the CONTAINER -- a
	// window with a band shaded along one edge -- and answers "where does it appear". This draws
	// the CONTENT: a ruled grid with its heading row filled, the shape of a printed schedule on a
	// plan sheet, which is the object an engineer already reads. Two icons for two questions, and
	// the button that says "Tables" must not draw the same picture as the one that says "Bottom
	// panel" or neither teaches anything.
	// The heading row is shaded rather than stroked heavier: at 14px an extra stroke weight is
	// invisible, while a filled band still reads as "this row is different".
	'table'       => '<path d="M3 5h18v4H3z" fill="currentColor" stroke="none" opacity=".18"/><path d="M3 5h18v14H3z"/><path d="M3 9h18"/><path d="M3 14h18"/><path d="M10 9v10"/>',

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

	// PROJECT: a plan set, part unrolled (ROADMAP Task 467). **THE MODEL IS A WIREFRAME, and that is
	// the whole lesson of seven rounds.** Six of them used a stroke's WIDTH to stand for an object's
	// thickness. That model cannot hold: a stroke paints symmetrically about a path, so the object's
	// real boundary sits at nominal +- w/2, a number nobody ever states, and two features of different
	// thickness therefore cannot meet. Drawing the wireframe those strokes implied exposed three
	// contradictions at once -- the roll's core had been eaten to a 0.15 slit, its outer edge sat 1.25
	// units BELOW the tabletop it rests on, and the "thick" bottom was a TRANSLATED copy of a catenary,
	// which is a different curve. Tom, 2026-08-23: *"if we wanted to get this (or any design) right
	// from the beginning, we should start with a wire frame (zero line widths or infinite resolution)."*
	//
	// So there are exactly two kinds of thing here, and the distinction is the model:
	//   FILL   material seen edge-on: the roll (an annulus round its core), the fan of sheet edges at
	//          the right, and the stack lying on the table.
	//   EDGE   where material stops. One hairline each. A single sheet has no drawable thickness, so
	//          it never gets two.
	//
	// **FORESHORTENING IS DERIVED.** A round roll end drawn 3.5 x 1.85 declares k = ry/rx = 0.529.
	// Anything lying FLAT is seen through that same k, so the stack's 0.85 of real thickness appears
	// as 0.45. The fan is seen FACE-ON and is not foreshortened at all, which is why it is visibly
	// fatter than the bottom -- Tom's own hair-split, now a consequence rather than a nudge.
	//
	// **ONE MOTIF, COPIED, NEVER OFFSET.** The roll's visible arc (180-290 degrees), the catenary that
	// leaves it ALONG ITS TANGENT, and the flat run, translated in y by 9.7. An offset curve is
	// parallel at a constant perpendicular distance, which for a catenary is a different curve. The
	// long `lead` down the tangent is what makes the sheet HANG rather than step; shortening it
	// flattens the catenary into an S between two endpoints, which is what it became the one time this
	// was drawn as edges without it. Only the BOTTOM copy closes underneath and shows its core.
	// The middle copy is a fold on the FACE of the sheet and stops at the title block; the top and
	// bottom are edges OF the sheet and run out to the fan.
	//
	// **SHIPPED AT WIREFRAME WEIGHT ON PURPOSE** (Tom: *"I am tempted to try shipping it exactly like
	// this and see how it ages"*). Every edge is 0.35, which at 17 px is a quarter of a pixel: the
	// three FILLS carry the icon at menu size and the linework is a whisper. That is a deliberate
	// experiment, not an oversight. `--wire=` is the one dial that backs it off, and 0.35 -> 1.0 is
	// the first step if it reads as absent rather than as fine.
	//
	// Rejected, so they are not re-proposed: a stroke width standing for a thickness (see above); an
	// AutoCAD-style OFFSET of the sag; a CIRCLE for the roll end; a roll big enough to leave the
	// catenary no horizontal room; a WIDE title block with an interior upright; a lower-right title
	// block (it made a mass the size of the roll at the opposite corner); a rolled TUBE (reads as a
	// PIPE, two icons away); a water drop; a hard hat; a corner-curled single sheet.
	//
	// WATER (ROADMAP Task 523, 2026-08-25). The menu this opens was called Project until Tom renamed
	// it: *"'Water' is just better all around. Fun to use, fun to teach, fun to own, fun to share."*
	// A rolled set of plan sheets was the right drawing for a menu meaning "the document" and says
	// nothing about water, so the glyph followed the name.
	//
	// **A DROP, WHICH WAS REJECTED ONCE AND IS NOT SNEAKING PAST THAT RULING.** The rejection below
	// is real and stands — for an icon that had to mean PROJECT. A menu called Water is a different
	// question, and Tom chose the drop from six candidates drawn at true menu size (a water tower, a
	// fire hydrant, and four drops).
	//
	// Filled at .18 with its own outline over it, which is the pair the Reservoir and Tank icons
	// already use for a body of water — so the three read as one family rather than three authors.
	//
	// Written as CUBICS, never an `A` arc: the bowl is a circle of r = 6.2 about (12, 14.8) and the
	// control offset is Kappa*r = 0.5523 * 6.2 = 3.42. That is not a style preference —
	// `dev/scripts/icon_ascii_preview.php` models M/L/H/V/C/Z only, so an arc silently renders as
	// nonsense there and the one tool that measures at 17 px goes blind. Verify with
	// `php dev/scripts/icon_ascii_preview.php water --size=17`, remembering it cannot show opacity:
	// the fill reads as solid black in ASCII and as a pale tint in a browser.
	// **A TOWER, NOT A DROP** (Tom, 2026-08-25). The drop that shipped the day before lost against
	// the View menu's eye: *"the water drop and the eye don't look different enough, especially with
	// the association of tears and eyes."* Two almond-ish outlines one menu apart is a real
	// collision, and the fix is a different SILHOUETTE rather than a better drop. He referenced
	// commercial line icons for the SHAPE only; this is an original drawing, as everything here is.
	//
	// **THE ROOF IS PEAKED BECAUSE HE DREW IT THAT WAY.** The first tower drawn here had a flat
	// trapezoid tank, and he sent back four sketches marking that one MINUS -- twice. What carries
	// a plus in his hand is a pointed roof over a tank on splayed legs, with no cross brace. So the
	// distinguishing feature is the ROOF, not the bracing, and a redraw that keeps a flat top is
	// the same icon again however the legs are arranged.
	//
	// His other plus was the same tower with a TAPERED body, and swapping to it is one line:
	//     '<path d="M12 2.5L6.5 7.5H17.5Z"/><path d="M7 7.5L9 13H15L17 7.5"/>'
	//         . '<path d="M9.4 13L7 20.5"/><path d="M14.6 13L17 20.5"/>'
	// Not left in the array as a second entry, because an icon nothing draws is an icon nobody
	// maintains. His neutral sketch was a round bulb with a finial; his minus was the flat top.
	//
	// **THE FAUCET LOST A DRAWING ATTEMPT, NOT AN ARGUMENT** (corrected 2026-08-25). What stood
	// here read as a settled measurement: that a faucet needs a handle, a spout and a falling drip,
	// "three fine features in one glyph", and therefore smudges at 17 px. Tom, asking for the
	// hydrant below: *"I can't believe you summarily rejected the idea of a faucet. A fire hydrant
	// will be more intricate than a faucet."* He is right, and the hydrant settles it from the
	// other side -- bonnet, barrel, two side nozzles, a pumper nozzle and a base flange is FIVE
	// features to the faucet's three, and it measures clean at 17 px with every gap open.
	//
	// So the honest record is that ONE faucet was drawn and THAT DRAWING smudged. Feature count was
	// never the reason and must not be quoted as one again. **What decides legibility at 17 px is
	// CLEAR GAP, not feature count**: 17/24 of a unit is 0.71 px, and a 2-unit stroke eats one unit
	// either side of every line, so any gap left under about 2.5 units closes. Give a feature that
	// room and it survives; deny it and one feature is enough to fail.
	//
	// **NO FAUCET IS WANTED, AND THAT IS SETTLED** (Tom, 2026-08-26): *"Actually, the tank is very
	// idiomatic to this tool, so I am happy with it. We don't have faucet assets."* The reason is
	// vocabulary, not legibility -- this suite draws reservoirs, tanks, pumps and valves, and a
	// faucet is not one of the things it models. The gap-budget correction above stands on its own
	// merits and is the rule every icon here is measured against; it is no longer an invitation to
	// redraw a faucet.
	'water'      => '<path d="M12 2.5L7.5 7H16.5Z"/><path d="M8.6 7V13H15.4V7"/>'
		. '<path d="M9.2 13L6.5 20.5"/><path d="M14.8 13L17.5 20.5"/>',

	// FIRE HYDRANT -- drawn for Water > Fire flow at a hydrant (ROADMAP Task 530).
	//
	// **KEPT, THOUGH NOTHING DRAWS IT TODAY** (2026-08-26): the menu row it was drawn for lives on
	// the `fire-flow` branch, not on master. It is a finished drawing with a Tom-reviewed shape, so
	// it keeps its entry the way `plan` below does. Do not delete it as dead code.
	//
	// **REDRAWN 2026-08-26 AGAINST TOM'S OWN CAD FRONT ELEVATION AND HIS MARKED-UP RENDER.** He
	// supplied a CAD elevation, a commercial line icon for comparison, and then a render of our own
	// drawing with seven notes on it (A-G). The verdict on the version before it was *"far too
	// cartoonish, meaning non-physical"* -- and every note is about PHYSICALITY, not style:
	//   A  nut and bonnet: keep.
	//   B, C  **the dome must spring from the barrel walls themselves.** It sprang from inside them
	//       and read as an arch cut into the barrel with shoulders either side. Now x = 7 and 17
	//       exactly, which is the walls.
	//   D  **the side nozzle caps are the same size as the front one.** All three painted bands run
	//       y 10.7..15.7. The front cap is seen FACE-ON and the side caps EDGE-ON, which is the one
	//       place the drawing cannot make them look identical -- a face shows a ring, an edge shows
	//       a block. Same size, different aspect. **Two ways of drawing the side cap were built and
	//       rejected against a render:** a hollow box of the same footprint reads as ears, and a
	//       round-capped stroke cannot be shorter than it is tall, so a 5-unit cap became a wing.
	//       It is a FILLED path carrying the normal stroke, which rounds its corners into family.
	//   E  **each side cap carries a nut**, a short tab proud of the cap on its outer face.
	//   H  **BOTH flanges were too long**, not just the collar (Tom: *"I simply forgot to point out
	//       that both need to be shortened"*). Collar 5.5 to 18.5, foot 5 to 19. The nozzle caps are
	//       now the widest thing on the drawing after the ground, which is what the references show.
	//   B, C again  **the bonnet must not be MISALIGNED WITH THE CYLINDER AT THE FLANGE.** The dome
	//       springs at x = 7 and 17 -- the wall centrelines -- and its first control point is
	//       directly above the springing, so it leaves the collar on a VERTICAL tangent and
	//       continues the barrel line rather than meeting it at an angle. Move the springing and
	//       that alignment is what breaks; it is the note he made twice.
	//   F  **it rises from the ground; it does not float**, and then, once it did: *"It's pleasing
	//       and natural for the bottom flange to be FLUSH with the ground... This makes the icon
	//       less busy."* So the foot and the ground share a bottom edge (both painted to y 21.2)
	//       and the ground is the thinner, wider one. Two stacked bars with air between them was
	//       the busyness; touching them was not enough. **It is the BOTTOM edges that are flush**,
	//       and what the shape is meant to read as is a PLINTH -- his word, and the way the public
	//       sees a hydrant's base.
	//   G  **the front cap is a solid disc with a SQUARE hole, and the hole is the nut.** He allowed
	//       a circle -- *"a circle is acceptable for an icon"* -- and then sent the drawing, which
	//       is square, so square it is: `fill-rule="evenodd"` with the square as a second subpath.
	//       An outlined RING was the earlier reading and it is wrong: the cap is solid.
	//
	// **A CORRECTION, BECAUSE IT WAS WRITTEN HERE AS A MEASUREMENT AND WAS NOT ONE.** This file
	// claimed there was no nut inside the pumper ring because "a third concentric feature has
	// nowhere to be". Tom: *"There is no third concentric feature. You must be misunderstanding."*
	// He is right -- cap and nut is TWO, and the ring's white centre was already the nut. The
	// barrel wall was being counted as if it were concentric with them. **Do not restate the
	// three-feature claim; there was never a third feature.**
	//
	// **THE BARREL IS WIDER THAN THE ONE BEFORE IT, AND THAT IS TOM'S OWN CALL**, not a reversal of
	// his earlier "vertical cylinder, a pipe with a few goodies" correction: *"CC claimed that the
	// shape was impossible before. So I made it wider. Anything will do if it really looks like a
	// hydrant."* What still makes the eye read pipe is that the collar and the foot both bracket it
	// wider. Barrel walls at x = 7 and 17; collar and flange both 3.5 to 20.5.
	//
	// Drawn top to bottom: the operating nut (turned with a wrench to open the valve), the domed
	// bonnet, the wide collar, the barrel, a side nozzle each side (stub, cap, cap nut), the pumper
	// nozzle on the face, the foot flange, and the ground it stands on.
	//
	// **THE GAP BUDGET, which is what decides legibility at 17 px** (17/24 of a unit is 0.71 px, and
	// a 2-unit stroke eats one unit either side of every line, so a gap under about 2.5 units
	// closes). Feature count has never been the constraint here:
	//   walls painted to x = 8 and 16, so 8 units of clear barrel face
	//   front cap disc r = 3.5 at (12, 13.2), painted 8.5..15.5 -- 0.5 units of air to each wall
	//   its square nut hole is 3 units across: open to 96 px, closing below that into a solid cap,
	//     which degrades to a plausible reading rather than to noise
	//   all three caps span y 10.7..15.7 painted; collar painted bottom is 8 and flange painted top
	//     is 18.4, so 2.7 units of air above and below the whole nozzle band
	//   widths, widest first: ground 1..23, cap nuts 2.6..21.4, foot flange 4..20, collar 4.5..19.5
	// The nut, the bonnet and the collar deliberately TOUCH, and so do the flange and the ground:
	// a nut sits on a bonnet, a bonnet sits on a flange, and a hydrant stands on the earth. There
	// is no gap there to spend and note F says there must not be one.
	//
	// The ground line is stroke 1.6, lighter than everything else: it is a reference line, not part
	// of the object. Verify with a real rendering, not ASCII:
	//     node dev/scripts/icon_png_preview.js hydrant
	//
	// Cubics, never an `A` arc, for the bonnet dome and the ring: icon_ascii_preview.php models
	// M/L/H/V/C/Z only, so an arc renders as nonsense there and that tool goes blind.
	'hydrant'    => '<path stroke-width="1.6" d="M2 20.4H22"/>'
		. '<path d="M5 20.2H19"/>'
		. '<path d="M7 20.2V7"/><path d="M17 20.2V7"/>'
		. '<path d="M5.5 7H18.5"/>'
		. '<path d="M7 7C7 4.9 9.24 3.2 12 3.2C14.76 3.2 17 4.9 17 7"/>'
		. '<path d="M10.8 3.2V1.4H13.2V3.2"/>'
		. '<path fill="currentColor" d="M5.6 11.7H7V14.7H5.6Z"/>'
		. '<path stroke-width="2.6" d="M4.6 13.2H3.9"/>'
		. '<path fill="currentColor" d="M18.4 11.7H17V14.7H18.4Z"/>'
		. '<path stroke-width="2.6" d="M19.4 13.2H20.1"/>'
		. '<path fill="currentColor" stroke="none" fill-rule="evenodd"'
		. ' d="M12 9.7C13.933 9.7 15.5 11.267 15.5 13.2C15.5 15.133 13.933 16.7 12 16.7'
		. 'C10.067 16.7 8.5 15.133 8.5 13.2C8.5 11.267 10.067 9.7 12 9.7Z'
		. 'M10.5 11.7H13.5V14.7H10.5Z"/>',

	// CANDIDATES for the Water menu, drawn 2026-08-25. Tom: the drop and the eye *"don't look
	// different enough, especially with the association of tears and eyes"*. He named a water tower
	// (front view) and a dripping faucet and referenced two commercial line icons for the SHAPE only;
	// these are original drawings, as every icon in this file is.
	// **KEPT, THOUGH NOTHING DRAWS IT TODAY** (2026-08-25). This is the rolled plan set that was the
	// Project menu's icon until that menu became Water above. Tom, on losing it: *"We really came out
	// victorious with our Plan icon. But it looks like now we need to change it."* It is six rounds
	// of work and a physical model that still generates, so it keeps its geometry and its generator
	// under a name that says what it draws. The `scenarios` icon below deliberately draws the same
	// sheet and is unaffected.
	//
	// The geometry is GENERATED: `php dev/scripts/icon_project_geom.php` prints the string below from
	// the model above, so congruence and foreshortening are structural rather than maintained by hand.
	// Edit the parameters there, not the path here. `--preview` and
	// `php dev/scripts/icon_ascii_preview.php project` render it -- note that the previewer models
	// M/L/H/V/C/Z only, which is why every arc here is written as cubics and never as `A`.
	'plan'       => '<path fill="currentColor" stroke="none" fill-rule="evenodd" d="M7.4 21.6C7.4 22.622 5.833 23.45 3.9 23.45C1.967 23.45 0.4 22.622 0.4 21.6C0.4 20.578 1.967 19.75 3.9 19.75C5.833 19.75 7.4 20.578 7.4 21.6ZM5.5 21.6C5.5 22.014 4.784 22.35 3.9 22.35C3.016 22.35 2.3 22.014 2.3 21.6C2.3 21.186 3.016 20.85 3.9 20.85C4.784 20.85 5.5 21.186 5.5 21.6Z"/>'
		. '<rect x="21.9" y="3.9" width="1.7" height="19.4" fill="currentColor" stroke="none"/>'
		. '<path fill="currentColor" stroke="none" d="M5.097 19.862C7.454 20.315 7.6 23.3 11.4 23.3H23.6V23.75H11.4C7.6 23.75 7.454 20.765 5.097 20.312Z"/>'
		. '<path stroke-width="0.525" d="M0.4 2.2V21.6"/>'
		. '<path stroke-width="0.525" d="M0.4 2.2C0.4 1.802 0.643 1.415 1.093 1.095C1.542 0.776 2.175 0.542 2.896 0.428C3.618 0.314 4.389 0.325 5.097 0.462"/>'
		. '<path stroke-width="0.525" d="M5.097 0.462C7.454 0.915 7.6 3.9 11.4 3.9H23.6"/>'
		. '<path stroke-width="0.525" d="M0.4 11.9C0.4 11.502 0.643 11.115 1.093 10.795C1.542 10.476 2.175 10.242 2.896 10.128C3.618 10.014 4.389 10.025 5.097 10.162"/>'
		. '<path stroke-width="0.525" d="M5.097 10.162C7.454 10.615 7.6 13.6 11.4 13.6H19.1"/>'
		. '<path stroke-width="0.525" d="M7.4 21.6C7.4 22.622 5.833 23.45 3.9 23.45C1.967 23.45 0.4 22.622 0.4 21.6C0.4 20.578 1.967 19.75 3.9 19.75C5.833 19.75 7.4 20.578 7.4 21.6Z"/>'
		. '<path stroke-width="0.525" d="M5.5 21.6C5.5 22.014 4.784 22.35 3.9 22.35C3.016 22.35 2.3 22.014 2.3 21.6C2.3 21.186 3.016 20.85 3.9 20.85C4.784 20.85 5.5 21.186 5.5 21.6Z"/>'
		. '<path stroke-width="0.525" d="M5.097 19.862C7.454 20.315 7.6 23.3 11.4 23.3H23.6"/>'
		. '<path stroke-width="0.525" d="M21.9 3.9V23.3"/>'
		. '<path stroke-width="0.525" d="M23.6 3.9V23.75"/>'
		. '<path stroke-width="0.525" d="M19.1 3.9V23.3"/>'
		. '<path stroke-width="0.525" d="M20 10.2V15.6"/>'
		. '<path stroke-width="0.525" d="M20.9 11.6V14.1"/>'
		. '<rect x="14.3" y="5.2" width="3" height="2.7" stroke-width="0.525"/>'
		. '<path stroke-width="0.525" d="M13.2 19.4H17.6"/>'
		. '<path stroke-width="0.525" d="M13.2 20.8H17.6"/>',

	// SCENARIOS: one plan sheet branching into three (ROADMAP Task 499.01). The physical object is the
	// same one the 'project' icon draws — a sheet of the plan set — because that is what a scenario IS
	// here: the whole project again, with a few values changed. Tom, 2026-08-24: "three branched
	// children of a main project... squares with an aspect ratio representative of a 2H x 3H plan
	// sheet." So every rectangle is 3 wide by 2 high, the parent 9x6 and each child 6x4, and the
	// branch is the ordinary trunk-spine-stub of a family tree.
	//
	// The 'project' icon's own DETAIL is deliberately dropped, which Tom offered as the fallback in
	// the same note. It was drawn with a title-block band on the parent and measured at 17 px: the
	// parent's 5-unit interior closed up to 1.5 units, about one pixel, so the sheet read as a solid
	// block. A hint nobody can resolve is not a hint. Verify with
	// `php dev/scripts/icon_ascii_preview.php scenarios --size=17` before changing any number here.
	'scenarios'  => '<rect x="1.5" y="9" width="9" height="6"/>'
		. '<rect x="16.5" y="3.5" width="6" height="4"/>'
		. '<rect x="16.5" y="10" width="6" height="4"/>'
		. '<rect x="16.5" y="16.5" width="6" height="4"/>'
		. '<path d="M10.5 12h6"/>'
		. '<path d="M13.5 5.5v13"/>'
		. '<path d="M13.5 5.5h3M13.5 18.5h3"/>',

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
