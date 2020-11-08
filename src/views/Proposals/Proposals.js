import React from 'react';
import { Box, Flex } from '@chakra-ui/core';

import ProposalsList from '../../components/Proposals/ProposalsList';
import ProposalsActivityFeed from '../../components/Proposals/ProposalsActivityFeed';

const Proposals = () => {
  return (
    <Flex>
      <Box w='60%'>
        <ProposalsList />
      </Box>

      <Box w='38%'>
        <ProposalsActivityFeed />
      </Box>
    </Flex>
  );
};

export default Proposals;
