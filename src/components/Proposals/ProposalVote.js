import React from 'react';
import { Box, Flex, Icon } from '@chakra-ui/core';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const ProposalVote = () => {
  return (
    <>
      <Box
        rounded='lg'
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        p={6}
        m={6}
        ml={0}
        w='90%'
      >
        <Flex>
          <Flex w='40%' justify='space-around'>
            <Icon as={FaThumbsUp} />
            <Icon as={FaThumbsDown} />
          </Flex>
          <Flex justify='center' align='center' w='50%'>
            Currently Passing
          </Flex>
        </Flex>
        <Box>box</Box>
      </Box>
    </>
  );
};

export default ProposalVote;
