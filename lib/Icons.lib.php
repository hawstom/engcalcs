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
	'view'       => '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/>',
	// A spoked gear rather than a toothed one: at 14px real teeth turn into a grey ring.
	'settings'   => '<circle cx="12" cy="12" r="3.2"/><path d="M17.2 12h2.4M15.7 8.3l1.7-1.7M12 6.8V4.4M8.3 8.3L6.6 6.6M6.8 12H4.4M8.3 15.7l-1.7 1.7M12 17.2v2.4M15.7 15.7l1.7 1.7"/>',

	// ---- File ----
	'new'        => '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
	'open'       => '<path d="M3 19V5h6l2 2h8v3"/><path d="M3 19l3-8h18l-3 8z"/>',
	'save'       => '<path d="M4 4h12l4 4v12H4z"/><path d="M8 4v5h7V4"/><path d="M8 20v-7h8v7"/>',
	// Tom, 2026-08-08: "Sometimes a disk with a pencil. You used a page with a pencil." Correct —
	// Save as is a variant of Save, so it must wear Save's disk, not a different object entirely.
	'saveas'     => '<path d="M4 4h11l3 3v4"/><path d="M4 4v16h6"/><path d="M8 4v4h6"/><path d="M20.5 12.5l-7 7-3 1 1-3 7-7z"/>',
	'saveall'    => '<path d="M8 3h9l4 4v11H8z"/><path d="M12 3v4h6"/><path d="M17 18v3H3V7h3"/>',
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
	'reservoir'  => '<path d="M6 9h12v11H6z" fill="currentColor" stroke="none" opacity=".18"/><path d="M6 4v16h12V4"/><path d="M6 9h12"/>',
	// Circle with a tangent discharge tail, per the same sketch. The tail meets the casing at the
	// top tangent point, which is what makes it read as a pump rather than as a magnifier.
	// SHORT tail, on Tom's second sketch, 2026-08-08: "the pump tail can be short, almost like the
	// digit 6, and still look okay." He is right, and short is strictly better here — a long tail
	// pushed the casing off-centre and shrank it, and the casing is the half that carries meaning.
	'pump'       => '<circle cx="11" cy="13.5" r="6.5"/><path d="M12 7h6V3.5h-6"/>',
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
