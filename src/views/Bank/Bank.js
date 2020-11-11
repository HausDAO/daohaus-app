import React from 'react';
import { Box } from '@chakra-ui/core';

import BankOverviewChart from '../../components/Bank/BankOverviewChart';
import TokenList from '../../components/Bank/TokenList';

const Bank = () => {
  return (
    <Box w='70%'>
      <BankOverviewChart />
      <TokenList />
    </Box>
  );
};

export default Bank;
