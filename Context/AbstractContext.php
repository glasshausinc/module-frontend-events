<?php

namespace TGHP\FrontendEvents\Context;

use Magento\Framework\Registry;

abstract class AbstractContext
{

    /**
     * @var Registry
     */
    protected $coreRegistry;

    public function __construct(
        Registry $coreRegistry
    ) {
        $this->coreRegistry = $coreRegistry;
    }

}