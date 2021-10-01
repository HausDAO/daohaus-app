import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { useTX } from '../contexts/TXContext';
import CustomThemeLaunch from './customThemeLaunch';
import DiscourseLaunch from './discourseLaunch';
import GenericBoostLaunch from './genericBoostLaunch';
import NewMinionForm from '../forms/newMinionForm';
import NewSuperfluidMinionForm from '../forms/newSuperfluidMinion';
import NotificationsLaunch from './notificationsLaunch';
import ProposalTypesLaunch from './proposalTypesLaunch';
import SnapshotLaunch from './snapshotLaunch';
import { TX } from '../data/contractTX';
import { boostPost } from '../utils/metadata';
import { supportedChains } from '../utils/chain';

const BoostLaunchWrapper = ({ boost }) => {
  const [loading, setLoading] = useState(false);
  const [boostStep, setBoostStep] = useState(1);
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { setGenericModal } = useOverlay();
  const { daoid, daochain } = useParams();
  const { refetchMetaData } = useMetaData();
  const { submitTransaction } = useTX();

  const handleLaunch = async boostMetadata => {
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
      setGenericModal({ boostErrorModal: true });
      return false;
    } catch (err) {
      console.log('err', err);
      setLoading(false);
      return false;
    }
  };

  const handleWrapNZapLaunch = async () => {
    setLoading(true);
    await submitTransaction({
      args: [daoid, supportedChains[daochain].wrapper_contract],
      tx: TX.CREATE_WRAP_N_ZAP,
      localValues: {
        contractAddress: supportedChains[daochain].wrap_n_zap_factory_addr,
      },
    });
    setLoading(false);
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
        return <NewMinionForm minionType='vanilla minion' />;
      }
      case 'neapolitanMinion': {
        return <NewMinionForm minionType='Neapolitan minion' />;
      }
      case 'superfluidMinion': {
        return <NewSuperfluidMinionForm />;
      }
      case 'niftyMinion': {
        return <NewMinionForm minionType='nifty minion' />;
      }
      // case 'discourse': {
      case 'DISCOURSE': {
        return (
          <DiscourseLaunch
            handleLaunch={handleLaunch}
            loading={loading}
            setLoading={setLoading}
          />
        );
      }
      // case 'notificationsLevel1': {
      case 'DISCORD': {
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
      // case 'mintGate': {
      case 'MINTGATE': {
        return (
          <GenericBoostLaunch
            boostName='MintGate'
            boostBody="Activate MintGate's powerful gates and unlock collaboration potential across shareholders."
            boostInstructions='These are the instructions after activate'
            boostCTA="It's gating time!"
            boostLink='boost/mintgate'
            boostStep={boostStep}
            setBoostStep={setBoostStep}
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
            space={boost?.metadata?.space}
            setLoading={setLoading}
          />
        );
      }
      case 'wrapNZap': {
        return (
          <GenericBoostLaunch
            boostName='Wrap-N-Zap'
            boostBody={`Allow users to send native ${supportedChains[daochain].nativeCurrency} that will be wrapped and zapped to the DAO.`}
            boostInstructions='Get started zapping now!'
            boostCTA="It's zapping time!"
            boostLink='settings'
            boostStep={boostStep}
            setBoostStep={setBoostStep}
            handleLaunch={handleWrapNZapLaunch}
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
