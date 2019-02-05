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

    ko.bindingHandlers.forIn = {
        transformObject: function (obj) {
          let properties = [];
          ko.utils.objectForEach(obj, function (key, value) {
            properties.push({ key: key, value: value });
          });
          return properties;
        },
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
          let properties = ko.pureComputed(function () {
            let obj = ko.utils.unwrapObservable(valueAccessor());
            return ko.bindingHandlers.forIn.transformObject(obj);
          });
          ko.applyBindingsToNode(element, { foreach: properties }, bindingContext);
          return { controlsDescendantBindings: true };
        }
      };
})()