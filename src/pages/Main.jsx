import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import FeaturedDaos from '../components/featuredDaos';
import HausCard from '../components/hausCard';
import HubProfileCard from '../components/hubProfileCard';
import HubSignedOut from '../components/hubSignedOut';
import MainViewLayout from '../components/mainViewLayout';
import NetworkList from '../components/networkList';
import NewsFeed from '../components/newsFeed';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useUser } from '../contexts/UserContext';

const Main = () => {
  const { address } = useInjectedProvider();
  const { userHubDaos } = useUser();

  const hasDaos = () => {
    return userHubDaos.some(network => network.data.length);
  };

  return (
    <MainViewLayout header='Hub'>
      <Flex wrap='wrap'>
        <Box
          w={['100%', null, null, null, '60%']}
          pr={[0, null, null, null, 6]}
          pb={6}
        >
          {address ? (
            <>
              <HubProfileCard address={address} key={address} />
              <NetworkList />
            </>
          ) : (
            <HubSignedOut />
          )}
        </Box>
        {address && (
          <Box w={['100%', null, null, null, '40%']}>
            <HausCard />

            {hasDaos() ? <NewsFeed /> : <FeaturedDaos />}
          </Box>
        )}
      </Flex>
    </MainViewLayout>
  );
};

export default Main;
