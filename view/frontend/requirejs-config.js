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
			}
		}
	},
	paths: {
		'q': 'TGHP_FrontendEvents/js/lib/q'
	}
};
