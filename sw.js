const CACHE_NAME = "smart-clock-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./js/clock.js",
  "./js/analog-clock.js",
  "./js/settings.js",
  "./js/weather.js",
  "./js/device.js",
  "./js/fullscreen.js",
  "./js/wake-lock.js",
  "./js/world-clock.js",
  "./manifest.webmanifest"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
