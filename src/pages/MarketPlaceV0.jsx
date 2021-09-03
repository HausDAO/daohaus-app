import React from 'react';
import { Tabs, Tab, TabList, TabPanel, TabPanels } from '@chakra-ui/react';

import { useHistory, useParams } from 'react-router';
import Installed from './Installed';
import Market from './Market';
import MainViewLayout from '../components/mainViewLayout';
import { useFormModal, useOverlay } from '../contexts/OverlayContext';
import BoostDetails from '../components/boostDetails';
import { getSettingsLink } from '../utils/marketplace';

const MarketPlaceV0 = () => {
  const { errorToast } = useOverlay();
  const { openFormModal } = useFormModal();
  const params = useParams();
  const history = useHistory();

  const installBoost = boost => openFormModal({ boost });
  const openDetails = (boost, canRestore) => {
    openFormModal({
      body: (
        <BoostDetails
          content={boost.boostContent}
          isAvailable={boost.isAvailable}
          canRestore={canRestore}
        />
      ),
    });
  };
  const goToSettings = boost => {
    if (boost.settings.type === 'internalLink') {
      history.push(getSettingsLink(boost.settings, params));
    } else {
      errorToast({ title: 'Did not recieve a valid settings value' });
    }
  };
  return (
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
            <Installed
              installBoost={installBoost}
              openDetails={openDetails}
              goToSettings={goToSettings}
            />
          </TabPanel>
          <TabPanel>
            <Market
              installBoost={installBoost}
              openDetails={openDetails}
              goToSettings={goToSettings}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MainViewLayout>
  );
};

export default MarketPlaceV0;
