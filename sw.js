// Offline support that still delivers updates: network-first, cache as fallback.
const CACHE = "lsat-daily-v2";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest",
  "./questions/lr.json", "./questions/rc.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  // Progress must always be live — never touch GitHub API.
  if (url.hostname === "api.github.com") return;
  // Only manage our own origin; let cross-origin (raw.githubusercontent) pass through.
  if (url.origin !== self.location.origin) return;
  // Network-first: fresh app + questions when online, cached copy when offline.
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
