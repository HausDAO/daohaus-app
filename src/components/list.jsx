import { InputGroup } from '@chakra-ui/input';
import { Flex, List as ChakraList } from '@chakra-ui/layout';
import React from 'react';
import TextBox from './TextBox';

const List = ({ list, headerSection }) => {
  // const useMemo(() => {
  //   if()
  // }, [selectedList ])
  return (
    <Flex flexDir='column' w='100%'>
      <Flex mb={4}>{headerSection}</Flex>
      <ChakraList>{list}</ChakraList>
    </Flex>
  );
};

export default List;
