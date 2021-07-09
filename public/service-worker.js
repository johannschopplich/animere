/* eslint-env serviceworker */

const VERSION = "1.10.4";
const CACHE_KEYS = {
  PRE_CACHE: `precache-${VERSION}`,
  RUNTIME: `runtime-${VERSION}`,
};

const PRECACHE_URLS = [
  "/",
  "/css/buldy.min.css",
  "/css/main.css",
  "/fonts/WorkSans.css",
  "/fonts/WorkSans-Regular.woff2",
  "/fonts/WorkSans-Bold.woff2",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_KEYS.PRE_CACHE);
      await cache.addAll(PRECACHE_URLS);
    })()
  );
});

self.addEventListener("activate", (event) => {
  self.clients.claim();

  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      for (const key of keys) {
        if (!Object.values(CACHE_KEYS).includes(key)) {
          await caches.delete(key);
        }
      }
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Cache-first strategy
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) return cachedResponse;

      try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_KEYS.RUNTIME);
        cache.put(request, response.clone());
        return response;
      } catch (error) {
        console.error(error);
      }
    })()
  );
});
