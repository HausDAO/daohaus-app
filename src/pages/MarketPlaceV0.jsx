import React from 'react';
import { Tabs, Tab, TabList, TabPanel, TabPanels } from '@chakra-ui/react';

import Installed from './Installed';
import Market from './Market';
import MainViewLayout from '../components/mainViewLayout';

const MarketPlaceV0 = () => (
  <MainViewLayout isDao header='Boosts'>
    <Tabs isLazy>
      <TabList borderBottom='none' mb={6}>
        <Tab
          px={6}
          color='white'
          _selected={{
            color: 'white',
            borderBottom: '2px solid white',
          }}
          _hover={{
            color: 'white',
            borderBottom: '2px solid rgba(255,255,255,0.3)',
          }}
          borderBottom='2px solid transparent'
        >
          Installed
        </Tab>
        <Tab
          px={6}
          color='white'
          _selected={{
            color: 'white',
            borderBottom: '2px solid white',
          }}
          _hover={{
            color: 'white',
            borderBottom: '2px solid rgba(255,255,255,0.4)',
          }}
          borderBottom='2px solid transparent'
        >
          Market
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Installed />
        </TabPanel>
        <TabPanel>
          <Market />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </MainViewLayout>
);

export default MarketPlaceV0;
