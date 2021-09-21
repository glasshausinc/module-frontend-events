var config = {
	map: {
		'*': {
			frontendEventManager: 'TGHP_FrontendEvents/js/manager'
		}
	},
	config: {
		mixins: {
			'Magento_Catalog/js/catalog-add-to-cart': {
				'TGHP_FrontendEvents/js/dispatchers/mixins/catalog/add-to-cart': true
			},
			'Magento_Swatches/js/swatch-renderer': {
				'TGHP_FrontendEvents/js/dispatchers/mixins/swatches/swatch-renderer': true
			}
		}
	},
	paths: {
		'q': 'TGHP_FrontendEvents/js/lib/q'
	}
};
