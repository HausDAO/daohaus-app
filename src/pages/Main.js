import React from 'react';
import { Flex, Box } from '@chakra-ui/react';

import NewsFeed from '../components/newsFeed';
import NetworkList from '../components/networkList';
import HubProfileCard from '../components/hubProfileCard';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import HubSignedOut from '../components/hubSignedOut';
import MainViewLayout from '../components/mainViewLayout';

const Main = () => {
  const { address } = useInjectedProvider();

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
              <HubProfileCard address={address} />
              <NetworkList />
            </>
          ) : (
            <HubSignedOut />
          )}
        </Box>
        <Box w={['100%', null, null, null, '40%']}>
          <NewsFeed />
        </Box>
      </Flex>
    </MainViewLayout>
  );
};

export default Main;
