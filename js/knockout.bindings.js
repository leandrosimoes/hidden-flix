;
(() => {
    if (!ko) throw new Error("Knockout not loaded")

    let _timeout;
    ko.bindingHandlers.delayCallback = {
        init: (element, valueAccessor) => {
            const {
                delay = 1000, callback
            } = valueAccessor();

            element.addEventListener('keyup', event => {
                clearTimeout(_timeout)
                _timeout = setTimeout(() => {
                    !!callback && callback(event.target.value || '')
                }, delay);
            })
        }
    }
})()