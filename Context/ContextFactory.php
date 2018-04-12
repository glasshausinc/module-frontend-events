<?php

namespace TGHP\FrontendEvents\Context;

use Magento\Framework\ObjectManagerInterface;

class ContextFactory
{

    /**
     * @var ObjectManagerInterface
     */
    protected $objectManager;

    public function __construct(
        ObjectManagerInterface $objectManager
    ) {
        $this->objectManager = $objectManager;
    }

    /**
     * @param string $fullActionName
     * @return ContextInterface
     */
    public function create($fullActionName)
    {
        $classPath = implode('\\', array_map('ucwords', explode('_', $fullActionName)));
        try {
            return $this->objectManager->create(sprintf("\TGHP\FrontendEvents\Context\\%1s", $classPath));
        } catch (\ReflectionException $e) {
            return $this->objectManager->create("\TGHP\FrontendEvents\Context\Noop");
        }
    }

}