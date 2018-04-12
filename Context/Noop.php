<?php

namespace TGHP\FrontendEvents\Context;

class Noop extends AbstractContext implements ContextInterface
{

    public function getContextData()
    {
        return false;
    }

}