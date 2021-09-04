import React from 'react';
import { Flex, Button } from '@chakra-ui/react';
import TextBox from './TextBox';

const ListItemButton = ({ onClick, helperText, mainText, value, disabled }) => {
  const handleClick = () => onClick?.(value);
  return (
    <Flex flexDir='column' alignItems='flex-end'>
      <Button variant='ghost' p={0} onClick={handleClick} disabled={disabled}>
        <TextBox color='secondary.500'>{mainText}</TextBox>
      </Button>
      <TextBox variant='body' mt={3} opacity='0.8' size='sm' fontStyle='italic'>
        {helperText}
      </TextBox>
    </Flex>
  );
};

export default ListItemButton;
