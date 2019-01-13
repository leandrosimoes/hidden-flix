const cacheName = 'hiddenflix-cache-v1-0-0'
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(
                [
                    '/css/app.css',
                    '/data/netflix-codes.json',
                    '/images/icons/icon-128x128.png',
                    '/images/icons/icon-144x144.png',
                    '/images/icons/icon-152x152.png',
                    '/images/icons/icon-192x192.png',
                    '/images/icons/icon-384x384.png',
                    '/images/icons/icon-512x512.png',
                    '/images/icons/icon-72x72.png',
                    '/images/icons/icon-96x96.png',
                    '/js/app.js',
                    '/index.html'
                ]
            );
        })
    );
})

self.addEventListener('activate', event => {
    return self.clients.claim()
})

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