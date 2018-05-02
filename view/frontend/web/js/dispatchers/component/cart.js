define([
    'jquery',
    'underscore',
    'frontendEventManager',
    'Magento_Customer/js/customer-data'
], function (
    $,
    _,
    eventManager,
    customerData
) {

    function getCartQtyFingerprint(qtys) {
        return qtys.join('');
    }

    function getCartQtys($cart) {
        return $cart.find('[name$="[qty]"]')
            .map(function () { return $(this).val() })
            .toArray();
    }

    return function(config, element) {

        var $cart = $(element),
            initialQtyFingerprint = getCartQtyFingerprint(getCartQtys($cart));

        console.log('bound to', $cart);

        $cart.data('cart-qty-hash-initial', initialQtyFingerprint);
        $cart.data('cart-qty-hash', initialQtyFingerprint);

        $cart.on('change', '[name$="[qty]"]', function () {
            eventManager.dispatchEvent(
                'checkout_cart_update_item_input',
                {
                    form: $cart,
                    input: $(this)
                }
            );
            $cart.data('cart-qty-hash', getCartQtyFingerprint(getCartQtys($cart)));
        });

        $cart.on('click', '.action-delete', function (e) {
            var $this = $(this);

            if($this.data('eventmanager-allow-event')) {
                $this.data('eventmanager-allow-event', false);
            } else {
                e.stopImmediatePropagation();
                e.preventDefault();

                eventManager.dispatchEvent(
                    'checkout_cart_item_remove',
                    {
                        form: $this.data('post') ? $this.data('post').data : {},
                        cart: customerData.get('cart')()
                    }
                ).done(function () {
                    $this.data('eventmanager-allow-event', true)
                        .click();
                });
            }
        });

        $cart.on('submit.eventManagerCore', function (e) {
            e.preventDefault();

            if($cart.data('cart-qty-hash') !== $cart.data('cart-qty-hash-initial')) {
                eventManager.dispatchEvent(
                    'checkout_cart_update',
                    {
                        form: $cart,
                        cart: customerData.get('cart')()
                    }
                ).done(function () {
                    $cart.off('submit.eventManagerCore')
                        .submit();
                });
            }

        });

    };

});