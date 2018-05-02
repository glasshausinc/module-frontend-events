define([
    'jquery',
    'underscore',
    'frontendEventManager'
], function (
    $,
    _,
    eventManager
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

                var dataPost = $this.data('post') ? $this.data('post').data : {};

                // TODO: get cart item from customerData('cart')
                eventManager.dispatchEvent(
                    'checkout_cart_item_remove',
                    {
                        deleteActionData: dataPost
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
                        form: $cart
                    }
                ).done(function () {
                    $cart.off('submit.eventManagerCore')
                        .submit();
                });
            }

        });

    };

});