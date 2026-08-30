// Shared headless-browser scaffolding for the js/looped-network.js harnesses.
//
// EXTRACTED, not written (2026-08-11, ROADMAP Task 196). Every line below came out of
// example-network-harness.js unchanged; it moved here the moment a SECOND harness needed the whole
// of it (inp-import-harness.js, which drives File > Import EPANET file end to end and therefore
// touches storage, units, the document, the dialog and the renderer at once). One copy is the
// point: a stub that drifts between two harnesses makes both of them agree with themselves.
//
// The technique, in one line: eval the REAL page file against DOM stubs, injecting a test-only
// export object just before its DOMContentLoaded listener, so init() never runs and the test picks
// its own entry points.

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..') + path.sep;

const GPM = 6.309019640343977e-5, FT = 0.3048, IN = 0.0254;

// ---- minimal DOM --------------------------------------------------------
// `svgNS` is not decoration either. A real DOM sets nodeName to the element's qualified name,
// which for an SVG element is its LOWERCASE local name and for an HTML element is uppercase --
// and page code that walks childNodes looking for a particular SVG child (the <title> on a
// scenario override ring, ROADMAP Task 512) tests exactly that. A stub that reported one casing
// for both would make such a walk pass here and find nothing in a browser, or the reverse.
// `data-my-thing` <-> `dataset.myThing`, the DOM's own spelling rule, in one place.
function dataKey(attr) {
  return attr.slice(5).replace(/-([a-z])/g, (m, c) => c.toUpperCase());
}
function mkEl(tag, svgNS) {
  const el = {
    nodeName: svgNS ? String(tag) : String(tag || 'div').toUpperCase(),
    // nodeType 1 is not decoration: repositionMultilineText() moves ONLY element children
    // (`child.nodeType === 1`), so a stub element without it silently skipped every tspan and a
    // harness would have reported a multi-line label moving when the real page leaves its rows
    // behind. A createTextNode() result already carries nodeType 3 below.
    nodeType: 1,
    // Whether this element was made through createElementNS, so cloneNode() below can make a clone
    // of the same kind rather than quietly turning an SVG node into an HTML one.
    _svg: !!svgNS,
    tagName: (tag || 'div').toUpperCase(), _tag: tag, children: [], dataset: {},
    style: { _props: {}, setProperty(k, v) { this._props[k] = v; }, getPropertyValue(k) { return this._props[k] || ''; }, removeProperty(k) { delete this._props[k]; } },
    // **classList AND THE `class` ATTRIBUTE ARE THE SAME THING**, as they are in a browser. They
    // were two independent stores here, and that is a stub removing a coupling: the page declares
    // membership through setAttribute('class', ...) (el(), annotationEl()) and suppresses through
    // classList.toggle() on the <svg>, so a harness asking "would this stylesheet rule fire on this
    // element" got an empty class attribute for an element the code had just classed. Backed by the
    // attribute string, which is what a rule is written against.
    classList: {
      _el: null,
      _toks() { return String(this._el['class'] || '').split(/\s+/).filter(Boolean); },
      _put(t) { this._el['class'] = t.join(' '); },
      add(...c) { const t = this._toks(); c.forEach(x => { if (t.indexOf(x) < 0) { t.push(x); } }); this._put(t); },
      remove(...c) { this._put(this._toks().filter(x => c.indexOf(x) < 0)); },
      contains(c) { return this._toks().indexOf(c) >= 0; },
      toggle(c, on) { if (on === undefined) { on = !this.contains(c); } if (on) { this.add(c); } else { this.remove(c); } return on; }
    },
    className: '', id: '', title: '', type: '', value: '', _text: '', _innerHTML: '',
    checked: false, placeholder: '', step: '', min: '', _listeners: {},
    appendChild(c) { this.children.push(c); c.parentNode = this; return c; },
    insertBefore(c) { this.children.unshift(c); c.parentNode = this; return c; },
    // Removing the TEXT NODE clears the text, which is the other half of firstChild seeing it: the
    // standard `while (firstChild) removeChild(firstChild)` teardown would otherwise hand back the
    // same synthetic node forever and never terminate.
    removeChild(c) {
      if (c && c.nodeType === 3 && c._owner === this) { this._text = ''; return c; }
      const i = this.children.indexOf(c); if (i >= 0) { this.children.splice(i, 1); } return c;
    },
    // 'style' must not clobber the style OBJECT -- el() passes style as an attribute string, and
    // the layout code then writes .style.display on the same element.
    // **A `data-*` ATTRIBUTE AND `dataset` ARE THE SAME STORAGE, and that is a relationship the
    // real DOM keeps and this stub has to keep too** (dev/testing-notes.md). buildNodeEls() writes
    // `'data-node': n.id` through setAttribute, while every pointer handler reads `t.dataset.node`
    // -- so without this a drawn node is a hit to getAttribute() and BARE MAP to the code deciding
    // what a press grabbed, and a harness driving the real handlers fails for a reason that does not
    // exist in a browser. Found by exactly that, wiring Task 417's grab test.
    setAttribute(k, v) {
      if (k === 'style') { this._styleAttr = v; return; }
      this[k] = v;
      if (k.indexOf('data-') === 0) { this.dataset[dataKey(k)] = String(v); }
    },
    getAttribute(k) { return k === 'style' ? this._styleAttr : this[k]; },
    removeAttribute(k) { delete this[k]; if (k.indexOf('data-') === 0) { delete this.dataset[dataKey(k)]; } },
    addEventListener(t, f) { (this._listeners[t] = this._listeners[t] || []).push(f); },
    removeEventListener() {},
    querySelectorAll() { return []; },
    // **ONE SELECTOR SHAPE, A BARE TAG NAME**, and nothing more -- enough for the New-project box's
    // `copy.querySelector('select')` (Task 477) and honest about the rest. A stub that answered
    // every selector with null made that line find nothing, which is a box with no unit controls in
    // it and a harness asserting over an empty list.
    querySelector(sel) {
      if (!/^[a-z]+$/.test(String(sel))) { return null; }
      const want = String(sel).toLowerCase();
      const walk = (e) => {
        for (const c of (e.children || [])) {
          if (c._tag === want) { return c; }
          const hit = c.querySelector ? c.querySelector(sel) : null;
          if (hit) { return hit; }
        }
        return null;
      };
      return walk(this);
    },
    closest() { return null; },
    // **A DEEP CLONE IS A NEW ELEMENT, NOT A SHARED REFERENCE.** cloneNode(true) is how the
    // New-project box gets its eight unit selects out of the page's own strip, so a stub without it
    // could not run that path at all. Every own property is copied; the tree is rebuilt child by
    // child; and a select's `options`/`selectedIndex` pair is re-established WITH its `value`
    // getter, or a cloned select would report the value of the one it was cloned from forever.
    cloneNode(deep) {
      const c = mkEl(this._tag, this._svg);
      Object.keys(this).forEach((k) => {
        if (k === 'children' || k === 'parentNode' || k === '_listeners' ||
          k === 'classList' || k === 'style' || k === 'dataset' || k === 'options') { return; }
        const d = Object.getOwnPropertyDescriptor(this, k);
        if (d && d.get) { return; }   // re-established below where it matters
        c[k] = this[k];
      });
      Object.keys(this.dataset || {}).forEach((k) => { c.dataset[k] = this.dataset[k]; });
      c.style._props = Object.assign({}, this.style._props);
      if (this.options) {
        c.options = this.options.map(o => ({ value: o.value, textContent: o.textContent }));
        c.selectedIndex = this.selectedIndex;
        Object.defineProperty(c, 'value', {
          configurable: true,
          get() { return this.options[this.selectedIndex] ? this.options[this.selectedIndex].value : ''; },
          set(v) { const i = this.options.map(o => o.value).indexOf(v); if (i >= 0) { this.selectedIndex = i; } }
        });
      }
      if (deep) { (this.children || []).forEach(k => c.appendChild(k.cloneNode ? k.cloneNode(true) : k)); }
      return c;
    },
    // Real containment, walking the stub tree -- the menu-dismissal rule in wireTabs() is written in
    // terms of popup.contains(e.target), so a stub that always said false (or always true) would
    // make the Task 264 regression test below meaningless.
    contains(n) { if (n === this) { return true; } return this.children.some(c => c.contains && c.contains(n)); },
    getBoundingClientRect() { return { left: 0, top: 0, right: 1000, bottom: 500, width: 1000, height: 500 }; },
    // WIDTH VARIES WITH FONT WEIGHT AND WITH HOW MANY CHARACTERS THERE ARE, and those are the two
    // physical relationships this stub is required to know.
    //
    // Weight (Task 337): bold glyphs are wider, so a constant width would let a bold label be
    // measured as though it were light -- collision box and zoom-to-fit sized for the wrong glyphs,
    // with every assertion still passing. The exact ratio does not matter; only that it is not 1.
    //
    // CONTENT (Task 399): a label that sheds a value must come out NARROWER, and a stub returning a
    // constant makes the whole fitting cascade untestable while looking fine -- the harness would be
    // asserting that shedding changes nothing, and passing. This is the stub failure CLAUDE.md warns
    // about by name: ask which quantity the real thing varies that the stub holds constant.
    //
    // CHAR_W is a nominal advance per character. It is not a real font metric and nothing may read a
    // precise width off it; what a harness may rely on is only that width RISES with characters and
    // FALLS when characters go.
    getBBox() { return { x: 0, y: 0, width: this._textWidth(), height: 10 }; },
    _textLength() {
      // A <text> owns its tspans' characters; a tspan owns its own.
      //
      // **A STACK IS AS WIDE AS ITS WIDEST ROW, NOT AS WIDE AS ALL OF THEM LAID END TO END.** That
      // is what a real getBBox() reports, and the sum this used to return made a three-row label
      // three times too wide in every harness that measured one -- the stub failure CLAUDE.md
      // names, where the quantity the real thing varies (which row is longest) was held constant.
      // A ROW is a tspan with its own x plus every following tspan without one, exactly
      // setMultilineText()'s idiom; a tspan's own length is still its characters.
      if (this.children.length) {
        let widest = 0, row = 0, started = false;
        for (const c of this.children) {
          const n = c._textLength ? c._textLength() : 0;
          const ownX = c.getAttribute && c.getAttribute('x') != null;
          if (ownX || !started) { row = n; started = true; } else { row += n; }
          if (row > widest) { widest = row; }
        }
        return widest;
      }
      return (this._text || '').length;
    },
    // **WIDTH FOLLOWS FONT SIZE** (ROADMAP Task 403). A real label's font size IS a world quantity
    // -- `textSize / state.s` -- so its world width changes with every zoom and every text-size
    // change. A stub returning characters x a constant holds that relationship at 1 and removes the
    // whole thing every fitting rule is about: three separate rounds ended in "the harness passes
    // and the browser does nothing" because of it.
    //
    // CHAR_W is the nominal advance AT _BASE_FS, so a label drawn at the base size measures exactly
    // what it always did and nothing calibrated against it moves.
    _textWidth() {
      const n = this._textLength();
      return (n ? n * CHAR_W : 10) * (this._isBold() ? 1.12 : 1) * (this._fontSize() / BASE_FS);
    },
    // **THE STYLE OBJECT WINS.** Three write paths reach this one declaration and they are not
    // equals: the `style` ATTRIBUTE string is set once when the element is built, `.style.fontSize`
    // is written on every refresh afterwards, and a bare `font-size` ATTRIBUTE is a presentation
    // attribute that any CSS declaration outranks. In a real DOM the later write and the stronger
    // origin are the same one, so: object, then attribute string, then presentation attribute.
    _fontSize() {
      const fromObj = this.style && this.style.fontSize;
      if (fromObj) { return parseFloat(fromObj) || BASE_FS; }
      const m = /font-size\s*:\s*([0-9.]+)/.exec(this._styleAttr || '');
      if (m) { return parseFloat(m[1]) || BASE_FS; }
      const attr = this['font-size'];
      if (attr !== undefined && attr !== null && attr !== '') { return parseFloat(attr) || BASE_FS; }
      // A tspan carries no size of its own -- it inherits its <text>'s, exactly as in a browser,
      // and without this a multi-line label would measure every row at the base size.
      if (this.parentNode && this.parentNode._fontSize) { return this.parentNode._fontSize(); }
      return BASE_FS;
    },
    _isBold() {
      // Two write paths reach the same declaration: the style ATTRIBUTE (buildLabelEls / the
      // popup) and the style OBJECT (anything setting .style.fontWeight). Read both.
      return /bold/.test((this._styleAttr || '') + ' ' + (this.style.fontWeight || ''));
    },
    getComputedTextLength() { return this._textWidth(); },
    setPointerCapture() {}, releasePointerCapture() {},
    remove() { if (this.parentNode) { this.parentNode.removeChild(this); } },
    focus() {}, select() {}, click() {}
  };
  Object.defineProperty(el, 'innerHTML', {
    get() { return this._innerHTML; },
    set(v) { this._innerHTML = v; if (v === '') { this.children.length = 0; } }
  });
  // The label layout code walks childNodes (tspans), not children -- same array here.
  Object.defineProperty(el, 'childNodes', { get() { return this.children; } });
  // **firstChild MUST SEE THE TEXT NODE**, or the standard
  // `while (el.firstChild) { el.removeChild(el.firstChild); }` teardown -- which setMultilineText()
  // and setTextLabelContent() both use -- silently clears nothing on an element whose content was
  // assigned as textContent, and the old words are measured as though they were still there.
  Object.defineProperty(el, 'firstChild', {
    get() {
      if (this.children.length) { return this.children[0]; }
      return this._text === '' || this._text === undefined || this._text === null
        ? null : { nodeType: 3, textContent: this._text, _owner: this };
    }
  });
  // **textContent IS AN ACCESSOR, NOT A FIELD** (Task 403). In a real DOM, assigning it REPLACES
  // every child, and reading it returns the text of the whole subtree. As a plain data field it did
  // neither: a label switched from three tspans back to one line kept the tspans and measured both,
  // and reading it back gave only whatever had last been assigned. `startsWith` appeared in
  // example-network-harness.js's popupY() to work around exactly that, and is no longer needed.
  Object.defineProperty(el, 'textContent', {
    get() {
      // OWN TEXT FIRST, THEN THE DESCENDANTS. The common shape on this page is a <label> whose own
      // words are the field name with the value in a <span> inside it -- `label.textContent` in a
      // real DOM is "Y-5200.00", not "Y" and not "-5200.00", and both halves have callers.
      return (this._text || '') +
        this.children.map(c => (c.textContent === undefined ? '' : c.textContent)).join('');
    },
    set(v) {
      this.children.length = 0;
      this._text = v === undefined || v === null ? '' : String(v);
    }
  });
  // **className IS THE SAME STORE AS classList AND THE `class` ATTRIBUTE** (Task 486), for the
  // reason the classList comment above already gives: they were two independent fields here, so an
  // element the page had classed with `el.className = 'x'` answered an empty `class` attribute --
  // and a harness asking "would this stylesheet rule fire on this element" got the wrong answer for
  // every control built that way, which is most of the toolbar and the whole menu bar.
  Object.defineProperty(el, 'className', {
    get() { return String(this['class'] || ''); },
    set(v) { this['class'] = v === undefined || v === null ? '' : String(v); },
    enumerable: true, configurable: true
  });
  // Each element gets its OWN classList view, bound to that element's attribute -- the object
  // literal above is shared by construction otherwise, and one shared class set across every
  // element is a worse fiction than the one this replaced.
  el.classList = Object.assign({}, el.classList, { _el: el });
  return el;
}

// Nominal glyph advance for the stub's text metrics -- see getBBox() above. A number, not a
// measurement: what matters is that it is positive and constant, so width tracks character count.
const CHAR_W = 6;
// The size CHAR_W is calibrated at: js/looped-network.js's shipped `settings.textSize`. A label
// drawn at this size measures exactly what it did before width followed size, so every number a
// harness had calibrated against the old stub still holds at the default.
const BASE_FS = 11;

const byId = {};
function ensure(id) { if (!byId[id]) { byId[id] = mkEl('div'); byId[id].id = id; } return byId[id]; }
// Same harvested list popup-tips-harness.js uses:
//   grep -o "getElementById('[a-z_0-9]*')" js/looped-network.js | sort -u
[
  'lpn_backdrop_file', 'lpn_backdrop_menu', 'lpn_backdrop_target_continue',
  'lpn_backdrop_target_mode', 'lpn_backdrop_target_panel', 'lpn_canvas', 'lpn_coords',
  'lpn_empty_hint', 'lpn_labels_legend', 'lpn_labels_link_fields', 'lpn_labels_node_fields',
  'lpn_labels_options', 'lpn_labels_popup', 'lpn_labels_popup_close', 'lpn_mode_hint', 'lpn_map_notice', 'lpn_map_overlay_tl',
  'lpn_popup', 'lpn_popup_close', 'lpn_popup_fields', 'lpn_popup_title', 'lpn_projects_btn',
  'lpn_projects_list', 'lpn_projects_popup', 'lpn_projects_popup_close',
  'lpn_settings_popup', 'lpn_settings_popup_close', 'lpn_status', 'lpn_toolbar',
  'lpn_project_file', 'lpn_inp_file', 'lpn_menubar', 'lpn_menu_popup', 'lpn_menu_list', 'lpn_dialog',
  'lpn_dialog_body', 'lpn_dialog_buttons', 'lpn_menu_popup2', 'lpn_menu_list2', 'lpn_map_status',
  'lpn_map_footer',
  // The lock/warning banner (Task 195), which is page chrome in FLOW above the canvas -- so its
  // appearing changes the map's height (Task 552). A stub without it made renderBanner() return at
  // its first line and every banner rule untestable.
  'lpn_lock_banner',
  // The New-project box and its controls (ROADMAP Task 477). #lpn_new_units_fields is the one JS
  // fills, by cloning the strip's own `.lpn-units-item` wrappers into it.
  'lpn_new_panel', 'lpn_new_units_fields', 'lpn_new_method', 'lpn_new_place', 'lpn_new_create',
  'lpn_new_cancel', 'lpn_new_close', 'lpn_new_us', 'lpn_new_si',
  // The satellite teaser, a cell of that strip (ROADMAP Task 452).
  'lpn_basemap_teaser',
  // The tile attribution (ROADMAP Task 145). It was NOT here, so refreshBasemapCredit() returned at
  // its first line in every harness and the licence credit was the one piece of map chrome no test
  // could see -- which is how it shipped invisible on the boot path (Task 486).
  'lpn_basemap_credit',
  // The scenario selector/readout in the map's status strip (ROADMAP Task 184).
  'lpn_scenario_btn',
  // The bottom pane and its seven tabs (ROADMAP Task 434, all six asset tables since Task 455). The
  // pane's own body is where the height JS writes lands, and the profile's three boxes are built
  // into on every render. ONE PANEL DIV PER TABLE, which is what gives each its own scroll offset.
  'lpn_pane', 'lpn_pane_grip', 'lpn_pane_head', 'lpn_pane_tabs', 'lpn_pane_close',
  'lpn_pane_body', 'lpn_pane_profile', 'lpn_pane_junctions', 'lpn_pane_reservoirs',
  'lpn_pane_tanks', 'lpn_pane_pipes', 'lpn_pane_pumps', 'lpn_pane_valves',
  'lpn_profile_form', 'lpn_profile_chart', 'lpn_profile_note',
  // The Find panel's two hosts (ROADMAP Tasks 353/420, and the disconnected report of 540). Absent
  // from this list, rebuildFindForm() and renderFindResults() return at their first line and every
  // control on that panel -- the pull-downs, the query line, the result rows -- is invisible to
  // every harness, which could then only test findMatches() and never the panel itself.
  'lpn_find_form', 'lpn_find_results',
  // The profile's path EDIT box (ROADMAP Task 509) -- the overlay that carries the two
  // operations Task 506's clean-out took with it. Absent from this list, profileEditEl()
  // returns null and the whole door is invisible to every harness.
  
  // The Settings box (ROADMAP Task 441): the two panes, the filter, the three section shells, the
  // sub-headings that are jump targets, and the hosts their builders write into. The three
  // lpn_labels_* boxes are already listed above -- they kept their IDs through the move.
  'lpn_settings_box', 'lpn_setbox_close', 'lpn_setbox_filter', 'lpn_setbox_index',
  'lpn_setbox_content', 'lpn_setbox_none',
  'lpn_set_sec_visual', 'lpn_set_sec_map', 'lpn_set_sec_elements', 'lpn_set_sec_calc',
  'lpn_set_sub_nodeSym', 'lpn_set_sub_linkSym', 'lpn_set_sub_nodeLink',
  'lpn_set_sub_mapDisplay', 'lpn_set_sub_page',
  'lpn_set_sub_idPrefixes', 'lpn_set_sub_defaults',
  'lpn_set_sub_units', 'lpn_set_sub_time', 'lpn_set_sub_hydraulics',
  'lpn_set_colors_node', 'lpn_set_colors_link', 'lpn_set_colors_nodelink', 'lpn_set_colors_shared',
  'lpn_set_id_fields', 'lpn_set_default_fields', 'lpn_set_map_fields', 'lpn_set_units_fields',
  'lpn_set_hydraulics_fields', 'lpn_set_page_fields', 'lpn_set_time_fields',
  // The credits footer, below every section rather than inside one (Tom, 2026-08-19).
  'lpn_set_ramp_credits',
  // The fire flow box and its two hosts (ROADMAP Task 530). Absent from this list,
  // buildFireFlowControls() and rebuildFireFlowReport() return at their first line and the whole
  // box -- the criteria, the Run button, both reports -- is invisible to every harness.
  'lpn_ff_box', 'lpn_ff_close', 'lpn_ff_controls', 'lpn_ff_report',
  // And the RUN's own dialog, which is a second box rather than a region of the first (Tom,
  // 2026-08-30). Absent from this list, openFireFlowRunBox() returns before it builds anything and
  // a sweep runs with no progress on screen at all -- which is exactly the state it exists to end.
  'lpn_ff_run_box', 'lpn_ff_run_body'
].forEach(ensure);
// Looped-Network.php nests each menu LIST inside its POPUP. The ensure() list above creates them as
// unrelated stubs, so popup.contains(row) answered false for a row that really is inside -- and the
// dismissal rule in wireTabs() is written entirely in those terms. Reproduce the nesting, or a test
// of that rule tests nothing.
byId.lpn_menu_popup.appendChild(byId.lpn_menu_list);
byId.lpn_menu_popup2.appendChild(byId.lpn_menu_list2);
// Same reason: the credits footer really is a child of the content pane, and buildColoringSection()
// falls back to rendering into the colour host only when it is NOT on the page. A parentless stub
// would exercise that fallback and never the shipped placement.
byId.lpn_setbox_content.appendChild(byId.lpn_set_ramp_credits);

// **THE CREDIT'S TWO SOURCE SETS ARE MODELLED, NOT INVENTED.** refreshBasemapCredit() shows one
// `[data-basemap-credit]` span and hides the other, so a stub with no children would let it "swap"
// nothing at all and pass. The names are READ OUT OF Looped-Network.php, so a set added or renamed
// there arrives here rather than being asserted against a copy that has drifted.
{
  const php = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
  const div = php.slice(php.indexOf('id="lpn_basemap_credit"'));
  const names = [...div.slice(0, div.indexOf('</div>')).matchAll(/data-basemap-credit="([a-z]+)"/g)]
    .map(m => m[1]);
  if (names.length < 2) {
    throw new Error('lpn-dom-stub.js: could not read the [data-basemap-credit] sets out of ' +
      'Looped-Network.php. Point this reader at their new home -- do NOT hard-code them.');
  }
  const credit = byId.lpn_basemap_credit;
  credit.style.display = 'none';   // the shipped inline style: JS has to turn it on
  names.forEach((n) => {
    const sp = mkEl('span');
    sp.setAttribute('data-basemap-credit', n);
    sp._text = '\u00a9 ' + n;
    credit.appendChild(sp);
  });
  credit.querySelectorAll = (sel) => (sel === '[data-basemap-credit]' ? credit.children.slice() : []);
}

// A unit <select> the way echoUnitSelect() renders one: option.value is the unit's KEY ('ft'),
// and the factor is a lookup from it (Task 390). unitEl() finds these by NAME, not id.
const unitSelects = {};
// `family` is NOT decoration: echoUnitSelect() puts data-family on every real select, and Task
// 265's unitSetName() reads it to ask whether the strip matches a preset. A stub without it makes
// that function skip every select and vacuously report "us", which is a test agreeing with itself.
function mkUnitSelect(name, family, opts, chosen) {
  const s = mkEl('select');
  s.name = name;
  s.dataset.family = family;
  s.options = opts.map(n => ({ value: n, textContent: n }));
  s.selectedIndex = opts.indexOf(chosen);
  if (s.selectedIndex < 0) { throw new Error('no such unit ' + chosen + ' on ' + name); }
  Object.defineProperty(s, 'value', { get() { return this.options[this.selectedIndex].value; } });
  // **EACH SELECT SITS IN A `.lpn-units-item` WITH ITS OWN NAME ABOVE IT**, which is what
  // Looped-Network.php renders (Task 424) and what the New-project box CLONES (Task 477). A bare
  // select here would make buildNewBoxUnits() find nothing to clone and produce a box with no unit
  // controls in it, with every assertion about it passing over an empty list.
  const item = mkEl('span');
  item.className = 'lpn-units-item';
  const label = mkEl('span');
  label.className = 'lpn-units-name';
  label.textContent = name;
  item.appendChild(label);
  item.appendChild(s);
  unitSelects[name] = s;
  return s;
}
// Factors are "number of that unit per SI unit" -- lib/Units.lib.php's own convention.
//
// AND THEY ARE READ OUT OF lib/Units.lib.php, NEVER RETYPED. They used to be written here as
// `1/FT`, `1/IN`, `1/GPM` -- the exact reciprocals of js/lpn-inp.js's own constants. That made the
// stub's import round trip exactly 1.0 where the shipped page's was 0.99998784, so
// inp-import-harness.js asserted "the file's number comes back unchanged" and passed while the
// browser stored 709.9913664 for a 710 ft elevation. Textbook stub-removes-the-coupling: the one
// quantity under test was the DIFFERENCE between two sets of constants, and the stub had only one
// set. A third disagreeing set lived here too (psi 1.42233, kpa 9.80638), agreeing with neither.
const unitFactors = (function () {
  const src = fs.readFileSync(ROOT + 'lib/Units.lib.php', 'utf8');
  const out = {};
  for (const m of src.matchAll(/\$ec_units\['([a-zA-Z0-9_]+)'\]\s*=\s*([0-9.eE+-]+)\s*;/g)) {
    out[m[1]] = parseFloat(m[2]);
  }
  if (!out.ft || !out.gpm) {
    throw new Error('lpn-dom-stub.js: could not read $ec_units out of lib/Units.lib.php. ' +
      'Point this reader at its new home -- do NOT hard-code the factors.');
  }
  return out;
}());
// An option's value is the unit NAME (Task 390), so this returns the name -- but it still
// checks the name against lib/Units.lib.php, which is the point: a select built here on a unit
// the suite does not actually define would otherwise sit in the stub looking real.
function u(name) {
  if (!(name in unitFactors)) { throw new Error('no $ec_units factor named ' + name); }
  return name;
}
// A FAMILY'S OPTION LIST, read out of lib/Units.lib.php for the same reason the factors are.
// Every other select here is stubbed with a short plausible list, which is fine while the test is
// about the SELECTED unit -- but lpn_u_flow's list is itself under test since Task 390 step 4: the
// question is whether all ten EPANET flow keywords land on a unit this page offers, and a stub
// holding two of them would answer that question for the stub rather than for the page.
function familyUnits(family) {
  const src = fs.readFileSync(ROOT + 'lib/Units.lib.php', 'utf8');
  const m = new RegExp("'" + family + "'\\s*=>\\s*Array\\(([^)]*)\\)").exec(src);
  if (!m) { throw new Error("lpn-dom-stub.js: no unit family '" + family + "' in lib/Units.lib.php"); }
  return m[1].split(',').map((s) => s.trim().replace(/^'|'$/g, '')).filter(Boolean).map(u);
}
function setUnitSet(which) {
  const us = which === 'us';
  mkUnitSelect('lpn_u_length', 'distance_site', [u('m'), u('ft')], us ? 'ft' : 'm');
  mkUnitSelect('lpn_u_elevhead', 'total_head', [u('mh2o'), u('fth2o')], us ? 'fth2o' : 'mh2o');
  mkUnitSelect('lpn_u_pressure', 'partial_head', [u('mh2o'), u('kpa'), u('psi')], us ? 'psi' : 'mh2o');
  mkUnitSelect('lpn_u_diameter', 'distance_small', [u('mm'), u('in')], us ? 'in' : 'mm');
  mkUnitSelect('lpn_u_flow', 'flow_epanet', familyUnits('flow_epanet'), us ? 'gpm' : 'lps');
  // **ONE SELECTOR PER QUANTITY** (Task 522, reversing Task 422's split). There is no `lpn_u_r_*`
  // half any more: a solved head is read in the same selector an entered elevation is. The stub
  // deliberately builds NO such select, so a page or a harness still reaching for one gets nothing
  // back rather than a plausible-looking twin.
  mkUnitSelect('lpn_u_velocity', 'velocity', [u('mps'), u('ftps')], us ? 'ftps' : 'mps');
  mkUnitSelect('lpn_u_gradient', 'gradient', [u('gradePercent'), u('grade')], 'gradePercent');
  // Darcy-Weisbach roughness height e (ROADMAP Task 271) -- family `roughness`, which lib/Units.lib.php
  // aliases to $u_distance (m/mm/ft/in), us => ft, si => mm. Conditional in the PAGE (shown only
  // under Darcy-Weisbach) but unconditional here: applyMethodUI() hides the row, and a stub that
  // withheld the select would make that hiding untestable.
  mkUnitSelect('lpn_u_roughness', 'roughness', [u('m'), u('mm'), u('ft'), u('in')], us ? 'ft' : 'mm');
  // The wrapper applyMethodUI() shows and hides. Created here so every harness has it, since it is
  // part of the units strip's markup rather than of any one test.
  ensure('lpn_u_roughness_row');
}
// The two presets exactly as lib/Units.lib.php declares them for the eight families this page owns.
// EngCalcs.unitSets is emitted by echoUnitsRow() in the browser; unitSetName() compares the strip
// against it, so the harness needs the real mapping, not a placeholder.
const LPN_UNIT_PRESETS = {
  us: { distance_site: 'ft', total_head: 'fth2o', partial_head: 'psi', distance_small: 'in', flow_epanet: 'gpm', velocity: 'ftps', gradient: 'gradePercent', roughness: 'ft' },
  si: { distance_site: 'm', total_head: 'mh2o', partial_head: 'mh2o', distance_small: 'mm', flow_epanet: 'lps', velocity: 'mps', gradient: 'gradePercent', roughness: 'mm' }
};

global.document = {
  createElement: mkEl,
  createElementNS: (ns, tag) => mkEl(tag, true),
  createTextNode: t => ({ nodeType: 3, textContent: t, _text: true, children: [] }),
  getElementById: id => byId[id] || null,
  querySelector: sel => {
    const m = /^select\[name="([^"]+)"\]$/.exec(sel);
    return m ? (unitSelects[m[1]] || null) : null;
  },
  querySelectorAll: () => [],
  addEventListener: () => {},
  // The pointerUP handlers hit-test with this rather than trusting e.target (a real tap moves a few
  // pixels between down and up). Tests set `hitTarget` to whatever they are pretending is under the
  // pointer; null means bare canvas, which is what a pan or an empty-space click lands on.
  elementFromPoint: () => hitTarget,
  // **THE PLURAL CALL HAS TO KEEP THE STUB'S ONE PHYSICAL CLAIM: exactly one thing is under the
  // pointer.** mapHitAt() walks elementsFromPoint() so that a bogus hit can be rejected without
  // taking the real element under it away too (see hitConfirmed()); the stub's model of a pointer is
  // still "hitTarget, or bare canvas", so the stack is that one element or nothing. Answering with a
  // longer list would invent a layering no test has asked for.
  elementsFromPoint: () => (hitTarget ? [hitTarget] : []),
  body: mkEl('body'),
  documentElement: mkEl('html'),
  title: ''   // Task 265 writes here; a stub without it would let document.title = ... pass unseen
};
let hitTarget = null;
const store = {};
global.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; },
  key: i => Object.keys(store)[i],
  get length() { return Object.keys(store).length; }
};
global.window = {
  localStorage: global.localStorage, document: global.document,
  addEventListener: () => {}, innerWidth: 1200, innerHeight: 900,
  confirm: () => true, prompt: () => 'X', alert: () => {},
  // **A WIDTH QUERY IS ANSWERED FROM innerWidth, and that is the one physical relationship this
  // stub has to keep** (dev/testing-notes.md: a stub that holds constant what the real thing varies
  // makes a harness pass for the wrong reason). Returning a flat `false` made every viewport look
  // like a desktop, so a small-screen default could never be observed here at all. Anything that is
  // not a min-/max-width query -- (hover: none), (display-mode: standalone) -- is still false, which
  // is what a headless node process honestly is.
  matchMedia: (q) => {
    let matches = false;
    const s = String(q || '');
    const max = /max-width:\s*([\d.]+)px/.exec(s), min = /min-width:\s*([\d.]+)px/.exec(s);
    if (max || min) {
      const w = global.window.innerWidth;
      matches = (!max || w <= parseFloat(max[1])) && (!min || w >= parseFloat(min[1]));
    }
    return { matches, media: s, addEventListener: () => {}, removeEventListener: () => {} };
  },
  location: { search: '' },   // refreshPageTitle() reads ?name= off it (Task 265)
  devicePixelRatio: 1, getComputedStyle: () => ({ getPropertyValue: () => '' })
};
global.alert = global.window.alert;
global.confirm = global.window.confirm;
global.prompt = global.window.prompt;
global.navigator = { userAgent: 'node' };
global.requestAnimationFrame = f => setTimeout(f, 0);
// iconEl comes from js/Icons.lib.js in the browser; the map symbols only need to not throw here.
// iconEl/setLabel come from js/Icons.lib.js in the browser; here they only need to not throw.
// The example's annotations are composed from strings that already exist elsewhere in the suite
// (see example-draw-fixture.js); the page emits them into pageConfig, so the harness must too, read
// from the real lang file rather than restated here.
global.EngCalcs = {
  pageConfig: {}, initTips: () => {},
  unitSets: LPN_UNIT_PRESETS,
  // Task 390: the browser gets this table from echoHTMLHead(), straight out of lib/Units.lib.php.
  // Here it comes from the same file, read above -- NEVER a retyped set of constants, for exactly
  // the reason spelled out at the top of that block.
  unitFactors,
  unitFactor: (u) => {
    const name = (u && typeof u === 'object') ? u.value : u;
    return (typeof name === 'string' && Object.prototype.hasOwnProperty.call(unitFactors, name))
      ? unitFactors[name] : 1;
  },
  iconEl: () => mkEl('g'),
  // The REAL EngCalcs.setUnits (js/Calculators.lib.js) moves every unit select to a preset and then
  // calls submitForm(), which re-enters EngCalcs.pageCalculator. Both halves matter and this stub
  // does both: without it `if (EngCalcs.setUnits)` was simply false here, so every code path that
  // commits a project to a unit system was untested -- two mutations survived on exactly that.
  setUnits: (which) => {
    setUnitSet(which);
    if (global.EngCalcs.pageCalculator) { global.EngCalcs.pageCalculator(); }
  }
};
global.bootstrap = global.window.bootstrap = { Tooltip: { getInstance: () => null, getOrCreateInstance: () => ({ hide() {}, dispose() {} }) } };

// ---- the two label builders, READ OUT OF js/Calculators.lib.js ------------------------------
// **NOT RESTATED, for the reason bootstrap.js gives about EngCalcs.G** -- a second copy drifts
// silently. setLabel() was a one-line fake here (`el.textContent = text`) and setIconLabel() was
// missing altogether, which is the stub failure dev/testing-notes.md names: the fake held the
// element STRUCTURE constant. In the browser a labelled control is an <svg> plus a text node, and
// an icon-only one is an <svg> plus an aria-label, a title and .ec-help -- so any harness asking
// what a control is actually made of, or whether it has an accessible name, was asking a stub that
// had thrown all of that away. Task 486 needs exactly that question answered.
//
// The whole file cannot be require()d (it touches the DOM at load), so the two assignments are
// sliced out by brace matching and evaluated on their own. `this` is the EngCalcs they are called
// through, exactly as in the browser.
{
  const libSrc = fs.readFileSync(ROOT + 'js/Calculators.lib.js', 'utf8');
  ['setLabel', 'setIconLabel'].forEach((name) => {
    const at = libSrc.indexOf('EngCalcs.' + name + ' = function');
    if (at < 0) {
      throw new Error('lpn-dom-stub.js: could not find "EngCalcs.' + name + ' = function" in ' +
        'js/Calculators.lib.js. If it moved or was renamed, point this reader at its new home -- ' +
        'do NOT re-implement it here.');
    }
    let i = libSrc.indexOf('{', at), depth = 0, end = i;
    for (; end < libSrc.length; end++) {
      if (libSrc[end] === '{') { depth++; }
      else if (libSrc[end] === '}') { depth--; if (depth === 0) { end++; break; } }
    }
    global.EngCalcs[name] = (0, eval)('(' + libSrc.slice(libSrc.indexOf('function', at), end) + ')');
  });
}

// ---- pageConfig, read from the real lang file ---------------------------
// Not stubbed: the example's annotations ARE lang strings, so a harness with an empty pageConfig
// would silently assert that four labels reading "undefined" are fine. Harvest every key the page
// could emit, then check below that the page really does emit the ones the JS reaches for.
{
  const langSrc = fs.readFileSync(ROOT + 'lib/lang.ec.en.php', 'utf8');
  const re = /^\$ec_lang\['([a-z0-9_]+)'\]\s*=\s*'((?:[^'\\]|\\.)*)';$/gm;
  let m;
  while ((m = re.exec(langSrc))) {
    global.EngCalcs.pageConfig[m[1]] = m[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
  }
}
// ---- solver + the file under test ---------------------------------------
// bootstrap.js FIRST, for the same reason validate.js says: it supplies EngCalcs.G out of
// js/Calculators.lib.js, and without it every minor-loss term goes NaN and the solver reports a
// converged network with no head loss anywhere.
require('./bootstrap.js');
// require() rather than eval() for the solver: lpn-solver.js's own require('./PipeHydraulics.lib.js')
// would resolve relative to THIS file if it were eval'd here, not to js/.
var EngCalcs = Object.assign(global.EngCalcs, require(ROOT + 'js/lpn-solver.js'));
// The map editor's pure halves (ROADMAP Task 293), which looped-network.js reads as
// EngCalcs.lpnGeom/lpnCollide the moment its IIFE runs -- so they must be in place before
// the eval below, exactly as their <script> tags precede it in Looped-Network.php.
// require()d rather than eval'd for the same reason as the solver: they are real modules.
Object.assign(global.EngCalcs, require(ROOT + 'js/lpn-geom.js'), require(ROOT + 'js/lpn-collide.js'));
// The profile's pure half, for the same reason: since Task 434 the profile is a tab in the bottom
// pane, so wirePane() reaches EngCalcs.lpnProfile during boot rather than only when a panel opens.
Object.assign(global.EngCalcs, require(ROOT + 'js/lpn-profile.js'));
// The colour catalogue, the range allocation modes and the swatch geometry (Tasks 427, 429). It
// installs itself on globalThis.EngCalcs as `lpnRamps`, exactly as its <script> tag does in the
// browser, and looped-network.js reads it for every colour it paints -- without it the map would
// degrade to the five fallback stops and every assertion about a 7-class ramp would pass on the
// wrong thing.
require(ROOT + 'js/lpn-ramps.js');
// The fire flow sweep (ROADMAP Task 530). Same argument as lpn-ramps.js above: it installs itself
// on globalThis.EngCalcs exactly as its <script> tag does, and without it every fire-flow path in
// looped-network.js falls through its `EngCalcs.lpnFireFlow*` guards and a harness would pass on a
// feature that had quietly turned itself off.
Object.assign(global.EngCalcs, require(ROOT + 'js/lpn-fireflow.js'));

// ---- the REAL EPANET engine (ROADMAP Task 496) ---------------------------
//
// **WITHOUT THIS, `settings.engine` MEANT NOTHING HERE.** runSolve() routes to EPANET only when
// `EngCalcs.lpnSolveEpanet` exists; this stub never defined it, so every harness fell through to
// the native solver whatever the setting said and passed identically on both engines -- with
// nothing routed to EPANET (PRV/PSV/FCV included) under test at all. That is a stub holding the
// coupling constant, the exact failure dev/testing-notes.md names.
//
// The engine really does run headless: js/vendor/epanet-js.js is an ES module and Node's dynamic
// `import()` takes it from a file:// URL, which is what dev/lpn-spike/validate_epanet.js and
// eps-net3-harness.js have been doing all along. Measured here: ~16 ms to import once, ~35 ms for
// the first solve, sub-ms after. The only thing Node cannot do is the browser's DEFAULT url --
// '/engcalcs/js/vendor/epanet-js.js' is a site-absolute path with no origin -- so the default is
// filled in below. Nothing else about the bridge is changed, and the browser path is untouched.
//
// One piece of Node noise is silenced, and only this one: the first import of the vendored engine
// prints MODULE_TYPELESS_PACKAGE_JSON, which is a remark about this repo having no package.json
// "type" field and lands in the middle of a harness's assertions. Every other warning still prints.
process.removeAllListeners('warning');
process.on('warning', function (w) {
	if (w && w.code === 'MODULE_TYPELESS_PACKAGE_JSON') { return; }
	console.error(w && (w.stack || w.message) || String(w));
});
require(ROOT + 'js/lpn-epanet.js');
const NODE_ENGINE_URL = 'file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js');
{
	const browserLoad = global.EngCalcs.lpnEpanetLoad;
	global.EngCalcs.lpnEpanetLoad = function (url) { return browserLoad(url || NODE_ENGINE_URL); };
}
// A COUNTER AND A SETTLE POINT, because the engine is asynchronous and the page is not.
// runSolveEpanet() hands the result back through a promise the caller cannot see, so a harness
// that called solveNow() and read the results on the next line would be reading the PREVIOUS
// solve -- a stale-but-plausible number, the worst kind. `epanetSolves()` is also the direct
// observable a harness asserts on to prove the route was taken; the physics assertion (the two
// engines' Chezy-Manning constants differ by 0.6%) is what proves the ANSWER came from there.
// This wraps rather than replaces: the real lpnSolveEpanet still does all the work.
let epanetCalls = 0, epanetPending = [];
{
	const realSolve = global.EngCalcs.lpnSolveEpanet;
	global.EngCalcs.lpnSolveEpanet = function (model, options) {
		epanetCalls++;
		const p = realSolve.call(this, model, options);
		epanetPending.push(p);
		return p;
	};
}
/** How many times the page has actually handed a network to EPANET. */
function epanetSolves() { return epanetCalls; }
/** Warm the engine once, so a later solve settles in a couple of turns rather than an import. */
function warmEpanet() { return global.EngCalcs.lpnEpanetLoad(); }
/** Await every EPANET solve the page has started, including any it starts while settling. */
async function settleEpanet() {
	for (let guard = 0; guard < 50 && epanetPending.length; guard++) {
		const batch = epanetPending;
		epanetPending = [];
		await Promise.allSettled(batch);
		await new Promise((r) => setTimeout(r, 0));
	}
	// One more turn for the .then() that applies the result to the page.
	await new Promise((r) => setTimeout(r, 0));
}

// The pointer handlers hit-test through document.elementFromPoint rather than trusting e.target (a
// real tap moves a few pixels between down and up). A test sets this to whatever it is pretending
// is under the pointer; null means bare canvas.
function setHitTarget(el) {
	hitTarget = el;
	if (!el) { return; }
	// **WHAT IS UNDER THE POINTER IS ON THE CANVAS AND HAS A BOX.** Both are part of the sentence a
	// harness writes when it sets a hit target, and mapHitAt() reads both -- it confirms a hit
	// against the element's own getBoundingClientRect() (see hitConfirmed(): the browser's own SVG
	// hit test is float32 and answers hundreds of pixels wide on a lat/lon map) and it stops at
	// anything the canvas does not contain. Harnesses hand over a bare `{ dataset, classList }`
	// literal, which is a fair shorthand for "an element carrying this data"; filling the two facts
	// in here keeps the shorthand honest instead of making every harness build a whole element.
	if (!el.getBoundingClientRect) {
		el.getBoundingClientRect = () => ({ left: 0, top: 0, right: 1000, bottom: 500, width: 1000, height: 500 });
	}
	const canvas = byId.lpn_canvas;
	if (canvas && !canvas._hitContainsPatched) {
		const real = canvas.contains.bind(canvas);
		canvas._hitContainsPatched = true;
		canvas.contains = n => (!!n && n === hitTarget) || real(n);
	}
}

/**
 * Load js/looped-network.js with `injectSource` -- the body of a `global.__LPN = { ... }`
 * assignment -- spliced in just before its DOMContentLoaded listener, and return that object.
 * Each harness names only the internals it actually drives.
 *
 * `preludeSource` is optional RAW SOURCE spliced into the SAME scope, ahead of that object. It
 * exists for one thing: a fixture that has to live in dev/lpn-spike/ but must still close over the
 * page's own internals (dev/lpn-spike/example-draw-fixture.js, ROADMAP Task 378). It is spliced
 * inside the module's function scope, so what it declares sees doc, settings, setProp(), el() and
 * the rest exactly as a function written in the file would -- which is the whole reason the fixture
 * could leave the shipped file without becoming a re-implementation. It is NOT a place to stub
 * anything out: overriding a page internal from here would remove the coupling the harness exists
 * to test (dev/testing-notes.md).
 */
function loadLoopedNetwork(injectSource, preludeSource) {
	let src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
	const marker = "\tdocument.addEventListener('DOMContentLoaded'";
	if (src.indexOf(marker) < 0) { throw new Error('injection marker not found'); }
	src = src.replace(marker, (preludeSource ? preludeSource + '\n' : '') + '\tglobal.__LPN = {\n' + injectSource + '\n\t};\n' + marker);
	// INDIRECT eval, and the indirection is load-bearing. js/looped-network.js opens with
	// `var EngCalcs = EngCalcs || {};` -- the browser idiom for "reuse the one the earlier script
	// tags made". A DIRECT eval inside this function would hoist a fresh function-scoped
	// `EngCalcs`, so that line would read its own undefined binding and start a SECOND, empty
	// EngCalcs: no solver, no iconEl, no pageConfig, and every failure downstream of it looking
	// like something else. Running at global scope makes the same line find global.EngCalcs, which
	// is exactly what the browser's script order gives it. (The original harness got this for free
	// by eval'ing at its own module scope, where `var EngCalcs` was already declared.)
	(0, eval)(src);
	return global.__LPN;
}

module.exports = { ROOT, mkEl, byId, ensure, unitSelects, setUnitSet, setHitTarget, loadLoopedNetwork, LPN_UNIT_PRESETS, GPM, FT, IN,
	NODE_ENGINE_URL, epanetSolves, warmEpanet, settleEpanet };
