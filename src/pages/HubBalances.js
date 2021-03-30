import React, { useEffect, useState } from 'react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useUser } from '../contexts/UserContext';
import Layout from '../components/layout';
import MainViewLayout from '../components/mainViewLayout';
import HubSignedOut from '../components/hubSignedOut';
import HubProfileCard from '../components/hubProfileCard';
import HubBalanceList from '../components/hubBalanceList';

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
