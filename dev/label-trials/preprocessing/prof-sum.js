// Sum a V8 .cpuprofile: self ms per function, and inclusive ms for named functions.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const fs = require('fs');
const p = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const want = (process.argv[3] || '').split(',').filter(Boolean);
const byId = new Map(); p.nodes.forEach(n => byId.set(n.id, n));
const parent = new Map(); p.nodes.forEach(n => (n.children || []).forEach(c => parent.set(c, n.id)));
const dt = new Map(); // node id -> self microseconds
for (let i = 0; i < p.samples.length; i++) { const id = p.samples[i]; dt.set(id, (dt.get(id) || 0) + (p.timeDeltas[i] || 0)); }
const self = new Map(), incl = new Map(); let total = 0;
for (const [id, us] of dt) {
  total += us;
  const n = byId.get(id), f = n.callFrame, key = f.functionName + ' ' + (f.url.split('/').pop()) ;
  self.set(key, (self.get(key) || 0) + us);
  const seen = new Set(); let cur = id;
  while (cur !== undefined) { const c = byId.get(cur).callFrame; const k = c.functionName; if (want.includes(k) && !seen.has(k)) { seen.add(k); incl.set(k, (incl.get(k) || 0) + us); } cur = parent.get(cur); }
}
console.log('total sampled ms', (total / 1000).toFixed(0));
[...self].sort((a, b) => b[1] - a[1]).slice(0, 30).forEach(([k, v]) => console.log((v / 1000).toFixed(1).padStart(8), k));
console.log('--- inclusive');
want.forEach(k => console.log(((incl.get(k) || 0) / 1000).toFixed(1).padStart(8), k));
