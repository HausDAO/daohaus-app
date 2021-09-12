import React from 'react';
import { Flex, List as ChakraList } from '@chakra-ui/layout';

const List = ({ list, headerSection }) => {
  return (
    <Flex flexDir='column' w='100%' minW={['300px', '400px', '450px']}>
      <Flex mb={4}>{headerSection}</Flex>
      <ChakraList>{list}</ChakraList>
    </Flex>
  );
};

export default List;
