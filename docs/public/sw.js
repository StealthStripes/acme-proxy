const cacheName = self.location.pathname
const pages = [

  "/quickstart/",
    "/install/",
    "/user/",
    "/client/",
    "/",
    "/categories/",
    "/tags/",
    "/book.min.4d6d5ad3b0ae85d2a15b20ab217863f70db543e46314629e239ced759e674898.css",
  "/en.search-data.min.560232984224282c27078d65b4572bf7282802ee88568cbaf35c061d4a55747f.json",
  "/en.search.min.458eb6e181c2860af69aa9d544e2c0b9b1659497b5e1d07e925131a549e0be98.js",
  
];

self.addEventListener("install", function (event) {
  self.skipWaiting();

  caches.open(cacheName).then((cache) => {
    return cache.addAll(pages);
  });
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  /**
   * @param {Response} response
   * @returns {Promise<Response>}
   */
  function saveToCache(response) {
    if (cacheable(response)) {
      return caches
        .open(cacheName)
        .then((cache) => cache.put(request, response.clone()))
        .then(() => response);
    } else {
      return response;
    }
  }

  /**
   * @param {Error} error
   */
  function serveFromCache(error) {
    return caches.open(cacheName).then((cache) => cache.match(request.url));
  }

  /**
   * @param {Response} response
   * @returns {Boolean}
   */
  function cacheable(response) {
    return response.type === "basic" && response.ok && !response.headers.has("Content-Disposition")
  }

  event.respondWith(fetch(request).then(saveToCache).catch(serveFromCache));
});
