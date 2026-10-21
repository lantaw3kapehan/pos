// Lantaw³ POS launcher: caches this page (with the 📴 offline pad) + icons. The POS itself comes live from Google.
// v2: if the network is slow (weak signal), the saved copy opens after 4 s instead of waiting forever.
var C = 'lantaw-pos-v2', F = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(C).then(function (c) { return c.addAll(F); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== C; }).map(function (x) { return caches.delete(x); })); })); self.clients.claim(); });
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  var live = fetch(e.request).then(function (r) { if (r && r.ok) { var c = r.clone(); caches.open(C).then(function (x) { x.put(e.request, c); }); } return r; });
  var slow = new Promise(function (res) { setTimeout(res, 4000); }).then(function () { return caches.match(e.request, {ignoreSearch: true}); });
  e.respondWith(Promise.race([live, slow.then(function (m) { return m || live; })]).catch(function () { return caches.match(e.request, {ignoreSearch: true}); }));
});
