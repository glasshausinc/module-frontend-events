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

                eventManager.dispatchEvent(
                    'catalog_product_view_swatch_click',
                    getClickEventData(this)
                );
            },
        });

        return $.mage.SwatchRenderer;

    }
});