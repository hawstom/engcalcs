/**
 * Read-only forensic capture for a Looped-Network work-loss incident.
 *
 * NOT a CLI script and not run by check_all.sh: paste it into the browser console on the app page
 * while a lost-project specimen is still live, BEFORE closing the tab. It downloads one JSON and
 * prints a summary. File the result in dev/lpn-blank-map-incidents.md.
 *
 * WHY IT IS SAFE ON A SPECIMEN, which is the whole design constraint:
 *   - writes nothing to localStorage, so it cannot trip an autosave over a document under study;
 *   - opens IndexedDB with NO version, so onupgradeneeded cannot fire and no store is created;
 *   - uses queryPermission(), which reports a handle's permission and never prompts for it.
 *
 * What it answers, which is exactly what classifies an occurrence against ROADMAP Task 623's
 * scenario list: does `lpn_index` still list the project, does its `lpn_project_<id>` document
 * still exist, do the two disagree, what permission does the file handle hold, and was the origin
 * near quota or unpersisted.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */
(async function () {
  var out = { ts: new Date().toISOString(), url: location.href, ua: navigator.userAgent, visibility: document.visibilityState };

  // ---- quota / eviction ----
  try { out.estimate = await navigator.storage.estimate(); } catch (e) { out.estimate = String(e); }
  try { out.persisted = await navigator.storage.persisted(); } catch (e) { out.persisted = String(e); }

  // ---- localStorage, full inventory + parsed lpn documents ----
  var ls = {}, docs = {}, idx = null;
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i), v = localStorage.getItem(k);
      ls[k] = v.length;
      if (k === 'lpn_index') { try { idx = JSON.parse(v); } catch (e) { idx = 'UNPARSEABLE: ' + v.slice(0, 200); } }
      if (k.indexOf('lpn_project_') === 0) {
        var d = null; try { d = JSON.parse(v); } catch (e) {}
        docs[k.slice(12)] = d ? {
          chars: v.length, name: d.project && d.project.name, v: d.v,
          nodes: (d.nodes || []).length, links: (d.links || []).length, labels: (d.labels || []).length,
          curves: (d.curves || []).length, scenarios: (d.scenarios || []).length,
          coords: d.project && d.project.coords, backdrop: !!d.backdrop, basemap: d.project && d.project.basemap,
          view: d.view, origin: d.origin
        } : { chars: v.length, PARSE: 'FAILED', head: v.slice(0, 200) };
      }
    }
  } catch (e) { out.localStorageError = String(e); }
  out.localStorage = ls; out.index = idx; out.documents = docs;

  // ---- the mismatch that names the failure ----
  var ids = Object.keys(docs), listed = (idx && idx.projects || []).map(function (p) { return p.id; });
  out.mismatch = {
    openId: idx && idx.openId,
    openIdInIndex: listed.indexOf(idx && idx.openId) >= 0,
    openIdHasDocument: ids.indexOf(idx && idx.openId) >= 0,
    indexedButNoDocument: listed.filter(function (id) { return ids.indexOf(id) < 0; }),
    documentButNotIndexed: ids.filter(function (id) { return listed.indexOf(id) < 0; })
  };

  // ---- IndexedDB: file handles and their permission state ----
  out.idb = {};
  try { out.idb.databases = (await indexedDB.databases()).map(function (d) { return d.name + '@' + d.version; }); } catch (e) { out.idb.databases = String(e); }
  try {
    var db = await new Promise(function (res, rej) { var r = indexedDB.open('engcalcs-lpn'); r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); }; r.onblocked = function () { rej('blocked'); }; });
    out.idb.version = db.version;
    out.idb.stores = Array.prototype.slice.call(db.objectStoreNames);
    async function readAll(store) {
      return await new Promise(function (res) {
        var rows = [], tx = db.transaction(store, 'readonly'), st = tx.objectStore(store), c = st.openCursor();
        c.onsuccess = function () { var cur = c.result; if (!cur) { res(rows); return; } rows.push({ key: cur.key, value: cur.value }); cur.continue(); };
        c.onerror = function () { res(rows); };
      });
    }
    if (out.idb.stores.indexOf('handles') >= 0) {
      var hs = await readAll('handles');
      out.idb.handles = [];
      for (var j = 0; j < hs.length; j++) {
        var h = hs[j].value, row = { projectId: hs[j].key, name: h && h.name, kind: h && h.kind };
        try { row.rw = await h.queryPermission({ mode: 'readwrite' }); } catch (e) { row.rw = String(e); }
        try { row.ro = await h.queryPermission({ mode: 'read' }); } catch (e) { row.ro = String(e); }
        row.stillIndexed = listed.indexOf(hs[j].key) >= 0;
        row.stillHasDocument = ids.indexOf(hs[j].key) >= 0;
        out.idb.handles.push(row);
      }
    }
    if (out.idb.stores.indexOf('recent') >= 0) {
      var rec = await readAll('recent');
      out.idb.recent = (rec[0] && rec[0].value || []).map(function (r) { return { name: r.name, at: r.at && new Date(r.at).toISOString() }; });
    }
    db.close();
  } catch (e) { out.idb.error = String(e); }

  // ---- what the PAGE thinks, versus what storage holds ----
  var strip = document.getElementById('lpn_tabs');
  out.dom = {
    tabs: strip ? Array.prototype.map.call(strip.querySelectorAll('.lpn-tab'), function (t) {
      return { text: t.textContent.trim(), current: /lpn-tab-current/.test(t.className), star: !!t.querySelector('.lpn-tab-star') };
    }) : 'NO TAB STRIP',
    status: (document.getElementById('lpn_status_text') || {}).textContent,
    notes: (document.getElementById('lpn_status_notes') || {}).textContent,
    canvasChildren: (document.getElementById('lpn_canvas') || { children: [] }).children.length,
    symbols: document.querySelectorAll('.lpn-symbols > *').length,
    warnings: Array.prototype.map.call(document.querySelectorAll('[class*="warn"],[class*="banner"],[id*="warn"]'), function (e) { return e.textContent.trim().slice(0, 300); }).filter(Boolean)
  };

  // ---- receipt ----
  console.log('%cLPN FORENSICS', 'font-weight:bold');
  console.log('index openId:', out.mismatch.openId, '| in index:', out.mismatch.openIdInIndex, '| has document:', out.mismatch.openIdHasDocument);
  console.log('indexed but no document:', out.mismatch.indexedButNoDocument);
  console.log('document but not indexed:', out.mismatch.documentButNotIndexed);
  console.table(Object.keys(docs).map(function (id) { var d = docs[id]; return { id: id, name: d.name, nodes: d.nodes, links: d.links, chars: d.chars }; }));
  console.table(out.idb.handles || []);
  console.log('quota:', out.estimate, 'persisted:', out.persisted);
  console.log(out);

  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' }));
  a.download = 'lpn-forensics-' + Date.now() + '.json';
  a.click();
  return out;
})();
