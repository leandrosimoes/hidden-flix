;
(window => {
    let newWorker;
    if (!!window.navigator.serviceWorker) {
        window.navigator.serviceWorker
            .register('./sw.js');
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
            if (window.swUpdate) {
                window.swUpdate()
            }
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

    // see sw-update-checker.js
    if (window.checkSwUpdate) {
        window.hiddenFlixViewModel.hasUpdate(false)
        window.checkSwUpdate().then(result => {
            window.hiddenFlixViewModel.hasUpdate(!!result)
        })
    }

    if (window.caches) {
        window.caches.keys().then(keys => {
            const version = keys[0].match(/(v)(\d{1,10})(\-)(\d{1,10})(\-)(\d{1,10})/g)[0].replace(/\-/g, '.')
            document.querySelector('#version-area span').innerHTML = version
        })
    }
})(window)