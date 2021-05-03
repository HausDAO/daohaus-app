import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import CustomThemeLaunch from './customThemeLaunch';
import NewMinionForm from '../forms/newMinion';
import NewSuperfluidMinionForm from '../forms/newSuperfluidMinion';
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
import { useTX } from '../contexts/TXContext';
import { useUser } from '../contexts/UserContext';
import { createPoll } from '../services/pollService';
import { WrapNZapFactoryService } from '../services/wrapNZapFactoryService';
import { supportedChains } from '../utils/chain';

const BoostLaunchWrapper = ({ boost }) => {
  const [loading, setLoading] = useState(false);
  const [boostStep, setBoostStep] = useState(1);
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const {
    setGenericModal,
    errorToast,
    successToast,
    setTxInfoModal,
  } = useOverlay();
  const { cachePoll, resolvePoll } = useUser();
  const { daoid, daochain } = useParams();
  const { refetchMetaData } = useMetaData();
  const { refreshDao } = useTX();

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
    const args = [daoid, supportedChains[daochain].wrapper_contract];
    const poll = createPoll({ action: 'wrapNZapSummon', cachePoll })({
      daoID: daoid,
      chainID: daochain,
      actions: {
        onError: (error, txHash) => {
          errorToast({
            title: 'Failed to create Wrap-N-Zap',
          });
          resolvePoll(txHash);
          console.error(`Error creating Wrap-N-Zap: ${error}`);
          setLoading(false);
        },
        onSuccess: txHash => {
          successToast({
            title: 'Wrap-N-Zap added!',
          });
          refreshDao();
          resolvePoll(txHash);
          setBoostStep('success');
          setLoading(false);
        },
      },
    });
    const onTxHash = () => {
      setGenericModal(false);
      setTxInfoModal(true);
    };
    const WNZFactory = WrapNZapFactoryService({
      web3: injectedProvider,
      chainID: daochain,
      factoryAddress: supportedChains[daochain].wrap_n_zap_factory_addr,
    });
    await WNZFactory('create')({
      args,
      address,
      poll,
      onTxHash,
    });
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
      case 'superfluidMinion': {
        return <NewSuperfluidMinionForm />;
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
