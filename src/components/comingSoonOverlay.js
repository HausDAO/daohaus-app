import React from 'react';
import { Flex } from '@chakra-ui/react';

const ComingSoonOverlay = ({ message = 'Coming Soon', fontSize = 'xl' }) => {
  return (
    <Flex
      position='absolute'
      top='0px'
      left='0px'
      bottom='0px'
      right='0px'
      zIndex='3'
      fontFamily='heading'
      fontSize={fontSize}
      fontWeight={700}
      align='center'
      justify='center'
      style={{ backdropFilter: 'blur(6px)' }}
    >
      {message}
    </Flex>
  );
};

export default ComingSoonOverlay;
