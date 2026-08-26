const VERSION = "afab-nation-v3";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

// Precached at install so the app has an offline-capable shell immediately.
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./data.js",
  "./catalog.js",
  "./manifest.webmanifest",
  "./assets/afab-logo.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png"
];

// These change every time the site is updated (new songs, new code) — always
// prefer the network so a fresh deploy shows up immediately, and only fall
// back to the cache when offline. Cache-first here was the v1 bug: a track
// added to the catalog after a browser had already cached it would never
// show up. catalog.js carries the same risk as data.js did, so it gets the
// same treatment.
const NETWORK_FIRST_PATHS = ["/", "/index.html", "/app.js", "/style.css", "/data.js", "/catalog.js"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith("afab-nation-") && key !== SHELL_CACHE && key !== RUNTIME_CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) {
    if (url.hostname.includes("fonts.g")) event.respondWith(staleWhileRevalidate(req));
    return;
  }

  if (req.mode === "navigate" || NETWORK_FIRST_PATHS.includes(url.pathname)) {
    event.respondWith(networkFirst(req));
    return;
  }

  if (url.pathname.startsWith("/audio/") || url.pathname.startsWith("/assets/")) {
    event.respondWith(cacheFirst(req));
    return;
  }

  event.respondWith(staleWhileRevalidate(req));
});

async function cacheFirst(req){
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) (await caches.open(RUNTIME_CACHE)).put(req, res.clone());
    return res;
  } catch (err) {
    return cached || Response.error();
  }
}

async function staleWhileRevalidate(req){
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(req);
  const fetchPromise = fetch(req).then(res => {
    if (res.ok) cache.put(req, res.clone());
    return res;
  }).catch(() => cached);
  return cached || fetchPromise;
}

async function networkFirst(req){
  const cacheKey = req.mode === "navigate" ? "./index.html" : req;
  try {
    const res = await fetch(req);
    if (res.ok) (await caches.open(SHELL_CACHE)).put(cacheKey, res.clone());
    return res;
  } catch (err) {
    const cached = await caches.match(cacheKey);
    return cached || Response.error();
  }
}
