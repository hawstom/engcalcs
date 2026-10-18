// For samples whose stack contains TARGET (any of comma list), attribute their time to the nearest caller frame outside the list.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const fs = require('fs');
const p = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const targets = process.argv[3].split(','); const under = process.argv[4];
const byId = new Map(); p.nodes.forEach(n => byId.set(n.id, n));
const parent = new Map(); p.nodes.forEach(n => (n.children || []).forEach(c => parent.set(c, n.id)));
const dt = new Map();
for (let i = 0; i < p.samples.length; i++) { const id = p.samples[i]; dt.set(id, (dt.get(id) || 0) + (p.timeDeltas[i] || 0)); }
const out = new Map(); let tot = 0;
for (const [id, us] of dt) {
  const stack = []; let cur = id; while (cur !== undefined) { stack.push(byId.get(cur).callFrame.functionName); cur = parent.get(cur); }
  if (under && !stack.includes(under)) continue;
  const ti = stack.findIndex(f => targets.includes(f)); if (ti < 0) continue;
  let j = ti; while (j < stack.length && (targets.includes(stack[j]) || stack[j] === '')) j++;
  const k = stack[j] || '?'; out.set(k, (out.get(k) || 0) + us); tot += us;
}
console.log('total', (tot/1000).toFixed(1));
[...out].sort((a,b)=>b[1]-a[1]).slice(0,15).forEach(([k,v])=>console.log((v/1000).toFixed(1).padStart(8), k));
