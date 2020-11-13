import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/core';

import { useDaoGraphData } from '../../contexts/PokemolContext';
import BankOverviewChart from '../../components/Bank/BankOverviewChart';
import TokenList from '../../components/Shared/TokenList/TokenList';

const Bank = () => {
  const [dao] = useDaoGraphData();
  const [tokenList, setTokenList] = useState(null);

  useEffect(() => {
    if (dao?.tokenBalances) {
      setTokenList(dao?.tokenBalances);
    }
  }, [dao]);

  return (
    <Box w='100%' p={6}>
      <BankOverviewChart />
      <TokenList tokenList={tokenList} />
    </Box>
  );
};

export default Bank;
