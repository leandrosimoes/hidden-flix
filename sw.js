const CACHE_NAME_VERSION = 'hiddenflix-v2-0-11'
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME_VERSION).then(cache => {
            return cache.addAll(
                [
                    './images/icons/android-chrome-144x144.png',
                    './images/icons/android-chrome-192x192.png',
                    './images/icons/android-chrome-256x256.png',
                    './images/icons/android-chrome-36x36.png',
                    './images/icons/android-chrome-384x384.png',
                    './images/icons/android-chrome-48x48.png',
                    './images/icons/android-chrome-512x512.png',
                    './images/icons/android-chrome-72x72.png',
                    './images/icons/android-chrome-96x96.png',
                    './images/icons/apple-touch-icon-114x114-precomposed.png',
                    './images/icons/apple-touch-icon-114x114.png',
                    './images/icons/apple-touch-icon-120x120-precomposed.png',
                    './images/icons/apple-touch-icon-120x120.png',
                    './images/icons/apple-touch-icon-144x144-precomposed.png',
                    './images/icons/apple-touch-icon-144x144.png',
                    './images/icons/apple-touch-icon-152x152-precomposed.png',
                    './images/icons/apple-touch-icon-152x152.png',
                    './images/icons/apple-touch-icon-180x180-precomposed.png',
                    './images/icons/apple-touch-icon-180x180.png',
                    './images/icons/apple-touch-icon-57x57-precomposed.png',
                    './images/icons/apple-touch-icon-57x57.png',
                    './images/icons/apple-touch-icon-60x60-precomposed.png',
                    './images/icons/apple-touch-icon-60x60.png',
                    './images/icons/apple-touch-icon-72x72-precomposed.png',
                    './images/icons/apple-touch-icon-72x72.png',
                    './images/icons/apple-touch-icon-76x76-precomposed.png',
                    './images/icons/apple-touch-icon-76x76.png',
                    './images/icons/apple-touch-icon-precomposed.png',
                    './images/icons/apple-touch-icon.png',
                    './images/icons/browserconfig.xml',
                    './images/icons/favicon-16x16.png',
                    './images/icons/favicon-32x32.png',
                    './images/icons/favicon.ico',
                    './images/icons/mstile-144x144.png',
                    './images/icons/mstile-150x150.png',
                    './images/icons/mstile-310x150.png',
                    './images/icons/mstile-310x310.png',
                    './images/icons/mstile-70x70.png',
                    './images/icons/safari-pinned-tab.svg',
                    './css/app.css',
                    './data/netflix-codes.json',
                    './js/sw-update-checker.js',
                    './js/app.js',
                    './js/lodash.js',
                    './js/knockout.min.js',
                    './js/knockout.mapping.min.js',
                    './js/knockout.bindings.js',
                    './index.html'
                ]
            );
        })
    );
})

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(
                    keys.map(key => {
                        if (key !== CACHE_NAME_VERSION) {
                            return caches.delete(key);
                        }
                    })
                )
            })
    )
});

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(CACHE_NAME_VERSION).then(cache => {
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