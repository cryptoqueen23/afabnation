const VERSION = "afab-nation-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./data.js",
  "./manifest.webmanifest",
  "./assets/afab-logo.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL_ASSETS))
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

  if (req.mode === "navigate") {
    event.respondWith(networkFirstShell(req));
    return;
  }

  if (SHELL_ASSETS.includes(`.${url.pathname}`) || url.pathname === "/") {
    event.respondWith(cacheFirst(req));
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

async function networkFirstShell(req){
  try {
    const res = await fetch(req);
    if (res.ok) (await caches.open(SHELL_CACHE)).put("./index.html", res.clone());
    return res;
  } catch (err) {
    const cached = await caches.match("./index.html");
    return cached || Response.error();
  }
}
