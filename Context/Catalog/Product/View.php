<?php

namespace TGHP\FrontendEvents\Context\Catalog\Product;

use TGHP\FrontendEvents\Context\AbstractContext;
use TGHP\FrontendEvents\Context\ContextInterface;

class View extends AbstractContext implements ContextInterface
{

    public function getContextData()
    {
        return [
            'product' => $this->coreRegistry->registry('current_product')->getData()
        ];
    }

}