import React, { useState } from 'react';
import { Button, Flex, Spinner, Tooltip } from '@chakra-ui/react';
import { RiQuestionLine } from 'react-icons/ri';
import { useParams } from 'react-router';

import { useOverlay } from '../contexts/OverlayContext';
import { useTX } from '../contexts/TXContext';
import { useDaoMember } from '../contexts/DaoMemberContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { isDelegating, daoConnectedAndSameChain } from '../utils/general';
import { TX } from '../data/contractTX';

const SyncTokenButton = ({ token }) => {
  const { errorToast } = useOverlay();
  const { submitTransaction } = useTX();
  const { daoMember, delegate } = useDaoMember();
  const { address, injectedChain } = useInjectedProvider();
  const { daochain } = useParams();
  const [loading, setLoading] = useState(false);

  const canSync = !isDelegating(daoMember) || delegate;

  const handleSync = async () => {
    setLoading(true);

    if (!token) {
      setLoading(false);
      errorToast({
        title: 'There was an error.',
      });
    }

    await submitTransaction({
      tx: TX.COLLECT_TOKENS,
      args: [token.tokenAddress],
    });

    setLoading(false);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Flex>
      {daoConnectedAndSameChain(address, daochain, injectedChain?.chainId) &&
      canSync ? (
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
  );
};

export default SyncTokenButton;
