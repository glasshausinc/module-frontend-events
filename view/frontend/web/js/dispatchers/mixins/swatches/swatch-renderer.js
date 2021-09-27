define([
    'jquery',
    'underscore',
    'frontendEventManager',
    'jquery/ui'
], function (
    $,
    _,
    eventManager
) {
    'use strict';
    return function (widget) {

        var getClickEventData = function (widget) {
            var productId = widget.getProduct();

            if (!productId) {
                return;
            }

            if (!widget.options.jsonConfig.sku || !widget.options.jsonConfig.optionPrices) {
                return;
            }

            return {
                widget: widget,
                productId: productId,
                productSku: widget.options.jsonConfig.sku[productId],
                productPrice: widget.options.jsonConfig.optionPrices[productId].finalPrice.amount,
            }
        };

        $.widget('mage.SwatchRenderer', widget, {
            _OnClick: function ($this, $widget, eventName) {
                this._super($this, $widget, eventName);

                const eventData = getClickEventData(this);

                if (eventData) {
                    eventManager.dispatchEvent(
                        'catalog_product_view_swatch_click',
                        eventData
                    );
                }
            },
        });

        return $.mage.SwatchRenderer;

    }
});