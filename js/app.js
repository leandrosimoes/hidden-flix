;
(() => {
    let newWorker;
    if (!!window.navigator.serviceWorker) {
        window.navigator.serviceWorker
            .register('sw.js');
    }

    let deferredEvent;
    window.addEventListener('beforeinstallprompt', event => {
        event.preventDefault();
        deferredEvent = event;

        if (window.matchMedia('(display-mode: standalone)').matches) {
            window.hiddenFlixViewModel.notInstalled(false);
        } else {
            window.hiddenFlixViewModel.notInstalled(true);
        }
    })

    const viewModel = function () {
        let self = this;

        self.OpenCategory = item => {
            if (!item.url) return

            window.open(item.url, '_blank');
        }
        self.Search = filter => {
            let options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }
            fetch('data/netflix-codes.json', options)
                .then(response => response.json())
                .then(categories => {
                    if (filter) {
                        categories = categories.filter(c => c.name.toLowerCase().indexOf(filter.toLowerCase()) > -1)
                    }

                    let groups = []
                    if (!!categories && categories.length) {
                        groups = _.groupBy(categories, c => c.name.toUpperCase().split('')[0])
                    }

                    self.groups(groups)
                })
        }
        self.Install = () => {
            if (deferredEvent) {
                deferredEvent.prompt()
                deferredEvent.userChoice.then(choiceResult => {
                    if (choiceResult.outcome !== 'dismissed') {
                        window.hiddenFlixViewModel.notInstalled(false);
                    }

                    deferredEvent = null
                })
            }
        }
        self.Update = () => {
            !!newWorker && !!newWorker.postMessage && newWorker.postMessage({
                action: 'skipWaiting'
            });
        }

        // observables
        self.inputSearch = ko.observable('')
        self.notInstalled = ko.observable(true)
        self.hasUpdate = ko.observable(false)
        self.groups = ko.observable([])

        // computeds
        self.HasCategories = ko.computed(() => {
            return !!Object.keys(self.groups()) && Object.keys(self.groups()).length > 0
        })
        self.ShowUpdateButton = ko.computed(() => {
            return !self.notInstalled() && !!self.hasUpdate();
        })
        self.ShowInstallButton = ko.computed(() => {
            return !!self.notInstalled() && !self.hasUpdate();
        })
    }

    window.hiddenFlixViewModel = new viewModel();

    ko.applyBindings(window.hiddenFlixViewModel, document.body)

    if (window.matchMedia('(display-mode: standalone)').matches) {
        window.hiddenFlixViewModel.notInstalled(false);
    } else {
        window.hiddenFlixViewModel.notInstalled(true);
    }

    window.hiddenFlixViewModel.Search();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').then(reg => {
            reg.addEventListener('updatefound', () => {
                // A wild service worker has appeared in reg.installing!
                newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    window.hiddenFlixViewModel.hasUpdate(false)

                    // Has network.state changed?
                    switch (newWorker.state) {
                        case 'installed':
                            if (navigator.serviceWorker.controller) {
                                // new update available
                                window.hiddenFlixViewModel.hasUpdate(true)
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
    }
})()