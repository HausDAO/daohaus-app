import React from 'react';
import { Flex, Box } from '@chakra-ui/react';

import ExecuteSafeMinion from './executeSafeMinion';
import RaribleOrder from '../components/raribleOrder';

const ExecuteRarible = props => {
  const { proposal } = props;

  return (
    <Flex direction='column'>
      <ExecuteSafeMinion {...props} />
      {proposal.executed && (
        <Box mt={3}>
          <RaribleOrder proposal={proposal} orderType='Sell' buttonSize='sm' />
        </Box>
      )}
    </Flex>
  );
};

export default ExecuteRarible;
