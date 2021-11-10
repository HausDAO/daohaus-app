import React from 'react';
import { Flex } from '@chakra-ui/react';
import TextBox from '../components/TextBox';

const Blur = ({ text }) => {
  return (
    <Flex
      display='flex'
      w='100%'
      h='100%'
      backdropFilter='blur(6px)'
      position='absolute'
      zIndex={5}
      justify='center'
      align='center'
    >
      <TextBox w='40%' textAlign='center'>
        {text}
      </TextBox>
    </Flex>
  );
};

export default Blur;
