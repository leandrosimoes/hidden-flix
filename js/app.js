(() => {
    const setupCategories = filter => {
        let options = {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json; charset=utf-8'
			}
		}
        fetch('/data/netflix-codes.json', options)
            .then(response => response.json())
            .then(categories => {
                if (filter) {
                    categories = categories.filter(c => c.name.toLowerCase().indexOf(filter.toLowerCase()) > -1)
                }

                if (categories.length > 0) {
                    categories = categories.map(c => `<div class="category"><button class="btn-category" type="button" data-url="${c.url}">${c.name}</button></div>`)
                    document.querySelector('#categories-area > div').innerHTML = categories.join('\r\n')
                } else {
                    document.querySelector('#categories-area > div').innerHTML = '<div id="no-categories-found">No categories found</div>'
                }

            })
    }

    let timoutSearch;
    const setupSearch = () => {
        const searchInput = document.querySelector('#input-search')
        searchInput.addEventListener('keyup', event => {
            clearTimeout(timoutSearch)
            timoutSearch = setTimeout(() => {
                setupCategories(event.target.value || '')
            }, 1000);
        })
    }

    if (!!window.navigator.serviceWorker) {
        window.navigator.serviceWorker
            .register('sw.js');
    }

    let deferredEvent;
    window.addEventListener('beforeinstallprompt', event => {
        event.preventDefault()
        deferredEvent = event
        return false
    })

    const installButton = document.querySelector('#btn-install')
    installButton.addEventListener('click', event => {
        if (deferredEvent) {
            deferredEvent.prompt()
            deferredEvent.userChoice.then(choiceResult => {
                if (choiceResult.outcome !== 'dismissed') {
                    installButton.classList.add('hidden')
                    localStorage.setItem('install-status', 'installed')
                    // DISPLAY HERE A SUCCESS INSTALL MESSAGE ON DOM
                }

                deferredEvent = null
            })
        }
    })

    if (localStorage.getItem('install-status') !== 'installed') {
        installButton.classList.remove('hidden')
    }

    document.querySelector('#categories-area').addEventListener('click', event => {
        if (event.target.classList.contains('btn-category')) {
            const url = event.target.dataset['url'] || ''
            if (url) {
                window.open(url, '_blank');
            }
        }
    })

    setupCategories();
    setupSearch();
})()