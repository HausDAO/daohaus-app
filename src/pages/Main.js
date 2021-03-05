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
import { MM_ADDCHAIN_DATA } from '../utils/chain';
// import { MM_ADDCHAIN_DATA } from '../utils/chain';

const Main = () => {
  const { address } = useInjectedProvider();
  const { userHubDaos } = useUser();

  const hasDaos = () => {
    return userHubDaos.some((network) => network.data.length);
  };

  const ctaButton = (
    <Button as='a' href='https://3box.io/hub' target='_blank' variant='outline'>
      Edit 3Box Profile
    </Button>
  );

  const test = async (e) => {
    await window?.ethereum?.request({
      id: '1',
      jsonrpc: '2.0',
      method: 'wallet_addEthereumChain',
      params: [MM_ADDCHAIN_DATA[e.target.value]],
    });
  };
  return (
    <MainViewLayout header='Hub' headerEl={address ? ctaButton : null}>
      <Button onClick={test} value='0x4a'>
        Switch Or Add
      </Button>
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
