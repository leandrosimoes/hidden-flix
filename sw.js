const cacheName = 'hiddenflix-cache-v2-0-0'
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(
                [
                    'css/app.css',
                    'data/netflix-codes.json',
                    'images/icons/android-icon-36x36.png',
                    'images/icons/android-icon-48x48.png',
                    'images/icons/android-icon-72x72.png',
                    'images/icons/android-icon-96x96.png',
                    'images/icons/android-icon-144x144.png',
                    'images/icons/android-icon-192x192.png',
                    'images/icons/apple-icon-57x57.png',
                    'images/icons/apple-icon-60x60.png',
                    'images/icons/apple-icon-72x72.png',
                    'images/icons/apple-icon-76x76.png',
                    'images/icons/apple-icon-114x114.png',
                    'images/icons/apple-icon-120x120.png',
                    'images/icons/apple-icon-144x144.png',
                    'images/icons/apple-icon-152x152.png',
                    'images/icons/apple-icon-180x180.png',
                    'images/icons/apple-icon-precomposed.png',
                    'images/icons/apple-icon.png',
                    'images/icons/browserconfig.xml',
                    'images/icons/favicon-16x16.png',
                    'images/icons/favicon-32x32.png',
                    'images/icons/favicon-96x96.png',
                    'images/icons/favicon.ico',
                    'images/icons/icon-72x72.png',
                    'images/icons/icon-96x96.png',
                    'images/icons/icon-128x128.png',
                    'images/icons/icon-144x144.png',
                    'images/icons/icon-152x152.png',
                    'images/icons/icon-192x192.png',
                    'images/icons/icon-384x384.png',
                    'images/icons/icon-512x512.png',
                    'images/icons/ms-icon-70x70.png',
                    'images/icons/ms-icon-144x144.png',
                    'images/icons/ms-icon-150x150.png',
                    'images/icons/ms-icon-310x310.png',
                    'js/app.js',
                    'js/knockout.min.js',
                    'js/knockout.mapping.min.js',
                    'js/knockout.bindings.js',
                    'index.html'
                ]
            );
        })
    );
})

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(cacheName).then(cache => {
            return cache.match(event.request).then(response => {
                return response || fetch(event.request).then(response => {
                    if ((event.request.url.indexOf('http') > -1)) {
                        cache.put(event.request, response.clone());
                    }
                    
                    return response;
                });
            });
        })
    );
});