import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import CustomThemeLaunch from './customThemeLaunch';
import NewMinionForm from '../forms/newMinion';
import NotificationsLaunch from './notificationsLaunch';
import ProposalTypesLaunch from './proposalTypesLaunch';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { boostPost } from '../utils/metadata';
import { useMetaData } from '../contexts/MetaDataContext';
import DiscourseLaunch from './discourseLaunch';
import NewMinionSafe from './newMinionSafe';
import GenericBoostLaunch from './genericBoostLaunch';
import SnapshotLaunch from './snapshotLaunch';
import { useOverlay } from '../contexts/OverlayContext';

const BoostLaunchWrapper = ({ boost }) => {
  const [loading, setLoading] = useState(false);
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { setGenericModal } = useOverlay();
  const { daoid } = useParams();
  const { refetchMetaData } = useMetaData();

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
      }
      setLoading(false);
      setGenericModal({ 'boostErrorModal': true });
      return false;
    } catch (err) {
      console.log('err', err);
      setLoading(false);
      return false;
    }
  };

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
      case 'mintGate': {
        return (
          <GenericBoostLaunch
            boostName='MintGate'
            boostBody="Activate MintGate's powerful gates and unlock collaboration potential across shareholders."
            boostInstructions='These are the instructions after activate'
            boostCTA="It's gating time!"
            boostLink='/links'
            handleLaunch={handleLaunch}
            loading={loading}
            setLoading={setLoading}
          />
        );
      }
      case 'snapshot': {
        return (
          <SnapshotLaunch
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

  return <Box w='90%'>{renderBoostBody()}</Box>;
};

export default BoostLaunchWrapper;
