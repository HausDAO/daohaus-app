import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import Layout from '../components/layout';
import MainViewLayout from '../components/mainViewLayout';
import HubSignedOut from '../components/hubSignedOut';
import HubProfileCard from '../components/hubProfileCard';
import HubBalanceList from '../components/hubBalanceList';
import { balanceChainQuery } from '../utils/theGraph';
import { supportedChains } from '../utils/chain';

const HubBalances = () => {
  const { address } = useInjectedProvider();
  const [balances, setBalances] = useState([]);
  const [balancesGraphData, setBalanceGraphData] = useState({
    chains: [],
    data: [],
  });
  const hasLoadedBalanceData =
    balancesGraphData.chains.length === Object.keys(supportedChains).length;

  useEffect(() => {
    if (address) {
      balanceChainQuery({
        reactSetter: setBalanceGraphData,
        address,
      });
    }
  }, [address]);

  useEffect(() => {
    if (hasLoadedBalanceData) {
      const tokenBalances = balancesGraphData.data
        .flatMap(bal => {
          return bal.tokenBalances.map(b => {
            return { ...b, moloch: bal.moloch, meta: bal.meta };
          });
        })
        .filter(bal => +bal.tokenBalance > 0);

      setBalances(tokenBalances);
    }
  }, [hasLoadedBalanceData]);

  return (
    <Layout>
      <MainViewLayout header='Balances'>
        {address ? (
          <>
            <HubProfileCard address={address} key={address} />
            <Box my={5} maxW='800px'>
              Internal DAO balances are the result of proposal deposits,
              processing rewards, rage quits and cancelled tribute proposals.
              These can be withdrawn into your wallet from the profile page in
              the DAO.
            </Box>
            <HubBalanceList tokens={balances} />
          </>
        ) : (
          <HubSignedOut />
        )}
      </MainViewLayout>
    </Layout>
  );
};

export default HubBalances;
