// Keeps the app opening quickly. Your own files always try the network first,
// so updates show up right away; the saved copy is only used offline.
const CACHE = 'patio-garden-v2';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const own = u.origin === location.origin;
  const libs = ['www.gstatic.com', 'fonts.googleapis.com', 'fonts.gstatic.com'].includes(u.hostname);
  if (!own && !libs) return; // Firestore traffic goes straight to the network
  const save = res => {
    if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); }
    return res;
  };
  if (own) {
    e.respondWith(fetch(r).then(save).catch(() => caches.match(r).then(hit => hit || caches.match('index.html'))));
  } else {
    e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(save)));
  }
});
