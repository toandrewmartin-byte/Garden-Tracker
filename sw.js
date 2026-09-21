// Keeps the app opening quickly and lets it start without a connection.
const CACHE = 'patio-garden-v2';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const ok = u.origin === location.origin || ['www.gstatic.com', 'fonts.googleapis.com', 'fonts.gstatic.com'].includes(u.hostname);
  if (!ok) return; // Firestore traffic goes straight to the network
  if (r.mode === 'navigate') {
    // Always try for the newest page first, fall back to the saved copy offline.
    e.respondWith(fetch(r).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); return res;
    }).catch(() => caches.match(r).then(hit => hit || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(hit => {
    const net = fetch(r).then(res => {
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
