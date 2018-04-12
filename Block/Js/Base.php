<?php

namespace TGHP\FrontendEvents\Block\Js;

use Magento\Framework\Serialize\SerializerInterface;
use Magento\Framework\View\Element\Template;
use TGHP\FrontendEvents\Context\ContextFactory;

class Base extends Template
{

    /**
     * @var ContextFactory
     */
    protected $contextFactory;

    /**
     * @var SerializerInterface
     */
    protected $serializer;

    public function __construct(
        ContextFactory $contextFactory,
        SerializerInterface $serializer,
        Template\Context $context,
        array $data = []
    ) {
        $this->serializer = $serializer;
        $this->contextFactory = $contextFactory;
        parent::__construct($context, $data);
    }

    public function getRouteName()
    {
        return $this->getRequest()->getRouteName();
    }

    public function getFullActionName()
    {
        return $this->getRequest()->getFullActionName();
    }

    public function getContextJson()
    {
        $context = $this->contextFactory->create($this->getFullActionName());
        if(!$context && !empty($context)) {
            return $this->serializer->serialize($context->getContextData());
        }
    }

    // TODO: power via DI or some config
    public function getGlobalComponentsConfigJson()
    {
        return $this->serializer->serialize([
            '.form-cart' => [
                'TGHP_FrontendEvents/js/dispatchers/component/cart' => []
            ]
        ]);
    }

}