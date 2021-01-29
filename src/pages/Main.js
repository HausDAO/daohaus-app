import React from 'react';
import { Flex, Box } from '@chakra-ui/react';

import NewsFeed from '../components/newsFeed';
import NetworkList from '../components/networkList';
import HubProfileCard from '../components/hubProfileCard';

const Main = () => {
  return (
    <Flex wrap='wrap'>
      <Box
        w={['100%', null, null, null, '60%']}
        pr={[0, null, null, null, 6]}
        pb={6}
      >
        <HubProfileCard />
        <NetworkList />
        <NewsFeed />
      </Box>
    </Flex>
  );
};

export default Main;
