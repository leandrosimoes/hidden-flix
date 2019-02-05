;
(window => {
    let newWorker;
    window.checkSwUpdate = () => {
        return new Promise(resolve => {
            // Check if has a update available
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('./sw.js').then(reg => {
                    reg.addEventListener('updatefound', () => {
                        // A wild service worker has appeared in reg.installing!
                        newWorker = reg.installing;
                        newWorker.addEventListener('statechange', () => {
                            // Has network.state changed?
                            switch (newWorker.state) {
                                case 'installed':
                                    if (navigator.serviceWorker.controller) {
                                        resolve(true)
                                    } else {
                                        resolve(false)
                                    }
                            }
                        });
                    });
                });

                let refreshing;
                navigator.serviceWorker.addEventListener('controllerchange', function () {
                    if (refreshing) return;
                    window.location.reload();
                    refreshing = true;
                });
            } else {
                resolve(false);
            }
        })
    }
    window.swUpdate = () => {
        !!newWorker && !!newWorker.postMessage && newWorker.postMessage({
            action: 'skipWaiting'
        });
    }
})(window);