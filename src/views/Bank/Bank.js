import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/core';

import { useDao } from '../../contexts/PokemolContext';
import BankOverviewChart from '../../components/Bank/BankOverviewChart';
import TokenList from '../../components/Shared/TokenList/TokenList';
import GraphFetch from '../../components/Shared/GraphFetch';
import { BANK_BALANCES } from '../../utils/apollo/bank-queries';

const Bank = () => {
  const [dao] = useDao();
  const [tokenList, setTokenList] = useState(null);
  const [balances, setBalances] = useState();

  useEffect(() => {
    if (dao?.graphData?.tokenBalances) {
      setTokenList(dao.graphData.tokenBalances);
    }
  }, [dao]);

  return (
    <Box w='100%' p={6}>
      <BankOverviewChart balances={balances} />
      <TokenList tokenList={tokenList} />

      {dao?.address && dao?.graphData ? (
        <GraphFetch
          query={BANK_BALANCES}
          setRecords={setBalances}
          entity='balances'
          variables={{
            molochAddress: dao.address,
          }}
          isStats={true}
        />
      ) : null}
    </Box>
  );
};

export default Bank;
