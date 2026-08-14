// Harness for drawExampleNetwork() in js/looped-network.js -- run with:
//   node dev/lpn-spike/example-network-harness.js
//
// WHY THIS EXISTS. The example network is the first thing a visitor sees the calculator do, and
// ROADMAP Task 254 rewrote it from a two-pipe placeholder into a five-junction ring main sized
// like a real project. Everything that can be wrong with it is invisible from reading the code:
// whether it converges, whether the pressures a reviewer sees are plausible, whether the two unit
// presets produce the same drawing at different scales, and whether the flow actually splits both
// ways round the ring (a ring that all flows one way is a series main wearing a circle). Tom's
// browser passes are slow and tiring, so this checks all of that in ~200 ms with no browser.
//
// TECHNIQUE is the same as popup-tips-harness.js: eval the REAL file against DOM stubs, injecting
// a test-only export just before the DOMContentLoaded listener so init() never runs. The one
// addition here is a REAL unit-select stub (options + selectedIndex + dataset.unit), because
// niceDefault()/unitKey() are exactly what this test is about -- popup-tips-harness.js stubs
// querySelector to null, which silently pins every value to its SI branch.


// DOM stubs, unit selects, storage and the eval-injection technique all live in lpn-dom-stub.js
// now -- extracted verbatim 2026-08-11 when a second harness needed the whole of it. See that file.
const {
  ROOT, mkEl, byId, ensure, unitSelects, setUnitSet, setHitTarget, loadLoopedNetwork, GPM, FT, IN
} = require('./lpn-dom-stub.js');
const fs = require('fs');

const L = loadLoopedNetwork(

  "\t\tdrawExample: drawExampleNetwork, runSolve: runSolve, assembleModel: assembleModel,\n" +
  "\t\tsettings: function () { return settings; }, getDoc: function () { return doc; },\n" +
  "\t\tseedDefaultInputs: seedDefaultInputs, bbox: bbox, effective: effective,\n" +
  "\t\tfitPending: function () { return fitAfterSolve; },\n" +
  "\t\tlinkLengthSI: linkLengthSI, rebuildSettingsFields: rebuildSettingsFields,\n" +
  // Task 263: the document stores DECLARED values, so a test that wants SI has to cross the
  // same boundary the solver does. Exported rather than re-derived here, or the test would
  // agree with itself instead of with the app -- the same rule the hwCoef note below states.
  "\t\ttoSI: toSI, toDisplay: toDisplay, unitFactor: unitFactor,\n" +
  // ...and the rest of the Task 263 boundary: what the document records about its own units, the
  // v2 migration, and the one-time restore offer's two halves (what it SHOWS and what it DOES).
  "\t\treadUnitSelections: readUnitSelections, applyUnitSelections: applyUnitSelections,\n" +
  "\t\tmigrateSaved: migrateSaved, serializeProject: serializeProject,\n" +
  "\t\tv2RestoreEvidence: v2RestoreEvidence, applyV2Restore: applyV2Restore,\n" +
  "\t\tgetProject: function () { return project; },\n" +
  "\t\tdocVersion: function () { return openDocVersion; },\n" +
  "\t\tsetDocVersion: function (v) { openDocVersion = v; },\n" +
  "\t\tstampDocAnswered: stampDocAnswered, storageVersion: function () { return LPN_STORAGE_VERSION; },\n" +
  "\t\tapplySaved: applySaved, restorePending: function () { return pendingV2Restore; },\n" +
  "\t\tnewProject: newProject, offerUnitRestore: offerUnitRestore,\n" +
  "\t\ttabAsterisk: tabAsterisk, indexEntry: indexEntry, openId: function () { return library.openId; },\n" +
  "\t\tnewProjectFromExample: newProjectFromExample, saveToStorage: saveToStorage,\n" +
  "\t\tnewBlankProject: newBlankProject, refreshMapStatus: refreshMapStatus,\n" +
  "\t\tunitSetLabel: unitSetLabel,\n" +
  // Task 277. The gesture is driven through the REAL pointer handlers below; applyDrag() is
  // exported because tick() calls it off requestAnimationFrame, which the stub makes async.
  "\t\tundo: undo, undoDepth: function () { return undoStack.length; }, applyDrag: applyDrag,\n" +
  "\t\tdragActive: function () { return !!drag; },\n" +
  // init() never runs here (that is the point of the injection), so the pointer listeners this
  // tests are not attached until the test asks for them.
  "\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
  // Task 274. renderNodeFields fills the popup; screenToWorld/positionTo are the two frames the
  // Cartesian boundary sits between.
  "\t\trenderNodeFields: renderNodeFields, screenToWorld: screenToWorld,\n" +
  "\t\tcartesianY: cartesianY, flipStoredY: flipStoredY,\n" +
  "\t\tgetBackdrop: function () { return backdrop; },\n" +
  "\t\tshowBackdropTargetPanel: showBackdropTargetPanel,\n" +
  "\t\tsetBackdrop: function (b) { backdrop = b; },\n" +
  "\t\tfrictionMethod: frictionMethod,\n" +
  "\t\tbuildMenuBar: buildMenuBar, menuPopupOpen: function () { return document.getElementById('lpn_menu_popup').style.display === 'block'; },\n" +
  "\t\tsubMenuOpen: function () { return document.getElementById('lpn_menu_popup2').style.display === 'block'; },\n" +
  "\t\tsubClosePending: function () { return subCloseTimer !== null; },\n" +
  "\t\tmenuRowLabels: function () { return Array.prototype.map.call(document.getElementById('lpn_menu_list').children, function (c) { return c.textContent || (c.children[1] && c.children[1].textContent) || ''; }); },\n" +
  "\t\tniceDefault: niceDefault, setUnitEl: function (name) { return unitEl(name); },\n" +
  "\t\taddNode: addNode, addLink: addLink,\n" +
  "\t\tlabelWidth: function (id) { return labelEls[id] ? labelEls[id].width : 0; },\n" +
  "\t\tlabelSide: function (id) { return labelEls[id] ? labelEls[id].side : null; },\n" +
  "\t\ttoggleSettingsPopup: toggleSettingsPopup, defaultSettings: defaultSettings,\n" +
  "\t\tsettingsFieldsEl: function () { return document.getElementById('lpn_settings_fields'); },\n" +
  "\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
  "\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
  "\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
  "\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
  "\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
  "\t\t\tworld = el('g', {}, svg);\n" +
  "\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
  "\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
  "\t\t\tmaskLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
  "\t\t\trubberBandEl = el('line', {}, world); } "
);

let fails = 0;
function ok(name, cond, extra) {
  console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
  if (!cond) { fails++; }
}
function near(a, b, tol) { return Math.abs(a - b) <= tol; }

// setMode() drives the real toolbar, which init() never built here; the example calls it last, so
// stub the buttons out of the way rather than reproduce the whole strip.
byId.lpn_toolbar.querySelectorAll = () => [];

['us', 'si'].forEach(which => {
  const us = which === 'us';
  console.log('\n--- ' + which.toUpperCase() + ' unit set ---');
  setUnitSet(which);
  L.reset();
  // Simulate a RETURNING visitor: loadFromStorage() merges a saved settings object onto the
  // defaults, so someone who used the page before the default moved to 20 still carries 2.5. The
  // example must override that -- raising the default alone never reaches them. This is exactly
  // the state Tom was in when he reported the map still drawing at the old size.
  L.settings().textSize = 2.5;
  L.drawExample(which);

  const doc = L.getDoc(), s = L.settings();
  const nodes = doc.nodes, links = doc.links;
  const res = nodes.filter(n => n.type === 'reservoir'), junc = nodes.filter(n => n.type === 'junction');
  const pipes = links.filter(l => l.type === 'pipe'), pumps = links.filter(l => l.type === 'pump');

  ok('2 reservoirs, 6 junctions', res.length === 2 && junc.length === 6, res.length + ' / ' + junc.length);
  ok('6 pipes, 1 pump', pipes.length === 6 && pumps.length === 1, pipes.length + ' / ' + pumps.length);

  // TWO SEPARATE SYSTEMS (Tom, 2026-08-09) -- the pumped ring, and a standalone gravity feed that
  // touches it nowhere. Demonstrating that disjoint components are legal is the whole point, so
  // the count is asserted rather than assumed.
  const adj = {};
  nodes.forEach(n => { adj[n.id] = []; });
  links.forEach(l => { adj[l.from].push(l.to); adj[l.to].push(l.from); });
  const seen = {}, components = [];
  nodes.forEach(n => {
    if (seen[n.id]) { return; }
    const q = [n.id], comp = [];
    seen[n.id] = true;
    while (q.length) { const id = q.shift(); comp.push(id); adj[id].forEach(x => { if (!seen[x]) { seen[x] = true; q.push(x); } }); }
    components.push(comp);
  });
  ok('exactly two separate systems', components.length === 2,
    components.map(c => c.length + ' nodes').join(' + '));
  const ring = components.find(c => c.length === 6), sepComp = components.find(c => c.length === 2);
  ok('one is a 6-node ring system, the other a 2-node gravity feed', !!ring && !!sepComp);

  // A RING, not a tree: every ring junction has degree 2 except the tie-in, which also takes pump.
  const deg = {};
  links.forEach(l => { deg[l.from] = (deg[l.from] || 0) + 1; deg[l.to] = (deg[l.to] || 0) + 1; });
  const ringJunc = junc.filter(n => ring.indexOf(n.id) >= 0);
  ok('every ring junction has degree 2 except one tie-in with 3',
    ringJunc.filter(n => deg[n.id] === 3).length === 1 && ringJunc.filter(n => deg[n.id] === 2).length === 4);
  // links - nodes + components independent cycles. A forest scores 0; this must score exactly 1,
  // so the second system genuinely adds no loop of its own.
  const cyclomatic = links.length - nodes.length + components.length;
  ok('exactly one independent loop across the whole drawing', cyclomatic === 1, 'cyclomatic ' + cyclomatic);
  const sepLinks = links.filter(l => sepComp.indexOf(l.from) >= 0);
  ok('the separate system is one pipe with no pump -- gravity, not pumping',
    sepLinks.length === 1 && sepLinks[0].type === 'pipe');
  // Tom, 2026-08-09: "it would be nice to have more than one vertex for demonstration" -- one
  // vertex shows pipes can bend, several show they are polylines.
  const bent = pipes.filter(p => p.verts.length > 0);
  const verts = pipes.reduce((t, p) => t + p.verts.length, 0);
  ok('more than one bend vertex, spread over more than one pipe', verts >= 3 && bent.length >= 2,
    verts + ' vertices on ' + bent.length + ' pipes');

  // SCALE (Task 254's opening complaint), measured on the RING, which is the part sized and
  // anchored on purpose. The title block and the separate system sit outside it by design.
  const ringNodes = nodes.filter(n => ring.indexOf(n.id) >= 0);
  const xs = ringNodes.map(n => n.x), ys = ringNodes.map(n => n.y);
  const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
  // ONE drawing for both presets. Map coordinates FOLLOW the Length/Map declaration (they are not
  // unitless), so this same 1400 x 700 layout is a 1400 ft ring in US and a 1400 m ring in SI --
  // a physically larger system, accepted deliberately. See drawExampleNetwork()'s comment.
  ok('ring extent is 1400 x 700 in both unit sets', near(w, 1400, 1) && near(h, 700, 1),
    w.toFixed(0) + ' x ' + h.toFixed(0));
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  // Asserted in the coordinates the USER reads, not the internal Y-down ones (Task 274). Tom,
  // 2026-08-11: "Center is now at 5000,-5000. Should be at 5000,5000." It is the readout that has
  // to say 5000,5000; which sign the renderer keeps in memory is not a promise to anybody.
  ok('ring reads as anchored on 5000,5000', near(cx, 5000, 1) && near(L.cartesianY(cy), 5000, 1),
    cx + ',' + L.cartesianY(cy) + ' (internal y ' + cy + ')');
  // THE SEPARATE SYSTEM LIVES INSIDE THE RING'S FOOTPRINT. Tom, 2026-08-09: "Drawing the separate
  // system outside our main loop effectively changes the scale of the project too much... so that
  // our text doesn't look too small." The ring's interior is space zoom-to-fit already pays for;
  // anything slung outside it shrinks every label on the map.
  const sepNodes = nodes.filter(n => sepComp.indexOf(n.id) >= 0);
  ok('the separate system sits inside the ring footprint, costing the fit nothing',
    sepNodes.every(n => n.x > Math.min(...xs) && n.x < Math.max(...xs)
      && n.y > Math.min(...ys) && n.y < Math.max(...ys)),
    sepNodes.map(n => n.id + '(' + n.x + ',' + n.y + ')').join(' '));
  // ...and the title block must stay tucked above the ring without touching it. Measured edge to
  // edge, not centre to node: the lower title line is `dominant-baseline: central`, so half its
  // rendered height sticks out below its y. Too small and it collides with the ring's top node and
  // that node's own data label; too large and zoom-to-fit shrinks the whole map for white space.
  const lowerTitle = doc.labels.filter(t => !t.anchorNode)
    .reduce((a, b) => (a.y > b.y ? a : b));
  // Judged at the DEFAULT text size, not this run's seeded 2.5: the title's y is a fixed map
  // coordinate, so the layout was composed for the size it ships with. A visitor who shrinks their
  // text only opens the gap further, which is harmless.
  const dts = L.defaultSettings().textSize;
  const titleGap = Math.min(...ys) - (lowerTitle.y + dts * lowerTitle.sizeMult / 2);
  ok('title block clears the ring top without stranding it in white space',
    titleGap > 15 && titleGap < 80, titleGap.toFixed(1) + ' units at the shipped text size');
  // ...AND AT THE DEFAULT TEXT SIZE, which is the size a first-time visitor actually sees. The
  // check above judges positions that annotate() baked from THIS run's seeded 2.5, so it flatters
  // the layout: a block stacked at 2.5 is 8x tighter than the same block stacked at 20, and the
  // gap measured against the default is correspondingly generous. Adding the units line exposed
  // this -- the third line cleared the ring by 29 units here and by 7 in a real browser. So redraw
  // at the shipped default and measure that.
  {
    L.reset();
    L.settings().textSize = L.defaultSettings().textSize;
    L.drawExample(which);
    const d2 = L.getDoc();
    const ring2 = d2.nodes.filter(n => ring.indexOf(n.id) >= 0).map(n => n.y);
    const low2 = d2.labels.filter(t => !t.anchorNode).reduce((a, b) => (a.y > b.y ? a : b));
    const gap2 = Math.min(...ring2) - (low2.y + dts * low2.sizeMult / 2);
    ok('...and still clears it when drawn AT the default text size',
      gap2 > 15 && gap2 < 80, gap2.toFixed(1) + ' units, lowest line "' + low2.text + '"');
  }
  // TEXT SIZE IS THE SHIPPED DEFAULT AND THE EXAMPLE MUST NOT TOUCH IT. Tom, 2026-08-09: ship a
  // default that suits the example, and "anything other is on the user, not us." So the stored 2.5
  // seeded above must survive the draw -- a visitor who set their own size keeps it.
  ok('20 is the shipped default, for a first-time visitor',
    L.defaultSettings().textSize === 20, L.defaultSettings().textSize);
  ok('the example does NOT overwrite a size the visitor had already chosen', s.textSize === 2.5,
    s.textSize);
  const ratio = w / L.defaultSettings().textSize;
  ok('extent:default-text ratio reads like plan lettering (50-100)', ratio > 50 && ratio < 100,
    ratio.toFixed(0));

  // ---- annotations, all composed from already-translated strings ----
  const PC = EngCalcs.pageConfig;
  const texts = doc.labels.map(t => t.text);
  ok('five Text annotations were placed', doc.labels.length === 5, doc.labels.length);
  ok('title block uses the real brand and menu strings',
    texts.includes(PC.menu_brand) && texts.includes(PC.lpn_main_menu));
  // THE UNITS LINE (Tom, 2026-08-10). The example commits to a unit system (Task 264) and this is
  // where it says so -- a screenshot of the drawing travels without the map's status strip, which
  // is the whole reason this line exists here and not on the browser tab.
  ok('...and a third line naming the unit system the example was FORCED to',
    texts.includes(L.unitSetLabel(which)) && /(US|SI)/.test(L.unitSetLabel(which)),
    L.unitSetLabel(which));
  ok('reservoir and lowest-pressure callouts use real strings',
    texts.includes(PC.lpn_tool_add_reservoir) && texts.includes(PC.bpn_p_min));
  ok('no annotation was left on the placeholder "Text"',
    !texts.some(t => t === PC.lpn_new_text || t === 'Text'), JSON.stringify(texts));
  ok('the two callouts are anchored to nodes, the title block is not',
    doc.labels.filter(t => t.anchorNode).length === 2);
  ok('size multipliers are set (a 2 and two 1.5s), not left at 1',
    doc.labels.filter(t => t.sizeMult === 2).length === 1
    && doc.labels.filter(t => t.sizeMult === 1.5).length === 3,
    doc.labels.map(t => t.sizeMult).join(','));

  // ANCHOR ORIENTATION (Tom, 2026-08-09). An anchored Text is text-anchor:middle, so lb.x offsets
  // its CENTRE and updateLabelGeometry() runs the leader to the near edge (px +/- halfW). If the
  // offset is smaller than half the text width, that edge is inside the words and the leader is a
  // stub emerging from the middle of them -- "the worst of all possible positions". The whole label
  // must clear its node horizontally, which is a property of the MEASURED width, not of a constant.
  doc.labels.filter(t => t.anchorNode).forEach(t => {
    const halfW = L.labelWidth(t.id) / 2;
    ok('"' + t.text + '" sits entirely to one side of its anchor',
      Math.abs(t.x) > halfW,
      'offset ' + t.x.toFixed(1) + ' vs half-width ' + halfW.toFixed(1));
    // ...and the side the leader is drawn for must agree with the side the label is actually on.
    ok('..."' + t.text + '" leader is drawn on the matching side',
      L.labelSide(t.id) === (t.x < 0 ? 'left' : 'right'), L.labelSide(t.id));
    // LEADER ANGLE. The leader runs from the node to the label's near edge, which sits exactly
    // `gap` away horizontally -- the text width cancels -- so the slope is atan(|dy| / gap) and
    // `gap` is |t.x| minus half the width. Both callouts must come out at the SAME angle even
    // though a reservoir's radius and a junction's differ, which is the thing a fixed dy could
    // not deliver. Tom, 2026-08-09: "Leaders don't look great horizontal."
    const gap = Math.abs(t.x) - halfW;
    const deg = Math.atan2(Math.abs(t.y), gap) * 180 / Math.PI;
    ok('..."' + t.text + '" leader rises at the shared callout angle, not flat',
      near(deg, 70, 0.5), deg.toFixed(1) + ' degrees');
    ok('..."' + t.text + '" leader rises (label is above its node, not level)', t.y < 0,
      't.y = ' + t.y.toFixed(1));
  });

  // The pump curve is real datasheet shape: 3 points, head falling with flow, from zero flow.
  const cp = pumps[0].curvePoints;
  ok('pump curve has 3 points starting at zero flow', cp.length === 3 && cp[0][0] === 0);
  ok('pump curve head falls monotonically', cp[0][1] > cp[1][1] && cp[1][1] > cp[2][1]);

  // Diameters/roughness were pinned by the example, not left on the page default.
  // Declared 6 (in) or 150 (mm) since Task 263 -- checked in SI so ONE assertion covers both, and
  // so it is the number the solver will actually see that is being checked.
  ok('pipes are 6 in / 150 mm',
    pipes.every(p => near(L.toSI(L.effective(p, 'diameter'), 'lpn_u_diameter'), 0.1524, 0.003)),
    (L.toSI(L.effective(pipes[0], 'diameter'), 'lpn_u_diameter') * 1000).toFixed(0) + ' mm');
  ok('pipes are C = 130', pipes.every(p => L.effective(p, 'roughness') === 130));

  // ---- and it must actually solve, to numbers a reviewer accepts --------
  // The second half of Task 254: the fit done inside drawExampleNetwork() happens before the
  // debounced solve has produced any label text, so a re-fit must still be pending, and the solve
  // must consume it exactly once.
  ok('a re-fit is pending after drawing', L.fitPending() === true);
  L.runSolve();
  ok('the solve consumed the pending re-fit', L.fitPending() === false);
  const model = L.assembleModel(), r = EngCalcs.lpnSolve(model, { tol: 1e-6 });
  ok('solves and converges', r.ok && r.converged === true);

  const press = {}; // in the visitor's own pressure unit
  model.nodes.forEach(n => {
    if (n.type !== 'junction') { return; }
    press[n.id] = (r.heads[n.id] - n.elev) * (us ? 1 / FT * 0.4335 : 9.80638);
  });
  const pv = Object.values(press);
  const lo = Math.min(...pv), hi = Math.max(...pv);
  const loWant = us ? 40 : 275, hiWant = us ? 80 : 550; // 40-80 psi is the distribution band
  ok('every junction pressure lands in the normal distribution band',
    lo > loWant && hi < hiWant,
    lo.toFixed(0) + '-' + hi.toFixed(0) + (us ? ' psi' : ' kPa'));

  // The "Lowest pressure" callout is anchored to a HARD-CODED node, because at draw time the solve
  // has not run. This is the assertion that makes that safe: if a tweak moves the minimum, fail
  // here rather than ship a map that points at the wrong junction.
  // Across BOTH systems -- the separate gravity feed is deliberately sized to stay above the ring's
  // minimum, because a second system that quietly stole the network low would make this callout a
  // lie while every other assertion still passed.
  const minId = Object.keys(press).reduce((a, b) => (press[a] <= press[b] ? a : b));
  const callout = doc.labels.find(t => t.text === PC.bpn_p_min);
  ok('the "Lowest pressure" callout is on the actual minimum-pressure junction',
    callout && callout.anchorNode === minId,
    'callout on ' + (callout && callout.anchorNode) + ', minimum at ' + minId);

  // THE POINT OF A RING: flow leaves the tie-in both ways and meets at a divide, so around the
  // ring in a consistent direction the sign of Q must change. A series main cannot do this.
  // Ring pipes only -- the separate gravity feed always flows one way and would mask a ring that
  // had stopped splitting.
  const ringQ = pipes.filter(p => ring.indexOf(p.from) >= 0).map(p => r.flows[p.id]);
  ok('flow reverses somewhere on the ring (a real hydraulic divide)',
    ringQ.some(q => q > 0) && ringQ.some(q => q < 0),
    ringQ.map(q => (us ? (q / GPM).toFixed(0) + 'gpm' : (q * 1000).toFixed(1) + 'L/s')).join(' '));

  const vel = pipes.map(p => Math.abs(r.flows[p.id]) / (Math.PI / 4 * Math.pow(L.toSI(L.effective(p, 'diameter'), 'lpn_u_diameter'), 2)));
  ok('velocities stay under the 5 fps / 1.5 m/s design ceiling', Math.max(...vel) < 1.5,
    vel.map(v => (us ? (v / FT).toFixed(2) + 'fps' : v.toFixed(2) + 'm/s')).join(' '));

  // A velocity is a SPEED. The ring above has just been asserted to reverse somewhere, so this
  // network is the one place in the suite guaranteed to carry a negative flow -- which is exactly
  // what used to leak a negative velocity out of lpnReport(). Direction lives in the sign of the
  // flow; the speed reported beside it never goes below zero, and it agrees with |Q|/A computed
  // independently right above.
  const badV = pipes.filter((p, i) => !(r.velocities[p.id] >= 0) ||
    Math.abs(r.velocities[p.id] - vel[i]) > 1e-9);
  ok('every reported velocity is an unsigned speed equal to |Q|/A', badV.length === 0,
    badV.map(p => p.id + '=' + r.velocities[p.id]).join(' ') || pipes.length + ' pipes checked');

  // Auto length must already include the bends -- the defect Tom caught on the old example.
  const dogleg = pipes.find(p => p.verts.length > 1);
  const straightDist = (() => {
    const a = doc.nodes.find(n => n.id === dogleg.from), b = doc.nodes.find(n => n.id === dogleg.to);
    return Math.hypot(a.x - b.x, a.y - b.y);
  })();
  ok('dog-legged pipe length already counts both bends (no drag needed)',
    L.effective(dogleg, 'length') > straightDist + 1,
    L.effective(dogleg, 'length').toFixed(0) + ' vs straight ' + straightDist.toFixed(0));

  // ---- ROADMAP Task 255: the declared length reaches the solver in METRES ----
  // The guard the ROADMAP asked for: a HAND-COMPUTED Hazen-Williams case, never a comparison
  // against the other engine (both engines read the same model, so they were wrong together).
  const p1 = pipes[0], declared = L.effective(p1, 'length');
  const expectSI = us ? declared * FT : declared;
  ok('linkLengthSI converts the declared length to metres',
    near(L.linkLengthSI(p1), expectSI, 1e-9),
    declared.toFixed(0) + (us ? ' ft -> ' : ' m -> ') + L.linkLengthSI(p1).toFixed(1) + ' m');
  ok('the model handed to the solver carries the SI length',
    near(model.links.find(x => x.id === p1.id).length, expectSI, 1e-9));
  // hf = 10.67 L Q^1.852 / (C^1.852 d^4.87), plus the minor loss k Q^2 / (2 g A^2) the solver adds.
  const Q1 = Math.abs(r.flows[p1.id]), d1 = L.toSI(L.effective(p1, 'diameter'), 'lpn_u_diameter'), A1 = Math.PI / 4 * d1 * d1;
  const hand = 10.67 * expectSI * Math.pow(Q1, 1.852) / (Math.pow(130, 1.852) * Math.pow(d1, 4.871))
    + L.effective(p1, 'k') * Q1 * Q1 / (2 * 9.806 * A1 * A1);
  ok('reported head loss matches hand-computed Hazen-Williams to 1%',
    Math.abs(Math.abs(r.headlosses[p1.id]) - hand) / hand < 0.01,
    'solver ' + Math.abs(r.headlosses[p1.id]).toFixed(4) + ' m vs hand ' + hand.toFixed(4) + ' m');

  // bbox() must contain every node AND every annotation -- this is what zoomExtent() fits to, and
  // a title that falls outside it gets clipped by the fit (which is Task 254's second complaint).
  const b = L.bbox();
  ok('bbox encloses every node, both systems', nodes.every(n => n.x >= b.minx && n.x <= b.maxx && n.y >= b.miny && n.y <= b.maxy));
  const title = doc.labels.find(t => t.text === PC.menu_brand);
  // The CURRENT text size, not the default -- this run deliberately seeds a returning visitor's
  // stored 2.5, and bbox() must track whatever size the labels are actually rendered at.
  const titleHalfH = s.textSize * title.sizeMult / 2;   // dominant-baseline:central
  ok('bbox reserves the title block\'s real height, not a constant',
    b.miny <= title.y - titleHalfH + 1e-9,
    'title top ' + (title.y - titleHalfH).toFixed(1) + ' vs bbox top ' + b.miny.toFixed(1));
});

// ---- the Settings panel is a VIEW of `settings`, not a copy taken at page load ----
// Tom, 2026-08-09: the map drew 20-unit text while the Text size box read 2.5, "a condition
// [that] should be impossible". It was possible for every setting, because the panel was built
// once at init and only repainted by the writers that remembered to. toggleSettingsPopup() now
// rebuilds on open; this proves it for a value changed behind the panel's back.
// ---- the annotation strings must actually reach the browser -------------
// drawExampleNetwork() reads these off EngCalcs.pageConfig, which Looped-Network.php builds by
// hand, one line per key. A key that exists in the lang file but is never emitted there arrives
// as undefined and the annotation is silently skipped -- nothing throws, the map is just missing
// a label. This is the check that turns that into a failure.
// ---- ZERO-PRESSURE CALIBRATION (Tom's idea, 2026-08-09) -----------------
// Tom proposed adding "independent systems whose length and upper elevation are tweaked so that
// their lower elevation or pressure is exactly 0", one tuned for US and one for SI, as a sneaky
// regression test -- a 0.00 on the map that stops reading 0.00 the moment a unit or a constant
// drifts. The idea is exactly right; this is that idea with two changes.
//
//  1. It lives HERE, not in the shipped example. On the map only one of the two can read zero at a
//     time (the other is tuned for the other unit set), so a visitor in the wrong preset sees a
//     stray reservoir-and-stub reporting an arbitrary pressure next to a ring main we spent Task
//     254 making look like real work. And a check nobody runs is not a check. Here BOTH are exact,
//     both run on every invocation, and a drift fails loudly instead of waiting to be noticed.
//  2. The demand is DERIVED, not iterated. Tom's screenshot shows 537.15 gpm found by hand; the
//     Hazen-Williams law inverts in closed form, so the length that makes the pressure exactly
//     zero is computed here and the tolerance can be 1e-9 m instead of "looks like 0.00".
//
// WHAT IT ACTUALLY CATCHES, and why it is not redundant with the hand-computed check above: this
// one runs end to end through the APP -- addNode/addLink, effective(), linkLengthSI(),
// assembleModel() -- with the Length/Map selector set, so it exercises the unit boundary that
// Task 255 got wrong. Before that fix, the US case reported 68 ft of pressure where zero was
// designed in.
console.log('\n--- zero-pressure calibration, end to end through the app ---');
['us', 'si'].forEach(which => {
  const us = which === 'us';
  setUnitSet(which);
  L.reset();
  // A reservoir at 100 ft / 30 m feeding one pipe to a junction at elevation zero. Choose the
  // demand, then solve Hazen-Williams backwards for the pipe length that burns EXACTLY the whole
  // static head: L = hf C^n d^m / (coef Q^n), in metres, then declared in map units.
  // CONSTANTS COME FROM EngCalcs, never restated here. Restating them makes the test agree with
  // itself instead of with the app -- literal 10.67/1.852/4.871 left a 0.03% residual against the
  // shipped hwCoef of 10.66682948893005, which is precisely the drift this test exists to catch.
  const coef = EngCalcs.hwCoef, n = EngCalcs.hwExp, m = EngCalcs.hwDiaExp;
  const head = us ? 100 * FT : 30;               // metres
  const Q = us ? 500 * GPM : 0.030;              // m3/s
  const d = us ? 4 * IN : 0.10, C = 130;
  const lenSI = head * Math.pow(C, n) * Math.pow(d, m) / (coef * Math.pow(Q, n));
  const lenDeclared = lenSI * (us ? 1 / FT : 1); // map units -- the number a user would type

  // Written in the DISPLAYED unit, not SI (Task 263): the document now stores what a user types,
  // so a test that wrote metres into a millimetre project would be testing a network 1000x too
  // small -- which is precisely the mistake the wizard in offerUnitRestore() exists to undo.
  const r2 = L.addNode('reservoir', 1000, 1000);
  r2.elev = head * L.unitFactor('lpn_u_elevhead');
  const j = L.addNode('junction', 1000 + lenDeclared, 1000);
  j.elev = 0;
  j._demand = Q * L.unitFactor('lpn_u_flow');
  const pipe = L.addLink('pipe', r2.id, j.id);
  pipe._diameter = d * L.unitFactor('lpn_u_diameter');
  pipe._roughness = C;
  pipe._k = 0;                 // keep the closed form exact -- no minor-loss term
  pipe._length = lenDeclared;
  pipe.lenAuto = false;

  // The unit boundary is engaged: in US the declared number and the SI number genuinely differ,
  // which is the whole thing Task 255 was getting wrong.
  ok(which.toUpperCase() + ': the declared length converts to the intended SI length',
    near(L.linkLengthSI(pipe), lenSI, 1e-9),
    lenDeclared.toFixed(1) + (us ? ' ft -> ' : ' m -> ') + lenSI.toFixed(1) + ' m');

  const model = L.assembleModel(), out = EngCalcs.lpnSolve(model, { tol: 1e-12 });
  const gauge = out.heads[j.id] - j.elev;
  ok(which.toUpperCase() + ': pressure at the calibration junction is exactly zero',
    out.converged && Math.abs(gauge) < 1e-6,
    'gauge head ' + gauge.toExponential(2) + ' m, from a '
      + lenDeclared.toFixed(1) + (us ? ' ft' : ' m') + ' pipe at '
      + (us ? (Q / GPM).toFixed(0) + ' gpm' : (Q * 1000).toFixed(0) + ' L/s'));
});

console.log('\n--- annotation strings are wired end to end ---');
{
  const php = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
  const langSrc = fs.readFileSync(ROOT + 'lib/lang.ec.en.php', 'utf8');
  ['menu_brand', 'lpn_main_menu', 'lpn_tool_add_reservoir', 'bpn_p_min'].forEach(k => {
    ok(k + ' exists in lang.ec.en.php', langSrc.indexOf("$ec_lang['" + k + "']=") >= 0);
    ok(k + ' is emitted into pageConfig by Looped-Network.php', php.indexOf('\t' + k + ':') >= 0);
  });
  // The whole point of composing from existing strings was zero new translation load, and lpn_'s
  // translated languages are the Task 203 core four. Anything borrowed must already exist there.
  ['es', 'pt', 'fr', 'tr'].forEach(lang => {
    const src = fs.readFileSync(ROOT + 'lib/lang.ec.' + lang + '.php', 'utf8');
    const missing = ['menu_brand', 'lpn_main_menu', 'lpn_tool_add_reservoir', 'bpn_p_min']
      .filter(k => src.indexOf("$ec_lang['" + k + "']=") < 0);
    ok('every borrowed string already exists in ' + lang, missing.length === 0, missing.join(','));
  });
}

console.log('\n--- Settings panel stays in sync ---');
{
  const fieldsEl = L.settingsFieldsEl();
  function textSizeInputValue() {
    let found;
    (function walk(n) {
      (n.children || []).forEach(c => {
        if (c.type === 'number' && c.step === 'any' && c.min === '0.1' && found === undefined) { found = c.value; }
        walk(c);
      });
    })(fieldsEl);
    return found;
  }
  // Clear the returning-visitor 2.5 the draw loop above seeded, so this section starts from the
  // shipped default rather than from the previous block's leftovers.
  L.settings().textSize = L.defaultSettings().textSize;
  L.rebuildSettingsFields();
  ok('panel opens on the shipped default', String(textSizeInputValue()) === '20', textSizeInputValue());
  L.settings().textSize = 37;                       // a writer that does NOT repaint the panel
  const popup = byId.lpn_settings_popup;
  popup.style.display = 'none';
  L.toggleSettingsPopup({ currentTarget: mkEl('button') });   // reopening must repaint it
  ok('reopening the panel shows a value changed behind its back',
    String(textSizeInputValue()) === '37', textSizeInputValue());
}


// ---- ROADMAP Task 263: the unit boundary ----------------------------------
// The ban Tom stated: "no inputs conversion on units change." Everything here is about WHERE a
// number is allowed to be multiplied by a unit factor -- at the solver, and on the way back from
// it, and nowhere else. These assertions fail loudly if anybody reintroduces a third site.
{
  console.log('\n--- Task 263: inputs are declared, not converted ---');
  setUnitSet('us');
  L.reset();
  L.drawExample('us');
  const doc = L.getDoc();
  const pipe = doc.links.find(l => l.type !== 'pump');
  const junction = doc.nodes.find(n => n.type === 'junction');

  // 1. THE BAN ITSELF. Snapshot the declared inputs, switch the strip to metric, and require that
  //    not one stored number moved. This is the whole task in one assertion.
  const before = {
    d: pipe._diameter, len: pipe._length, rough: pipe._roughness,
    elev: junction.elev, demand: junction._demand
  };
  const siBefore = L.assembleModel().links.find(l => l.id === pipe.id).diameter;
  setUnitSet('si');
  ok('switching units changes NO stored input',
    pipe._diameter === before.d && pipe._length === before.len &&
    pipe._roughness === before.rough && junction.elev === before.elev &&
    junction._demand === before.demand,
    'diameter still ' + pipe._diameter);
  // 2. ...and the physics DOES move, which is the other half of "reinterpret". A 6 that meant
  //    6 inches now means 6 mm, so the model the solver sees must have changed.
  const siAfter = L.assembleModel().links.find(l => l.id === pipe.id).diameter;
  ok('...but the SI value handed to the solver does change',
    Math.abs(siAfter - siBefore) > 1e-9,
    (siBefore * 1000).toFixed(1) + ' mm -> ' + (siAfter * 1000).toFixed(1) + ' mm');

  // 3. niceDefault returns a number IN THE SELECTED UNIT, both branches. The SI branch is the one
  //    that bit us: siVal is quoted in the SI BASE unit, but the SI preset shows mm and l/s.
  setUnitSet('us');
  ok('niceDefault US branch is the US number as typed', L.niceDefault('lpn_u_diameter', 'in', 6, 0.15) === 6);
  setUnitSet('si');
  ok('niceDefault SI branch scales base SI to the shown unit (0.15 m -> 150 mm)',
    near(L.niceDefault('lpn_u_diameter', 'in', 6, 0.15), 150, 1e-9),
    String(L.niceDefault('lpn_u_diameter', 'in', 6, 0.15)));
  ok('...and 0.015 m3/s -> 15 l/s', near(L.niceDefault('lpn_u_flow', 'gpm', 250, 0.015), 15, 1e-9),
    String(L.niceDefault('lpn_u_flow', 'gpm', 250, 0.015)));

  // 4. THE PROJECT OWNS ITS UNITS. Tom: "it would be another disaster for projects not to be stored
  //    with their units. Imagine opening a 400 diameter pipe into an inch browser!"
  const savedSI = L.serializeProject();
  ok('the saved document records its units by KEY', savedSI.units.lpn_u_diameter === 'mm', JSON.stringify(savedSI.units));
  setUnitSet('us');
  ok('a browser left in inches really is in inches', L.setUnitEl('lpn_u_diameter').options[L.setUnitEl('lpn_u_diameter').selectedIndex].dataset.unit === 'in');
  L.applyUnitSelections(savedSI.units);
  ok('opening that document puts the browser back in mm -- the 400 mm pipe stays 400 mm',
    L.setUnitEl('lpn_u_diameter').options[L.setUnitEl('lpn_u_diameter').selectedIndex].dataset.unit === 'mm');
  // A unit this browser does not offer is skipped, not forced: a wrong selection beats a broken one.
  L.applyUnitSelections({ lpn_u_diameter: 'furlong' });
  ok('an unknown unit is ignored rather than breaking the select',
    L.setUnitEl('lpn_u_diameter').options[L.setUnitEl('lpn_u_diameter').selectedIndex].dataset.unit === 'mm');

  // 5. MIGRATION. v2 documents hold SI and say nothing about units. migrateSaved must stamp and
  //    flag, and must NOT touch a single number -- the rewrite is the user's to authorise.
  const v2 = { v: 2, nodes: [{ id: 'J1', type: 'junction', elev: 15.24, _demand: 0.0157 }],
    links: [{ id: 'P1', type: 'pipe', _diameter: 0.1524, _length: 461, _roughness: 130 }], labels: [] };
  const out = L.migrateSaved(JSON.parse(JSON.stringify(v2)));
  // THE MISSING STAMP *IS* THE PENDING QUESTION -- there is no second flag. migrateSaved must
  // therefore leave a v2 document at v2, or the offer would be silently answered on the user's
  // behalf the first time it was read.
  ok('migrateSaved leaves a v2 document at v2 -- the conversion is the user\'s to authorise',
    out.v === 2, 'v = ' + out.v);
  ok('...and changes no number at all',
    out.nodes[0].elev === 15.24 && out.links[0]._diameter === 0.1524 && out.links[0]._length === 461);

  // 6. WHAT THE DIALOG SHOWS. Five most COMMON diameters, then those sorted smallest to largest,
  //    rendered before -> after so the user can recognise their own pipe schedule.
  setUnitSet('us');
  L.reset();
  const dias = [0.1016, 0.1016, 0.1016, 0.2032, 0.2032, 0.1524, 0.3048, 0.4064, 0.508, 0.6096];
  const nA = L.addNode('junction', 0, 0), nB = L.addNode('junction', 100, 0);
  dias.forEach(d => { const l = L.addLink('pipe', nA.id, nB.id); l._diameter = d; });
  const rows = L.v2RestoreEvidence();
  ok('the offer shows at most 5 diameters', rows.length === 5, rows.join(', '));
  ok('...sorted smallest to largest', rows.map(r => +r.split(' → ')[0]).every((v, i, arr) => i === 0 || arr[i - 1] <= v), rows.join(', '));
  ok('...as before → after, in the units on the strip (0.1016 → 4)',
    rows.some(r => r === '0.1016 → 4'), rows.join(', '));
  // The two genuinely common sizes must survive the cut; the ten-entry set has five singletons
  // tied for the last three slots, so WHICH singletons make it is arbitrary and not asserted.
  ok('...keeping the two most common sizes',
    rows.some(r => r.indexOf('0.1016 ') === 0) && rows.some(r => r.indexOf('0.2032 ') === 0), rows.join(', '));
  ok('...and dropping some of the singletons rather than listing all ten',
    !rows.some(r => r.indexOf('0.6096 ') === 0), rows.join(', '));

  // 7. WHAT THE DIALOG DOES. Scale the SI-stored inputs into the displayed unit -- and only those.
  //    _length was already declarative before this task, and roughness/k are dimensionless: any of
  //    the three getting scaled here would be a new bug wearing a migration's clothes.
  L.reset();
  setUnitSet('us');
  const r3 = L.addNode('reservoir', 0, 0), j3 = L.addNode('junction', 500, 0);
  r3.elev = 30.48; r3._head = 33.53;            // metres, v2 style
  j3.elev = 15.24; j3._demand = 0.0315;          // metres, m3/s
  const p3 = L.addLink('pipe', r3.id, j3.id);
  p3._diameter = 0.2032; p3._length = 675.4; p3._roughness = 130; p3._k = 2;
  p3.curvePoints = null;
  L.setDocVersion(2);
  ok('the document is below the declarative version before the answer', L.docVersion() === 2);
  ok('...and a save of it writes v2, so the offer survives a round trip',
    L.serializeProject().v === 2, 'v = ' + L.serializeProject().v);
  L.applyV2Restore();
  ok('converting stamps the version, so the offer does not return',
    L.docVersion() === L.storageVersion(), 'v = ' + L.docVersion());
  ok('restore scales elevation to feet', near(r3.elev, 100, 0.01), r3.elev.toFixed(2));
  ok('restore scales the reservoir head', near(r3._head, 110, 0.01), r3._head.toFixed(2));
  ok('restore scales demand to gpm', near(j3._demand, 499.2, 1), j3._demand.toFixed(1));
  ok('restore scales diameter to inches', near(p3._diameter, 8, 0.001), p3._diameter.toFixed(3));
  ok('restore leaves LENGTH alone (already declarative before this task)', p3._length === 675.4);
  ok('restore leaves roughness alone (dimensionless)', p3._roughness === 130);
  ok('restore leaves k alone (dimensionless)', p3._k === 2);

  // "Never ask again" is the third answer (Tom, 2026-08-10). It must stamp the version WITHOUT
  // touching a number -- that is the whole difference between it and Convert.
  L.setDocVersion(2);
  const keepD = p3._diameter, keepElev = r3.elev;
  L.stampDocAnswered();
  ok('never-ask-again stamps the version', L.docVersion() === L.storageVersion());
  ok('...and changes nothing', p3._diameter === keepD && r3.elev === keepElev);
  ok('...so a save of it writes the current version, and the offer is gone',
    L.serializeProject().v === L.storageVersion());

  // THE LINE THAT DECIDES WHETHER ANY OF THIS EVER RUNS. applySaved() reads the version off the
  // document; hard-coding it to current there would silently answer the question for every user,
  // and every assertion above would still pass. A mutation test found exactly that hole.
  const v2doc = L.migrateSaved({ v: 2, project: { name: 'old' }, nodes: [], links: [], labels: [] });
  L.applySaved(v2doc);
  ok('opening a v2 document leaves the version at 2 and arms the offer',
    L.docVersion() === 2 && L.restorePending() === true, 'v = ' + L.docVersion() + ', pending = ' + L.restorePending());
  L.applySaved({ v: L.storageVersion(), project: { name: 'new' }, nodes: [], links: [], labels: [], units: {} });
  ok('opening a current document arms nothing',
    L.docVersion() === L.storageVersion() && L.restorePending() === false,
    'v = ' + L.docVersion() + ', pending = ' + L.restorePending());

  // A NEW project made while a v2 one is open must not inherit its version, or File > New project
  // from inside an unmigrated project would save as v2 and be offered a conversion it cannot need.
  //
  // The v2 document here needs REAL PIPES. With none, offerUnitRestore() takes its "nothing to
  // convert" exit and stamps the version itself, so the assertion passed whether newProject() did
  // its job or not -- caught by mutation testing, and the reason this comment is here.
  L.applySaved(L.migrateSaved({ v: 2, project: { name: 'old' },
    nodes: [{ id: 'J1', type: 'junction', elev: 15.24 }, { id: 'J2', type: 'junction', elev: 15.24 }],
    links: [{ id: 'P1', type: 'pipe', from: 'J1', to: 'J2', _diameter: 0.2032 }], labels: [] }));
  ok('a v2 document with real pipes stays at 2 with the offer still standing',
    L.docVersion() === 2 && L.restorePending() === true, 'v = ' + L.docVersion());
  // Consume the offer first (the dialog itself is a no-op here -- there is no #lpn_dialog), so the
  // NEXT refreshAllFromDocument() cannot reach the "nothing to convert" exit and stamp the version
  // on newProject()'s behalf. Without this step the assertion below passes either way.
  L.offerUnitRestore();
  ok('...and showing the offer does not itself answer it', L.docVersion() === 2);
  L.newProject();
  ok('a new project starts at the current version, whatever was open before it',
    L.docVersion() === L.storageVersion(), 'v = ' + L.docVersion());
  // No scenario-override assertion: scenarios are not reachable from any UI, so no v2 document can
  // carry an override. A test for it would be testing code that cannot run.
}


// ---- ROADMAP Task 264: File > New project actually opens ------------------
// Tom, 2026-08-10: "264 is broken. File New has no options. And it does nothing."
//
// The cause was not in the menu contents at all. A row's click bubbles to the document-level
// dismissal in wireTabs(), and by the time it gets there openMenu() has already run
// `list.innerHTML = ''` -- so the clicked button is DETACHED, popup.contains(e.target) is false,
// and the dismissal closes the submenu the row just opened. Every menubar button avoids this by
// calling stopPropagation(); the row handler and the new toolbar button did not.
//
// This is testable without a browser because the stubs record listeners: drive the real handler,
// then run the real dismissal predicate against the result. It is worth testing rather than just
// fixing, because the failure mode is silent -- no error, no menu, and the feature simply looks
// unbuilt.
{
  console.log('\n--- Task 264: the New project submenu survives its own click ---');
  const PC = EngCalcs.pageConfig;
  L.buildMenuBar();
  const bar = byId.lpn_menubar;
  const fileBtn = bar.children[0];
  function fire(el, target) {
    let stopped = false;
    const ev = { currentTarget: el, target: target || el, stopPropagation() { stopped = true; } };
    (el._listeners.click || []).forEach(fn => fn(ev));
    return { stopped, ev };
  }
  // The document dismissal, transcribed from wireTabs(). If a handler did not stop the click, this
  // is what would run next -- so asserting against it is asserting against the real rule.
  function dismissalWouldClose(target) {
    const popup = byId.lpn_menu_popup;
    return popup.style.display === 'block' && !popup.contains(target);
  }

  const openFile = fire(fileBtn);
  ok('the File menu opens', L.menuPopupOpen());
  ok('...and the menubar button stops its click reaching the dismissal', openFile.stopped);

  const rows = byId.lpn_menu_list.children;
  const newRow = rows.find(r => (r.children[1] && r.children[1].textContent) === PC.lpn_file_new);
  ok('File carries a New project row', !!newRow);

  ok('...and it is marked as opening a submenu', !!newRow.children.find(c => c.textContent === '▸'));

  const clicked = fire(newRow);
  // THE FLY-OUT CONTRACT (Tom, 2026-08-10): the parent stays on screen. The first cut replaced the
  // File menu's own contents, which reads as having navigated away from File rather than into it.
  ok('clicking it leaves the PARENT menu open', L.menuPopupOpen());
  ok('...and opens the fly-out beside it', L.subMenuOpen());
  const labels = byId.lpn_menu_list2.children
    .map(c => (c.children && c.children[1] && c.children[1].textContent) || '')
    .filter(Boolean);
  ok('...carrying the real options', 
    labels.indexOf(PC.lpn_new_blank_us) >= 0 && labels.indexOf(PC.lpn_new_blank_si) >= 0 && labels.indexOf(PC.lpn_new_example_us) >= 0 &&
    labels.indexOf(PC.lpn_new_example_si) >= 0, labels.join(' | '));
  ok('...and the parent list is untouched, so File is still File',
    byId.lpn_menu_list.children.length > 3);
  ok('the row stops its own click, so the dismissal cannot reach past it', clicked.stopped);
  // The fly-out also removes the ORIGINAL failure mode rather than merely working around it: the
  // clicked row is still in the parent popup, so the dismissal predicate would not have closed
  // anything even if the click had got through.
  ok('...and the clicked row is still inside the parent popup', dismissalWouldClose(newRow) === false);

  // HOVER opens it as well -- both gestures are the convention, and a fly-out that only answers to
  // clicks is the half-built version of one.
  fire(fileBtn);              // toggles the whole menu shut, fly-out with it
  ok('closing the parent takes the fly-out with it', !L.menuPopupOpen() && !L.subMenuOpen());
  fire(fileBtn);              // and open again, fresh rows
  const newRow2 = byId.lpn_menu_list.children
    .find(r => (r.children[1] && r.children[1].textContent) === PC.lpn_file_new);
  (newRow2._listeners.mouseenter || []).forEach(fn => fn({}));
  ok('hovering the row opens the fly-out too', L.subMenuOpen());
  // ...and moving onto a plain row takes it away again.
  // THE BUG TOM HIT: "it disappears before the mouse can reach it; it honestly seems to disappear
  // BECAUSE you reach it." The dismiss-on-hover was attached to every plain row at EVERY level, so
  // entering a row of the fly-out closed the fly-out that row was in. Reaching it was fatal.
  const blankRow = byId.lpn_menu_list2.children
    .find(r => (r.children[1] && r.children[1].textContent) === PC.lpn_new_blank_us);
  ok('the fly-out has a Blank project row to reach', !!blankRow);
  ok('...and both blank rows name their unit system, as the examples do',
    labels.filter(l => l.indexOf(PC.lpn_new_blank_us) === 0 || l.indexOf(PC.lpn_new_blank_si) === 0).length === 2,
    labels.join(' | '));
  (blankRow._listeners.mouseenter || []).forEach(fn => fn({}));
  ok('hovering a row INSIDE the fly-out does not close it', L.subMenuOpen());

  // The other half: the path from the parent row to the fly-out is diagonal and crosses the rows
  // below it, so those must not dismiss on contact either -- they ARM a close that anything inside
  // the fly-out cancels.
  const openRow = byId.lpn_menu_list.children
    .find(r => (r.children[1] && r.children[1].textContent) === PC.lpn_file_open);
  (openRow._listeners.mouseenter || []).forEach(fn => fn({}));
  ok('crossing a parent row on the way there does not close it immediately', L.subMenuOpen());
  ok('...it arms a close instead', L.subClosePending() === true);
  (blankRow._listeners.mouseenter || []).forEach(fn => fn({}));
  ok('...which reaching the fly-out cancels', L.subClosePending() === false && L.subMenuOpen());

  // The TOOLBAR route to the same submenu had the identical defect. Building the whole toolbar here
  // is more scaffolding than the check is worth, so this is a source-level guard instead: any click
  // handler that opens this menu must stop the click. Crude, and it would not catch a third route
  // written differently -- but it holds the two that exist, and it costs nothing.
  {
    const appSrc = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
    const openers = appSrc.split('\n').filter(l => /addEventListener\('click'/.test(l) && /openNewProjectMenu/.test(l));
    ok('every click handler that opens the New project menu stops its click',
      openers.length > 0 && openers.every(l => /stopPropagation\(\)/.test(l)),
      openers.length + ' handler(s)');
  }
}


// ---- Task 264 follow-up: a brand-new project wears no asterisk ------------
// Tom, 2026-08-10: "New blank projects and from template appear with asterisk, which is bad. But a
// blank project with asterisk closes without confirmation, which is bad." Both halves are the same
// defect -- the mark claimed unsaved work a second after creation, and closeTab() had to special-
// case the claim back out again. The fix is a BASELINE at birth, so `dirty` starts false.
{
  console.log('\n--- Task 264 follow-up: no asterisk on a new project ---');
  setUnitSet('us');
  L.reset();

  // Through the real menu path (newBlankProject), not newProject() directly -- the unit switch it
  // performs is itself a change that marks the project dirty, so the baseline has to be stamped
  // after it. Testing the raw newProject() would miss that ordering entirely.
  // START IN SI so the switch to US is observable. Asserting the unit AFTER a run that was already
  // in US proves nothing, which is how the "does it commit to its units at all" mutation survived.
  setUnitSet('si');
  L.newBlankProject('us');
  const blankId = L.openId();
  ok('a blank project from the menu starts clean -- no asterisk',
    L.tabAsterisk(L.indexEntry(blankId)).show === false, 'dirty = ' + L.indexEntry(blankId).dirty);
  ok('...and it is in the unit system its row named',
    L.setUnitEl('lpn_u_flow').options[L.setUnitEl('lpn_u_flow').selectedIndex].dataset.unit === 'gpm');

  // ...and it must EARN one. Anything else would make the mark meaningless in the other direction.
  L.addNode('junction', 10, 10);
  L.saveToStorage();
  ok('...and earns one at the first edit', L.tabAsterisk(L.indexEntry(blankId)).show === true);
  ok('...faint, because it lives only in this browser',
    L.tabAsterisk(L.indexEntry(blankId)).faded === true);

  // The example arrives by the user choosing it from a menu and is two clicks to recreate, so it is
  // not unsaved work either.
  L.newProjectFromExample('us');
  const exId = L.openId();
  ok('a project made from an example starts clean too',
    L.tabAsterisk(L.indexEntry(exId)).show === false, 'dirty = ' + L.indexEntry(exId).dirty);
  ok('...even though it is full of network', L.getDoc().links.length > 0);
  // THROUGH THE REAL ENTRY POINT, not L.drawExample() directly: newProjectFromExample() is where the
  // chosen system lives, and this is the only assertion that proves it reaches the title block. The
  // direct-call tests above pass the system by hand, so dropping the argument here survives them.
  ok('...and its title block names the system the menu row committed to',
    L.getDoc().labels.some(t => t.text === L.unitSetLabel('us')),
    L.getDoc().labels.map(t => t.text).join(' | '));
}


// ---- the map status readout ----------------------------------------------
// Tom, 2026-08-10: "when the new user arrives, what units do they get, and is there a way they
// should know?" They get US on an English page and SI on every other, and until this there was no
// way to find out without opening Settings -- map labels are bare numbers by design.
{
  console.log('\n--- map status readout ---');
  const PC = EngCalcs.pageConfig;
  setUnitSet('us');
  L.refreshMapStatus();
  const usText = byId.lpn_map_status.textContent;
  ok('it names the flow unit the map is drawn in', /gpm/.test(usText), usText);
  ok('...and the pressure unit', /psi/.test(usText), usText);
  ok('...and the friction method', usText.indexOf(PC.bpn_method_hw) >= 0, usText);
  // A language-neutral divider, so the three pairs do not read as one string (Tom, 2026-08-10).
  ok('...divided by a pipe, not run together by whitespace',
    usText.split(' | ').length === 3, usText);
  ok('...each behind a translated label, not a bare token',
    usText.indexOf(PC.lpn_units_flow) >= 0 && usText.indexOf(PC.lpn_units_pressure) >= 0 &&
    usText.indexOf(PC.bpn_method) >= 0, usText);

  // It has to FOLLOW the units, or it is worse than nothing -- a stale readout is a confident lie.
  // Through EngCalcs.setUnits, which is the REAL path a user takes (it re-enters pageCalculator);
  // calling refreshMapStatus() by hand here would assert only that the function works, not that
  // anything ever calls it. That mutation survived until this line changed.
  EngCalcs.setUnits('si');
  const siText = byId.lpn_map_status.textContent;
  ok('switching units changes it', /lps/.test(siText) && !/gpm/.test(siText), siText);

  // The method is hardcoded today, but read through frictionMethod() so Task 271 inherits a working
  // readout rather than a literal to hunt down.
  ok('the friction method defaults to Hazen-Williams', L.frictionMethod() === 'hw');
  L.settings().method = 'dw';
  L.refreshMapStatus();
  ok('...and the readout follows settings.method when one is set',
    byId.lpn_map_status.textContent.indexOf(PC.bpn_method_dw) >= 0, byId.lpn_map_status.textContent);
  ok('...as does the model handed to the solver', L.assembleModel().method === 'dw');
  delete L.settings().method;

  // ORDER, which lives in the markup rather than in JS: settings first, then the cursor position,
  // matching EPANET's status bar (Tom, 2026-08-10). A source-level check because that is where the
  // fact is -- and because "they don't collide" is not the same claim as "they are in this order",
  // which is what two absolutely-positioned boxes used to give us.
  {
    const page = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
    const footer = page.indexOf('id="lpn_map_footer"');
    const status = page.indexOf('id="lpn_map_status"');
    const coords = page.indexOf('id="lpn_coords"');
    ok('both readouts live in one status strip', footer >= 0 && footer < status && footer < coords);
    ok('...with the settings BEFORE the coordinates', status < coords,
      'status@' + status + ' coords@' + coords);
  }
}

// ---- The unit-set label: FORCED by the caller, never read back off the strip ----
// Task 265 put "US Units" on the browser tab; Tom reversed it the same day -- the map's status strip
// already answers "what units am I in", continuously, where you are already looking. He then cut the
// derivation that survived it: *"We never create an example based on the current units, or we
// shouldn't. We should force the units we want and label thusly."* So the label takes the preset the
// caller committed to, and there is no reading of the live selects anywhere.
{
  console.log('\n--- the unit-set label is forced, not derived ---');
  const PC = EngCalcs.pageConfig;
  ok('US renders as a whole translated phrase, not "US" + "Units" concatenated',
    L.unitSetLabel('us') === PC.lpn_title_units.replace('{units}', PC.calc_units_us),
    L.unitSetLabel('us'));
  ok('...and SI likewise', /SI/.test(L.unitSetLabel('si')), L.unitSetLabel('si'));

  // THE POINT OF THE CUT: the label follows its ARGUMENT, not the strip. Set the strip to the
  // opposite system and require the answer not to move. A derived version fails this.
  setUnitSet('si');
  ok('the label ignores the live strip entirely',
    L.unitSetLabel('us') === PC.lpn_title_units.replace('{units}', PC.calc_units_us),
    'strip is SI, label says ' + L.unitSetLabel('us'));

  // Perturb the KEYS, not the units, to prove the label is really plumbed through pageConfig. In
  // English `calc_units_si` is the literal "SI", so hardcoding it would pass every check above --
  // and would then be wrong the day a language translates the token. This is the only assertion
  // that can tell a lookup from a literal.
  {
    const keepTok = PC.calc_units_si, keepTpl = PC.lpn_title_units;
    PC.calc_units_si = 'ZZ'; PC.lpn_title_units = '[{units}]';
    ok('the label is composed from the lang keys, not from literals in the JS',
      L.unitSetLabel('si') === '[ZZ]', L.unitSetLabel('si'));
    PC.calc_units_si = keepTok; PC.lpn_title_units = keepTpl;
  }

  // NOTHING writes the browser tab any more. A source check, because the defect this guards is a
  // line coming back, not a value being wrong.
  {
    const js = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
    ok('the page never writes document.title', js.indexOf('document.title') < 0);
    ok('...and nothing derives a preset name from the selects', js.indexOf('unitSetName') < 0);
  }

  // The strings are real lang keys, not literals hiding behind a fallback -- the mistake that made
  // the Task 270 audit report the backdrop menu wrong (it quoted JS fallbacks, not shipped values).
  {
    const langSrc = fs.readFileSync(ROOT + 'lib/lang.ec.en.php', 'utf8');
    ok('lpn_title_units carries a {units} placeholder rather than concatenating fragments',
      /\$ec_lang\['lpn_title_units'\]='[^']*\{units\}[^']*';/.test(langSrc));
    const page = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
    ok('...and its three strings reach pageConfig',
      ['lpn_title_units', 'calc_units_us', 'calc_units_si']
        .every(k => page.indexOf(k + ': <?=json_encode') >= 0));
    ok('the retired mixed-units key is gone everywhere',
      langSrc.indexOf('lpn_title_units_mixed') < 0 && page.indexOf('lpn_title_units_mixed') < 0);
  }
}

// ---- ROADMAP Task 277: a move is undoable ----
// The bug was not "Undo skips a drag". No drag handler snapshotted at all, so Undo after a drag
// reverted the last DISCRETE act and left the drag standing -- it took back something the user was
// not looking at. Driven through the REAL pointer handlers, because the defect lived in the gap
// between them and saveUndoSnapshot(); calling applyDrag() alone would test the wrong half.
{
  console.log('\n--- Task 277: moving is undoable ---');
  const svg = byId.lpn_canvas;
  function fire(type, ev) {
    setHitTarget(ev.target && ev.target.dataset ? ev.target : null);
    (svg._listeners[type] || []).forEach(fn => fn(ev));
  }
  // One whole gesture: press on `target`, then FOUR move-and-apply frames on the way to (x2,y2),
  // then release. Multi-frame on purpose -- a real drag is hundreds of frames, and a one-frame
  // stand-in cannot tell "one snapshot per gesture" from "one snapshot per frame", which is the
  // difference between an Undo that works and an undo stack of 20 near-identical states.
  function dragTo(target, x1, y1, x2, y2) {
    fire('pointerdown', { pointerId: 1, clientX: x1, clientY: y1, target: target, button: 0 });
    for (let f = 1; f <= 4; f++) {
      fire('pointermove', {
        pointerId: 1, target: target,
        clientX: x1 + (x2 - x1) * f / 4, clientY: y1 + (y2 - y1) * f / 4
      });
      if (L.dragActive()) { L.applyDrag(); }
    }
    fire('pointerup', { pointerId: 1, clientX: x2, clientY: y2, target: target });
  }

  setUnitSet('us');
  L.reset();
  L.wirePointerEvents();
  L.drawExample('us');
  const doc0 = L.getDoc();
  const node = doc0.nodes.find(n => n.type === 'junction');
  const home = { x: node.x, y: node.y };

  // A node carries data-node; that is what the pointerdown handler reads to open a 'node' drag.
  const nodeEl = { dataset: { node: node.id }, classList: { contains: () => false } };
  const before = L.undoDepth();
  dragTo(nodeEl, 100, 100, 260, 180);
  const moved = { x: node.x, y: node.y };
  ok('the drag actually moved the node', moved.x !== home.x || moved.y !== home.y,
    home.x.toFixed(1) + ',' + home.y.toFixed(1) + ' -> ' + moved.x.toFixed(1) + ',' + moved.y.toFixed(1));
  ok('...and cost exactly ONE undo snapshot, not one per frame',
    L.undoDepth() === before + 1, before + ' -> ' + L.undoDepth());

  L.undo();
  const back = L.getDoc().nodes.find(n => n.id === node.id);
  ok('Undo puts the node back where it was',
    near(back.x, home.x, 1e-9) && near(back.y, home.y, 1e-9),
    back.x.toFixed(1) + ',' + back.y.toFixed(1));

  // THE ACTUAL DEFECT, stated as a test: with a discrete act sitting under the drag, Undo used to
  // revert THAT and leave the drag alone. Delete a link, drag a node, Undo once -- the node must
  // come home and the deleted link must stay deleted.
  {
    L.reset();
    L.drawExample('us');
    const d = L.getDoc();
    const n2 = d.nodes.find(x => x.type === 'junction');
    const victim = d.links.find(l => l.type !== 'pump' && l.from !== n2.id && l.to !== n2.id);
    const delEl = { dataset: { link: victim.id }, classList: { contains: () => false } };
    L.setMode('delete');
    fire('pointerup', { pointerId: 9, clientX: 5, clientY: 5, target: delEl });
    const afterDelete = L.getDoc().links.length;
    L.setMode('select');
    const p0 = { x: n2.x, y: n2.y };
    dragTo({ dataset: { node: n2.id }, classList: { contains: () => false } }, 100, 100, 300, 220);
    L.undo();
    const d2 = L.getDoc(), n3 = d2.nodes.find(x => x.id === n2.id);
    ok('one Undo takes back the DRAG, not the delete underneath it',
      near(n3.x, p0.x, 1e-9) && near(n3.y, p0.y, 1e-9) && d2.links.length === afterDelete,
      'node ' + n3.x.toFixed(1) + ',' + n3.y.toFixed(1) + ' / links ' + d2.links.length
        + ' (was ' + afterDelete + ' after the delete)');
  }

  // EVERY DRAGGABLE THING, not just a node. Each is a separate branch of applyDrag() and so a
  // separate place the snapshot can be dropped -- covering only the node left four call sites that
  // could regress silently (all four survived mutation until this ran).
  {
    L.reset();
    L.wirePointerEvents();
    L.drawExample('us');
    const d = L.getDoc();
    const bent = d.links.find(l => l.verts && l.verts.length > 0);
    const anchored = d.labels[0];
    const someNode = d.nodes.find(n => n.type === 'junction');
    const someLink = d.links.find(l => l.type !== 'pump');
    const hit = (dataset, cls) => ({ dataset: dataset, classList: { contains: c => c === cls } });
    [
      ['a pipe vertex', hit({ link: bent.id, vidx: '0' }, 'lpn-vhandle')],
      ['a Text label', hit({ lbl: anchored.id })],
      ["a node's data label", hit({ nodelbl: someNode.id })],
      ["a link's data label", hit({ linklbl: someLink.id })]
    ].forEach(function (row) {
      const before = L.undoDepth();
      dragTo(row[1], 120, 120, 320, 240);
      ok('dragging ' + row[0] + ' costs exactly one snapshot',
        L.undoDepth() === before + 1, before + ' -> ' + L.undoDepth());
    });
  }

  // A CLICK IS NOT A DRAG. Every select-mode press opens a drag record, so snapshotting at
  // pointerdown would push a document copy for every tap that merely opened a popup -- the stack
  // fills with identical states and Undo looks broken. Press and release without moving.
  {
    L.reset();
    L.drawExample('us');
    const n4 = L.getDoc().nodes.find(x => x.type === 'junction');
    const el4 = { dataset: { node: n4.id }, classList: { contains: () => false } };
    const d0 = L.undoDepth();
    fire('pointerdown', { pointerId: 2, clientX: 100, clientY: 100, target: el4 });
    fire('pointerup', { pointerId: 2, clientX: 100, clientY: 100, target: el4 });
    ok('a click that never moves costs no snapshot', L.undoDepth() === d0,
      d0 + ' -> ' + L.undoDepth());
  }

  // Panning moves the CAMERA. saveUndoSnapshot() deep-clones the document, so a pan in the stack
  // would be both a wasted copy and an Undo that appears to do nothing.
  {
    const d0 = L.undoDepth();
    dragTo({ dataset: {}, classList: { contains: () => false } }, 100, 100, 400, 400);
    ok('panning the map costs no snapshot', L.undoDepth() === d0, d0 + ' -> ' + L.undoDepth());
  }
}

// ---- Task 274, second half: the FILE stores Cartesian Y from v4 ----
// Tom, 2026-08-11: "Eventually needs to be Cartesian. If we can do that now without causing
// trouble, let's do it." The trouble to avoid is existing projects, and the gate is what avoids it.
{
  console.log('\n--- Task 274: the saved file is Cartesian from v4 ---');
  setUnitSet('us');
  L.reset();
  L.drawExample('us');
  L.setDocVersion(L.storageVersion());
  const doc = L.getDoc();
  const node = doc.nodes.find(n => n.type === 'junction');
  const internalY = node.y;

  const file = L.serializeProject();
  const fileNode = file.nodes.find(n => n.id === node.id);
  ok('the file stores the coordinate the USER sees, not the internal one',
    Math.abs(fileNode.y - L.cartesianY(internalY)) < 1e-9,
    'internal ' + internalY.toFixed(1) + ' -> file ' + fileNode.y.toFixed(1));

  // SERIALIZING MUST NOT MOVE THE DRAWING. flipStoredY() mutates, and serializeProject() builds its
  // object from live references to doc.nodes/links/labels -- so a missing clone would flip the map
  // upside down on every autosave. This is the assertion that catches it.
  ok('...and serializing left the live document alone',
    L.getDoc().nodes.find(n => n.id === node.id).y === internalY, internalY.toFixed(1));

  // ROUND TRIP. The two flips are each other's inverse or every save/load cycle mirrors the map.
  {
    const copy = JSON.parse(JSON.stringify(file));
    L.applySaved(copy);
    ok('save then load returns the identical drawing',
      Math.abs(L.getDoc().nodes.find(n => n.id === node.id).y - internalY) < 1e-9,
      L.getDoc().nodes.find(n => n.id === node.id).y.toFixed(1));
  }

  // EVERY Y-BEARING FIELD, not just node positions. A label offset or a backdrop anchor left
  // unflipped survives the round trip above (it flips zero times either way) but writes a file that
  // is half Cartesian and half not.
  {
    const probe = {
      v: 4,
      nodes: [{ id: 'J1', y: 10, ly: 3 }],
      links: [{ id: 'P1', ly: 5, verts: [{ x: 1, y: 7 }] }],
      labels: [{ id: 'T1', y: 9 }],
      backdrop: { ty: 11, y: 0, height: 100 }
    };
    L.flipStoredY(probe);
    ok('all six Y-bearing fields flip: node y/ly, vertex y, link ly, label y, backdrop ty',
      probe.nodes[0].y === -10 && probe.nodes[0].ly === -3 && probe.links[0].verts[0].y === -7
      && probe.links[0].ly === -5 && probe.labels[0].y === -9 && probe.backdrop.ty === -11,
      JSON.stringify(probe));
    ok('...and the backdrop\'s own y/height are NOT flipped -- it is anchored top-left',
      probe.backdrop.y === 0 && probe.backdrop.height === 100);
  }

  // A v3 DOCUMENT IS UPGRADED ON OPEN, like every other version step in migrateSaved(). Tom,
  // 2026-08-11: "We always upgrade the file to the current format. Right?" -- right, and the first
  // cut of this wrongly left v3 files at v3 forever on the strength of serializeProject() writing
  // openDocVersion. That made a second, undocumented exception out of what should have been one.
  {
    L.reset();
    L.drawExample('us');
    L.setDocVersion(3);
    const v3file = L.serializeProject();               // written Y-down, as a real v3 file is
    const j = v3file.nodes.find(n => n.type === 'junction');
    const liveY = L.getDoc().nodes.find(n => n.id === j.id).y;
    ok('a v3 file is stored Y-down, as it always was', v3file.v === 3 && j.y === liveY,
      'v' + v3file.v + ', y ' + j.y.toFixed(1));

    const opened = L.migrateSaved(JSON.parse(JSON.stringify(v3file)));
    ok('...and opening it upgrades it to the current version', opened.v === L.storageVersion(),
      'v3 -> v' + opened.v);
    ok('...converting its coordinates on the way, not leaving them behind',
      opened.nodes.find(n => n.id === j.id).y === -j.y,
      j.y.toFixed(1) + ' -> ' + opened.nodes.find(n => n.id === j.id).y.toFixed(1));
    L.applySaved(opened);
    ok('...so the drawing comes back exactly where it was, not mirrored',
      L.getDoc().nodes.find(n => n.id === j.id).y === liveY,
      L.getDoc().nodes.find(n => n.id === j.id).y.toFixed(1));
  }

  // V2 IS THE ONE VERSION THAT LAGS, and only because the units question is the user's to answer.
  // It must NOT be swept up by the coordinate upgrade, or answering that question silently answers
  // the other one too.
  {
    const v2 = { v: 2, nodes: [{ id: 'J1', x: 1, y: 10 }], links: [], labels: [] };
    const out = L.migrateSaved(JSON.parse(JSON.stringify(v2)));
    ok('a v2 document stays at v2, coordinates untouched',
      out.v === 2 && out.nodes[0].y === 10, 'v' + out.v + ', y ' + out.nodes[0].y);
  }
}

// ---- ROADMAP Task 274: the user works in Cartesian coordinates (Y increases upward) ----
// Tom, 2026-08-10: "EPANET uses normal cartesian coordinates, where up and right are positive. But
// we have the opposite like a graphic arts software. Cartesian is engineering."
//
// EVERY ASSERTION HERE IS STATED AS A DIRECTION, never as a sign. "Higher on screen reports a
// larger Y" is the user's claim and stays true however the internals are arranged; `y === -n.y`
// would just restate the implementation back to itself and would pass a version that flipped BOTH
// the display and the entry, which is exactly the bug that matters.
{
  console.log('\n--- Task 274: Cartesian coordinates at the user boundary ---');
  const svg = byId.lpn_canvas;
  function fire(type, ev) {
    setHitTarget(ev.target && ev.target.dataset ? ev.target : null);
    (svg._listeners[type] || []).forEach(fn => fn(ev));
  }
  function readoutYAt(screenY) {
    fire('pointermove', { pointerId: 7, clientX: 400, clientY: screenY, target: svg });
    return parseFloat(byId.lpn_coords.textContent.split('Y:')[1]);
  }

  setUnitSet('us');
  L.reset();
  L.wirePointerEvents();
  L.drawExample('us');

  // 1. THE READOUT. Screen Y grows downward, so the HIGHER point is the SMALLER clientY.
  const yHigh = readoutYAt(100), yLow = readoutYAt(400);
  ok('the coordinate readout reports a LARGER Y higher up the screen', yHigh > yLow,
    'screen 100 -> ' + yHigh.toFixed(1) + ', screen 400 -> ' + yLow.toFixed(1));

  // 2. THE POPUP, and it must agree with the readout rather than having its own opinion. Dragging a
  // node upward has to raise the Y its property sheet shows.
  {
    const node = L.getDoc().nodes.find(n => n.type === 'junction');
    const PCX = EngCalcs.pageConfig;
    // readonlyField() builds <label>[label text]<span>value</span></label>. Walk the labels, match
    // the one whose text is exactly "Y", and read the span beside it.
    function popupY(id) {
      L.renderNodeFields(id);
      const rows = byId.lpn_popup_fields.children.filter(c => c.tagName === 'LABEL');
      for (const r of rows) {
        if ((r.textContent || '').trim() !== PCX.lpn_field_y) { continue; }
        const span = (r.children || []).find(c => c.tagName === 'SPAN');
        return span ? parseFloat(span.textContent) : NaN;
      }
      return NaN;
    }
    const beforeY = popupY(node.id);
    // Drag straight UP the screen: same clientX, a smaller clientY.
    const el = { dataset: { node: node.id }, classList: { contains: () => false } };
    fire('pointerdown', { pointerId: 3, clientX: 300, clientY: 400, target: el });
    fire('pointermove', { pointerId: 3, clientX: 300, clientY: 200, target: el });
    if (L.dragActive()) { L.applyDrag(); }
    fire('pointerup', { pointerId: 3, clientX: 300, clientY: 200, target: el });
    const afterY = popupY(node.id);
    ok('dragging a node UP raises the Y its popup reports', afterY > beforeY,
      beforeY.toFixed(1) + ' -> ' + afterY.toFixed(1));
    // readonlyField() prints toFixed(2), so the tolerance is half a displayed digit, not an epsilon.
    const storedY = L.getDoc().nodes.find(n => n.id === node.id).y;
    ok('...and the popup agrees with the readout, not with the raw stored value',
      Math.abs(afterY - (-storedY)) < 0.005,
      'popup ' + afterY.toFixed(2) + ' vs stored ' + storedY.toFixed(2));
  }

  // 3. ENTRY AND DISPLAY MUST BE INVERSES. The backdrop "type the X,Y" prompt is the only place the
  // page reads a coordinate FROM the user, and it is the one site where getting the sign wrong
  // twice would cancel out in every test that checks only display. So: type a Cartesian Y, then ask
  // the readout where that point actually is.
  {
    L.setBackdrop({ href: 'x', iw: 100, ih: 100, x: 0, y: 0, width: 100, height: 100, tx: 0, ty: 0, s: 1 });
    // Drive the real prompt path: pick a reference point, choose "coords", type a target.
    const refScreenY = 300;
    const refWorld = L.screenToWorld(400, refScreenY);
    const targetCartesianY = 1234;
    global.prompt = global.window.prompt = () => '500,' + targetCartesianY;
    byId.lpn_backdrop_target_mode.value = 'coords';
    L.showBackdropTargetPanel(refWorld);
    byId.lpn_backdrop_target_continue.onclick({});   // showBackdropTargetPanel wires it with .onclick, not addEventListener
    // The reference point moved to the typed coordinate, so the backdrop shifted by the difference.
    // Ask the readout what Cartesian Y the reference point now sits at -- it must be what was typed.
    const b = L.getBackdrop();
    ok('a typed Cartesian Y puts the point where the readout then reports that same Y',
      Math.abs(-(refWorld.y + b.ty) - targetCartesianY) < 1e-9,
      'typed ' + targetCartesianY + ', point now at ' + (-(refWorld.y + b.ty)).toFixed(2));
    L.setBackdrop(null);
    global.prompt = global.window.prompt = () => 'X';
  }

  // 4. ONE HOME for the concept. Four call sites was already enough for two of them to drift apart;
  // Task 276 added a fifth when applyWorldFile() started reading a world file's Cartesian C,F into
  // the internal Y-down frame. Raising this number is fine when the new site is a real boundary --
  // the point of the check is that a boundary never gets its own inline `-y` instead.
  {
    const js = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
    const uses = (js.match(/cartesianY\(/g) || []).length;
    ok('the flip has exactly one definition and every boundary goes through it', uses === 6,
      uses + ' occurrences (1 definition + 5 boundary sites)');
  }
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
