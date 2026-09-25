/* Wayfarer service worker
 *
 * Strategy: the app shell is pre-cached under a versioned cache name and served
 * cache-first, so the app opens instantly and works fully offline.
 * User data (journeys + photos) lives in IndexedDB and is never touched here,
 * so shipping a new version can never wipe anyone's archive.
 *
 * RELEASING: bump VERSION on every deploy. That is what makes browsers install
 * the new worker; the page then shows a "new version available" prompt.
 */
const VERSION = '0.16.0';
const PREFIX = 'tpx-archive-';   // unique: other apps on the same address must not touch our caches, nor we theirs
const CACHE = PREFIX + VERSION;

const SHELL = [
  './',
  'index.html',
  'app.js',
  'world-data.js',
  'assets/world-50m.json',
  'fonts/fonts.css',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png',
  'assets/vegas.svg',
  'assets/vegas2.svg',
  'assets/lisbon.svg',
  'assets/london.svg',
  'assets/germany.svg',
  'assets/italy.svg',
  'assets/placeholder.svg'
];

self.addEventListener('install', event => {
  // No skipWaiting() here: an update waits until the person taps "Reload"
  // (the page posts SKIP_WAITING), so a running session is never swapped mid-edit.
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(n => (n.startsWith(PREFIX) && n !== CACHE) || /^travel-pokedex-\d+\.\d+\.\d+$/.test(n))
      .map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok && res.type === 'basic') cache.put(req, res.clone());
      return res;
    } catch (err) {
      if (req.mode === 'navigate') {
        const shell = await cache.match('index.html');
        if (shell) return shell;
      }
      throw err;
    }
  })());
});
