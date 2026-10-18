// Labels shown by kind and zoom step, for a bench --json output (layout.labels keyed n:/l:) and, for
// the same sets, master's vsprod layouts. Only sets present in both are counted.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const fs = require('fs'), path = require('path');
const bench = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')), mastDir = process.argv[3];
const acc = {};
function add(who, kind, step, shown) {
  for (const key of [who + ' ' + kind + ' step' + step, who + ' ' + kind + ' all']) { acc[key] = acc[key] || [0, 0]; acc[key][0]++; if (shown) acc[key][1]++; }
}
bench.results.forEach(set => {
  const m = JSON.parse(fs.readFileSync(path.join(mastDir, set.id + '.json'), 'utf8'));
  set.steps.forEach((s, i) => {
    const L = s.layout.labels, M = m.steps[i].labels;
    const lab = Array.isArray(L) ? L : Object.keys(L).map(k => Object.assign({ id: k }, L[k]));
    lab.forEach(l => add('A7', l.id.slice(0, 1), i, l.shown !== false && (l.rows ? l.rows.length > 0 : true)));
    Object.keys(M).forEach(k => add('MAST', k.slice(0, 1), i, M[k].shown));
  });
});
Object.keys(acc).sort().forEach(k => console.log(k.padEnd(16), String(acc[k][0]).padStart(7), (100 * acc[k][1] / acc[k][0]).toFixed(1) + '%'));
