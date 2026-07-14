// EngCalcs Service Worker
// Cache version — bump this string when static assets change
const CACHE_VERSION = 'engcalcs-v4';
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
  '/engcalcs/Irrigation.php',
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
