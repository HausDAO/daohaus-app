import React from 'react';
import { Box, Flex } from '@chakra-ui/core';

import ProposalsList from '../../components/Proposals/ProposalsList';
import ProposalsActivityFeed from '../../components/Proposals/ProposalsActivityFeed';

const Proposals = () => {
  return (
    <Flex p={6}>
      <Box w='60%'>
        <ProposalsList />
      </Box>

      <Box w='38%' ml={6}>
        <ProposalsActivityFeed />
      </Box>
    </Flex>
  );
};

export default Proposals;
