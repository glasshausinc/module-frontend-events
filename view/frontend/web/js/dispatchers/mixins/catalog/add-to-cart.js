define([
	'jquery',
	'underscore',
	'frontendEventManager',
	'Magento_Customer/js/customer-data',
	'jquery/ui'
], function (
	$,
	_,
	eventManager,
	customerData
) {
	'use strict';
	return function (widget) {

		var allowSubmitSuper = false,
			initialCartDataXhr,
			postAddCartDataXhr;

		var getAddToCartEventData = function (form) {
			var addToCartFormData = _.reduce(form.serializeArray(), function (memo, val) {
				memo[val.name] = val.value;
				return memo;
			}, {});

			return {
				form: form,
				formData: addToCartFormData,
				productSku: form.data('productSku'),
				cart: customerData.get('cart')()
			}
		};

		$.widget('mage.catalogAddToCart', widget, {
			_create: function () {
				this._super();
				initialCartDataXhr = this._loadCartData();
			},

			_loadCartData: function () {
				return customerData.reload(['cart'], false);
			},

			submitForm: function (form) {
				if(allowSubmitSuper) {
					this._super(form);
					allowSubmitSuper = false;
				} else {
					var self = this;

					// disable button now as it is possible a slight delay occurs while waiting for
					// customerData to load the cart from the server
					self.disableAddToCartButton(form);

					if(!initialCartDataXhr) {
						initialCartDataXhr = this._loadCartData();
					}

					initialCartDataXhr.done(function() {
						eventManager.dispatchEvent(
							'checkout_cart_add_product_before',
							getAddToCartEventData(form)
						).done(function () {
							allowSubmitSuper = true;
							self.submitForm(form);
						});
					});
				}
			},

			enableAddToCartButton: function (form) {
				this._super(form);

				if(!postAddCartDataXhr) {
					postAddCartDataXhr = this._loadCartData();
				}

				postAddCartDataXhr.done(function() {
					eventManager.dispatchEvent(
						'checkout_cart_add_product_after',
						getAddToCartEventData(form)
					);
				});
			}
		});

		return $.mage.catalogAddToCart;
	}
});