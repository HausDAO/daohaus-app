import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Tabs, Tab, TabList, TabPanel, TabPanels } from '@chakra-ui/react';

import { useOverlay } from '../contexts/OverlayContext';
import { useAppModal } from '../hooks/useModals';
import BoostDetails from '../components/boostDetails';
import Installed from './Installed';
import MainViewLayout from '../components/mainViewLayout';
import Market from './Market';
import { getSettingsLink } from '../utils/marketplace';

const MarketPlaceV0 = () => {
  const { errorToast } = useOverlay();
  const { genericModal, boostModal } = useAppModal();
  const params = useParams();
  const history = useHistory();

  const installBoost = boost => boostModal(boost);
  const openDetails = boost =>
    genericModal({
      title: boost.boostContent.title,
      subtitle: 'Boost Details',
      body: <BoostDetails {...boost} />,
    });

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
