import React from 'react';
import { Flex } from '@chakra-ui/react';

const ComingSoonOverlay = () => {
  return (
    <Flex
      position='absolute'
      top='0px'
      left='0px'
      bottom='0px'
      right='0px'
      zIndex='3'
      fontFamily='heading'
      fontSize='xl'
      fontWeight={700}
      align='center'
      justify='center'
    >
      Coming Soon
    </Flex>
  );
};

export default ComingSoonOverlay;
