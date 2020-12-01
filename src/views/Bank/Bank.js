import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/core';

import {
  useBalances,
  useDao,
  useRefetchQuery,
} from '../../contexts/PokemolContext';
import BankOverviewChart from '../../components/Bank/BankOverviewChart';
import TokenList from '../../components/Shared/TokenList/TokenList';
import BankTotal from '../../components/Bank/BankTotal';

const Bank = () => {
  const [dao] = useDao();
  const [tokenList, setTokenList] = useState(null);
  const [balances] = useBalances();
  const [, updateRefetchQuery] = useRefetchQuery();

  useEffect(() => {
    if (dao?.graphData?.tokenBalances) {
      setTokenList(dao.graphData.tokenBalances);
    }
  }, [dao]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateRefetchQuery('moloch');
      updateRefetchQuery('balances');
    }, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  return (
    <Box w='100%' p={6}>
      <BankTotal tokenBalances={dao?.graphData?.tokenBalances} />
      <BankOverviewChart balances={balances} dao={dao} />
      <TokenList tokenList={tokenList} isBank={true} />
    </Box>
  );
};

export default Bank;
