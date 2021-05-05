import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';
import { createPoll } from '../services/pollService';
import { UberHausMinionService } from '../services/uberHausMinionService';

const SetInitialUberHausDelegate = ({
  uberHausAddress,
  delegateAddress,
  minionAddress,
  refetchAllies,
}) => {
  const [loading, setLoading] = useState(false);
  const { daochain } = useParams();
  const { address, injectedProvider } = useInjectedProvider();
  const { cachePoll, resolvePoll } = useUser();
  const {
    errorToast,
    successToast,
    setGenericModal,
    setTxInfoModal,
  } = useOverlay();
  const { refreshDao } = useTX();

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const poll = createPoll({ action: 'setInitialDelegate', cachePoll })({
        chainID: daochain,
        minionAddress,
        delegateAddress,
        uberHausAddress,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`poll error: ${error}`);
            setLoading(false);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Delegate set submitted.',
            });
            refreshDao();
            refetchAllies();
            resolvePoll(txHash);
            setLoading(false);
          },
        },
      });
      const onTxHash = () => {
        setGenericModal({});
        setTxInfoModal(true);
      };
      await UberHausMinionService({
        web3: injectedProvider,
        uberHausMinion: minionAddress,
        chainID: daochain,
      })('setInitialDelegate')({ address, poll, onTxHash });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <Button
      type='submit'
      loadingText='Submitting'
      isLoading={loading}
      disabled={loading}
      onClick={handleConfirm}
    >
      Confirm Delegate
    </Button>
  );
};

export default SetInitialUberHausDelegate;
