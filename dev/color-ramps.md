# Colour ramps: provenance, licence, and how to regenerate them

`js/lpn-ramps.js` ships 41 colour ramps and five range allocation modes. This file records where
every hex value came from and what each licence obliges us to do. The module's own header comment
states the rules; this one is the receipt.

| | |
|---|---|
| Module | `js/lpn-ramps.js` — pure, no DOM, `module.exports` tail |
| Harness | `dev/lpn-spike/ramps-harness.js` — 2,801 checks, enrolled by `run_harnesses.sh` |
| Bench | `dev/ramp-preview.html` — open in a browser; loads the real module, not a copy |
| Roadmap | Tasks 427, 429 |

## The catalogue

| Family | Count | Where from |
|---|---|---|
| sequential | 24 | 18 ColorBrewer, 4 matplotlib/BIDS, EPANET's rainbow, our Gray |
| diverging | 9 | all ColorBrewer |
| qualitative | 8 | all ColorBrewer |
| **total** | **41** | |

Every ramp answers for 3, 4, 5, 6 and 7 classes. 7 is the default and the maximum, because that is
what Tom asked for and because Brewer's own guidance is that a reader stops distinguishing classes
somewhere around there.

Qualitative schemes are in the catalogue even though every field the map colours today is a measured
quantity. They are for a CATEGORY field (material, pressure zone, status), and a picker that silently
omitted the family would make that choice unavailable when the field arrives.

## Sources, fetched 2026-08-18

| Source | URL | sha256 of the file fetched |
|---|---|---|
| ColorBrewer specifications | `https://raw.githubusercontent.com/axismaps/colorbrewer/master/export/colorbrewer.js` | `9b80441360d0c919bc23f9264a5ff0093a849c3437c6b940a727acf281d6706c` |
| ColorBrewer licence | `https://colorbrewer2.org/export/LICENSE.txt` | quoted in full below |
| viridis / magma / inferno / plasma | `https://raw.githubusercontent.com/BIDS/colormap/master/colormaps.py` | `b7478d10e2ccfdb22128867e137f16f55b687e9c225065e91bcbd6bb9e6c0352` |
| EPANET's five map colours | already in `js/looped-network.js`, carried forward unchanged | — |

`export/colorbrewer.js` is the *data* file — the same specifications d3 packages. The repository root
also holds a `colorbrewer.js` which is the **website's application code, not the data**; fetching that
one by mistake gets you a list of scheme names and no colours.

## What could not be verified, and was therefore dropped

- **`cividis`.** It is in matplotlib's `_cm_listed.py`, but that file carries no licence header and
  the authors' own CC0 dedication is not stated at any source that could be fetched here. It is not
  shipped. Adding it later needs a fetchable dedication, not a recollection of one.
- **Brewer's 8-, 9-, 10-, 11- and 12-class sets.** They exist and are correct; the picker offers 3
  to 7, so they are not carried.
- **Nothing was interpolated to fill a gap in a Brewer scheme.** Where a scheme did not publish a
  count we needed, it would have been dropped rather than invented — in the event, all 35 publish
  all five counts.

## Which hexes are published and which are computed

`RAMPS[key].interpolated` records this per ramp, and the harness asserts it agrees with the source.

- **`source: 'brewer'`, `interpolated: false`.** Brewer designs each class count separately; her
  5-class YlGnBu is not her 7-class YlGnBu with two colours removed. Every count is verbatim.
  **Never interpolate a Brewer ramp** — that discards the design work which is the whole reason to
  use them.
- **`source: 'bids'`, `interpolated: true`.** viridis and friends are published as one continuous
  256-entry table, so there are no class sets to take verbatim. Each count is sampled from that table
  at evenly spaced positions with both endpoints included.
- **`source: 'epa'` / `'engcalcs'`, `interpolated: true`.** EPANET's rainbow and our Gray exist only
  as five stops; other counts are piecewise-linear in sRGB. The generator asserts that the 5-class
  set reproduces the five shipped stops exactly, and the harness asserts it again at runtime — the
  heritage ramps must not shift under existing saved projects.

## Licences

### ColorBrewer — Apache-2.0, and two obligations that are ours

The full text is at `https://colorbrewer2.org/export/LICENSE.txt`. Apache-2.0 is one-way compatible
with this suite's GPL v3, so the schemes may ship. The clauses that require action:

> Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The Pennsylvania State University.
>
> Licensed under the Apache License, Version 2.0 …
>
> 2. The end-user documentation included with the redistribution, if any, must include the following
> acknowledgment: "This product includes color specifications and designs developed by Cynthia Brewer
> (http://colorbrewer.org/)." Alternately, this acknowledgment may appear in the software itself, if
> and wherever such third-party acknowledgments normally appear.
>
> 4. The name "ColorBrewer" must not be used to endorse or promote products derived from this
> software without prior written permission. …
>
> 5. Products derived from this software may not be called "ColorBrewer", nor may "ColorBrewer"
> appear in their name, without prior written permission of Cynthia Brewer.

**What that means here.**

1. **The acknowledgement must appear where the ramps are chosen** — the colours panel that holds the
   Ramp picker. `EngCalcs.lpnRamps.CREDITS` carries the sentence verbatim; the UI renders it. It is
   **not a language key and is not translated**: the wording is fixed by the licence, and translating
   it would change the text the licence requires. Ship it in English, as it stands. (`lang_syntax_-
   validate.php` never sees it, because it is not in a `lang.ec.*.php` file — that is deliberate.)
2. **No control, menu, heading or product name says "ColorBrewer".** The control is a *Ramp* picker;
   the families are *sequential*, *diverging*, *qualitative* — Brewer's own vocabulary, which is also
   the vocabulary matplotlib, d3, QGIS and ArcGIS use. (epanet-js calls the first "Continuous"; that
   is the non-standard word and this page does not use it.) The harness enforces this over every ramp
   name, family name and mode name. Naming the source in a credit line is *attribution*, which the
   licence requires; naming a control after it is *promotion*, which it forbids.

### viridis, magma, inferno, plasma — CC0

> This file and the colormaps in it are released under the CC0 license / public domain dedication.
> We would appreciate credit if you use or redistribute these colormaps, but do not impose any legal
> restrictions.

By Nathaniel J. Smith, Stéfan van der Walt and (for viridis) Eric Firing,
`https://github.com/BIDS/colormap`. No legal condition; the requested credit is in `CREDITS`.

### EPANET's rainbow — US EPA, public domain

The five map colours of EPANET 2.2. Kept unsoftened: matching what a user already reads in EPANET is
worth more than a prettier ramp. It is the heritage default and must not be dropped.

## Regenerating the catalogue

Nothing in `RAMPS` was typed by hand. To regenerate — after a Brewer revision, or to add a count —
fetch the two sources above and run the script below, then splice its `catalogue.txt` into
`js/lpn-ramps.js` between `var RAMPS = {` and the matching `};`. The script **asserts** that the
heritage 5-class ramps come out byte-identical, so a bad fetch fails loudly rather than silently
recolouring every saved project. Run `node dev/lpn-spike/ramps-harness.js` afterwards.

```js
// Reads ./colorbrewer.js and ./bids_colormaps.py, writes ./catalogue.txt
const fs = require('fs'), path = require('path'), DIR = __dirname;
let cbSrc = fs.readFileSync(path.join(DIR, 'colorbrewer.js'), 'utf8').replace(/^\/\/.*$/gm, '');
const sandbox = {};
new Function('exports', cbSrc + '\nexports.cb = colorbrewer;')(sandbox);
const cb = sandbox.cb;
const BREWER = {
  sequential: ['Blues', 'BuGn', 'BuPu', 'GnBu', 'Greens', 'Greys', 'OrRd', 'Oranges', 'PuBu',
    'PuBuGn', 'PuRd', 'Purples', 'RdPu', 'Reds', 'YlGn', 'YlGnBu', 'YlOrBr', 'YlOrRd'],
  diverging: ['BrBG', 'PRGn', 'PiYG', 'PuOr', 'RdBu', 'RdGy', 'RdYlBu', 'RdYlGn', 'Spectral'],
  qualitative: ['Accent', 'Dark2', 'Paired', 'Pastel1', 'Pastel2', 'Set1', 'Set2', 'Set3']
};
const bids = fs.readFileSync(path.join(DIR, 'bids_colormaps.py'), 'utf8');
function bidsTable(name) {
  const m = bids.match(new RegExp('_' + name + '_data = \\[([\\s\\S]*?)\\]\\]'));
  const rows = (m[1] + ']').match(/\[[^\]]*\]/g).map(r =>
    r.replace(/[\[\]]/g, '').split(',').map(parseFloat));
  if (rows.length !== 256) throw new Error(name + ' has ' + rows.length + ' rows');
  return rows;
}
const hx = v => { let x = Math.round(v * 255); x = x < 0 ? 0 : x > 255 ? 255 : x;
  return ('0' + x.toString(16)).slice(-2); };
const hex = (r, g, b) => '#' + hx(r) + hx(g) + hx(b);
function sampleTable(rows, n) {                       // endpoints inclusive
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1), row = rows[Math.round(t * (rows.length - 1))];
    return hex(row[0], row[1], row[2]);
  });
}
function interpStops(stops, n) {                      // piecewise linear in sRGB
  const rgb = stops.map(h => [1, 3, 5].map(o => parseInt(h.slice(o, o + 2), 16)));
  return Array.from({ length: n }, (_, i) => {
    const t = (n === 1 ? 0.5 : i / (n - 1)) * (rgb.length - 1);
    const a = Math.min(Math.floor(t), rgb.length - 2), f = t - a;
    const c = [0, 1, 2].map(k => rgb[a][k] + (rgb[a + 1][k] - rgb[a][k]) * f);
    return hex(c[0] / 255, c[1] / 255, c[2] / 255);
  });
}
const EPANET_STOPS = ['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000'];
const GRAY_STOPS = ['#dddddd', '#aaaaaa', '#777777', '#444444', '#000000'];
const COUNTS = [3, 4, 5, 6, 7], ramps = [];
const push = (key, name, family, source, interpolated, colors) =>
  ramps.push({ key, name, family, source, interpolated, colors });
for (const fam of Object.keys(BREWER)) for (const name of BREWER[fam]) {
  const s = cb[name], colors = {};
  for (const n of COUNTS) { if (!s[n]) throw new Error(name + ' lacks ' + n); colors[n] = s[n].slice(); }
  push(name.toLowerCase(), name, fam, 'brewer', false, colors);
}
for (const name of ['viridis', 'magma', 'inferno', 'plasma']) {
  const rows = bidsTable(name), colors = {};
  for (const n of COUNTS) colors[n] = sampleTable(rows, n);
  push(name, name[0].toUpperCase() + name.slice(1), 'sequential', 'bids', true, colors);
}
for (const [key, name, stops] of [['epanet', 'EPANET', EPANET_STOPS], ['gray', 'Gray', GRAY_STOPS]]) {
  const colors = {};
  for (const n of COUNTS) colors[n] = interpStops(stops, n);
  push(key, name, 'sequential', key === 'epanet' ? 'epa' : 'engcalcs', true, colors);
}
// The heritage ramps must be reproduced EXACTLY or every saved project changes colour.
for (const [key, stops] of [['epanet', EPANET_STOPS], ['gray', GRAY_STOPS]]) {
  const r = ramps.find(x => x.key === key);
  if (r.colors[5].join() !== stops.join()) throw new Error(key + ' 5-class drifted: ' + r.colors[5]);
}
let out = '';
for (const fam of ['sequential', 'diverging', 'qualitative'])
  for (const r of ramps.filter(x => x.family === fam)) {
    out += `\t\t${r.key}: { name: ${JSON.stringify(r.name)}, family: ${JSON.stringify(fam)}` +
      `, source: ${JSON.stringify(r.source)}, interpolated: ${r.interpolated}, colors: {\n`;
    out += COUNTS.map(n => `\t\t\t${n}: [${r.colors[n].map(c => `'${c}'`).join(', ')}]`).join(',\n');
    out += '\n\t\t} },\n';
  }
fs.writeFileSync(path.join(DIR, 'catalogue.txt'), out);
console.error(ramps.length + ' ramps');
```

## The five range allocation modes

The names GIS uses, in the order the picker lists them. `js/lpn-ramps.js` states each failure mode on
the function itself; the short version, because the wrong mode never *looks* wrong:

| Key | Name | Fails when |
|---|---|---|
| `equal` | Equal interval | One outlier owns the scale. It describes the RANGE, not the distribution — and it is the only mode whose legend is comparable between two networks. |
| `quantile` | Quantile (equal count) | Ties. 90 dead-end pipes at 0 gpm put several breaks on 0 and leave those classes near-empty. Also moves whenever an element is added, so two timesteps are not comparable. |
| `jenks` | Natural breaks (Jenks) | Cost — O(k·n²), so above `JENKS_MAX` (1,200) values it runs on a deterministic stride sample. And its breaks belong to *this* data, so two scenarios get incommensurable legends. |
| `stddev` | Standard deviation | Skew. Network quantities are usually right-skewed, so the low classes come out empty and the legend makes a claim about distribution shape the data does not support. |
| `pretty` | Pretty (rounded) | Rounding moves boundaries off the data. On a range too narrow for any round step it falls back to rounded equal interval — equal interval wearing a hat. |

**n classes have n-1 interior breaks.** A value equal to a break belongs to the class *above*; the
lowest and highest classes are unbounded, so an element added after the breaks were fixed still gets
a colour. A value that does not exist (a pump has no velocity) gets `classIndex() === null`, **not**
class 0 — colouring it "low" would be a lie the eye cannot detect.

`validateBreaks()` accepts hand-edited breaks, because Tom's Ranges submenu shows the breaks at the
bottom for the user to tweak. It reports a machine-readable reason and *which box*, and it **never
rounds, snaps, clamps or reorders what the user typed** — the same rule as the `.inp` importer's.
The message wording is a language key and belongs to the UI file.

## Swatch geometry

`swatchBoxes(width, count, {height, gap})` exists because the widths were got wrong by hand — Tom,
2026-08-18: *"the color boxes are not uniform widths"*. Every box gets the identical width
`width / count`; `x` is computed from the index rather than accumulated, so the last box cannot
creep. Any residue against `width` is left in the returned `total`, never pushed into the last box —
a sub-pixel gap at the right edge is invisible; a last box a pixel wider than the rest is the defect
being fixed. `swatchBar()` is the same geometry with the colours attached, which is one picker row.
