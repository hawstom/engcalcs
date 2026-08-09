// EngCalcs Service Worker
// Cache version — bump this string when static assets change
const CACHE_VERSION = 'engcalcs-v8';
const ASSET_CACHE = CACHE_VERSION + '-assets';
const PAGE_CACHE  = CACHE_VERSION + '-pages';

// Static assets: always cache-first
const STATIC_ASSETS = [
  '/engcalcs/css/engcalcs.css',
  '/engcalcs/js/Cookies.lib.js',
  '/engcalcs/js/Calculators.lib.js',
  '/engcalcs/js/Manning.lib.js',
  '/engcalcs/js/darcy-weisbach.js',
  '/engcalcs/js/hazen-williams.js',
  '/engcalcs/js/manning-irregular.js',
  '/engcalcs/js/manning-pipe-flow.js',
  '/engcalcs/js/manning-pipe-head-loss.js',
  '/engcalcs/js/manning-trap.js',
  '/engcalcs/js/micro-hydro-power.js',
  '/engcalcs/js/orifice-drain-time.js',
  '/engcalcs/js/orifice.js',
  '/engcalcs/js/weir-flow-irregular.js',
  '/engcalcs/js/weir-flow-simple.js',
  '/engcalcs/js/canal-seepage.js',
  '/engcalcs/js/irrigation-pressure.js',
  '/engcalcs/js/rock-chute.js',
  '/engcalcs/js/lpn-solver.js',
  '/engcalcs/js/lpn-epanet.js',
  '/engcalcs/js/looped-network.js',
  '/engcalcs/icons/icon.svg',
  '/engcalcs/icons/icon-192.png',
  '/engcalcs/icons/icon-512.png',
  // Bootstrap from CDN
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
];

// Calculator pages: network-first, fall back to cache
const CALC_PAGES = [
  '/engcalcs/index.php',
  '/engcalcs/About.php',
  '/engcalcs/Manning-Pipe-Flow.php',
  '/engcalcs/Manning-Pipe-Head-Loss.php',
  '/engcalcs/Manning-Trap.php',
  '/engcalcs/Manning-Irregular.php',
  '/engcalcs/Hazen-Williams.php',
  '/engcalcs/Darcy-Weisbach.php',
  '/engcalcs/Micro-Hydro-Power.php',
  '/engcalcs/Orifice.php',
  '/engcalcs/Orifice-Drain-Time.php',
  '/engcalcs/Weir-Flow-Simple.php',
  '/engcalcs/Weir-Flow-Irregular.php',
  '/engcalcs/Canal-Seepage.php',
  '/engcalcs/Irrigation-Pressure.php',
  '/engcalcs/Rock-Chute.php',
  '/engcalcs/Looped-Network.php',
  '/engcalcs/Install.php',
];

// Install: pre-cache everything
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(ASSET_CACHE).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(PAGE_CACHE).then(cache => cache.addAll(CALC_PAGES)),
    ]).then(() => self.skipWaiting())
  );
});

// Activate: remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('engcalcs-') && k !== ASSET_CACHE && k !== PAGE_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: route by request type
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Static assets → cache-first
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(event.request, ASSET_CACHE));
    return;
  }

  // EngCalcs pages → network-first
  if (url.pathname.startsWith('/engcalcs/') || url.host === 'cdn.jsdelivr.net') {
    event.respondWith(networkFirst(event.request, PAGE_CACHE));
    return;
  }
});

function isStaticAsset(url) {
  return (
    url.pathname.match(/\.(js|css|svg|png|gif|jpg|ico|woff2?)(\?|$)/) ||
    url.host === 'cdn.jsdelivr.net'
  );
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline — asset not cached', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Strip query params (lang=xx, units=xx) before caching the base page
      const cacheKey = stripQueryParams(request);
      const cache = await caches.open(cacheName);
      cache.put(cacheKey, response.clone());
    }
    return response;
  } catch {
    // Offline: try exact URL, then URL without query params
    const cached =
      (await caches.match(request)) ||
      (await caches.match(stripQueryParams(request)));
    if (cached) return cached;
    return new Response(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title></head>' +
      '<body><h1>You are offline</h1><p>This page has not been cached yet. ' +
      'Please visit it while connected to the internet first.</p></body></html>',
      { status: 503, headers: { 'Content-Type': 'text/html' } }
    );
  }
}

function stripQueryParams(request) {
  const url = new URL(request.url);
  url.search = '';
  return new Request(url.toString(), { method: request.method, headers: request.headers });
}

// Task 119: Background Sync flush for the offline usage-log queue. Calculators.lib.js
// (main thread) queues failed/offline log-*.php POSTs into IndexedDB and registers this
// tag; the browser fires 'sync' here once connectivity returns, even if no EngCalcs page
// is open. Where Background Sync isn't supported (e.g. Safari), the queue still flushes
// on the next page load / 'online' event via Calculators.lib.js's own flushQueue().
// Keep this DB/store name and record shape in sync with Calculators.lib.js -- it's
// duplicated rather than shared because a service worker can't import page-context JS.
const QUEUE_DB = 'engcalcs-offline-queue';
const QUEUE_STORE = 'queue';
const QUEUE_MAX_ATTEMPTS = 20;

self.addEventListener('sync', event => {
  if (event.tag === 'engcalcs-flush-queue') {
    event.waitUntil(flushOfflineQueue());
  }
});

function openQueueDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(QUEUE_DB, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Reads every queued record into a plain array in its own short-lived transaction.
// IndexedDB transactions auto-commit once there's no pending request in the
// microtask queue, so awaiting fetch() inside a cursor loop would let the
// transaction die before a later cursor.update()/delete() call -- read everything
// first, then do the async network work with separate write transactions.
function readQueue(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, 'readonly');
    const records = [];
    tx.objectStore(QUEUE_STORE).openCursor().onsuccess = event => {
      const cursor = event.target.result;
      if (!cursor) { resolve(records); return; }
      records.push(cursor.value);
      cursor.continue();
    };
    tx.onerror = () => reject(tx.error);
  });
}

function deleteQueueRecord(db, id) {
  db.transaction(QUEUE_STORE, 'readwrite').objectStore(QUEUE_STORE).delete(id);
}

function updateQueueRecord(db, record) {
  db.transaction(QUEUE_STORE, 'readwrite').objectStore(QUEUE_STORE).put(record);
}

async function flushOfflineQueue() {
  let db;
  try {
    db = await openQueueDB();
  } catch {
    return;
  }
  const records = await readQueue(db);
  await Promise.all(records.map(async record => {
    try {
      const params = Object.assign({}, record.params, { offline_ts: record.offline_ts });
      const resp = await fetch(record.url, {
        method: 'POST',
        body: new URLSearchParams(params),
        credentials: 'same-origin'
      });
      if (resp.ok || record.attempts + 1 >= QUEUE_MAX_ATTEMPTS) {
        deleteQueueRecord(db, record.id);
      } else {
        updateQueueRecord(db, Object.assign({}, record, { attempts: record.attempts + 1 }));
      }
    } catch {
      // Still offline; leave the record queued for the next sync/flush.
    }
  }));
}
