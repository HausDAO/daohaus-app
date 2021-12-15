import React from 'react';
import { Flex } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { FORM } from '../data/forms';
import { useAppModal } from '../hooks/useModals';

const UberhausProposals = () => {
  const { formModal } = useAppModal();
  const handleClick = propType => {
    console.log('propType', propType);
    formModal(FORM.CHANGE_UBERHAUS_DELEGATE);
  };
  return (
    <Flex flexDir='row' w='100%'>
      <Button onClick={() => handleClick('delegate')}>Delegate proposal</Button>
    </Flex>
  );
};

export default UberhausProposals;
