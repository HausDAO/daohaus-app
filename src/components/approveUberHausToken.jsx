import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Button } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useUser } from '../contexts/UserContext';
import { createPoll } from '../services/pollService';
import { UberHausMinionService } from '../services/uberHausMinionService';
import { UBERHAUS_DATA } from '../utils/uberhaus';

const ApproveUberHausToken = ({
  minionAddress,
  minionBalance,
  setShouldFetch,
}) => {
  const { daochain } = useParams();
  const { cachePoll, resolvePoll } = useUser();
  const { address, injectedProvider } = useInjectedProvider();
  const {
    errorToast,
    successToast,
    setGenericModal,
    setTxInfoModal,
  } = useOverlay();
  const [loading, setLoading] = useState(false);

  const unlock = async () => {
    setLoading(true);

    try {
      const poll = createPoll({ action: 'approveUberHaus', cachePoll })({
        chainID: daochain,
        minionAddress,
        uberHausAddress: UBERHAUS_DATA.ADDRESS,
        daoID: UBERHAUS_DATA.ADDRESS,
        tokenAddress: UBERHAUS_DATA.STAKING_TOKEN,
        userAddress: minionAddress,
        unlockAmount: minionBalance,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`poll error: ${error}`);
            setShouldFetch(true);
            setLoading(false);
          },
          onSuccess: txHash => {
            successToast({
              title: 'HAUS unlocked.',
            });
            resolvePoll(txHash);
            setShouldFetch(true);
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
      })('approveUberHaus')({ address, poll, onTxHash });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <>
      <Button
        onClick={unlock}
        loadingText='Submitting'
        isLoading={loading}
        disabled={loading}
        mb={4}
      >
        Unlock HAUS
      </Button>
    </>
  );
};

export default ApproveUberHausToken;
