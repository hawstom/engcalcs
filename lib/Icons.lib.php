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
 * THE RULE THIS SET OBEYS: an icon is a PREFIX, never a replacement. Every control keeps its
 * word. Icon-only was rejected suite-wide — it saves no translation work (the label stays) and
 * spends first-time comprehension, which is the audience a web calculator exists for.
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
	// Three passes with Tom, 2026-08-08, and the third one broke the constraint rather than
	// accepting it.
	//   1. "It looks too much like a light/sun instead of a gear. Gear teeth are short, not long
	//      like rays of light." The GAP was the problem — eight long strokes starting outside a
	//      small hub are rays, and a mark that floats away from its centre is never a tooth.
	//   2. "A few more teeth so it doesn't look like a ship's wheel." Eight of anything radial is
	//      a wheel; that is the spoke count wheels actually have.
	//   3. "At large scale I'd say add more teeth. At smaller scale we need a little more length.
	//      I don't think we can do both." — and with the old construction he was exactly right.
	//      Teeth drawn as separate radial strokes are limited by the GAP between them: more teeth
	//      closes the gap, longer teeth means a smaller body, which closes it further. At twelve
	//      the gaps fell under a pixel and the rim greyed into a solid ring.
	//
	// So the teeth stopped being strokes. This is one closed outline whose edge IS the tooth
	// profile — flank out, across the tip, flank in, along the root — which is how a real gear
	// is shaped and how gear icons are actually drawn. With no gaps to collapse, tooth count and
	// tooth depth stop competing: twelve teeth AND 3.2 units of depth, where the old spoked
	// version could manage ten and 1.9. At 15px the valleys soften into a fine serration rather
	// than breaking, which is the graceful direction to degrade. The bore is what no sun has.
	//
	// **Why fewer teeth would also have worked, recorded because it is the better principle** (Tom,
	// 2026-08-08, after settling on twelve): a gear reads as a gear when **tooth width equals gap
	// width**, with matching chamfers or fillets on the inside and outside corners — which is what
	// the actual history of gear refinement converged on. Chrome's gear icon gets away with SIX
	// teeth on exactly that basis. Tom's read of his own request: *"I probably was pushing for more
	// teeth because of my sub-conscious understanding that tooth width = gap width."* Twelve at a
	// 10°/12° tip-to-root ratio is already near parity, which is why it works and why he called it
	// okay as is. If this is ever redrawn, chase the width parity and the fillets, not the count —
	// the count is a symptom.
	'settings'   => '<path d="M18.52 10.97L21.76 11.15A9.8 9.8 0 0 1 21.76 12.85L18.52 13.03A6.6 6.6 0 0 1 18.16 14.37L20.88 16.14A9.8 9.8 0 0 1 20.03 17.62L17.13 16.15A6.6 6.6 0 0 1 16.15 17.13L17.62 20.03A9.8 9.8 0 0 1 16.14 20.88L14.37 18.16A6.6 6.6 0 0 1 13.03 18.52L12.85 21.76A9.8 9.8 0 0 1 11.15 21.76L10.97 18.52A6.6 6.6 0 0 1 9.63 18.16L7.86 20.88A9.8 9.8 0 0 1 6.38 20.03L7.85 17.13A6.6 6.6 0 0 1 6.87 16.15L3.97 17.62A9.8 9.8 0 0 1 3.12 16.14L5.84 14.37A6.6 6.6 0 0 1 5.48 13.03L2.24 12.85A9.8 9.8 0 0 1 2.24 11.15L5.48 10.97A6.6 6.6 0 0 1 5.84 9.63L3.12 7.86A9.8 9.8 0 0 1 3.97 6.38L6.87 7.85A6.6 6.6 0 0 1 7.85 6.87L6.38 3.97A9.8 9.8 0 0 1 7.86 3.12L9.63 5.84A6.6 6.6 0 0 1 10.97 5.48L11.15 2.24A9.8 9.8 0 0 1 12.85 2.24L13.03 5.48A6.6 6.6 0 0 1 14.37 5.84L16.14 3.12A9.8 9.8 0 0 1 17.62 3.97L16.15 6.87A6.6 6.6 0 0 1 17.13 7.85L20.03 6.38A9.8 9.8 0 0 1 20.88 7.86L18.16 9.63A6.6 6.6 0 0 1 18.52 10.97Z"/><circle cx="12" cy="12" r="2.8"/>',

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
