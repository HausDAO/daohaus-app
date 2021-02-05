import React, { useState } from 'react';
import { Button, Flex, Spinner, Tooltip } from '@chakra-ui/react';

// import {
//   useDao,
//   useTxProcessor,
//   useUser,
// } from '../../../contexts/PokemolContext';
import { RiQuestionLine } from 'react-icons/ri';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useDao } from '../contexts/DaoContext';
import { useTX } from '../contexts/TXContext';
import { useUser } from '../contexts/UserContext';
import { useParams } from 'react-router-dom';
import { createPoll } from '../services/pollService';
import { MolochService } from '../services/molochService';

const SyncTokenButton = ({ token }) => {
  const { injectedProvider, address } = useInjectedProvider();
  const { errorToast, successToast } = useOverlay();
  const { daoOverview } = useDao();
  const { refreshDao } = useTX();
  const { cachePoll, resolvePoll } = useUser();
  const { daoid, daochain } = useParams();

  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);

    if (!token) {
      setLoading(false);
      errorToast({
        title: `There was an error.`,
        // description: error?.message || '',
      });
    }

    try {
      const poll = createPoll({ action: 'collectTokens', cachePoll })({
        token,
        chainID: daochain,
        daoID: daoid,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: `There was an error.`,
              description: error?.message || '',
            });
            resolvePoll(txHash);
            setLoading(false);
            console.error(
              `Could not find a matching proposal: ${error?.message}`,
            );
          },
          onSuccess: (txHash) => {
            successToast({
              title: 'Synced Token!',
            });
            refreshDao();
            setLoading(false);
            resolvePoll(txHash);
          },
        },
      });

      const args = [token.tokenAddress];

      await MolochService({
        web3: injectedProvider,
        daoAddress: daoid,
        chainID: daochain,
        version: daoOverview.version,
      })('collectTokens')({ args, address, poll });
    } catch (err) {
      setLoading(false);
      console.error('error: ', err);
      errorToast({
        title: `There was an error.`,
        description: err?.message || '',
      });
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Flex>
          <Tooltip
            hasArrow
            shouldWrapChildren
            placement='top'
            label='Looks like some funds were sent directly to the DAO. Sync to update
            the balance.'
          >
            <Button onClick={handleSync} rightIcon={<RiQuestionLine />}>
              Sync
            </Button>
          </Tooltip>
        </Flex>
      )}
    </>
  );
};

export default SyncTokenButton;
