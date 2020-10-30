import React from 'react';
import { Box, Flex, Icon } from '@chakra-ui/core';

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
            <Icon name='voteYes' size='45px' />
            <Icon name='voteNo' size='45px' />
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
