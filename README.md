# Magento 2 Frontend Events

A frontend event/observer library that aspires to behave much like the native Observer pattern but in JS and for events occuring during frontend interaction.

## Usage

The event manager is available via RequireJS using `frontendEventManager`:

```
<script type="text/javascript">
require([
	'frontendEventManager'
], function (
	eventManager
) {

    // we can now use eventManager

});
</script>
```

### Observe an event

Use `addObserver` to observe an event. The first argument is the event name to observe and the second argument is a callback.

A simple example:
 
```
eventManager.addObserver('controller_action_frontend', function (data) {
	console.log('a page view', data);
});
```

It's important to note that the event dispatcher that has triggered the observer returns a promise (we use [Q](https://github.com/kriskowal/q) for promises.) and that many events will wait for that promise to resolve until allowing the native functionality to proceed. This can be important as some events are triggered as part of a bit of functionality that is then navigating away from the page (some checkout events are a good example). 
 
As a convenience, if you want to allow native behaviour to proceed instantly and trigger some functionality, return `false` in the callback. We recommend just doing this by default in any case, unless explicitly interacting with the promise (see next snippet).

```
eventManager.addObserver('checkout_cart_add_product_after', function (data) {
	console.log('product was added to cart!', data);
	
	return false;
});
```

To allow the native functionality to proceed, resolve the promise that is in the context of `this` in the callback.

```
eventManager.addObserver('checkout_cart_add_product_before', function (data) {
    var self = this;
    console.log('doing something, waiting for it to be ready to allow the add to cart');
    setTimeout(function () {
        console.log('ok, add to cart!');
        self.resolve();
    }, 5000);
});
```

### Dispatch an event

Use `dispatchEvent` to dispatch an event that will trigger all observers. The first argument is the event name to dispatch and the second argument is useful data to pass to the observers in form of an object literal. 

The method returns a callback that resolves when all of the observers have resolved their respective promises.

```
eventManager.dispatchEvent(
    'my_event',
    { 'foo': 'bar', 'stuff': this.getStuff() }
).done(function () {
    console.log('all observers for my_event have finished');
});
```

This pattern of waiting for the observers to resolve is particularly useful when using RequireJs/M2 mixins to wrap a function call that does a thing: prevent that thing, allow the observers to do their work, once that has all finished (promises resolved), allow the thing to happen. See `submitForm` in `TGHP_FrontendEvents/js/dispatchers/mixins/catalog/add-to-cart`.

## FAQ

### Why use promises to prevent some functionality during event dispatch?

For some events, we may be listening to event that its native behaviour is navigating away from the page. We can use the promise to ensure we have done everything we need to before allowing that to happen. 

It is the responsibility of the event dispatcher to ensure native behaviour is halted until the promises have resolved.