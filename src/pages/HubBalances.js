import React, { useEffect, useState } from 'react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useUser } from '../contexts/UserContext';
import Layout from '../components/layout';
import MainViewLayout from '../components/mainViewLayout';
import HubSignedOut from '../components/hubSignedOut';
import HubProfileCard from '../components/hubProfileCard';
import HubBalanceList from '../components/hubBalanceList';
import { Box } from '@chakra-ui/layout';

const HubBalances = () => {
  const { address } = useInjectedProvider();
  const { userHubDaos } = useUser();
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    setBalances(
      userHubDaos
        .flatMap((network) => {
          return network.data.flatMap((dao) => {
            return dao.tokenBalances.map((bal) => {
              return { ...bal, network };
            });
          });
        })
        .filter((bal) => +bal.tokenBalance > 0),
    );
  }, [userHubDaos]);

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
