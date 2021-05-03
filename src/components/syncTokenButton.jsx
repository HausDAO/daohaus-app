import React, { useState } from 'react';
import { Button, Flex, Spinner, Tooltip } from '@chakra-ui/react';
import { RiQuestionLine } from 'react-icons/ri';
import { useParams } from 'react-router-dom';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useDao } from '../contexts/DaoContext';
import { useTX } from '../contexts/TXContext';
import { useUser } from '../contexts/UserContext';
import { createPoll } from '../services/pollService';
import { MolochService } from '../services/molochService';
import { useDaoMember } from '../contexts/DaoMemberContext';
import { isDelegating } from '../utils/general';

const SyncTokenButton = ({ token }) => {
  const { injectedProvider, address, injectedChain } = useInjectedProvider();
  const { errorToast, successToast } = useOverlay();
  const { daoOverview } = useDao();
  const { refreshDao } = useTX();
  const { daoMember, delegate } = useDaoMember();
  const { cachePoll, resolvePoll } = useUser();
  const { daoid, daochain } = useParams();
  const [loading, setLoading] = useState(false);

  const daoConnectedAndSameChain = () => {
    return address && daochain && injectedChain?.chainId === daochain;
  };

  const canSync = !isDelegating(daoMember) || delegate;

  const handleSync = async () => {
    setLoading(true);

    if (!token) {
      setLoading(false);
      errorToast({
        title: 'There was an error.',
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
              title: 'There was an error.',
              description: error?.message || '',
            });
            resolvePoll(txHash);
            setLoading(false);
            console.error(
              `Could not find a matching proposal: ${error?.message}`,
            );
          },
          onSuccess: txHash => {
            successToast({
              title: 'Synced Token!',
            });
            sessionStorage.removeItem('AllTokens');
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
        title: 'There was an error.',
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
          {daoConnectedAndSameChain() && canSync ? (
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
          ) : (
            <Tooltip
              hasArrow
              shouldWrapChildren
              placement='bottom'
              label='Unable to sync token. Check that you are connected to correct network. Note, members who have delegated their voting power cannot sync tokens'
              bg='secondary.500'
            >
              <Button disabled>Sync</Button>
            </Tooltip>
          )}
        </Flex>
      )}
    </>
  );
};

export default SyncTokenButton;
