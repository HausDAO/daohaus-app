import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';

import CustomThemeLaunch from './customThemeLaunch';
import NewMinionForm from '../forms/newMinion';
import NotificationsLaunch from './notificationsLaunch';
import ProposalTypesLaunch from './ProposalTypesLaunch';
import { useParams } from 'react-router-dom';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { boostPost } from '../utils/metadata';
import { useMetaData } from '../contexts/MetaDataContext';
import DiscourseLaunch from './discourseLaunch';
import NewMinionSafe from './newMinionSafe';

const BoostLaunchWrapper = ({ boost }) => {
  const [loading, setLoading] = useState(false);
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { daoid } = useParams();
  const { refetchMetaData } = useMetaData();

  const renderBoostBody = () => {
    switch (boost.key) {
      case 'customTheme': {
        return (
          <CustomThemeLaunch
            handleLaunch={handleLaunch}
            loading={loading}
            setLoading={setLoading}
          />
        );
      }
      case 'vanillaMinion': {
        return <NewMinionForm />;
      }
      case 'minionSafe': {
        return <NewMinionSafe />;
      }
      case 'discourse': {
        return (
          <DiscourseLaunch
            handleLaunch={handleLaunch}
            loading={loading}
            setLoading={setLoading}
          />
        );
      }
      case 'notificationsLevel1': {
        return (
          <NotificationsLaunch
            handleLaunch={handleLaunch}
            loading={loading}
            setLoading={setLoading}
          />
        );
      }
      case 'proposalTypes': {
        return (
          <ProposalTypesLaunch
            handleLaunch={handleLaunch}
            loading={loading}
            setLoading={setLoading}
          />
        );
      }
      default: {
        return null;
      }
    }
  };

  const handleLaunch = async (boostMetadata) => {
    setLoading(true);

    try {
      const messageHash = injectedProvider.utils.sha3(daoid);
      const signature = await injectedProvider.eth.personal.sign(
        messageHash,
        address,
      );

      const updateThemeObject = {
        contractAddress: daoid,
        boostKey: boost.key,
        metadata: boostMetadata,
        network: injectedChain.network,
        signature,
      };

      const result = await boostPost('dao/boost', updateThemeObject);

      if (result === 'success') {
        refetchMetaData();
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        alert('forbidden, are you an active dao member?');
        return false;
      }
    } catch (err) {
      console.log('err', err);
      setLoading(false);
      return false;
    }
  };

  return <Box w='90%'>{renderBoostBody()}</Box>;
};

export default BoostLaunchWrapper;
