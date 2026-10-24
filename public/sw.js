const CACHE_NAME = 'safeguard-japan-v2';
const APP_BASE = new URL('./', self.location.href).pathname;
const STATIC_ASSETS = [
  APP_BASE,
  `${APP_BASE}index.html`,
  `${APP_BASE}manifest.json`,
  `${APP_BASE}icon.svg`,
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install Event - Pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Some assets could not be pre-cached:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network First for API with cache fallback, Stale While Revalidate for static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // For API calls (/api/alert, /api/shelters) -> Network first, fallback to cache
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith(`${APP_BASE}api/`)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response(
              JSON.stringify({
                error: 'offline',
                message: 'Device is offline and no cached data is available.',
                cachedAt: null
              }),
              {
                headers: { 'Content-Type': 'application/json' },
                status: 503
              }
            );
          });
        })
    );
    return;
  }

  // Map tiles from OpenStreetMap -> Stale While Revalidate / Cache First with network fallback
  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.match(request).then((cachedTile) => {
        if (cachedTile) return cachedTile;
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open('safeguard-tiles-v1').then((tileCache) => {
                tileCache.put(request, clone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Return empty tile or fail gracefully
            return new Response('', { status: 408 });
          });
      })
    );
    return;
  }

  // Navigation requests (HTML pages) -> Network first, fall back to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
          return caches.match(`${APP_BASE}index.html`);
      })
    );
    return;
  }

  // Static assets -> Cache First with network fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && request.method === 'GET') {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return networkResponse;
        })
      );
    })
  );
});
