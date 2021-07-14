import React from 'react';
import { Flex, Box, Button } from '@chakra-ui/react';

import NewsFeed from '../components/newsFeed';
import FeaturedDaos from '../components/featuredDaos';
import NetworkList from '../components/networkList';
import HubProfileCard from '../components/hubProfileCard';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import HubSignedOut from '../components/hubSignedOut';
import MainViewLayout from '../components/mainViewLayout';
import { useUser } from '../contexts/UserContext';

const Main = () => {
  const { address } = useInjectedProvider();
  const { userHubDaos } = useUser();

  const hasDaos = () => {
    return userHubDaos.some(network => network.data.length);
  };

  const ctaButton = (
    <Button as='a' href='https://3box.io/hub' target='_blank' variant='outline'>
      Edit 3Box Profile
    </Button>
  );

  return (
    <MainViewLayout header='Hub' headerEl={address ? ctaButton : null}>
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
        {address && hasDaos() ? (
          <Box w={['100%', null, null, null, '40%']}>
            <NewsFeed />
          </Box>
        ) : (
          <Box w={['100%', null, null, null, '40%']}>
            <FeaturedDaos />
          </Box>
        )}
      </Flex>
    </MainViewLayout>
  );
};

export default Main;
