import React from 'react';
import { Box, Flex } from '@chakra-ui/core';

import ProposalsList from '../../components/Proposals/ProposalsList';
import ProposalsActivityFeed from '../../components/Proposals/ProposalsActivityFeed';

const Proposals = () => {
  return (
    <Flex p={6} wrap='wrap'>
      <Box w={['100%', null, null, null, '60%']} pr={[0, null, null, null, 6]}>
        <ProposalsList />
      </Box>

      <Box w={['100%', null, null, null, '40%']} pt={[6, 0]}>
        <ProposalsActivityFeed />
      </Box>
    </Flex>
  );
};

export default Proposals;
