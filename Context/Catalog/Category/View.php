<?php

namespace TGHP\FrontendEvents\Context\Catalog\Category;

use TGHP\FrontendEvents\Context\AbstractContext;
use TGHP\FrontendEvents\Context\ContextInterface;

class View extends AbstractContext implements ContextInterface
{

    public function getContextData()
    {
        return [
            'category' => $this->coreRegistry->registry('current_category')->getData()
        ];
    }

}