import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/core';

import { useBalances, useDao } from '../../contexts/PokemolContext';
import BankOverviewChart from '../../components/Bank/BankOverviewChart';
import TokenList from '../../components/Shared/TokenList/TokenList';
import BankTotal from '../../components/Bank/BankTotal';

const Bank = () => {
  const [dao] = useDao();
  const [tokenList, setTokenList] = useState(null);
  const [balances] = useBalances();

  useEffect(() => {
    if (dao?.graphData?.tokenBalances) {
      setTokenList(dao.graphData.tokenBalances);
    }
  }, [dao]);

  return (
    <Box w='100%' p={6}>
      <BankTotal tokenBalances={dao?.graphData?.tokenBalances} />
      <BankOverviewChart balances={balances} />
      <TokenList tokenList={tokenList} />
    </Box>
  );
};

export default Bank;
